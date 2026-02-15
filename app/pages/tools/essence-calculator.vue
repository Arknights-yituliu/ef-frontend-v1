<template>
  <v-container class="page-container" fluid>
    <v-row>
      <v-col cols="12" lg="6">
        <v-expansion-panels model-value="计算结果">
          <v-expansion-panel value="计算结果">
            <v-expansion-panel-title>{{
              t('page.tools.essenceCalculator.output')
            }}</v-expansion-panel-title>
            <v-expansion-panel-text>
              <template v-if="bestChoices.length > 0">
                <div v-for="(choice, i) in bestChoices" :key="i" class="mb-6">
                  <v-card elevation="2" rounded="lg">
                    <template #image>
                      <v-img
                        :alt="choice.battleName"
                        class="result-card-background-image opacity-30 d-none d-md-block"
                        cover
                        :src="energyAlluviums[choice.battleId]!.imageUrl"
                      />
                    </template>
                    <v-card-item class="bg-info py-3">
                      <v-card-title class="text-h6 font-weight-bold">
                        {{ t('page.tools.essenceCalculator.plan') }} {{ i + 1 }}
                      </v-card-title>
                      <template #append>
                        <v-chip
                          class="font-weight-bold mr-2"
                          color="success"
                          size="small"
                          variant="flat"
                        >
                          {{ choice.matchedSelectedIndices.length }}
                          {{ t('page.tools.essenceCalculator.requirementsMet') }}
                        </v-chip>
                        <v-chip
                          class="font-weight-bold"
                          color="success"
                          size="small"
                          variant="flat"
                        >
                          {{ choice.matchedWeaponIds.length }}
                          {{ t('page.tools.essenceCalculator.weaponsMatched') }}
                        </v-chip>
                      </template>
                    </v-card-item>

                    <v-divider />

                    <v-card-text class="pt-4">
                      <v-row>
                        <!-- Left Column: Configuration -->
                        <v-col cols="12" md="5">
                          <div class="d-flex align-center mb-3">
                            <v-icon
                              class="mr-2"
                              color="primary"
                              icon="mdi-map-marker"
                              size="small"
                            />
                            <span class="text-subtitle-1 font-weight-bold">{{
                              t('page.tools.essenceCalculator.farmLocation')
                            }}</span>
                          </div>

                          <div class="pl-1 mb-6">
                            <v-chip color="info" label variant="outlined">
                              {{ choice.battleName }}
                            </v-chip>
                          </div>

                          <div class="d-flex align-center mb-3">
                            <v-icon class="mr-2" color="primary" icon="mdi-tune" size="small" />
                            <span class="text-subtitle-1 font-weight-bold">{{
                              t('page.tools.essenceCalculator.preEngraveStats')
                            }}</span>
                          </div>

                          <div class="pl-1">
                            <!-- Primary Attributes -->
                            <div class="mb-4">
                              <div class="text-medium-emphasis mb-1">
                                {{ t('page.tools.essenceCalculator.selectAttributeStats') }}
                              </div>
                              <div class="d-flex flex-wrap ga-2">
                                <v-chip
                                  v-for="attr in choice.selectedAttribute"
                                  :key="attr"
                                  color="primary"
                                  label
                                  variant="flat"
                                >
                                  {{ attr }}
                                </v-chip>
                              </div>
                            </div>

                            <!-- Secondary Attribute -->
                            <div v-if="choice.selectedSecondary" class="mb-4">
                              <div class="text-medium-emphasis mb-1">
                                {{ t('page.tools.essenceCalculator.selectSecondaryStats') }}
                              </div>
                              <v-chip color="teal" label variant="flat">
                                {{ choice.selectedSecondary }}
                              </v-chip>
                            </div>

                            <!-- Skill Attribute -->
                            <div v-if="choice.selectedSkill" class="mb-4">
                              <div class="text-medium-emphasis mb-1">
                                {{ t('page.tools.essenceCalculator.selectSkillStats') }}
                              </div>
                              <v-chip color="blue" label variant="flat">
                                {{ choice.selectedSkill }}
                              </v-chip>
                            </div>
                          </div>
                        </v-col>

                        <v-divider class="hidden-sm-and-down" vertical />
                        <v-divider class="hidden-md-and-up my-4" />

                        <!-- Right Column: Results -->
                        <v-col cols="12" md="7">
                          <div class="d-flex align-center mb-3">
                            <v-icon
                              class="mr-2"
                              color="success"
                              icon="mdi-check-circle-outline"
                              size="small"
                            />
                            <span class="text-subtitle-1 font-weight-bold">{{
                              t('page.tools.essenceCalculator.planDescription', {
                                count: choice.matchedSelectedIndices.length,
                                weaponCount: choice.matchedWeaponIds.length,
                              })
                            }}</span>
                          </div>

                          <div class="pl-1">
                            <!-- Satisfied Requirements -->
                            <div class="mb-4">
                              <div class="text-medium-emphasis mb-1">
                                {{ t('page.tools.essenceCalculator.satisfiedRequirements') }}
                              </div>
                              <div class="d-flex flex-wrap ga-2">
                                <div v-for="index in choice.matchedSelectedIndices" :key="index">
                                  <v-tooltip activator="parent" location="bottom">
                                    {{
                                      [
                                        requiredEssenceStats[index]!.attribute,
                                        requiredEssenceStats[index]!.secondary,
                                        requiredEssenceStats[index]!.skill,
                                      ]
                                        .filter(Boolean)
                                        .join('、')
                                    }}
                                  </v-tooltip>
                                  <v-card
                                    v-if="requiredEssenceStats[index]!.isCustom"
                                    class="weapon-item"
                                    variant="outlined"
                                  >
                                    <div class="d-flex flex-column justify-center h-100 m-auto">
                                      <div class="text-center font-weight-bold">
                                        #{{ index + 1 }}
                                        {{
                                          getEssenceStatDescription(requiredEssenceStats[index]!)
                                        }}
                                      </div>
                                      <div class="text-center text-no-wrap">
                                        {{ requiredEssenceStats[index]!.attribute ?? '' }}
                                      </div>
                                      <div class="text-center text-no-wrap">
                                        {{ requiredEssenceStats[index]!.secondary ?? '' }}
                                      </div>
                                      <div class="text-center text-no-wrap">
                                        {{ requiredEssenceStats[index]!.skill ?? '' }}
                                      </div>
                                    </div>
                                  </v-card>
                                  <ContainerItemIcon
                                    v-else
                                    class="weapon-item"
                                    :item-id="requiredEssenceStats[index]!.weaponId!"
                                    show-item-name
                                  />
                                </div>
                              </div>
                            </div>

                            <!-- Matched Weapons -->
                            <div>
                              <div class="text-medium-emphasis mb-1">
                                {{ t('page.tools.essenceCalculator.matchedWeapons') }}
                              </div>
                              <div class="d-flex flex-wrap ga-2">
                                <div
                                  v-for="weaponId in choice.matchedWeaponIds.toSorted(
                                    (weaponIdA, weaponIdB) => {
                                      const weaponA = weapons[weaponIdA]!;
                                      const weaponB = weapons[weaponIdB]!;
                                      return weaponB.rarity - weaponA.rarity;
                                    },
                                  )"
                                  :key="weaponId"
                                >
                                  <ContainerItemIcon
                                    class="weapon-item"
                                    :item-id="weaponId"
                                    show-item-name
                                  />
                                  <v-tooltip activator="parent" location="bottom">
                                    {{
                                      [
                                        weapons[weaponId]!.stats.attribute,
                                        weapons[weaponId]!.stats.secondary,
                                        weapons[weaponId]!.stats.skill,
                                      ]
                                        .filter(Boolean)
                                        .join('、')
                                    }}
                                  </v-tooltip>
                                </div>
                              </div>
                            </div>
                          </div>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </div>
              </template>
              <template v-else>
                <v-alert border="start" type="info" variant="tonal">
                  {{ t('page.tools.essenceCalculator.noValidDemand') }}
                </v-alert>
              </template>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>

      <v-col cols="12" lg="6">
        <v-expansion-panels model-value="需求设定">
          <v-expansion-panel value="需求设定">
            <v-expansion-panel-title>{{
              t('page.tools.essenceCalculator.demandSet')
            }}</v-expansion-panel-title>
            <v-expansion-panel-text>
              <p>{{ t('page.tools.essenceCalculator.demandSetDescription1') }}</p>
              <p>{{ t('page.tools.essenceCalculator.demandSetDescription2') }}</p>
              <div class="mb-8" />
              <v-card
                v-for="(stat, index) in requiredEssenceStats"
                :key="index"
                class="pa-2 my-2"
                elevation="4"
              >
                <v-row align="center">
                  <v-col cols="0" md="1" />
                  <v-col cols="12" md="2">
                    <div>
                      <span class="font-weight-bold mr-4">#{{ index + 1 }}</span
                      ><span>{{ getEssenceStatDescription(stat) }}</span>
                    </div>
                  </v-col>
                  <v-col cols="12" md="2">
                    <v-select
                      v-if="stat.isCustom"
                      v-model="stat.attribute"
                      density="compact"
                      hide-details
                      :items="allAttributeStats"
                      :label="t('page.tools.essenceCalculator.attributeStats')"
                      :list-props="{ density: 'compact' }"
                      variant="outlined"
                    />
                    <v-chip v-else color="primary" variant="flat">
                      {{ stat.attribute }}
                    </v-chip>
                  </v-col>
                  <v-col cols="12" md="2">
                    <v-select
                      v-if="stat.isCustom"
                      v-model="stat.secondary"
                      density="compact"
                      hide-details
                      :items="allSecondaryStats"
                      :label="t('page.tools.essenceCalculator.secondaryStats')"
                      :list-props="{ density: 'compact' }"
                      variant="outlined"
                    />
                    <v-chip v-else color="secondary" variant="flat">
                      {{ stat.secondary }}
                    </v-chip>
                  </v-col>
                  <v-col cols="12" md="2">
                    <v-select
                      v-if="stat.isCustom"
                      v-model="stat.skill"
                      density="compact"
                      hide-details
                      :items="allSkillStats"
                      :label="t('page.tools.essenceCalculator.skillStats')"
                      :list-props="{ density: 'compact' }"
                      variant="outlined"
                    />
                    <v-chip v-else color="success" variant="flat">
                      {{ stat.skill }}
                    </v-chip>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-btn
                      :disabled="index === 0"
                      icon="mdi-chevron-up"
                      variant="text"
                      @click="moveUp(index)"
                    />
                    <v-btn
                      :disabled="index === requiredEssenceStats.length - 1"
                      icon="mdi-chevron-down"
                      variant="text"
                      @click="moveDown(index)"
                    />
                    <v-btn
                      color="error"
                      icon="mdi-delete"
                      variant="text"
                      @click="removeStat(index)"
                    />
                  </v-col>
                </v-row>
              </v-card>
              <div class="mt-8 mb-8">
                <div class="d-flex align-center mb-4 mt-8 ga-2">
                  <v-icon>mdi-pencil</v-icon>
                  <h3>{{ $t('page.tools.essenceCalculator.custom') }}</h3>
                </div>
                <div>
                  <v-btn
                    class="customize-button"
                    prepend-icon="mdi-plus"
                    stacked
                    @click="addStatFromPreset({ ...emptyStat })"
                    >{{ $t('page.tools.essenceCalculator.blank') }}</v-btn
                  >
                </div>
                <div v-for="weaponType in weaponTypes" :key="weaponType">
                  <div class="d-flex align-center mb-4 mt-8 ga-2">
                    <img
                      :alt="weaponType"
                      class="group-icon"
                      :src="getGroupIconUrl(weaponTypeToGroupIconId[weaponType]!)"
                    />
                    <h3>{{ weaponType }}</h3>
                  </div>
                  <div class="weapon-grid">
                    <div
                      v-for="[weaponId, weapon] in Object.entries(weapons)
                        .filter(([weaponId, weapon]) => weapon.weaponType === weaponType)
                        .toSorted(
                          ([weaponIdA, weaponA], [weaponIdB, weaponB]) =>
                            weaponB.rarity - weaponA.rarity,
                        )"
                      :key="weaponId"
                      :aria-pressed="selectedWeaponIds.has(weaponId)"
                      class="weapon-icon-wrapper weapon-item"
                      role="button"
                      tabindex="0"
                      @click="toggleWeaponPreset({ ...weapon.stats, isCustom: false, weaponId })"
                      @keydown.enter.space.prevent="
                        toggleWeaponPreset({ ...weapon.stats, isCustom: false, weaponId })
                      "
                    >
                      <ContainerItemIcon :item-id="weaponId" show-item-name />
                      <div v-if="selectedWeaponIds.has(weaponId)" class="weapon-selected-overlay">
                        <v-icon color="white" size="large">mdi-check-circle</v-icon>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import type { BattleChoice, EssenceStat } from '@/custom/core/weaponEssence';
import { useLocalStorage } from '@vueuse/core';
import {
  allAttributeStats,
  allSecondaryStats,
  allSkillStats,
  emptyStat,
  energyAlluviums,
  weapons,
  weaponTypes,
  weaponTypeToGroupIconId,
} from '@/custom/core/weaponEssence';
const { t } = useI18n();

/** 需求的基质属性 */
const requiredEssenceStats = useLocalStorage<EssenceStat[]>(
  'essence-calculator-required-essence-stats',
  [],
  {
    writeDefaults: false,
    listenToStorageChanges: false,
  },
);

function getGroupIconUrl(iconId: string): string {
  return `https://cos.yituliu.cn/endfield/sprites_selective/wiki/groupicon/${iconId}.png`;
}

/** 已选武器 ID 集合（O(1) 查询） */
const selectedWeaponIds = computed(() => {
  const ids = new Set<string>();
  for (const s of requiredEssenceStats.value) {
    if (!s.isCustom && s.weaponId) ids.add(s.weaponId);
  }
  return ids;
});

function toggleWeaponPreset(stats: EssenceStat) {
  if (!stats.isCustom && stats.weaponId) {
    const index = requiredEssenceStats.value.findIndex(
      (s) => !s.isCustom && s.weaponId === stats.weaponId,
    );
    if (index !== -1) {
      requiredEssenceStats.value.splice(index, 1);
      return;
    }
  }
  requiredEssenceStats.value.push({ ...stats });
}

function addStatFromPreset(stats: EssenceStat) {
  requiredEssenceStats.value.push({ ...stats });
}

function removeStat(index: number) {
  requiredEssenceStats.value.splice(index, 1);
}

function moveUp(index: number) {
  if (index === 0) {
    return;
  }
  const item = requiredEssenceStats.value.splice(index, 1)[0]!;
  requiredEssenceStats.value.splice(index - 1, 0, item);
}

function moveDown(index: number) {
  if (index === requiredEssenceStats.value.length - 1) {
    return;
  }
  const item = requiredEssenceStats.value.splice(index, 1)[0]!;
  requiredEssenceStats.value.splice(index + 1, 0, item);
}

function getEssenceStatDescription(stat: EssenceStat): string {
  if (stat.isCustom) {
    return t('page.tools.essenceCalculator.custom');
  } else {
    return weapons[stat.weaponId!]!.weaponName;
  }
}

const battleChoices = computed(() => {
  const result: BattleChoice[] = [];
  // 枚举所有能量淤积点
  for (const { battleId, battleName, secondaryStats, skillStats } of Object.values(
    energyAlluviums,
  )) {
    // 枚举基础属性组合
    for (const selectedAttribute of combinations(allAttributeStats, 3)) {
      // 枚举附加属性
      for (const selectedSecondary of secondaryStats) {
        const matchedSelectedIndices: number[] = [];
        const matchedWeaponIds: string[] = [];
        for (const [
          index,
          { attribute, secondary, skill },
        ] of requiredEssenceStats.value.entries()) {
          if (
            attribute &&
            selectedAttribute.includes(attribute) &&
            secondary &&
            selectedSecondary === secondary &&
            skill &&
            skillStats.includes(skill)
          ) {
            matchedSelectedIndices.push(index);
          }
        }
        for (const {
          weaponId,
          stats: { attribute, secondary, skill },
        } of Object.values(weapons)) {
          if (
            attribute &&
            selectedAttribute.includes(attribute) &&
            secondary &&
            selectedSecondary === secondary &&
            skill &&
            skillStats.includes(skill)
          ) {
            matchedWeaponIds.push(weaponId);
          }
        }
        if (matchedSelectedIndices.length > 0) {
          result.push({
            battleId,
            battleName,
            selectedAttribute,
            selectedSecondary,
            selectedSkill: null,
            matchedSelectedIndices,
            matchedWeaponIds,
          });
        }
      }
      // 枚举技能属性
      for (const selectedSkill of skillStats) {
        const matchedSelectedIndices: number[] = [];
        const matchedWeaponIds: string[] = [];
        for (const [
          index,
          { attribute, secondary, skill },
        ] of requiredEssenceStats.value.entries()) {
          if (
            attribute &&
            selectedAttribute.includes(attribute) &&
            secondary &&
            secondaryStats.includes(secondary) &&
            skill &&
            selectedSkill === skill
          ) {
            matchedSelectedIndices.push(index);
          }
        }
        for (const {
          weaponId,
          stats: { attribute, secondary, skill },
        } of Object.values(weapons)) {
          if (
            attribute &&
            selectedAttribute.includes(attribute) &&
            secondary &&
            secondaryStats.includes(secondary) &&
            skill &&
            selectedSkill === skill
          ) {
            matchedWeaponIds.push(weaponId);
          }
        }
        if (matchedSelectedIndices.length > 0) {
          result.push({
            battleId,
            battleName,
            selectedAttribute,
            selectedSecondary: null,
            selectedSkill,
            matchedSelectedIndices,
            matchedWeaponIds,
          });
        }
      }
    }
  }
  return result;
});

const bestChoices = computed(() => {
  const result = battleChoices.value.filter(
    ({ matchedSelectedIndices }) => matchedSelectedIndices.length > 0,
  );
  result.sort((a, b) => {
    // First, sort by matchedSelectedIndices.length (descending)
    if (b.matchedSelectedIndices.length !== a.matchedSelectedIndices.length) {
      return b.matchedSelectedIndices.length - a.matchedSelectedIndices.length;
    }
    // Then, sort by matchedWeaponIds.length (descending)
    return b.matchedWeaponIds.length - a.matchedWeaponIds.length;
  });
  return result.slice(0, 5);
});
</script>

<style scoped>
.page-container {
  --weapon-icon-size: clamp(2.5rem, 14vw, 5rem);
}

.result-card-background-image {
  mask-image: linear-gradient(40deg, black, transparent 70%);
  -webkit-mask-image: linear-gradient(40deg, black, transparent 70%);
  transform: scale(0.8) translate(-30%, 0);
  transform-origin: bottom left;
}

.group-icon {
  width: 2rem;
  height: 2rem;
}

[data-theme='light'] .group-icon {
  filter: invert(1);
}

[data-theme='dark'] .group-icon {
  filter: none;
}

.customize-button {
  height: var(--weapon-icon-size) !important;
  width: var(--weapon-icon-size) !important;
}

.weapon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, var(--weapon-icon-size));
  gap: calc(var(--weapon-icon-size) / 10);
}

.weapon-item {
  width: var(--weapon-icon-size);
  height: var(--weapon-icon-size);
}

.weapon-icon-wrapper {
  position: relative;
  cursor: pointer;
}

.weapon-selected-overlay {
  position: absolute;
  inset: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.45);
  border-radius: var(--radius-sm);
  pointer-events: none;
}
</style>
