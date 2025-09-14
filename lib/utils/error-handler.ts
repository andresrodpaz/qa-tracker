import { NextResponse } from "next/server"
import { ValidationError, NotFoundError, UnauthorizedError, ConflictError } from "@/lib/errors/custom-errors"

export class ErrorHandler {
  static handleError(error: unknown): NextResponse {
    console.error("[v0] Error occurred:", error)

    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message, type: "validation" }, { status: 400 })
    }

    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message, type: "not_found" }, { status: 404 })
    }

    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message, type: "unauthorized" }, { status: 401 })
    }

    if (error instanceof ConflictError) {
      return NextResponse.json({ error: error.message, type: "conflict" }, { status: 409 })
    }

    // Generic error
    return NextResponse.json({ error: "Internal server error", type: "internal" }, { status: 500 })
  }
}
