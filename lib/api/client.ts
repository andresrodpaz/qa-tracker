// API client utilities for frontend components
export class ApiClient {
  private baseUrl = "/api"

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`, window.location.origin)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.set(key, value)
      })
    }

    const response = await fetch(url.toString())
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }
    return response.json()
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }
    return response.json()
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }
    return response.json()
  }

  async delete<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`, window.location.origin)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.set(key, value)
      })
    }

    const response = await fetch(url.toString(), {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }
    return response.json()
  }
}

export const apiClient = new ApiClient()

// Typed API methods
export const ticketsApi = {
  getAll: (filters?: {
    status?: string
    assignedTo?: string
    priority?: string
    category?: string
    search?: string
  }) => apiClient.get("/tickets", filters),

  getById: (id: string) => apiClient.get(`/tickets/${id}`),

  create: (data: any) => apiClient.post("/tickets", data),

  update: (id: string, data: any) => apiClient.put(`/tickets/${id}`, data),

  delete: (id: string, userId?: string) => apiClient.delete(`/tickets/${id}`, userId ? { userId } : undefined),
}

export const testCasesApi = {
  getAll: (filters?: {
    status?: string
    assignedTo?: string
    priority?: string
    linkedTicket?: string
  }) => apiClient.get("/test-cases", filters),

  getById: (id: string) => apiClient.get(`/test-cases/${id}`),

  create: (data: any) => apiClient.post("/test-cases", data),

  update: (id: string, data: any) => apiClient.put(`/test-cases/${id}`, data),

  delete: (id: string, userId?: string) => apiClient.delete(`/test-cases/${id}`, userId ? { userId } : undefined),
}

export const testSuitesApi = {
  getAll: () => apiClient.get("/test-suites"),

  create: (data: any) => apiClient.post("/test-suites", data),

  execute: (id: string, data: any) => apiClient.post(`/test-suites/${id}/execute`, data),
}

export const usersApi = {
  getAll: (filters?: { role?: string; isActive?: string }) => apiClient.get("/users", filters),

  create: (data: any) => apiClient.post("/users", data),
}

export const commentsApi = {
  getAll: (ticketId?: string) => apiClient.get("/comments", ticketId ? { ticketId } : undefined),

  create: (data: any) => apiClient.post("/comments", data),
}

export const analyticsApi = {
  get: (period?: string) => apiClient.get("/analytics", period ? { period } : undefined),
}
