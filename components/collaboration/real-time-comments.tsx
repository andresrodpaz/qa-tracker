"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Send, Heart, ThumbsUp, Reply, MoreHorizontal } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Comment {
  id: string
  content: string
  author: {
    id: string
    name: string
    avatar?: string
    isOnline: boolean
  }
  createdAt: string
  updatedAt?: string
  reactions: {
    type: "like" | "heart" | "thumbsup"
    count: number
    users: string[]
  }[]
  replies: Comment[]
  isEditing?: boolean
}

const mockComments: Comment[] = [
  {
    id: "1",
    content:
      "I can reproduce this issue consistently. It seems to be related to the authentication middleware not properly validating JWT tokens when they expire.",
    author: {
      id: "1",
      name: "Sarah Chen",
      avatar: "/diverse-woman-portrait.png",
      isOnline: true,
    },
    createdAt: "2024-01-15T10:30:00Z",
    reactions: [
      { type: "like", count: 3, users: ["2", "3", "4"] },
      { type: "thumbsup", count: 1, users: ["5"] },
    ],
    replies: [
      {
        id: "1-1",
        content: "Good catch! I noticed the same pattern in the logs. The token validation logic needs to be updated.",
        author: {
          id: "2",
          name: "Alex Rodriguez",
          avatar: "/thoughtful-man.png",
          isOnline: true,
        },
        createdAt: "2024-01-15T10:45:00Z",
        reactions: [],
        replies: [],
      },
    ],
  },
  {
    id: "2",
    content: "I've implemented a potential fix in the auth-middleware branch. Could someone review the changes?",
    author: {
      id: "3",
      name: "David Kim",
      isOnline: false,
    },
    createdAt: "2024-01-15T11:15:00Z",
    reactions: [{ type: "heart", count: 2, users: ["1", "4"] }],
    replies: [],
  },
]

export function RealTimeComments({ ticketId }: { ticketId: string }) {
  const [comments, setComments] = useState<Comment[]>(mockComments)
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new comments arriving
      if (Math.random() > 0.9) {
        const newCommentData: Comment = {
          id: Date.now().toString(),
          content: "This is a simulated real-time comment update.",
          author: {
            id: "sim-user",
            name: "System User",
            isOnline: true,
          },
          createdAt: new Date().toISOString(),
          reactions: [],
          replies: [],
        }
        setComments((prev) => [...prev, newCommentData])
      }

      // Simulate typing indicators
      if (Math.random() > 0.8) {
        setTypingUsers(["Alex Rodriguez"])
        setTimeout(() => setTypingUsers([]), 3000)
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  // Auto-scroll to bottom when new comments arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [comments])

  const handleAddComment = () => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      content: newComment,
      author: {
        id: "current-user",
        name: "John Doe",
        isOnline: true,
      },
      createdAt: new Date().toISOString(),
      reactions: [],
      replies: [],
    }

    setComments((prev) => [...prev, comment])
    setNewComment("")
  }

  const handleAddReply = (parentId: string) => {
    if (!replyContent.trim()) return

    const reply: Comment = {
      id: `${parentId}-${Date.now()}`,
      content: replyContent,
      author: {
        id: "current-user",
        name: "John Doe",
        isOnline: true,
      },
      createdAt: new Date().toISOString(),
      reactions: [],
      replies: [],
    }

    setComments((prev) =>
      prev.map((comment) => (comment.id === parentId ? { ...comment, replies: [...comment.replies, reply] } : comment)),
    )

    setReplyContent("")
    setReplyingTo(null)
  }

  const handleReaction = (commentId: string, reactionType: "like" | "heart" | "thumbsup") => {
    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === commentId) {
          const existingReaction = comment.reactions.find((r) => r.type === reactionType)
          if (existingReaction) {
            return {
              ...comment,
              reactions: comment.reactions.map((r) =>
                r.type === reactionType ? { ...r, count: r.count + 1, users: [...r.users, "current-user"] } : r,
              ),
            }
          } else {
            return {
              ...comment,
              reactions: [...comment.reactions, { type: reactionType, count: 1, users: ["current-user"] }],
            }
          }
        }
        return comment
      }),
    )
  }

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={`${isReply ? "ml-12 mt-3" : "mb-6"}`}>
      <div className="flex items-start space-x-3">
        <div className="relative">
          <Avatar className="w-8 h-8">
            <AvatarImage src={comment.author.avatar || "/placeholder.svg"} />
            <AvatarFallback>
              {comment.author.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          {comment.author.isOnline && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          )}
        </div>

        <div className="flex-1">
          <div className="bg-muted rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-sm">{comment.author.name}</span>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </span>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreHorizontal className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <p className="text-sm">{comment.content}</p>
          </div>

          {/* Reactions */}
          <div className="flex items-center space-x-2 mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleReaction(comment.id, "like")}
              className="h-6 px-2 text-xs"
            >
              <ThumbsUp className="w-3 h-3 mr-1" />
              {comment.reactions.find((r) => r.type === "like")?.count || 0}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleReaction(comment.id, "heart")}
              className="h-6 px-2 text-xs"
            >
              <Heart className="w-3 h-3 mr-1" />
              {comment.reactions.find((r) => r.type === "heart")?.count || 0}
            </Button>
            {!isReply && (
              <Button variant="ghost" size="sm" onClick={() => setReplyingTo(comment.id)} className="h-6 px-2 text-xs">
                <Reply className="w-3 h-3 mr-1" />
                Reply
              </Button>
            )}
          </div>

          {/* Reply form */}
          {replyingTo === comment.id && (
            <div className="mt-3 flex items-center space-x-2">
              <Input
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="flex-1 h-8"
                onKeyPress={(e) => e.key === "Enter" && handleAddReply(comment.id)}
              />
              <Button size="sm" onClick={() => handleAddReply(comment.id)}>
                <Send className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>
                Cancel
              </Button>
            </div>
          )}

          {/* Replies */}
          {comment.replies.map((reply) => renderComment(reply, true))}
        </div>
      </div>
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="w-5 h-5 mr-2" />
          Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {comments.map((comment) => renderComment(comment))}

          {/* Typing indicator */}
          {typingUsers.length > 0 && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
              <span>
                {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* New comment form */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center space-x-2">
            <Avatar className="w-8 h-8">
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <Input
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
            />
            <Button onClick={handleAddComment} disabled={!newComment.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
