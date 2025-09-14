"use client"

import { RegisterForm } from "@/components/auth/register-form"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()

  const handleRegisterSuccess = () => {
    router.push("/auth/login")
  }

  return <RegisterForm onSuccess={handleRegisterSuccess} />
}
