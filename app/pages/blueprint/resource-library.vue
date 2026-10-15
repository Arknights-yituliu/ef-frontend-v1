<template>
  <v-container class="library-page" fluid>
    <header class="library-header">
      <div class="library-header-copy">
        <p class="eyebrow">{{ t('page.blueprint.resourceLibrary.kicker') }}</p>
        <h1 class="page-title">{{ t('page.blueprint.resourceLibrary.title') }}</h1>
        <p class="page-description">{{ t('page.blueprint.resourceLibrary.description') }}</p>
      </div>

      <div class="library-header-meta">
        <v-chip color="warning" label variant="outlined">
          <v-icon icon="mdi-test-tube" start />
          {{ t('page.blueprint.resourceLibrary.status') }}
        </v-chip>
        <div class="library-total">
          <strong>{{ totalBlueprintCount }}</strong>
          <span>{{ t('page.blueprint.resourceLibrary.blueprintCount') }}</span>
        </div>
      </div>
    </header>

    <section aria-labelledby="collection-heading" class="collection-section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">{{ t('page.blueprint.resourceLibrary.collectionKicker') }}</p>
          <h2 id="collection-heading">{{ t('page.blueprint.resourceLibrary.collectionTitle') }}</h2>
        </div>
        <span class="section-count">{{ collections.length }}</span>
      </div>

      <div class="collection-grid">
        <button
          v-for="collection in collections"
          :key="collection.id"
          class="collection-tile"
          :class="{ 'collection-tile-active': selectedCollection.id === collection.id }"
          :style="{ '--collection-accent': collection.accent }"
          type="button"
          @click="selectCollection(collection)"
        >
          <span class="collection-tile-topline">
            <span class="collection-icon">
              <v-icon :icon="collection.icon" size="24" />
            </span>
            <v-icon class="collection-arrow" icon="mdi-arrow-top-right" size="20" />
          </span>
          <span class="collection-tile-title">{{ t(collection.nameKey) }}</span>
          <span class="collection-tile-description">{{ t(collection.descriptionKey) }}</span>
          <span class="collection-tile-footer">
            <span>{{
              t('page.blueprint.resourceLibrary.entryCount', {
                count: collection.blueprints.length,
              })
            }}</span>
            <span>{{ t(collection.purposeKey) }}</span>
          </span>
        </button>
      </div>
    </section>

    <section aria-labelledby="workspace-heading" class="workspace-section">
      <div class="workspace-heading">
        <div>
          <p class="eyebrow">{{ t(selectedCollection.nameKey) }}</p>
          <h2 id="workspace-heading">{{ t('page.blueprint.resourceLibrary.workspaceTitle') }}</h2>
        </div>
        <span class="section-count">{{ visibleBlueprints.length }}</span>
      </div>

      <div class="filter-bar">
        <v-text-field
          v-model="searchQuery"
          class="filter-search"
          clearable
          density="compact"
          hide-details
          :label="t('page.blueprint.resourceLibrary.searchLabel')"
          :placeholder="t('page.blueprint.resourceLibrary.searchPlaceholder')"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
        />
        <v-select
          v-model="selectedTag"
          class="filter-select"
          density="compact"
          hide-details
          item-title="title"
          item-value="value"
          :items="tagOptions"
          :label="t('page.blueprint.resourceLibrary.tagLabel')"
          variant="outlined"
        />
        <v-select
          v-model="selectedVersion"
          class="filter-select"
          density="compact"
          hide-details
          item-title="title"
          item-value="value"
          :items="versionOptions"
          :label="t('page.blueprint.resourceLibrary.versionLabel')"
          variant="outlined"
        />
      </div>

      <div class="workspace-grid">
        <div class="entry-column">
          <div v-if="visibleBlueprints.length > 0" class="entry-list">
            <article
              v-for="blueprint in visibleBlueprints"
              :key="blueprint.id"
              class="blueprint-entry"
              :class="{ 'blueprint-entry-active': selectedBlueprint?.id === blueprint.id }"
              tabindex="0"
              @click="selectBlueprint(blueprint)"
              @keydown.enter="selectBlueprint(blueprint)"
              @keydown.space.prevent="selectBlueprint(blueprint)"
            >
              <div class="entry-topline">
                <span class="entry-status" :class="`entry-status-${blueprint.status}`">
                  <span class="status-dot" />
                  {{ t(`page.blueprint.resourceLibrary.blueprintStatus.${blueprint.status}`) }}
                </span>
                <span class="entry-version">{{ blueprint.version }}</span>
              </div>
              <h3>{{ t(blueprint.titleKey) }}</h3>
              <p>{{ t(blueprint.descriptionKey) }}</p>
              <div class="entry-tags">
                <v-chip
                  v-for="tagKey in blueprint.tagKeys"
                  :key="tagKey"
                  label
                  size="small"
                  variant="outlined"
                >
                  {{ t(tagKey) }}
                </v-chip>
              </div>
              <div class="entry-footer">
                <span>{{
                  t('page.blueprint.resourceLibrary.updatedAt', { date: blueprint.updatedAt })
                }}</span>
                <v-tooltip location="top" :text="t('page.blueprint.resourceLibrary.copyEntryLink')">
                  <template #activator="{ props }">
                    <v-btn
                      v-bind="props"
                      :aria-label="t('page.blueprint.resourceLibrary.copyEntryLink')"
                      :icon="copiedTarget === blueprint.id ? 'mdi-check' : 'mdi-link-variant'"
                      size="small"
                      variant="text"
                      @click.stop="copyEntryLink(blueprint)"
                    />
                  </template>
                </v-tooltip>
              </div>
            </article>
          </div>

          <div v-else class="empty-state">
            <v-icon icon="mdi-archive-search-outline" size="42" />
            <h3>{{ t('page.blueprint.resourceLibrary.emptyTitle') }}</h3>
            <p>{{ t('page.blueprint.resourceLibrary.emptyDescription') }}</p>
          </div>
        </div>

        <aside aria-labelledby="viewer-heading" class="viewer-panel">
          <div class="viewer-header">
            <div class="viewer-heading-copy">
              <p class="eyebrow">{{ t('page.blueprint.resourceLibrary.viewerKicker') }}</p>
              <h2 id="viewer-heading">
                {{
                  selectedBlueprint
                    ? t(selectedBlueprint.titleKey)
                    : t('page.blueprint.resourceLibrary.viewerEmptyTitle')
                }}
              </h2>
            </div>
            <v-chip v-if="selectedBlueprint" label size="small" variant="outlined">
              {{ t(`page.blueprint.resourceLibrary.blueprintStatus.${selectedBlueprint.status}`) }}
            </v-chip>
          </div>

          <template v-if="selectedBlueprint">
            <div
              :aria-label="t('page.blueprint.resourceLibrary.rendererControls.title')"
              class="renderer-controls"
              role="group"
            >
              <div class="renderer-control-main">
                <div class="renderer-control-group">
                  <span class="renderer-control-label">
                    {{ t('page.blueprint.resourceLibrary.rendererControls.viewLabel') }}
                  </span>
                  <v-btn-toggle
                    color="primary"
                    density="compact"
                    divided
                    mandatory
                    :model-value="rendererView"
                    @update:model-value="setRendererView"
                  >
                    <v-btn value="3d-top">
                      <v-icon icon="mdi-cube-outline" start />
                      {{ t('page.blueprint.resourceLibrary.rendererControls.views.threeDTop') }}
                    </v-btn>
                    <v-btn value="blueprint">
                      <v-icon icon="mdi-view-grid-outline" start />
                      {{ t('page.blueprint.resourceLibrary.rendererControls.views.blueprint') }}
                    </v-btn>
                  </v-btn-toggle>
                </div>

                <div class="renderer-control-switches">
                  <v-switch
                    color="primary"
                    density="compact"
                    hide-details
                    :label="t('page.blueprint.resourceLibrary.rendererControls.showBase')"
                    :model-value="rendererShowBase"
                    @update:model-value="setRendererShowBase"
                  />
                  <v-switch
                    color="primary"
                    density="compact"
                    hide-details
                    :label="t('page.blueprint.resourceLibrary.rendererControls.animations')"
                    :model-value="rendererAnimations"
                    @update:model-value="setRendererAnimations"
                  />
                  <v-switch
                    color="primary"
                    density="compact"
                    hide-details
                    :label="t('page.blueprint.resourceLibrary.rendererControls.autoplay')"
                    :model-value="rendererAutoplay"
                    @update:model-value="setRendererAutoplay"
                  />
                </div>
              </div>

              <div class="renderer-status-row">
                <div
                  aria-live="polite"
                  class="renderer-status"
                  :class="`renderer-status-${rendererStatus}`"
                >
                  <span class="status-dot" />
                  <span>{{ rendererStatusLabel }}</span>
                  <span v-if="rendererErrorMessage" class="renderer-error-message">
                    {{ rendererErrorMessage }}
                  </span>
                </div>
                <div class="renderer-actions">
                  <v-btn
                    v-if="rendererIsRunning"
                    prepend-icon="mdi-pause"
                    size="small"
                    variant="outlined"
                    @click="pauseRenderer"
                  >
                    {{ t('page.blueprint.resourceLibrary.rendererControls.pause') }}
                  </v-btn>
                  <v-btn
                    v-else
                    prepend-icon="mdi-play"
                    size="small"
                    variant="outlined"
                    @click="startRenderer"
                  >
                    {{ t('page.blueprint.resourceLibrary.rendererControls.start') }}
                  </v-btn>
                  <v-tooltip
                    location="top"
                    :text="t('page.blueprint.resourceLibrary.rendererControls.reload')"
                  >
                    <template #activator="{ props }">
                      <v-btn
                        v-bind="props"
                        :aria-label="t('page.blueprint.resourceLibrary.rendererControls.reload')"
                        icon="mdi-refresh"
                        size="small"
                        variant="text"
                        @click="reloadRenderer"
                      />
                    </template>
                  </v-tooltip>
                </div>
              </div>
            </div>

            <div class="renderer-frame">
              <iframe
                :key="rendererReloadKey"
                allow="fullscreen"
                class="renderer-iframe"
                loading="lazy"
                :src="rendererUrl"
                :title="
                  t('page.blueprint.resourceLibrary.rendererTitle', {
                    name: t(selectedBlueprint.titleKey),
                  })
                "
                @error="handleRendererError"
                @load="handleRendererLoad"
              />
            </div>

            <div class="viewer-meta">
              <div
                v-for="metric in selectedBlueprint.metrics"
                :key="metric.labelKey"
                class="metric-item"
              >
                <span>{{ t(metric.labelKey) }}</span>
                <strong>{{ t(metric.valueKey) }}</strong>
              </div>
              <div class="metric-item">
                <span>{{ t('page.blueprint.resourceLibrary.metadata.view') }}</span>
                <strong>{{ rendererViewLabel }}</strong>
              </div>
            </div>

            <div class="viewer-footer">
              <div class="json-reference">
                <v-icon icon="mdi-file-code-outline" size="18" />
                <span>{{ t('page.blueprint.resourceLibrary.jsonSource') }}</span>
                <a :href="selectedBlueprintJsonUrl" rel="noopener noreferrer" target="_blank">
                  {{ selectedBlueprintJsonUrl }}
                </a>
              </div>
              <div class="viewer-actions">
                <v-btn
                  append-icon="mdi-open-in-new"
                  :href="selectedBlueprintJsonUrl"
                  rel="noopener noreferrer"
                  size="small"
                  target="_blank"
                  variant="text"
                >
                  {{ t('page.blueprint.resourceLibrary.openJson') }}
                </v-btn>
                <v-tooltip location="top" :text="t('page.blueprint.resourceLibrary.copyJsonUrl')">
                  <template #activator="{ props }">
                    <v-btn
                      v-bind="props"
                      :aria-label="t('page.blueprint.resourceLibrary.copyJsonUrl')"
                      :icon="
                        copiedTarget === `${selectedBlueprint.id}-json`
                          ? 'mdi-check'
                          : 'mdi-content-copy'
                      "
                      size="small"
                      variant="text"
                      @click="copyJsonUrl(selectedBlueprint)"
                    />
                  </template>
                </v-tooltip>
              </div>
            </div>
          </template>

          <div v-else class="viewer-empty">
            <v-icon icon="mdi-cube-outline" size="48" />
            <p>{{ t('page.blueprint.resourceLibrary.viewerEmptyDescription') }}</p>
          </div>
        </aside>
      </div>
    </section>
  </v-container>
</template>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core';
import {
  type BlueprintCollection,
  blueprintCollections,
  type BlueprintEntry,
  type BlueprintRendererOptions,
  type BlueprintRendererView,
} from '@/custom/blueprint/collections';

definePageMeta({
  layout: 'default',
});

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

usePageSeo({
  title: () => `${t('page.blueprint.resourceLibrary.title')} - ${t('layout.siteName')}`,
  description: () => t('page.blueprint.resourceLibrary.description'),
  robots: 'noindex, nofollow',
});

const collections = blueprintCollections;
const searchQuery = ref('');
const selectedTag = ref('all');
const selectedVersion = ref('all');
const copiedTarget = ref<string | null>(null);
const { copy } = useClipboard();

const RENDERER_ORIGIN = 'https://endfield.hsyhhssyy.net';
const RENDERER_CHANNEL = 'industrial-planner:blueprint';
const RENDERER_VERSION = 1;

const defaultRendererOptions: BlueprintRendererOptions = {
  showBase: false,
  view: '3d-top',
  animations: false,
  autoplay: false,
};

type RendererStatus = 'loading' | 'ready' | 'running' | 'paused' | 'error';
type RendererCommand = 'start' | 'pause' | 'setView' | 'setAnimations';

interface PendingRendererCommand {
  command: RendererCommand;
  payload?: Record<string, unknown>;
}

const rendererFrameRef = ref<HTMLIFrameElement | null>(null);
const rendererReloadKey = ref(0);
const rendererView = ref<BlueprintRendererView>(defaultRendererOptions.view);
const rendererShowBase = ref(defaultRendererOptions.showBase);
const rendererAnimations = ref(defaultRendererOptions.animations);
const rendererAutoplay = ref(defaultRendererOptions.autoplay);
const rendererUrlOptions = ref<BlueprintRendererOptions>({ ...defaultRendererOptions });
const rendererStatus = ref<RendererStatus>('loading');
const rendererReady = ref(false);
const rendererIsRunning = ref(false);
const rendererErrorMessage = ref('');
const pendingRendererCommands = ref<PendingRendererCommand[]>([]);

const totalBlueprintCount = computed(() =>
  collections.reduce((total, collection) => total + collection.blueprints.length, 0),
);

function getQueryValue(value: unknown): string {
  return Array.isArray(value) ? String(value[0] ?? '') : String(value ?? '');
}

const selectedCollection = computed<BlueprintCollection>(() => {
  const requestedId = getQueryValue(route.query.collection);
  return collections.find((collection) => collection.id === requestedId) ?? collections[0]!;
});

const selectedBlueprint = computed<BlueprintEntry | undefined>(() => {
  const requestedId = getQueryValue(route.query.blueprint);
  return (
    selectedCollection.value.blueprints.find((blueprint) => blueprint.id === requestedId) ??
    selectedCollection.value.blueprints[0]
  );
});

function getJsonUrl(blueprint: BlueprintEntry): string {
  if (!import.meta.client) {
    return blueprint.jsonPath;
  }

  return new URL(blueprint.jsonPath, window.location.origin).toString();
}

const selectedBlueprintJsonUrl = computed(() =>
  selectedBlueprint.value ? getJsonUrl(selectedBlueprint.value) : '',
);

const tagOptions = computed(() => [
  {
    title: t('page.blueprint.resourceLibrary.allTags'),
    value: 'all',
  },
  ...Array.from(
    new Set(selectedCollection.value.blueprints.flatMap((blueprint) => blueprint.tagKeys)),
  ).map((tagKey) => ({
    title: t(tagKey),
    value: tagKey,
  })),
]);

const versionOptions = computed(() => [
  {
    title: t('page.blueprint.resourceLibrary.allVersions'),
    value: 'all',
  },
  ...Array.from(
    new Set(selectedCollection.value.blueprints.map((blueprint) => blueprint.version)),
  ).map((version) => ({
    title: version,
    value: version,
  })),
]);

const visibleBlueprints = computed(() => {
  const normalizedQuery = searchQuery.value.trim().toLocaleLowerCase();

  return selectedCollection.value.blueprints.filter((blueprint) => {
    const searchableText = [
      t(blueprint.titleKey),
      t(blueprint.descriptionKey),
      ...blueprint.tagKeys.map((tagKey) => t(tagKey)),
    ]
      .join(' ')
      .toLocaleLowerCase();

    return (
      (!normalizedQuery || searchableText.includes(normalizedQuery)) &&
      (selectedTag.value === 'all' || blueprint.tagKeys.includes(selectedTag.value)) &&
      (selectedVersion.value === 'all' || blueprint.version === selectedVersion.value)
    );
  });
});

function updateSelection(collectionId: string, blueprintId?: string) {
  const query: Record<string, string> = { collection: collectionId };
  if (blueprintId) {
    query.blueprint = blueprintId;
  }
  void router.replace({ query });
}

function selectCollection(collection: BlueprintCollection) {
  searchQuery.value = '';
  selectedTag.value = 'all';
  selectedVersion.value = 'all';
  updateSelection(collection.id, collection.blueprints[0]?.id);
}

function selectBlueprint(blueprint: BlueprintEntry) {
  updateSelection(selectedCollection.value.id, blueprint.id);
}

function getEntryLink(blueprint: BlueprintEntry): string {
  if (!import.meta.client) {
    return '';
  }

  const href = router.resolve({
    path: route.path,
    query: {
      collection: selectedCollection.value.id,
      blueprint: blueprint.id,
    },
  }).href;

  return new URL(href, window.location.origin).toString();
}

async function copyEntryLink(blueprint: BlueprintEntry) {
  const link = getEntryLink(blueprint);
  if (!link) {
    return;
  }
  await copy(link);
  copiedTarget.value = blueprint.id;
  window.setTimeout(() => {
    if (copiedTarget.value === blueprint.id) {
      copiedTarget.value = null;
    }
  }, 1600);
}

async function copyJsonUrl(blueprint: BlueprintEntry) {
  await copy(getJsonUrl(blueprint));
  copiedTarget.value = `${blueprint.id}-json`;
  window.setTimeout(() => {
    if (copiedTarget.value === `${blueprint.id}-json`) {
      copiedTarget.value = null;
    }
  }, 1600);
}

const rendererStatusLabel = computed(() =>
  t(`page.blueprint.resourceLibrary.rendererControls.status.${rendererStatus.value}`),
);

const rendererViewLabel = computed(() =>
  t(
    `page.blueprint.resourceLibrary.rendererControls.views.${
      rendererView.value === '3d-top' ? 'threeDTop' : 'blueprint'
    }`,
  ),
);

const rendererUrl = computed(() => {
  if (!selectedBlueprint.value) {
    return '';
  }

  const url = new URL(RENDERER_ORIGIN);
  const renderer = rendererUrlOptions.value;
  url.searchParams.set('embed', 'blueprint');
  url.searchParams.set('blueprintUrl', selectedBlueprintJsonUrl.value);
  url.searchParams.set('showBase', renderer.showBase ? '1' : '0');
  url.searchParams.set('view', renderer.view);
  url.searchParams.set('animations', renderer.animations ? '1' : '0');
  url.searchParams.set('autoplay', renderer.autoplay ? '1' : '0');
  return url.toString();
});

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isRendererView(value: unknown): value is BlueprintRendererView {
  return value === '3d-top' || value === 'blueprint';
}

function getRendererMessageText(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }

  if (isRecord(value) && typeof value.message === 'string') {
    return value.message;
  }

  return t('page.blueprint.resourceLibrary.rendererControls.errorDescription');
}

function updateRendererRuntimeState(state: unknown) {
  const normalizedState = typeof state === 'string' ? state.toLowerCase() : '';

  if (normalizedState === 'running' || normalizedState === 'playing') {
    rendererIsRunning.value = true;
    rendererStatus.value = 'running';
    return;
  }

  if (normalizedState === 'paused' || normalizedState === 'stopped' || normalizedState === 'idle') {
    rendererIsRunning.value = false;
    rendererStatus.value = 'paused';
    return;
  }

  if (normalizedState === 'ready' || normalizedState === 'loaded') {
    rendererIsRunning.value = false;
    rendererStatus.value = 'ready';
  }
}

function deliverRendererCommand(command: RendererCommand, payload: Record<string, unknown> = {}) {
  const rendererWindow = rendererFrameRef.value?.contentWindow;
  if (!rendererWindow) {
    return false;
  }

  rendererWindow.postMessage(
    {
      channel: RENDERER_CHANNEL,
      version: RENDERER_VERSION,
      type: 'command',
      command,
      ...payload,
    },
    RENDERER_ORIGIN,
  );
  return true;
}

function sendRendererCommand(command: RendererCommand, payload: Record<string, unknown> = {}) {
  if (!rendererReady.value || !rendererFrameRef.value?.contentWindow) {
    pendingRendererCommands.value.push({ command, payload });
    return;
  }

  deliverRendererCommand(command, payload);
}

function flushRendererCommands() {
  if (!rendererReady.value) {
    return;
  }

  const commands = pendingRendererCommands.value.splice(0);
  for (const { command, payload } of commands) {
    deliverRendererCommand(command, payload);
  }
}

function handleRendererReady() {
  rendererReady.value = true;
  rendererErrorMessage.value = '';
  if (rendererStatus.value !== 'running') {
    rendererStatus.value = rendererIsRunning.value ? 'running' : 'ready';
  }
  flushRendererCommands();
}

function handleRendererLoad() {
  handleRendererReady();
}

function handleRendererError() {
  rendererReady.value = false;
  rendererStatus.value = 'error';
  rendererErrorMessage.value = t(
    'page.blueprint.resourceLibrary.rendererControls.errorDescription',
  );
}

function handleRendererMessage(event: MessageEvent) {
  if (
    event.origin !== RENDERER_ORIGIN ||
    event.source !== rendererFrameRef.value?.contentWindow ||
    !isRecord(event.data) ||
    event.data.channel !== RENDERER_CHANNEL ||
    event.data.version !== RENDERER_VERSION
  ) {
    return;
  }

  const message = event.data;
  const payload = isRecord(message.payload) ? message.payload : {};
  const messageType = String(message.type ?? message.event ?? '').toLowerCase();
  const error = message.error ?? payload.error;

  if (messageType === 'error' || error) {
    rendererStatus.value = 'error';
    rendererErrorMessage.value = getRendererMessageText(error);
    return;
  }

  if (
    messageType === 'ready' ||
    messageType === 'loaded' ||
    message.ready === true ||
    payload.ready === true
  ) {
    handleRendererReady();
  }

  const runtimeState = message.state ?? message.status ?? payload.state ?? payload.status;
  if (
    messageType === 'state' ||
    messageType === 'status' ||
    messageType === 'runtime' ||
    typeof runtimeState === 'string'
  ) {
    updateRendererRuntimeState(runtimeState);
  }
}

function setRendererView(value: unknown) {
  if (!isRendererView(value) || value === rendererView.value) {
    return;
  }

  rendererView.value = value;
  sendRendererCommand('setView', { view: value });
}

function setRendererShowBase(value: unknown) {
  rendererShowBase.value = Boolean(value);
  reloadRenderer();
}

function setRendererAnimations(value: unknown) {
  rendererAnimations.value = Boolean(value);
  sendRendererCommand('setAnimations', { enabled: rendererAnimations.value });
}

function setRendererAutoplay(value: unknown) {
  rendererAutoplay.value = Boolean(value);
  reloadRenderer();
}

function startRenderer() {
  rendererIsRunning.value = true;
  rendererStatus.value = rendererReady.value ? 'running' : 'loading';
  sendRendererCommand('start');
}

function pauseRenderer() {
  rendererIsRunning.value = false;
  rendererStatus.value = rendererReady.value ? 'paused' : 'loading';
  sendRendererCommand('pause');
}

function reloadRenderer() {
  if (!selectedBlueprint.value) {
    return;
  }

  rendererUrlOptions.value = {
    view: rendererView.value,
    showBase: rendererShowBase.value,
    animations: rendererAnimations.value,
    autoplay: rendererAutoplay.value,
  };
  rendererReady.value = false;
  rendererStatus.value = 'loading';
  rendererErrorMessage.value = '';
  rendererIsRunning.value = rendererAutoplay.value;
  pendingRendererCommands.value = [];
  rendererReloadKey.value += 1;
}

function resetRendererForBlueprint(blueprint: BlueprintEntry | undefined) {
  if (!blueprint) {
    return;
  }

  const options = { ...blueprint.renderer };
  rendererView.value = options.view;
  rendererShowBase.value = options.showBase;
  rendererAnimations.value = options.animations;
  rendererAutoplay.value = options.autoplay;
  rendererUrlOptions.value = options;
  rendererReady.value = false;
  rendererStatus.value = 'loading';
  rendererErrorMessage.value = '';
  rendererIsRunning.value = options.autoplay;
  pendingRendererCommands.value = [];
  rendererReloadKey.value += 1;
}

onMounted(() => {
  window.addEventListener('message', handleRendererMessage);
});

onBeforeUnmount(() => {
  window.removeEventListener('message', handleRendererMessage);
});

watch(
  () => selectedBlueprint.value?.id,
  () => resetRendererForBlueprint(selectedBlueprint.value),
  { immediate: true },
);

watch(
  () => selectedCollection.value.id,
  () => {
    searchQuery.value = '';
    selectedTag.value = 'all';
    selectedVersion.value = 'all';
  },
);

watch(
  visibleBlueprints,
  (blueprints) => {
    if (
      blueprints.length > 0 &&
      !blueprints.some((blueprint) => blueprint.id === selectedBlueprint.value?.id)
    ) {
      updateSelection(selectedCollection.value.id, blueprints[0]!.id);
    }
  },
  { immediate: true },
);
</script>

<style scoped>
.library-page {
  width: min(100%, 1440px);
  padding: 2.5rem 1.25rem 5rem;
}

.library-header,
.section-heading,
.workspace-heading,
.viewer-header,
.entry-topline,
.entry-footer,
.viewer-footer,
.collection-tile-topline,
.collection-tile-footer,
.library-header-meta,
.viewer-actions {
  display: flex;
  align-items: center;
}

.library-header,
.section-heading,
.workspace-heading,
.viewer-header {
  justify-content: space-between;
  gap: 1.5rem;
}

.library-header {
  align-items: flex-start;
  margin-bottom: 3rem;
}

.library-header-copy {
  min-width: 0;
  max-width: 52rem;
}

.eyebrow {
  margin: 0 0 0.55rem;
  color: var(--theme-text-tertiary);
  font-size: 0.78rem;
  font-weight: 700;
  line-height: 1.3;
  text-transform: uppercase;
}

.page-title {
  margin: 0;
  color: var(--theme-text-primary);
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.1;
}

.page-description {
  max-width: 48rem;
  margin: 1rem 0 0;
  color: var(--theme-text-secondary);
  font-size: 1rem;
  line-height: 1.75;
}

.library-header-meta {
  flex-shrink: 0;
  align-items: flex-end;
  flex-direction: column;
  gap: 1rem;
}

.library-total {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  color: var(--theme-text-tertiary);
  font-size: 0.8rem;
}

.library-total strong {
  color: var(--theme-text-primary);
  font-size: 2rem;
  line-height: 1;
}

.collection-section,
.workspace-section {
  margin-top: 2.5rem;
}

.section-heading,
.workspace-heading {
  margin-bottom: 1.25rem;
}

.section-heading h2,
.workspace-heading h2,
.viewer-header h2 {
  margin: 0;
  color: var(--theme-text-primary);
  font-size: 1.35rem;
  font-weight: 750;
  line-height: 1.3;
}

.section-count {
  display: grid;
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
  place-items: center;
  border: 1px solid var(--theme-border);
  color: var(--theme-text-secondary);
  font-size: 0.82rem;
}

.collection-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.collection-tile {
  position: relative;
  display: flex;
  min-height: 12.5rem;
  flex-direction: column;
  align-items: stretch;
  padding: 1.25rem;
  border: 1px solid var(--theme-border);
  border-radius: 4px;
  background: var(--theme-bg-secondary);
  color: var(--theme-text-primary);
  cursor: pointer;
  text-align: left;
  transition:
    border-color var(--transition-base),
    background-color var(--transition-base),
    transform var(--transition-base);
}

.collection-tile::before {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 0.25rem;
  background: var(--collection-accent);
  content: '';
}

.collection-tile:hover,
.collection-tile-active {
  border-color: var(--collection-accent);
  background: var(--theme-bg-tertiary);
  transform: translateY(-2px);
}

.collection-tile-topline {
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.collection-icon {
  display: grid;
  width: 2.75rem;
  height: 2.75rem;
  place-items: center;
  border: 1px solid var(--collection-accent);
  color: var(--collection-accent);
}

.collection-arrow {
  color: var(--theme-text-tertiary);
  transition:
    color var(--transition-fast),
    transform var(--transition-fast);
}

.collection-tile:hover .collection-arrow,
.collection-tile-active .collection-arrow {
  color: var(--collection-accent);
  transform: translate(2px, -2px);
}

.collection-tile-title {
  font-size: 1.1rem;
  font-weight: 700;
  line-height: 1.35;
}

.collection-tile-description {
  min-height: 2.8rem;
  margin-top: 0.55rem;
  color: var(--theme-text-secondary);
  font-size: 0.88rem;
  line-height: 1.55;
}

.collection-tile-footer {
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: auto;
  padding-top: 1.25rem;
  color: var(--theme-text-tertiary);
  font-size: 0.76rem;
}

.collection-tile-footer span:last-child {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.filter-bar {
  display: grid;
  grid-template-columns: minmax(16rem, 2fr) repeat(2, minmax(10rem, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.workspace-grid {
  display: grid;
  grid-template-columns: minmax(20rem, 0.9fr) minmax(0, 1.6fr);
  gap: 1rem;
  align-items: start;
}

.entry-list {
  display: grid;
  gap: 0.75rem;
}

.blueprint-entry {
  display: flex;
  min-height: 13rem;
  flex-direction: column;
  padding: 1.1rem 1.15rem;
  border: 1px solid var(--theme-border);
  border-left: 3px solid transparent;
  border-radius: 4px;
  background: var(--theme-bg-secondary);
  cursor: pointer;
  transition:
    border-color var(--transition-base),
    background-color var(--transition-base);
}

.blueprint-entry:hover,
.blueprint-entry:focus-visible,
.blueprint-entry-active {
  border-color: var(--theme-border-active);
  border-left-color: var(--theme-accent-color);
  background: var(--theme-bg-tertiary);
}

.entry-topline,
.entry-footer {
  justify-content: space-between;
  gap: 0.75rem;
}

.entry-status {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--theme-text-tertiary);
  font-size: 0.75rem;
  font-weight: 700;
}

.entry-status-ready {
  color: #008f6b;
}

.entry-status-pending {
  color: #ad7200;
}

.status-dot {
  width: 0.42rem;
  height: 0.42rem;
  border-radius: 50%;
  background: currentcolor;
}

.entry-version {
  color: var(--theme-text-tertiary);
  font-family: monospace;
  font-size: 0.75rem;
}

.blueprint-entry h3 {
  margin: 1rem 0 0.45rem;
  color: var(--theme-text-primary);
  font-size: 1.05rem;
  line-height: 1.4;
}

.blueprint-entry p {
  min-height: 2.8rem;
  margin: 0;
  color: var(--theme-text-secondary);
  font-size: 0.85rem;
  line-height: 1.6;
}

.entry-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-top: 1rem;
}

.entry-footer {
  margin-top: auto;
  padding-top: 1rem;
  color: var(--theme-text-tertiary);
  font-size: 0.74rem;
}

.viewer-panel {
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--theme-border);
  border-radius: 4px;
  background: var(--theme-bg-secondary);
}

.viewer-header {
  align-items: flex-start;
  padding: 1.1rem 1.25rem;
  border-bottom: 1px solid var(--theme-border);
}

.viewer-heading-copy {
  min-width: 0;
}

.viewer-header h2 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.renderer-controls {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  padding: 0.9rem 1rem;
  border-bottom: 1px solid var(--theme-border);
  background: var(--theme-bg-tertiary);
}

.renderer-control-main,
.renderer-status-row,
.renderer-control-group,
.renderer-control-switches,
.renderer-actions {
  display: flex;
  align-items: center;
}

.renderer-control-main,
.renderer-status-row {
  justify-content: space-between;
  gap: 1rem;
}

.renderer-control-main {
  align-items: flex-start;
}

.renderer-control-group {
  flex-wrap: wrap;
  gap: 0.65rem;
}

.renderer-control-label {
  color: var(--theme-text-tertiary);
  font-size: 0.75rem;
  font-weight: 700;
}

.renderer-control-switches {
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.8rem;
}

.renderer-control-switches :deep(.v-switch) {
  flex: 0 0 auto;
}

.renderer-control-switches :deep(.v-selection-control) {
  min-height: 2rem;
}

.renderer-status {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 0.45rem;
  color: var(--theme-text-tertiary);
  font-size: 0.75rem;
  font-weight: 700;
}

.renderer-status-loading {
  color: #ad7200;
}

.renderer-status-ready,
.renderer-status-paused {
  color: var(--theme-text-secondary);
}

.renderer-status-running {
  color: #008f6b;
}

.renderer-status-error {
  color: #c44536;
}

.renderer-error-message {
  max-width: 24rem;
  overflow: hidden;
  color: inherit;
  font-weight: 400;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.renderer-actions {
  flex-shrink: 0;
  gap: 0.25rem;
}

.renderer-frame {
  aspect-ratio: 16 / 10;
  min-height: 22rem;
  background: #101214;
}

.renderer-iframe {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
}

.viewer-meta {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  border-bottom: 1px solid var(--theme-border);
}

.metric-item {
  display: flex;
  min-height: 4.5rem;
  flex-direction: column;
  justify-content: center;
  gap: 0.3rem;
  padding: 0.75rem 1rem;
  border-right: 1px solid var(--theme-border);
}

.metric-item:last-child {
  border-right: 0;
}

.metric-item span {
  color: var(--theme-text-tertiary);
  font-size: 0.72rem;
}

.metric-item strong {
  overflow: hidden;
  color: var(--theme-text-primary);
  font-size: 0.84rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.viewer-footer {
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.8rem 1rem;
}

.json-reference {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 0.45rem;
  color: var(--theme-text-tertiary);
  font-size: 0.72rem;
}

.json-reference a {
  max-width: 20rem;
  overflow: hidden;
  color: var(--theme-text-secondary);
  text-overflow: ellipsis;
  text-decoration: none;
  white-space: nowrap;
}

.json-reference a:hover {
  color: var(--theme-text-primary);
  text-decoration: underline;
}

.viewer-actions {
  flex-shrink: 0;
  gap: 0.25rem;
}

.empty-state,
.viewer-empty {
  display: flex;
  min-height: 13rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  border: 1px dashed var(--theme-border);
  color: var(--theme-text-tertiary);
  text-align: center;
}

.empty-state h3 {
  margin: 1rem 0 0.4rem;
  color: var(--theme-text-primary);
  font-size: 1rem;
}

.empty-state p,
.viewer-empty p {
  max-width: 20rem;
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.6;
}

.viewer-empty {
  min-height: 30rem;
}

@media screen and (max-width: 1000px) {
  .collection-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .workspace-grid {
    grid-template-columns: 1fr;
  }
}

@media screen and (max-width: 700px) {
  .library-page {
    padding: 1.5rem 0.5rem 3rem;
  }

  .library-header {
    flex-direction: column;
    margin-bottom: 2rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .library-header-meta {
    width: 100%;
    align-items: flex-start;
    flex-direction: row;
    justify-content: space-between;
  }

  .collection-grid,
  .filter-bar {
    grid-template-columns: 1fr;
  }

  .viewer-meta {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .renderer-control-main,
  .renderer-status-row {
    align-items: flex-start;
    flex-direction: column;
  }

  .renderer-control-switches {
    justify-content: flex-start;
  }

  .metric-item:nth-child(2) {
    border-right: 0;
  }

  .metric-item:nth-child(n + 3) {
    border-top: 1px solid var(--theme-border);
  }

  .viewer-footer {
    flex-direction: column;
  }

  .json-reference a {
    max-width: 14rem;
  }
}

@media screen and (max-width: 450px) {
  .section-heading,
  .workspace-heading {
    align-items: flex-start;
  }

  .renderer-frame {
    min-height: 15rem;
  }
}
</style>
