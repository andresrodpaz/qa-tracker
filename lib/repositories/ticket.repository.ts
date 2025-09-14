import type { ITicketRepository } from "@/lib/interfaces/repositories"
import type { Ticket } from "@/lib/database/schema"
import { LocalStorageModel } from "@/lib/database/models"

export class TicketRepository implements ITicketRepository {
  private model = new LocalStorageModel<Ticket>("tickets")

  getAll(): Ticket[] {
    return this.model.getAll()
  }

  getById(id: string): Ticket | null {
    return this.model.getById(id)
  }

  create(data: Omit<Ticket, "id" | "createdAt" | "updatedAt">): Ticket {
    return this.model.create(data)
  }

  update(id: string, data: Partial<Ticket>): Ticket | null {
    return this.model.update(id, data)
  }

  delete(id: string): boolean {
    return this.model.delete(id)
  }

  getByStatus(status: string): Ticket[] {
    return this.getAll().filter((ticket) => ticket.status === status)
  }

  getByAssignee(assignedTo: string): Ticket[] {
    return this.getAll().filter((ticket) => ticket.assignedTo === assignedTo)
  }

  getByPriority(priority: string): Ticket[] {
    return this.getAll().filter((ticket) => ticket.priority === priority)
  }

  getByCategory(category: string): Ticket[] {
    return this.getAll().filter((ticket) => ticket.category === category)
  }

  search(query: string): Ticket[] {
    const searchLower = query.toLowerCase()
    return this.getAll().filter(
      (ticket) =>
        ticket.title.toLowerCase().includes(searchLower) ||
        ticket.description.toLowerCase().includes(searchLower) ||
        ticket.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
    )
  }
}
