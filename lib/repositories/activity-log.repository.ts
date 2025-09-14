import type { IActivityLogRepository } from "@/lib/interfaces/repositories"
import type { ActivityLog } from "@/lib/database/schema"
import { LocalStorageModel } from "@/lib/database/models"

export class ActivityLogRepository implements IActivityLogRepository {
  private model = new LocalStorageModel<ActivityLog>("activity_logs")

  getAll(): ActivityLog[] {
    return this.model.getAll()
  }

  getById(id: string): ActivityLog | null {
    return this.model.getById(id)
  }

  create(data: Omit<ActivityLog, "id" | "createdAt" | "updatedAt">): ActivityLog {
    return this.model.create(data)
  }

  update(id: string, data: Partial<ActivityLog>): ActivityLog | null {
    return this.model.update(id, data)
  }

  delete(id: string): boolean {
    return this.model.delete(id)
  }

  getByUser(userId: string): ActivityLog[] {
    return this.getAll().filter((log) => log.userId === userId)
  }

  getByEntity(entityType: string, entityId: string): ActivityLog[] {
    return this.getAll().filter((log) => log.entityType === entityType && log.entityId === entityId)
  }
}
