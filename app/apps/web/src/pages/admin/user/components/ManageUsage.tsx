import {useEffect, useCallback, useState} from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Minus, Plus, RotateCcw, BarChart3, Loader2 } from "lucide-react";
import { UserWithRole } from "better-auth/plugins";
import { cyclableMetrics, MetricProps, PlanProps } from "@packages/core/pricing";
import { useGetUsage } from "../queries/usageQuery";
import { UsageRecords } from "@/types/usage";
import { useUpdateUsage } from "../mutations/usageMutation";

interface ManageUsageProps {
  user: UserWithRole;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disabled?: boolean;
  hideTrigger?: boolean;
}

function formatMetric(metric: MetricProps) {
  return metric.replace(/_/g, " ").replace(/^\w|\s\w/g, (letter) => letter.toUpperCase());
}

function formatDate(date?: Date | null) {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function timeSince(date?: Date | null) {
  if (!date) return "Unknown";
  const now = Date.now();
  const then = new Date(date).getTime();
  const diffMinutes = Math.round((now - then) / (1000 * 60));
  if (diffMinutes < 1) return "moments ago";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;
  const diffDays = Math.round(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
}

export function ManageUsage({user, open, onOpenChange, disabled = false, hideTrigger = false}: ManageUsageProps) {
  const {
    usages: fetchedUsages,
    plan: fetchedPlan,
    isLoading,
    isError,
    error,
  } = useGetUsage(user, { enabled: open });
  const usageMutation = useUpdateUsage()
  const [localPlan, setLocalPlan] = useState<PlanProps>("free");
  const [localUsages, setLocalUsages] = useState<UsageRecords[]>([]);
  const [baselineUsages, setBaselineUsages] = useState<UsageRecords[]>([]);
  const [pendingUpdates, setPendingUpdates] = useState<Record<MetricProps, number> | {}>({});
  const hasChanges = Object.keys(pendingUpdates).length > 0;

  useEffect(() => {
    if (fetchedPlan) {
      setLocalPlan(fetchedPlan);
    }
  }, [fetchedPlan]);

  useEffect(() => {
    if (fetchedUsages) {
      const cloned = fetchedUsages.map((usage) => ({ ...usage }));
      setBaselineUsages(cloned);
      setLocalUsages(cloned.map((usage) => ({ ...usage })));
      setPendingUpdates({});
    }
  }, [fetchedUsages]);

  useEffect(() => {
    if (!open && baselineUsages.length > 0) {
      setLocalUsages(baselineUsages.map((usage) => ({ ...usage })));
      setPendingUpdates({});
    }
  }, [open, baselineUsages]);

  const updateUsage = useCallback((metric: MetricProps, updater: (usage: UsageRecords) => UsageRecords) => {
      setLocalUsages((prev) => {
        const next = prev.map((item) =>
          item.metric === metric ? updater({ ...item }) : item,
        );
        const updatedUsage = next.find((item) => item.metric === metric);

        if (updatedUsage) {
          setPendingUpdates((prevUpdates) => {
            const nextUpdates = { ...prevUpdates };
            const baseline = baselineUsages.find((item) => item.metric === metric);
            const baselineCount = baseline?.count ?? updatedUsage.count;

            if (updatedUsage.count === baselineCount) {
              delete nextUpdates[metric];
            } else {
              nextUpdates[metric] = updatedUsage.count;
            }

            return nextUpdates;
          });
        }

        return next;
      });
  }, [baselineUsages]);

  const handleAdjust = useCallback((metric: MetricProps, delta: number) => {
      updateUsage(metric, (current) => ({
        ...current,
        count: Math.max(0, current.count + delta),
        updatedAt: new Date(),
      }));
  }, [updateUsage]);

  const handleDirectInput = useCallback((metric: MetricProps, value: string) => {
      const parsed = Number(value);
      if (Number.isNaN(parsed)) return;
      updateUsage(metric, (current) => ({
        ...current,
        count: Math.max(0, parsed),
        updatedAt: new Date(),
      }));
  }, [updateUsage]);

  const handleResetMetric = useCallback((metric: MetricProps) => {
      updateUsage(metric, (current) => ({
        ...current,
        count: 0,
        updatedAt: new Date(),
      }));
  }, [updateUsage]);

  const handleApply = useCallback(async () => {
    if (!hasChanges) {
      toast.info("No usage changes to apply.");
      return;
    }

    if (JSON.stringify(localUsages) === JSON.stringify({...localUsages, ...pendingUpdates})) {
      toast.info("No changes were made")
      return
    }

    await usageMutation.mutateAsync({
      ...user,
      usages: pendingUpdates as Record<MetricProps, number>,
    })

    toast.success("Usage updates recorded.");
  }, [hasChanges, pendingUpdates, localUsages]);

  const currentPeriodStart = localUsages[0]?.periodStart;
  const currentPeriodEnd = localUsages[0]?.periodEnd;
  const hasUsageData = localUsages.length > 0;
  const errorMessage = error instanceof Error ? error.message : typeof error === "string" ? error : "Failed to load usage data.";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {!hideTrigger && (
        <SheetTrigger asChild>
          <Button size="sm" variant="outline" disabled={disabled}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Manage Usage
          </Button>
        </SheetTrigger>
      )}
      <SheetContent className="flex flex-col gap-6 overflow-y-scroll no-scrollbar py-4 px-4 min-w-[500px]">
        <SheetHeader className="space-y-2">
          <SheetTitle>Usage Controls</SheetTitle>
          <SheetDescription>
            View usage snapshots returned by the dashboard hook and adjust values locally. Wire these actions to an API
            to make them persistent.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4">
          <div className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current plan</p>
                <p className="text-base font-medium">
                  {localPlan.charAt(0).toUpperCase() + localPlan.slice(1)}
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Billing period</span>
              <span className="font-medium">
                {formatDate(currentPeriodStart)} - {formatDate(currentPeriodEnd)}
              </span>
            </div>
          </div>
          {isError && (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
              {errorMessage}
            </div>
          )}
          <div className="space-y-3">
            {isLoading ? (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Loading usage snapshot...
              </div>
            ) : hasUsageData ? (
              localUsages.map((usageItem) => {
                const { metric, count, limit, updatedAt } = usageItem;
                const pct = limit > 0 ? Math.min(100, Math.round((count / limit) * 100)) : 0;
                const overLimit = pct >= 100;
                const nearLimit = pct >= 80 && pct < 100;
                return (
                  <div key={metric} className="rounded-lg border p-4 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-medium">{formatMetric(metric as MetricProps)}</p>
                        <p className="text-xs text-muted-foreground">Last adjusted {timeSince(updatedAt)}</p>
                      </div>
                      <Badge
                        variant={
                          overLimit ? "destructive" : nearLimit ? "secondary" : "outline"
                        }
                        className="text-xs px-2 py-1"
                      >
                        {count.toLocaleString()} / {limit.toLocaleString()} ({pct}%)
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {<Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleAdjust(metric, -1)}
                        disabled={!cyclableMetrics.includes(metric) || count <= 0}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>}
                      <Input
                        type="number"
                        value={count}
                        onChange={(event) =>
                          handleDirectInput(metric, event.target.value)
                        }
                        className="w-24 h-8"
                        min={0}
                        disabled={!cyclableMetrics.includes(metric)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleAdjust(metric, 1)}
                        disabled={!cyclableMetrics.includes(metric)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleResetMetric(metric)}
                        className="ml-auto"
                        disabled={!cyclableMetrics.includes(metric)}
                      >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Reset metric
                      </Button>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          overLimit
                            ? "bg-destructive"
                            : nearLimit
                            ? "bg-yellow-500"
                            : "bg-primary"
                        }`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                No usage data available yet for this user.
              </div>
            )}
          </div>
        </div>
        <div className="mt-auto flex flex-col gap-2">
          <Button onClick={handleApply} disabled={!hasChanges || isLoading || !hasUsageData }>
            Apply adjustments
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
