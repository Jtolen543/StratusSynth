"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar
} from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Home, LucideIcon} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { NavUser } from "./nav-user"
import { UserData } from "@/hooks/use-user-data"

export interface SidebarLinkProps {
  title: string
  children: {
    link: string
    icon: LucideIcon
    title: string
  }[]
}

type BaseSidebarProps = React.ComponentProps<typeof Sidebar> & {
  items?: SidebarLinkProps[]
  user: UserData
}

export function BaseSidebar({user, items, ...props}: BaseSidebarProps) {
  const { open } = useSidebar();
  const router = useRouter()
  const pathname = usePathname()

  if (!user) return null

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="p-4">
          <Link href="/" className="flex gap-2 items-center">
            <Home size={20}/>
            {open ? <div className="font-bold">YourApp</div> : ""}
          </Link>
      </SidebarHeader>
      <div className="border-b mb-10"/>
      <SidebarContent>
        <SidebarMenu >
          {items?.map((item, idx) => (
            <div key={`item-${idx}`}>
              {open && <div className="text-muted-foreground font-bold pl-2">{item.title}</div>}
              <div className={`flex flex-col gap-2 w-full ${open ? "" : "items-center"}`}>   
                  {item.children?.map((child) => {
                    const isActive = pathname === child.link
                    const Icon = child.icon
                    return (
                      <SidebarMenuItem key={child.title}>
                        {open ? (
                          <SidebarMenuButton asChild>
                            <Link href={child.link} className={`flex gap-4 items-center ${pathname === child.link ? "bg-muted" : ""}`}>
                              <child.icon size={20}/>
                              <div className={`font-bold text-base`}>{child.title}</div>
                            </Link>
                          </SidebarMenuButton>
                        ) : (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                aria-current={isActive ? "page" : undefined}
                                onClick={() => router.push(child.link)}
                                className={`p-2 rounded ${isActive ? "bg-muted" : ""}`}
                              >
                                <Icon size={20} />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="right" align="center">
                              {child.title}
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </SidebarMenuItem>
                    )
                })}
              </div>
            </div>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user.user?.name ?? "Guest",
            email: user.user?.email ?? "",
            image: user.user?.image ?? "/avatar.png",
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}