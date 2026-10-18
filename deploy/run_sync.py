#!/usr/bin/env python3
"""Pull latest main on VPS, build, restart firstview service."""
from __future__ import annotations

import os
import pathlib
import sys
import time

import paramiko

ROOT = pathlib.Path(__file__).resolve().parents[1]
ENV_FILE = ROOT / ".env.deploy"
LOCAL_SCRIPT = pathlib.Path(__file__).with_name("vps-sync.sh")
REMOTE_SCRIPT = "/tmp/firstview-sync.sh"


def load_env() -> dict[str, str]:
    data: dict[str, str] = {}
    if ENV_FILE.exists():
        for line in ENV_FILE.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            data[k.strip()] = v.strip()
    # Fallbacks from environment
    data.setdefault("VPS_HOST", os.getenv("VPS_HOST", "192.168.1.152"))
    data.setdefault("VPS_USER", os.getenv("VPS_USER", "root"))
    data.setdefault("VPS_PASSWORD", os.getenv("VPS_PASSWORD", ""))
    return data


def main() -> int:
    env = load_env()
    if not env.get("VPS_PASSWORD"):
        print("Missing VPS_PASSWORD in .env.deploy", file=sys.stderr)
        return 1

    script = LOCAL_SCRIPT.read_bytes().replace(b"\r\n", b"\n")
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(
        env["VPS_HOST"],
        username=env["VPS_USER"],
        password=env["VPS_PASSWORD"],
        timeout=30,
        banner_timeout=30,
    )

    sftp = client.open_sftp()
    with sftp.file(REMOTE_SCRIPT, "wb") as f:
        f.write(script)
    sftp.chmod(REMOTE_SCRIPT, 0o755)
    sftp.close()
    print(f"uploaded {REMOTE_SCRIPT}", flush=True)

    transport = client.get_transport()
    assert transport is not None
    channel = transport.open_session()
    channel.get_pty()
    channel.set_combine_stderr(True)
    channel.exec_command(f"bash {REMOTE_SCRIPT}")

    while True:
        if channel.recv_ready():
            data = channel.recv(8192)
            sys.stdout.buffer.write(data)
            sys.stdout.buffer.flush()
        elif channel.exit_status_ready():
            while channel.recv_ready():
                sys.stdout.buffer.write(channel.recv(8192))
            break
        else:
            time.sleep(0.1)

    code = channel.recv_exit_status()
    client.close()
    print(f"\nexit_code={code}", flush=True)
    return code


if __name__ == "__main__":
    raise SystemExit(main())
