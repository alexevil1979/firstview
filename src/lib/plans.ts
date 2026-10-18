import type { Plan } from "@/types";

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    description: "Для знакомства с продуктом",
    features: [
      "До 10 ссылок за проход",
      "5 проходов в день",
      "Базовая скорость",
      "История 7 дней",
    ],
    limits: {
      linksPerWalk: 10,
      walksPerDay: 5,
      walksPerMonth: 50,
      historyDays: 7,
      maxSpeed: 1,
      export: false,
      api: false,
    },
  },
  {
    id: "pro",
    name: "Pro",
    price: 1490,
    description: "Для регулярной работы со списками",
    features: [
      "До 100 ссылок за проход",
      "50 проходов в день",
      "Настраиваемая скорость",
      "История 90 дней",
      "Экспорт результатов",
      "Приоритетная поддержка",
    ],
    limits: {
      linksPerWalk: 100,
      walksPerDay: 50,
      walksPerMonth: 1000,
      historyDays: 90,
      maxSpeed: 3,
      export: true,
      api: false,
    },
    highlighted: true,
  },
  {
    id: "business",
    name: "Business",
    price: 4990,
    description: "Для команд и интеграций",
    features: [
      "До 1000 ссылок за проход",
      "Безлимит проходов",
      "Максимальная скорость",
      "История без ограничений",
      "Экспорт и отчёты",
      "API-доступ",
      "Выделенный менеджер",
    ],
    limits: {
      linksPerWalk: 1000,
      walksPerDay: 9999,
      walksPerMonth: 99999,
      historyDays: 3650,
      maxSpeed: 5,
      export: true,
      api: true,
    },
  },
];

export function getPlan(id: string) {
  return PLANS.find((p) => p.id === id) ?? PLANS[0];
}
