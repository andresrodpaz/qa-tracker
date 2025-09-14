import type { NextRequest } from "next/server"
import { CommentController } from "@/lib/controllers/comment.controller"

const commentController = new CommentController()

export async function GET(request: NextRequest) {
  return commentController.getComments(request)
}

export async function POST(request: NextRequest) {
  return commentController.createComment(request)
}
