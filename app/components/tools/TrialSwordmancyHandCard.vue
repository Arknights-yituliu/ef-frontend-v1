<template>
  <div class="hand-card-slot">
    <v-menu location="bottom" width="160">
      <template #activator="{ props: menuProps }">
        <button
          v-bind="menuProps"
          :aria-label="`设置第 ${props.index + 1} 张手牌`"
          class="sword-hand-card"
          :class="{ 'is-empty': model === 0 }"
          type="button"
        >
          <span class="sword-card-meta sword-card-meta-left">
            <v-icon size="10">mdi-circle-outline</v-icon>
            BATTLE POINT
          </span>
          <span class="sword-card-meta sword-card-meta-right">
            {{ String(props.index + 1).padStart(2, '0') }}
          </span>
          <span class="sword-card-frame" />
          <span class="sword-card-diagonal" />
          <span class="sword-card-symbol">
            <v-icon v-if="model > 0" size="small">{{ diceIcon[model] }}</v-icon>
            <span v-else>空</span>
          </span>
          <span class="sword-card-point">
            {{ model > 0 ? `${model}` : 'EMPTY' }}
          </span>
          <span class="sword-card-corner top-left" />
          <span class="sword-card-corner top-right" />
          <span class="sword-card-corner bottom-left" />
          <span class="sword-card-corner bottom-right" />
        </button>
      </template>
      <v-list density="compact">
        <v-list-item
          v-for="point in 5"
          :key="point"
          :active="model === point"
          :prepend-icon="diceIcon[point]"
          @click="model = point"
        >
          <v-list-item-title>{{ point }} 点</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-btn
      v-if="model > 0"
      :aria-label="`删除第 ${props.index + 1} 张手牌`"
      class="sword-card-delete"
      color="error"
      density="comfortable"
      icon="mdi-close"
      size="x-small"
      @click.stop="emit('delete')"
    />
  </div>
</template>

<script lang="ts" setup>

const diceIcon: Record<number, string> = {
  1: 'mdi-dice-1',
  2: 'mdi-dice-2',
  3: 'mdi-dice-3',
  4: 'mdi-dice-4',
  5: 'mdi-dice-5',
  6: 'mdi-dice-6',
} as const;

const props = defineProps<{
  index: number;
}>();

const model = defineModel<number>({ default: 0 });

const emit = defineEmits<{
  delete: [];
}>();
</script>

<style scoped>
.hand-card-slot {
  position: relative;
  min-width: 0;
  container-type: inline-size;
}

.sword-hand-card {
  position: relative;
  width: 100%;
  padding: 0;
  overflow: hidden;
  font: inherit;
  color: #c3a36e;
  text-align: left;
  cursor: pointer;
  appearance: none;
  background:
    linear-gradient(180deg, rgba(223, 249, 246, 0.88), rgba(126, 219, 209, 0.86)), #c9f2ed;
  border: 1px solid rgba(90, 112, 118, 0.36);
  border-radius: 5cqi;
  box-shadow: 0 16px 26px rgba(37, 174, 166, 0.24);
  aspect-ratio: 3 / 4;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    transform 0.18s ease;
  isolation: isolate;
}

.sword-hand-card::before {
  position: absolute;
  inset: 0;
  z-index: -1;
  content: '';
  background:
    repeating-linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.24) 0,
      rgba(255, 255, 255, 0.24) 1px,
      transparent 1px,
      transparent 5px
    ),
    radial-gradient(circle at 72% 12%, rgba(255, 255, 255, 0.35), transparent 18%);
  opacity: 0.75;
}

.sword-hand-card::after {
  position: absolute;
  right: 7%;
  bottom: 5%;
  left: 7%;
  z-index: -1;
  height: 24%;
  content: '';
  background: rgba(31, 178, 168, 0.35);
  border-radius: 15cqi;
  filter: blur(8cqi);
}

.sword-hand-card:hover {
  border-color: rgba(var(--v-theme-primary), 0.62);
  box-shadow: 0 18px 32px rgba(37, 174, 166, 0.3);
  transform: translateY(-2px);
}

.sword-hand-card:focus-visible {
  outline: 2cqi solid rgba(var(--v-theme-primary), 0.85);
  outline-offset: 2.5cqi;
}

.sword-hand-card.is-empty {
  color: rgba(78, 105, 111, 0.42);
  background:
    linear-gradient(180deg, rgba(232, 244, 243, 0.86), rgba(190, 224, 220, 0.72)), #e4efee;
  box-shadow: 0 10px 18px rgba(57, 101, 105, 0.12);
}

.sword-card-meta {
  position: absolute;
  top: 8%;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  max-width: 58%;
  overflow: hidden;
  font-size: 5.5cqi;
  font-weight: 700;
  color: rgba(79, 99, 105, 0.54);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sword-card-meta-left {
  left: 8%;
  gap: 1.5cqi;
}

.sword-card-meta-right {
  right: 8%;
  justify-content: flex-end;
  max-width: 38%;
}

.sword-card-frame {
  position: absolute;
  inset: 24% 10% 20%;
  z-index: 1;
  border: 1px solid rgba(78, 95, 101, 0.24);
}

.sword-card-diagonal {
  position: absolute;
  top: 5%;
  bottom: 10%;
  left: 55%;
  z-index: 1;
  width: 1px;
  background: linear-gradient(180deg, transparent, rgba(88, 107, 113, 0.26), transparent);
  transform: rotate(26deg);
  transform-origin: top;
}

.sword-card-symbol {
  position: absolute;
  bottom: 21%;
  left: 13%;
  z-index: 2;
  font-size: 28cqi;
  font-weight: 900;
  line-height: 1;
  color: rgba(55, 75, 60, 0.72);
  text-shadow: 2px 2px 0 rgba(86, 158, 152, 0.45);
}

.sword-card-point {
  position: absolute;
  right: 12%;
  bottom: 20%;
  z-index: 2;
  font-size: 31cqi;
  font-weight: 900;
  line-height: 1;
  color: rgba(55, 75, 60, 0.78);
  text-shadow: 2px 2px 0 rgba(86, 158, 152, 0.45);
}

.sword-hand-card.is-empty .sword-card-symbol {
  font-size: 23cqi;
  color: rgba(78, 105, 111, 0.28);
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.45);
}

.sword-hand-card.is-empty .sword-card-point {
  font-size: 10cqi;
  color: rgba(78, 105, 111, 0.34);
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.45);
}

.sword-card-delete {
  position: absolute;
  top: -5cqi;
  right: -5cqi;
  z-index: 5;
  width: 16cqi;
  height: 16cqi;
}

.sword-card-delete :deep(.v-icon) {
  font-size: 14cqi;
}

.sword-card-corner {
  position: absolute;
  z-index: 2;
  width: 11cqi;
  height: 11cqi;
  border-color: rgba(255, 255, 255, 0.9);
  border-style: solid;
  border-width: 0;
}

.sword-card-corner.top-left {
  top: 5%;
  left: 5%;
  border-top-width: 2.5cqi;
  border-left-width: 2.5cqi;
}

.sword-card-corner.top-right {
  top: 5%;
  right: 5%;
  border-top-width: 2.5cqi;
  border-right-width: 2.5cqi;
}

.sword-card-corner.bottom-left {
  bottom: 5%;
  left: 5%;
  border-bottom-width: 2.5cqi;
  border-left-width: 2.5cqi;
}

.sword-card-corner.bottom-right {
  right: 5%;
  bottom: 5%;
  border-right-width: 2.5cqi;
  border-bottom-width: 2.5cqi;
}
</style>
