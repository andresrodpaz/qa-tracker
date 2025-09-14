const fs = require("fs")
const path = require("path")

function comparePerformance(reportPath) {
  const report = JSON.parse(fs.readFileSync(reportPath, "utf8"))
  const scores = report.lhr.categories

  const thresholds = {
    performance: 80,
    accessibility: 90,
    "best-practices": 90,
    seo: 80,
  }

  let hasRegressions = false

  console.log(`\n📊 Performance Report for ${report.lhr.finalUrl}`)
  console.log("=".repeat(60))

  Object.entries(scores).forEach(([category, data]) => {
    const score = Math.round(data.score * 100)
    const threshold = thresholds[category] || 70
    const status = score >= threshold ? "✅" : "❌"

    if (score < threshold) {
      hasRegressions = true
    }

    console.log(`${status} ${data.title}: ${score}/100 (threshold: ${threshold})`)
  })

  // Check Core Web Vitals
  const audits = report.lhr.audits
  const coreWebVitals = {
    "largest-contentful-paint": { threshold: 2500, unit: "ms" },
    "first-input-delay": { threshold: 100, unit: "ms" },
    "cumulative-layout-shift": { threshold: 0.1, unit: "" },
  }

  console.log("\n🎯 Core Web Vitals")
  console.log("-".repeat(30))

  Object.entries(coreWebVitals).forEach(([metric, config]) => {
    const audit = audits[metric]
    if (audit) {
      const value = audit.numericValue
      const status = value <= config.threshold ? "✅" : "❌"

      if (value > config.threshold) {
        hasRegressions = true
      }

      console.log(
        `${status} ${audit.title}: ${value.toFixed(1)}${config.unit} (threshold: ${config.threshold}${config.unit})`,
      )
    }
  })

  if (hasRegressions) {
    console.log("\n❌ Performance regressions detected!")
    process.exit(1)
  } else {
    console.log("\n✅ All performance metrics within acceptable ranges")
  }
}

// Run comparison
const reportPath = process.argv[2]
if (reportPath && fs.existsSync(reportPath)) {
  comparePerformance(reportPath)
} else {
  console.error("Please provide a valid Lighthouse report path")
  process.exit(1)
}
