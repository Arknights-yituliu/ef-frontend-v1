<script setup lang="ts">
import { calculateDaysDifference } from '#shared/utils/gacha-calculator';
import { getPackTotalWeaponQuota } from '#shared/utils/gameData/pack';
import { computed } from 'vue';
import { packs } from '@/custom/core/packs';

const { locale } = useI18n();

const props = defineProps<{
  modelValue: {
    monthlyPass: boolean;
    battlePass: boolean;
    protocolCustomization: boolean;
    monthlyPassDays: number;
    selectedPacks: Record<string, number>;
    originiumStones: Record<string, number>;
  };
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
  set: (val) => emit('update:modelValue', { ...props.modelValue, monthlyPass: val }),
});

// 通行证状态
const sourceRationActive = computed({
  get: () => props.modelValue.battlePass,
  set: (val) => emit('update:modelValue', { ...props.modelValue, battlePass: val }),
});

const protocolCustomizationActive = computed({
  get: () => props.modelValue.protocolCustomization,
  set: (val) => emit('update:modelValue', { ...props.modelValue, protocolCustomization: val }),
});

const protocolCustomizationWeaponQuota = getPackTotalWeaponQuota(packs['bp_track_pay'], false);
const quantityAdjustablePackMaxQuantities: Record<string, number> = {
  weapon_giftpack_02: 3,
  weapon_giftpack_03: 5,
};

// 计算月卡天数（自动根据当前日期和池子结束日期计算）
const monthlyPassDays = computed(() => {
  if (!props.currentPool) {
    return 30;
  }
  const endDate: Date = props.currentPool.end;
  const daysDiff = calculateDaysDifference(new Date(), endDate);
  return numberFloor(daysDiff, 0);
});

// 计算月卡资源（从packs.ts获取）
const monthlyPackData = computed(() => {
  return Object.values(packs).find((p) => p.category === 'MCard');
});

const monthlyPassResources = computed(() => {
  const monthlyPack = monthlyPackData.value;
  const originiumRecharge = monthlyPack ? 12 : 0; // 一次性12源石
  const oneTimeDiamond = monthlyPack ? 6000 : 0; // 一次性6000玉
  const dailyDiamond = monthlyPassDays.value * 200; // 每天200玉
  const totalDiamond = oneTimeDiamond + dailyDiamond;
  const price = Math.ceil(monthlyPassDays.value / 30) * 30;
  const pulls = (originiumRecharge * 75 + totalDiamond) / 500;

  return {
    originiumRecharge,
    oneTimeDiamond,
    dailyDiamond,
    totalDiamond,
    ticketgachaSpecialSingle: 0,
    ticketgachaStandardSingle: 0,
    pulls,
    price,
  };
});

// 判断是否为抽卡或武库配额资源
function isGachaResource(itemId: string): boolean {
  return (
    itemId === 'item_originium_recharge' ||
    itemId === 'item_diamond' ||
    itemId === 'item_gachabyproducts_weapongold' ||
    itemId.includes('ticketgacha_standard_single') ||
    itemId.includes('ticketgacha_special_single') ||
    itemId.includes('ticketgacha_special_single_lt') ||
    itemId.includes('ticketgacha_special_ten_lt')
  );
}

// 礼包列表（排除月卡、通行证和源石相关的礼包，以及不含抽卡或武库配额的礼包）
const giftPacks = computed(() => {
  const packList = [];
  const excludedCategories = new Set([
    'MCard',
    'BP',
    'first_originium_recharge',
    'non_first_originium_recharge',
  ]);
  for (const [key, pack] of Object.entries(packs)) {
    if (excludedCategories.has(pack.category)) {
      continue;
    }

    // 直接提供武库配额的礼包也需要在攒抽计算器中可选
    const pulls = calculatePackPulls(pack);
    const weaponQuota = getPackTotalWeaponQuota(pack, false);
    if (pulls <= 0 && weaponQuota <= 0) {
      continue;
    }

    packList.push({
      id: key,
      ...pack,
    });
  }
  return packList;
});

// 礼包选择状态
const selectedPacks = computed({
  get: () => props.modelValue.selectedPacks,
  set: (val) => emit('update:modelValue', { ...props.modelValue, selectedPacks: val }),
});

// 首充源石列表
const firstRechargeStones = computed(() => {
  return Object.values(packs)
    .filter((pack) => pack.category === 'first_originium_recharge')
    .map((pack) => ({ id: pack.packId, ...pack }));
});

// 非首充源石列表（可重复购买）
const normalStones = computed(() => {
  return Object.values(packs)
    .filter((pack) => pack.category === 'non_first_originium_recharge')
    .map((pack) => ({ id: pack.packId, ...pack }));
});

// 源石数量
const originiumStoneQuantities = computed({
  get: () => props.modelValue.originiumStones,
  set: (val) => emit('update:modelValue', { ...props.modelValue, originiumStones: val }),
});

// 计算礼包的抽数
function calculatePackPulls(pack: any): number {
  let totalPulls = 0;
  for (const item of pack.contents) {
    const id = item.itemId;
    if (id === 'item_originium_recharge') {
      totalPulls += (item.quantity * 75) / 500;
    } else if (id === 'item_diamond') {
      totalPulls += item.quantity / 500;
    } else if (
      id.includes('ticketgacha_standard_single') ||
      id.includes('ticketgacha_special_single') ||
      id.includes('ticketgacha_special_single_lt')
    ) {
      totalPulls += item.quantity;
    } else if (id.includes('ticketgacha_special_ten')) {
      totalPulls += item.quantity * 10;
    }
  }

  return totalPulls;
}

// 获取礼包的主要图标
function getPackIcon(pack: any): string {
  for (const item of pack.contents) {
    if (
      item.itemId === 'item_ticketgacha_special_single' ||
      item.itemId.includes('ticketgacha_special_ten')
    ) {
      return 'https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/walleticon/item_ticketgacha_special_single.png';
    }
    if (item.itemId === 'item_ticketgacha_standard_single') {
      return 'https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/walleticon/item_ticketgacha_standard_single.png';
    }
    if (item.itemId === 'item_originium_recharge') {
      return 'https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/walleticon/item_originium_recharge.png';
    }
    if (item.itemId === 'item_diamond') {
      return 'https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/walleticon/item_diamond.png';
    }
  }
  // 默认使用特许寻访凭证图标
  return 'https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/walleticon/item_ticketgacha_special_single.png';
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
  const quantity = getPackQuantity(packId);
  const maxQuantity = getPackMaxQuantity(packId);
  updatePackQuantity(packId, quantity >= maxQuantity ? 0 : quantity + 1);
}

function getPackQuantity(packId: string): number {
  return selectedPacks.value[packId] || 0;
}

function isQuantityAdjustablePack(packId: string): boolean {
  return packId in quantityAdjustablePackMaxQuantities;
}

function getPackMaxQuantity(packId: string): number {
  return quantityAdjustablePackMaxQuantities[packId] || 1;
}

function updatePackQuantity(packId: string, value: number) {
  const quantity = Number.isFinite(value)
    ? Math.min(getPackMaxQuantity(packId), Math.max(0, Math.floor(value)))
    : 0;
  emit('update:modelValue', {
    ...props.modelValue,
    selectedPacks: {
      ...selectedPacks.value,
      [packId]: quantity,
    },
  });
}

// 更新源石数量
function updateOriginiumQuantity(stoneId: string, value: number) {
  emit('update:modelValue', {
    ...props.modelValue,
    originiumStones: {
      ...originiumStoneQuantities.value,
      [stoneId]: Math.max(0, value),
    },
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
  const fileName = itemId.startsWith('item_') ? itemId : `item_${itemId}`;
  return `https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/walleticon/${fileName}.png`;
}

// 获取多语言名称
function packName(pack: PackData): string {
  return pack.displayName[locale.value] || pack.displayName['zh-CN'];
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
        <div class="gacha-calculator-resource-single-title">月卡（{{ monthlyPassDays }}天）</div>
        <div class="gacha-calculator-resource-single-content gacha-calculator-resource-item-content">
          <img
            alt="originium"
            class="gacha-calculator-gacha-item-icon"
            src="https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/walleticon/item_originium_recharge.png"
          />
          × {{ monthlyPassResources?.originiumRecharge }}
        </div>
        <div class="gacha-calculator-resource-single-content gacha-calculator-resource-item-content">
          <img
            alt="diamond"
            class="gacha-calculator-gacha-item-icon"
            src="https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/walleticon/item_diamond.png"
          />
          × {{ monthlyPassResources ? monthlyPassDays * 200 : 0 }}
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
        <div class="gacha-calculator-resource-single-title">源石配给</div>
        <div class="gacha-calculator-resource-single-content gacha-calculator-resource-item-content">
          <img
            alt="originium"
            class="gacha-calculator-gacha-item-icon"
            src="https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/walleticon/item_originium_recharge.png"
          />
          × 3
        </div>
        <div class="gacha-calculator-resource-single-content">¥0</div>
      </div>
    </v-btn>
    <v-btn
      :active="protocolCustomizationActive"
      class="gacha-calculator-resource-single-btn"
      :class="{ 'btn-active': protocolCustomizationActive }"
      @click="protocolCustomizationActive = !protocolCustomizationActive"
    >
      <div class="gacha-calculator-resource-single-btn-content">
        <div class="gacha-calculator-resource-single-title">协议定制</div>
        <div class="gacha-calculator-resource-single-content gacha-calculator-resource-item-content">
          <img
            alt="originium"
            class="gacha-calculator-gacha-item-icon"
            src="https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/walleticon/item_originium_recharge.png"
          />
          × 36
        </div>
        <div class="gacha-calculator-resource-single-content gacha-calculator-resource-item-content">
          <img
            alt="武库配额"
            class="gacha-calculator-gacha-item-icon"
            src="https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/walleticon/item_gachabyproducts_weapongold.png"
          />
          × {{ protocolCustomizationWeaponQuota }}
        </div>
        <div class="gacha-calculator-resource-single-content">¥68</div>
      </div>
    </v-btn>

    <v-divider style="margin: 1rem 0" />

    <!-- 礼包 -->
    <div class="section-title">礼包</div>
    <div
      v-for="pack in giftPacks"
      :key="pack.id"
      class="gacha-calculator-purchase-row"
    >
      <v-btn
        :active="getPackQuantity(pack.id) > 0"
        class="gacha-calculator-resource-single-btn gacha-calculator-purchase-select-btn"
        :class="{ 'btn-active': getPackQuantity(pack.id) > 0 }"
        @click="togglePack(pack.id)"
      >
        <div class="gacha-calculator-resource-single-btn-content">
          <div class="gacha-calculator-resource-single-title">
            {{ packName(pack) }}
          </div>
          <div
            v-for="item in pack.contents"
            v-show="isGachaResource(item.itemId)"
            :key="`${pack.id}-${item.itemId}`"
            class="gacha-calculator-resource-single-content gacha-calculator-resource-item-content"
          >
            <img
              alt="item"
              class="gacha-calculator-gacha-item-icon"
              :src="getImageUrl(item.itemId)"
            />
            × {{ item.quantity }}
          </div>
          <div class="gacha-calculator-resource-single-content">¥{{ pack.price }}</div>
        </div>
      </v-btn>
      <div
        v-if="isQuantityAdjustablePack(pack.id)"
        class="gacha-calculator-purchase-quantity"
      >
        <v-btn
          aria-label="减少礼包数量"
          density="compact"
          :disabled="getPackQuantity(pack.id) <= 0"
          icon="mdi-minus"
          size="small"
          variant="text"
          @click="updatePackQuantity(pack.id, getPackQuantity(pack.id) - 1)"
        />
        <span>{{ getPackQuantity(pack.id) }}</span>
        <v-btn
          aria-label="增加礼包数量"
          density="compact"
          :disabled="getPackQuantity(pack.id) >= getPackMaxQuantity(pack.id)"
          icon="mdi-plus"
          size="small"
          variant="text"
          @click="updatePackQuantity(pack.id, getPackQuantity(pack.id) + 1)"
        />
      </div>
    </div>

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
          {{ packName(stone) }}
        </div>
        <div
          v-for="item in stone.contents"
          v-show="isGachaResource(item.itemId)"
          :key="`${stone.id}-${item.itemId}`"
          class="gacha-calculator-resource-single-content gacha-calculator-resource-item-content"
        >
          <img
            alt="item"
            class="gacha-calculator-gacha-item-icon"
            :src="getImageUrl(item.itemId)"
          />
          × {{ item.quantity }}
        </div>
        <div class="gacha-calculator-resource-single-content">¥{{ stone.price }}</div>
      </div>
    </v-btn>

    <v-divider style="margin: 1rem 0" />

    <!-- 普通源石 -->
    <div class="section-title">普通源石</div>

    <div v-for="stone in normalStones" :key="stone.id" class="gacha-calculator-purchase-row">
      <div
        class="gacha-calculator-resource-single-btn gacha-calculator-purchase-select-btn"
        :class="{ 'btn-active': (originiumStoneQuantities[stone.id] || 0) > 0 }"
      >
        <div class="gacha-calculator-resource-single-btn-content">
          <div class="gacha-calculator-resource-single-title">
            {{ packName(stone) }}
          </div>
          <div
            v-for="item in stone.contents"
            v-show="isGachaResource(item.itemId)"
            :key="`${stone.id}-${item.itemId}`"
            class="gacha-calculator-resource-single-content gacha-calculator-resource-item-content"
          >
            <img
              alt="item"
              class="gacha-calculator-gacha-item-icon"
              :src="getImageUrl(item.itemId)"
            />
            × {{ item.quantity }}
          </div>
          <div class="gacha-calculator-resource-single-content">¥{{ stone.price }}</div>
        </div>
      </div>
      <div class="gacha-calculator-purchase-quantity">
        <v-btn
          aria-label="减少普通源石数量"
          density="compact"
          :disabled="(originiumStoneQuantities[stone.id] || 0) <= 0"
          icon="mdi-minus"
          size="small"
          variant="text"
          @click.stop="
            updateOriginiumQuantity(stone.id, (originiumStoneQuantities[stone.id] || 0) - 1)
          "
        />
        <span>{{ originiumStoneQuantities[stone.id] || 0 }}</span>
        <v-btn
          aria-label="增加普通源石数量"
          density="compact"
          icon="mdi-plus"
          size="small"
          variant="text"
          @click.stop="
            updateOriginiumQuantity(stone.id, (originiumStoneQuantities[stone.id] || 0) + 1)
          "
        />
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
  width: 42px;
  height: 42px;
}

.gacha-calculator-resource-single-btn {
  position: relative;
  margin: 4px 0px;
  width: 100%;
  min-height: 42px;
  grid-template-areas: 'content' !important;
  grid-template-columns: 1fr !important;
  justify-content: stretch !important;
  border: 1px solid var(--theme-border-secondary);
  transition: all 0.2s ease;
  letter-spacing: unset;
}

.gacha-calculator-resource-single-btn.btn-active {
  border-left: 6px solid var(--gacha-calculator-border) !important;
}

.gacha-calculator-resource-single-btn:deep([aria-pressed='true']) {
  border-left: 6px solid var(--gacha-calculator-border) !important;
}

.gacha-calculator-resource-single-btn:deep(.v-btn__content) {
  width: 100%;
  justify-content: flex-start;
  justify-self: stretch;
}

.gacha-calculator-resource-single-btn-content {
  width: 100%;
  min-width: 0;
  display: flex;
  box-sizing: border-box;
  font-size: 1rem;
  align-items: center;
  border-radius: 4px;
}

.gacha-calculator-purchase-row {
  display: flex;
  gap: 4px;
  align-items: stretch;
  margin: 4px 0;
}

.gacha-calculator-purchase-select-btn {
  flex: 1 1 0;
  width: auto;
  min-width: 0;
  margin: 0;
}

.gacha-calculator-purchase-quantity {
  display: flex;
  width: 92px;
  flex: 0 0 92px;
  gap: 2px;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--theme-border-secondary);
  border-radius: 4px;
  font-variant-numeric: tabular-nums;
}

.gacha-calculator-purchase-quantity span {
  width: 20px;
  text-align: center;
  font-weight: 600;
}

.gacha-calculator-resource-single-title {
  width: 200px;
  text-align: start;
  padding-left: 4px;
}

.gacha-calculator-resource-single-content {
  display: flex;
  align-items: center;
  padding: 0 4px;
}

.gacha-calculator-resource-item-content {
  min-width: calc(42px + 6ch + 8px);
}

@media screen and (max-width: 600px) {
  .gacha-calculator-resource-single-btn-content {
    font-size: 0.8rem;
  }

  .gacha-calculator-purchase-quantity {
    width: 84px;
    flex-basis: 84px;
  }

  .gacha-calculator-resource-single-title {
    width: 120px;
  }
}
</style>
