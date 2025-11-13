import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { UsageMutationPayload, UsageMutationResponse } from "@/app/(admin)/admin/users/mutations/usageMutation";
import { usage } from "@/db/schemas/usage";
import { and, eq } from "drizzle-orm";
import { MetricProps } from "@/lib/stripe";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get("id") as string

  const [usages, subscription] = await Promise.all([
    db.query.usage.findMany({
      where: (usage, {and, eq}) => and(eq(usage.referenceId, id))
    }),
    db.query.subscription.findFirst({
      where: (subscription, {and, eq}) => and(eq(subscription.referenceId, id), eq(subscription.status, "active"))
    })
  ])

  console.log(usages)

  return NextResponse.json({usages, plan: subscription?.plan ?? "free"})
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as UsageMutationPayload
  
  await Promise.all([
    ...Object.keys(body.usages).map((key) => db.update(usage).set({
      count: body.usages[key as MetricProps],
      updatedAt: new Date()
    }).where(and(eq(usage.metric, key), eq(usage.referenceId, body.id))))
  ])
  return NextResponse.json({id: body.id, message: "Successfully updated usages", success: true} as UsageMutationResponse)
}