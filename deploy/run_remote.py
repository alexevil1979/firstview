#!/usr/bin/env python3
from __future__ import annotations

import pathlib
import sys
import time

import paramiko

HOST = "192.168.1.152"
USER = "root"
PASSWORD = "qweasd333123"
LOCAL_SCRIPT = pathlib.Path(__file__).with_name("vps-deploy.sh")
REMOTE_SCRIPT = "/tmp/firstview-deploy.sh"


def main() -> int:
    script = LOCAL_SCRIPT.read_bytes().replace(b"\r\n", b"\n")
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(HOST, username=USER, password=PASSWORD, timeout=30, banner_timeout=30)

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
            if not data:
                break
            text = data.decode("utf-8", errors="replace")
            sys.stdout.buffer.write(text.encode("utf-8", errors="replace"))
            sys.stdout.buffer.flush()
        elif channel.exit_status_ready():
            # flush remaining
            while channel.recv_ready():
                data = channel.recv(8192)
                text = data.decode("utf-8", errors="replace")
                sys.stdout.buffer.write(text.encode("utf-8", errors="replace"))
            break
        else:
            time.sleep(0.1)

    code = channel.recv_exit_status()
    client.close()
    print(f"\nexit_code={code}", flush=True)
    return code


if __name__ == "__main__":
    raise SystemExit(main())
