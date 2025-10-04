import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import {
  IconHome2,
  IconBrandYoutube,
  IconBellRinging,
  IconLibrary,
  IconHistory,
  IconVideo,
  IconClock,
  IconThumbUp,
} from "@tabler/icons-react"
import { Link } from "react-router-dom"

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left" className="bg-sidebar">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Browse</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Home">
                  <Link to="/">
                    <IconHome2 />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Shorts">
                  <Link to="/shorts">
                    <IconBrandYoutube />
                    <span>Shorts</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Subscriptions">
                  <Link to="/subscriptions">
                    <IconBellRinging />
                    <span>Subscriptions</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>You</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Library">
                  <Link to="/library">
                    <IconLibrary />
                    <span>Library</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="History">
                  <Link to="/history">
                    <IconHistory />
                    <span>History</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Your videos">
                  <Link to="/your-videos">
                    <IconVideo />
                    <span>Your videos</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Watch later">
                  <Link to="/watch-later">
                    <IconClock />
                    <span>Watch later</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Liked videos">
                  <Link to="/liked">
                    <IconThumbUp />
                    <span>Liked videos</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="text-xs text-muted-foreground px-2 py-1">{"Press Ctrl/Cmd+B to toggle"}</div>
      </SidebarFooter>
    </Sidebar>
  )
}
