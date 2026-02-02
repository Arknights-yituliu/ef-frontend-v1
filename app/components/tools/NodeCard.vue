<template>
  <div class="node-wrapper">
    <div 
      class="node-card" 
      :class="{
        'output': node.type === 'output',
        'splitter': node.type === 'splitterA' || node.type === 'splitterB',
        'storage': node.type === 'storage',
        'thermal': node.type === 'thermal',
        'can-drop': node.type === 'output' || node.type === 'splitterA' || node.type === 'splitterB',
        'child-node-card': depth > 0
      }"
      @dragover.prevent="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
      <template v-if="depth === 0">
        <div class="node-header">
          <div class="node-type-info">
            <span class="node-icon">
              {{ node.type === 'output' ? '⬇️' : node.type === 'splitterA' ? '⚡' : node.type === 'splitterB' ? '⚡⚡' : node.type === 'storage' ? '📦' : '🔥' }}
            </span>
            <span class="node-name">
              {{ node.type === 'output' ? '输出口' : node.type === 'splitterA' ? '二等分' : node.type === 'splitterB' ? '三等分' : node.type === 'storage' ? '仓库' : '热能池' }}
            </span>
          </div>
          <div class="node-rate">{{ node.rate.toFixed(2) }}/min</div>
        </div>
        <div v-if="isDraggingOver && (node.type === 'output' || node.type === 'splitterA' || node.type === 'splitterB')" class="drop-hint">
          松开以添加工具
        </div>
        <div v-if="(node.type === 'output' || node.type === 'splitterA' || node.type === 'splitterB') && node.children && node.children.length > 0" class="delete-button" @click.stop="removeChildren">
          ✕ 清除子节点
        </div>
      </template>
      
      <template v-else>
        <div class="child-node-content">
          <div class="child-rate">{{ node.rate.toFixed(2) }}/min</div>
          <div v-if="powerPerMinute" class="child-power">
            {{ powerPerMinute.toFixed(0) }} ⚡
          </div>
        </div>
        <div v-if="(node.type === 'splitterA' || node.type === 'splitterB') && node.children && node.children.length > 0" class="child-delete-button" @click.stop="removeChildren">
          ✕
        </div>
      </template>
    </div>
    
    <div v-if="node.type === 'output' || node.type === 'splitterA' || node.type === 'splitterB'" class="node-children">
      <template v-if="node.children && node.children.length > 0">
        <div 
          v-for="(child, index) in node.children"
          :key="child.id"
          class="child-node"
        >
          <NodeCard 
            :node="child"
            :depth="depth + 1"
            :power-per-battery="powerPerBattery"
            :burn-time-seconds="burnTimeSeconds"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, computed } from 'vue';

interface Node {
  id: string;
  type: 'output' | 'splitterA' | 'splitterB' | 'storage' | 'thermal';
  rate: number;
  children?: Node[];
}

interface Props {
  node: Node;
  depth: number;
  powerPerBattery?: number;
  burnTimeSeconds?: number;
}

const props = defineProps<Props>();

// 计算每秒平均功率
const powerPerMinute = computed(() => {
  if (props.node.type !== 'thermal') return null;
  if (!props.powerPerBattery || !props.burnTimeSeconds) return null;
  
  const burnTimeMinutes = props.burnTimeSeconds / 60;
  const simultaneousBurning = props.node.rate * burnTimeMinutes;
  const powerPerSecond = simultaneousBurning * props.powerPerBattery;
  return powerPerSecond; // 每秒功率
});

const isDraggingOver = ref(false);

const generateId = () => Math.random().toString(36).substr(2, 9);

const onDragOver = (event: DragEvent) => {
  if (props.node.type === 'output' || props.node.type === 'splitterA' || props.node.type === 'splitterB') {
    isDraggingOver.value = true;
  }
};

const onDragLeave = () => {
  isDraggingOver.value = false;
};

const onDrop = (event: DragEvent) => {
  event.preventDefault();
  event.stopPropagation();
  
  if (props.node.type === 'output' || props.node.type === 'splitterA' || props.node.type === 'splitterB') {
    const toolType = event.dataTransfer?.getData('text/plain') as Node['type'];
    if (toolType) {
      addChildren(toolType);
    }
  }
  
  isDraggingOver.value = false;
};

const addChildren = (toolType: Node['type']) => {
  if (!props.node.children) {
    props.node.children = [];
  }
  
  // 根据工具类型生成对应数量的子节点
  let childrenCount = 1;
  if (toolType === 'splitterA') {
    childrenCount = 2;
  } else if (toolType === 'splitterB') {
    childrenCount = 3;
  }
  
  for (let i = 0; i < childrenCount; i++) {
    props.node.children.push({
      id: generateId(),
      type: toolType,
      rate: 0,
      children: toolType === 'splitterA' || toolType === 'splitterB' ? [] : undefined
    });
  }
};

const removeChildren = () => {
  if (props.node.children) {
    props.node.children = [];
  }
};
</script>

<style scoped>
.node-wrapper {
  width: 100%;
}

.node-card {
  padding: 20px;
  border-radius: 12px;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  margin-bottom: 12px;
  position: relative;
  cursor: default;
}

.node-card.child-node-card {
  padding: 12px;
  margin-bottom: 8px;
}

.child-node-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  justify-content: center;
}

.child-rate {
  font-size: 1rem;
  font-weight: 600;
}

.child-power {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

.child-delete-button {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(255, 255, 255, 0.9);
  color: #f44;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.child-delete-button:hover {
  background: #f44;
  color: white;
}

.node-card.can-drop:hover {
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
  transform: translateY(-2px);
}

.node-card.isDraggingOver {
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.5);
}

.node-card.output {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.node-card.splitter {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.node-card.storage {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
}

.node-card.thermal {
  background: linear-gradient(135deg, #f44 0%, #d33 100%);
}

.node-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.node-type-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.node-icon {
  font-size: 2rem;
}

.node-name {
  font-weight: 700;
  font-size: 1.1rem;
}

.node-rate {
  padding: 6px 16px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
}

.drop-hint {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  pointer-events: none;
}

.delete-button {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255, 255, 255, 0.9);
  color: #f44;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.delete-button:hover {
  background: #f44;
  color: white;
}

.node-children {
  display: flex;
  flex-direction: row;
  gap: 8px;
  padding: 12px 0;
  width: 100%;
}


.child-node {
  flex: 1;
  min-width: 0;
}
</style>