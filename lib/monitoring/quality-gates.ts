export interface QualityGate {
  id: string
  name: string
  description: string
  threshold: number
  operator: "gt" | "lt" | "gte" | "lte" | "eq"
  metric: string
  enabled: boolean
}

export interface QualityGateResult {
  gateId: string
  passed: boolean
  actualValue: number
  threshold: number
  message: string
}

export class QualityGateManager {
  private gates: QualityGate[] = [
    {
      id: "test-coverage",
      name: "Test Coverage",
      description: "Minimum test coverage percentage",
      threshold: 80,
      operator: "gte",
      metric: "coverage.percentage",
      enabled: true,
    },
    {
      id: "performance-score",
      name: "Performance Score",
      description: "Lighthouse performance score",
      threshold: 90,
      operator: "gte",
      metric: "lighthouse.performance",
      enabled: true,
    },
    {
      id: "accessibility-score",
      name: "Accessibility Score",
      description: "Lighthouse accessibility score",
      threshold: 95,
      operator: "gte",
      metric: "lighthouse.accessibility",
      enabled: true,
    },
    {
      id: "security-vulnerabilities",
      name: "Security Vulnerabilities",
      description: "Maximum number of high/critical vulnerabilities",
      threshold: 0,
      operator: "lte",
      metric: "security.vulnerabilities.high",
      enabled: true,
    },
    {
      id: "bundle-size",
      name: "Bundle Size",
      description: "Maximum bundle size in KB",
      threshold: 500,
      operator: "lte",
      metric: "bundle.size.kb",
      enabled: true,
    },
    {
      id: "api-response-time",
      name: "API Response Time",
      description: "Maximum API response time in ms",
      threshold: 200,
      operator: "lte",
      metric: "api.response.time.p95",
      enabled: true,
    },
  ]

  async evaluateGates(metrics: Record<string, number>): Promise<QualityGateResult[]> {
    const results: QualityGateResult[] = []

    for (const gate of this.gates.filter((g) => g.enabled)) {
      const actualValue = metrics[gate.metric] ?? 0
      const passed = this.evaluateCondition(actualValue, gate.threshold, gate.operator)

      results.push({
        gateId: gate.id,
        passed,
        actualValue,
        threshold: gate.threshold,
        message: this.generateMessage(gate, actualValue, passed),
      })
    }

    return results
  }

  private evaluateCondition(actual: number, threshold: number, operator: string): boolean {
    switch (operator) {
      case "gt":
        return actual > threshold
      case "lt":
        return actual < threshold
      case "gte":
        return actual >= threshold
      case "lte":
        return actual <= threshold
      case "eq":
        return actual === threshold
      default:
        return false
    }
  }

  private generateMessage(gate: QualityGate, actual: number, passed: boolean): string {
    const status = passed ? "PASSED" : "FAILED"
    return `${gate.name}: ${status} (${actual} ${gate.operator} ${gate.threshold})`
  }

  getGates(): QualityGate[] {
    return [...this.gates]
  }

  updateGate(gateId: string, updates: Partial<QualityGate>): void {
    const index = this.gates.findIndex((g) => g.id === gateId)
    if (index !== -1) {
      this.gates[index] = { ...this.gates[index], ...updates }
    }
  }
}

export const qualityGateManager = new QualityGateManager()
