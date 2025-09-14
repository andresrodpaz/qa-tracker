import { type NextRequest, NextResponse } from "next/server"
import { TicketService } from "@/lib/services/ticket.service"
import { TicketRepository } from "@/lib/repositories/ticket.repository"
import { ActivityLogRepository } from "@/lib/repositories/activity-log.repository"
import { ValidationError } from "@/lib/errors/custom-errors"
import { ErrorHandler } from "@/lib/utils/error-handler"

export class TicketController {
  private ticketService: TicketService

  constructor() {
    const ticketRepository = new TicketRepository()
    const activityLogRepository = new ActivityLogRepository()
    this.ticketService = new TicketService(ticketRepository, activityLogRepository)
  }

  async getTickets(request: NextRequest): Promise<NextResponse> {
    try {
      const { searchParams } = new URL(request.url)
      const filters = {
        status: searchParams.get("status") || undefined,
        assignedTo: searchParams.get("assignedTo") || undefined,
        priority: searchParams.get("priority") || undefined,
        category: searchParams.get("category") || undefined,
        search: searchParams.get("search") || undefined,
      }

      const result = await this.ticketService.getAllTickets(filters)
      return NextResponse.json(result)
    } catch (error) {
      return ErrorHandler.handleError(error)
    }
  }

  async getTicket(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const ticket = await this.ticketService.getTicketById(params.id)
      return NextResponse.json({ ticket })
    } catch (error) {
      return ErrorHandler.handleError(error)
    }
  }

  async createTicket(request: NextRequest): Promise<NextResponse> {
    try {
      const body = await request.json()
      const { reportedBy, ...ticketData } = body

      if (!reportedBy) {
        throw new ValidationError("reportedBy is required")
      }

      const ticket = await this.ticketService.createTicket(ticketData, reportedBy)
      return NextResponse.json({ ticket }, { status: 201 })
    } catch (error) {
      return ErrorHandler.handleError(error)
    }
  }

  async updateTicket(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const body = await request.json()
      const { updatedBy, ...updateData } = body

      if (!updatedBy) {
        throw new ValidationError("updatedBy is required")
      }

      const ticket = await this.ticketService.updateTicket(params.id, updateData, updatedBy)
      return NextResponse.json({ ticket })
    } catch (error) {
      return ErrorHandler.handleError(error)
    }
  }

  async deleteTicket(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const body = await request.json()
      const { deletedBy } = body

      if (!deletedBy) {
        throw new ValidationError("deletedBy is required")
      }

      await this.ticketService.deleteTicket(params.id, deletedBy)
      return NextResponse.json({ message: "Ticket deleted successfully" })
    } catch (error) {
      return ErrorHandler.handleError(error)
    }
  }
}
