import { describe, it, expect, beforeEach, afterEach } from "@jest/globals"
import { NextRequest } from "next/server"
import { GET, POST } from "@/app/api/users/route"
import jest from "jest" // Declare the jest variable

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, "localStorage", { value: localStorageMock })

describe("/api/users", () => {
  beforeEach(() => {
    localStorageMock.clear.mockClear()
    localStorageMock.getItem.mockReturnValue("[]")
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("GET /api/users", () => {
    it("should return all users", async () => {
      const mockUsers = [
        {
          id: "user-1",
          email: "admin@test.com",
          name: "Admin User",
          role: "admin",
          isActive: true,
        },
        {
          id: "user-2",
          email: "agent@test.com",
          name: "Agent User",
          role: "agent",
          isActive: false,
        },
      ]

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUsers))

      const request = new NextRequest("http://localhost:3000/api/users")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.users).toHaveLength(2)
      expect(data.users[0].email).toBe("admin@test.com")
      expect(data.users[1].email).toBe("agent@test.com")
    })

    it("should filter users by role", async () => {
      const mockUsers = [
        { id: "user-1", role: "admin", isActive: true },
        { id: "user-2", role: "agent", isActive: true },
        { id: "user-3", role: "manager", isActive: true },
      ]

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUsers))

      const request = new NextRequest("http://localhost:3000/api/users?role=admin")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.users).toHaveLength(1)
      expect(data.users[0].role).toBe("admin")
    })

    it("should filter users by active status", async () => {
      const mockUsers = [
        { id: "user-1", role: "admin", isActive: true },
        { id: "user-2", role: "agent", isActive: false },
      ]

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUsers))

      const request = new NextRequest("http://localhost:3000/api/users?isActive=true")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.users).toHaveLength(1)
      expect(data.users[0].isActive).toBe(true)
    })
  })

  describe("POST /api/users", () => {
    it("should create a new user successfully", async () => {
      const userData = {
        email: "newuser@test.com",
        name: "New User",
        role: "agent",
        avatar: "/avatar.png",
      }

      const request = new NextRequest("http://localhost:3000/api/users", {
        method: "POST",
        body: JSON.stringify(userData),
        headers: { "Content-Type": "application/json" },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.user).toBeDefined()
      expect(data.user.email).toBe(userData.email)
      expect(data.user.name).toBe(userData.name)
      expect(data.user.role).toBe(userData.role)
      expect(data.user.isActive).toBe(true)
      expect(data.user.id).toBeDefined()
    })

    it("should return 400 for missing required fields", async () => {
      const incompleteData = {
        email: "incomplete@test.com",
        // Missing name and role
      }

      const request = new NextRequest("http://localhost:3000/api/users", {
        method: "POST",
        body: JSON.stringify(incompleteData),
        headers: { "Content-Type": "application/json" },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("Missing required fields")
    })

    it("should return 409 for duplicate email", async () => {
      const existingUser = {
        id: "user-1",
        email: "existing@test.com",
        name: "Existing User",
        role: "agent",
      }

      localStorageMock.getItem.mockReturnValue(JSON.stringify([existingUser]))

      const duplicateUserData = {
        email: "existing@test.com",
        name: "Duplicate User",
        role: "admin",
      }

      const request = new NextRequest("http://localhost:3000/api/users", {
        method: "POST",
        body: JSON.stringify(duplicateUserData),
        headers: { "Content-Type": "application/json" },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(409)
      expect(data.error).toBe("User with this email already exists")
    })
  })
})
