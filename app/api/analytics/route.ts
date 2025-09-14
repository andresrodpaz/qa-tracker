import type { NextRequest } from "next/server"
import { AnalyticsController } from "@/lib/controllers/analytics.controller"

const analyticsController = new AnalyticsController()

export async function GET(request: NextRequest) {
  return analyticsController.getAnalytics(request)
}
