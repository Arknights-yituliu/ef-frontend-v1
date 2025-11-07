---
title: 项目常见问题及解决方案
description: 项目开发过程中遇到的常见问题及解决方案
---

# 项目常见问题及解决方案

## better-sqlite3 库构建失败

**问题描述：** better-sqlite3 库构建失败，导致项目无法启动。

**解决方案（Windows 系统）：**

1. 找到项目当前使用的 Node.js 安装根目录（需确保 Node 版本与项目兼容）
2. 以**管理员身份**运行 `install_tools.bat` 文件
   - ⚠️ **注意：** 此步骤可能需要较长时间（约 30 分钟），请耐心等待
3. 安装成功后，进入项目的 `node_modules\better-sqlite3` 目录
4. 在该目录下运行以下命令重新构建：
   ```bash
   node-gyp rebuild --release
   ```
5. 重新构建完成后，返回项目根目录
6. 运行 `nuxt dev` 命令启动项目

---

> 💡 **提示：** 如果问题仍然存在，请确保已安装 Visual Studio Build Tools 或完整的 Visual Studio（包含 C++ 工作负载）。