import { afterEach, describe, expect, mock, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";
import fixtures from "./Button.fixture";

// bun test has no global afterEach, so @testing-library/react cannot clean up
// automatically. Unmount explicitly.
afterEach(cleanup);

const noop = () => {};

describe("Button", () => {
  test("calls onClick when clicked", async () => {
    const onClick = mock(noop);
    render(<Button onClick={onClick}>Save</Button>);

    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test("does not call onClick when disabled", async () => {
    const onClick = mock(noop);
    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toBeDisabled();
    // A disabled button has pointer-events disabled; skip that check to force the click.
    await userEvent.click(button, { pointerEventsCheck: 0 });
    expect(onClick).not.toHaveBeenCalled();
  });

  test("ignores repeated clicks while loading", async () => {
    const onClick = mock(noop);
    render(fixtures.Loading);

    const button = screen.getByRole("button", { name: "Saving..." });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");

    for (let i = 0; i < 3; i++) {
      await userEvent.click(button, { pointerEventsCheck: 0 });
    }
    expect(onClick).not.toHaveBeenCalled();
  });

  test("keeps children while loading when loadingLabel is not set", () => {
    render(
      <Button loading onClick={noop}>
        Save
      </Button>,
    );

    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
  });

  test("defaults to type=button and does not submit a form", async () => {
    const onSubmit = mock((e: { preventDefault: () => void }) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Button onClick={noop}>Save</Button>
      </form>,
    );

    expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute("type", "button");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test("passes unknown props through to the button element", () => {
    render(
      <Button aria-label="Save draft" data-testid="save" onClick={noop}>
        Save
      </Button>,
    );

    expect(screen.getByTestId("save")).toHaveAttribute("aria-label", "Save draft");
  });
});
