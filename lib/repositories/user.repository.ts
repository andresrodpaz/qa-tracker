import type { IUserRepository } from "@/lib/interfaces/repositories"
import type { User } from "@/lib/database/schema"
import { LocalStorageModel } from "@/lib/database/models"

export class UserRepository implements IUserRepository {
  private model = new LocalStorageModel<User>("users")

  getAll(): User[] {
    return this.model.getAll()
  }

  getById(id: string): User | null {
    return this.model.getById(id)
  }

  create(data: Omit<User, "id" | "createdAt" | "updatedAt">): User {
    return this.model.create(data)
  }

  update(id: string, data: Partial<User>): User | null {
    return this.model.update(id, data)
  }

  delete(id: string): boolean {
    return this.model.delete(id)
  }

  getByEmail(email: string): User | null {
    return this.getAll().find((user) => user.email === email) || null
  }

  getByRole(role: string): User[] {
    return this.getAll().filter((user) => user.role === role)
  }
}
