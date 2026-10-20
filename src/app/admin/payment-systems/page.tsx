"use client";

import { useMemo, useState } from "react";
import { Building2, ChevronDown, ChevronUp, Save } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getGatewayFields,
  isInternalGateway,
  type GatewayField,
  type PaymentGatewayDef,
} from "@/lib/payment-gateways";
import { usePaymentGatewaysStore } from "@/stores/payment-gateways-store";
import { cn } from "@/lib/utils";

type FilterType = "all" | "payment" | "internal" | "enabled" | "disabled";

function FieldControl({
  field,
  value,
  onChange,
}: {
  field: GatewayField;
  value: string | number | boolean | undefined;
  onChange: (v: string | number | boolean) => void;
}) {
  if (field.type === "placeholder") {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-3 py-2 font-mono text-xs break-all dark:border-zinc-700 dark:bg-zinc-900">
        {String(field.defaultValue ?? value ?? "")}
      </div>
    );
  }

  if (field.type === "toggle") {
    const checked = Boolean(value ?? field.defaultValue ?? false);
    return (
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          className="accent-teal-600 h-4 w-4"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        {checked ? "Вкл." : "Выкл."}
      </label>
    );
  }

  if (field.type === "select") {
    return (
      <select
        className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm dark:border-zinc-800 dark:bg-zinc-950"
        value={String(value ?? field.defaultValue ?? "")}
        onChange={(e) => onChange(e.target.value)}
      >
        {(field.options ?? []).map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "textarea") {
    return (
      <Textarea
        value={String(value ?? field.defaultValue ?? "")}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        className="min-h-[100px] font-mono text-xs"
      />
    );
  }

  return (
    <Input
      type={
        field.type === "password"
          ? "password"
          : field.type === "number"
            ? "number"
            : "text"
      }
      value={String(value ?? field.defaultValue ?? "")}
      onChange={(e) =>
        onChange(
          field.type === "number" ? Number(e.target.value) : e.target.value,
        )
      }
      placeholder={field.placeholder}
    />
  );
}

function GatewayEditor({
  gateway,
  onClose,
}: {
  gateway: PaymentGatewayDef;
  onClose: () => void;
}) {
  const updateGateway = usePaymentGatewaysStore((s) => s.updateGateway);
  const setConfigValue = usePaymentGatewaysStore((s) => s.setConfigValue);
  const fields = getGatewayFields(gateway.code);

  const [draft, setDraft] = useState({
    name: gateway.name,
    enabled: gateway.enabled,
    testMode: gateway.testMode,
    minAmountRub: gateway.minAmountRub,
    extraCommissionPercent: gateway.extraCommissionPercent,
    cnFriendly: gateway.cnFriendly,
    boostyPageSlug: gateway.boostyPageSlug ?? "",
    boostyTelegramChatId: gateway.boostyTelegramChatId ?? "",
    boostyDescriptionForUsers: gateway.boostyDescriptionForUsers ?? "",
  });

  const save = () => {
    updateGateway(gateway.code, {
      name: draft.name,
      enabled: draft.enabled,
      testMode: draft.testMode,
      minAmountRub: draft.minAmountRub,
      extraCommissionPercent: draft.extraCommissionPercent,
      cnFriendly: draft.cnFriendly,
      boostyPageSlug: draft.boostyPageSlug,
      boostyTelegramChatId: draft.boostyTelegramChatId,
      boostyDescriptionForUsers: draft.boostyDescriptionForUsers,
    });
    toast.success(`Шлюз «${gateway.code}» сохранён`);
    onClose();
  };

  return (
    <Card className="border-teal-500/30">
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div>
          <CardTitle className="font-mono text-base">{gateway.code}</CardTitle>
          <p className="mt-1 text-sm text-zinc-500">{gateway.name}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Закрыть
        </Button>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-500">
              Код
            </label>
            <Input value={gateway.code} disabled />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-500">
              Имя
            </label>
            <Input
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="accent-teal-600 h-4 w-4"
              checked={draft.enabled}
              onChange={(e) =>
                setDraft({ ...draft, enabled: e.target.checked })
              }
            />
            Включён
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="accent-teal-600 h-4 w-4"
              checked={draft.testMode}
              onChange={(e) =>
                setDraft({ ...draft, testMode: e.target.checked })
              }
            />
            Тестовый режим
          </label>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-500">
              Минимальная сумма (RUB)
            </label>
            <Input
              type="number"
              min={0}
              step={0.01}
              value={draft.minAmountRub}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  minAmountRub: Number(e.target.value) || 0,
                })
              }
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-500">
              Доп. комиссия (%)
            </label>
            <Input
              type="number"
              min={0}
              max={100}
              step={0.01}
              value={draft.extraCommissionPercent}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  extraCommissionPercent: Number(e.target.value) || 0,
                })
              }
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-zinc-500">
              CN-friendly
            </label>
            <select
              className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm dark:border-zinc-800 dark:bg-zinc-950"
              value={draft.cnFriendly}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  cnFriendly: e.target.value as "" | "0" | "1",
                })
              }
            >
              <option value="">Авто</option>
              <option value="1">Да</option>
              <option value="0">Нет</option>
            </select>
            <p className="mt-1 text-xs text-zinc-500">
              Подходит для пользователей из материкового Китая (крипто / без
              иностранной карты).
            </p>
          </div>
        </div>

        {isInternalGateway(gateway.code) && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-800 dark:text-amber-200">
            Внутренняя интеграция — не показывается клиентам как способ оплаты.
          </div>
        )}

        <div className="space-y-4 border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <h3 className="text-sm font-semibold">Настройки шлюза</h3>
          {fields.map((field) => {
            const isBoostyTop =
              gateway.code === "boosty" &&
              field.key.startsWith("boosty_");
            const rawValue = isBoostyTop
              ? draft[field.key as keyof typeof draft]
              : gateway.config[field.key];

            return (
              <div key={field.key}>
                <label className="mb-1.5 block text-xs font-medium text-zinc-500">
                  {field.label}
                  {field.suffix ? ` (${field.suffix})` : ""}
                </label>
                <FieldControl
                  field={field}
                  value={
                    field.type === "placeholder"
                      ? field.defaultValue
                      : (rawValue as string | number | boolean | undefined)
                  }
                  onChange={(v) => {
                    if (isBoostyTop) {
                      setDraft({ ...draft, [field.key]: v } as typeof draft);
                      return;
                    }
                    if (field.type === "placeholder") return;
                    setConfigValue(gateway.code, field.key, v);
                  }}
                />
                {field.help && (
                  <p className="mt-1 text-xs text-zinc-500">{field.help}</p>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={save}>
            <Save className="h-4 w-4" />
            Сохранить
          </Button>
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminPaymentSystemsPage() {
  const gateways = usePaymentGatewaysStore((s) => s.gateways);
  const setEnabled = usePaymentGatewaysStore((s) => s.setEnabled);
  const setTestMode = usePaymentGatewaysStore((s) => s.setTestMode);
  const bulkEnable = usePaymentGatewaysStore((s) => s.bulkEnable);
  const resetDefaults = usePaymentGatewaysStore((s) => s.resetDefaults);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [selected, setSelected] = useState<string[]>([]);
  const [editingCode, setEditingCode] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return gateways.filter((g) => {
      const q = query.toLowerCase();
      const matchQ =
        !q ||
        g.code.toLowerCase().includes(q) ||
        g.name.toLowerCase().includes(q);
      if (!matchQ) return false;
      if (filter === "enabled") return g.enabled;
      if (filter === "disabled") return !g.enabled;
      if (filter === "internal") return isInternalGateway(g.code);
      if (filter === "payment") return !isInternalGateway(g.code);
      return true;
    });
  }, [gateways, query, filter]);

  const editing = editingCode
    ? gateways.find((g) => g.code === editingCode)
    : null;

  const toggleSelect = (code: string) => {
    setSelected((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            <Building2 className="h-7 w-7 text-teal-600" />
            Платёжные системы
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Те же шлюзы и настройки, что в fullvpnservice: Overpay, FreeKassa,
            FriendlyPay, BetaTransfer, NOWPayments, Exnode, Bybit, Stripe и др.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            resetDefaults();
            toast.message("Сброшено к значениям по умолчанию");
          }}
        >
          Сбросить
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Поиск по коду или имени"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-xs"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as FilterType)}
          className="h-11 rounded-xl border border-zinc-200 bg-white px-3 text-sm dark:border-zinc-800 dark:bg-zinc-950"
        >
          <option value="all">Все</option>
          <option value="payment">Платежные</option>
          <option value="internal">Внутренние</option>
          <option value="enabled">Включённые</option>
          <option value="disabled">Выключенные</option>
        </select>
        {selected.length > 0 && (
          <>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                bulkEnable(selected, true);
                toast.success(`Включено: ${selected.length}`);
                setSelected([]);
              }}
            >
              Включить выбранные ({selected.length})
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                bulkEnable(selected, false);
                toast.message(`Выключено: ${selected.length}`);
                setSelected([]);
              }}
            >
              Выключить выбранные
            </Button>
          </>
        )}
      </div>

      {editing && (
        <GatewayEditor
          key={editing.code}
          gateway={editing}
          onClose={() => setEditingCode(null)}
        />
      )}

      <div className="overflow-hidden rounded-2xl border border-zinc-200/80 dark:border-zinc-800">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead className="bg-zinc-100 text-xs uppercase text-zinc-500 dark:bg-zinc-900">
              <tr>
                <th className="px-3 py-3 w-10" />
                <th className="px-4 py-3">Код</th>
                <th className="px-4 py-3">Имя</th>
                <th className="px-4 py-3">Вкл.</th>
                <th className="px-4 py-3">Тест</th>
                <th className="px-4 py-3">От суммы</th>
                <th className="px-4 py-3">Комиссия</th>
                <th className="px-4 py-3">Тип</th>
                <th className="px-4 py-3">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((g) => {
                const open = editingCode === g.code;
                return (
                  <tr
                    key={g.code}
                    className={cn(
                      "border-t border-zinc-200/80 dark:border-zinc-800",
                      open && "bg-teal-500/5",
                    )}
                  >
                    <td className="px-3 py-3">
                      <input
                        type="checkbox"
                        className="accent-teal-600"
                        checked={selected.includes(g.code)}
                        onChange={() => toggleSelect(g.code)}
                      />
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">{g.code}</td>
                    <td className="px-4 py-3 font-medium">{g.name}</td>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        className="accent-teal-600 h-4 w-4"
                        checked={g.enabled}
                        onChange={(e) => setEnabled(g.code, e.target.checked)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        className="accent-teal-600 h-4 w-4"
                        checked={g.testMode}
                        onChange={(e) => setTestMode(g.code, e.target.checked)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      {g.minAmountRub.toFixed(2)} RUB
                    </td>
                    <td className="px-4 py-3">
                      {g.extraCommissionPercent.toFixed(2)}%
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          isInternalGateway(g.code) ? "warning" : "secondary"
                        }
                      >
                        {isInternalGateway(g.code) ? "internal" : "payment"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        size="sm"
                        variant={open ? "secondary" : "outline"}
                        onClick={() =>
                          setEditingCode(open ? null : g.code)
                        }
                      >
                        {open ? (
                          <>
                            <ChevronUp className="h-4 w-4" /> Свернуть
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4" /> Настроить
                          </>
                        )}
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-10 text-center text-zinc-500"
                  >
                    Ничего не найдено
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
