# 🚀 JavaScript `async` vs `defer` vs Normal Script — Complete Guide

A complete guide to understanding how browsers load and execute `<script>` tags — covering **normal**, **`async`**, and **`defer`** — with examples and real production use cases.

---

## 📚 Table of Contents

1. [How the Browser Parses HTML & Scripts](#-how-the-browser-parses-html--scripts)
2. [Normal `<script>` (No Attribute)](#-normal-script-no-attribute)
3. [`async` Attribute](#-async-attribute)
4. [`defer` Attribute](#-defer-attribute)
5. [Visual Timeline Comparison](#-visual-timeline-comparison)
6. [Key Differences (Comparison Table)](#-key-differences-comparison-table)
7. [Production Use Cases](#-production-use-cases)
8. [Best Practices](#-best-practices)
9. [Common Mistakes](#-common-mistakes-to-avoid)
10. [Interview Questions](#-interview-questions)
11. [Cheat Sheet](#-cheat-sheet)
12. [Official Documentation](#-official-documentation)

---

## 🔹 How the Browser Parses HTML & Scripts

When a browser loads an HTML page, it parses the document **top to bottom**, building the DOM as it goes. By default, whenever it hits a `<script>` tag, it must **stop parsing**, fetch the script (if external), execute it, and only then continue parsing the rest of the HTML.

This blocking behavior is exactly what `async` and `defer` were introduced to solve.

```html
<!DOCTYPE html>
<html>
<head>
  <script src="app.js"></script> <!-- Blocks HTML parsing here -->
</head>
<body>
  <h1>My Page</h1>
</body>
</html>
```

In the example above, the browser won't render `<h1>My Page</h1>` until `app.js` is fully downloaded **and** executed — causing a blank screen delay.

---

## 🔹 Normal `<script>` (No Attribute)

A regular `<script>` tag (no `async` or `defer`) is:

- **Parser-blocking**: HTML parsing pauses when the script is encountered
- **Fetched synchronously**: the browser stops to download the script file
- **Executed immediately**: as soon as it's downloaded, before continuing to parse the rest of the page

```html
<head>
  <script src="analytics.js"></script>
</head>
<body>
  <!-- This content waits until analytics.js downloads AND runs -->
  <h1>Welcome!</h1>
</body>
```

**Execution order:** Scripts run in the exact order they appear in the document.

> ⚠️ This is why traditional advice was to place `<script>` tags at the **bottom of `<body>`** — so the HTML renders first, and scripts run last.

---

## 🔹 `async` Attribute

```html
<script async src="script.js"></script>
```

With `async`:

- The script is **downloaded in parallel** while HTML parsing continues (non-blocking fetch)
- As soon as the download **finishes**, HTML parsing is **paused** and the script executes immediately
- **Execution order is NOT guaranteed** — scripts run in whichever order they finish downloading, not the order they appear in the HTML

```html
<head>
  <script async src="script-a.js"></script>
  <script async src="script-b.js"></script>
</head>
```

> If `script-b.js` is smaller and downloads faster, it may execute **before** `script-a.js`, even though it appears second in the HTML.

**Best for:** Independent scripts with no dependencies on the DOM or on each other — e.g., analytics, ads.

---

## 🔹 `defer` Attribute

```html
<script defer src="script.js"></script>
```

With `defer`:

- The script is **downloaded in parallel** while HTML parsing continues (non-blocking fetch)
- Execution is **delayed** until the **entire HTML document has been parsed** (right before `DOMContentLoaded` fires)
- **Execution order IS guaranteed** — deferred scripts run in the exact order they appear in the HTML

```html
<head>
  <script defer src="script-a.js"></script>
  <script defer src="script-b.js"></script>
</head>
```

> `script-a.js` will **always** execute before `script-b.js`, regardless of download speed.

**Best for:** Scripts that depend on the DOM being fully built, or that depend on each other (e.g., a main app script that relies on a utility library loaded before it).

---

## 🔹 Visual Timeline Comparison

```
Normal <script>:
HTML Parse ---[STOP]--- Fetch Script ---[STOP]--- Execute Script ---> HTML Parse continues

async:
HTML Parse ---------------------> (continues)
             \_ Fetch Script (parallel) _/
                                        [STOP]--- Execute Script ---> HTML Parse continues

defer:
HTML Parse ------------------------------------> HTML Parse COMPLETE
             \_ Fetch Script (parallel) _/                |
                                                    Execute Script (in order)
                                                            |
                                                    DOMContentLoaded fires
```

---

## 🔹 Key Differences (Comparison Table)

| Feature | Normal | `async` | `defer` |
|---|---|---|---|
| Blocks HTML parsing during download | ✅ Yes | ❌ No (parallel fetch) | ❌ No (parallel fetch) |
| Blocks HTML parsing during execution | ✅ Yes | ✅ Yes (as soon as downloaded) | ❌ No (waits until parsing is done) |
| Execution timing | Immediately, in document order | As soon as downloaded (unpredictable timing) | After HTML parsing completes, before `DOMContentLoaded` |
| Execution order guaranteed | ✅ Yes (document order) | ❌ No (download-speed dependent) | ✅ Yes (document order) |
| Can safely access full DOM | ❌ Only if placed after DOM elements | ❌ Not guaranteed | ✅ Yes, always |
| Best for | Small critical inline scripts | Independent 3rd-party scripts (ads, analytics) | App scripts, scripts with dependencies |

---

## 🔹 Production Use Cases

### 1. `defer` — Loading Your Main Application Bundle

The most common production use case: your primary JS bundle (React/Vue/vanilla app) needs the full DOM and must run in a predictable order relative to other scripts.

```html
<head>
  <script defer src="/dist/vendor.js"></script>
  <script defer src="/dist/app.js"></script>
</head>
<body>
  <div id="root"></div>
</body>
```

> `vendor.js` (e.g., React, libraries) is guaranteed to execute **before** `app.js`, and both wait until the DOM (including `<div id="root">`) is fully parsed — safe for `document.getElementById('root')` calls.

### 2. `async` — Third-Party Analytics & Tracking Scripts

Analytics scripts (Google Analytics, Meta Pixel, etc.) don't depend on your DOM or other scripts — they just need to load and fire as fast as possible without blocking page rendering.

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"></script>
```

### 3. `async` — Ad Network Scripts

Ad scripts are independent, non-critical, and shouldn't delay the user from seeing page content.

```html
<script async src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"></script>
```

### 4. `defer` — Loading Multiple Interdependent Utility Scripts (Legacy/Non-bundled Sites)

For older sites not using a bundler, `defer` ensures dependency order without manual callback chaining.

```html
<script defer src="/js/jquery.js"></script>
<script defer src="/js/jquery-plugin.js"></script> <!-- depends on jquery -->
<script defer src="/js/main.js"></script> <!-- depends on both above -->
```

### 5. Normal (No Attribute) — Small Critical Inline/Blocking Scripts

Used rarely today, but still valid for tiny scripts that must run **immediately** and **block** rendering intentionally — e.g., setting a critical feature-detection class on `<html>` before any content paints (to avoid a flash of unstyled content).

```html
<head>
  <script>
    // Runs immediately, blocking, before body renders — avoids FOUC
    document.documentElement.classList.add(
      'js-enabled',
      window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    );
  </script>
</head>
```

### 6. `defer` — Web Performance Optimization (Core Web Vitals)

Using `defer` for all non-critical scripts is a standard recommendation from Google's Lighthouse/PageSpeed Insights to reduce **Time to Interactive (TTI)** and eliminate render-blocking resources, directly improving Core Web Vitals scores.

```html
<!-- Before optimization: blocks rendering -->
<script src="/js/heavy-library.js"></script>

<!-- After optimization: non-blocking, DOM-safe -->
<script defer src="/js/heavy-library.js"></script>
```

### 7. Mixing `async` and `defer` Correctly in a Real Site

```html
<head>
  <!-- Critical app logic: needs DOM, needs order -->
  <script defer src="/dist/vendor.js"></script>
  <script defer src="/dist/app.js"></script>

  <!-- Independent third-party scripts: fire whenever ready -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"></script>
  <script async src="https://widget.chat-provider.com/embed.js"></script>
</head>
```

---

## 🔹 Best Practices

- ✅ Use `defer` for your main application scripts, especially anything that manipulates the DOM
- ✅ Use `async` for independent third-party scripts (analytics, ads, chat widgets) that don't depend on your app or the DOM
- ✅ Avoid normal blocking `<script>` tags in `<head>` for anything non-critical — it hurts page load performance
- ✅ If you must use a blocking script, place it at the **end of `<body>`** so it doesn't delay initial rendering
- ✅ Never rely on execution order between multiple `async` scripts — treat each as fully independent
- ✅ Both `async` and `defer` only work on **external scripts** (`src="..."`) — they have no effect on inline `<script>` blocks without a `src`
- ✅ `defer` scripts always execute before `DOMContentLoaded`, but after the document is parsed — safe to use `document.querySelector` freely
- ✅ Combine with modern bundlers (Vite, Webpack) — most output modern `<script type="module">` tags, which are **deferred by default**

---

## 🔹 Common Mistakes to Avoid

| ❌ Mistake | ✅ Correct Approach |
|---|---|
| Using `async` for a script that depends on the DOM being ready | Use `defer` instead — `async` gives no guarantee the DOM is fully parsed |
| Using `async` on multiple scripts that depend on each other | Use `defer` — it preserves document order; `async` does not |
| Adding `async`/`defer` to an inline script (no `src`) expecting an effect | These attributes only affect **external** scripts; inline scripts always run immediately when encountered |
| Assuming `defer` scripts run before `DOMContentLoaded` in relation to other `defer` scripts randomly | `defer` scripts run in **document order**, always, before `DOMContentLoaded` |
| Placing blocking scripts in `<head>` without `async`/`defer` | Move to bottom of `<body>` or add `defer` to avoid blocking initial render |
| Thinking `defer` delays the fetch too | Both `async` and `defer` fetch in parallel immediately — only **execution** timing differs |
| Forgetting that `async` scripts can execute **before** the DOM is fully parsed, causing `null` errors on `document.getElementById()` | Wrap DOM access in `DOMContentLoaded` listener, or use `defer` instead |

**Example of the DOM-not-ready mistake:**
```html
<script async src="script.js"></script>
<div id="app"></div>

<script>
  // Inside script.js:
  const el = document.getElementById('app'); 
  console.log(el); // Might log `null` if script.js finishes downloading
                    // and executes BEFORE this <div> is parsed!
</script>
```

---

## 🔹 Interview Questions

**1. What's the default behavior of a `<script>` tag with no attributes?**
> It's parser-blocking and executes immediately at its position in the document — the browser pauses HTML parsing to fetch and run it before continuing.

**2. What's the main difference between `async` and `defer`?**
> `async` executes the script as soon as it finishes downloading (potentially before the DOM is fully parsed, and in an unpredictable order relative to other scripts). `defer` waits until the entire document is parsed before executing, and always preserves document order.

**3. Do `async` and `defer` block HTML parsing during the download phase?**
> No — both fetch the script in parallel with HTML parsing, unlike a normal script which blocks parsing during the fetch too.

**4. If you have two `async` scripts, is their execution order guaranteed?**
> No. Whichever script finishes downloading first executes first — it has nothing to do with their order in the HTML.

**5. If you have two `defer` scripts, is their execution order guaranteed?**
> Yes. `defer` scripts always execute in the order they appear in the document, regardless of download speed.

**6. When would you choose `async` over `defer`?**
> When a script is fully independent — doesn't touch the DOM, doesn't depend on other scripts, and you want it to run as early as possible (e.g., analytics or ad scripts).

**7. Do `async`/`defer` work on inline scripts (without `src`)?**
> No — both attributes are ignored on scripts without a `src` attribute; inline scripts always execute immediately, synchronously, at their position.

**8. Where do `defer` scripts run relative to the `DOMContentLoaded` event?**
> They always execute **before** `DOMContentLoaded` fires — the event only fires after all deferred scripts have finished executing.

**9. Why might placing a script at the bottom of `<body>` (old technique) achieve something similar to `defer`?**
> Because by the time the browser reaches the bottom of `<body>`, it has already parsed the DOM above it — so the script can safely access those elements, similar to how `defer` guarantees a fully-parsed DOM, though `defer` is more flexible since it doesn't require moving the tag.

---

## 🔹 Cheat Sheet

```html
<!-- Normal: blocks parsing, executes immediately, in order -->
<script src="script.js"></script>

<!-- async: parallel download, executes ASAP (order NOT guaranteed) -->
<script async src="script.js"></script>

<!-- defer: parallel download, executes after full parse (order guaranteed) -->
<script defer src="script.js"></script>

<!-- ES Modules: deferred by default automatically -->
<script type="module" src="app.js"></script>
```

**Quick decision guide:**
- Need DOM access / dependency order? → `defer`
- Fully independent 3rd-party script? → `async`
- Tiny critical script that must block render (rare)? → normal, placed carefully

---

## 🔹 Official Documentation

- 📘 MDN — `<script>` element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script
- 📘 MDN — `async` attribute: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#async
- 📘 MDN — `defer` attribute: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#defer
- 📘 web.dev — Efficiently load third-party JavaScript: https://web.dev/efficiently-load-third-party-javascript/
- 📘 HTML Living Standard — Script processing model: https://html.spec.whatwg.org/multipage/scripting.html#the-script-element

---

### ⭐ Final Note

Choosing between normal, `async`, and `defer` script loading directly impacts your site's perceived performance and Core Web Vitals. As a rule of thumb: **use `defer` for your own app code**, and **use `async` for independent third-party scripts** — this combination gives you both fast page rendering and predictable, DOM-safe application behavior.

Happy coding! 🎉