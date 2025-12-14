<script lang="ts" setup>
const groupNumber = '696486169';
const snackbar = ref(false);

const copyGroupNumber = async () => {
  try {
    await navigator.clipboard.writeText(groupNumber);
    snackbar.value = true;
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};
</script>

<template>
  <v-card class="card">
    <v-card-title>
      <div class="card-title">
        <img alt="" src="" />
        <b>{{ $t('component.home.contribute.title') }}</b>
        <div class="flex-1" />
        <v-btn
          :text="$t('component.home.contribute.goToFrontendRepo')"
          append-icon="mdi-open-in-new"
          color="primary"
          prepend-icon="mdi-github"
          @click="() => openNewPage('https://github.com/Arknights-yituliu/ef-frontend-v1')"
        >
        </v-btn>
      </div>
    </v-card-title>
    <v-card-text>
      <p>
        {{ $t('component.home.contribute.description') }}
        <span
          class="group-number"
          role="button"
          tabindex="0"
          @click="copyGroupNumber"
          @keydown.enter="copyGroupNumber"
          @keydown.space.prevent="copyGroupNumber"
        >
          696486169
        </span>
        {{ $t('component.home.contribute.descriptionSuffix') }}
      </p>
      <p class="p-title">
        {{ $t('component.home.contribute.coreTechnologiesTitle') }}
      </p>

      <p class="p-li">
        <a
          class="simple-link"
          href="https://nuxt.com.cn/"
          rel="noopener noreferrer"
          target="_blank"
        >
          <b>Nuxt 4.x</b> - {{ $t('component.home.contribute.nuxtDescription') }}
        </a>
      </p>
      <p class="p-li">
        <a
          class="simple-link"
          href="https://cn.vuejs.org/"
          rel="noopener noreferrer"
          target="_blank"
        >
          <b>Vue 3.x</b> - {{ $t('component.home.contribute.vueDescription') }}
        </a>
      </p>
      <p class="p-li">
        <a
          class="simple-link"
          href="https://vuetifyjs.com/zh-Hans/"
          rel="noopener noreferrer"
          target="_blank"
        >
          <b>Vuetify 3.x</b> - {{ $t('component.home.contribute.vuetifyDescription') }}
        </a>
      </p>
    </v-card-text>
  </v-card>

  <v-snackbar v-model="snackbar" :timeout="2000" color="success" location="bottom">
    {{ $t('component.home.contribute.copySuccess') }}
    <template v-slot:actions>
      <v-btn variant="text" @click="snackbar = false">
        {{ $t('common.close') }}
      </v-btn>
    </template>
  </v-snackbar>
</template>

<style scoped>
.group-number {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background-color: var(--theme-bg-tertiary);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition:
    background-color var(--transition-fast),
    transform var(--transition-fast),
    opacity var(--transition-fast);
  user-select: none;
}

.group-number:hover {
  opacity: 0.8;
  transform: scale(1.05);
}

.group-number:active {
  transform: scale(0.95);
}

.group-number:focus-visible {
  outline: 2px solid var(--theme-accent-color);
  outline-offset: 2px;
}
</style>
