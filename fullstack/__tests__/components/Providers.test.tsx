import { render, screen } from "@testing-library/react";
import React from "react";
import Providers from "@/components/Providers";

// Mock next-auth/react
vi.mock("next-auth/react", () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="session-provider">{children}</div>
  ),
}));

describe("Providers", () => {
  it("should render children wrapped in SessionProvider", () => {
    render(
      <Providers>
        <div data-testid="test-child">Test Content</div>
      </Providers>
    );

    expect(screen.getByTestId("session-provider")).toBeInTheDocument();
    expect(screen.getByTestId("test-child")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("should wrap children properly", () => {
    const { container } = render(
      <Providers>
        <span>Client Component</span>
      </Providers>
    );
    expect(container).toBeInTheDocument();
    expect(screen.getByText("Client Component")).toBeInTheDocument();
  });
});
