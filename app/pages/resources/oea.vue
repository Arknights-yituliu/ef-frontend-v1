<template>
  <div>
    <v-sheet class="mx-auto">
      <v-slide-group>
        <v-slide-group-item>
          <v-img
            :min-width="500"
            src="https://cos.yituliu.cn/endfield/oea/assets/oea-image-3.png"
          />
        </v-slide-group-item>
        <v-slide-group-item>
          <v-img
            :min-width="500"
            src="https://cos.yituliu.cn/endfield/oea/assets/oea-image-2.webp"
          />
        </v-slide-group-item>
        <v-slide-group-item>
          <v-img
            :min-width="500"
            src="https://cos.yituliu.cn/endfield/oea/assets/oea-image-4.png"
          />
        </v-slide-group-item>
      </v-slide-group>
    </v-sheet>
    <v-container class="page-container">
      <h1>OEA：终末地小助手</h1>

      <!-- 头部按钮：下载 / GitHub / QQ 交流群 -->
      <div class="d-flex flex-wrap ga-2 mt-4 mb-10">
        <v-btn-group density="compact" elevation="3">
          <v-btn
            color="primary"
            href="https://mirrorchyan.com/zh/projects?rid=OEA&os=windows&arch=x64&channel=stable"
            prepend-icon="mdi-launch"
            rel="noopener noreferrer"
            target="_blank"
          >
            Mirror酱下载
          </v-btn>
          <v-btn
            color="secondary"
            href="https://oea.oem.re/latest"
            prepend-icon="mdi-cloud-download"
            rel="noopener noreferrer"
          >
            OEM 下载
          </v-btn>
          <v-btn
            color="primary"
            :loading="githubDownloading"
            prepend-icon="mdi-download"
            @click="downloadFromGithub"
          >
            GitHub 下载
          </v-btn>
        </v-btn-group>

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

      <!-- 简介 -->
      <p>
        OEA 是开源免费的终末地小助手，支持<strong class="text-primary">档案查漏补缺</strong
        >和<strong class="text-primary">百趣演武自动抽</strong>。
      </p>
      <ul>
        <li>
          <strong class="text-primary">档案查漏补缺</strong>：一键识别终末地档案库，并同步到
          OEM（终末地地图集），助力每一个全收集梦想！
        </li>
        <li>
          <strong class="rainbow-text">百趣演武自动抽</strong
          >：抽到想要的牌型为止，解放双手，摆完挂机！
        </li>
      </ul>

      <!-- 使用前准备 -->
      <h2>使用前准备</h2>
      <ol>
        <li>
          在页面上方<strong class="text-primary">下载</strong>，<strong class="text-primary"
            >解压</strong
          >后运行 <code>OEA.exe</code>
        </li>
        <li>
          打开终末地，设置为 <strong class="text-primary">1280 × 720 窗口模式</strong>、<strong
            class="text-primary"
            >简体中文</strong
          >。
        </li>
        <li>
          <strong class="text-primary">关闭 HDR</strong
          >，关闭性能监控软件和任何会遮挡终末地窗口的软件。
        </li>
      </ol>
      <p class="text-body-2 text-medium-emphasis">
        理论上支持任意 <strong>16:9</strong> 的分辨率，我们最建议使用
        <strong>1280 × 720 窗口模式</strong>，这个分辨率可以兼顾准确性和性能。
      </p>

      <!-- 档案查漏补缺 -->
      <h2>档案查漏补缺</h2>
      <ol>
        <li>终末地打开<strong class="text-primary">档案库主界面</strong>。</li>
        <li>
          点击<strong class="text-primary">开始扫描</strong>，或按
          <v-hotkey inline keys="'" variant="flat" />（引号键）。
        </li>
        <li>扫完点击<strong class="text-primary">导出收集状态</strong>。</li>
      </ol>
      <p class="text-body-2 text-medium-emphasis">
        理论上支持从协议终端、大世界和任意档案库界面开始扫描。为了稳定性，建议始终从<strong>档案库主界面</strong>开始扫描。
      </p>

      <!-- 百趣演武自动抽 -->
      <h2 class="rainbow-text rainbow-block">百趣演武自动抽</h2>
      <ol>
        <li>终末地打开<strong class="text-primary">百趣演武的抽牌界面</strong>。</li>
        <li>选择<strong class="text-primary">牌型目标</strong>。</li>
        <li>
          点击<strong class="text-primary">开始抽卡</strong>，或按
          <v-hotkey inline keys=";" variant="flat" />（分号键）。
        </li>
        <li>满足<strong class="text-primary">任意一个</strong>目标后会自动停止抽卡。</li>
      </ol>

      <!-- 快捷键 -->
      <h2>快捷键</h2>
      <ul>
        <li>
          按
          <v-hotkey
            inline
            keys="'"
            variant="flat"
          />（引号键）开始扫描档案库，扫描过程中再次按下可停止。
        </li>
        <li>
          按
          <v-hotkey
            inline
            keys=";"
            variant="flat"
          />（分号键）开始百趣演武自动抽牌，再次按下可停止。
        </li>
        <li>
          按 <v-hotkey display-mode="text" inline keys="Alt+DELETE" variant="flat" /> 退出程序。
        </li>
      </ul>

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
              OEA 开源且免费，不会以任何形式收取费用。如果您是通过付费方式获取的
              OEA，您可能已经被不法商家欺骗，请立即告知我们。
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
              是独立的第三方应用分发平台，提供加速下载服务，需要付费使用。
            </p>
            <p>
              OEA 本身不收取任何费用，也提供免费的下载渠道。您可以前往
              <a
                class="text-primary text-decoration-none"
                href="https://github.com/Logical-Byte/open-endfield-assistant/releases"
                rel="noopener noreferrer"
                target="_blank"
                >GitHub Releases</a
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
          href="https://github.com/RapidAI/RapidOCR"
          rel="noopener noreferrer"
          target="_blank"
        >
          RapidAI/RapidOCR
          <v-icon icon="mdi-github" size="small" />
        </a>
        <a
          class="text-primary text-decoration-none d-inline-flex align-center ga-1"
          href="https://www.modelscope.cn/models/RapidAI/RapidOCR"
          rel="noopener noreferrer"
          target="_blank"
        >
          RapidOCR 模型
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
          本工具按 “原样”、“包含全部错误” 和 “视可用性情况”
          提供，作者不对可用性、准确性或使用效果做出任何承诺或保证。
        </li>
        <li>使用者必须确保使用本工具符合相关法律法规与服务条款，禁止用于任何违法或侵权行为。</li>
        <li>使用者需承担因使用本工具产生的任何风险、损失或责任。</li>
        <li>使用本工具即意味着您同意以上全部内容。</li>
      </ol>

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
    'OEA 是开源免费的终末地小助手，支持档案查漏补缺和百趣演武自动抽。支持 Windows 10 / 11，下载解压即用。',
});

/** GitHub 仓库（Logical-Byte/open-endfield-assistant）。 */
const GITHUB_OWNER = 'Logical-Byte';
const GITHUB_REPO = 'open-endfield-assistant';
const GITHUB_LATEST_RELEASE_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases/latest`;
/** OEA 仅支持 Windows x86_64，下载时固定匹配该平台的安装包。 */
const OEA_ASSET_PLATFORM = 'windows';
const OEA_ASSET_ARCH = 'x86_64';

/** 是否正在通过 GitHub 请求下载链接。 */
const githubDownloading = ref(false);
/** GitHub 下载错误信息。 */
const githubError = ref('');
/** GitHub 下载失败提示是否显示。 */
const showGithubError = ref(false);

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

/* 炫彩文字：渐变横向流动，可按需用在行内或块级元素上 */
/* background-repeat 需显式 repeat：全局 reset 把它设为 no-repeat，动画中途渐变移出盒子会让文字整体消失 */
.rainbow-text {
  background-image: linear-gradient(90deg, #ef4444, #eab308, #22c55e, #06b6d4, #3b82f6, #d946ef);
  background-size: 200% 100%;
  background-repeat: repeat;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: 900;
  animation: rainbow-title-flow 3s linear infinite;
}

/* 块级元素需让渐变盒贴合文字宽度，否则整行宽的渐变只覆盖文字所在的一小段，看起来是单色 */
.rainbow-block {
  width: fit-content;
}

@keyframes rainbow-title-flow {
  to {
    background-position: -200% 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .rainbow-text {
    animation: none;
  }
}
</style>
