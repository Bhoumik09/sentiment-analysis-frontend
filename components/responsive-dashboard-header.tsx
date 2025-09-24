"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Bell, User, Settings, Menu } from "lucide-react"
import { ResponsiveSidebar } from "./responsive-sidebar"

interface ResponsiveDashboardHeaderProps {
  title: string
  subtitle?: string
}

export function ResponsiveDashboardHeader({ title, subtitle }: ResponsiveDashboardHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <>
      <header className="bg-card/80 backdrop-blur-md border-b border-border px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-foreground"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground">{title}</h1>
              {subtitle && <p className="text-sm text-muted-foreground hidden sm:block">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search startups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-48 md:w-64 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-accent focus:border-accent"
              />
            </div>

            <Button variant="ghost" size="icon" className="text-foreground hover:text-accent">
              <Search className="h-5 w-5 sm:hidden" />
              <Bell className="h-5 w-5 hidden sm:block" />
            </Button>

            <Button variant="ghost" size="icon" className="text-foreground hover:text-accent hidden sm:flex">
              <Settings className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon" className="text-foreground hover:text-accent">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <ResponsiveSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  )
}
