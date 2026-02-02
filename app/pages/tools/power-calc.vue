<template>
  <div class="power-calc-page">
    <CustomBackground />
    <div class="content">
      <h1 class="page-title">电池分流计算器</h1>
      <p class="page-subtitle">Battery Split Calculator</p>

      <!-- 使用说明（可折叠） -->
      <v-card class="mb-4">
        <v-card-text class="instructions-header" @click="toggleInstructions" style="cursor: pointer;">
          <h3 class="text-h6 mb-0">使用说明</h3>
          <span :class="{ collapsed: !showInstructions }">▼</span>
        </v-card-text>
        <v-card-text v-show="showInstructions" class="instructions-content">
          <div class="instruction-item mb-2 pa-3 bg-grey-lighten-4 rounded">
            <span class="instruction-number">1</span>
            <span>拖拽设备到节点卡片上（拖拽到输出口或分流器）</span>
          </div>
          <div class="instruction-item mb-2 pa-3 bg-grey-lighten-4 rounded">
            <span class="instruction-number">2</span>
            <span>二等分生成2个子节点，三等分生成3个子节点</span>
          </div>
          <div class="instruction-item pa-3 bg-grey-lighten-4 rounded">
            <span class="instruction-number">3</span>
            <span>热能池（红色）产生电力，其余电池送回仓库</span>
          </div>
        </v-card-text>
      </v-card>

      <!-- 电池类型选择 + 输入设置 -->
      <v-card class="mb-4">
        <v-card-title class="text-h6">电池类型</v-card-title>
        <v-card-text>
          <div class="battery-buttons">
            <div
              v-for="(config, key) in batteryConfig"
              :key="key"
              class="battery-button"
              :class="{ 'active': selectedBattery === key }"
              @click="selectBattery(key as keyof typeof batteryConfig)"
            >
              <div class="battery-icon">🔋</div>
              <div class="battery-info">
                <div class="battery-name">{{ config.name }}</div>
                <div class="battery-specs">{{ config.time }}秒, {{ config.power }}电力</div>
              </div>
            </div>
          </div>

          <v-divider class="my-4"></v-divider>

          <v-card-title class="text-h6 px-0">输入设置</v-card-title>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model.number="initialRate"
                label="初始输出速度 (个/分钟)"
                type="number"
                min="1"
                variant="outlined"
                @input="handleInputChange"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model.number="otherPower"
                label="其他来源电力 (⚡/秒)"
                type="number"
                min="0"
                variant="outlined"
                @input="handleInputChange"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- 分流器配置区域 -->
      <v-card class="mb-4">
        <v-card-title class="text-h6">分流器配置</v-card-title>
        <v-card-text>
          <div class="tree-container">
            <NodeCard
              :node="outputNode"
              :depth="0"
              :power-per-battery="powerPerBattery"
              :burn-time-seconds="burnTimeSeconds"
            />
          </div>

          <div v-if="outputNode.children && outputNode.children.length > 0" class="text-center mt-4">
            <v-btn color="error" variant="flat" @click="resetTree">
              重置配置
            </v-btn>
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
                yellow: item.color === 'yellow'
              }"
            >
              <div class="result-label">{{ item.label }}</div>
              <div class="result-value">{{ item.value }}</div>
            </div>
          </div>
        </v-card-text>
      </v-card>

    </div>

    <!-- 右侧固定工具栏 -->
    <div class="fixed-sidebar-tools">
      <h3 class="sidebar-title">拖拽设备到节点上</h3>
      <div class="sidebar-tools-list">
        <div 
          class="sidebar-tool-item" 
          draggable="true"
          @dragstart="onToolDragStart($event, 'splitterA')"
        >
          <span class="sidebar-tool-icon">⚡</span>
          <span class="sidebar-tool-name">二等分</span>
        </div>
        <div 
          class="sidebar-tool-item" 
          draggable="true"
          @dragstart="onToolDragStart($event, 'splitterB')"
        >
          <span class="sidebar-tool-icon">⚡⚡</span>
          <span class="sidebar-tool-name">三等分</span>
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
import CustomBackground from '~/components/layout/CustomBackground.vue';
import NodeCard from '~/components/tools/NodeCard.vue';

interface Node {
  id: string;
  type: 'output' | 'splitterA' | 'splitterB' | 'storage' | 'thermal';
  rate: number;
  children?: Node[];
}

const initialRate = ref(30);
const otherPower = ref(0);
const powerPerBattery = ref(50);
const burnTimeSeconds = ref(8);
const selectedBattery = ref('source');

// 电池类型配置
const batteryConfig = {
  source: { power: 50, time: 8, name: '源矿' },
  'low-gu': { power: 220, time: 40, name: '低容谷地电池' },
  'mid-gu': { power: 420, time: 40, name: '中容谷地电池' },
  'high-gu': { power: 1100, time: 40, name: '高容谷地电池' },
  'low-wu': { power: 1600, time: 40, name: '低容武陵电池' }
};

// 选择电池类型
const selectBattery = (key: keyof typeof batteryConfig) => {
  selectedBattery.value = key;
  const config = batteryConfig[key];
  powerPerBattery.value = config.power;
  burnTimeSeconds.value = config.time;
  handleInputChange();
};
const storageCount = ref(0);
const burnedCount = ref(0);
const simultaneousBurning = ref(0);
const thermalPoolsNeeded = ref(0);
const powerPerSecond = ref(0);
const totalPower = ref(0);
const totalPowerWithOther = ref(0);
const showInstructions = ref(true);

// 切换使用说明显示
const toggleInstructions = () => {
  showInstructions.value = !showInstructions.value;
};

// 计算结果项
const resultItems = computed(() => [
  { label: '电池类型', value: batteryConfig[selectedBattery.value as keyof typeof batteryConfig].name, highlight: false, color: 'default' },
  { label: '燃烧电池', value: `${burnedCount.value.toFixed(2)} 个/分钟`, highlight: false, color: 'default' },
  { label: '需要热能池个数', value: `${simultaneousBurning.value.toFixed(2)}（${thermalPoolsNeeded.value}）`, highlight: false, color: 'default' },
  { label: '其他来源电力', value: otherPower.value.toFixed(2), highlight: false, color: 'yellow' },
  { label: '平均输出功率', value: totalPower.value.toFixed(2), highlight: false, color: 'blue' },
  { label: '总电力', value: totalPowerWithOther.value.toFixed(2), highlight: true, color: 'green' }
]);

// 输出口作为根节点
const outputNode = ref<Node>({
  id: 'output',
  type: 'output',
  rate: 30,
  children: []
});

const draggedTool = ref<Node['type'] | null>(null);

// 生成唯一ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// 拖拽工具开始
const onToolDragStart = (event: DragEvent, toolType: Node['type']) => {
  draggedTool.value = toolType;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData('text/plain', toolType);
  }
};

// 重置配置
const resetTree = () => {
  outputNode.value.children = [];
  outputNode.value.rate = initialRate.value;
  recalculateRates();
  calculatePower();
};

// 重新计算所有节点的流量
const recalculateRates = () => {
  outputNode.value.rate = initialRate.value;
  
  const calculateNodeRate = (node: Node) => {
    if (node.children && node.children.length > 0) {
      const outputRate = node.rate / node.children.length;
      node.children.forEach(child => {
        child.rate = outputRate;
        calculateNodeRate(child);
      });
    }
  };
  
  calculateNodeRate(outputNode.value);
};

// 计算电力
const calculatePower = () => {
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
      node.children.forEach(child => traverseNode(child));
    }
  };
  
  traverseNode(outputNode.value);
  
  if (!hasThermal && !hasStorage) {
    storageCount.value = initialRate.value;
    burnedCount.value = 0;
    simultaneousBurning.value = 0;
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
};

// 处理输入变化
const handleInputChange = () => {
  recalculateRates();
  calculatePower();
};

// 监听outputNode的children变化，自动重新计算
watch(() => outputNode.value.children, () => {
  recalculateRates();
  calculatePower();
}, { deep: true });

// 初始化计算
handleInputChange();
</script>

<style scoped>
.power-calc-page {
  min-height: 100vh;
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
  color: var(--text-primary, #333);
}

.page-subtitle {
  font-size: 1.2rem;
  color: var(--text-secondary, #666);
  margin-bottom: 2rem;
}

.instructions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.instructions-header:hover {
  opacity: 0.8;
}

.collapse-icon {
  transition: transform 0.3s ease;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-primary, #333);
}

.collapse-icon.collapsed {
  transform: rotate(-90deg);
}

.instructions-content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.battery-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.battery-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 32px 24px;
  background: rgba(102, 126, 234, 0.05);
  border: 2px solid var(--border-color, #e0e0e0);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--text-primary, #333);
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
  font-size: 3.5rem;
}

.battery-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.battery-name {
  font-size: 1.1rem;
  font-weight: 700;
}

.battery-specs {
  font-size: 0.9rem;
  opacity: 0.9;
}

.tree-container {
  margin-bottom: 24px;
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
  background: linear-gradient(135deg, #66BB6A 0%, #43A047 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 187, 106, 0.4);
}

.result-item.highlight:hover {
  background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%);
  box-shadow: 0 6px 16px rgba(102, 187, 106, 0.5);
}

.result-item.blue {
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
}

.result-item.blue:hover {
  background: linear-gradient(135deg, #1E88E5 0%, #1565C0 100%);
  box-shadow: 0 6px 16px rgba(33, 150, 243, 0.4);
}

.result-item.blue .result-label,
.result-item.blue .result-value {
  color: white;
}

.result-item.yellow {
  background: linear-gradient(135deg, #FFC107 0%, #FFA000 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);
}

.result-item.yellow:hover {
  background: linear-gradient(135deg, #FFB300 0%, #FF8F00 100%);
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  z-index: 100;
}

.sidebar-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: white;
  margin-bottom: 16px;
  text-align: center;
  padding-bottom: 8px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.3);
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
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  cursor: grab;
  transition: all 0.3s ease;
  color: white;
}

.sidebar-tool-item:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateX(-4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
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

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .content {
    margin-right: 0;
    padding-right: 20px;
  }
  
  .fixed-sidebar-tools {
    position: static;
    transform: none;
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 20px;
  }
  
  .sidebar-tools-list {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>