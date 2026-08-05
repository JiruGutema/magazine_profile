import { describe, expect, test } from "vitest";
import { isSafeUrl, sanitizeHtml } from "@/lib/sanitize";

describe("isSafeUrl", () => {
  test.each([
    ["#top", "fragment anchors"],
    ["/about", "absolute site paths"],
    ["./page", "same-directory relative paths"],
    ["../page", "parent relative paths"],
    ["https://example.com", "https URLs"],
    ["http://example.com", "http URLs"],
    ["HTTPS://EXAMPLE.COM", "uppercase schemes"],
    ["mailto:someone@example.com", "mailto links"],
    ["tel:+251900000000", "tel links"],
  ])("accepts %s (%s)", (url) => {
    expect(isSafeUrl(url)).toBe(true);
  });

  test.each([
    ["javascript:alert(1)", "the javascript scheme"],
    ["JaVaScRiPt:alert(1)", "case-varied javascript"],
    ["  javascript:alert(1)", "javascript behind leading whitespace"],
    ["data:text/html;base64,PHNjcmlwdD4=", "data URLs"],
    ["vbscript:msgbox(1)", "vbscript"],
    ["", "the empty string"],
    ["   ", "whitespace only"],
    ["example.com", "bare hostnames with no scheme"],
  ])("rejects %s (%s)", (url) => {
    expect(isSafeUrl(url)).toBe(false);
  });

  test("accepts protocol-relative URLs, which resolve off-site", () => {
    // Documents current behaviour: `//host` starts with `/` so it passes the
    // relative-path check. Not script execution, but it does leave the site.
    expect(isSafeUrl("//evil.example.com/x")).toBe(true);
  });
});

describe("sanitizeHtml", () => {
  test.each([
    [null],
    [undefined],
    [""],
  ])("returns an empty string for %s", (input) => {
    expect(sanitizeHtml(input)).toBe("");
  });

  test("keeps allowlisted tags and their attributes", () => {
    const html = '<p class="lead">Hello <strong>world</strong></p>';
    expect(sanitizeHtml(html)).toBe(html);
  });

  test("removes script elements together with their contents", () => {
    expect(sanitizeHtml('<p>ok</p><script>alert(1)</script>')).toBe("<p>ok</p>");
  });

  test.each([
    ["style", "<style>body{display:none}</style>"],
    ["iframe", '<iframe src="https://evil.example.com"></iframe>'],
    ["object", "<object data=x></object>"],
    ["embed", "<embed src=x></embed>"],
    ["noscript", "<noscript>nope</noscript>"],
    ["template", "<template>hidden</template>"],
    ["form", "<form action=/steal></form>"],
    ["input", "<input value=x></input>"],
    ["button", "<button>go</button>"],
  ])("drops <%s> and everything inside it", (_name, html) => {
    expect(sanitizeHtml(`<p>before</p>${html}<p>after</p>`)).toBe(
      "<p>before</p><p>after</p>",
    );
  });

  test("drops an unclosed script tag even though it has no closing pair", () => {
    // The paired-element regex cannot match, so the tag allowlist must catch it.
    expect(sanitizeHtml('<script src="https://evil.example.com/x.js">')).toBe("");
  });

  test("strips inline event handlers", () => {
    expect(sanitizeHtml('<p onclick="steal()">text</p>')).toBe("<p>text</p>");
    expect(sanitizeHtml('<p ONMOUSEOVER="steal()">text</p>')).toBe("<p>text</p>");
  });

  test("strips javascript: URLs but keeps the element", () => {
    expect(sanitizeHtml('<a href="javascript:alert(1)">click</a>')).toBe(
      "<a>click</a>",
    );
  });

  test("neutralises the classic img onerror payload", () => {
    expect(sanitizeHtml("<img src=x onerror=alert(1)>")).toBe("<img />");
  });

  test("keeps safe links intact", () => {
    expect(
      sanitizeHtml('<a href="https://example.com" target="_blank" rel="noopener">x</a>'),
    ).toBe('<a href="https://example.com" target="_blank" rel="noopener">x</a>');
  });

  test("drops attributes that are not on the allowlist", () => {
    expect(sanitizeHtml('<p data-secret="1" style="color:red">x</p>')).toBe(
      "<p>x</p>",
    );
  });

  test("removes unknown tags but preserves their text", () => {
    expect(sanitizeHtml("<marquee>keep this</marquee>")).toBe("keep this");
    expect(sanitizeHtml("<custom-el>text</custom-el>")).toBe("text");
  });

  test("removes HTML comments", () => {
    expect(sanitizeHtml("<p>a</p><!-- [if IE]><script>x</script><![endif] --><p>b</p>")).toBe(
      "<p>a</p><p>b</p>",
    );
  });

  test("self-closes void elements", () => {
    expect(sanitizeHtml("<br>")).toBe("<br />");
    expect(sanitizeHtml("<hr>")).toBe("<hr />");
    expect(sanitizeHtml('<img src="/a.png" alt="a">')).toBe(
      '<img src="/a.png" alt="a" />',
    );
  });

  test("normalises tag casing", () => {
    expect(sanitizeHtml("<P>text</P>")).toBe("<p>text</p>");
  });

  test("escapes double quotes inside attribute values", () => {
    expect(sanitizeHtml(`<p title='he said "hi"'>x</p>`)).toBe(
      '<p title="he said &quot;hi&quot;">x</p>',
    );
  });

  test("keeps table markup used by the projects table", () => {
    const html =
      '<table><thead><tr><th colspan="2">h</th></tr></thead><tbody><tr><td>c</td></tr></tbody></table>';
    expect(sanitizeHtml(html)).toBe(html);
  });

  test("does not leave an executable tag behind for a nested-tag bypass", () => {
    const output = sanitizeHtml("<scr<script>ipt>alert(1)</script>");
    expect(output).not.toMatch(/<script/i);
  });

  test("is idempotent — sanitising twice changes nothing further", () => {
    const dirty = '<p onclick="x">a<script>b</script><a href="javascript:c">d</a></p>';
    const once = sanitizeHtml(dirty);
    expect(sanitizeHtml(once)).toBe(once);
  });
});
