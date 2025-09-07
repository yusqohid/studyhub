"use client"

import * as React from "react"
import {
  BookOpen,
  FileText,
  Home,
  Settings,
  User,
} from "lucide-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { useAuth } from "@/contexts/authContext"
import { useNotes } from "@/contexts/notesContext"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()
  const { notes } = useNotes()
  
  // Get recent notes for documents section (limit to 4 for cleaner look)
  const recentNotes = notes.slice(0, 4).map(note => ({
    name: note.title || 'Untitled',
    url: `/notes/${note.id}`,
    icon: FileText,
  }))

  const data = {
    user: {
      name: user?.displayName || user?.email?.split('@')[0] || 'User',
      email: user?.email || 'user@example.com',
      avatar: user?.photoURL || '/avatars/default.jpg',
    },
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
      },
      {
        title: "All Notes", 
        url: "/notes",
        icon: FileText,
      },
      {
        title: "Profile",
        url: "/profile",
        icon: User,
      },
      {
        title: "Settings",
        url: "/settings", 
        icon: Settings,
      },
    ],
    documents: recentNotes,
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                <BookOpen className="!size-5" />
                <span className="text-base font-semibold">StudyHub</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {data.documents.length > 0 && <NavDocuments items={data.documents} />}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
