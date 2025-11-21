import { StripePlan } from "@better-auth/stripe"
import { userLimits, stripePlanNames, PlanProps } from "@packages/core/pricing"
import Stripe from "stripe"

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

export const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-10-29.clover",
    typescript: true
});


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