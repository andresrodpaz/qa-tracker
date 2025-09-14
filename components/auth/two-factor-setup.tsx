"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Shield, Smartphone, Key, Copy, Check, AlertCircle } from "lucide-react"
import { useAuth } from "./auth-provider"

export function TwoFactorSetup() {
  const { user, updateUser } = useAuth()
  const [step, setStep] = useState<"setup" | "verify" | "complete">("setup")
  const [qrCode] = useState(
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y5ZmFmYiIvPgogIDx0ZXh0IHg9IjEwMCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSIxNHB4IiBmaWxsPSIjNjc3NDg5Ij5RUiBDb2RlPC90ZXh0Pgo8L3N2Zz4K",
  )
  const [secretKey] = useState("JBSWY3DPEHPK3PXP")
  const [verificationCode, setVerificationCode] = useState("")
  const [backupCodes] = useState(["12345-67890", "23456-78901", "34567-89012", "45678-90123", "56789-01234"])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [copiedSecret, setCopiedSecret] = useState(false)
  const [copiedBackup, setCopiedBackup] = useState(false)

  const handleSetupComplete = async () => {
    setIsLoading(true)
    setError("")

    try {
      // Simulate verification
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (verificationCode === "123456") {
            resolve("success")
          } else {
            reject(new Error("Invalid verification code"))
          }
        }, 1000)
      })

      updateUser({ twoFactorEnabled: true })
      setStep("complete")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string, type: "secret" | "backup") => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === "secret") {
        setCopiedSecret(true)
        setTimeout(() => setCopiedSecret(false), 2000)
      } else {
        setCopiedBackup(true)
        setTimeout(() => setCopiedBackup(false), 2000)
      }
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  if (user?.twoFactorEnabled && step !== "complete") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2 text-green-600" />
            Two-Factor Authentication
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="bg-green-50 border-green-200">
            <Shield className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Two-factor authentication is already enabled for your account.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          Two-Factor Authentication Setup
        </CardTitle>
        <p className="text-muted-foreground">Add an extra layer of security to your account</p>
      </CardHeader>

      <CardContent>
        {step === "setup" && (
          <div className="space-y-6">
            <Alert className="bg-blue-50 border-blue-200">
              <Smartphone className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                You'll need an authenticator app like Google Authenticator, Authy, or 1Password.
              </AlertDescription>
            </Alert>

            <div className="text-center">
              <h3 className="text-lg font-medium mb-4">Scan QR Code</h3>
              <div className="inline-block p-4 bg-white border rounded-lg">
                <img src={qrCode || "/placeholder.svg"} alt="QR Code" className="w-48 h-48" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Or enter this key manually:</Label>
              <div className="flex items-center space-x-2">
                <Input value={secretKey} readOnly className="font-mono" />
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(secretKey, "secret")}>
                  {copiedSecret ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <Button onClick={() => setStep("verify")} className="w-full">
              Continue to Verification
            </Button>
          </div>
        )}

        {step === "verify" && (
          <div className="space-y-6">
            <div className="text-center">
              <Key className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Enter Verification Code</h3>
              <p className="text-muted-foreground">Enter the 6-digit code from your authenticator app</p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Alert className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Demo:</strong> Use code "123456" to complete setup
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                type="text"
                placeholder="000000"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="text-center text-2xl tracking-widest font-mono"
                maxLength={6}
              />
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setStep("setup")} className="flex-1">
                Back
              </Button>
              <Button
                onClick={handleSetupComplete}
                disabled={verificationCode.length !== 6 || isLoading}
                className="flex-1"
              >
                {isLoading ? "Verifying..." : "Verify & Enable"}
              </Button>
            </div>
          </div>
        )}

        {step === "complete" && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Two-Factor Authentication Enabled!</h3>
              <p className="text-muted-foreground">Your account is now protected with two-factor authentication</p>
            </div>

            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <strong>Important:</strong> Save these backup codes in a secure location. You can use them to access
                your account if you lose your authenticator device.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Backup Codes</Label>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(backupCodes.join("\n"), "backup")}>
                  {copiedBackup ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  Copy All
                </Button>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <div className="grid grid-cols-1 gap-2 font-mono text-sm">
                  {backupCodes.map((code, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span>{code}</span>
                      <Badge variant="outline">Unused</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Button onClick={() => window.location.reload()} className="w-full">
              Continue to Dashboard
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
