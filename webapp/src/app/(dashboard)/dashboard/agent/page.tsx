export default function AgentPage() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Agents</h2>
        <p className="text-muted-foreground">
          Configure, assign, and monitor automated agents across your workflows.
        </p>
      </div>
      <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
        Agent activity, availability, and insights will appear here once agents
        are connected.
      </div>
    </section>
  )
}
