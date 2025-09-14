// Jest setup file for API tests
import "@testing-library/jest-dom"
import { jest } from "@jest/globals"

// Mock crypto.randomUUID for consistent test IDs
Object.defineProperty(global, "crypto", {
  value: {
    randomUUID: jest.fn(() => "mock-uuid-" + Math.random().toString(36).substr(2, 9)),
  },
})

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
}

// Mock fetch for API tests
global.fetch = jest.fn()

// Mock window.location
Object.defineProperty(window, "location", {
  value: {
    origin: "http://localhost:3000",
    href: "http://localhost:3000",
  },
  writable: true,
})

// Reset all mocks before each test
const beforeEach = global.beforeEach
beforeEach(() => {
  jest.clearAllMocks()
})
