<template>
  <h1>终末地基质小助手</h1>

  <div class="d-flex flex-row flex-wrap ga-4 my-4">
    <v-btn append-icon="mdi-open-in-new" color="primary" @click="downloadLatestVersion"
      >下载最新版（国内）</v-btn
    >
    <v-btn
      append-icon="mdi-open-in-new"
      href="https://github.com/Logical-Byte/endfield-essence-recognizer/releases/latest"
      rel="noopener noreferrer"
      target="_blank"
      >下载最新版（GitHub）</v-btn
    >
    <v-btn
      append-icon="mdi-open-in-new"
      href="https://github.com/Logical-Byte/endfield-essence-recognizer"
      rel="noopener noreferrer"
      target="_blank"
      >项目地址</v-btn
    >
    <v-btn
      prepend-icon="mdi-qqchat"
      href="https://qm.qq.com/cgi-bin/qm/qr?k=1xqRp7JwQHwGswa-8_SMFuAsRYYRnF8J"
      rel="noopener noreferrer"
      target="_blank"
      >反馈交流①群：486622964</v-btn
    >
    <v-btn
      prepend-icon="mdi-qqchat"
      color="primary"
      href="https://qm.qq.com/cgi-bin/qm/qr?k=qAmvmHCc3HuESiJhZVe6Ytgj7foOxXx9"
      rel="noopener noreferrer"
      target="_blank"
      >反馈交流②群：1082880855</v-btn
    >
  </div>

  <v-row class="my-4">
    <v-col cols="12" md="6">
      <v-img
        src="https://cos.yituliu.cn/endfield/endfield-essence-recognizer/assets/终末地基质小助手展示_0.webp"
      />
    </v-col>
    <v-col cols="12" md="6">
      <v-img
        src="https://cos.yituliu.cn/endfield/endfield-essence-recognizer/assets/终末地基质小助手展示_1.webp"
      />
    </v-col>
  </v-row>

  <h2>使用前准备</h2>
  <ul>
    <li>
      请使用<strong class="text-primary">管理员权限</strong
      ><span class="text-secondary">（是 Windows 管理员，不是终末地管理员）</span>运行本工具
    </li>
    <li>请在 Windows 屏幕设置中<strong class="text-primary">关闭 HDR</strong></li>
    <li>请将终末地的界面语言更改为<strong class="text-primary">简体中文</strong></li>
    <li>
      请将终末地的分辨率更改为 <strong class="text-primary">1920×1080 窗口</strong>
      <ul>
        <li>
          若您的显示器分辨率为 1920×1080，请将终末地的分辨率更改为 1920×1080 全屏后按下
          <strong class="text-primary">
            <v-hotkey keys="Alt+Enter" color="primary" inline variant="flat" />
            切换为窗口模式</strong
          >
        </li>
      </ul>
    </li>
    <li>请确保终末地的整个窗口都位于屏幕范围内且未被性能监控工具等任何其他内容遮挡</li>
    <li>
      请按 <v-hotkey keys="N" inline variant="flat" /> 键打开终末地<strong class="text-primary"
        >贵重品库</strong
      >并切换到<strong class="text-primary">武器基质</strong>页面
    </li>
    <li>在运行过程中，请确保终末地窗口<strong class="text-primary">置于前台</strong></li>
  </ul>

  <h2>功能介绍</h2>
  <ul>
    <li>按 <v-hotkey keys="[" inline variant="flat" /> 键识别当前选中的基质是宝藏还是养成材料</li>
    <li>
      按
      <v-hotkey keys="]" inline variant="flat" />
      键扫描所有基质，并根据<strong>设置</strong>，自动锁定或者解锁基质<br >
      基质扫描过程中再次按 <v-hotkey keys="]" inline variant="flat" /> 键中断扫描
    </li>

    <li>按 <v-hotkey keys="Alt+DELETE" inline variant="flat" /> 退出程序</li>
  </ul>

  <p>
    <strong class="text-primary">宝藏基质和养成材料：</strong
    >可以在<strong>设置</strong>界面自定义。默认情况下，如果这个基质和任何一把武器能对上<span
      class="text-secondary"
      >（基质的所有属性与至少 1 件已实装武器的属性完全相同）</span
    >，则是宝藏，否则是养成材料。
  </p>

  <h2>常见问题</h2>
  <h3>双击运行时遇到“Unhandled exception in script”弹窗报错</h3>
  <v-img
    src="https://cos.yituliu.cn/endfield/endfield-essence-recognizer/assets/遇到报错解决方法.webp"
    alt="遇到报错解决方法"
  />
  <p>这大概率是由于 Windows 自带的解压导致的。</p>
  <p>有两种解决办法：</p>
  <ol>
    <li>
      改用
      <a
        class="text-primary text-decoration-none"
        href="https://www.7-zip.org/"
        target="_blank"
        rel="noopener noreferrer"
        >7zip</a
      >
      或者
      <a
        class="text-primary text-decoration-none"
        href="https://www.win-rar.com/"
        target="_blank"
        rel="noopener noreferrer"
        >WinRAR</a
      >
      解压即可解决（其他解压软件也可以试试）。
    </li>
    <li>
      如果电脑上没安装其他解压软件，则请右键点击 zip
      压缩包，点击"属性"，然后把"解除锁定"勾上，点击"确定"，再解压即可。
    </li>
  </ol>

  <h3>界面窗口能打开，但是白屏</h3>
  <p>白屏问题比较复杂，请参考以下临时解决方法。</p>
  <p>
    <strong class="text-primary">方法一：</strong>请参考
    <a
      class="text-primary text-decoration-none"
      href="https://github.com/Logical-Byte/endfield-essence-recognizer/issues/24#issuecomment-3830421851"
      target="_blank"
      rel="noopener noreferrer"
      >https://github.com/Logical-Byte/endfield-essence-recognizer/issues/24#issuecomment-3830421851</a
    >
  </p>
  <p>
    <strong class="text-primary">方法二：</strong>请保持工具打开状态，用浏览器访问
    <a
      class="text-primary text-decoration-none"
      href="http://127.0.0.1:325/"
      target="_blank"
      rel="noopener noreferrer"
      >http://127.0.0.1:325/</a
    >
  </p>
  <p>
    <strong class="text-primary">方法三：</strong
    >如果以上方法仍然解决不了，那就先凑合用。界面看不见没关系的，只要终末地在前台，按
    <v-hotkey keys="]" inline variant="flat" /> 键是可以正常使用的。
  </p>

  <h3>明明是 1920×1080 窗口，依然提示分辨率错误</h3>
  <p>
    请尝试：将所有显示器的缩放都更改为
    100%，然后重启电脑，把本工具和终末地窗口都放在主显示器上，再试一次。
  </p>

  <h3>出现大面积识别错误</h3>
  <ul>
    <li>请在 Windows 屏幕设置中<strong class="text-primary">关闭 HDR</strong></li>
    <li>请将终末地的界面语言更改为<strong class="text-primary">简体中文</strong></li>
    <li>请确保终末地的整个窗口都位于屏幕范围内且未被性能监控工具等任何其他内容遮挡</li>
  </ul>

  <h3>识别到的基质始终是同一个</h3>
  <p>
    请确保终末地的分辨率为
    <strong class="text-primary">1920×1080 窗口</strong>。若您的显示器分辨率为
    1920×1080，请将终末地的分辨率更改为 1920×1080 全屏后按下
    <strong class="text-primary">
      <v-hotkey keys="Alt+Enter" color="primary" inline variant="flat" />
      切换为窗口模式</strong
    >。
  </p>

  <h2>联系我们</h2>
  <p>
    如果在使用过程中遇到任何问题，或是想提出建议，欢迎<a
      class="text-primary text-decoration-none"
      href="https://github.com/Logical-Byte/endfield-essence-recognizer"
      target="_blank"
      rel="noopener noreferrer"
      ><strong>在 GitHub 上提 Issue</strong></a
    >，或者加入反馈交流群：<v-chip
      class="mr-1"
      prepend-icon="mdi-qqchat"
      href="https://qm.qq.com/cgi-bin/qm/qr?k=1xqRp7JwQHwGswa-8_SMFuAsRYYRnF8J"
      target="_blank"
      rel="noopener noreferrer"
    >
      ①群：486622964
    </v-chip>
    <v-chip
      prepend-icon="mdi-qqchat"
      color="primary"
      href="https://qm.qq.com/cgi-bin/qm/qr?k=qAmvmHCc3HuESiJhZVe6Ytgj7foOxXx9"
      rel="noopener noreferrer"
      target="_blank"
    >
      ②群：1082880855
    </v-chip>
  </p>

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

  <!-- 错误提示 Snackbar -->
  <v-snackbar v-model="showError" color="error" location="top">
    {{ errorMessage }}
    <template #actions>
      <v-btn variant="text" @click="showError = false">关闭</v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts" setup>
// 使用默认布局
definePageMeta({
  layout: 'default',
});

// 错误提示状态
const showError = ref(false);
const errorMessage = ref('');

// 下载最新版本
async function downloadLatestVersion() {
  try {
    // 获取当前时间戳
    const timestamp = Date.now();

    // 请求版本信息
    const versionInfo = await $fetch<{
      latestVersion: string;
      downloadUrl: string;
    }>(`https://cos.yituliu.cn/endfield/endfield-essence-recognizer/version.json?t=${timestamp}`);

    // 下载最新版本
    if (versionInfo.downloadUrl) {
      window.location.href = versionInfo.downloadUrl;
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
