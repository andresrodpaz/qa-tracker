import { type NextRequest, NextResponse } from "next/server"
import { TicketModel, ActivityLogModel } from "@/lib/database/models"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const ticket = TicketModel.getById(params.id)

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }

    return NextResponse.json({ ticket })
  } catch (error) {
    console.error("[v0] Error fetching ticket:", error)
    return NextResponse.json({ error: "Failed to fetch ticket" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { userId, ...updates } = body

    const existingTicket = TicketModel.getById(params.id)
    if (!existingTicket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }

    // Handle status change to resolved
    if (updates.status === "resolved" && existingTicket.status !== "resolved") {
      updates.resolvedAt = new Date()
    }

    const ticket = TicketModel.update(params.id, updates)

    if (!ticket) {
      return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 })
    }

    // Log activity for significant changes
    const significantFields = ["status", "priority", "assignedTo"]
    for (const field of significantFields) {
      if (updates[field] && updates[field] !== existingTicket[field]) {
        ActivityLogModel.create({
          userId: userId || "system",
          action: "ticket_updated",
          entityType: "ticket",
          entityId: ticket.id,
          details: {
            field,
            old_value: existingTicket[field],
            new_value: updates[field],
          },
        })
      }
    }

    return NextResponse.json({ ticket })
  } catch (error) {
    console.error("[v0] Error updating ticket:", error)
    return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    const success = TicketModel.delete(params.id)

    if (!success) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }

    // Log activity
    if (userId) {
      ActivityLogModel.create({
        userId,
        action: "ticket_deleted",
        entityType: "ticket",
        entityId: params.id,
        details: {},
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting ticket:", error)
    return NextResponse.json({ error: "Failed to delete ticket" }, { status: 500 })
  }
}
