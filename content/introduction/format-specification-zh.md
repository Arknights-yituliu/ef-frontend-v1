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
