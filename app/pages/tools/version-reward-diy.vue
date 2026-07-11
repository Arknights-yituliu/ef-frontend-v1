<script setup lang="ts">
import type { Reward } from '#shared/types/gacha-calculator';
import { dateFormat } from '#shared/utils/dateUtil';

import { numberFloor, numberRound } from '#shared/utils/numberUtil';

import { computed, onMounted, ref, watch } from 'vue';
import {
  currentVersionReward,
  currentVersionRewardTotal,
  filterRewardByVersion,
  versionTable,
  type VersionTableItem,
} from '@/custom/core/gacha/versionReward';

const currentVersion = ref<VersionTableItem>(versionTable[4] as VersionTableItem);
filterRewardByVersion('version', currentVersion.value);

const rewardItemGroupHeightMin = 800;
const rewardItemGroupHeightMax = 2600;
const rewardItemGroupHeightStep = 20;

function getDefaultRewardItemGroupHeight() {
  return Math.ceil((currentVersionReward.value.length / 2) * 80 + 3 * 80 + 80);
}

/**
 * 生成 #rewards-area 的动态背景样式
 * 根据 currentVersion.primaryColor 动态设置渐变的第二个颜色
 */
const rewardsAreaStyle = computed(() => {
  const secondColor = currentVersion.value.primaryColor || 'rgba(87, 224, 210, 1)';
  return {
    background: `linear-gradient(
      to bottom,
      rgba(255, 250, 0, 0) 0%,
      ${secondColor} 200px,
      rgba(216, 216, 216, 0.8) 720px,
      rgba(216, 216, 216, 0)
    )`,
  };
});

/**
 * 生成 #version-reward-footer 的动态背景样式
 * 根据 currentVersion.primaryColor 和 currentVersion.colorOpacity 动态设置渐变
 */
const footerStyle = computed(() => {
  const primaryColor = currentVersion.value.primaryColor || 'rgba(121, 13, 26, 1)';
  const opacityColor = currentVersion.value.colorOpacity || 'rgba(121, 13, 26, 0.3)';
  return {
    background: `linear-gradient(to right, ${primaryColor}, ${opacityColor})`,
  };
});

/**
 * 模块分组显示顺序
 * 按数组顺序排列，未列出的模块自动追加到末尾
 */
const moduleOrder = ref([
  '日常',
  '活动',
  '地区探索与建设',
  '主线任务',
  '重要任务',
  '次要任务',
  '支线任务',
  '通行证',
  '月卡',
  '权限等阶提升',
  '行动手册',
  '常驻活动',
  '蚀刻空间',
  '地区建设',
  '地区探索',
  '模拟奖励',
  '探索等级',
  '节点手册',
]);

/**
 * 按 module 分组 currentVersionReward，并按 moduleOrder 排序
 */
const groupedRewards = computed(() => {
  const groups: Record<string, Reward[]> = {};
  for (const reward of currentVersionReward.value) {
    const module = reward.module || '其他';
    if (!groups[module]) {
      groups[module] = [];
    }
    groups[module]!.push(reward);
  }
  const sorted: Record<string, Reward[]> = {};
  for (const key of moduleOrder.value) {
    if (groups[key]) {
      sorted[key] = groups[key];
    }
  }
  for (const key of Object.keys(groups)) {
    if (!moduleOrder.value.includes(key)) {
      sorted[key] = groups[key] || [];
    }
  }
  return sorted;
});

// 控制台数据 - 初始化时使用默认图片
const controlPanel = ref({
  title: '版本资源估算',
  versionName: '春晓时',
  updateDate: dateFormat(new Date()),
  otherInfo: '施工中，非版本完整资源，部分资源为保守估算，仅供参考',
  kvImage: 'https://cos.yituliu.cn/endfield/other/kv-v1.1.webp',
  rewardItemGroupHeight: getDefaultRewardItemGroupHeight(),
});

const rewardItemGroupStyle = computed(() => ({
  height: `${controlPanel.value.rewardItemGroupHeight}px`,
}));

// 组件挂载时从localStorage读取保存的数据
onMounted(() => {
  console.log('=== onMounted 开始执行 ===');

  // 检查localStorage是否可用
  if (typeof localStorage !== 'undefined') {
    console.log('localStorage 可用');
    try {
      // 读取图片
      const hasImage = localStorage.getItem('version-reward-kv-image');
      console.log(
        '从localStorage读取的图片:',
        hasImage ? `找到图片 (长度: ${hasImage.length})` : '未找到图片',
      );

      if (hasImage) {
        console.log('更新kvImage');
        controlPanel.value.kvImage = hasImage;
        console.log('当前kvImage值的前50个字符:', controlPanel.value.kvImage.slice(0, 50));
      } else {
        console.log('localStorage中没有保存的图片，使用默认图片');
      }

      // 读取标题
      const savedTitle = localStorage.getItem('version-reward-title');
      if (savedTitle) {
        console.log('读取到标题:', savedTitle);
        controlPanel.value.title = savedTitle;
      }

      // 读取版本名称
      const savedVersionName = localStorage.getItem('version-reward-version-name');
      if (savedVersionName) {
        console.log('读取到版本名称:', savedVersionName);
        controlPanel.value.versionName = savedVersionName;
      }

      // 读取更新日期
      // const savedUpdateDate = localStorage.getItem('version-reward-update-date');
      // if (savedUpdateDate) {
      //   console.log('读取到更新日期:', savedUpdateDate);
      //   controlPanel.value.updateDate = savedUpdateDate;
      // }

      // 读取其他说明
      const savedOtherInfo = localStorage.getItem('version-reward-other-info');
      if (savedOtherInfo) {
        console.log('读取到其他说明:', savedOtherInfo);
        controlPanel.value.otherInfo = savedOtherInfo;
      }

      const savedRewardItemGroupHeight = Number(
        localStorage.getItem('version-reward-item-group-height'),
      );
      if (Number.isFinite(savedRewardItemGroupHeight) && savedRewardItemGroupHeight > 0) {
        console.log('读取到奖励项区域高度:', savedRewardItemGroupHeight);
        controlPanel.value.rewardItemGroupHeight = savedRewardItemGroupHeight;
      }
    } catch (error) {
      console.error('从localStorage读取数据失败:', error);
    }
  } else {
    console.warn('localStorage 不可用');
  }

  console.log('=== onMounted 执行结束 ===');
});

// 监听控制台数据变化，自动保存到localStorage
watch(
  () => controlPanel.value.title,
  (newValue) => {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('version-reward-title', newValue);
        console.log('✓ 标题已保存到localStorage');
      } catch (error) {
        console.error('✗ 保存标题到localStorage失败:', error);
      }
    }
  },
);

watch(
  () => controlPanel.value.versionName,
  (newValue) => {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('version-reward-version-name', newValue);
        console.log('✓ 版本名称已保存到localStorage');
      } catch (error) {
        console.error('✗ 保存版本名称到localStorage失败:', error);
      }
    }
  },
);

// watch(
//   () => controlPanel.value.updateDate,
//   (newValue) => {
//     if (typeof localStorage !== 'undefined') {
//       try {
//         localStorage.setItem('version-reward-update-date', newValue);
//         console.log('✓ 更新日期已保存到localStorage');
//       } catch (error) {
//         console.error('✗ 保存更新日期到localStorage失败:', error);
//       }
//     }
//   },
// );

watch(
  () => controlPanel.value.otherInfo,
  (newValue) => {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('version-reward-other-info', newValue);
        console.log('✓ 其他说明已保存到localStorage');
      } catch (error) {
        console.error('✗ 保存其他说明到localStorage失败:', error);
      }
    }
  },
);

watch(
  () => controlPanel.value.rewardItemGroupHeight,
  (newValue) => {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('version-reward-item-group-height', String(newValue));
        console.log('✓ 奖励项区域高度已保存到localStorage');
      } catch (error) {
        console.error('✗ 保存奖励项区域高度到localStorage失败:', error);
      }
    }
  },
);

function resetRewardItemGroupHeight() {
  controlPanel.value.rewardItemGroupHeight = getDefaultRewardItemGroupHeight();
}

// 图片上传处理
function handleImageUpload(event: Event) {
  console.log('=== handleImageUpload 开始执行 ===');
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  console.log('选择的文件:', file);

  if (file) {
    console.log('文件名:', file.name, '原始文件大小:', file.size);

    // 创建Canvas压缩图片
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.addEventListener('load', () => {
      console.log('图片加载成功，开始压缩');
      console.log('原始图片尺寸:', img.width, 'x', img.height);

      // 设置最大宽度和高度
      const maxWidth = 1920;
      const maxHeight = 1080;

      let width = img.width;
      let height = img.height;

      // 计算缩放比例
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = width * ratio;
        height = height * ratio;
        console.log('缩放后的尺寸:', width, 'x', height);
      }

      canvas.width = width;
      canvas.height = height;

      // 绘制并压缩
      ctx?.drawImage(img, 0, 0, width, height);

      // 压缩为JPEG，质量0.7
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
      console.log(
        '压缩后数据长度:',
        compressedDataUrl.length,
        '约',
        numberRound(compressedDataUrl.length / 1024 / 1024, 2),
        'MB',
      );

      controlPanel.value.kvImage = compressedDataUrl;

      // 保存到localStorage
      try {
        localStorage.setItem('version-reward-kv-image', compressedDataUrl);
        console.log('✓ 图片已成功保存到localStorage');

        // 验证保存是否成功
        const saved = localStorage.getItem('version-reward-kv-image');
        console.log('验证保存:', saved ? '成功' : '失败');
        if (saved) {
          console.log('保存的数据长度:', saved.length);
        }
      } catch (error: any) {
        console.error('✗ 保存图片到localStorage失败:', error.message);

        // 如果压缩后还是太大，尝试更低的压缩率
        if (error.name === 'QuotaExceededError') {
          console.log('尝试更低的压缩率（0.5）...');
          try {
            const lowerQuality = canvas.toDataURL('image/jpeg', 0.5);
            console.log(
              '更低保真压缩后数据长度:',
              lowerQuality.length,
              '约',
              numberRound(lowerQuality.length / 1024 / 1024, 2),
              'MB',
            );
            localStorage.setItem('version-reward-kv-image', lowerQuality);
            console.log('✓ 图片已保存到localStorage（低质量）');
            controlPanel.value.kvImage = lowerQuality;
          } catch (error: any) {
            console.error('✗ 低质量压缩也失败了:', error.message);
            alert('图片太大，无法保存到localStorage。请使用小于2MB的图片。');
          }
        }
      }
    });

    img.addEventListener('error', () => {
      console.error('图片加载失败');
      alert('图片加载失败，请尝试其他图片。');
    });

    img.src = URL.createObjectURL(file);
  } else {
    console.log('没有选择文件');
  }
  console.log('=== handleImageUpload 执行结束 ===');
}
</script>

<template>
  <div class="version-reward-diy-container">
    <!-- 左侧绘图区 -->
    <div class="canvas-area">
      <!-- 头图 -->
      <img alt="" class="version-reward-bg-kv" :src="controlPanel.kvImage" />
      <!-- 等高线背景 -->
      <div class="contour-bg">
        <img alt="Map Background" src="~/assets/svg/map-bg.svg" />
      </div>
      <!-- 内容区 -->
      <div id="rewards-area" :style="rewardsAreaStyle">
        <div id="title-area">
          <!-- 大标题 -->
          <div class="title-background"></div>
          <div class="title-section">
            <h1 v-if="controlPanel.title" class="main-title">{{ controlPanel.title }}</h1>
          </div>

          <!-- 版本名称 -->
          <div class="version-section">
            <h2 class="version-title">{{ controlPanel.versionName }}</h2>
          </div>

          <!-- 其他文本（更新日期和说明） -->
          <div class="info-section">
            <div class="info-item">更新日期：{{ controlPanel.updateDate }}</div>
            <div v-if="controlPanel.otherInfo" class="info-item">
              {{ controlPanel.otherInfo }}
            </div>
          </div>
        </div>
        <div
          id="version-reward-item-group"
          class="version-reward-item-group"
          :style="rewardItemGroupStyle"
        >
          <template v-for="(rewards, module) in groupedRewards" :key="module">
            <!-- 分组标题 -->
            <div class="version-reward-module-title">{{ module }}</div>
            <!-- 分组内的奖励项 -->
            <div v-for="reward in rewards" :key="reward.id" class="version-reward-item">
              <div>
                <!-- <div class="version-reward-item-bar red-bar"></div> -->
                <div class="version-reward-item-bar yellow-bar"></div>
                <!-- <div class="version-reward-item-bar blue-bar"></div> -->
              </div>
              <div class="version-reward-item-name">{{ reward.name.zh }}</div>
              <div v-if="reward.content.originiumRecharge > 0" class="version-reward-item-content">
                <img
                  alt="衍质源石"
                  class="version-reward-item-icon"
                  src="https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/walleticon/item_originium_recharge.png"
                />× {{ reward.content.originiumRecharge }}
              </div>
              <div v-if="reward.content.diamond > 0" class="version-reward-item-content">
                <img
                  alt="嵌晶玉"
                  class="version-reward-item-icon"
                  src="https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/walleticon/item_diamond.png"
                />× {{ numberFloor(reward.content.diamond, 0) }}
              </div>
              <div
                v-if="reward.content.ticketgachaStandardSingle > 0"
                class="version-reward-item-content"
              >
                <img
                  alt="基础寻访凭证"
                  class="version-reward-item-icon"
                  src="https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/walleticon/item_ticketgacha_standard_single.png"
                />× {{ reward.content.ticketgachaStandardSingle }}
              </div>
              <div
                v-if="reward.content.ticketgachaSpecialSingle > 0"
                class="version-reward-item-content"
              >
                <img
                  alt="特许寻访凭证"
                  class="version-reward-item-icon"
                  src="https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/walleticon/item_ticketgacha_special_single.png"
                />× {{ reward.content.ticketgachaSpecialSingle }}
              </div>
              <div
                v-if="reward.content.ticketgachaLimitedSingle > 0"
                class="version-reward-item-content"
              >
                <img
                  alt="限时寻访凭证"
                  class="version-reward-item-icon"
                  src="https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/walleticon/item_ticketgacha_special_single_lt.png"
                />× {{ reward.content.ticketgachaLimitedSingle }}
              </div>
            </div>
          </template>
        </div>

        <table style="display: none">
          <thead>
            <tr>
              <th>活动名称</th>
              <th>衍质源石</th>
              <th>嵌晶玉</th>
              <th>标准寻访</th>
              <th>特许寻访</th>
              <th>限时特许寻访</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="reward in currentVersionReward" :key="reward.id">
              <td>{{ reward.name.zh }}</td>
              <td>{{ reward.content.originiumRecharge }}</td>
              <td>{{ reward.content.diamond }}</td>
              <td>{{ reward.content.ticketgachaStandardSingle }}</td>
              <td>{{ reward.content.ticketgachaSpecialSingle }}</td>
              <td>{{ reward.content.ticketgachaLimitedSingle }}</td>
            </tr>
          </tbody>
        </table>

        <!-- 统计区 -->
        <table class="version-reward-result-table">
          <thead>
            <tr>
              <th></th>
              <th>
                <img
                  alt="衍质源石"
                  class="version-reward-item-icon"
                  src="https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/walleticon/item_originium_recharge.png"
                />
              </th>
              <th>
                <img
                  alt="嵌晶玉"
                  class="version-reward-item-icon"
                  src="https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/walleticon/item_diamond.png"
                />
              </th>
              <th>
                <img
                  alt="标准寻访"
                  class="version-reward-item-icon"
                  src="https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/walleticon/item_ticketgacha_standard_single.png"
                />
              </th>
              <th>
                <img
                  alt="特许寻访"
                  class="version-reward-item-icon"
                  src="https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/walleticon/item_ticketgacha_special_single.png"
                />
              </th>
              <th>
                <img
                  alt="限时特许寻访"
                  class="version-reward-item-icon"
                  src="https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/walleticon/item_ticketgacha_special_single_lt.png"
                />
              </th>
              <th>特许寻访</th>
              <th>特许寻访+专属寻访</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="result in currentVersionRewardTotal" :key="result.name">
              <td>{{ result.name }}</td>
              <td>
                {{ result.originiumRecharge }}
              </td>
              <td>{{ numberFloor(result.diamond, 0) }}</td>
              <td>{{ result.ticketgachaStandardSingle }}</td>
              <td>{{ result.ticketgachaSpecialSingle }}</td>
              <td>{{ result.ticketgachaLimitedSingle }}</td>
              <td>{{ numberFloor(result.totalPulls as number) }}抽</td>
              <td>
                {{ numberFloor((result.totalPulls as number) + result.ticketgachaLimitedSingle) }}抽
              </td>
            </tr>
          </tbody>
        </table>

        <div id="shield" style="padding: 12px">
          <p>
            数据由攒抽计算器自动生成，非当前版本完整奖励数据，以往期版本经验来看版本末总结会再多5到10抽
          </p>
          <p>
            抽卡资源以实际发放为准，本图片时效性较低，攒抽计算器将会持续修订更新资源，可能有错漏资源，欢迎反馈
          </p>
          <p>
            通行证循环等级获得的合成玉与保障配额交易未计入，可在攒抽计算器上根据个人情况自行调整
          </p>
        </div>
      </div>
      <!-- 页脚区 -->
      <div id="version-reward-footer" :style="footerStyle">
        <table class="footer-table">
          <tbody>
            <tr>
              <td>数据来源：</td>
              <td>终末地一图流·攒抽计算器</td>
            </tr>
            <tr>
              <td></td>
              <td>https://ef.yituliu.cn/tools/gacha-calculator/</td>
            </tr>
            <tr>
              <td>信息发布：</td>
              <td>逻辑元LogicalByte@Bilibili</td>
            </tr>
          </tbody>
        </table>
        <img
          alt="existing"
          src="https://cos.yituliu.cn/endfield/QR/httpsef.yituliu.cntoolsgacha-calculator.png"
        />
      </div>
    </div>
    <!-- 右侧控制台 -->
    <div class="control-panel">
      <h2>控制台</h2>

      <!-- 图片上传 -->
      <div class="control-item">
        <label>头图上传 (KV)</label>
        <input accept="image/*" type="file" @change="handleImageUpload" />
        <div v-if="controlPanel.kvImage" class="preview-image">
          <img alt="预览" :src="controlPanel.kvImage" />
        </div>
      </div>

      <!-- 标题输入 -->
      <div class="control-item">
        <label>标题</label>
        <input v-model="controlPanel.title" placeholder="请输入标题" type="text" />
      </div>

      <!-- 版本名称输入 -->
      <div class="control-item">
        <label>版本名称</label>
        <input v-model="controlPanel.versionName" placeholder="请输入版本名称" type="text" />
      </div>

      <!-- 更新日期输入 -->
      <!-- <div class="control-item">
        <label>更新日期</label>
        <input v-model="controlPanel.updateDate" type="date" />
      </div> -->

      <!-- 其他说明输入 -->
      <div class="control-item">
        <label>其他说明</label>
        <textarea v-model="controlPanel.otherInfo" placeholder="请输入其他说明" rows="4"></textarea>
      </div>

      <div class="control-item">
        <label>奖励项区域高度</label>
        <div class="height-control">
          <input
            v-model.number="controlPanel.rewardItemGroupHeight"
            :max="rewardItemGroupHeightMax"
            :min="rewardItemGroupHeightMin"
            :step="rewardItemGroupHeightStep"
            type="range"
          />
          <div class="height-control-row">
            <input
              v-model.number="controlPanel.rewardItemGroupHeight"
              :max="rewardItemGroupHeightMax"
              :min="rewardItemGroupHeightMin"
              :step="rewardItemGroupHeightStep"
              type="number"
            />
            <span class="height-unit">px</span>
            <button type="button" @click="resetRewardItemGroupHeight">自动高度</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
:root {
  /* 深红褐色 */
  --color-primary-red: #790d1a;
  --color-primary-red-rgb: 121, 13, 26;
  --color-primary-red-rgba: rgba(121, 13, 26, 1);
}

/* ========== 1. 容器 ========== */
.version-reward-diy-container {
  display: flex;
  gap: 20px;
  padding: 20px;
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* ========== 2. 左侧绘图区 ========== */
.canvas-area {
  width: 1080px;
  flex-shrink: 0;
  font-family: 'HarmonyOS Sans SC', 'Source Han Sans SC', 'Noto Sans SC', sans-serif;

  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  position: relative;
}

/* ========== 2.1 头图 ========== */
.version-reward-bg-kv {
  width: 1080px;
  height: 540px;
  position: absolute;
  top: 0;
  object-fit: cover;
  object-position: top;
}

/* ========== 2.1.1 等高线背景 ========== */
.contour-bg {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 1080px;
  height: 1600px;
  pointer-events: none;
  z-index: 0;
}

.contour-bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(100%) brightness(150%) contrast(80%);
}

/* ========== 2.2 内容区 ========== */
#rewards-area {
  position: relative;
  margin-top: 280px;

  background: linear-gradient(
    to bottom,
    rgba(255, 250, 0, 0) 0%,
    rgba(87, 224, 210, 1) 200px,
    rgba(216, 216, 216, 0.8) 720px,
    rgba(216, 216, 216, 0)
  );
}

/* ========== 2.2.1 标题区 ========== */
#title-area {
  padding: 40px;
  height: 264px;
}

/* 大标题区块 */
.title-section {
  height: 84px;
  text-align: right;
  position: relative;
}

.title-background {
  position: absolute;
  right: 0;
  top: 30px;
  width: 480px;
  height: 120px;
  background: repeating-linear-gradient(
    45deg,
    rgba(192, 192, 192, 0.2),
    rgba(192, 192, 192, 0.2) 6px,
    rgba(64, 64, 64, 0.2) 6px,
    rgba(64, 64, 64, 0.2) 12px
  );
  z-index: 1;
}

/* 版本名称区块 */
.version-section {
  height: 48px;
  width: 400px;
  text-align: right;
  margin-left: auto;
  background-color: black;
  border-top: 6px solid;
  border-image-source: linear-gradient(
    to right,
    #ff00f0 0px,
    #ff00f0 100px,
    #fffa00 100px,
    #fffa00 200px,
    #00ffa2 200px,
    #00ffa2 300px
  );
  border-image-slice: 1;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 20px;
  position: relative;
  z-index: 2;
}

.main-title {
  font-size: 60px;
  font-weight: bold;
  color: #111;
  text-shadow: 0 0 16px rgba(255, 255, 255, 1);
  position: relative;
  z-index: 1;
}

.version-title {
  font-size: 24px;
  font-weight: bold;
  color: #fffa00;
  margin: 0;
  -webkit-text-stroke: 2px #333;
  paint-order: stroke fill;
}

/* 其他文本区块 */
.info-section {
  height: 60px;
  text-align: right;
  margin-top: 8px;
}

.info-item {
  font-size: 24px;
  font-weight: bold;
  color: #111;
}

/* ========== 2.2.2 奖励项组 ========== */
.version-reward-item-group {
  width: 1080px;
  padding: 0px 36px;
  display: block;
  columns: 2;
  column-gap: 24px;
  column-fill: auto;
  height: 1700px;
  box-sizing: border-box;
}

/* 模块分组标题 */
.version-reward-module-title {
  font-size: 32px;
  height: 64px;
  width: 500px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  margin-bottom: 12px;
  background-color: rgb(32, 32, 32, 0.85);
  color: #fffa00;
  border-left: 8px solid #fffa00;
  break-inside: avoid;
  border-radius: 8px;
}

/* ========== 2.2.2.1 单个奖励项 ========== */
.version-reward-item {
  font-size: 26px;
  height: 64px;
  width: 500px;
  display: flex;
  align-items: center;
  padding: 0 4px;
  margin-bottom: 12px;
  background-color: rgb(32, 32, 32, 0.85);
  color: white;
  break-inside: avoid;
  border-radius: 8px;
}

.version-reward-item-name {
  padding: 0px 0px 0px 12px;
  width: 240px;
  overflow: hidden;
  white-space: nowrap;
}

.version-reward-item-content {
  padding: 0 4px;
  display: flex;
  align-items: center;
}

.version-reward-item-bar {
  height: 24px;
  width: 4px;
}

.version-reward-item-icon {
  display: block;
  width: 48px;
  height: 48px;
  margin: auto;
}

/* ========== 2.2.3 结果组 ========== */

.version-reward-result-table {
  font-size: 24px;
  border-collapse: separate;
  color: white;
  width: 96%;
  margin: 20px auto;

  th,
  td {
    background-color: rgba(32, 32, 32, 0.85);
    padding: 6px;
    text-align: center;
    vertical-align: middle;
  }
}

#shield {
  font-size: 20px;
  width: 96%;
  background-color: #ffffff90;
  color: rgba(0, 0, 0, 0.87);
  padding: 4px 12px;
  margin: 0 auto 8px;
}

.version-reward-result-group {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: space-around;
}

/* ========== 2.2.3.1 单个结果 ========== */
.version-reward-result {
  width: 330px;
  background-color: rgb(32, 32, 32, 0.85);
  color: white;
  height: 288px;
  display: flex;
  margin: 12px 0;
  font-size: 24px;

  .version-reward-result-color-border {
    height: 60px;
    width: 4px;
  }

  .blue-bg.version-reward-result-color-border {
    height: 168px;
  }

  .version-reward-result-name {
    font-size: 32px;
    font-weight: bolder;
  }

  .reward-result-text {
    padding: 12px 20px;

    .version-reward-result-type {
      width: 270px;
      padding: 2px 12px;

      .version-reward-result-number {
        display: inline-block;
        padding-left: 32px;
      }
    }
  }
}

.version-reward-result-content {
  justify-content: flex-start;
  display: flex;
  flex-wrap: wrap;
}

.version-reward-result-content-item {
  width: 139px;
  display: flex;
  align-items: center;
  text-align: center;
}

#version-reward-footer-12 {
  position: relative;
  z-index: 1;
  height: 144px;
  background: linear-gradient(to right, rgba(87, 224, 210, 1), rgba(87, 224, 210, 0.3));
  font-size: 28px;
  font-weight: 600;
  color: black;
  display: flex;
  align-items: center;
}

/* ========== 2.3 页脚区 ========== */
#version-reward-footer {
  position: relative;
  z-index: 1;
  height: 144px;
  background: linear-gradient(to right, rgba(121, 13, 26, 1), rgba(121, 13, 26, 0.3));
  font-size: 28px;
  font-weight: 600;
  color: black;
  display: flex;
  align-items: center;
}

.footer-table {
  margin: 12px 32px 0px;
  flex: 1;
  /* height: 100%; */
  border-collapse: collapse;
  line-height: 1;
}

.footer-table tr:nth-child(1) {
  height: 36px;
}

.footer-table tr:nth-child(2) {
  height: 36px;
}

.footer-table tr:nth-child(3) {
  height: 60px;
}

.footer-table td:first-child {
  width: 96px;
}

.footer-table td:last-child {
  width: 480px;
}

#version-reward-footer img {
  width: 144px;
  height: 144px;
}

/* ========== 3. 右侧控制台 ========== */
.control-panel {
  flex: 1;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  min-width: 300px;
}

.control-panel h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
  border-bottom: 2px solid #fffa00;
  padding-bottom: 10px;
}

.control-item {
  margin-bottom: 20px;
}

.control-item label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #555;
}

.control-item input[type='text'],
.control-item input[type='date'],
.control-item input[type='number'],
.control-item textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.control-item input[type='file'] {
  width: 100%;
  padding: 10px;
  border: 1px dashed #ddd;
  border-radius: 4px;
  cursor: pointer;
  box-sizing: border-box;
}

.control-item input[type='file']:hover {
  border-color: #fffa00;
}

.preview-image {
  margin-top: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.preview-image img {
  width: 100%;
  height: auto;
  display: block;
}

.height-control {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.height-control input[type='range'] {
  width: 100%;
}

.height-control-row {
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 8px;
}

.height-unit {
  color: #555;
  font-size: 14px;
}

.height-control button {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fffa00;
  color: #333;
  cursor: pointer;
  font-weight: bold;
}

.height-control button:hover {
  border-color: #333;
}

/* ========== 4. 颜色工具类 ========== */
.yellow-bg {
  background-color: #fffa00;
}

.green-bg {
  background-color: #00ffa2;
}

.blue-bg {
  background-color: #00ffff;
}

.red-bg {
  background-color: #f44336;
}
</style>
