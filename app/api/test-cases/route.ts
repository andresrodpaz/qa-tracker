import type { NextRequest } from "next/server"
import { TestCaseController } from "@/lib/controllers/test-case.controller"

const testCaseController = new TestCaseController()

export async function GET(request: NextRequest) {
  return testCaseController.getTestCases(request)
}

export async function POST(request: NextRequest) {
  return testCaseController.createTestCase(request)
}
