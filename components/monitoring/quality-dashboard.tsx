"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { qualityGateManager, type QualityGateResult } from "@/lib/monitoring/quality-gates"
import { metricsCollector, type MetricsData } from "@/lib/monitoring/metrics-collector"

export function QualityDashboard() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null)
  const [gateResults, setGateResults] = useState<QualityGateResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const latestMetrics = await metricsCollector.collectMetrics()
        setMetrics(latestMetrics)

        const flatMetrics = {
          "coverage.percentage": latestMetrics.coverage.percentage,
          "lighthouse.performance": latestMetrics.lighthouse.performance,
          "lighthouse.accessibility": latestMetrics.lighthouse.accessibility,
          "security.vulnerabilities.high": latestMetrics.security.vulnerabilities.high,
          "bundle.size.kb": latestMetrics.bundle.size.kb,
          "api.response.time.p95": latestMetrics.api.response.time.p95,
        }

        const results = await qualityGateManager.evaluateGates(flatMetrics)
        setGateResults(results)
      } catch (error) {
        console.error("Failed to load quality metrics:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
    const interval = setInterval(loadData, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return <div className="p-6">Loading quality metrics...</div>
  }

  const passedGates = gateResults.filter((r) => r.passed).length
  const totalGates = gateResults.length
  const overallHealth = (passedGates / totalGates) * 100

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Quality Dashboard</h2>
        <Badge variant={overallHealth >= 80 ? "default" : "destructive"}>
          {passedGates}/{totalGates} Gates Passed
        </Badge>
      </div>

      {/* Overall Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {overallHealth >= 80 ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            Overall Quality Health
          </CardTitle>
          <CardDescription>System-wide quality metrics and gate status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Quality Score</span>
                <span>{overallHealth.toFixed(1)}%</span>
              </div>
              <Progress value={overallHealth} className="h-2" />
            </div>

            {overallHealth < 80 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Quality gates are failing. Review failed gates and take corrective action.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quality Gates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gateResults.map((result) => {
          const gate = qualityGateManager.getGates().find((g) => g.id === result.gateId)
          return (
            <Card key={result.gateId}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  {result.passed ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  {gate?.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current</span>
                    <span className="font-mono">{result.actualValue}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Threshold</span>
                    <span className="font-mono">{result.threshold}</span>
                  </div>
                  <Badge variant={result.passed ? "default" : "destructive"} className="w-full justify-center">
                    {result.passed ? "PASSED" : "FAILED"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Detailed Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Test Coverage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.coverage.percentage}%</div>
              <Progress value={metrics.coverage.percentage} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.lighthouse.performance}</div>
              <div className="text-sm text-muted-foreground">Lighthouse Score</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">API Response</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.api.response.time.p95}ms</div>
              <div className="text-sm text-muted-foreground">95th Percentile</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Bundle Size</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.bundle.size.kb}KB</div>
              <div className="text-sm text-muted-foreground">Uncompressed</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
