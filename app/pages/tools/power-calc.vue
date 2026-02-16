<template>
  <div class="power-calc-page">
    <CustomBackground />
    <div class="content">
      <header class="page-title">电池分流计算器</header>
      <p class="page-subtitle">Battery Split Calculator</p>

      <!-- 使用说明 -->
      <div class="instructions mb-4">
        <div class="instruction-item">
          <span class="instruction-text">
            <span class="instruction-number">1</span>
            <template v-if="isMobile">点击节点/子节点以添加分流器或热能池</template>
            <template v-else>从右侧工具栏拖拽分流器到节点/子节点卡片上以逐级分流</template>
          </span>
        </div>
        <div class="instruction-item">
          <span class="instruction-text">
            <span class="instruction-number">2</span>
            <template v-if="isMobile">点击热能池到需要烧掉的电池上，其余电池认为送回仓库</template>
            <template v-else>拖拽热能池到需要烧掉的电池上，其余电池认为送回仓库</template>
          </span>
        </div>
      </div>

      <!-- 电池类型选择 + 输入设置 -->
      <v-card class="mb-4">
        <v-card-text>
          <div class="battery-buttons">
            <div
              v-for="(config, key) in batteryConfig"
              :key="key"
              class="battery-button"
              :class="{ active: selectedBattery === key }"
              @click="selectBattery(key as keyof typeof batteryConfig)"
            >
              <div class="battery-icon">
                <img :src="config.image" :alt="config.name" />
              </div>
              <div class="battery-info">
                <div class="battery-name">{{ config.name }}</div>
                <div class="battery-specs">{{ config.time }}秒, {{ config.power }}电力</div>
              </div>
            </div>
          </div>

          <v-divider class="my-4" />

          <v-row>
            <v-col cols="12" sm="4">
              <v-text-field
                v-model.number="initialRate"
                density="compact"
                label="电池输出速度 (个/分钟)"
                min="1"
                type="number"
                variant="outlined"
                @input="handleInputChange"
              />
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                v-model.number="otherPower"
                density="compact"
                label="现有其他来源电力 (⚡)"
                min="0"
                type="number"
                variant="outlined"
                @input="handleInputChange"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- 分流器配置区域 -->
      <v-card class="mb-4">
        <v-card-title class="text-h6">分流器配置</v-card-title>
        <v-card-text>
          <div ref="treeContainerRef" class="tree-container">
            <!-- 流程图连接线 -->
            <svg ref="svgRef" class="flowchart-background">
              <g class="connections">
                <g v-for="(line, index) in flowLines" :key="`line-${index}`">
                  <!-- 连接线 -->
                  <line
                    class="flow-line"
                    :stroke="line.color"
                    :stroke-width="line.width"
                    :x1="line.x1"
                    :x2="line.x2"
                    :y1="line.y1"
                    :y2="line.y2"
                  />
                  <!-- 箭头（只在showArrow为true时显示） -->
                  <polygon
                    v-if="line.showArrow"
                    class="arrow-head"
                    fill="#999"
                    :points="calculateArrowPoints(line.x1, line.y1, line.x2, line.y2)"
                  />
                </g>
              </g>
            </svg>

            <NodeCard
              :burn-time-seconds="burnTimeSeconds"
              :depth="0"
              :is-mobile="isMobile"
              :node="outputNode"
              :on-node-click="handleNodeClick"
              :on-remove="removeNode"
              :power-per-battery="powerPerBattery"
            />
          </div>

          <div
            v-if="outputNode.children && outputNode.children.length > 0"
            class="text-center mt-4"
          >
            <v-btn color="error" variant="flat" @click="resetTree"> 重置配置 </v-btn>
          </div>
        </v-card-text>
      </v-card>

      <!-- 计算结果 -->
      <v-card class="mb-4">
        <v-card-title class="text-h6">计算结果</v-card-title>
        <v-card-text>
          <div class="result-content">
            <div
              v-for="(item, index) in resultItems"
              :key="index"
              class="result-item"
              :class="{
                highlight: item.highlight,
                blue: item.color === 'blue',
                yellow: item.color === 'yellow',
              }"
            >
              <div class="result-label">{{ item.label }}</div>
              <div class="result-value">{{ item.value }}</div>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </div>

    <!-- 移动端节点操作面板 -->
    <div
      v-if="isMobile && showMobileActionPanel"
      class="mobile-action-panel"
      @click="closeActionPanel"
    >
      <div class="action-panel-content" @click.stop>
        <div class="panel-body">
          <div class="node-info-text">
            <div class="node-info-row">
              <span class="node-type">{{
                selectedNode?.type === 'output'
                  ? '输出口'
                  : selectedNode?.type === 'splitter'
                    ? '分流器'
                    : selectedNode?.type === 'storage'
                      ? '仓库'
                      : '热能池'
              }}</span>
              <span class="node-rate">{{ selectedNode?.rate.toFixed(2) }}/min</span>
            </div>
          </div>

          <div
            v-if="selectedNode?.type === 'output' || selectedNode?.type === 'splitter'"
            class="action-buttons"
          >
            <button class="action-button splitter-btn" @click="addChildToSelected('splitter')">
              <span class="btn-icon">🔀</span>
              <span class="btn-text">添加分流器</span>
            </button>
            <button class="action-button thermal-btn" @click="addChildToSelected('thermal')">
              <span class="btn-icon">🔥</span>
              <span class="btn-text">添加热能池</span>
            </button>
          </div>

          <button
            v-if="selectedNode?.type !== 'output'"
            class="action-button delete-btn"
            @click="deleteSelectedNode"
          >
            <span class="btn-icon">🗑️</span>
            <span class="btn-text">删除此节点</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 桌面端右侧固定工具栏 -->
    <div v-if="!isMobile" class="fixed-sidebar-tools">
      <h3 class="sidebar-title">拖拽设备到节点上</h3>
      <div class="sidebar-tools-list">
        <div
          class="sidebar-tool-item"
          draggable="true"
          @dragstart="onToolDragStart($event, 'splitter')"
        >
          <span class="sidebar-tool-icon">🔀</span>
          <span class="sidebar-tool-name">分流器</span>
        </div>
        <div
          class="sidebar-tool-item"
          draggable="true"
          @dragstart="onToolDragStart($event, 'thermal')"
        >
          <span class="sidebar-tool-icon">🔥</span>
          <span class="sidebar-tool-name">热能池</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted } from 'vue';
import CustomBackground from '~/components/layout/CustomBackground.vue';
import NodeCard from '~/components/tools/NodeCard.vue';

interface Node {
  id: string;
  type: 'output' | 'splitter' | 'storage' | 'thermal';
  rate: number;
  children?: Node[];
}

const initialRate = ref(30);
const otherPower = ref(0);
const powerPerBattery = ref(50);
const burnTimeSeconds = ref(8);
const selectedBattery = ref('source');

// 简单的防抖函数
function debounce <T extends (...args: any[]) => any>(func: T,
  duration: number = 500): ((...args: Parameters<T>) => void) {
  let timeout: any = 0;
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, duration);
  };
}

// 移动端检测
const isMobile = ref(false);

// 检测是否为移动设备（基于设备类型，而非屏幕宽度）
function checkIsMobile () {
  if (typeof navigator === 'undefined') return false;
  const userAgent = navigator.userAgent || navigator.vendor || '';
  // 精确的移动设备检测，iPad始终被视为移动设备
  const mobileRegex =
    /android(?!.*mobile)|iphone|ipod|ipad|blackberry|iemobile|opera mini|windows phone|kindle|silk/i;
  return mobileRegex.test(userAgent);
}

if (typeof window !== 'undefined') {
  isMobile.value = checkIsMobile();

  // 给body添加类，用于CSS样式控制
  const updateBodyClass = () => {
    if (isMobile.value) {
      document.body.classList.add('is-mobile-device');
      document.body.classList.remove('is-desktop-device');
    } else {
      document.body.classList.remove('is-mobile-device');
      document.body.classList.add('is-desktop-device');
    }
  };
  updateBodyClass();
}

// 电池类型配置
const batteryConfig = {
  source: { power: 50, time: 8, name: '源矿', image: 'https://cos.yituliu.cn/endfield/items/item_originium_ore.webp' },
  'low-gu': { power: 220, time: 40, name: '低容谷地电池', image: 'https://cos.yituliu.cn/endfield/items/item_proc_battery_1.webp' },
  'mid-gu': { power: 420, time: 40, name: '中容谷地电池', image: 'https://cos.yituliu.cn/endfield/items/item_proc_battery_2.webp' },
  'high-gu': { power: 1100, time: 40, name: '高容谷地电池', image: 'https://cos.yituliu.cn/endfield/items/item_proc_battery_3.webp' },
  'low-wu': { power: 1600, time: 40, name: '低容武陵电池', image: 'https://cos.yituliu.cn/endfield/items/item_proc_battery_4.webp' },
};

// 选择电池类型
function selectBattery (key: keyof typeof batteryConfig) {
  selectedBattery.value = key;
  const config = batteryConfig[key];
  powerPerBattery.value = config.power;
  burnTimeSeconds.value = config.time;
  handleInputChange();
}
const storageCount = ref(0);
const burnedCount = ref(0);
const simultaneousBurning = ref(0);
const thermalPoolsNeeded = ref(0);
const powerPerSecond = ref(0);
const totalPower = ref(0);
const totalPowerWithOther = ref(0);

// 计算结果项
const resultItems = computed(() => [
  {
    label: '电池类型',
    value: batteryConfig[selectedBattery.value as keyof typeof batteryConfig].name,
    highlight: false,
    color: 'default',
  },
  {
    label: '燃烧电池',
    value: `${burnedCount.value.toFixed(2)} 个/分钟`,
    highlight: false,
    color: 'default',
  },
  {
    label: '需要热能池个数',
    value: `${simultaneousBurning.value.toFixed(2)}（${thermalPoolsNeeded.value}）`,
    highlight: false,
    color: 'default',
  },
  {
    label: '其他来源电力',
    value: `${otherPower.value.toFixed(2)} ⚡`,
    highlight: false,
    color: 'default',
  },
  {
    label: '平均输出功率',
    value: `${totalPower.value.toFixed(2)} ⚡`,
    highlight: false,
    color: 'default',
  },
  {
    label: '总电力',
    value: `${totalPowerWithOther.value.toFixed(2)} ⚡`,
    highlight: true,
    color: 'blue',
  },
]);

// 输出口作为根节点
const outputNode = ref<Node>({
  id: 'output',
  type: 'output',
  rate: 30,
  children: [],
});

const draggedTool = ref<Node['type'] | null>(null);
const selectedNode = ref<Node | null>(null);
const showMobileActionPanel = ref(false);

// 桑基图相关引用
const treeContainerRef = ref<HTMLElement | null>(null);
const svgRef = ref<SVGSVGElement | null>(null);

// 流程图连接线数据
interface FlowLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  width: number;
  showArrow: boolean; // 是否显示箭头
}

// 计算箭头的三个顶点坐标
function calculateArrowPoints (x1: number, y1: number, x2: number, y2: number): string {
  const arrowSize = 8; // 箭头大小
  const angle = Math.atan2(y2 - y1, x2 - x1);

  // 在线条终点稍前一点的位置开始绘制箭头
  const offset = 2; // 箭头向后偏移，避免被节点卡片遮挡
  const tipX = x2 - offset * Math.cos(angle);
  const tipY = y2 - offset * Math.sin(angle);

  // 计算箭头两个底边的点
  const leftAngle = angle + Math.PI * 0.85;
  const rightAngle = angle - Math.PI * 0.85;

  const leftX = tipX + arrowSize * Math.cos(leftAngle);
  const leftY = tipY + arrowSize * Math.sin(leftAngle);

  const rightX = tipX + arrowSize * Math.cos(rightAngle);
  const rightY = tipY + arrowSize * Math.sin(rightAngle);

  return `${tipX},${tipY} ${leftX},${leftY} ${rightX},${rightY}`;
}

// 使用ref存储连接线，而不是computed，以便在DOM更新后手动更新
const flowLines = ref<FlowLine[]>([]);

// 计算连接线的函数
function calculateFlowLines () {
  const lines: FlowLine[] = [];

  // 如果容器还没渲染，返回空数组
  if (!treeContainerRef.value) {
    flowLines.value = lines;
    return;
  }

  // 先收集所有需要连接的父子对，避免遍历顺序影响结果
  const connections: Array<{ parentNode: Node; childNode: Node }> = [];

  const collectConnections = (node: Node) => {
    if ((node.type === 'output' || node.type === 'splitter') && node.children) {
      for (const child of node.children) {
        connections.push({ parentNode: node, childNode: child });
        // 递归处理子节点
        collectConnections(child);
      }
    }
  };

  collectConnections(outputNode.value);

  // 收集所有节点及其位置信息
  const nodesWithPositions = new Map<string, HTMLElement>();

  const traverse = (node: Node, depth: number, parentId?: string) => {
    const nodeElements = treeContainerRef.value?.querySelectorAll(`[data-node-id="${node.id}"]`);
    if (nodeElements && nodeElements.length > 0) {
      const element = nodeElements[0] as HTMLElement;
      nodesWithPositions.set(node.id, element);
    }

    if (node.children) {
      for (const child of node.children) traverse(child, depth + 1, node.id);
    }
  };

  traverse(outputNode.value, 0);

  // 为每个连接生成简单的垂直线
  for (const { parentNode, childNode } of connections) {
    const parentElement = nodesWithPositions.get(parentNode.id);
    const childElement = nodesWithPositions.get(childNode.id);

    if (parentElement && childElement && treeContainerRef.value) {
      const parentRect = parentElement.getBoundingClientRect();
      const childRect = childElement.getBoundingClientRect();
      const containerRect = treeContainerRef.value.getBoundingClientRect();

      // 使用子节点的x坐标，使线条完全垂直
      const childX = childRect.left - containerRect.left + childRect.width / 2;
      const parentY = parentRect.bottom - containerRect.top;
      const childY = childRect.top - containerRect.top;

      // 统一使用灰色线条
      const lineColor = '#999';

      // 根据子节点的速率与初始速度的比例计算线条宽度
      // 初始节点的连接线宽度为144px
      const baseWidth = 144;
      const ratio = childNode.rate / initialRate.value;
      const lineWidth = Math.max(2, baseWidth * ratio); // 最小2px

      // 确保坐标是有效的
      if (!isNaN(childX) && !isNaN(parentY) && !isNaN(childY)) {
        lines.push({
          x1: childX,
          y1: parentY,
          x2: childX,
          y2: childY,
          color: lineColor,
          width: lineWidth,
          showArrow: true,
        });
      }
    }
  }

  flowLines.value = lines;
}

// 生成唯一ID
const generateId = () => Math.random().toString(36).slice(2, 11);

// 处理节点点击（移动端）
function handleNodeClick (node: Node) {
  if (isMobile.value) {
    selectedNode.value = node;
    showMobileActionPanel.value = true;
  }
}

// 添加子节点到选中节点
async function addChildToSelected (toolType: Node['type']) {
  if (
    selectedNode.value &&
    (selectedNode.value.type === 'output' || selectedNode.value.type === 'splitter')
  ) {
    if (!selectedNode.value.children) {
      selectedNode.value.children = [];
    }

    selectedNode.value.children.push({
      id: generateId(),
      type: toolType,
      rate: 0,
      children: toolType === 'splitter' ? [] : undefined,
    });

    recalculateRates();
    calculatePower();

    // 等待DOM更新后再关闭面板，确保连接线已经绘制
    await nextTick();
    // 再次等待，确保Vue的DOM更新和浏览器的重排都完成
    await new Promise((resolve) => setTimeout(resolve, 0));

    showMobileActionPanel.value = false;
  }
}

// 删除选中的节点
function deleteSelectedNode () {
  if (selectedNode.value) {
    removeNode(selectedNode.value.id);
    showMobileActionPanel.value = false;
  }
}

// 关闭操作面板
function closeActionPanel () {
  showMobileActionPanel.value = false;
  selectedNode.value = null;
}

// 删除节点
function removeNode (nodeId: string) {
  const findAndRemove = (node: Node): boolean => {
    if (node.children) {
      const index = node.children.findIndex((child) => child.id === nodeId);
      if (index !== -1) {
        node.children.splice(index, 1);
        return true;
      }
      for (const child of node.children) {
        if (findAndRemove(child)) {
          return true;
        }
      }
    }
    return false;
  };

  findAndRemove(outputNode.value);
  recalculateRates();
  calculatePower();
}

// 拖拽工具开始
function onToolDragStart (event: DragEvent, toolType: string) {
  draggedTool.value = toolType as Node['type'];
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData('text/plain', toolType);
  }
}

// 重置配置
function resetTree () {
  outputNode.value.children = [];
  outputNode.value.rate = initialRate.value;
  recalculateRates();
  calculatePower();
}

// 重新计算所有节点的流量
function recalculateRates () {
  outputNode.value.rate = initialRate.value;

  const calculateNodeRate = (node: Node) => {
    if (node.children && node.children.length > 0) {
      const outputRate = node.rate / node.children.length;
      for (const child of node.children) {
        child.rate = outputRate;
        calculateNodeRate(child);
      }
    }
  };

  calculateNodeRate(outputNode.value);
}

// 计算电力
function calculatePower () {
  let storage = 0;
  let burned = 0;
  let hasThermal = false;
  let hasStorage = false;

  const traverseNode = (node: Node) => {
    if (node.type === 'storage') {
      storage += node.rate;
      hasStorage = true;
    } else if (node.type === 'thermal') {
      burned += node.rate;
      hasThermal = true;
    }

    if (node.children) {
      for (const child of node.children) traverseNode(child);
    }
  };

  traverseNode(outputNode.value);

  if (!hasThermal && !hasStorage) {
    storageCount.value = initialRate.value;
    burnedCount.value = 0;
    simultaneousBurning.value = 0;
    thermalPoolsNeeded.value = 0;
    powerPerSecond.value = 0;
    totalPower.value = 0;
  } else {
    burnedCount.value = burned;
    // 送入仓库 = 总数 - 烧掉的电池数
    storageCount.value = initialRate.value - burned;

    // 同时燃烧的电池数 = 每分钟燃烧数 * (燃烧时间秒 / 60)
    const burnTimeMinutes = burnTimeSeconds.value / 60;
    simultaneousBurning.value = burned * burnTimeMinutes;

    // 需要热能池个数 = 向上取整(同时燃烧电池数 / 每个热能池容量)
    // 假设每个热能池可以同时燃烧1个电池
    thermalPoolsNeeded.value = Math.ceil(simultaneousBurning.value);

    // 每秒电力输出 = 同时燃烧的电池数 * 每秒电力
    powerPerSecond.value = simultaneousBurning.value * powerPerBattery.value;

    // 平均输出功率 = 每秒电力输出
    totalPower.value = powerPerSecond.value;

    // 总电力 = 平均输出功率 + 其他来源电力
    totalPowerWithOther.value = powerPerSecond.value + otherPower.value;
  }
}

// 处理输入变化
function handleInputChange () {
  recalculateRates();
  calculatePower();
}

// 监听outputNode的children变化，自动重新计算流量、电力和连接线
watch(
  () => outputNode.value.children,
  async () => {
    recalculateRates();
    calculatePower();
    await nextTick();
    // 调用计算函数更新连接线
    calculateFlowLines();
  },
  { deep: true },
);

// 监听窗口大小变化，重新计算路径
onMounted(() => {
  const handleResize = debounce(() => {
    calculateFlowLines();
  }, 100);

  window.addEventListener('resize', handleResize);

  // 初始化时计算一次连接线
  nextTick(() => {
    calculateFlowLines();
  });

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
  });
});

// 初始化计算
handleInputChange();
</script>

<style scoped>
.power-calc-page {
  position: relative;
  z-index: 1;
}

.content {
  padding: 20px;
  max-width: 1600px;
  margin: 0 auto;
  margin-right: 140px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #333;
}

.page-subtitle {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
}

[data-theme='dark'] .page-title {
  color: #e0e0e0;
}

[data-theme='dark'] .page-subtitle {
  color: #b0b0b0;
}

@media (prefers-color-scheme: dark) {
  .page-title {
    color: #333333;
  }

  .page-subtitle {
    color: #b0b0b0;
  }
}

.instructions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.instruction-item {
  padding: 16px 20px;
  background: #f5f5f5;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.instruction-item:hover {
  background: #eeeeee;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

@media (prefers-color-scheme: dark) {
  .instruction-item {
    background: rgba(255, 255, 255, 0.08);
    color: #303030;
  }

  .instruction-item:hover {
    background: rgba(255, 255, 255, 0.12);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  }
}

[data-theme='dark'] .instruction-item {
  background: rgba(255, 255, 255, 0.08);
  color: #e0e0e0;
}

[data-theme='dark'] .instruction-item:hover {
  background: rgba(255, 255, 255, 0.12);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.battery-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.battery-button {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: rgba(102, 126, 234, 0.05);
  border: 2px solid #e0e0e0;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #333;
}

.battery-button:hover {
  background: rgba(102, 126, 234, 0.1);
  border-color: #667eea;
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.2);
}

.battery-button.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  color: white;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
}

.battery-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.battery-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.battery-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.battery-name {
  font-size: 1.2rem;
  font-weight: 700;
}

.battery-specs {
  font-size: 0.85rem;
  opacity: 0.9;
}

@media (prefers-color-scheme: dark) {
  .battery-button {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
    color: #333333;
  }

  .battery-button:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: #667eea;
    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
  }

  .battery-button.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-color: #667eea;
    color: white;
  }
}

[data-theme='dark'] .battery-button {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
  color: #e0e0e0;
}

[data-theme='dark'] .battery-button:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: #667eea;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
}

[data-theme='dark'] .battery-button.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  color: white;
}

.tree-container {
  margin-bottom: 24px;
  position: relative;
  min-height: 100px;
}

/* 流程图背景层 */
.flowchart-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: visible;
}

.flow-line {
  transition: all 0.3s ease;
  opacity: 0.6;
}

.flow-line:hover {
  opacity: 1;
  filter: brightness(1.2);
}

.arrow-head {
  transition: all 0.3s ease;
  opacity: 0.6;
}

.arrow-head:hover {
  opacity: 1;
  filter: brightness(1.2);
}

/* 确保节点卡片在SVG层之上 */
.tree-container :deep(.node-wrapper) {
  position: relative;
  z-index: 1;
}

.tree-container :deep(.node-card) {
  position: relative;
  z-index: 2;
}

.result-content {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
}

.result-item {
  padding: 20px;
  background: #f5f5f5;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: all 0.3s ease;
  text-align: center;
}

.result-item:hover {
  background: #eeeeee;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.result-item.highlight {
  background: linear-gradient(135deg, #66bb6a 0%, #43a047 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 187, 106, 0.4);
}

.result-item.highlight:hover {
  background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
  box-shadow: 0 6px 16px rgba(102, 187, 106, 0.5);
}

.result-item.blue {
  background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
}

.result-item.blue:hover {
  background: linear-gradient(135deg, #1e88e5 0%, #1565c0 100%);
  box-shadow: 0 6px 16px rgba(33, 150, 243, 0.4);
}

.result-item.blue .result-label,
.result-item.blue .result-value {
  color: white;
}

.result-item.yellow {
  background: linear-gradient(135deg, #ffc107 0%, #ffa000 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);
}

.result-item.yellow:hover {
  background: linear-gradient(135deg, #ffb300 0%, #ff8f00 100%);
  box-shadow: 0 6px 16px rgba(255, 193, 7, 0.4);
}

.result-item.yellow .result-label,
.result-item.yellow .result-value {
  color: white;
}

.result-label {
  font-size: 0.85rem;
  color: #666;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.result-item.highlight .result-label {
  color: rgba(255, 255, 255, 0.9);
}

.result-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  line-height: 1.2;
}

.result-item.highlight .result-value {
  color: white;
}

@media (prefers-color-scheme: dark) {
  .result-item {
    background: rgba(255, 255, 255, 0.08);
    color: #e0e0e0;
  }

  .result-item:hover {
    background: rgba(255, 255, 255, 0.12);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  }

  .result-label {
    color: #b0b0b0;
  }

  .result-value {
    color: #3a3a3a;
  }
}

[data-theme='dark'] .result-item {
  background: rgba(255, 255, 255, 0.08);
  color: #e0e0e0;
}

[data-theme='dark'] .result-item:hover {
  background: rgba(255, 255, 255, 0.12);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

[data-theme='dark'] .result-label {
  color: #b0b0b0;
}

[data-theme='dark'] .result-value {
  color: #e0e0e0;
}

.instruction-text {
  display: flex;
  align-items: center;
  gap: 8px;
}

.instruction-number {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  font-weight: 700;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.fixed-sidebar-tools {
  position: fixed;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  width: 120px;
  background: #fff9c4;
  border-radius: 12px;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  z-index: 100;
}

.sidebar-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 16px;
  text-align: center;
  padding-bottom: 8px;
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
}

.sidebar-tools-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sidebar-tool-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  cursor: grab;
  transition: all 0.3s ease;
  color: white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.sidebar-tool-item:hover {
  background: linear-gradient(135deg, #764ba2 0%, #8e44ad 100%);
  transform: translateX(-4px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.sidebar-tool-item:active {
  cursor: grabbing;
}

.sidebar-tool-icon {
  font-size: 2rem;
}

.sidebar-tool-name {
  font-size: 0.85rem;
  font-weight: 600;
  text-align: center;
}

/* 移动端操作面板 */
.mobile-action-panel {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.action-panel-content {
  background: white;
  border-radius: 24px 0 0 24px;
  width: 100%;
  max-width: 400px;
  height: 100vh;
  overflow-y: auto;
  animation: slideInRight 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

@media (prefers-color-scheme: dark) {
  .action-panel-content {
    background: #1a1a1a;
  }
}

[data-theme='dark'] .action-panel-content {
  background: #1a1a1a;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.panel-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.node-info-text {
  text-align: center;
  margin-bottom: 24px;
  padding: 16px;
  font-size: 1rem;
  color: #333;
  background: #f5f5f5;
  border-radius: 8px;
}

.node-info-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.node-type {
  font-weight: 700;
  color: #667eea;
}

.node-rate {
  margin-left: 8px;
  font-weight: 600;
}

@media (prefers-color-scheme: dark) {
  .node-info-text {
    background: rgba(255, 255, 255, 0.08);
    color: #e0e0e0;
  }

  .node-type {
    color: #9fa8da;
  }
}

[data-theme='dark'] .node-info-text {
  background: rgba(255, 255, 255, 0.08);
  color: #e0e0e0;
}

[data-theme='dark'] .node-type {
  color: #9fa8da;
}

.action-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.action-button {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.action-button:active {
  transform: translateY(0);
}

.splitter-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.thermal-btn {
  background: linear-gradient(135deg, #f44 0%, #d33 100%);
}

.delete-btn {
  width: 100%;
  background: linear-gradient(135deg, #ff4757 0%, #ff6b81 100%);
  margin-top: 8px;
}

.btn-icon {
  font-size: 1.3rem;
}

.btn-text {
  font-size: 0.9rem;
}
</style>

<style>
/* 移动端样式 - 基于设备类型而非屏幕宽度 */
body.is-mobile-device .power-calc-page .content {
  margin-right: 0;
  padding: 12px;
}

body.is-mobile-device .power-calc-page .page-title {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

body.is-mobile-device .power-calc-page .page-subtitle {
  font-size: 1rem;
  margin-bottom: 1rem;
}

@media (prefers-color-scheme: dark) {
  body.is-mobile-device .power-calc-page .page-title {
    color: #333333;
  }

  body.is-mobile-device .power-calc-page .page-subtitle {
    color: #333333;
  }
}

[data-theme='dark'] body.is-mobile-device .power-calc-page .page-title {
  color: #e0e0e0;
}

[data-theme='dark'] body.is-mobile-device .power-calc-page .page-subtitle {
  color: #b0b0b0;
}

/* 使用说明改为单列 */
body.is-mobile-device .power-calc-page .instructions {
  grid-template-columns: 1fr;
  gap: 10px;
}

body.is-mobile-device .power-calc-page .instruction-item {
  padding: 12px 16px;
}

body.is-mobile-device .power-calc-page .instruction-text {
  font-size: 0.9rem;
  line-height: 1.5;
}

body.is-mobile-device .power-calc-page .instruction-number {
  width: 24px;
  height: 24px;
  font-size: 0.8rem;
}

/* 电池按钮改为水平滚动 */
body.is-mobile-device .power-calc-page .battery-buttons {
  display: flex;
  overflow-x: auto;
  gap: 12px;
  padding-bottom: 8px;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}

body.is-mobile-device .power-calc-page .battery-button {
  flex: 0 0 160px;
  padding: 12px 16px;
  scroll-snap-align: start;
}

body.is-mobile-device .power-calc-page .battery-icon {
  width: 48px;
  height: 48px;
}

body.is-mobile-device .power-calc-page .battery-name {
  font-size: 1rem;
}

body.is-mobile-device .power-calc-page .battery-specs {
  font-size: 0.75rem;
}

/* 输入框全宽 */
body.is-mobile-device .power-calc-page .battery-buttons + .v-divider + .v-row .v-col {
  flex: 0 0 100%;
  max-width: 100%;
  padding: 0 0 12px 0;
}

/* 结果显示改为2列 */
body.is-mobile-device .power-calc-page .result-content {
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

body.is-mobile-device .power-calc-page .result-item {
  padding: 14px;
}

body.is-mobile-device .power-calc-page .result-label {
  font-size: 0.75rem;
}

body.is-mobile-device .power-calc-page .result-value {
  font-size: 1.1rem;
}

/* 隐藏桌面端工具栏 */
body.is-mobile-device .power-calc-page .fixed-sidebar-tools {
  display: none;
}

/* 平板端优化 - 仅桌面设备 */
@media (min-width: 769px) and (max-width: 1024px) {
  body.is-desktop-device .power-calc-page .content {
    padding: 16px;
  }

  body.is-desktop-device .power-calc-page .result-content {
    grid-template-columns: repeat(3, 1fr);
  }

  body.is-desktop-device .power-calc-page .battery-buttons {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }

  body.is-desktop-device .power-calc-page .fixed-sidebar-tools {
    width: 100px;
    right: 10px;
  }

  body.is-desktop-device .power-calc-page .sidebar-tool-icon {
    font-size: 1.5rem;
  }

  body.is-desktop-device .power-calc-page .sidebar-tool-name {
    font-size: 0.75rem;
  }
}
</style>
