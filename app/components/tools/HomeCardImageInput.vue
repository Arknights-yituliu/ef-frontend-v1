<script lang="ts" setup>
import type { HomeCardAssetTransform } from '@/shared/types/homeCardEditor';

interface Props {
  modelValue: string;
  transform?: HomeCardAssetTransform;
  label?: string;
}

const props = withDefaults(defineProps<Props>(), {
  label: '主图',
  transform: () => ({ scale: 100, x: 0, y: 0 }),
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  'update:transform': [value: HomeCardAssetTransform];
}>();

const fileInput = ref<HTMLInputElement>();

const value = computed({
  get: () => props.modelValue,
  set: (nextValue: string) => emit('update:modelValue', nextValue),
});

const imageStyle = computed(() => ({
  transform: `translate(${props.transform.x}px, ${props.transform.y}px) scale(${props.transform.scale / 100})`,
}));

const scale = computed({
  get: () => props.transform.scale,
  set: (value: number | string | null) => updateTransform('scale', value, 50, 300),
});

const x = computed({
  get: () => props.transform.x,
  set: (value: number | string | null) => updateTransform('x', value),
});

const y = computed({
  get: () => props.transform.y,
  set: (value: number | string | null) => updateTransform('y', value),
});

function updateTransform(
  key: keyof HomeCardAssetTransform,
  value: number | string | null,
  min?: number,
  max?: number,
): void {
  const numericValue = Number(value);
  let nextValue = Number.isFinite(numericValue) ? numericValue : props.transform[key];

  if (min !== undefined) {
    nextValue = Math.max(nextValue, min);
  }

  if (max !== undefined) {
    nextValue = Math.min(nextValue, max);
  }

  emit('update:transform', {
    ...props.transform,
    [key]: nextValue,
  });
}

function resetTransform(): void {
  emit('update:transform', { scale: 100, x: 0, y: 0 });
}

function openFilePicker(): void {
  fileInput.value?.click();
}

function readImage(file: File): void {
  if (!file.type.startsWith('image/')) {
    return;
  }

  const reader = new FileReader();
  reader.addEventListener('load', () => {
    if (typeof reader.result === 'string') {
      emit('update:modelValue', reader.result);
    }
  });
  reader.readAsDataURL(file);
}

function handleFileChange(event: Event): void {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) {
    readImage(file);
  }
  input.value = '';
}

function handlePaste(event: ClipboardEvent): void {
  const imageItem = Array.from(event.clipboardData?.items ?? []).find((item) =>
    item.type.startsWith('image/'),
  );

  if (imageItem) {
    const file = imageItem.getAsFile();
    if (file) {
      event.preventDefault();
      readImage(file);
      return;
    }
  }
}
</script>

<template>
  <div class="asset-input asset-input-image" @paste.capture="handlePaste">
    <button class="asset-preview" type="button" @click="openFilePicker">
      <img v-if="modelValue" :alt="label" :src="modelValue" :style="imageStyle" />
      <v-icon v-else icon="mdi-image-plus-outline" size="28" />
    </button>
    <v-text-field
      v-model="value"
      append-inner-icon="mdi-upload"
      clearable
      hide-details
      :label="label"
      variant="outlined"
      @click:append-inner="openFilePicker"
    />
    <div class="asset-transform-controls">
      <v-text-field
        v-model="scale"
        density="compact"
        hide-details
        label="大小"
        max="300"
        min="50"
        suffix="%"
        type="number"
        variant="outlined"
      />
      <v-text-field
        v-model="x"
        density="compact"
        hide-details
        label="X"
        suffix="px"
        type="number"
        variant="outlined"
      />
      <v-text-field
        v-model="y"
        density="compact"
        hide-details
        label="Y"
        suffix="px"
        type="number"
        variant="outlined"
      />
      <v-btn
        aria-label="复位"
        class="asset-reset"
        icon="mdi-restore"
        size="small"
        variant="text"
        @click="resetTransform"
      />
    </div>
    <input
      ref="fileInput"
      accept="image/*"
      class="file-input"
      type="file"
      @change="handleFileChange"
    />
  </div>
</template>

<style scoped>
.asset-input {
  display: grid;
  grid-template-columns: 184px minmax(0, 1fr);
  align-items: center;
  gap: 12px;
}

.asset-transform-controls {
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: repeat(3, minmax(0, 1fr)) 40px;
  align-items: center;
  gap: 8px;
}

.asset-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 184px;
  height: 104px;
  padding: 8px;
  color: var(--theme-text-secondary);
  cursor: pointer;
  background: var(--theme-bg-secondary);
  border: 1px solid var(--theme-border);
  border-radius: 8px;
  overflow: hidden;
}

.asset-preview:hover {
  color: var(--theme-text-primary);
  border-color: var(--theme-text-secondary);
}

.asset-preview img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transform-origin: center;
}

.asset-reset {
  justify-self: center;
}

.file-input {
  display: none;
}
</style>
