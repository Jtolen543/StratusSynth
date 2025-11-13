export default function ApplicationPage() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Applications</h2>
        <p className="text-muted-foreground">
          Deploy, monitor, and iterate on the applications that power your
          platform.
        </p>
      </div>
      <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
        Once applications are configured, deployment status and activity will be
        visible in this space.
      </div>
    </section>
  )
}
