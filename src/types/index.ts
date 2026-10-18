export type PlanId = "free" | "pro" | "business";
export type UserRole = "user" | "admin";
export type UserStatus = "active" | "blocked";
export type SubscriptionStatus = "active" | "canceled" | "past_due" | "trialing";
export type PaymentStatus = "succeeded" | "failed" | "refunded" | "pending";
export type WalkStatus = "running" | "paused" | "completed" | "stopped" | "failed";

export interface Plan {
  id: PlanId;
  name: string;
  price: number;
  description: string;
  features: string[];
  limits: {
    linksPerWalk: number;
    walksPerDay: number;
    walksPerMonth: number;
    historyDays: number;
    maxSpeed: number;
    export: boolean;
    api: boolean;
  };
  highlighted?: boolean;
  archived?: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  planId: PlanId;
  createdAt: string;
  lastActiveAt: string;
  country?: string;
  walksCount: number;
  linksProcessed: number;
}

export interface Subscription {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  planId: PlanId;
  status: SubscriptionStatus;
  startedAt: string;
  expiresAt: string;
  amount: number;
}

export interface Payment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  planId: PlanId;
  amount: number;
  status: PaymentStatus;
  createdAt: string;
  stripeId: string;
}

export interface WalkLogEntry {
  id: string;
  url: string;
  status: "pending" | "loading" | "success" | "error" | "skipped";
  message: string;
  durationMs?: number;
  timestamp: string;
}

export interface WalkSession {
  id: string;
  userId: string;
  urls: string[];
  status: WalkStatus;
  startedAt: string;
  finishedAt?: string;
  currentIndex: number;
  speed: number;
  avgDurationMs: number;
  successCount: number;
  errorCount: number;
  logs: WalkLogEntry[];
}

export interface PromoCode {
  id: string;
  code: string;
  discountPercent: number;
  maxUses: number;
  used: number;
  active: boolean;
  expiresAt: string;
}

export interface UserActivity {
  id: string;
  userId: string;
  action: string;
  meta?: string;
  createdAt: string;
}
