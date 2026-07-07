<template>
  <div>
    <v-sheet class="mx-auto">
      <v-slide-group>
        <v-slide-group-item>
          <v-img
            :min-width="500"
            src="https://cos.yituliu.cn/endfield/endfield-essence-recognizer/assets/终末地基质小助手展示_0.webp"
          />
        </v-slide-group-item>
        <v-slide-group-item>
          <v-img
            :min-width="500"
            src="https://cos.yituliu.cn/endfield/endfield-essence-recognizer/assets/终末地基质小助手展示_1.webp"
          />
        </v-slide-group-item>
      </v-slide-group>
    </v-sheet>
    <v-container>
      <h1 class="my-0">终末地基质小助手</h1>

      <div class="d-flex flex-row flex-wrap ga-4 my-4">
        <v-btn-group density="compact" divided elevation="3">
          <v-btn
            color="primary"
            prepend-icon="mdi-download"
            @click="downloadLatestVersion('global')"
          >
            主线下载
          </v-btn>
          <v-btn color="primary" @click="downloadLatestVersion('cn')"> 备用下载 </v-btn>
        </v-btn-group>
        <v-btn
          append-icon="mdi-open-in-new"
          href="https://github.com/Logical-Byte/endfield-essence-recognizer"
          rel="noopener noreferrer"
          target="_blank"
        >
          项目地址
        </v-btn>
        <v-menu>
          <template #activator="{ props }">
            <v-btn color="#18a6bd" prepend-icon="mdi-qqchat" v-bind="props">
              <template #append>
                <v-icon icon="mdi-dots-vertical"></v-icon>
              </template>
              反馈交流群
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(btn, i) in qqg"
              :key="i"
              :href="btn.link"
              prepend-gap="10"
              rel="noopener noreferrer"
              target="_blank"
              :value="i"
            >
              <template #prepend>
                <v-icon :icon="btn.icon" />
              </template>
              <v-list-item-title>
                {{ btn.text }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

      <h2>使用须知</h2>
      <ul>
        <li>请在 Windows 的屏幕设置中<strong class="text-primary">关闭 HDR</strong></li>
        <li>
          请使用<strong class="text-primary">管理员权限</strong
          ><span class="text-secondary">（是 Windows 管理员，不是终末地管理员）</span>运行本工具
        </li>
        <li>
          请修改终末地的游戏设置如下：
          <ul>
            <li>界面语言：<strong class="text-primary">简体中文</strong></li>
            <li>
              分辨率：<strong class="text-primary">1920×1080（或同样16:9比例的分辨率）</strong>
            </li>
            <li>全屏模式：<strong class="text-primary">窗口</strong></li>
          </ul>
        </li>
        <li>
          请在终末地中，按 <v-hotkey color="primary" inline keys="N" variant="flat" /> 键打开<strong
            class="text-primary"
            >贵重品库</strong
          >，并切换到<strong class="text-primary">武器基质</strong>页面<br />
          <v-icon class="mr-1" icon="mdi-information" size="small" />
          也可以按下
          <v-hotkey
            class="mx-1"
            color="primary"
            inline
            :key-map="{
              escape: { default: { text: 'ESC' } },
            }"
            keys="esc"
            variant="flat"
          />
          打开协议同步器（主菜单），在右侧找到<strong class="text-primary">贵重品库</strong>进入
        </li>
        <li>请确保终末地的整个窗口都位于屏幕范围内且未被性能监控工具等任何其他内容遮挡</li>
        <li>
          在识别工具的运行过程中，请确保终末地窗口<strong class="text-primary">置于前台</strong>
        </li>
      </ul>

      <h2>功能介绍</h2>
      <ul>
        <li>
          按
          <v-hotkey display-mode="text" inline keys="[" variant="flat" />
          键识别当前选中的基质（仅识别不操作）
        </li>
        <li>
          按
          <v-hotkey display-mode="text" inline keys="]" variant="flat" />
          键逐个扫描所有基质，并根据<strong>设置</strong>，自动锁定、解锁或弃用基质<br />
          基质扫描过程中再次按
          <v-hotkey display-mode="text" inline keys="]" variant="flat" /> 键中断扫描
        </li>

        <li>
          按 <v-hotkey display-mode="text" inline keys="Alt+DELETE" variant="flat" /> 退出程序
        </li>
      </ul>

      <p>
        <strong class="text-primary">宝藏基质和养成材料：</strong>
        默认情况下，如果这个基质和任何一把武器能对上
        <span class="text-secondary">（基质的所有属性与至少 1 件已实装武器的属性完全相同）</span>
        ，则是宝藏，否则是养成材料。<br />
        可以在<strong>设置</strong>界面自定义判别基准及扫描后操作。
      </p>

      <h2>常见问题</h2>
      <v-expansion-panels variant="accordion">
        <v-expansion-panel title="双击运行时遇到“Unhandled exception in script”弹窗报错">
          <template #text>
            <v-card-text class="text-body-2 pa-0">
              <v-img
                alt="遇到报错解决方法"
                src="https://cos.yituliu.cn/endfield/endfield-essence-recognizer/assets/遇到报错解决方法.webp"
              />
              <p>这大概率是由于 Windows 自带的解压导致的。</p>
              <p>有两种解决办法：</p>
              <ol>
                <li>
                  改用
                  <a
                    class="text-primary text-decoration-none"
                    href="https://www.7-zip.org/"
                    rel="noopener noreferrer"
                    target="_blank"
                    >7zip</a
                  >
                  或者
                  <a
                    class="text-primary text-decoration-none"
                    href="https://www.win-rar.com/"
                    rel="noopener noreferrer"
                    target="_blank"
                    >WinRAR</a
                  >
                  解压即可解决（其他解压软件也可以试试）。
                </li>
                <li>
                  如果电脑上没安装其他解压软件，则请右键点击 zip
                  压缩包，点击“属性”，然后把“解除锁定”勾上，点击“确定”，再解压即可。
                </li>
              </ol>
            </v-card-text>
          </template>
        </v-expansion-panel>
        <v-expansion-panel title="界面窗口能打开，但是白屏">
          <template #text>
            <v-card-text class="text-body-2 pa-0">
              <p>白屏问题比较复杂，请参考以下解决方法。</p>
              <ol>
                <li>
                  如果白屏界面右侧能看到一条矩形的滚动条，说明您未安装 WebView2 运行时。<br />
                  请前往
                  <a
                    class="text-primary text-decoration-none"
                    href="https://developer.microsoft.com/zh-CN/microsoft-edge/webview2"
                    rel="noopener noreferrer"
                    target="_blank"
                    >https://developer.microsoft.com/zh-CN/microsoft-edge/webview2</a
                  >
                  下载并安装 WebView2 运行时。<br />
                  选择“常青引导程序”或者“常青独立安装程序”均可。如果遇到网络问题无法下载，可以加群，在群文件里获取安装包。
                </li>
                <li>
                  请参考
                  <a
                    class="text-primary text-decoration-none"
                    href="https://github.com/Logical-Byte/endfield-essence-recognizer/issues/24#issuecomment-3830421851"
                    rel="noopener noreferrer"
                    target="_blank"
                    >https://github.com/Logical-Byte/endfield-essence-recognizer/issues/24#issuecomment-3830421851</a
                  >
                </li>
                <li>
                  保持工具运行，用浏览器访问
                  <a
                    class="text-primary text-decoration-none"
                    href="http://127.0.0.1:325/"
                    rel="noopener noreferrer"
                    target="_blank"
                    >http://127.0.0.1:325/</a
                  >
                </li>
                <li>
                  如果以上方法仍然解决不了，那就先凑合用。界面看不见没关系的，只要终末地在前台，按
                  <v-hotkey display-mode="text" inline keys="]" variant="flat" />
                  键是可以正常使用的。
                </li>
              </ol>
            </v-card-text>
          </template>
        </v-expansion-panel>
        <v-expansion-panel title="明明是 1920×1080（或其它16:9比例）窗口，依然提示分辨率错误">
          <template #text>
            <v-card-text class="text-body-2 pa-0">
              请尝试：将所有显示器的缩放都更改为100%，然后重启电脑，把本工具和终末地窗口都放在主显示器上，再试一次。
            </v-card-text>
          </template>
        </v-expansion-panel>
        <v-expansion-panel title="出现大面积识别错误">
          <template #text>
            <v-card-text class="text-body-2 pa-0">
              <ul>
                <li>请在 Windows 屏幕设置中<strong class="text-primary">关闭 HDR</strong></li>
                <li>请将终末地的界面语言更改为<strong class="text-primary">简体中文</strong></li>
                <li>请确保终末地的整个窗口都位于屏幕范围内且未被性能监控工具等任何其他内容遮挡</li>
              </ul>
            </v-card-text>
          </template>
        </v-expansion-panel>
        <v-expansion-panel title="识别到的基质始终是同一个">
          <template #text>
            <v-card-text class="text-body-2 pa-0">
              <p>
                请确保终末地的分辨率为
                <strong class="text-primary">1920×1080（或其它16:9比例）</strong>且全屏模式为<strong
                  class="text-primary"
                  >窗口</strong
                >。
              </p>
            </v-card-text>
          </template>
        </v-expansion-panel>
      </v-expansion-panels>

      <h2>联系我们</h2>
      <div>
        如果在使用过程中遇到任何问题，或是想提出建议，欢迎<a
          class="text-primary text-decoration-none"
          href="https://github.com/Logical-Byte/endfield-essence-recognizer"
          rel="noopener noreferrer"
          target="_blank"
          ><strong>在 GitHub 上提 Issue</strong></a
        >，或者加入
        <v-menu>
          <template #activator="{ props }">
            <v-btn color="#18a6bd" v-bind="props" density="comfortable" prepend-icon="mdi-qqchat">
              反馈交流群
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(btn, i) in qqg"
              :key="i"
              :href="btn.link"
              prepend-gap="10"
              rel="noopener noreferrer"
              target="_blank"
              :value="i"
            >
              <template #prepend>
                <v-icon :icon="btn.icon" />
              </template>
              <v-list-item-title>
                {{ btn.text }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

      <h2>说明</h2>
      <ul>
        <li>机器识别，可能存在错误。若发现错误，欢迎反馈。</li>
        <li>
          工具仅检索基质是否匹配已实装的武器，而没有能力预测是否能匹配未实装的武器。至于一个基质未来有没有用，你可以给海猫打个电话（
        </li>
        <li>本工具按“原样”提供，作者不对可用性、准确性或使用效果作出任何保证。</li>
        <li>使用者必须确保使用本工具符合相关法律法规与服务条款，禁止用于任何违法或侵权行为。</li>
        <li>使用者需承担因使用本工具产生的任何风险、损失或责任。</li>
        <li>使用本工具即意味着您同意以上全部内容。</li>
      </ul>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
interface Mirror {
  downloadUrl: string;
}

interface VersionInfo {
  latestVersion: string;
  downloadUrl: string;
  mirrors: {
    global: Mirror;
    cn: Mirror;
  };
}

// 使用默认布局
definePageMeta({
  layout: 'default',
});

const { t } = useI18n();

usePageSeo({
  title: () => `${t('menu.essenceRecognizer')} - ${t('layout.siteName')}`,
  description: () =>
    'Download and use the Endfield essence recognizer tool with usage notes and troubleshooting.',
});

// 错误提示状态
const showError = ref(false);
const errorMessage = ref('');

// 交流群
const qqg = ref([
  {
    icon: 'mdi-numeric-1-box-outline',
    text: '486622964',
    link: 'https://qm.qq.com/cgi-bin/qm/qr?k=1xqRp7JwQHwGswa-8_SMFuAsRYYRnF8J',
  },
  {
    icon: 'mdi-numeric-2-box-outline',
    text: '1082880855',
    link: 'https://qm.qq.com/cgi-bin/qm/qr?k=qAmvmHCc3HuESiJhZVe6Ytgj7foOxXx9',
  },
  {
    icon: 'mdi-numeric-3-box-outline',
    text: '1042417974',
    link: 'https://qm.qq.com/cgi-bin/qm/qr?k=-GykJWhnZEN5F2aZ1nrVd3xs9RGkMBI2',
  },
]);

// 下载最新版本
async function downloadLatestVersion(mirror: 'global' | 'cn') {
  try {
    // 获取当前时间戳
    const timestamp = Date.now();

    // 请求版本信息
    const versionInfo = await $fetch<VersionInfo>(
      `https://cos.yituliu.cn/endfield/endfield-essence-recognizer/version.json?t=${timestamp}`,
    );

    // 下载最新版本
    if (versionInfo.mirrors[mirror]?.downloadUrl) {
      window.location.href = versionInfo.mirrors[mirror].downloadUrl;
    } else {
      errorMessage.value = '无法获取下载链接，请稍后重试';
      showError.value = true;
    }
  } catch (error) {
    console.error('获取版本信息失败：', error);
    errorMessage.value = '获取版本信息失败，请检查网络连接后重试';
    showError.value = true;
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
