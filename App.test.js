import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders a welcome message", () => {
  render(<App />);
  const message = screen.getByText(/welcome/i);
  expect(message).toBeInTheDocument();
});
