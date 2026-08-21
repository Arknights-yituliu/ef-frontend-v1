<template>
  <div>
    <v-sheet class="mx-auto">
      <v-slide-group>
        <v-slide-group-item>
          <v-img
            :min-width="500"
            src="https://cos.yituliu.cn/endfield/oea/assets/oea-image-1.webp"
          />
        </v-slide-group-item>
        <v-slide-group-item>
          <v-img
            :min-width="500"
            src="https://cos.yituliu.cn/endfield/oea/assets/oea-image-2.webp"
          />
        </v-slide-group-item>
      </v-slide-group>
    </v-sheet>
    <v-container class="page-container">
      <h1>OEA - 终末地档案查漏补缺</h1>

      <!-- 头部按钮：下载 / GitHub / QQ 交流群 -->
      <div class="d-flex flex-wrap ga-2 my-4">
        <v-btn
          color="primary"
          :loading="mirrorDownloading"
          prepend-icon="mdi-cloud-download"
          @click="openMirrorDialog"
        >
          下载最新版（Mirror酱）
        </v-btn>
        <v-btn :loading="githubDownloading" prepend-icon="mdi-download" @click="downloadFromGithub">
          下载最新版（GitHub）
        </v-btn>
        <v-btn
          href="https://github.com/Logical-Byte/open-endfield-assistant"
          prepend-icon="mdi-github"
          rel="noopener noreferrer"
          target="_blank"
        >
          GitHub 仓库
        </v-btn>
        <v-btn
          color="#18a6bd"
          href="https://qm.qq.com/cgi-bin/qm/qr?k=khxbEudh62jRo1KzV_ZnnGqM3Ueq6Yms"
          prepend-icon="mdi-qqchat"
          rel="noopener noreferrer"
          target="_blank"
        >
          反馈交流群：954628501
        </v-btn>
      </div>

      <!-- 新手提示 -->
      <h2>新手提示</h2>
      <ol>
        <li>
          打开终末地，调成 <strong class="text-primary">1280 × 720</strong>、<strong
            class="text-primary"
            >简体中文</strong
          >
        </li>
        <li><strong class="text-primary">关闭 HDR</strong>，关闭性能监控软件</li>
        <li>终末地打开<strong class="text-primary">档案库界面</strong></li>
        <li>点击左上角<strong class="text-primary">开始扫描</strong></li>
        <li>扫完点击右上角<strong class="text-primary">导出到地图集</strong></li>
      </ol>

      <!-- 操作说明 -->
      <h2>操作说明</h2>
      <p class="font-weight-bold text-h6">使用前准备</p>
      <ul>
        <li>
          理论上支持任意 <strong class="text-primary">16:9</strong> 的分辨率。我们最建议使用
          <strong class="text-primary">1280 × 720</strong>、<strong class="text-primary"
            >窗口模式</strong
          >，这个分辨率可以兼顾准确性和性能。
        </li>
        <li>
          理论上目前支持从任意档案库界面、协议终端界面和大世界界面开始扫描，为了稳定性，建议始终从<strong
            class="text-primary"
            >档案库主界面</strong
          >开始扫描。
        </li>
        <li>请将终末地的语言调成<strong class="text-primary">简体中文</strong>。</li>
        <li>请<strong class="text-primary">关闭 HDR</strong>，关闭任何会遮挡终末地窗口的软件。</li>
      </ul>
      <p class="font-weight-bold text-h6">快捷键</p>
      <ul>
        <li>
          按
          <v-hotkey
            inline
            keys="'"
            variant="flat"
          />（引号键）开始扫描档案库；扫描过程中再次按下可停止
        </li>
        <li>
          按 <v-hotkey display-mode="text" inline keys="Alt+DELETE" variant="flat" /> 退出程序
        </li>
      </ul>

      <!-- 已知问题 -->
      <h2>已知问题</h2>
      <ol>
        <li>
          存在 2 个不同的档案，名称都为「挂在竹子上的字条」。OEA
          目前无法区分二者，目前只要识别到其一就认为 2 个档案都已收集。
        </li>
      </ol>

      <!-- 常见问题 -->
      <h2>常见问题</h2>
      <v-expansion-panels variant="accordion">
        <v-expansion-panel title="手机能用吗？">
          <v-expansion-panel-text>
            <p>不能。OEA 仅支持 Windows 10 / 11（x86_64）。</p>
          </v-expansion-panel-text>
        </v-expansion-panel>
        <v-expansion-panel title="识别结果不准确怎么办？">
          <v-expansion-panel-text>
            <p>可以使用输入框进行人工纠错。建议将识别错误告知我们，以便改进识别算法。</p>
          </v-expansion-panel-text>
        </v-expansion-panel>
        <v-expansion-panel title="OEA 收费吗？">
          <v-expansion-panel-text>
            <p>
              OEA 开源且免费，不会以任何形式收取费用。
              <br />
              您可以前往
              <a
                class="text-primary text-decoration-none"
                href="https://github.com/Logical-Byte/open-endfield-assistant/releases"
                rel="noopener noreferrer"
                target="_blank"
                >GitHub Release</a
              >
              免费下载和使用 OEA。
              <br />
              如果您是通过付费方式获取的 OEA，您可能已经被不法商家欺骗，请立即告知我们。
            </p>
          </v-expansion-panel-text>
        </v-expansion-panel>
        <v-expansion-panel title="OEA 和 Mirror酱的关系是什么？">
          <v-expansion-panel-text>
            <p>
              <a
                class="text-primary text-decoration-none"
                href="https://mirrorchyan.com/"
                rel="noopener noreferrer"
                target="_blank"
                >Mirror酱</a
              >
              是独立的第三方应用分发平台，提供加速下载服务，需要付费使用。OEA
              本身不收取任何费用，也提供免费的下载渠道，您可以前往
              <a
                class="text-primary text-decoration-none"
                href="https://github.com/Logical-Byte/open-endfield-assistant/releases"
                rel="noopener noreferrer"
                target="_blank"
                >GitHub Release</a
              >
              免费下载和使用。
            </p>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

      <!-- 反馈交流 -->
      <h2>反馈交流</h2>
      <div class="d-flex flex-wrap ga-2">
        <v-btn
          color="#18a6bd"
          href="https://qm.qq.com/cgi-bin/qm/qr?k=khxbEudh62jRo1KzV_ZnnGqM3Ueq6Yms"
          prepend-icon="mdi-qqchat"
          rel="noopener noreferrer"
          target="_blank"
        >
          反馈交流群：954628501
        </v-btn>
        <v-btn
          href="https://github.com/Logical-Byte/open-endfield-assistant/issues"
          prepend-icon="mdi-github"
          rel="noopener noreferrer"
          target="_blank"
        >
          提交 GitHub Issue
        </v-btn>
      </div>
      <p class="text-body-2 text-medium-emphasis">
        遇到问题或建议，欢迎反馈并附上应用目录下 <code>logs/</code> 中的日志文件，便于定位问题。
      </p>

      <!-- 致谢 -->
      <h2>致谢</h2>
      <div class="d-flex flex-column align-start">
        <a
          class="text-primary text-decoration-none d-inline-flex align-center ga-1"
          href="https://ef.yituliu.cn/"
          rel="noopener noreferrer"
          target="_blank"
        >
          终末地一图流
          <v-icon icon="mdi-open-in-new" size="small" />
        </a>
        <a
          class="text-primary text-decoration-none d-inline-flex align-center ga-1"
          href="https://oem.re/"
          rel="noopener noreferrer"
          target="_blank"
        >
          终末地地图集
          <v-icon icon="mdi-open-in-new" size="small" />
        </a>
        <a
          class="text-primary text-decoration-none d-inline-flex align-center ga-1"
          href="https://space.bilibili.com/688411531"
          rel="noopener noreferrer"
          target="_blank"
        >
          逻辑元LogicalByte
          <v-icon icon="mdi-open-in-new" size="small" />
        </a>
        <a
          class="text-primary text-decoration-none d-inline-flex align-center ga-1"
          href="https://mirrorchyan.com/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Mirror酱
          <v-icon icon="mdi-open-in-new" size="small" />
        </a>
        <a
          class="text-primary text-decoration-none d-inline-flex align-center ga-1"
          href="https://github.com/MaaXYZ/MaaFramework"
          rel="noopener noreferrer"
          target="_blank"
        >
          MaaXYZ/MaaFramework
          <v-icon icon="mdi-github" size="small" />
        </a>
        <a
          class="text-primary text-decoration-none d-inline-flex align-center ga-1"
          href="https://github.com/MistEO/MXU"
          rel="noopener noreferrer"
          target="_blank"
        >
          MistEO/MXU
          <v-icon icon="mdi-github" size="small" />
        </a>
        <a
          class="text-primary text-decoration-none d-inline-flex align-center ga-1"
          href="https://github.com/MaaEnd/MaaEnd"
          rel="noopener noreferrer"
          target="_blank"
        >
          MaaEnd/MaaEnd
          <v-icon icon="mdi-github" size="small" />
        </a>
      </div>

      <!-- 说明 -->
      <h2>说明</h2>
      <ol>
        <li>
          自动更新功能有删除硬盘上的文件的操作，请确保重要数据已备份再使用自动更新功能，避免误删重要文件。
        </li>
        <li>机器识别，可能存在错误。若发现错误，欢迎反馈。</li>
        <li>
          本工具按“原样”、“包含全部错误”和“视可用性情况”提供，作者不对可用性、准确性或使用效果做出任何承诺或保证。
        </li>
        <li>使用者必须确保使用本工具符合相关法律法规与服务条款，禁止用于任何违法或侵权行为。</li>
        <li>使用者需承担因使用本工具产生的任何风险、损失或责任。</li>
        <li>使用本工具即意味着您同意以上全部内容。</li>
      </ol>

      <!-- 下载最新版（Mirror酱）CDK 输入对话框 -->
      <v-dialog v-model="mirrorDialogOpen" max-width="520">
        <v-card>
          <v-card-title>下载最新版（Mirror酱）</v-card-title>
          <v-card-text>
            <p class="text-body-2">
              <a
                class="text-primary text-decoration-none"
                href="https://mirrorchyan.com/"
                rel="noopener noreferrer"
                target="_blank"
                >Mirror酱</a
              >
              是独立的第三方加速下载服务，需要付费使用。OEA
              本身不收取任何费用，也提供免费的下载渠道，您可以前往
              <a
                class="text-primary text-decoration-none"
                href="https://github.com/Logical-Byte/open-endfield-assistant/releases"
                rel="noopener noreferrer"
                target="_blank"
                >GitHub Release</a
              >
              免费下载和使用。
            </p>
            <v-text-field
              v-model="cdkInput"
              class="mt-3"
              label="Mirror酱 CDK"
              placeholder="请输入 Mirror酱 CDK"
              variant="outlined"
              @keyup.enter="confirmMirrorDownload"
            />
            <div class="d-flex justify-end">
              <a
                class="text-primary text-decoration-none d-inline-flex align-center ga-1"
                href="https://mirrorchyan.com/?source=oea"
                rel="noopener noreferrer"
                target="_blank"
              >
                获取 CDK
                <v-icon icon="mdi-open-in-new" size="small" />
              </a>
            </div>
            <v-alert v-if="mirrorError" class="mt-2" density="compact" type="error" variant="tonal">
              {{ mirrorError }}
            </v-alert>
          </v-card-text>
          <v-card-actions>
            <v-btn variant="text" @click="closeMirrorDialog">取消</v-btn>
            <v-spacer />
            <v-btn
              color="primary"
              :loading="mirrorDownloading"
              prepend-icon="mdi-download"
              @click="confirmMirrorDownload"
            >
              确认下载
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- GitHub 下载失败提示 -->
      <v-snackbar v-model="showGithubError" color="error" location="bottom" timeout="5000">
        {{ githubError }}
      </v-snackbar>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
// 使用默认布局
definePageMeta({
  layout: 'default',
});

const { t } = useI18n();

usePageSeo({
  title: () => `${t('menu.oea')} - ${t('layout.siteName')}`,
  description: () =>
    'OEA is an open-source tool to scan and export your Endfield archives. Get started with tips, usage instructions, FAQ and feedback.',
});

/** MirrorChyan 检查更新 API 主备双站。 */
const MIRRORCHYAN_CHECK_URL_BASES = [
  'https://mirrorchyan.com/api/resources/OEA/latest',
  'https://mirrorchyan.net/api/resources/OEA/latest',
] as const;
/** GitHub 仓库（Logical-Byte/open-endfield-assistant）。 */
const GITHUB_OWNER = 'Logical-Byte';
const GITHUB_REPO = 'open-endfield-assistant';
const GITHUB_LATEST_RELEASE_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases/latest`;
/** OEA 仅支持 Windows x86_64，下载时固定匹配该平台的安装包。 */
const OEA_ASSET_PLATFORM = 'windows';
const OEA_ASSET_ARCH = 'x86_64';

/** Mirror酱 下载对话框是否打开。 */
const mirrorDialogOpen = ref(false);
/** 用户输入的 Mirror酱 CDK。 */
const cdkInput = ref('');
/** 是否正在通过 Mirror酱请求下载链接。 */
const mirrorDownloading = ref(false);
/** Mirror酱 下载错误信息（CDK 非法等原因）。 */
const mirrorError = ref('');
/** 是否正在通过 GitHub 请求下载链接。 */
const githubDownloading = ref(false);
/** GitHub 下载错误信息。 */
const githubError = ref('');
/** GitHub 下载失败提示是否显示。 */
const showGithubError = ref(false);

/** MirrorChyan 业务错误码对应的用户可读描述。 */
const MIRRORCHYAN_BUSINESS_ERROR_MESSAGES: Record<number, string> = {
  1001: 'Mirror酱：请求参数不正确，请联系作者',
  7001: '您的 Mirror酱 CDK 已过期',
  7002: '您的 Mirror酱 CDK 错误，请检查输入是否正确',
  7003: '您的 Mirror酱 CDK 今日下载次数已达上限',
  7004: '您的 Mirror酱 CDK 类型与待下载资源不匹配',
  7005: '您的 Mirror酱 CDK 已被封禁',
  8001: 'Mirror酱：对应架构和系统下的资源不存在，请联系作者',
  8002: 'Mirror酱：错误的系统参数，请联系作者',
  8003: 'Mirror酱：错误的架构参数，请联系作者',
  8004: 'Mirror酱：错误的更新通道参数，请联系作者',
};

/** MirrorChyan 检查更新响应。 */
interface MirrorchyanLatestResponse {
  code: number;
  msg: string;
  data: {
    version_name: string;
    release_note: string;
    url: string;
    sha256: string;
    filesize: number;
    update_type: string;
  } | null;
}

/** GitHub Release 资产。 */
interface GitHubReleaseAsset {
  name: string;
  size: number;
  browser_download_url: string;
}

/** GitHub 最新 Release。 */
interface GitHubLatestRelease {
  tag_name: string;
  assets: GitHubReleaseAsset[];
}

/** 打开「下载最新版（Mirror酱）」对话框。 */
function openMirrorDialog(): void {
  cdkInput.value = '';
  mirrorError.value = '';
  mirrorDialogOpen.value = true;
}

/** 关闭「下载最新版（Mirror酱）」对话框。 */
function closeMirrorDialog(): void {
  if (mirrorDownloading.value) {
    return;
  }
  mirrorDialogOpen.value = false;
}

/** 构造 MirrorChyan 检查更新请求 URL（主备站共用；query 必须用 URLSearchParams）。 */
function buildMirrorchyanCheckUrl(base: string, cdk: string): URL {
  const url = new URL(base);
  // current_version 传最低版本，保证总是返回最新版信息（含下载链接）。
  url.searchParams.set('current_version', 'v0.0.0');
  url.searchParams.set('user_agent', 'oea_web');
  url.searchParams.set('channel', 'stable');
  url.searchParams.set('os', 'windows');
  url.searchParams.set('arch', 'amd64');
  url.searchParams.set('cdk', cdk);
  return url;
}

/** 将 MirrorChyan 返回的错误码转换为用户可读的错误信息。 */
function buildMirrorchyanErrorMessage(code: number, msg: string): string {
  if (code < 0) {
    return `Mirror 酱服务出现异常，请稍后重试或联系技术支持: ${msg}`;
  }
  const friendly = MIRRORCHYAN_BUSINESS_ERROR_MESSAGES[code];
  if (friendly) {
    return friendly;
  }
  // `code === 1`（UNDIVIDED）等未区分的业务错误，以响应体 `msg` 为准。
  return msg || `未知错误（${code}）`;
}

/** 请求 MirrorChyan 获取最新版下载链接；CDK 非法或请求失败时抛出用户可读的错误。 */
async function resolveMirrorchyanDownloadUrl(cdk: string): Promise<string> {
  let lastError: string | null = null;
  for (const base of MIRRORCHYAN_CHECK_URL_BASES) {
    try {
      const response = await fetch(buildMirrorchyanCheckUrl(base, cdk));
      const payload = (await response.json()) as MirrorchyanLatestResponse;
      if (payload.code !== 0) {
        throw new Error(buildMirrorchyanErrorMessage(payload.code, payload.msg));
      }
      if (!payload.data?.url) {
        throw new Error('Mirror酱未返回下载链接，请稍后重试');
      }
      return payload.data.url;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
  }
  throw new Error(lastError ?? '获取 Mirror酱 下载链接失败，请稍后重试');
}

/** 确认输入 CDK 并从 Mirror酱下载最新版；CDK 非法时显示错误并拒绝下载。 */
async function confirmMirrorDownload(): Promise<void> {
  const cdk = cdkInput.value.trim();
  if (!cdk) {
    mirrorError.value = '请输入 Mirror酱 CDK';
    return;
  }
  if (mirrorDownloading.value) {
    return;
  }
  mirrorDownloading.value = true;
  mirrorError.value = '';
  try {
    const url = await resolveMirrorchyanDownloadUrl(cdk);
    mirrorDialogOpen.value = false;
    // 当前页面导航到文件地址；zip 资源以 attachment 响应，浏览器直接下载不离开页面。
    window.location.href = url;
  } catch (error) {
    // CDK 非法 / 请求失败：显示错误并拒绝下载。
    mirrorError.value = error instanceof Error ? error.message : String(error);
  } finally {
    mirrorDownloading.value = false;
  }
}

/** 从 GitHub 下载最新版（OEA 仅支持 Windows x86_64）。 */
async function downloadFromGithub(): Promise<void> {
  if (githubDownloading.value) {
    return;
  }
  githubDownloading.value = true;
  githubError.value = '';
  try {
    const response = await fetch(GITHUB_LATEST_RELEASE_URL, {
      headers: { Accept: 'application/vnd.github+json' },
    });
    if (!response.ok) {
      throw new Error(`GitHub API 错误（HTTP ${response.status}），GitHub 下载暂不可用`);
    }
    const release = (await response.json()) as GitHubLatestRelease;
    // 匹配资产：优先精确匹配 `OEA-windows-x86_64-<版本>.zip`，无精确匹配时取体积最大的 zip 资产。
    const exactName = `OEA-${OEA_ASSET_PLATFORM}-${OEA_ASSET_ARCH}-${release.tag_name}.zip`;
    const candidates = release.assets.filter((asset) => asset.name.toLowerCase().endsWith('.zip'));
    let asset = candidates.find((item) => item.name === exactName) ?? null;
    if (!asset && candidates.length > 0) {
      asset = candidates.reduce((largest, item) => (item.size > largest.size ? item : largest));
    }
    if (!asset) {
      throw new Error('GitHub Release 中未找到 OEA 的 zip 安装包');
    }
    // 当前页面导航到文件地址；zip 资源以 attachment 响应，浏览器直接下载不离开页面。
    window.location.href = asset.browser_download_url;
  } catch (error) {
    githubError.value = error instanceof Error ? error.message : String(error);
    showGithubError.value = true;
  } finally {
    githubDownloading.value = false;
  }
}
</script>

<style scoped>
h1,
h2 {
  margin-block-start: calc(0.8em + 0.8rem);
  margin-block-end: calc(0.4em + 0.4rem);
}

h3 {
  margin-block-start: calc(0.8em + 0.8rem);
  margin-block-end: calc(0.4em + 0.4rem);
  counter-increment: h3-counter;
}

h3::before {
  content: counter(h3-counter) '. ';
}

h2 {
  counter-reset: h3-counter;
}

h4,
h5,
h6 {
  margin-block-start: calc(0.8em + 0.8rem);
  margin-block-end: calc(0.4em + 0.4rem);
}

code,
pre {
  font-family: 'Jetbrains Mono', 'Google Sans Code', 'Consolas', 'Courier New', monospace;
}

p {
  margin-block: 0.6em;
}

ul,
ol {
  margin-block: 0.6em;
}

ul {
  padding-inline-start: 1.5em;
}

ol {
  padding-inline-start: 2em;
}

li {
  margin-block: 0.6em;
}

ul > li {
  padding-inline-start: 0.5em;
}

ul > li::marker,
ol > li::marker {
  font-family: 'Jetbrains Mono', 'Google Sans Code', 'Consolas', 'Courier New', monospace;
}
</style>
