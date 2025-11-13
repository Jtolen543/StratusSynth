export default function DatabasePage() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Database Overview</h2>
        <p className="text-muted-foreground">
          Keep an eye on database health, connection details, and migration status.
        </p>
      </div>
      <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
        Database insights and management controls will surface here after you
        connect your data sources.
      </div>
    </section>
  )
}
