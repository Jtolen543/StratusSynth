import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Edit,
  Ban,
  Trash2,
  Shield,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Save,
  X,
  Settings,
  KeyRound,
  HatGlasses,
} from "lucide-react";
import { toast } from "sonner";
import { UserWithRole } from "better-auth/plugins";
import { authClient } from "@/lib/authentication/auth-client";
import { ApplicationRoles, rankApplicationRoles } from "@packages/core/permissions";

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0]?.toUpperCase())
    .slice(0, 2)
    .join("");
}

function toTitle(name: string | undefined): string {
  if (!name) return "User";
  return name.slice(0, 1).toUpperCase() + name.slice(1);
}

function formatDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

type ActionProps = "impersonate" | "toggle-ban" | "revoke-sessions" | "delete";

interface ManageInfoProps {
  user: UserWithRole;
  currentUser: UserWithRole
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disabled?: boolean;
  hideTrigger?: boolean;
  onUserUpdated?: () => void;
}

export function ManageInfo({
  user,
  currentUser,
  open,
  onOpenChange,
  disabled = false,
  hideTrigger = false,
  onUserUpdated,
}: ManageInfoProps) {
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: user.name || "",
    email: user.email || "",
    role: user.role || "user",
    banReason: user.banReason || "",
  });

  const resetForm = React.useCallback(() => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "user",
      banReason: user.banReason || "",
    });
  }, [user]);

  React.useEffect(() => {
    if (open) {
      resetForm();
      setIsEditMode(false);
    } else {
      setIsEditMode(false);
      setIsProcessing(false);
    }
  }, [open, resetForm]);

  const handleFormChange = React.useCallback(
    (field: keyof typeof formData, value: string) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    [],
  );

  const handleCancelEdit = React.useCallback(() => {
    resetForm();
    setIsEditMode(false);
  }, [resetForm]);

  const handleSave = React.useCallback(async () => {
    if (disabled || isProcessing) return;

    setIsProcessing(true);
    try {
      await authClient.admin.updateUser({
        userId: user.id,
        data: {
          name: formData.name,
          email: formData.email,
          role: formData.role as UserWithRole["role"],
          banReason: formData.banReason,
        },
      });

      toast.success("User updated.");
      onUserUpdated?.();
      setIsEditMode(false);
      onOpenChange(false);
    } catch (error) {
      toast.error("Error saving user. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }, [disabled, formData, isProcessing, onOpenChange, onUserUpdated, user.id]);

  const handleUserAction = React.useCallback(
    async (action: ActionProps) => {
      if (disabled || isProcessing) return;

      setIsProcessing(true);
      try {
        if (action === "delete") {
          await authClient.admin.removeUser({ userId: user.id });
          toast.success("Successfully deleted user.");
          onUserUpdated?.();
          onOpenChange(false);
        } else if (action === "toggle-ban") {
          if (user.banned) {
            await authClient.admin.unbanUser({ userId: user.id });
            toast.success("Successfully unbanned user.");
          } else {
            await authClient.admin.banUser({
              userId: user.id,
              banReason:
                formData.banReason || "Violated terms of service",
              banExpiresIn: 60 * 60 * 24 * 7,
            });
            toast.success("Successfully banned user.");
          }
          onUserUpdated?.();
        } else if (action === "revoke-sessions") {
          await authClient.admin.revokeUserSessions({ userId: user.id });
          toast.success("Removed all sessions from user.");
        } else if (action === "impersonate") {
          await authClient.admin.impersonateUser({ userId: user.id });
          toast.success("Successfully impersonated user.");
        }
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : `Error performing ${action}. Please try again.`,
        );
      } finally {
        setIsProcessing(false);
      }
    },
    [disabled, formData.banReason, isProcessing, onOpenChange, onUserUpdated, user],
  );

  const handleSheetChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        setIsEditMode(false);
      }
      onOpenChange(nextOpen);
    },
    [onOpenChange],
  );

  return (
    <Sheet open={open} onOpenChange={handleSheetChange}>
      {!hideTrigger && (
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={isProcessing || disabled}
          >
            <Settings className="h-4 w-4 mr-1" />
            Manage
          </Button>
        </SheetTrigger>
      )}
      <SheetContent className="flex flex-col gap-6 overflow-y-scroll no-scrollbar py-4 px-4 min-w-[500px]">
        <SheetHeader className="w-full">
          <SheetTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {isEditMode ? "Edit User" : "User Details"}
          </SheetTitle>
          <SheetDescription>
            {isEditMode
              ? "Edit user information and settings"
              : `Complete information about ${user.name || user.email}`}
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-3">
            <Avatar className="h-16 w-16">
              {user.image ? (
                <AvatarImage src={user.image} alt={user.name} />
              ) : (
                <AvatarFallback>{getInitials(user.name || "")}</AvatarFallback>
              )}
            </Avatar>
            <div className="space-y-1">
              {isEditMode ? (
                <Input
                  value={formData.name}
                  onChange={(event) =>
                    handleFormChange("name", event.target.value)
                  }
                  placeholder="Full name"
                  disabled={isProcessing}
                />
              ) : (
                <h3 className="text-lg font-semibold">
                  {user.name || "Unnamed user"}
                </h3>
              )}
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="role">Role</Label>
                {isEditMode ? (
                  <Select
                    value={formData.role}
                    onValueChange={(value) => handleFormChange("role", value)}
                    disabled={isProcessing}
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {rankApplicationRoles(currentUser?.role as ApplicationRoles).map((opt) => (
                        <SelectItem key={opt.key} value={opt.key}>
                          {opt.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                    {toTitle(user.role)}
                  </Badge>
                )}
              </div>
              <div className="space-y-1">
                <Label>Status</Label>
                <Badge variant={user.banned ? "destructive" : "default"}>
                  {user.banned ? "Banned" : "Active"}
                </Badge>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Created</p>
                  <p className="text-muted-foreground">
                    {formatDate(new Date(user.createdAt))}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Email Verified</p>
                  <div className="flex items-center gap-1">
                    {user.emailVerified ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-muted-foreground">
                      {user.emailVerified ? "Verified" : "Not Verified"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {user.banned && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <h4 className="font-medium text-destructive mb-2">
                Account Banned
              </h4>
              {isEditMode ? (
                <div className="space-y-2">
                  <Label htmlFor="banReason">Ban Reason</Label>
                  <Textarea
                    id="banReason"
                    value={formData.banReason}
                    onChange={(event) =>
                      handleFormChange("banReason", event.target.value)
                    }
                    className="mt-1"
                    placeholder="Reason for banning this user"
                    disabled={isProcessing}
                  />
                </div>
              ) : (
                <div className="space-y-1 text-sm text-muted-foreground">
                  {user.banReason && (
                    <p>
                      <strong>Reason:</strong> {user.banReason}
                    </p>
                  )}
                  {user.banExpires && (
                    <p>
                      <strong>Expires:</strong>{" "}
                      {formatDate(new Date(user.banExpires))}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col gap-4 border-t pt-4">
            <div className="flex gap-2">
              {!isEditMode ? (
                <Button
                  variant="outline"
                  onClick={() => setIsEditMode(true)}
                  disabled={isProcessing || disabled}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit User
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={handleCancelEdit}
                    disabled={isProcessing}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isProcessing}>
                    <Save className="h-4 w-4 mr-1" />
                    {isProcessing ? "Saving..." : "Save Changes"}
                  </Button>
                </>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                onClick={() => handleUserAction("toggle-ban")}
                disabled={isProcessing || disabled}
                className="w-full"
              >
                <Ban className="h-4 w-4 mr-1" />
                {user.banned ? "Unban User" : "Ban User"}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleUserAction("revoke-sessions")}
                disabled={isProcessing || disabled}
                className="w-full"
              >
                <KeyRound className="h-4 w-4 mr-1" />
                Revoke Sessions
              </Button>
              <Button
                variant="outline"
                onClick={() => handleUserAction("impersonate")}
                disabled={isProcessing || disabled}
                className="w-full"
              >
                <HatGlasses className="h-4 w-4 mr-1" />
                Impersonate User
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleUserAction("delete")}
                disabled={isProcessing || disabled}
                className="w-full"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete User
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
