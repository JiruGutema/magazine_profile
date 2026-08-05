// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { Html } from "@/components/common/Html";

/**
 * Every piece of admin-authored HTML on the site renders through <Html />, so
 * this is the one place where sanitisation actually reaches the DOM.
 */

describe("Html", () => {
  test("renders allowlisted markup as real elements", () => {
    const { container } = render(<Html html="<p>Hello <strong>world</strong></p>" />);

    expect(screen.getByText("world").tagName).toBe("STRONG");
    expect(container.querySelector("p")).not.toBeNull();
  });

  test("renders a div by default", () => {
    const { container } = render(<Html html="<p>x</p>" />);
    expect(container.firstElementChild?.tagName).toBe("DIV");
  });

  test("honours the `as` prop", () => {
    const { container } = render(<Html as="section" html="<p>x</p>" />);
    expect(container.firstElementChild?.tagName).toBe("SECTION");
  });

  test("passes the className through", () => {
    const { container } = render(<Html className="lead" html="<p>x</p>" />);
    expect(container.firstElementChild).toHaveClass("lead");
  });

  test("does not inject a script element into the DOM", () => {
    const { container } = render(
      <Html html={'<p>safe</p><script>window.pwned = true</script>'} />,
    );

    expect(container.querySelector("script")).toBeNull();
    expect(screen.getByText("safe")).toBeInTheDocument();
  });

  test("does not attach inline event handlers", () => {
    const { container } = render(<Html html={'<p onclick="window.pwned = true">x</p>'} />);

    const paragraph = container.querySelector("p")!;
    expect(paragraph.getAttribute("onclick")).toBeNull();
    expect(paragraph.onclick).toBeNull();
  });

  test("strips javascript: hrefs but keeps the link text", () => {
    const { container } = render(
      <Html html={'<a href="javascript:window.pwned = true">click</a>'} />,
    );

    const anchor = container.querySelector("a")!;
    expect(anchor.getAttribute("href")).toBeNull();
    expect(anchor.textContent).toBe("click");
  });

  test("keeps a safe external link intact", () => {
    render(<Html html={'<a href="https://example.com">example</a>'} />);

    expect(screen.getByRole("link", { name: "example" })).toHaveAttribute(
      "href",
      "https://example.com",
    );
  });

  test("does not render an iframe", () => {
    const { container } = render(
      <Html html={'<iframe src="https://evil.example.com"></iframe>'} />,
    );

    expect(container.querySelector("iframe")).toBeNull();
  });

  test("drops an img with an onerror payload but keeps a safe img", () => {
    const { container } = render(
      <Html html={'<img src="x" onerror="window.pwned = true"><img src="/ok.png" alt="ok">'} />,
    );

    const images = [...container.querySelectorAll("img")];
    expect(images.every((img) => img.getAttribute("onerror") === null)).toBe(true);
    expect(container.querySelector('img[src="/ok.png"]')).not.toBeNull();
  });

  test("renders nothing for empty content", () => {
    const { container } = render(<Html html="" />);
    expect(container.firstElementChild?.innerHTML).toBe("");
  });

  test("keeps table markup used by the content editor", () => {
    const { container } = render(
      <Html html="<table><tbody><tr><td>cell</td></tr></tbody></table>" />,
    );

    expect(container.querySelector("td")?.textContent).toBe("cell");
  });
});
