"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, X, Check, MessageSquare, AlertTriangle, CheckCircle, User, Settings } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Notification {
  id: string
  type: "mention" | "assignment" | "comment" | "status_change" | "due_date" | "system"
  title: string
  message: string
  timestamp: string
  read: boolean
  priority: "low" | "medium" | "high"
  user?: {
    name: string
    avatar?: string
  }
  actionUrl?: string
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "mention",
    title: "You were mentioned",
    message: "Sarah Chen mentioned you in a comment on Authentication Bug #1001",
    timestamp: "2024-01-15T10:30:00Z",
    read: false,
    priority: "high",
    user: { name: "Sarah Chen", avatar: "/diverse-woman-portrait.png" },
    actionUrl: "/tickets/1001",
  },
  {
    id: "2",
    type: "assignment",
    title: "New ticket assigned",
    message: "Dashboard Performance #1002 has been assigned to you",
    timestamp: "2024-01-15T10:25:00Z",
    read: false,
    priority: "medium",
    user: { name: "Alex Rodriguez", avatar: "/thoughtful-man.png" },
    actionUrl: "/tickets/1002",
  },
  {
    id: "3",
    type: "comment",
    title: "New comment",
    message: "David Kim commented on Dark Mode Feature #1003",
    timestamp: "2024-01-15T10:20:00Z",
    read: true,
    priority: "low",
    user: { name: "David Kim" },
    actionUrl: "/tickets/1003",
  },
  {
    id: "4",
    type: "due_date",
    title: "Due date approaching",
    message: "API Rate Limiting #1004 is due in 2 hours",
    timestamp: "2024-01-15T10:15:00Z",
    read: false,
    priority: "high",
    actionUrl: "/tickets/1004",
  },
  {
    id: "5",
    type: "system",
    title: "System maintenance",
    message: "Scheduled maintenance will begin at 2:00 AM UTC",
    timestamp: "2024-01-15T10:10:00Z",
    read: true,
    priority: "medium",
  },
]

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "mention":
      return <MessageSquare className="w-4 h-4 text-blue-500" />
    case "assignment":
      return <User className="w-4 h-4 text-purple-500" />
    case "comment":
      return <MessageSquare className="w-4 h-4 text-green-500" />
    case "status_change":
      return <CheckCircle className="w-4 h-4 text-orange-500" />
    case "due_date":
      return <AlertTriangle className="w-4 h-4 text-red-500" />
    case "system":
      return <Settings className="w-4 h-4 text-gray-500" />
    default:
      return <Bell className="w-4 h-4 text-gray-500" />
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800"
    case "medium":
      return "bg-yellow-100 text-yellow-800"
    case "low":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export function LiveNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [filter, setFilter] = useState<"all" | "unread">("all")

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.85) {
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: ["mention", "comment", "assignment"][Math.floor(Math.random() * 3)] as any,
          title: "New notification",
          message: `Live notification received at ${new Date().toLocaleTimeString()}`,
          timestamp: new Date().toISOString(),
          read: false,
          priority: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as any,
          user: { name: "Live User" },
        }

        setNotifications((prev) => [newNotification, ...prev.slice(0, 19)])
      }
    }, 12000)

    return () => clearInterval(interval)
  }, [])

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const filteredNotifications = notifications.filter((notif) => filter === "all" || !notif.read)

  const unreadCount = notifications.filter((notif) => !notif.read).length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Notifications
            {unreadCount > 0 && <Badge className="ml-2 bg-red-500 text-white">{unreadCount}</Badge>}
          </div>
          <div className="flex items-center space-x-2">
            <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
              All
            </Button>
            <Button variant={filter === "unread" ? "default" : "outline"} size="sm" onClick={() => setFilter("unread")}>
              Unread
            </Button>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                <Check className="w-4 h-4 mr-1" />
                Mark all read
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded-lg border transition-colors ${
                notification.read ? "bg-background hover:bg-muted/50" : "bg-blue-50 border-blue-200 hover:bg-blue-100"
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {notification.user?.avatar ? (
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={notification.user.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {notification.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                      {getNotificationIcon(notification.type)}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="text-sm font-medium">{notification.title}</h4>
                    <Badge className={getPriorityColor(notification.priority)} variant="secondary">
                      {notification.priority}
                    </Badge>
                    {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                  </div>

                  <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                    </span>

                    <div className="flex items-center space-x-1">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          className="h-6 px-2 text-xs"
                        >
                          <Check className="w-3 h-3 mr-1" />
                          Mark read
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeNotification(notification.id)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredNotifications.length === 0 && (
            <div className="text-center py-8">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {filter === "unread" ? "No unread notifications" : "No notifications"}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
