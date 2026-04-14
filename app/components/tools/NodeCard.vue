<template>
  <div class="node-wrapper">
    <div 
      class="node-card" 
      :class="{
        'output': node.type === 'output',
        'splitter': node.type === 'splitter',
        'storage': node.type === 'storage',
        'thermal': node.type === 'thermal',
        'can-drop': node.type === 'output' || node.type === 'splitter',
        'child-node-card': depth > 0,
        'mobile-clickable': isMobile
      }"
      :data-node-id="node.id"
      @click="handleClick"
      @dragleave="onDragLeave"
      @dragover.prevent="onDragOver"
      @drop="onDrop"
    >
      <template v-if="depth === 0">
        <div class="node-header">
          <div class="node-type-info">
            <span class="node-icon">
              {{ node.type === 'output' ? '⬇️' : node.type === 'splitter' ? '🔀' : node.type === 'storage' ? '📦' : '🔥' }}
            </span>
            <span class="node-name">
              {{ node.type === 'output' ? 
                  (isMobile ? '输出口（请点选这里或子节点以添加设备）' : '输出口（请拖拽设备到这里或子节点上）') : 
                  (node.type === 'splitter' ? '分流器' : node.type === 'storage' ? '仓库' : '热能池') 
              }}
            </span>
          </div>
          <div class="node-rate">{{ numberRound(node.rate,2) }}/min</div>
        </div>
        <div v-if="isDraggingOver && (node.type === 'output' || node.type === 'splitter')" class="drop-hint">
          松开以添加工具
        </div>
      </template>
      
      <template v-else>
        <div class="child-node-content">
          <div class="child-rate">{{ numberRound(node.rate,2) }}/min</div>
          <div v-if="powerPerMinute" class="child-power">
            {{ numberRound(powerPerMinute,0) }} ⚡
          </div>
        </div>
        <div class="child-delete-button" @click.stop="removeNode">
          ✕
        </div>
      </template>
    </div>
    
    <div v-if="node.type === 'output' || node.type === 'splitter'" class="node-children">
      <template v-if="node.children && node.children.length > 0">
        <div 
          v-for="(child, index) in node.children"
          :key="child.id"
          class="child-node"
        >
          <NodeCard 
            :burn-time-seconds="burnTimeSeconds"
            :depth="depth + 1"
            :is-mobile="isMobile"
            :node="child"
            :on-node-click="onNodeClick"
            :on-remove="onRemove"
            :power-per-battery="powerPerBattery"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { numberRound } from '#shared/utils/numberUtil';
import { computed, nextTick, watch } from 'vue';

interface Node {
  id: string;
  type: 'output' | 'splitter' | 'storage' | 'thermal';
  rate: number;
  children?: Node[];
}

interface Props {
  node: Node;
  depth: number;
  powerPerBattery?: number;
  burnTimeSeconds?: number;
  onRemove?: (nodeId: string) => void;
  onNodeClick?: (node: Node) => void;
  isMobile?: boolean;
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

const generateId = () => Math.random().toString(36).slice(2, 11);

function onDragOver (event: DragEvent) {
  if (props.node.type === 'output' || props.node.type === 'splitter') {
    isDraggingOver.value = true;
  }
}

function onDragLeave () {
  isDraggingOver.value = false;
}

function onDrop (event: DragEvent) {
  event.preventDefault();
  event.stopPropagation();
  
  if (props.node.type === 'output' || props.node.type === 'splitter') {
    const toolType = event.dataTransfer?.getData('text/plain') as Node['type'];
    if (toolType) {
      addChildren(toolType);
    }
  }
  
  isDraggingOver.value = false;
}

function handleClick () {
  if (props.onNodeClick) {
    props.onNodeClick(props.node);
  }
}

function addChildren (toolType: Node['type']) {
  if (!props.node.children) {
    props.node.children = [];
  }
  
  // 添加一个子节点
  props.node.children.push({
    id: generateId(),
    type: toolType,
    rate: 0,
    children: toolType === 'splitter' ? [] : undefined
  });
}

function removeChildren () {
  if (props.node.children) {
    props.node.children = [];
  }
}

function removeNode () {
  if (props.onRemove) {
    props.onRemove(props.node.id);
  }
}
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

.node-card.mobile-clickable {
  cursor: pointer;
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

.node-card.mobile-clickable:hover {
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

/* 移动端样式 */
body.is-mobile-device .node-card {
  padding: 16px;
  margin-bottom: 10px;
}

body.is-mobile-device .node-card.child-node-card {
  padding: 10px;
  margin-bottom: 6px;
}

body.is-mobile-device .child-node-content {
  gap: 2px;
}

body.is-mobile-device .child-rate {
  font-size: 0.9rem;
}

body.is-mobile-device .child-power {
  font-size: 0.75rem;
}

body.is-mobile-device .child-delete-button {
  width: 18px;
  height: 18px;
  font-size: 0.65rem;
  top: 3px;
  right: 3px;
}

body.is-mobile-device .node-icon {
  font-size: 1.5rem;
}

body.is-mobile-device .node-name {
  font-size: 0.9rem;
}

body.is-mobile-device .node-rate {
  padding: 4px 12px;
  font-size: 0.85rem;
}

body.is-mobile-device .node-header {
  gap: 8px;
}

body.is-mobile-device .child-node {
  flex: 1;
  min-width: 0;
}

body.is-mobile-device .drop-hint {
  padding: 6px 12px;
  font-size: 0.8rem;
}

/* 平板端优化 - 仅桌面设备 */
@media (min-width: 769px) and (max-width: 1024px) {
  body.is-desktop-device .node-card {
    padding: 18px;
  }

  body.is-desktop-device .node-card.child-node-card {
    padding: 11px;
  }

  body.is-desktop-device .node-children {
    gap: 6px;
  }
}
</style>
