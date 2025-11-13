import { StripePlan } from "@better-auth/stripe"

export type PlanProps = "free" | "hobby" | "developer" | "team"
export type MetricProps = "databases" | "buckets" | "applications" | "agentic_calls"

export const stripePlanNames: PlanProps[] = ["free", "hobby", "developer", "team"]

export const usageMetrics: MetricProps[] = [
  "databases", "buckets", "applications", "agentic_calls"
]

export const cyclableMetrics: MetricProps[] = [
  "agentic_calls"
]

export const userLimits = {
  free: {
    databases: 1,
    buckets: 5,
    applications: 3,
    agentic_calls: 5
  },
  hobby: {
    databases: 20, 
    buckets: 100,
    applications: 50,
    agentic_calls: 100
  },
  developer: {
    databases: 50, 
    buckets: 500,
    applications: 250,
    agentic_calls: 500
  },
  team: {
    databases: 100,
    buckets: 1000,
    applications: 500,
    agentic_calls: 1000
  }
}

const planRank = stripePlanNames.reduce((obj, current, idx) => {
  obj[current] = idx + 1
  return obj
}, {} as Record<PlanProps, number>)

export const priceToPlanMap: Record<string, PlanProps> = {
  [process.env.STRIPE_HOBBY_MONTHLY_ID!]: "hobby",
  [process.env.STRIPE_DEVELOPER_MONTHLY_ID!]: "developer",
  [process.env.STRIPE_TEAM_MONTHLY_ID!]: "team",
}

export const planToPriceMap: Record<PlanProps, string> = {
  free: "",
  hobby: process.env.STRIPE_HOBBY_MONTHLY_ID!,
  developer: process.env.STRIPE_DEVELOPER_MONTHLY_ID!,
  team: process.env.STRIPE_TEAM_MONTHLY_ID!
}

/**
 * 
 * @param currentPrice Price of plan that user currently has
 * @param targetPrice Price of plan that user wants to upgrade to
 * @returns Boolean determining if this is an upgrade
 */
export function isUpgrade(currentPlan: PlanProps, targetPlan: PlanProps) {
  return planRank[currentPlan] < planRank[targetPlan]
}


export const subscriptionFeatures = [
  {
    name: "Hobby",
    monthlyPrice: 20,
    annualPrice: parseFloat((192 / 12).toFixed(2)),
    popular: false,
    limitations: userLimits.hobby,
    buttonText: "Try it today",
    description: "Ideal for those who want an ideal developer experience",
    features: [
      `Up to ${userLimits.hobby.databases} databases`,
      `Up to ${userLimits.hobby.buckets} buckets`,
      `Up to ${userLimits.hobby.applications} applications`,
      `Up to ${userLimits.hobby.agentic_calls} agentic AI calls`
    ]
  },
  {
    name: "Developer",
    monthlyPrice: 40,
    annualPrice: parseFloat((384 / 12).toFixed(2)),
    popular: true,
    limitations: userLimits.developer,
    buttonText: "Build today",
    description: "For those who use heavily buckets and extensive project reads",
    features: [
      `Up to ${userLimits.developer.databases} databases`,
      `Up to ${userLimits.developer.buckets} buckets`,
      `Up to ${userLimits.developer.applications} applications`,
      `Up to ${userLimits.developer.agentic_calls} agentic AI calls`
    ]
  },
  {
    name: "Team",
    monthlyPrice: 100,
    annualPrice: parseFloat((960 / 12).toFixed(2)),
    popular: false,
    limitations: userLimits.team,
    buttonText: "Explore today",
    description: "For teams who want reliable CI/CD and 24/7 support",
    features: [
      `Up to ${userLimits.team.databases} databases`,
      `Up to ${userLimits.team.buckets} buckets`,
      `Up to ${userLimits.team.applications} applications`,
      `Up to ${userLimits.team.agentic_calls} agentic AI calls`
    ]
  }
]

export const stripePlans: StripePlan[] = [
  {
    name: "hobby",
    priceId: process.env.STRIPE_HOBBY_MONTHLY_ID,
    annualDiscountPriceId: process.env.STRIPE_HOBBY_ANNUAL_ID,
    lookupKey: "hobby_monthly_plan",
    annualDiscountLookupKey: "hobby_annual_plan",
    limits: userLimits.hobby,
    group: "hobby"
  },
  {
    name: "developer",
    priceId: process.env.STRIPE_DEVELOPER_MONTHLY_ID,
    annualDiscountPriceId: process.env.STRIPE_DEVELOPER_ANNUAL_ID,
    lookupKey: "developer_monthly_plan",
    annualDiscountLookupKey: "developer_monthly_plan",
    limits: userLimits.developer,
    group: "developer"
  },
    {
    name: "team",
    priceId: process.env.STRIPE_TEAM_MONTHLY_ID,
    annualDiscountPriceId: process.env.STRIP_TEAM_ANNUAL_ID,
    lookupKey: "team_monthly_plan",
    annualDiscountLookupKey: "team_annual_plan",
    limits: userLimits.team,
    group: "team"
  },
]