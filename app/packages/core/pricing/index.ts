
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

export type PlanProps = "free" | "hobby" | "developer" | "team"
export type MetricProps = "databases" | "buckets" | "applications" | "agentic_calls"

export const stripePlanNames: PlanProps[] = ["free", "hobby", "developer", "team"]

export const usageMetrics: MetricProps[] = [
  "databases", "buckets", "applications", "agentic_calls"
]

export const cyclableMetrics: MetricProps[] = [
  "agentic_calls"
]