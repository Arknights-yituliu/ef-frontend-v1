<template>
  <div class="item-value-table-page">
    <h1 class="page-title">{{ $t('page.materialProfit.itemValueTable.title') }}</h1>
    <p class="page-description">{{ $t('page.materialProfit.itemValueTable.description') }}</p>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-alert
            border="start"
            color="primary"
            variant="tonal"
            class="item-value-table-alert"
          >
            {{ $t('common.noData') }}
          </v-alert>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})
</script>

<style scoped>
.item-value-table-page {
  padding: 2rem 0;
}

.page-title {
  font-size: var(--font-size-3xl);
  color: var(--theme-text-primary);
  margin-bottom: 1rem;
  font-weight: 700;
}

.page-description {
  font-size: var(--font-size-md);
  color: var(--theme-text-secondary);
  margin-bottom: 2.5rem;
  line-height: 1.5;
}

.item-value-table-alert {
  margin-top: 1rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-title {
    font-size: var(--font-size-2xl);
  }
}

@media (max-width: 480px) {
  .item-value-table-page {
    padding: 1rem 0;
  }

  .page-title {
    font-size: var(--font-size-xl);
  }
}
</style>

