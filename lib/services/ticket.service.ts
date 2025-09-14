import type { ITicketRepository, IActivityLogRepository } from "@/lib/interfaces/repositories"
import type { Ticket, CreateTicketData, UpdateTicketData } from "@/lib/database/schema"
import { ValidationError, NotFoundError } from "@/lib/errors/custom-errors"

export class TicketService {
  constructor(
    private ticketRepository: ITicketRepository,
    private activityLogRepository: IActivityLogRepository,
  ) {}

  async getAllTickets(filters?: {
    status?: string
    assignedTo?: string
    priority?: string
    category?: string
    search?: string
  }): Promise<{ tickets: Ticket[]; total: number }> {
    let tickets = this.ticketRepository.getAll()

    if (filters) {
      if (filters.status) {
        tickets = this.ticketRepository.getByStatus(filters.status)
      }
      if (filters.assignedTo) {
        tickets = tickets.filter((t) => t.assignedTo === filters.assignedTo)
      }
      if (filters.priority) {
        tickets = tickets.filter((t) => t.priority === filters.priority)
      }
      if (filters.category) {
        tickets = tickets.filter((t) => t.category === filters.category)
      }
      if (filters.search) {
        tickets = this.ticketRepository.search(filters.search)
      }
    }

    // Sort by updatedAt desc
    tickets.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

    return { tickets, total: tickets.length }
  }

  async getTicketById(id: string): Promise<Ticket> {
    const ticket = this.ticketRepository.getById(id)
    if (!ticket) {
      throw new NotFoundError(`Ticket with id ${id} not found`)
    }
    return ticket
  }

  async createTicket(data: CreateTicketData, reportedBy: string): Promise<Ticket> {
    this.validateTicketData(data)

    const ticketData = {
      ...data,
      status: "open" as const,
      reportedBy,
      tags: data.tags || [],
      attachments: [],
    }

    const ticket = this.ticketRepository.create(ticketData)

    // Log activity
    this.activityLogRepository.create({
      userId: reportedBy,
      action: "ticket_created",
      entityType: "ticket",
      entityId: ticket.id,
      details: { title: data.title, priority: data.priority, category: data.category },
    })

    return ticket
  }

  async updateTicket(id: string, data: UpdateTicketData, updatedBy: string): Promise<Ticket> {
    const existingTicket = await this.getTicketById(id)

    const updatedTicket = this.ticketRepository.update(id, data)
    if (!updatedTicket) {
      throw new NotFoundError(`Failed to update ticket with id ${id}`)
    }

    // Log activity for status changes
    if (data.status && data.status !== existingTicket.status) {
      this.activityLogRepository.create({
        userId: updatedBy,
        action: "ticket_status_changed",
        entityType: "ticket",
        entityId: id,
        details: { from: existingTicket.status, to: data.status },
      })
    }

    return updatedTicket
  }

  async deleteTicket(id: string, deletedBy: string): Promise<void> {
    const ticket = await this.getTicketById(id)

    const deleted = this.ticketRepository.delete(id)
    if (!deleted) {
      throw new NotFoundError(`Failed to delete ticket with id ${id}`)
    }

    // Log activity
    this.activityLogRepository.create({
      userId: deletedBy,
      action: "ticket_deleted",
      entityType: "ticket",
      entityId: id,
      details: { title: ticket.title },
    })
  }

  private validateTicketData(data: CreateTicketData): void {
    if (!data.title?.trim()) {
      throw new ValidationError("Title is required")
    }
    if (!data.description?.trim()) {
      throw new ValidationError("Description is required")
    }
    if (!data.priority) {
      throw new ValidationError("Priority is required")
    }
    if (!data.category) {
      throw new ValidationError("Category is required")
    }
    if (data.estimatedHours && data.estimatedHours < 0) {
      throw new ValidationError("Estimated hours must be positive")
    }
  }
}
