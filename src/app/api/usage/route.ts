import { db } from "@/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await auth.api.getSession({
    headers: await headers()
  })
  if (!data) return NextResponse.json({message: "Invalid headers"})
  
  async function getUsages() {
    return db.query.usage.findMany({
      where: (usage, {eq}) => eq(usage.referenceId, data!.user.id),
      with: {
        subscription: {
          columns: {plan: true}
        }
      }
    })
  }
  async function getPlan() {
    return db.query.subscription.findFirst({
      where: (subscription, {eq}) => eq(subscription.referenceId, data!.user.id)
    })
  }

  const [usages, subscription] = await Promise.all([getUsages(), getPlan()])

  return NextResponse.json({usages, plan: subscription?.plan})
}