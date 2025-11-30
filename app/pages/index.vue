<template>
  <div class="home-page">
    <div class="page-title">
      <TextParticleWord/>
    </div>
    <v-carousel
      show-arrows="hover"
      cycle
      hide-delimiter-background
      class="index-carousel"
    >
      <v-carousel-item
        v-for="(slide, i) in slides"
        :key="i"
      >
        <v-sheet
          :color="colors[i]"
          height="100%"
        >
          <div class="d-flex fill-height justify-center align-center">
            <div class="text-h2">
              {{ slide }} Slide
            </div>
          </div>
        </v-sheet>
      </v-carousel-item>
    </v-carousel>

    <div class="home-navigation-card-group">
      <HomeCheckAccess></HomeCheckAccess>
       <HomeContribute></HomeContribute>
      <HomeYiTuLiu></HomeYiTuLiu>
      <HomePenguinStats></HomePenguinStats>
    </div>
    <!--    <p class="page-description">-->
    <!--      {{ t('page.home.welcome') }}-->
    <!--    </p>-->
    <!--    <p class="page-hint">-->
    <!--      {{ t('page.home.hint') }}-->
    <!--    </p>-->
  </div>
</template>

<script setup lang="ts">
import '~/assets/css/homePage.css'
import {computed} from 'vue'

definePageMeta({
  layout: 'default'
})


const colors = [
  'indigo',
  'warning',
  'pink darken-2',
  'red lighten-1',
  'deep-purple accent-4',
]
const slides = [
  'First',
  'Second',
  'Third',
  'Fourth',
  'Fifth',
]

const {t} = useI18n()
</script>

<style scoped>


.home-page {
  padding: 2rem 0 4rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.page-title {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.5rem;
}

.page-description {
  font-size: var(--font-size-xl);
  color: var(--theme-text-primary);
  line-height: 1.5;
}

.page-hint {
  font-size: var(--font-size-md);
  color: var(--theme-text-secondary);
  line-height: 1.5;
}








</style>
