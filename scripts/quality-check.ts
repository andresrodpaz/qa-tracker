#!/usr/bin/env node

import { qualityGateManager } from "../lib/monitoring/quality-gates"
import { metricsCollector } from "../lib/monitoring/metrics-collector"

async function runQualityCheck() {
  console.log("🔍 Running quality check...\n")

  try {
    // Collect current metrics
    const metrics = await metricsCollector.collectMetrics()

    // Flatten metrics for gate evaluation
    const flatMetrics = {
      "coverage.percentage": metrics.coverage.percentage,
      "lighthouse.performance": metrics.lighthouse.performance,
      "lighthouse.accessibility": metrics.lighthouse.accessibility,
      "security.vulnerabilities.high": metrics.security.vulnerabilities.high,
      "bundle.size.kb": metrics.bundle.size.kb,
      "api.response.time.p95": metrics.api.response.time.p95,
    }

    // Evaluate quality gates
    const results = await qualityGateManager.evaluateGates(flatMetrics)

    // Display results
    console.log("📊 Quality Gate Results:")
    console.log("========================\n")

    let allPassed = true

    for (const result of results) {
      const status = result.passed ? "✅ PASSED" : "❌ FAILED"
      const gate = qualityGateManager.getGates().find((g) => g.id === result.gateId)

      console.log(`${status} ${gate?.name}`)
      console.log(`   Current: ${result.actualValue}`)
      console.log(`   Threshold: ${result.threshold}`)
      console.log(`   Message: ${result.message}\n`)

      if (!result.passed) {
        allPassed = false
      }
    }

    // Summary
    const passed = results.filter((r) => r.passed).length
    const total = results.length
    const healthScore = (passed / total) * 100

    console.log("📈 Summary:")
    console.log("===========")
    console.log(`Gates Passed: ${passed}/${total}`)
    console.log(`Health Score: ${healthScore.toFixed(1)}%`)
    console.log(`Overall Status: ${allPassed ? "✅ HEALTHY" : "❌ NEEDS ATTENTION"}\n`)

    // Exit with appropriate code
    if (!allPassed) {
      console.log("💡 Recommendations:")
      console.log("===================")

      for (const result of results.filter((r) => !r.passed)) {
        const gate = qualityGateManager.getGates().find((g) => g.id === result.gateId)
        console.log(`• Fix ${gate?.name}: ${gate?.description}`)
      }

      process.exit(1)
    } else {
      console.log("🎉 All quality gates passed! System is healthy.")
      process.exit(0)
    }
  } catch (error) {
    console.error("❌ Quality check failed:", error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  runQualityCheck()
}

export { runQualityCheck }
