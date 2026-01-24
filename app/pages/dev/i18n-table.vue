<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { itemTable, getLocalizedText } from '@/shared/utils/gameData/gameData';
import { getItemIconUrl } from '@/shared/utils/gameData/item';
import type { ItemTable } from '@/shared/types/endfielddata/TableCfg/ItemTable';

const itemTableCollect = ref<ItemTableCollect[]>([]);

interface ItemTableCollect {
  id: string;
  nameCN: string;
  nameEN: string;
}

// 自定义表头配置
const itemTableHeaders = [
  { title: '物品图标' },
  { title: '物品ID', key: 'id' },
  { title: '物品名称', key: 'name' },
];

onMounted(() => {
  for (const itemId in itemTable.value) {
    if (!itemTable.value[itemId]) continue;
    const item: Item = itemTable.value[itemId];
    itemTableCollect.value.push({
      id: itemId,
      nameCN: getLocalizedText(item.name || '', 'zh-CN'),
      nameEN: getLocalizedText(item.name || '', 'en-US'),
    });
  }
});

const itemSearch = ref('');

// 搜索过滤后的物品列表
const filteredItems = computed(() => {
  if (!itemSearch.value) {
    return itemTableCollect.value;
  }
  const searchText = itemSearch.value.toLowerCase();
  return itemTableCollect.value.filter((item) => item.nameCN.toLowerCase().includes(searchText));
});
</script>

<template>
  <v-data-table :items="filteredItems" :headers="itemTableHeaders">
    <template #top>
      <v-text-field v-model="itemSearch" label="Search (根据物品中文名称搜索)" />
    </template>
    <template #item="{ item }">
      <tr class="text-no-wrap">
        <td><img :src="getItemIconUrl(item.id)" :alt="item.nameCN" style="" ></td>
        <td>{{ item.id }}</td>
        <td>{{ item.nameCN }}</td>
        <td>{{ item.nameEN }}</td>
      </tr>
    </template>
  </v-data-table>
</template>

<style scoped>
.i18n-item-table-icon {
  width: 50px;
  height: 50px;
}
h1 {
  color: red;
}
</style>
