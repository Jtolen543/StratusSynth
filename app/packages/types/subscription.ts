import { Subscription } from "@better-auth/stripe"
import { PlanProps } from "../core/pricing"
import { AdminSubscriptionActionTypes } from "./admin"

export type ExtendedSubscription = Subscription & {
    detail?: string
    action?: AdminSubscriptionActionTypes
    months?: number
    seats?: number
    plan?: PlanProps
}