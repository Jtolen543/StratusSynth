import { StripePlan } from "@better-auth/stripe"

export type PlanProps = "basic" | "plus" | "pro"
export type MetricProps = "databases" | "buckets" | "applications"

export const usageMetrics: MetricProps[] = [
  "databases", "buckets", "applications"
]

export const userLimits = {
  basic: {
    databases: 5, 
    buckets: 5,
    applications: 5
  },
  plus: {
    databases: 10, 
    buckets: 50,
    applications: 25,
  },
  pro: {
    databases: 25, 
    buckets: 500,
    applications: 250
  }
}

export const subscriptionFeatures = [
  {
    name: "Basic",
    monthlyPrice: 0,
    annualPrice: 0,
    popular: false,
    limitations: userLimits.basic,
    buttonText: "Get started for Free",
    description: "Perfect for individuals and small teams getting started",
    features: [
      `Up to ${userLimits.basic.databases} databases`,
      `Up to ${userLimits.basic.buckets} buckets`,
      `Up to ${userLimits.basic.applications} applications`
    ]
  },
  {
    name: "Plus",
    monthlyPrice: 20,
    annualPrice: parseFloat((192 / 12).toFixed(2)),
    popular: true,
    limitations: userLimits.plus,
    buttonText: "Start Free Trial",
    description: "Ideal for those who want an ideal developer experience",
    features: [
      `Up to ${userLimits.plus.databases} databases`,
      `Up to ${userLimits.plus.buckets} buckets`,
      `Up to ${userLimits.plus.applications} applications`
    ]
  },
  {
    name: "Pro",
    monthlyPrice: 40,
    annualPrice: parseFloat((384 / 12).toFixed(2)),
    popular: false,
    limitations: userLimits.pro,
    buttonText: "Subscribe today",
    description: "For those who use heavily buckets and extensive project reads",
    features: [
      `Up to ${userLimits.pro.databases} databases`,
      `Up to ${userLimits.pro.buckets} buckets`,
      `Up to ${userLimits.pro.applications} applications`
    ]
  }
]

export const stripePlans: StripePlan[] = [
  {
    name: "plus",
    priceId: process.env.STRIPE_PLUS_MONTHLY_ID,
    annualDiscountPriceId: process.env.STRIPE_PLUS_ANNUALLY_ID,
    lookupKey: "plus_monthly",
    annualDiscountLookupKey: "plus_annual",
    limits: userLimits.plus,
    group: "plus"
  },
  {
    name: "pro",
    priceId: process.env.STRIPE_PRO_MONTHLY_ID,
    annualDiscountPriceId: process.env.STRIPE_PRO_ANNUALLY_ID,
    lookupKey: "pro_monthly",
    annualDiscountLookupKey: "pro_annual",
    limits: userLimits.pro,
    freeTrial: {
      days: 14
    }
  },
]