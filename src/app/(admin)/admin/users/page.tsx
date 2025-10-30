"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useListUsers } from "./userQuery";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
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
  Phone,
  CheckCircle,
  XCircle,
  Save,
  X,
  Settings,
  Mail,
  KeyRound,
  HatGlasses
} from "lucide-react";
import { UserWithRole } from "better-auth/plugins";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0]?.toUpperCase())
    .slice(0, 2)
    .join("");
}

function toTitle(name: string | undefined): string {
  if (!name) return "User"
  return name.slice(0, 1).toUpperCase() + name.slice(1)
}

function formatDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export default function AdminUsersPage() {
  const [query, setQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [goToPageValue, setGoToPageValue] = useState(1);
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false)
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    role: '',
    banReason: ''
  });
  const listData = useListUsers()

  useEffect(() => {
    setGoToPageValue(listData.page);
  }, [listData.page]);

  useEffect(() => {
    setRowsPerPage(listData.pageSize);
  }, [listData.pageSize]);

  const paginationRange = () => {
    const start = Math.max(1, listData.page - 2)
    const end = Math.min(listData.page + 2, listData.totalPages)
    
    return Array.from({length: end - start + 1}, (_, idx) => start + idx)
  }

  const handleOpenUserSheet = (user: UserWithRole) => {
    setSelectedUser(user);
    setEditFormData({
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'user',
      banReason: user.banReason || '',
    });
    setIsEditMode(false);
  };

  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;
    
    setIsLoading(true);
    try {
      await authClient.admin.updateUser({
        userId: selectedUser?.id,
        data: editFormData
      })
      setIsEditMode(false);
      setEditFormData({
        name: '',
        email: '',
        role: '',
        banReason: ''
      })
      listData.refetch(); 
    } catch (error) {
      toast.error('Error saving user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    if (selectedUser) {
      setEditFormData({
        name: selectedUser.name || '',
        email: selectedUser.email || '',
        role: selectedUser.role || 'user',
        banReason: selectedUser.banReason || ''
      });
    }
    setIsEditMode(false);
  };

  type ActionProps = "impersonate" | "toggle-ban" | "revoke-sessions" | "delete"

  const handleUserAction = async (action: ActionProps, user: UserWithRole) => {
    setIsLoading(true);
    try {
      if (action === "delete") {
        await authClient.admin.removeUser({userId: user.id})
        toast.success("Successfully deleted user")
      } else if (action === "toggle-ban") {
        if (user.banned) {
          await authClient.admin.unbanUser({userId: user.id})
          toast.success("Successfully unbaned user")
        } else {
          await authClient.admin.banUser({
            userId: user.id,
            banReason: "Violated terms of service",
            banExpiresIn: 60 * 60 * 24 * 7 // One week
          })
          toast.success("Successfully banned user")
        }
      } else if (action === "revoke-sessions") {
        await authClient.admin.revokeUserSessions({userId: user.id})
        toast.success("Removed all sessions from user")
      } else if (action === "impersonate") {
        await authClient.admin.impersonateUser({userId: user.id})
        toast.success("Successfully impersonated user")
      } else return
      
      listData.refetch();
    } catch (error) {
      toast.error(`Error performing ${action}. Please try again.`);
    } finally {
      setOpen(false)
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Users</CardTitle>
              <CardDescription>View and manage all users in your workspace.</CardDescription>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="flex flex-col gap-2">
                <Label htmlFor="rows" className="text-sm font-medium">Rows per page</Label>
                <Input 
                  id="rows" 
                  type="number" 
                  min={1} 
                  max={100}
                  value={rowsPerPage}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 10;
                    setRowsPerPage(value);
                    listData.setPageSize(value);
                  }}
                  className="w-20"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="pages" className="text-sm font-medium">Go to page</Label>
                <div className="flex gap-2">
                  <Input 
                    id="pages" 
                    type="number" 
                    min={1} 
                    max={listData.totalPages}
                    value={goToPageValue}
                    onChange={(e) => setGoToPageValue(parseInt(e.target.value) || 1)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        listData.setPage(goToPageValue);
                      }
                    }}
                    className="w-20"
                  />
                  <Button 
                    size="sm" 
                    onClick={() => listData.setPage(goToPageValue)}
                    disabled={goToPageValue < 1 || goToPageValue > listData.totalPages}
                  >
                    Go
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="w-full min-w-[720px] table-auto">
              <TableHeader>
                <TableRow className="text-left text-sm text-muted-foreground">
                  <TableCell className="px-2 py-2 font-medium">User</TableCell>
                  <TableCell className="px-2 py-2 font-medium">Email</TableCell>
                  <TableCell className="px-2 py-2 font-medium">Role</TableCell>
                  <TableCell className="px-2 py-2 font-medium">Status</TableCell>
                  <TableCell className="px-2 py-2 font-medium">Created</TableCell>
                  <TableCell className="px-2 py-2 font-medium text-right">Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listData.users.map((user) => (
                  <TableRow key={user.id} className="border-t">
                    <TableCell className="px-2 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          {user.image ? (
                            <AvatarImage src={user.image} alt={user.name} />
                          ) : (
                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                          )}
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium leading-none">{user.name}</span>
                          <span className="text-xs text-muted-foreground">{user.id}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-2 py-3 align-middle text-sm">{user.email}</TableCell>
                    <TableCell className="px-2 py-3 align-middle">
                      <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                        {toTitle(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-2 py-3 align-middle">
                      <Badge
                        variant={
                          user.banned ? "destructive" : "default"
                        }
                      >
                        {user.banned ? "Disabled" : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-2 py-3 align-middle text-sm">{formatDate(user.createdAt)}</TableCell>
                    <TableCell className="px-2 py-3 align-middle text-right">
                      <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleOpenUserSheet(user)}
                            disabled={isLoading || user.role === "admin"}
                          >
                            <Settings className="h-4 w-4 mr-1" />
                            Manage
                          </Button>
                        </SheetTrigger>
                        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto px-3">
                          <SheetHeader>
                            <SheetTitle className="flex items-center gap-2">
                              <User className="h-5 w-5" />
                              {isEditMode ? 'Edit User' : 'User Details'}
                            </SheetTitle>
                            <SheetDescription>
                              {isEditMode ? 'Edit user information and settings' : `Complete information about ${selectedUser?.name}`}
                            </SheetDescription>
                          </SheetHeader>
                          
                          {selectedUser && (
                            <div className="space-y-6 py-6">
                              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                                <Avatar className="h-16 w-16">
                                  {selectedUser.image ? (
                                    <AvatarImage src={selectedUser.image} alt={selectedUser.name} />
                                  ) : (
                                    <AvatarFallback className="text-lg">
                                      {getInitials(selectedUser.name)}
                                    </AvatarFallback>
                                  )}
                                </Avatar>
                                <div className="flex-1">
                                  {isEditMode ? (
                                    <div className="space-y-2">
                                      <div>
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                          id="name"
                                          value={editFormData.name}
                                          onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                                          className="mt-1"
                                          disabled={isLoading}
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                          id="email"
                                          type="email"
                                          value={editFormData.email}
                                          onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                                          className="mt-1"
                                          disabled={isLoading}
                                        />
                                      </div>
                                    </div>
                                  ) : (
                                    <div>
                                      <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                                      <p className="text-muted-foreground">{selectedUser.email}</p>
                                    </div>
                                  )}
                                  <div className="flex gap-2 mt-2">
                                    <Badge variant={selectedUser.role === "admin" ? "default" : "secondary"}>
                                      {toTitle(selectedUser.role)}
                                    </Badge>
                                    <Badge variant={selectedUser.banned ? "destructive" : "default"}>
                                      {selectedUser.banned ? "Disabled" : "Active"}
                                    </Badge>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Basic Information</h4>
                                
                                <div className="space-y-3">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                      <p className="text-sm font-medium">Created</p>
                                      <p className="text-sm text-muted-foreground">{formatDate(selectedUser.createdAt)}</p>
                                    </div>
                                  </div>

                                  {/* <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                      <p className="text-sm font-medium">Phone</p>
                                      {isEditMode ? (
                                        <Input
                                          value={editFormData.phoneNumber}
                                          onChange={(e) => setEditFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                                          className="mt-1"
                                          placeholder="Phone number"
                                          disabled={isLoading}
                                        />
                                      ) : (
                                        <p className="text-sm text-muted-foreground">
                                          {(selectedUser as any).phoneNumber || 'Not provided'}
                                        </p>
                                      )}
                                    </div>
                                  </div> */}

                                  <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                      <p className="text-sm font-medium">Role</p>
                                      {isEditMode ? (
                                        <Select onValueChange={(value) => setEditFormData((prev) => ({...prev, role: value}))}>
                                          <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Role" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="admin">Admin</SelectItem>
                                            <SelectItem value="user">User</SelectItem>
                                            {/* <SelectItem value="system">System</SelectItem> */}
                                          </SelectContent>
                                        </Select>
                                      ) : (
                                        <p className="text-sm text-muted-foreground">{toTitle(selectedUser.role)}</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Security</h4>
                                
                                <div className="space-y-3">
                                  <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                      <p className="text-sm font-medium">Email Verified</p>
                                      <div className="flex items-center gap-1">
                                        {selectedUser.emailVerified ? (
                                          <CheckCircle className="h-4 w-4 text-green-500" />
                                        ) : (
                                          <XCircle className="h-4 w-4 text-red-500" />
                                        )}
                                        <span className="text-sm text-muted-foreground">
                                          {selectedUser.emailVerified ? "Verified" : "Not Verified"}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                      <p className="text-sm font-medium">2FA Enabled</p>
                                      <div className="flex items-center gap-1">
                                        {(selectedUser as any).twoFactorEnabled ? (
                                          <CheckCircle className="h-4 w-4 text-green-500" />
                                        ) : (
                                          <XCircle className="h-4 w-4 text-red-500" />
                                        )}
                                        <span className="text-sm text-muted-foreground">
                                          {(selectedUser as any).twoFactorEnabled ? "Enabled" : "Disabled"}
                                        </span>
                                      </div>
                                    </div>
                                  </div> */}
                                </div>
                              </div>

                              {selectedUser.banned && (
                                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                                  <h4 className="font-medium text-destructive mb-2">Account Banned</h4>
                                  {isEditMode ? (
                                    <div>
                                      <Label htmlFor="banReason">Ban Reason</Label>
                                      <Textarea
                                        id="banReason"
                                        value={editFormData.banReason}
                                        onChange={(e) => setEditFormData(prev => ({ ...prev, banReason: e.target.value }))}
                                        className="mt-1"
                                        placeholder="Reason for banning this user"
                                        disabled={isLoading}
                                      />
                                    </div>
                                  ) : (
                                    <div>
                                      {selectedUser.banReason && (
                                        <p className="text-sm text-muted-foreground mb-1">
                                          <strong>Reason:</strong> {selectedUser.banReason}
                                        </p>
                                      )}
                                      {selectedUser.banExpires && (
                                        <p className="text-sm text-muted-foreground">
                                          <strong>Expires:</strong> {formatDate(selectedUser.banExpires)}
                                        </p>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}

                              <div className="flex flex-col gap-4 pt-4 border-t">
                                <div className="flex gap-2">
                                  {!isEditMode ? (
                                    <Button variant="outline" onClick={handleEditToggle} disabled={isLoading}>
                                      <Edit className="h-4 w-4 mr-1" />
                                      Edit User
                                    </Button>
                                  ) : (
                                    <div className="flex gap-2">
                                      <Button variant="outline" onClick={handleCancelEdit} disabled={isLoading}>
                                        <X className="h-4 w-4 mr-1" />
                                        Cancel
                                      </Button>
                                      <Button onClick={handleSaveUser} disabled={isLoading}>
                                        <Save className="h-4 w-4 mr-1" />
                                        {isLoading ? 'Saving...' : 'Save Changes'}
                                      </Button>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex flex-col gap-2">
                                  <Button 
                                    variant="outline" 
                                    onClick={() => handleUserAction("toggle-ban", selectedUser)}
                                    disabled={isLoading}
                                    className="w-full"
                                  >
                                    <Ban className="h-4 w-4 mr-1" />
                                    {selectedUser?.banned ? "Unban User" : "Ban User"}
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    onClick={() => handleUserAction("revoke-sessions", selectedUser)}
                                    disabled={isLoading}
                                    className="w-full"
                                  >
                                    <KeyRound className="h-4 w-4 mr-1" />
                                    Revoke Sessions
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    onClick={() => handleUserAction("impersonate", selectedUser)}
                                    disabled={isLoading}
                                    className="w-full"
                                  >
                                    <HatGlasses className="h-4 w-4 mr-1" />
                                    Impersonate User
                                  </Button>
                                  <Button 
                                    variant="destructive" 
                                    onClick={() => handleUserAction("delete", selectedUser)}
                                    disabled={isLoading}
                                    className="w-full"
                                  >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Delete User
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </SheetContent>
                      </Sheet>
                    </TableCell>
                  </TableRow>
                ))}
                {listData.users.length === 0 && (
                  <TableRow className="border-t">
                    <TableCell className="px-2 py-8 text-center text-sm text-muted-foreground" colSpan={6}>
                      No users match your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter>
          <Pagination>
            <PaginationContent className="hover:cursor-pointer" key="page-range-content">
              <PaginationItem>
                <PaginationPrevious onClick={listData.prevPage} />
              </PaginationItem>
              {paginationRange().map((page) => (
                <PaginationItem 
                  onClick={() => listData.setPage(page)}
                  aria-disabled={listData.page === page}
                  className={`${listData.page === page ? "text-muted-foreground" : ""} mx-1`}
                >
                  {page}
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext onClick={listData.nextPage} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      </Card>
    </div>
  );
}
