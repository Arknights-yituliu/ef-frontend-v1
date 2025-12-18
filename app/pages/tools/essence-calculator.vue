<template>
  <h1 class="page-title">{{ t('page.tools.essenceCalculator.title') }}</h1>
  <v-expansion-panels :model-value="['需求设定', '输出']" multiple>
    <v-expansion-panel value="需求设定">
      <v-expansion-panel-title>{{
        t('page.tools.essenceCalculator.demandSet')
      }}</v-expansion-panel-title>
      <v-expansion-panel-text>
        <p>{{ t('page.tools.essenceCalculator.demandSetDescription1') }}</p>
        <p>{{ t('page.tools.essenceCalculator.demandSetDescription2') }}</p>
        <v-container max-width="1280">
          <v-row v-for="(stat, index) in requiredEssenceStats" :key="index" align="center">
            <v-col cols="12" md="3">
              <v-select
                v-model="stat.attribute"
                :items="
                  allAttributeStats.map((stat) => ({
                    title: getGemTagName(stat),
                    value: stat,
                  }))
                "
                :label="t('page.tools.essenceCalculator.attributeStats')"
                :list-props="{ density: 'comfortable' }"
                :menu-props="{ maxHeight: 1024 }"
                density="comfortable"
                hide-details
                variant="outlined"
              ></v-select>
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="stat.secondary"
                :items="
                  allSecondaryStats.map((stat) => ({
                    title: getGemTagName(stat),
                    value: stat,
                  }))
                "
                :label="t('page.tools.essenceCalculator.secondaryStats')"
                :list-props="{ density: 'comfortable' }"
                :menu-props="{ maxHeight: 1024 }"
                density="comfortable"
                hide-details
                variant="outlined"
              ></v-select>
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="stat.skill"
                :items="
                  allSkillStats.map((stat) => ({
                    title: getGemTagName(stat),
                    value: stat,
                  }))
                "
                :label="t('page.tools.essenceCalculator.skillStats')"
                :list-props="{ density: 'comfortable' }"
                :menu-props="{ maxHeight: 1024 }"
                density="comfortable"
                hide-details
                variant="outlined"
              ></v-select>
            </v-col>
            <v-col cols="12" md="3">
              <!-- <v-btn
              icon="mdi-plus"
              color="primary"
              variant="text"
              @click="insertStat(index)"
            ></v-btn> -->
              <v-btn
                :disabled="index === 0"
                icon="mdi-chevron-up"
                variant="text"
                @click="moveUp(index)"
              ></v-btn>
              <v-btn
                :disabled="index === requiredEssenceStats.length - 1"
                icon="mdi-chevron-down"
                variant="text"
                @click="moveDown(index)"
              ></v-btn>
              <v-btn
                color="error"
                icon="mdi-delete"
                variant="text"
                @click="removeStat(index)"
              ></v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="9"></v-col>
            <v-col cols="12" md="3">
              <v-btn
                color="primary"
                icon="mdi-plus"
                variant="text"
                @click="addStatFromPreset({ ...emptyStat })"
              >
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-expansion-panel-text>
    </v-expansion-panel>

    <v-expansion-panel value="输出">
      <v-expansion-panel-title>{{
        t('page.tools.essenceCalculator.output')
      }}</v-expansion-panel-title>
      <v-expansion-panel-text>
        <template v-if="bestChoice && bestChoice.matchedCount > 0">
          <v-alert
            :title="t('page.tools.essenceCalculator.bestStrategy')"
            border="start"
            class="mb-4"
            type="success"
            variant="tonal"
          >
            <i18n-t class="mt-2" keypath="page.tools.essenceCalculator.suggestion" tag="p">
              <template #battleName>
                <strong>{{ getGameName(bestChoice.gameGroupId) }}</strong>
              </template>
              <template #count>
                <strong>{{ bestChoice.matchedCount }}</strong>
              </template>
            </i18n-t>
          </v-alert>

          <v-card variant="outlined">
            <v-card-title>{{ t('page.tools.essenceCalculator.preEngraveStats') }}</v-card-title>
            <v-divider></v-divider>
            <v-list-item>
              <v-list-item-title class="font-weight-bold mb-1">{{
                t('page.tools.essenceCalculator.selectAttributeStats')
              }}</v-list-item-title>
              <div>
                <v-chip
                  v-for="attr in bestChoice.selectedAttribute"
                  :key="attr"
                  class="ma-1"
                  color="primary"
                  label
                  size="small"
                >
                  {{ getGemTagName(attr) }}
                </v-chip>
              </div>
            </v-list-item>
            <v-list-item v-if="bestChoice.selectedSecondary">
              <v-list-item-title class="font-weight-bold mb-1">{{
                t('page.tools.essenceCalculator.selectSecondaryAttribute')
              }}</v-list-item-title>
              <v-chip class="ma-1" color="teal" label size="small">
                {{ getGemTagName(bestChoice.selectedSecondary) }}
              </v-chip>
            </v-list-item>
            <v-list-item v-if="bestChoice.selectedSkill">
              <v-list-item-title class="font-weight-bold mb-1">{{
                t('page.tools.essenceCalculator.selectSkillAttribute')
              }}</v-list-item-title>
              <v-chip class="ma-1" color="blue" label size="small">
                {{ getGemTagName(bestChoice.selectedSkill) }}
              </v-chip>
            </v-list-item>
          </v-card>
        </template>
        <template v-else>
          <v-alert border="start" type="info" variant="tonal">
            {{ t('page.tools.essenceCalculator.noValidDemand') }}
          </v-alert>
        </template>
      </v-expansion-panel-text>
    </v-expansion-panel>

    <v-expansion-panel>
      <v-expansion-panel-title>{{
        t('page.tools.essenceCalculator.debugInput')
      }}</v-expansion-panel-title>
      <v-expansion-panel-text>
        <pre>{{ requiredEssenceStats }}</pre>
      </v-expansion-panel-text>
    </v-expansion-panel>

    <v-expansion-panel>
      <v-expansion-panel-title>{{
        t('page.tools.essenceCalculator.debugOutput')
      }}</v-expansion-panel-title>
      <v-expansion-panel-text>
        <pre>{{ JSON.stringify(battleChoices, null, 2) }}</pre>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts" setup>
import {
  itemTable,
  weaponBasicTable,
  worldEnergyPointGroupTable,
  gemTable,
  worldEnergyPointTable,
} from '@/shared/utils/gameData/gameData';
import type { GemTable } from '@/shared/types/endfielddata/TableCfg/GemTable';
import { getLocalizedText } from '@/shared/utils/gameData/gameData';
import { getItemName } from '@/shared/utils/gameData/item';
import { get } from 'http';

const { t } = useI18n();

const allAttributeStats = Object.values(gemTable)
  .filter((gem) => gem.termType === 0)
  .map((gem) => gem.gemTermId);
const allSecondaryStats = Object.values(gemTable)
  .filter((gem) => gem.termType === 1)
  .map((gem) => gem.gemTermId);
const allSkillStats = Object.values(gemTable)
  .filter((gem) => gem.termType === 2)
  .map((gem) => gem.gemTermId);

interface EssenceStat {
  attribute: string | null;
  secondary: string | null;
  skill: string | null;
}

interface BattleChoice {
  gameGroupId: string;
  selectedAttribute: string[];
  selectedSecondary: string | null;
  selectedSkill: string | null;
  matchedCount: number;
}

const emptyStat: EssenceStat = {
  attribute: null,
  secondary: null,
  skill: null,
};

/** 需求的基质属性 */
const requiredEssenceStats = ref<EssenceStat[]>([{ ...emptyStat }]);

function getGemTagName(gemTermId: string): string {
  const gem = gemTable[gemTermId];
  if (gem === undefined) {
    return gemTermId;
  }
  return getLocalizedText(gem.tagName) || gemTermId;
}

function getGameName(gameGroupId: string): string {
  const worldLevel2GameMechanicsIdMap =
    worldEnergyPointGroupTable[gameGroupId]!.worldLevel2GameMechanicsIdMap;
  const lastGameMechanicsId =
    worldLevel2GameMechanicsIdMap[
      Math.max(...Object.keys(worldLevel2GameMechanicsIdMap).map(Number))
    ]!;
  const worldEnergyPoint = worldEnergyPointTable[lastGameMechanicsId]!;
  return getLocalizedText(worldEnergyPoint.gameName);
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

const battleChoices = computed(() => {
  const validEssenceStats = requiredEssenceStats.value.filter(
    ({ attribute, secondary, skill }) =>
      attribute &&
      allAttributeStats.includes(attribute) &&
      secondary &&
      allSecondaryStats.includes(secondary) &&
      skill &&
      allSkillStats.includes(skill),
  );

  const result: BattleChoice[] = [];
  for (const { gameGroupId, primAttrTermIds, secAttrTermIds, skillTermIds } of Object.values(
    worldEnergyPointGroupTable,
  )) {
    for (const selectedAttribute of combinations(primAttrTermIds, 3)) {
      // 选择附加属性
      for (const selectedSecondary of secAttrTermIds) {
        let matchedCount = 0;
        for (const stat of validEssenceStats) {
          if (
            stat.attribute &&
            selectedAttribute.includes(stat.attribute) &&
            stat.secondary &&
            selectedSecondary === stat.secondary &&
            stat.skill &&
            skillTermIds.includes(stat.skill)
          ) {
            matchedCount++;
          }
        }
        if (matchedCount > 0) {
          result.push({
            gameGroupId,
            selectedAttribute,
            selectedSecondary,
            selectedSkill: null,
            matchedCount,
          });
        }
      }
      // 选择技能属性
      for (const selectedSkill of skillTermIds) {
        let matchedCount = 0;
        for (const stat of validEssenceStats) {
          if (
            stat.attribute &&
            selectedAttribute.includes(stat.attribute) &&
            stat.secondary &&
            secAttrTermIds.includes(stat.secondary) &&
            stat.skill &&
            selectedSkill === stat.skill
          ) {
            matchedCount++;
          }
        }
        if (matchedCount > 0) {
          result.push({
            gameGroupId,
            selectedAttribute,
            selectedSecondary: null,
            selectedSkill,
            matchedCount,
          });
        }
      }
    }
  }
  return result;
});

const bestChoice = computed(() => {
  if (!battleChoices.value.some(({ matchedCount }) => matchedCount > 0)) {
    return null;
  }
  return battleChoices.value.reduce((prev, current) =>
    prev.matchedCount > current.matchedCount ? prev : current,
  );
});
</script>

<style scoped></style>
