import type { NextRequest } from "next/server"
import { UserController } from "@/lib/controllers/user.controller"

const userController = new UserController()

export async function GET(request: NextRequest) {
  return userController.getUsers(request)
}

export async function POST(request: NextRequest) {
  return userController.createUser(request)
}
