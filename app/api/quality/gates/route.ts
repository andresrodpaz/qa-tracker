import { type NextRequest, NextResponse } from "next/server"
import { qualityGateManager } from "@/lib/monitoring/quality-gates"
import { metricsCollector } from "@/lib/monitoring/metrics-collector"

export async function GET() {
  try {
    const gates = qualityGateManager.getGates()
    const metrics = await metricsCollector.collectMetrics()

    const flatMetrics = {
      "coverage.percentage": metrics.coverage.percentage,
      "lighthouse.performance": metrics.lighthouse.performance,
      "lighthouse.accessibility": metrics.lighthouse.accessibility,
      "security.vulnerabilities.high": metrics.security.vulnerabilities.high,
      "bundle.size.kb": metrics.bundle.size.kb,
      "api.response.time.p95": metrics.api.response.time.p95,
    }

    const results = await qualityGateManager.evaluateGates(flatMetrics)

    return NextResponse.json({
      gates,
      results,
      metrics,
      summary: {
        total: gates.length,
        passed: results.filter((r) => r.passed).length,
        failed: results.filter((r) => !r.passed).length,
        overallHealth: (results.filter((r) => r.passed).length / gates.length) * 100,
      },
    })
  } catch (error) {
    console.error("Quality gates API error:", error)
    return NextResponse.json({ error: "Failed to fetch quality gates" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { gateId, updates } = await request.json()

    if (!gateId || !updates) {
      return NextResponse.json({ error: "Gate ID and updates are required" }, { status: 400 })
    }

    qualityGateManager.updateGate(gateId, updates)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Quality gate update error:", error)
    return NextResponse.json({ error: "Failed to update quality gate" }, { status: 500 })
  }
}
