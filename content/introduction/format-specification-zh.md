---
title: 项目开发格式化规范设置
description: 使用不同的IDE，配置相同的格式化规范，提升Diff可读性
---

# 项目开发格式化规范设置

本文档将帮助你在不同的IDE中配置相同的格式化规范，确保代码风格一致，提升Diff可读性。

---

## 1. Webstorm 配置

### 配置步骤

1. 进入 `Settings -> Languages & Frameworks -> JavaScript -> Prettier`
2. 选择 `Automatic Prettier configuration`

### 格式化快捷键

- **Windows**：键入 `Ctrl+Alt+L` 执行格式化
- **Mac**：键入 `Option+Command+L`（⌥+⌘+L）执行格式化

---

## 2. VSCode 配置

### 配置步骤

1. 安装 `Prettier - Code formatter` 插件
2. 进入 `Settings -> Workspace -> Extensions -> Prettier`
3. 配置 `Prettier: Config Path` 为项目根目录下的 `.prettierrc.json` 文件

### 格式化快捷键

- **Windows**：键入 `Shift+Alt+F` 执行格式化
- **Mac**：键入 `Shift+Option+F`（⇧+⌥+F）执行格式化

---

## 3. Prettier 配置选项说明

本节详细说明 `.prettierrc.json` 中的每个配置项，并附上示例帮助理解。

### `semi: true`

在语句末尾添加分号。

**示例：**

```javascript
// 格式化前
const name = "John"
const age = 30

// 格式化后
const name = "John";
const age = 30;
```

### `singleQuote: true`

使用单引号而不是双引号来包裹字符串。

**示例：**

```javascript
// 格式化前
const message = "Hello, world!";
const title = "Welcome";

// 格式化后
const message = 'Hello, world!';
const title = 'Welcome';
```

### `printWidth: 100`

指定 Prettier 换行的最大行长度。

**示例：**

```javascript
// 格式化前（超长行）
const veryLongVariableName = { firstName: "John", lastName: "Doe", age: 30, email: "john@example.com", address: "123 Main St" };

// 格式化后（在 100 字符处换行）
const veryLongVariableName = {
  firstName: 'John',
  lastName: 'Doe',
  age: 30,
  email: 'john@example.com',
  address: '123 Main St',
};
```

### `tabWidth: 2`

指定每个缩进级别的空格数。

**示例：**

```javascript
// 格式化前（缩进不一致）
function example() {
    if (condition) {
            return true;
    }
}

// 格式化后（每级 2 个空格）
function example() {
  if (condition) {
    return true;
  }
}
```

### `useTabs: false`

使用空格而不是制表符进行缩进。

**示例：**

```javascript
// useTabs: false（使用空格）
function example() {
  if (condition) {
    return true;
  }
}

// useTabs: true（使用制表符）
// function example() {
// 	if (condition) {
// 		return true;
// 	}
// }
```

### `quoteProps: "as-needed"`

仅在必要时为对象属性添加引号。

**示例：**

```javascript
// 格式化前
const obj = {
  "name": "John",
  "age": 30,
  "first-name": "John"
};

// 格式化后（仅在需要时加引号）
const obj = {
  name: 'John',
  age: 30,
  'first-name': 'John', // 带连字符的属性需要引号
};
```

### `bracketSpacing: true`

在对象字面量的大括号内添加空格。

**示例：**

```javascript
// 格式化前
const obj = {name: "John", age: 30};

// 格式化后
const obj = { name: 'John', age: 30 };

// bracketSpacing: false 时
// const obj = {name: 'John', age: 30};
```

### `bracketSameLine: false`

将多行 HTML/JSX 元素的 `>` 放在新行。

**示例：**

```jsx
// 格式化前
<button className="btn" onClick={handleClick}>Click me</button>

// 格式化后（bracketSameLine: false）
<button
  className="btn"
  onClick={handleClick}
>
  Click me
</button>

// bracketSameLine: true 时
// <button
//   className="btn"
//   onClick={handleClick}>
//   Click me
// </button>
```

### `arrowParens: "always"`

箭头函数参数始终使用括号包裹。

**示例：**

```javascript
// 格式化前
const square = x => x * x;
const add = (a, b) => a + b;

// 格式化后
const square = (x) => x * x;
const add = (a, b) => a + b;

// arrowParens: "avoid" 时
// const square = x => x * x;
// const add = (a, b) => a + b; // 多个参数仍需要括号
```

### `endOfLine: "lf"`

使用 LF（换行符）作为行尾字符（Unix 风格）。

**示例：**

```
// Windows 使用 CRLF (\r\n)
// Mac/Linux 使用 LF (\n)
// 此设置确保使用 LF，以保持跨平台一致性
```

### `embeddedLanguageFormatting: "auto"`

自动格式化字符串中嵌入的代码（例如模板字符串中的 CSS）。

**示例：**

```javascript
// 格式化前
const style = `color:red;background:blue;font-size:14px;`;

// 格式化后（embeddedLanguageFormatting: "auto"）
const style = `color: red;
  background: blue;
  font-size: 14px;`;
```

### `htmlWhitespaceSensitivity: "css"`

格式化 HTML 时遵循 CSS 的 display 属性。

**示例：**

```html
<!-- 格式化前 -->
<div><span>Hello</span> <span>World</span></div>

<!-- 格式化后（htmlWhitespaceSensitivity: "css"） -->
<div>
  <span>Hello</span> <span>World</span>
</div>

<!-- htmlWhitespaceSensitivity: "ignore" 时 -->
<!-- <div>
  <span>Hello</span>
  <span>World</span>
</div> -->
```

### `insertPragma: false`

不在文件顶部插入 `@prettier` 或 `@format` 编译指示注释。

**示例：**

```javascript
// insertPragma: false（默认）
const name = 'John';

// insertPragma: true 时
// /**
//  * @prettier
//  */
// const name = 'John';
```

### `proseWrap: "preserve"`

保留 Markdown 和其他文本内容中的原始换行。

**示例：**

```markdown
<!-- 格式化前 -->
这是一段很长的段落，应该保持原来的单行格式。

<!-- 格式化后（proseWrap: "preserve"） -->
这是一段很长的段落，应该保持原来的单行格式。

<!-- proseWrap: "always" 时 -->
<!-- 这是一段很长的段落，
应该被换行以适应
打印宽度。 -->
```

### `requirePragma: false`

不需要 `@prettier` 或 `@format` 编译指示注释即可格式化文件。

**示例：**

```javascript
// requirePragma: false（默认）
// 所有文件都会自动格式化

// requirePragma: true 时
// 只有包含 @prettier 或 @format 注释的文件才会被格式化
// /**
//  * @prettier
//  */
// const name = 'John';
```

### `vueIndentScriptAndStyle: false`

不缩进 Vue 文件中 `<script>` 和 `<style>` 标签的内容。

**示例：**

```vue
<!-- 格式化前 -->
<template>
  <div>Hello</div>
</template>
<script>
export default {
  name: 'Component'
}
</script>

<!-- 格式化后（vueIndentScriptAndStyle: false） -->
<template>
  <div>Hello</div>
</template>
<script>
export default {
  name: 'Component',
};
</script>

<!-- vueIndentScriptAndStyle: true 时 -->
<!-- <template>
  <div>Hello</div>
</template>
<script>
  export default {
    name: 'Component',
  };
</script> -->
```
