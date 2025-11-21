export function DashboardStoragePage() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Storage Overview</h2>
        <p className="text-muted-foreground">
          Monitor storage usage, configure buckets, and review allocation details.
        </p>
      </div>
      <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
        Storage metrics and configuration tools will appear here once connected to
        your infrastructure.
      </div>
    </section>
  )
}