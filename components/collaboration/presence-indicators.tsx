"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Eye, Edit, MessageSquare } from "lucide-react"

interface User {
  id: string
  name: string
  avatar?: string
  status: "online" | "away" | "busy" | "offline"
  activity?: "viewing" | "editing" | "commenting"
  lastSeen?: string
  currentPage?: string
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Sarah Chen",
    avatar: "/diverse-woman-portrait.png",
    status: "online",
    activity: "editing",
    currentPage: "Ticket #1001",
  },
  {
    id: "2",
    name: "Alex Rodriguez",
    avatar: "/thoughtful-man.png",
    status: "online",
    activity: "viewing",
    currentPage: "Dashboard",
  },
  {
    id: "3",
    name: "David Kim",
    status: "away",
    lastSeen: "5 minutes ago",
    currentPage: "Ticket #1003",
  },
  {
    id: "4",
    name: "Lisa Wang",
    avatar: "/woman-2.png",
    status: "busy",
    activity: "commenting",
    currentPage: "Ticket #1002",
  },
  {
    id: "5",
    name: "Emma Thompson",
    status: "offline",
    lastSeen: "2 hours ago",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "online":
      return "bg-green-500"
    case "away":
      return "bg-yellow-500"
    case "busy":
      return "bg-red-500"
    case "offline":
      return "bg-gray-400"
    default:
      return "bg-gray-400"
  }
}

const getActivityIcon = (activity?: string) => {
  switch (activity) {
    case "viewing":
      return <Eye className="w-3 h-3" />
    case "editing":
      return <Edit className="w-3 h-3" />
    case "commenting":
      return <MessageSquare className="w-3 h-3" />
    default:
      return null
  }
}

const getActivityColor = (activity?: string) => {
  switch (activity) {
    case "viewing":
      return "bg-blue-100 text-blue-800"
    case "editing":
      return "bg-orange-100 text-orange-800"
    case "commenting":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export function PresenceIndicators() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [showOffline, setShowOffline] = useState(false)

  // Simulate real-time presence updates
  useEffect(() => {
    const interval = setInterval(() => {
      setUsers((prev) =>
        prev.map((user) => {
          // Randomly update user activities
          if (user.status === "online" && Math.random() > 0.7) {
            const activities = ["viewing", "editing", "commenting"]
            const pages = ["Dashboard", "Ticket #1001", "Ticket #1002", "Reports"]
            return {
              ...user,
              activity: activities[Math.floor(Math.random() * activities.length)] as any,
              currentPage: pages[Math.floor(Math.random() * pages.length)],
            }
          }
          return user
        }),
      )
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  const onlineUsers = users.filter((user) => user.status !== "offline")
  const offlineUsers = users.filter((user) => user.status === "offline")

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Team Presence
          </div>
          <Badge variant="outline">{onlineUsers.length} online</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Online Users */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Online Now</h4>
            <div className="space-y-3">
              {onlineUsers.map((user) => (
                <div key={user.id} className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(user.status)} border-2 border-white rounded-full`}
                    ></div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium truncate">{user.name}</span>
                      {user.activity && (
                        <Badge className={getActivityColor(user.activity)} variant="secondary">
                          <div className="flex items-center space-x-1">
                            {getActivityIcon(user.activity)}
                            <span className="text-xs">{user.activity}</span>
                          </div>
                        </Badge>
                      )}
                    </div>
                    {user.currentPage && <p className="text-xs text-muted-foreground truncate">{user.currentPage}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Offline Users Toggle */}
          {offlineUsers.length > 0 && (
            <div>
              <button
                onClick={() => setShowOffline(!showOffline)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-3"
              >
                {showOffline ? "Hide" : "Show"} Offline ({offlineUsers.length})
              </button>

              {showOffline && (
                <div className="space-y-3">
                  {offlineUsers.map((user) => (
                    <div key={user.id} className="flex items-center space-x-3 opacity-60">
                      <div className="relative">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(user.status)} border-2 border-white rounded-full`}
                        ></div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium truncate">{user.name}</span>
                        {user.lastSeen && <p className="text-xs text-muted-foreground">Last seen {user.lastSeen}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
