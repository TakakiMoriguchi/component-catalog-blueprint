import { afterEach, expect, mock, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "./LoginForm";
import fixtures from "./LoginForm.fixture";

afterEach(cleanup);

test("submits the entered email and password", async () => {
  const onSubmit = mock(() => {});
  render(<LoginForm onSubmit={onSubmit} />);

  await userEvent.type(screen.getByLabelText("Email"), "you@example.com");
  await userEvent.type(screen.getByLabelText("Password"), "correct horse");
  await userEvent.click(screen.getByRole("button", { name: "Sign in" }));

  expect(onSubmit).toHaveBeenCalledWith({ email: "you@example.com", password: "correct horse" });
});

test("shows the server error as an alert", () => {
  render(fixtures["Server error"]);
  expect(screen.getByRole("alert")).toHaveTextContent("Email or password is incorrect.");
});
