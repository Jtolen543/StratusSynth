"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useListUsers } from "./queries/userQuery";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Loader2,
  Settings,
  User,
  CreditCard,
  ChevronDown,
  BarChart3
} from "lucide-react";
import { ManageInfo } from "./ManageInfo";
import { ManageSubscription } from "./ManageSubscription";
import { ManageUsage } from "./ManageUsage";
import { UserWithRole } from "better-auth/plugins";
import { authClient } from "@/lib/authentication/auth-client";
import { toast } from "sonner";
import { ApplicationRoles, rankApplicationRoles } from "@/lib/authentication/permissions";

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
  const [searchInput, setSearchInput] = useState<string>("")
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [goToPageValue, setGoToPageValue] = useState(1);
  const [infoUserId, setInfoUserId] = useState<string | null>(null);
  const [subscriptionUserId, setSubscriptionUserId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false)
  const [createUserLoading, setCreateUserLoading] = useState(false);
  const [usageUserId, setUsageUserId] = useState<string | null>(null);
  const [createUserData, setCreateUserData] = useState({
    email: '',
    password : '',
    name: '',
    role: ''
  })
  const listData = useListUsers()

  const {data} = authClient.useSession()
  const currentUser = data?.user 

  const blockManage = (user: UserWithRole) => {
    return !rankApplicationRoles(currentUser?.role as ApplicationRoles, user.role as ApplicationRoles)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      listData.setSearch(searchInput);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput, listData]);

  const paginationRange = () => {
    const start = Math.max(1, listData.page - 2)
    const end = Math.min(listData.page + 2, listData.totalPages)
    
    return Array.from({length: end - start + 1}, (_, idx) => start + idx)
  }

  const handleCreateUser = async () => {
    setCreateUserLoading(true)
    try {
      await authClient.admin.createUser({
        email: createUserData.email,
        password: createUserData.password,
        name: createUserData.name,
        role: createUserData.role as ApplicationRoles,
        fetchOptions: {
          onSuccess: async () => {
            toast.success("Successfully created user")
            listData.refetch()
            clearCreateUser()
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || "Failed to create user")
          }
        }
      })
    } finally {
      setCreateUserLoading(false)
      setCreateOpen(false)
    }
  }

  const clearCreateUser = () => {
    setCreateUserData({
      email: '',
      password: '',
      name: '',
      role: ''
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-end md:gap-4 gap-2">
        <div className="flex flex-col gap-1 w-full md:w-[240px]">
          <Label htmlFor="admin-search">Search</Label>
          <Input
            id="admin-search"
            placeholder="Enter a query"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1 w-full md:w-[160px]">
          <Label htmlFor="admin-searchby-ui-static">Search By</Label>
          <Select defaultValue="email" onValueChange={(value: "email" | "name") => listData.setSearchBy(value)}>
            <SelectTrigger id="admin-searchby-ui-static" className="w-full">
              <SelectValue placeholder="Search By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-full justify-end mb-2">
          <Sheet onOpenChange={setCreateOpen} open={createOpen}>
            <SheetTrigger asChild>
              <Button variant="default">Create User</Button>
            </SheetTrigger>
            <SheetContent className="w-full max-w-md px-2">
              <SheetHeader>
                <SheetTitle>Create a new user</SheetTitle>
                <SheetDescription>Fill out the details to create a new user.</SheetDescription>
              </SheetHeader>
              <div className="py-4 flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="create-user-email">Email</Label>
                  <Input 
                    id="create-user-email" type="email" placeholder="Email address" value={createUserData.email}
                    onChange={(event) => setCreateUserData((prev) => ({...prev, email: event.target.value}))}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label htmlFor="create-user-password">Password</Label>
                  <Input 
                    id="create-user-password" type="password" placeholder="Password" value={createUserData.password}
                    onChange={(event) => setCreateUserData((prev) => ({...prev, password: event.target.value}))}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label htmlFor="create-user-name">Name</Label>
                  <Input 
                    id="create-user-name" placeholder="Full Name" value={createUserData.name}
                    onChange={(event) => setCreateUserData((prev) => ({...prev, name: event.target.value}))}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label htmlFor="create-user-role">Role</Label>
                  <Select
                    value={createUserData.role}
                    onValueChange={(value) => setCreateUserData((prev) => ({ ...prev, role: value }))}>
                    <SelectTrigger id="create-user-role" className="w-full">
                      <SelectValue defaultValue="user" placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      {rankApplicationRoles(currentUser?.role as ApplicationRoles).map((opt) => (
                        <SelectItem key={opt.key} value={opt.key}>
                          {opt.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end pt-2">
                  <Button 
                    onClick={handleCreateUser}
                    disabled={createUserLoading}
                  >
                    {createUserLoading ? <Loader2 className="animate-spin duration-300"/> : <div>Create User</div> }
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            disabled={blockManage(user)}
                          >
                            <Settings className="h-4 w-4 mr-1" />
                            Manage
                            <ChevronDown className="h-3 w-3 ml-1" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSubscriptionUserId(null);
                              setInfoUserId(user.id);
                            }}
                          >
                            <User className="h-4 w-4 mr-2" />
                            Edit Info
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setInfoUserId(null);
                              setSubscriptionUserId(user.id);
                            }}
                          >
                            <CreditCard className="h-4 w-4 mr-2" />
                            Manage Subscription
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setInfoUserId(null);
                              setSubscriptionUserId(null);
                              setUsageUserId(user.id);
                            }}
                          >
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Manage Usage
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <ManageInfo
                        user={user}
                        currentUser={data?.user as UserWithRole}
                        open={infoUserId === user.id}
                        onOpenChange={(open) => {
                          if (open) {
                            setInfoUserId(user.id);
                            setSubscriptionUserId(null);
                          } else if (infoUserId === user.id) {
                            setInfoUserId(null);
                          }
                        }}
                        disabled={blockManage(user)}
                        hideTrigger={true}
                        onUserUpdated={() => {
                          listData.refetch();
                        }}
                      />
                      <ManageSubscription
                        user={user}
                        open={subscriptionUserId === user.id}
                        onOpenChange={(open) => {
                          if (open) {
                            setSubscriptionUserId(user.id);
                            setInfoUserId(null);
                          } else if (subscriptionUserId === user.id) {
                            setSubscriptionUserId(null);
                          }
                        }}
                        disabled={blockManage(user)}
                        hideTrigger={true}
                      />
                      <ManageUsage
                        user={user}
                        open={usageUserId === user.id}
                        onOpenChange={(open) => {
                          if (open) {
                            setUsageUserId(user.id);
                            setInfoUserId(null);
                            setSubscriptionUserId(null);
                          } else if (usageUserId === user.id) {
                            setUsageUserId(null);
                          }
                        }}
                        disabled={blockManage(user)}
                        hideTrigger={true}
                      />
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
              {paginationRange().map((page, idx) => (
                <PaginationItem 
                  onClick={() => listData.setPage(page)}
                  aria-disabled={listData.page === page}
                  className={`${listData.page === page ? "text-muted-foreground" : ""} mx-1`}
                  key={`page-${idx}`}
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
