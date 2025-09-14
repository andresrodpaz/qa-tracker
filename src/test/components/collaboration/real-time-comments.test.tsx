import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@/src/test/utils/test-utils"
import { RealTimeComments } from "@/components/collaboration/real-time-comments"
import userEvent from "@testing-library/user-event"

describe("RealTimeComments", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders comments section with title", () => {
    render(<RealTimeComments ticketId="1" />)

    expect(screen.getByText(/comments/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/add a comment/i)).toBeInTheDocument()
  })

  it("displays existing comments", () => {
    render(<RealTimeComments ticketId="1" />)

    expect(screen.getByText(/sarah chen/i)).toBeInTheDocument()
    expect(screen.getByText(/authentication middleware/i)).toBeInTheDocument()
  })

  it("allows adding new comments", async () => {
    const user = userEvent.setup()
    render(<RealTimeComments ticketId="1" />)

    const commentInput = screen.getByPlaceholderText(/add a comment/i)
    const submitButton = screen.getByRole("button", { name: "" }) // Send icon

    await user.type(commentInput, "This is a test comment")
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/this is a test comment/i)).toBeInTheDocument()
    })
  })

  it("supports comment reactions", async () => {
    const user = userEvent.setup()
    render(<RealTimeComments ticketId="1" />)

    const likeButton = screen.getAllByRole("button", { name: /3/i })[0] // Like button with count
    await user.click(likeButton)

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /4/i })).toBeInTheDocument()
    })
  })

  it("shows typing indicators", async () => {
    render(<RealTimeComments ticketId="1" />)

    // Wait for simulated typing indicator
    await waitFor(
      () => {
        expect(screen.getByText(/typing/i)).toBeInTheDocument()
      },
      { timeout: 15000 },
    )
  })

  it("supports replying to comments", async () => {
    const user = userEvent.setup()
    render(<RealTimeComments ticketId="1" />)

    const replyButton = screen.getByRole("button", { name: /reply/i })
    await user.click(replyButton)

    expect(screen.getByPlaceholderText(/write a reply/i)).toBeInTheDocument()

    await user.type(screen.getByPlaceholderText(/write a reply/i), "Test reply")
    await user.click(screen.getByRole("button", { name: "" })) // Send button

    await waitFor(() => {
      expect(screen.getByText(/test reply/i)).toBeInTheDocument()
    })
  })

  it("shows online status indicators", () => {
    render(<RealTimeComments ticketId="1" />)

    // Check for online indicators (green dots)
    const onlineIndicators = document.querySelectorAll(".bg-green-500")
    expect(onlineIndicators.length).toBeGreaterThan(0)
  })
})
