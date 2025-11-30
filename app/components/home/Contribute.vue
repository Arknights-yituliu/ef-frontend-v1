<script lang="ts" setup>
import { ref } from 'vue'

const groupNumber = '696486169'
const snackbar = ref(false)

const copyGroupNumber = async () => {
  try {
    await navigator.clipboard.writeText(groupNumber)
    snackbar.value = true
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>

<template>
  <v-card class="home-navigation-card">
    <v-card-title>
      <div class="home-navigation-card-title">
        <img alt="" src="">
        <b>{{ $t('component.home.contribute.title') }}</b>
        <div class="flex-1"/>
        <v-btn append-icon="mdi-open-in-new"
               color="primary"
               prepend-icon="mdi-github"
               :text="$t('component.home.contribute.goToFrontendRepo')">
        </v-btn>
      </div>
    </v-card-title>
    <v-card-text>
      <p>
        {{ $t('component.home.contribute.description') }}
        <span
          class="group-number"
          @click="copyGroupNumber"
          role="button"
          tabindex="0"
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
        <a href="https://nuxt.com.cn/" target="_blank" rel="noopener noreferrer" class="simple-link">
          <b>Nuxt 4.x</b> - {{ $t('component.home.contribute.nuxtDescription') }}
        </a>
      </p>
      <p class="p-li">
        <a href="https://cn.vuejs.org/" target="_blank" rel="noopener noreferrer" class="simple-link">
          <b>Vue 3.x</b> - {{ $t('component.home.contribute.vueDescription') }}
        </a>
      </p>
      <p class="p-li">
        <a href="https://vuetifyjs.com/zh-Hans/" target="_blank" rel="noopener noreferrer" class="simple-link">
          <b>Vuetify 3.x</b> - {{ $t('component.home.contribute.vuetifyDescription') }}
        </a>
      </p>


    </v-card-text>
  </v-card>

  <v-snackbar
    v-model="snackbar"
    :timeout="2000"
    color="success"
    location="bottom"
  >
    {{ $t('component.home.contribute.copySuccess') }}
    <template v-slot:actions>
      <v-btn
        variant="text"
        @click="snackbar = false"
      >
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
  transition: background-color var(--transition-fast), transform var(--transition-fast), opacity var(--transition-fast);
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
