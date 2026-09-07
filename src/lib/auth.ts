import { auth as clerkAuth, clerkClient } from "@clerk/nextjs/server";

export type Plan = "free" | "pro" | "premium";

export type AuthContext = {
  userId: string;
  plan: Plan;
  freeUsage: number;
};

export class AuthenticationError extends Error {
  constructor(message = "Authentication required") {
    super(message);
    this.name = "AuthenticationError";
  }
}

export async function getAuthContext(): Promise<AuthContext> {
  const { userId, has } = await clerkAuth();

  if (!userId) {
    throw new AuthenticationError();
  }

  const isPremium = has({ plan: "premium" });
  const isPro = has({ plan: "pro" });

  const plan: Plan = isPremium
    ? "premium"
    : isPro
      ? "pro"
      : "free";

  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  const storedUsage = user.privateMetadata.free_usage;

  const freeUsage =
    plan === "free"
      ? Number(storedUsage) || 0
      : 0;

  return {
    userId,
    plan,
    freeUsage,
  };
}

export function canUsePlan(
  currentPlan: Plan,
  requiredPlan: Plan
) {
  const planRank: Record<Plan, number> = {
    free: 0,
    pro: 1,
    premium: 2,
  };

  return planRank[currentPlan] >= planRank[requiredPlan];
}