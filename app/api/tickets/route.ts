import type { NextRequest } from "next/server"
import { TicketController } from "@/lib/controllers/ticket.controller"

const ticketController = new TicketController()

export async function GET(request: NextRequest) {
  return ticketController.getTickets(request)
}

export async function POST(request: NextRequest) {
  return ticketController.createTicket(request)
}
