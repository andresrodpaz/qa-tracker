"use client"

import { Button } from "@/components/ui/button"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Activity, MessageSquare, Edit, CheckCircle, AlertTriangle, User, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ActivityItem {
  id: string
  type: "comment" | "status_change" | "assignment" | "priority_change" | "created" | "resolved"
  user: {
    id: string
    name: string
    avatar?: string
    isOnline: boolean
  }
  action: string
  target?: string
  timestamp: string
  metadata?: {
    from?: string
    to?: string
    ticketNumber?: number
  }
}

const mockActivities: ActivityItem[] = [
  {
    id: "1",
    type: "comment",
    user: { id: "1", name: "Sarah Chen", avatar: "/diverse-woman-portrait.png", isOnline: true },
    action: "commented on",
    target: "Authentication Bug #1001",
    timestamp: "2024-01-15T10:30:00Z",
    metadata: { ticketNumber: 1001 },
  },
  {
    id: "2",
    type: "status_change",
    user: { id: "2", name: "Alex Rodriguez", avatar: "/thoughtful-man.png", isOnline: true },
    action: "changed status from",
    target: "Dashboard Performance #1002",
    timestamp: "2024-01-15T10:25:00Z",
    metadata: { from: "Open", to: "In Progress", ticketNumber: 1002 },
  },
  {
    id: "3",
    type: "assignment",
    user: { id: "3", name: "David Kim", isOnline: false },
    action: "assigned",
    target: "Dark Mode Feature #1003",
    timestamp: "2024-01-15T10:20:00Z",
    metadata: { to: "Emma Thompson", ticketNumber: 1003 },
  },
  {
    id: "4",
    type: "created",
    user: { id: "4", name: "Lisa Wang", avatar: "/woman-2.png", isOnline: true },
    action: "created",
    target: "API Rate Limiting #1004",
    timestamp: "2024-01-15T10:15:00Z",
    metadata: { ticketNumber: 1004 },
  },
  {
    id: "5",
    type: "resolved",
    user: { id: "1", name: "Sarah Chen", avatar: "/diverse-woman-portrait.png", isOnline: true },
    action: "resolved",
    target: "Login Timeout Issue #998",
    timestamp: "2024-01-15T10:10:00Z",
    metadata: { ticketNumber: 998 },
  },
]

const getActivityIcon = (type: string) => {
  switch (type) {
    case "comment":
      return <MessageSquare className="w-4 h-4 text-blue-500" />
    case "status_change":
      return <Edit className="w-4 h-4 text-orange-500" />
    case "assignment":
      return <User className="w-4 h-4 text-purple-500" />
    case "priority_change":
      return <AlertTriangle className="w-4 h-4 text-red-500" />
    case "created":
      return <Activity className="w-4 h-4 text-green-500" />
    case "resolved":
      return <CheckCircle className="w-4 h-4 text-green-600" />
    default:
      return <Activity className="w-4 h-4 text-gray-500" />
  }
}

const getActivityColor = (type: string) => {
  switch (type) {
    case "comment":
      return "bg-blue-100 text-blue-800"
    case "status_change":
      return "bg-orange-100 text-orange-800"
    case "assignment":
      return "bg-purple-100 text-purple-800"
    case "priority_change":
      return "bg-red-100 text-red-800"
    case "created":
      return "bg-green-100 text-green-800"
    case "resolved":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export function LiveActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>(mockActivities)
  const [filter, setFilter] = useState<string>("all")

  // Simulate real-time activity updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const newActivity: ActivityItem = {
          id: Date.now().toString(),
          type: ["comment", "status_change", "assignment"][Math.floor(Math.random() * 3)] as any,
          user: {
            id: "live-user",
            name: "Live User",
            isOnline: true,
          },
          action: "performed live action on",
          target: `Ticket #${Math.floor(Math.random() * 1000) + 1000}`,
          timestamp: new Date().toISOString(),
          metadata: { ticketNumber: Math.floor(Math.random() * 1000) + 1000 },
        }

        setActivities((prev) => [newActivity, ...prev.slice(0, 19)]) // Keep only 20 items
      }
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  const filteredActivities = activities.filter((activity) => filter === "all" || activity.type === filter)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Live Activity Feed
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
        </CardTitle>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2 mt-2">
          {["all", "comment", "status_change", "assignment", "created", "resolved"].map((filterType) => (
            <Button
              key={filterType}
              variant={filter === filterType ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(filterType)}
              className="text-xs"
            >
              {filterType.replace("_", " ")}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="relative">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={activity.user.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {activity.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {activity.user.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  {getActivityIcon(activity.type)}
                  <Badge className={getActivityColor(activity.type)} variant="secondary">
                    {activity.type.replace("_", " ")}
                  </Badge>
                </div>

                <p className="text-sm">
                  <span className="font-medium">{activity.user.name}</span>{" "}
                  <span className="text-muted-foreground">{activity.action}</span>{" "}
                  <span className="font-medium">{activity.target}</span>
                  {activity.metadata?.from && activity.metadata?.to && (
                    <span className="text-muted-foreground">
                      {" "}
                      from{" "}
                      <Badge variant="outline" className="text-xs">
                        {activity.metadata.from}
                      </Badge>{" "}
                      to{" "}
                      <Badge variant="outline" className="text-xs">
                        {activity.metadata.to}
                      </Badge>
                    </span>
                  )}
                  {activity.metadata?.to && activity.type === "assignment" && (
                    <span className="text-muted-foreground">
                      {" "}
                      to <span className="font-medium">{activity.metadata.to}</span>
                    </span>
                  )}
                </p>

                <div className="flex items-center space-x-2 mt-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}</span>
                  {activity.metadata?.ticketNumber && (
                    <>
                      <span>•</span>
                      <span>#{activity.metadata.ticketNumber}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filteredActivities.length === 0 && (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No activity found for the selected filter</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
