---
title: Common Questions and Solutions
description: Solutions to common problems encountered during project development
---

# Common Questions and Solutions

## better-sqlite3 Build Failure

**Problem Description:** The better-sqlite3 library build fails, causing the project to fail to start.

**Solution (Windows System):**

1. Find the Node.js installation root directory currently used by the project (ensure the Node version is compatible with the project)
2. Run the `install_tools.bat` file **as administrator**
   - ⚠️ **Note:** This step may take a long time (about 30 minutes), please be patient
3. After successful installation, navigate to the project's `node_modules\better-sqlite3` directory
4. Run the following command in that directory to rebuild:
   ```bash
   node-gyp rebuild --release
   ```
5. After rebuilding is complete, return to the project root directory
6. Run the `nuxt dev` command to start the project

---

> 💡 **Tip:** If the problem persists, ensure you have Visual Studio Build Tools or a complete Visual Studio installation (including C++ workload).

