"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  BarChart3,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  Users,
  Plus,
  Search,
  Bell,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  Activity,
  MessageSquare,
  FileText,
  Calendar,
  Tag,
  Zap,
} from "lucide-react"
import { RealTimeComments } from "@/components/collaboration/real-time-comments"
import { LiveActivityFeed } from "@/components/collaboration/live-activity-feed"
import { PresenceIndicators } from "@/components/collaboration/presence-indicators"
import { LiveNotifications } from "@/components/collaboration/live-notifications"
import { useAuth } from "@/components/auth/auth-provider"

// Mock data for demonstration
const mockStats = {
  totalTickets: 1247,
  openTickets: 89,
  criticalTickets: 12,
  resolvedToday: 23,
  myTickets: 15,
  overdueTickets: 7,
}

const mockTickets = [
  {
    id: "1",
    number: 1001,
    title: "Login authentication system shows error on valid credentials",
    description: "Users are unable to authenticate with correct credentials, causing system-wide access issues.",
    status: "OPEN",
    priority: "CRITICAL",
    type: "BUG",
    assignee: "Sarah Chen",
    reporter: "Mike Johnson",
    createdAt: "2024-01-15T10:30:00Z",
    tags: ["authentication", "critical", "production"],
    comments: 8,
    aiConfidence: 92,
  },
  {
    id: "2",
    number: 1002,
    title: "Dashboard performance degradation during peak hours",
    description: "Dashboard loading times increase significantly during high traffic periods.",
    status: "IN_PROGRESS",
    priority: "HIGH",
    type: "PERFORMANCE",
    assignee: "Alex Rodriguez",
    reporter: "Lisa Wang",
    createdAt: "2024-01-14T14:20:00Z",
    tags: ["performance", "dashboard", "optimization"],
    comments: 5,
    aiConfidence: 87,
  },
  {
    id: "3",
    number: 1003,
    title: "Add dark mode support to user preferences",
    description: "Implement comprehensive dark mode theming across all application components.",
    status: "OPEN",
    priority: "MEDIUM",
    type: "FEATURE",
    assignee: "David Kim",
    reporter: "Emma Thompson",
    createdAt: "2024-01-13T09:15:00Z",
    tags: ["ui", "theming", "accessibility"],
    comments: 3,
    aiConfidence: 78,
  },
]

const mockActivity = [
  { user: "Sarah Chen", action: "resolved ticket #998", time: "2 minutes ago", type: "resolved" },
  { user: "Alex Rodriguez", action: "commented on ticket #1002", time: "5 minutes ago", type: "comment" },
  { user: "David Kim", action: "created ticket #1004", time: "12 minutes ago", type: "created" },
  { user: "Lisa Wang", action: "updated priority for ticket #1001", time: "18 minutes ago", type: "updated" },
]

const STATUS_COLORS = {
  OPEN: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800",
  RESOLVED: "bg-green-100 text-green-800",
  CLOSED: "bg-gray-100 text-gray-800",
}

const PRIORITY_COLORS = {
  LOW: "bg-gray-100 text-gray-800",
  MEDIUM: "bg-yellow-100 text-yellow-800",
  HIGH: "bg-orange-100 text-orange-800",
  CRITICAL: "bg-red-100 text-red-800",
}

function DashboardContent() {
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [notifications, setNotifications] = useState(3)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate notification updates
      if (Math.random() > 0.7) {
        setNotifications((prev) => prev + 1)
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const filteredTickets = mockTickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter =
      selectedFilter === "all" ||
      ticket.status.toLowerCase() === selectedFilter ||
      ticket.priority.toLowerCase() === selectedFilter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center px-4 gap-4">
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold">QTrack</h1>
          </div>

          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search tickets, users, or projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {notifications}
                </Badge>
              )}
            </Button>

            <Button variant="ghost" size="sm">
              <Settings className="w-5 h-5" />
            </Button>

            <div className="flex items-center gap-2 ml-2">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium hidden sm:block">{user?.name}</span>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 fixed md:static inset-y-0 left-0 z-50 w-64 bg-card border-r transition-transform duration-200 ease-in-out`}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between p-4 md:hidden">
              <span className="text-lg font-semibold">Menu</span>
              <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <nav className="flex-1 space-y-2 p-4">
              <Button variant="ghost" className="w-full justify-start">
                <BarChart3 className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Tickets
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Team
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Activity className="mr-2 h-4 w-4" />
                Reports
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Calendar
              </Button>
            </nav>

            <div className="p-4 border-t">
              <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Welcome back, {user?.name}!</h2>
            <p className="text-muted-foreground">Here's what's happening with your projects today</p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Tickets</p>
                    <p className="text-3xl font-bold">{mockStats.totalTickets.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-green-600 font-medium">12% increase</span>
                  <span className="text-muted-foreground ml-2">from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Open Tickets</p>
                    <p className="text-3xl font-bold">{mockStats.openTickets}</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-full">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <Badge variant="destructive" className="mr-2">
                    {mockStats.criticalTickets} critical
                  </Badge>
                  <span className="text-muted-foreground">{mockStats.myTickets} assigned to you</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                    <p className="text-3xl font-bold text-red-600">{mockStats.overdueTickets}</p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-full">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <span className="text-red-600 font-medium">Needs attention</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Resolved Today</p>
                    <p className="text-3xl font-bold text-green-600">{mockStats.resolvedToday}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-green-600 font-medium">Great progress!</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Recent Tickets */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Recent Tickets</CardTitle>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedFilter}
                      onChange={(e) => setSelectedFilter(e.target.value)}
                      className="px-3 py-1 border rounded-md text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      New Ticket
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredTickets.map((ticket) => (
                      <div key={ticket.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">
                              #{ticket.number} {ticket.title}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{ticket.description}</p>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <Badge className={STATUS_COLORS[ticket.status]}>{ticket.status.replace("_", " ")}</Badge>
                            <Badge className={PRIORITY_COLORS[ticket.priority]}>{ticket.priority}</Badge>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <span>Assigned to {ticket.assignee}</span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-4 h-4" />
                              {ticket.comments}
                            </span>
                            {ticket.aiConfidence && (
                              <span className="flex items-center gap-1 text-blue-600">
                                <Zap className="w-4 h-4" />
                                AI: {ticket.aiConfidence}%
                              </span>
                            )}
                          </div>
                          <span>2 hours ago</span>
                        </div>

                        {ticket.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {ticket.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                <Tag className="w-3 h-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                            {ticket.tags.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{ticket.tags.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar with Collaboration Features */}
            <div className="space-y-6">
              {/* Live Notifications */}
              <LiveNotifications />

              {/* Presence Indicators */}
              <PresenceIndicators />

              {/* Live Activity Feed */}
              <LiveActivityFeed />
            </div>
          </div>

          {/* Collaboration Features Section */}
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {/* Real-time Comments Demo */}
            <RealTimeComments ticketId="1001" />

            {/* Additional collaboration space */}
            <Card>
              <CardHeader>
                <CardTitle>Collaboration Hub</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Real-time collaboration features are now active. Team members can see live updates, presence
                  indicators, and participate in real-time discussions.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-green-100 text-green-800">Live Comments</Badge>
                  <Badge className="bg-blue-100 text-blue-800">Presence Tracking</Badge>
                  <Badge className="bg-purple-100 text-purple-800">Activity Feed</Badge>
                  <Badge className="bg-orange-100 text-orange-800">Notifications</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}

export default function QTrackDashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
