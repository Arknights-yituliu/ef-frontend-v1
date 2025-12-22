---
title: Project Development Format Specification Setup
description: Configure the same formatting specifications using different IDEs to improve Diff readability
---

# Project Development Format Specification Setup

This document will help you configure the same formatting specifications across different IDEs to ensure consistent code style and improve Diff readability.

---

## 1. Webstorm Configuration

### Configuration Steps

1. Go to `Settings -> Languages & Frameworks -> JavaScript -> Prettier`
2. Select `Automatic Prettier configuration`

### Formatting Shortcuts

- **Windows**: Type `Ctrl+Alt+L` to format
- **Mac**: Type `Option+Command+L` (⌥+⌘+L) to format

---

## 2. VSCode Configuration

### Configuration Steps

1. Install the `Prettier - Code formatter` extension
2. Go to `Settings -> Workspace -> Extensions -> Prettier`
3. Configure `Prettier: Config Path` to the `.prettierrc.json` file in the project root directory

### Formatting Shortcuts

- **Windows**: Type `Shift+Alt+F` to format
- **Mac**: Type `Shift+Option+F` (⇧+⌥+F) to format

---

## 3. Prettier Configuration Options

This section explains each configuration option in `.prettierrc.json` with examples.

### `semi: true`

Adds semicolons at the end of statements.

**Example:**

```javascript
// Before formatting
const name = "John"
const age = 30

// After formatting
const name = "John";
const age = 30;
```

### `singleQuote: true`

Uses single quotes instead of double quotes for strings.

**Example:**

```javascript
// Before formatting
const message = "Hello, world!";
const title = "Welcome";

// After formatting
const message = 'Hello, world!';
const title = 'Welcome';
```

### `printWidth: 100`

Specifies the maximum line length that Prettier will wrap on.

**Example:**

```javascript
// Before formatting (long line)
const veryLongVariableName = { firstName: "John", lastName: "Doe", age: 30, email: "john@example.com", address: "123 Main St" };

// After formatting (wrapped at 100 characters)
const veryLongVariableName = {
  firstName: 'John',
  lastName: 'Doe',
  age: 30,
  email: 'john@example.com',
  address: '123 Main St',
};
```

### `tabWidth: 2`

Specifies the number of spaces per indentation level.

**Example:**

```javascript
// Before formatting (inconsistent indentation)
function example() {
    if (condition) {
            return true;
    }
}

// After formatting (2 spaces per level)
function example() {
  if (condition) {
    return true;
  }
}
```

### `useTabs: false`

Uses spaces instead of tabs for indentation.

**Example:**

```javascript
// With useTabs: false (uses spaces)
function example() {
  if (condition) {
    return true;
  }
}

// With useTabs: true (uses tabs)
// function example() {
// 	if (condition) {
// 		return true;
// 	}
// }
```

### `quoteProps: "as-needed"`

Only adds quotes around object properties when necessary.

**Example:**

```javascript
// Before formatting
const obj = {
  "name": "John",
  "age": 30,
  "first-name": "John"
};

// After formatting (only quotes when needed)
const obj = {
  name: 'John',
  age: 30,
  'first-name': 'John', // Quotes required for hyphenated property
};
```

### `bracketSpacing: true`

Adds spaces inside object literals.

**Example:**

```javascript
// Before formatting
const obj = {name: "John", age: 30};

// After formatting
const obj = { name: 'John', age: 30 };

// With bracketSpacing: false
// const obj = {name: 'John', age: 30};
```

### `bracketSameLine: false`

Puts the `>` of a multi-line HTML/JSX element on a new line.

**Example:**

```jsx
// Before formatting
<button className="btn" onClick={handleClick}>Click me</button>

// After formatting (bracketSameLine: false)
<button
  className="btn"
  onClick={handleClick}
>
  Click me
</button>

// With bracketSameLine: true
// <button
//   className="btn"
//   onClick={handleClick}>
//   Click me
// </button>
```

### `arrowParens: "always"`

Always includes parentheses around arrow function parameters.

**Example:**

```javascript
// Before formatting
const square = x => x * x;
const add = (a, b) => a + b;

// After formatting
const square = (x) => x * x;
const add = (a, b) => a + b;

// With arrowParens: "avoid"
// const square = x => x * x;
// const add = (a, b) => a + b; // Still needs parentheses for multiple params
```

### `endOfLine: "lf"`

Uses LF (Line Feed) as the line ending character (Unix-style).

**Example:**

```
// Windows uses CRLF (\r\n)
// Mac/Linux uses LF (\n)
// This setting ensures LF is used for consistency across platforms
```

### `embeddedLanguageFormatting: "auto"`

Automatically formats code embedded in strings (e.g., CSS in template literals).

**Example:**

```javascript
// Before formatting
const style = `color:red;background:blue;font-size:14px;`;

// After formatting (if embeddedLanguageFormatting: "auto")
const style = `color: red;
  background: blue;
  font-size: 14px;`;
```

### `htmlWhitespaceSensitivity: "css"`

Respects CSS display property when formatting HTML.

**Example:**

```html
<!-- Before formatting -->
<div><span>Hello</span> <span>World</span></div>

<!-- After formatting (htmlWhitespaceSensitivity: "css") -->
<div>
  <span>Hello</span> <span>World</span>
</div>

<!-- With htmlWhitespaceSensitivity: "ignore" -->
<!-- <div>
  <span>Hello</span>
  <span>World</span>
</div> -->
```

### `insertPragma: false`

Does not insert `@prettier` or `@format` pragma comments at the top of files.

**Example:**

```javascript
// With insertPragma: false (default)
const name = 'John';

// With insertPragma: true
// /**
//  * @prettier
//  */
// const name = 'John';
```

### `proseWrap: "preserve"`

Preserves the original line breaks in markdown and other prose content.

**Example:**

```markdown
<!-- Before formatting -->
This is a long paragraph that should remain on a single line as originally written.

<!-- After formatting (proseWrap: "preserve") -->
This is a long paragraph that should remain on a single line as originally written.

<!-- With proseWrap: "always" -->
<!-- This is a long paragraph that
should be wrapped to fit within the
print width. -->
```

### `requirePragma: false`

Does not require `@prettier` or `@format` pragma comments to format files.

**Example:**

```javascript
// With requirePragma: false (default)
// All files are formatted automatically

// With requirePragma: true
// Only files with @prettier or @format comments are formatted
// /**
//  * @prettier
//  */
// const name = 'John';
```

### `vueIndentScriptAndStyle: false`

Does not indent the contents of `<script>` and `<style>` tags in Vue files.

**Example:**

```vue
<!-- Before formatting -->
<template>
  <div>Hello</div>
</template>
<script>
export default {
  name: 'Component'
}
</script>

<!-- After formatting (vueIndentScriptAndStyle: false) -->
<template>
  <div>Hello</div>
</template>
<script>
export default {
  name: 'Component',
};
</script>

<!-- With vueIndentScriptAndStyle: true -->
<!-- <template>
  <div>Hello</div>
</template>
<script>
  export default {
    name: 'Component',
  };
</script> -->
```
