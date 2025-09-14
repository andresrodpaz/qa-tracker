import { handleApiError, ApiError } from "@/lib/utils/error-handler"
import jest from "jest"

describe("Error Handler", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe("handleApiError", () => {
    it("should handle ApiError correctly", () => {
      const apiError = new ApiError("Test error", 400)
      const result = handleApiError(apiError)

      expect(result.error).toBe("Test error")
      expect(result.status).toBe(400)
    })

    it("should handle generic Error", () => {
      const error = new Error("Generic error")
      const result = handleApiError(error)

      expect(result.error).toBe("Generic error")
      expect(result.status).toBe(500)
    })

    it("should handle unknown error types", () => {
      const result = handleApiError("String error")

      expect(result.error).toBe("An unexpected error occurred")
      expect(result.status).toBe(500)
    })

    it("should log errors to console", () => {
      const error = new Error("Test error")
      handleApiError(error)

      expect(console.error).toHaveBeenCalledWith("API Error:", error)
    })
  })

  describe("ApiError class", () => {
    it("should create ApiError with message and status", () => {
      const error = new ApiError("Test message", 404)

      expect(error.message).toBe("Test message")
      expect(error.status).toBe(404)
      expect(error.name).toBe("ApiError")
    })

    it("should default to 500 status", () => {
      const error = new ApiError("Test message")

      expect(error.status).toBe(500)
    })
  })
})
