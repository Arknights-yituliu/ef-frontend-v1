<script setup lang="ts">
import { calculateDaysDifference, countTuesdaysBetweenV2 } from '#shared/utils/gacha-calculator';
import { computed } from 'vue';
import { packs } from '@/custom/core/packs';

const props = defineProps<{
  modelValue: {
    monthlyPass: boolean;
    battlePass: boolean;
    protocolCustomization: boolean;
    monthlyPassDays: number;
    selectedPacks: Record<string, number>;
    originiumStones: Record<string, number>;
  }
  currentPool?: {
    start: Date;
    end: Date;
  };
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void;
}>();

// 月卡状态
const monthlyPassActive = computed({
  get: () => props.modelValue.monthlyPass,
  set: (val) => emit('update:modelValue', { ...props.modelValue, monthlyPass: val })
});

// 通行证状态
const sourceRationActive = computed({
  get: () => props.modelValue.battlePass,
  set: (val) => emit('update:modelValue', { ...props.modelValue, battlePass: val })
});

const protocolCustomizationActive = computed({
  get: () => props.modelValue.protocolCustomization,
  set: (val) => emit('update:modelValue', { ...props.modelValue, protocolCustomization: val })
});


// 计算月卡天数（自动根据当前日期和池子结束日期计算）
const monthlyPassDays = computed(() => {
  if (!props.currentPool) {
    return 30;
  }
  const endDate: Date = props.currentPool.end;
  const daysDiff = calculateDaysDifference(new Date(),endDate)
  return numberFloor(daysDiff,0);
});


// 计算月卡资源（从packs.ts获取）
const monthlyPassResources = computed(() => {
  const monthlyPack = packs['月卡'];
  const originiumRecharge = monthlyPack ? 12 : 0; // 一次性12源石
  const oneTimeDiamond = monthlyPack ? 6000 : 0; // 一次性6000玉
  const dailyDiamond = monthlyPassDays.value * 200; // 每天200玉
  const totalDiamond = oneTimeDiamond + dailyDiamond;
  const price = Math.ceil(monthlyPassDays.value / 30) *30;
  const pulls = (originiumRecharge * 75 + totalDiamond) / 500;

  return {
    originiumRecharge,
    oneTimeDiamond,
    dailyDiamond,
    totalDiamond,
    ticketgachaSpecialSingle: 0,
    ticketgachaStandardSingle: 0,
    pulls,
    price
  };
});

// 判断是否为抽卡资源（玉、源石、抽卡券）
function isGachaResource(itemId: string): boolean {
  return (
    itemId === 'item_originium_recharge' ||
    itemId === 'item_diamond' ||
    itemId === 'item_ticketgacha_special_single' ||
    itemId === 'item_ticketgacha_standard_single' ||
    itemId.includes('ticketgacha_special_ten') ||
    itemId.includes('ticketgacha_standard_ten')
  );
}

// 礼包列表（排除月卡、通行证和源石相关的礼包，以及0抽的礼包）
const giftPacks = computed(() => {
  const packList = [];
  for (const [key, pack] of Object.entries(packs)) {
    if (key.includes('月卡') || key.includes('bp_track') || key.includes('源石')) {
      continue;
    }

    // 计算礼包的抽数，过滤掉0抽的礼包
    const pulls = calculatePackPulls(pack);
    if (pulls <= 0) {
      continue;
    }

    packList.push({
      id: key,
      ...pack
    });
  }
  return packList;
});

// 礼包选择状态
const selectedPacks = computed({
  get: () => props.modelValue.selectedPacks,
  set: (val) => emit('update:modelValue', { ...props.modelValue, selectedPacks: val })
});

// 源石列表
const firstRechargeStones = computed(() => {
  const stoneList = [];
  const stoneKeys = ['6元双倍源石', '30元双倍源石', '98元双倍源石', '198元双倍源石', '328元双倍源石', '648元双倍源石'];

  for (const key of stoneKeys) {
    if (packs[key as keyof typeof packs]) {
      stoneList.push({
        id: key,
        ...packs[key as keyof typeof packs]
      });
    }
  }
  return stoneList;
});

// 非首充源石列表（可重复购买）
const normalStones = computed(() => {
  const stoneList = [];
  const stoneKeys = ['6元源石', '30元源石', '98元源石', '198元源石', '328元源石', '648元源石'];

  for (const key of stoneKeys) {
    if (packs[key as keyof typeof packs]) {
      stoneList.push({
        id: key,
        ...packs[key as keyof typeof packs]
      });
    }
  }
  return stoneList;
});

// 源石数量
const originiumStoneQuantities = computed({
  get: () => props.modelValue.originiumStones,
  set: (val) => emit('update:modelValue', { ...props.modelValue, originiumStones: val })
});

// 计算礼包的抽数
function calculatePackPulls(pack: any): number {
  let totalPulls = 0;
  let totalDiamonds = 0;

  for (const item of pack.contents) {
    switch (item.itemId) {
    case 'item_originium_recharge': {
      // 1源石 = 75嵌晶玉
      totalDiamonds += item.quantity * 75;

    break;
    }
    case 'item_diamond': {
      totalDiamonds += item.quantity;

    break;
    }
    case 'item_ticketgacha_special_single': {
      // 特许寻访凭证直接算作抽数
      totalPulls += item.quantity;

    break;
    }
    case 'item_ticketgacha_standard_single': {
      // 基础寻访凭证直接算作抽数
      totalPulls += item.quantity;

    break;
    }
    default: { if (item.itemId.includes('ticketgacha_special_ten')) {
      // 十连凭证算作10抽
      totalPulls += item.quantity * 10;
    }
    }
    }
  }

  // 将嵌晶玉转换为抽数：500嵌晶玉 = 1抽
  totalPulls += totalDiamonds / 500;

  return totalPulls;
}

// 获取礼包的主要图标
function getPackIcon(pack: any): string {
  for (const item of pack.contents) {
    if (item.itemId === 'item_ticketgacha_special_single' || item.itemId.includes('ticketgacha_special_ten')) {
      return 'https://cos.yituliu.cn/endfield/unpack-images/items/item_ticketgacha_special_single.webp';
    }
    if (item.itemId === 'item_ticketgacha_standard_single') {
      return 'https://cos.yituliu.cn/endfield/unpack-images/items/item_ticketgacha_standard_single.webp';
    }
    if (item.itemId === 'item_originium_recharge') {
      return 'https://cos.yituliu.cn/endfield/unpack-images/items/item_originium_recharge.webp';
    }
    if (item.itemId === 'item_diamond') {
      return 'https://cos.yituliu.cn/endfield/unpack-images/items/item_diamond.webp';
    }
  }
  // 默认使用特许寻访凭证图标
  return 'https://cos.yituliu.cn/endfield/unpack-images/items/item_ticketgacha_special_single.webp';
}

// 计算总金额
const totalPrice = computed(() => {
  let total = 0;

  // 礼包金额
  for (const [packId, quantity] of Object.entries(selectedPacks.value)) {
    if (quantity > 0) {
      const pack = packs[packId as keyof typeof packs];
      if (pack) {
        total += pack.price * quantity;
      }
    }
  }

  // 普通源石金额
  for (const [stoneId, quantity] of Object.entries(originiumStoneQuantities.value)) {
    if (quantity > 0) {
      const stone = packs[stoneId as keyof typeof packs];
      if (stone) {
        total += stone.price * quantity;
      }
    }
  }

  return total;
});

// 切换礼包选择
function togglePack(packId: string) {
  const current = (selectedPacks.value && selectedPacks.value[packId]) || 0;
  const newValue = current > 0 ? 0 : 1;
  emit('update:modelValue', {
    ...props.modelValue,
    selectedPacks: {
      ...selectedPacks.value,
      [packId]: newValue
    }
  });
}

// 更新源石数量
function updateOriginiumQuantity(stoneId: string, value: number) {
  emit('update:modelValue', {
    ...props.modelValue,
    originiumStones: {
      ...originiumStoneQuantities.value,
      [stoneId]: Math.max(0, value)
    }
  });
}

// 获取源石数量
function getStoneQuantity(stone: any): number {
  if (stone.contents && stone.contents[0]) {
    return stone.contents[0].quantity;
  }
  return 0;
}

// 获取图标URL
function getImageUrl(itemId: string): string {
  const itemIdDict: Record<string, string> = {
    'item_originium_recharge': 'originium_recharge',
    'item_diamond': 'diamond',
    'item_ticketgacha_special_single': 'ticketgacha_special_single',
    'item_ticketgacha_standard_single': 'ticketgacha_standard_single'
  };

  if (itemIdDict[itemId]) {
    return `https://cos.yituliu.cn/endfield/unpack-images/items/item_${itemIdDict[itemId]}.webp`;
  } else {
    return `https://cos.yituliu.cn/endfield/unpack-images/items/item_1.webp`;
  }
}
</script>

<template>
  <div class="paid-resources-container">
    <!-- 月卡/通行证 -->
    <div class="section-title">月卡/通行证</div>
    <v-btn
      :active="monthlyPassActive"
      class="gacha-calculator-resource-single-btn"
      :class="{ 'btn-active': monthlyPassActive }"
      @click="monthlyPassActive = !monthlyPassActive"
    >
      <div class="gacha-calculator-resource-single-btn-content">
        <div class="gacha-calculator-resource-single-title">
          月卡（{{ monthlyPassDays }}天）
        </div>
        <div class="gacha-calculator-resource-single-content">
          <img
            alt="originium"
            class="gacha-calculator-gacha-item-icon"
            src="https://cos.yituliu.cn/endfield/unpack-images/items/item_originium_recharge.webp"
          >
          X {{ monthlyPassResources?.originiumRecharge }}
        </div>
        <div class="gacha-calculator-resource-single-content">
          <img
            alt="diamond"
            class="gacha-calculator-gacha-item-icon"
            src="https://cos.yituliu.cn/endfield/unpack-images/items/item_diamond.webp"
          >
          X {{ monthlyPassResources ? monthlyPassDays * 200 : 0  }}
        </div>
        <div class="gacha-calculator-resource-single-content">
          ¥{{ monthlyPassResources ? monthlyPassResources.price : 0 }}
        </div>
      </div>
    </v-btn>
    <v-btn
      :active="sourceRationActive"
      class="gacha-calculator-resource-single-btn"
      :class="{ 'btn-active': sourceRationActive }"
      @click="sourceRationActive = !sourceRationActive"
    >
      <div class="gacha-calculator-resource-single-btn-content">
        <div class="gacha-calculator-resource-single-title">
          源石配给
        </div>
        <div class="gacha-calculator-resource-single-content">
          <img
            alt="originium"
            class="gacha-calculator-gacha-item-icon"
            src="https://cos.yituliu.cn/endfield/unpack-images/items/item_originium_recharge.webp"
          >
          X 3
        </div>
        <div class="gacha-calculator-resource-single-content">
          ¥0
        </div>
      </div>
    </v-btn>
    <v-btn
      :active="protocolCustomizationActive"
      class="gacha-calculator-resource-single-btn"
      :class="{ 'btn-active': protocolCustomizationActive }"
      @click="protocolCustomizationActive = !protocolCustomizationActive"
    >
      <div class="gacha-calculator-resource-single-btn-content">
        <div class="gacha-calculator-resource-single-title">
          协议定制
        </div>
        <div class="gacha-calculator-resource-single-content">
          <img
            alt="originium"
            class="gacha-calculator-gacha-item-icon"
            src="https://cos.yituliu.cn/endfield/unpack-images/items/item_originium_recharge.webp"
          >
          X 36
        </div>
        <div class="gacha-calculator-resource-single-content">
          ¥68
        </div>
      </div>
    </v-btn>

    <v-divider style="margin: 1rem 0" />

    <!-- 礼包 -->
    <div class="section-title">礼包</div>
    <v-btn
      v-for="pack in giftPacks"
      :key="pack.id"
      :active="selectedPacks[pack.id] > 0"
      class="gacha-calculator-resource-single-btn"
      :class="{ 'btn-active': selectedPacks[pack.id] > 0 }"
      @click="togglePack(pack.id)"
    >
      <div class="gacha-calculator-resource-single-btn-content">
        <div class="gacha-calculator-resource-single-title">
          {{ pack.packDisplayNameZH }}
        </div>
        <div
          v-for="item in pack.contents"
          v-show="isGachaResource(item.itemId)"
          :key="`${pack.id}-${item.itemId}`"
          class="gacha-calculator-resource-single-content"
        >
          <img alt="item" class="gacha-calculator-gacha-item-icon" :src="getImageUrl(item.itemId)">
          X {{ item.quantity }}
        </div>
        <div class="gacha-calculator-resource-single-content">
          ¥{{ pack.price }}
        </div>
      </div>
    </v-btn>

    <v-divider style="margin: 1rem 0" />

    <!-- 首充源石 -->
    <div class="section-title">首充源石</div>
    <v-btn
      v-for="stone in firstRechargeStones"
      :key="stone.id"
      :active="(selectedPacks[stone.id] || 0) > 0"
      class="gacha-calculator-resource-single-btn"
      :class="{ 'btn-active': (selectedPacks[stone.id] || 0) > 0 }"
      @click="togglePack(stone.id)"
    >
      <div class="gacha-calculator-resource-single-btn-content">
        <div class="gacha-calculator-resource-single-title">
          {{ stone.packDisplayNameZH }}
        </div>
        <div
          v-for="item in stone.contents"
          v-show="isGachaResource(item.itemId)"
          :key="`${stone.id}-${item.itemId}`"
          class="gacha-calculator-resource-single-content"
        >
          <img alt="item" class="gacha-calculator-gacha-item-icon" :src="getImageUrl(item.itemId)">
          X {{ item.quantity }}
        </div>
        <div class="gacha-calculator-resource-single-content">
          ¥{{ stone.price }}
        </div>
      </div>
    </v-btn>

    <v-divider style="margin: 1rem 0" />

    <!-- 普通源石 -->
    <div class="section-title">普通源石</div>

      <div
v-for="stone in normalStones"  :key="stone.id"
           class="gacha-calculator-resource-single">
        <div class="gacha-calculator-resource-single-title">
          {{ stone.packDisplayNameZH }}
        </div>
        <div
          v-for="item in stone.contents"
          v-show="isGachaResource(item.itemId)"
          :key="`${stone.id}-${item.itemId}`"
          class="gacha-calculator-resource-single-content"
        >
          <img alt="item" class="gacha-calculator-gacha-item-icon" :src="getImageUrl(item.itemId)">
          X {{ item.quantity }}
        </div>
        <div class="gacha-calculator-resource-single-content">
          ¥{{ stone.price }}
        </div>
        <div class="gacha-calculator-resource-single-content">
          <v-btn
            density="compact"
            size="small"
            variant="outlined"
            @click.stop="updateOriginiumQuantity(stone.id, (originiumStoneQuantities[stone.id] || 0) - 1)"
          >
            -
          </v-btn>
          <span class="stone-number">{{ originiumStoneQuantities[stone.id] || 0 }}</span>
          <v-btn
            density="compact"
            size="small"
            variant="outlined"
            @click.stop="updateOriginiumQuantity(stone.id, (originiumStoneQuantities[stone.id] || 0) + 1)"
          >
            +
          </v-btn>
        </div>
      </div>

  </div>
</template>

<style scoped>
.paid-resources-container {
}

.section-title {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.placeholder-card {
  background-color: #f5f5f5;
  margin: 4px 0;
}

.gacha-calculator-gacha-item-icon {
  width: 36px;
  height: 36px;
}

.gacha-calculator-resource-single-btn {
  margin: 4px 0px;
  width: 100%;
  border: 1px solid var(--theme-border-secondary);
  transition: all 0.2s ease;
}

.gacha-calculator-resource-single-btn.btn-active {
  border-bottom: 3px solid #FFD700 !important;
}

.gacha-calculator-resource-single-btn:deep([aria-pressed="true"]) {
  border-bottom: 3px solid #FFD700 !important;
}

.gacha-calculator-resource-single-btn-content {
  width: 560px;
  display: flex;
  box-sizing: border-box;
  font-size: 1rem;
  align-items: center;
  border-radius: 4px;
}

.gacha-calculator-resource-single{
  width: 560px;
  display: flex;
  box-sizing: border-box;
  font-size: 1rem;
  align-items: center;
  border-radius: 4px;
  margin: 4px 0;
  padding: 4px 4px;
  border: 1px solid var(--theme-border-secondary);
  box-shadow:  rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px;
}

.gacha-calculator-resource-single-title {
  width: 200px;
  text-align: start;
}

.gacha-calculator-resource-single-content {
  display: flex;
  align-items: center;
  padding: 0 4px;
}

.stone-number {
  margin: 0 8px;
  font-weight: 600;
}


@media screen and (max-width: 600px) {
  .gacha-calculator-resource-single-btn-content {
    width: 300px;
    font-size: 0.8rem;
  }

  .gacha-calculator-resource-single {
    width: 300px;
    font-size: 0.8rem;
  }

  .gacha-calculator-resource-single-title {
    width: 120px;
  }

}

</style>
