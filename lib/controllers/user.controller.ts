import { type NextRequest, NextResponse } from "next/server"
import { UserService } from "@/lib/services/user.service"
import { UserRepository } from "@/lib/repositories/user.repository"
import { ErrorHandler } from "@/lib/utils/error-handler"

export class UserController {
  private userService: UserService

  constructor() {
    const userRepository = new UserRepository()
    this.userService = new UserService(userRepository)
  }

  async getUsers(request: NextRequest): Promise<NextResponse> {
    try {
      const { searchParams } = new URL(request.url)
      const filters = {
        role: searchParams.get("role") || undefined,
        isActive: searchParams.get("isActive") ? searchParams.get("isActive") === "true" : undefined,
      }

      const result = await this.userService.getAllUsers(filters)
      return NextResponse.json(result)
    } catch (error) {
      return ErrorHandler.handleError(error)
    }
  }

  async getUser(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const user = await this.userService.getUserById(params.id)
      return NextResponse.json({ user })
    } catch (error) {
      return ErrorHandler.handleError(error)
    }
  }

  async createUser(request: NextRequest): Promise<NextResponse> {
    try {
      const userData = await request.json()
      const user = await this.userService.createUser(userData)
      return NextResponse.json({ user }, { status: 201 })
    } catch (error) {
      return ErrorHandler.handleError(error)
    }
  }

  async updateUser(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const updateData = await request.json()
      const user = await this.userService.updateUser(params.id, updateData)
      return NextResponse.json({ user })
    } catch (error) {
      return ErrorHandler.handleError(error)
    }
  }

  async deactivateUser(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const user = await this.userService.deactivateUser(params.id)
      return NextResponse.json({ user })
    } catch (error) {
      return ErrorHandler.handleError(error)
    }
  }
}
