import type { IUserRepository } from "@/lib/interfaces/repositories"
import type { User, CreateUserData, UpdateUserData } from "@/lib/database/schema"
import { ValidationError, NotFoundError, ConflictError } from "@/lib/errors/custom-errors"

export class UserService {
  constructor(private userRepository: IUserRepository) {}

  async getAllUsers(filters?: {
    role?: string
    isActive?: boolean
  }): Promise<{ users: User[]; total: number }> {
    let users = this.userRepository.getAll()

    if (filters) {
      if (filters.role) {
        users = this.userRepository.getByRole(filters.role)
      }
      if (filters.isActive !== undefined) {
        users = users.filter((user) => user.isActive === filters.isActive)
      }
    }

    // Remove sensitive data and sort by name
    const safeUsers = users.map((user) => ({ ...user })).sort((a, b) => a.name.localeCompare(b.name))

    return { users: safeUsers, total: safeUsers.length }
  }

  async getUserById(id: string): Promise<User> {
    const user = this.userRepository.getById(id)
    if (!user) {
      throw new NotFoundError(`User with id ${id} not found`)
    }
    return user
  }

  async createUser(data: CreateUserData): Promise<User> {
    this.validateUserData(data)

    // Check if user already exists
    const existingUser = this.userRepository.getByEmail(data.email)
    if (existingUser) {
      throw new ConflictError("User with this email already exists")
    }

    const userData = {
      ...data,
      isActive: true,
    }

    return this.userRepository.create(userData)
  }

  async updateUser(id: string, data: UpdateUserData): Promise<User> {
    const existingUser = await this.getUserById(id)

    // Check email uniqueness if email is being updated
    if (data.email && data.email !== existingUser.email) {
      const userWithEmail = this.userRepository.getByEmail(data.email)
      if (userWithEmail) {
        throw new ConflictError("User with this email already exists")
      }
    }

    const updatedUser = this.userRepository.update(id, data)
    if (!updatedUser) {
      throw new NotFoundError(`Failed to update user with id ${id}`)
    }

    return updatedUser
  }

  async deactivateUser(id: string): Promise<User> {
    return this.updateUser(id, { isActive: false })
  }

  async activateUser(id: string): Promise<User> {
    return this.updateUser(id, { isActive: true })
  }

  private validateUserData(data: CreateUserData): void {
    if (!data.email?.trim()) {
      throw new ValidationError("Email is required")
    }
    if (!data.name?.trim()) {
      throw new ValidationError("Name is required")
    }
    if (!data.role) {
      throw new ValidationError("Role is required")
    }
    if (!this.isValidEmail(data.email)) {
      throw new ValidationError("Invalid email format")
    }
    if (!["admin", "manager", "agent"].includes(data.role)) {
      throw new ValidationError("Invalid role")
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
}
