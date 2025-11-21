"use client";

import {useEffect, useCallback, useState} from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CreditCard,
  Calendar,
  Settings,
  XCircle,
  RotateCcw,
  Clock,
  AlertCircle,
  CheckCircle,
  Users,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { UserWithRole } from "better-auth/plugins";
import { Subscription } from "@better-auth/stripe";
import { useGetSubscription } from "../queries/subscriptionQuery";
import { SubscriptionMutationPayload, useUpdateSubscription } from "../mutations/subscriptionMutation";
import { stripePlanNames } from "@packages/core/pricing"

export type ActionTypes = "modify" | "seats" | "remove-cancellation" | "set-cancellation";

interface ManageSubscriptionProps {
  user: UserWithRole;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disabled?: boolean;
  hideTrigger?: boolean;
}

function formatDate(date: Date | string | undefined): string {
  if (!date) return "N/A";

  const dateObj = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(dateObj.getTime())) return "N/A";

  return dateObj.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function formatPlanName(plan: string): string {
  return plan ? plan.slice(0, 1).toUpperCase() + plan.slice(1) : "";
}

function getStatusBadge(status: Subscription["status"]) {
  switch (status) {
    case "active":
      return { label: "Active", variant: "default" as const, icon: CheckCircle };
    case "canceled":
      return {
        label: "Canceled",
        variant: "destructive" as const,
        icon: XCircle,
      };
    case "past_due":
      return {
        label: "Past Due",
        variant: "destructive" as const,
        icon: AlertCircle,
      };
    case "unpaid":
      return {
        label: "Unpaid",
        variant: "destructive" as const,
        icon: XCircle,
      };
    case "trialing":
      return {
        label: "Trial",
        variant: "secondary" as const,
        icon: Clock,
      };
    case "incomplete":
    case "incomplete_expired":
      return {
        label: "Incomplete",
        variant: "secondary" as const,
        icon: AlertCircle,
      };
    case "paused":
      return {
        label: "Paused",
        variant: "secondary" as const,
        icon: Clock,
      };
    default:
      return {
        label: "Unknown",
        variant: "outline" as const,
        icon: AlertCircle,
      };
  }
}

export function ManageSubscription({ user, open, onOpenChange, disabled = false, hideTrigger = false}: ManageSubscriptionProps) {
  const subscriptionQuery = useGetSubscription(user)
  const subscriptionMutation = useUpdateSubscription()

  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [seats, setSeats] = useState<string>("1");
  const [actionType, setActionType] = useState<ActionTypes | null>(null);

  const resetInteractiveState = useCallback(() => {
    setActionType(null);
  }, []);

  useEffect(() => {
    if (!open) {
      setSelectedPlan("");
      setSeats("1");
      resetInteractiveState();
      return;
    }

  }, [open, resetInteractiveState]);

  const availablePlans = stripePlanNames
  const otherPlans = subscriptionQuery.subscription ? 
  availablePlans.filter((plan) => plan !== subscriptionQuery?.subscription?.plan) : availablePlans;

  const statusInfo = subscriptionQuery.subscription ? getStatusBadge(subscriptionQuery.subscription.status) : null;
  const StatusIcon = statusInfo?.icon || AlertCircle;

  const handleAction = useCallback(
    async (action: ActionTypes, detail?: string): Promise<boolean> => {
      if (disabled || !subscriptionQuery.subscription) return false;

      const payload: SubscriptionMutationPayload = {
        ...subscriptionQuery.subscription,
        action,
        detail
      };

      if (action === "modify") {
        if (!selectedPlan) {
          toast.error("Select a plan before modifying.");
          return false;
        }
        payload.plan = selectedPlan;
      }

      if (action === "seats") {
        const seatsValue = parseInt(seats, 10);
        if (isNaN(seatsValue) || seatsValue <= 0) {
          toast.error("Enter a valid number of seats.");
          return false;
        }
        payload.seats = seatsValue;
      }

      setIsLoading(true);
      try {
        await subscriptionMutation.mutateAsync({...payload})
        await subscriptionQuery.refetch()
        toast.success("Subscription updated.");
        resetInteractiveState();
        return true;
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to update subscription");
        return false;
      } finally {
        setIsLoading(false);
      }
    },[disabled, resetInteractiveState, seats, selectedPlan, subscriptionQuery.subscription, user,]
  );

  const handleSheetToggle = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        resetInteractiveState();
      }
      onOpenChange(nextOpen);
    },
    [onOpenChange, resetInteractiveState],
  );

  return (
    <Sheet open={open} onOpenChange={handleSheetToggle}>
      {!hideTrigger && (
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" disabled={isLoading || disabled}>
            <CreditCard className="h-4 w-4 mr-1" />
            Subscription
          </Button>
        </SheetTrigger>
      )}
      <SheetContent className="flex flex-col gap-6 overflow-y-scroll no-scrollbar py-4 px-4 min-w-[500px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Subscription Management
          </SheetTitle>
          <SheetDescription>
            Manage subscription for {user.name || user.email}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {isLoading && !subscriptionQuery.subscription ? (
            <div className="flex items-center justify-center gap-2 py-20 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading subscription details...
            </div>
          ) : subscriptionQuery.subscription ? (
            <>
              <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">
                      {formatPlanName(subscriptionQuery.subscription.plan)} Plan
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Subscription ID: {subscriptionQuery.subscription.id}
                    </p>
                  </div>
                  <Badge variant={statusInfo?.variant || "outline"}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusInfo?.label}
                  </Badge>
                </div>

                {subscriptionQuery.subscription.cancelAtPeriodEnd && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <div className="flex items-center gap-2 text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      <p className="text-sm font-medium">
                        Cancels at period end
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                  Subscription Details
                </h4>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Current Period</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(subscriptionQuery.subscription.periodStart)} -{" "}
                        {formatDate(subscriptionQuery.subscription.periodEnd)}
                      </p>
                    </div>
                  </div>

                  {subscriptionQuery.subscription.trialStart && subscriptionQuery.subscription.trialEnd && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Trial Period</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(subscriptionQuery.subscription.trialStart)} -{" "}
                          {formatDate(subscriptionQuery.subscription.trialEnd)}
                        </p>
                      </div>
                    </div>
                  )}

                  {subscriptionQuery.subscription.seats !== undefined && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Seats</p>
                        <p className="text-sm text-muted-foreground">
                          {subscriptionQuery.subscription.seats} seat(s)
                        </p>
                      </div>
                    </div>
                  )}

                  {subscriptionQuery.subscription.stripeCustomerId && (
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          Stripe Customer ID
                        </p>
                        <p className="text-sm text-muted-foreground font-mono text-xs">
                          {subscriptionQuery.subscription.stripeCustomerId}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                  Actions
                </h4>

                <div className="space-y-3">
                  {otherPlans.length > 0 && subscriptionQuery.subscription.status === "active" && (
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() =>
                          setActionType((prev) =>
                            prev === "modify" ? null : "modify",
                          )
                        }
                        disabled={isLoading}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Modify Plan
                      </Button>
                      {actionType === "modify" && (
                        <div className="space-y-2 p-3 border rounded-lg">
                          <Label htmlFor="modify-plan">Select Plan</Label>
                          <Select
                            value={selectedPlan}
                            onValueChange={setSelectedPlan}
                          >
                            <SelectTrigger id="modify-plan" className="w-full">
                              <SelectValue placeholder="Select a plan" />
                            </SelectTrigger>
                            <SelectContent>
                              {otherPlans.map((plan) => (
                                <SelectItem key={plan} value={plan}>
                                  {formatPlanName(plan)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setActionType(null);
                                setSelectedPlan(subscriptionQuery?.subscription?.plan ?? "");
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={async () => {
                                const success = await handleAction("modify");
                                if (success) {
                                  setActionType(null);
                                }
                              }}
                              disabled={
                                !selectedPlan ||
                                selectedPlan === subscriptionQuery.subscription.plan ||
                                isLoading
                              }
                            >
                              <Settings className="h-4 w-4 mr-1" />
                              Modify
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {subscriptionQuery.subscription.seats !== undefined &&
                    subscriptionQuery.subscription.status === "active" && (
                      <div className="space-y-2">
                        {actionType === "seats" ? (
                          <div className="space-y-2 p-3 border rounded-lg">
                            <Label htmlFor="seats">Number of Seats</Label>
                            <Input
                              id="seats"
                              type="number"
                              min="1"
                              value={seats}
                              onChange={(e) => setSeats(e.target.value)}
                              placeholder="Enter number of seats"
                            />
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setActionType(null);
                                  setSeats(subscriptionQuery?.subscription?.seats?.toString() || "1");
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                onClick={async () => {
                                  const success = await handleAction("seats");
                                  if (success) setActionType(null)
                                }}
                                disabled={!seats || parseInt(seats, 10) === subscriptionQuery.subscription.seats || isLoading}
                              >
                                <Users className="h-4 w-4 mr-1" />
                                Update Seats
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => setActionType("seats")}
                            disabled={isLoading}
                          >
                            <Users className="h-4 w-4 mr-2" />
                            Update Seats
                          </Button>
                        )}
                      </div>
                    )}

                  {(() => {
                    if (subscriptionQuery.subscription.plan !== "basic")
                    return subscriptionQuery.subscription.cancelAtPeriodEnd ? (
                      <div className="p-3 rounded-lg border border-destructive/30 bg-destructive/5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-destructive">
                              <AlertCircle className="h-4 w-4" />
                              <span className="text-sm font-semibold">Cancellation scheduled</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              This plan will end on{" "}
                              {formatDate(subscriptionQuery.subscription.periodEnd)}
                              . Remove the cancellation to keep the subscription active.
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAction("remove-cancellation")}
                            disabled={isLoading}
                          >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Keep Active
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                            disabled={isLoading}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Cancel Subscription
                            <ChevronDown className="h-3 w-3 ml-auto" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem disabled={isLoading} onClick={() => handleAction("set-cancellation", "cycle")}>
                            <Clock className="h-4 w-4 mr-2" />
                            Cancel at Period End
                          </DropdownMenuItem>
                          <DropdownMenuItem disabled={isLoading} onClick={() => handleAction("set-cancellation", "now")}>
                            <XCircle className="h-4 w-4 mr-2" />
                            Cancel Immediately
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )
                  else return (
                    <></>
                  )
                  })()}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">No Subscription</h3>
              <p className="text-sm text-muted-foreground">
                This user does not have an active subscription.
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
