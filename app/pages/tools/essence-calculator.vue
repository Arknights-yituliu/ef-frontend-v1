<template>
  <div class="page-container">
    <header class="page-title">{{ t('page.tools.essenceCalculator.title') }}</header>
    <v-expansion-panels :model-value="['需求设定', '计算结果']" multiple>
      <v-expansion-panel value="需求设定">
        <v-expansion-panel-title>{{
          t('page.tools.essenceCalculator.demandSet')
        }}</v-expansion-panel-title>
        <v-expansion-panel-text>
          <p>{{ t('page.tools.essenceCalculator.demandSetDescription1') }}</p>
          <p>{{ t('page.tools.essenceCalculator.demandSetDescription2') }}</p>
          <div class="mb-8" />
          <v-row v-for="(stat, index) in requiredEssenceStats" :key="index" align="center">
            <v-col cols="0" md="1" />
            <v-col cols="12" md="2">
              <div>
                <span class="font-weight-bold mr-4">#{{ index + 1 }}</span
                ><span>{{ getEssenceStatDescription(stat) }}</span>
              </div>
            </v-col>
            <v-col cols="12" md="2">
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
                :disabled="!stat.isCustom"
                density="comfortable"
                hide-details
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" md="2">
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
                :disabled="!stat.isCustom"
                density="comfortable"
                hide-details
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" md="2">
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
                :disabled="!stat.isCustom"
                density="comfortable"
                hide-details
                variant="outlined"
              />
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
              <v-btn color="error" icon="mdi-delete" variant="text" @click="removeStat(index)" />
            </v-col>
          </v-row>
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
            <div
              v-for="{ groupId, groupName, iconId } in wikiGroupTable['wiki_type_weapon']!.list"
              :key="groupId"
            >
              <div class="d-flex align-center mb-4 mt-8 ga-2">
                <img
                  :src="getGroupIconUrl(iconId)"
                  :alt="getLocalizedText(groupName)"
                  class="group-icon"
                >
                <h3>{{ getLocalizedText(groupName) }}</h3>
              </div>
              <div class="weapon-grid">
                <div
                  v-for="[wikiEntryId, weaponId = ''] in wikiEntryTable[groupId]!.list.map(
                    (wikiEntryId: string) => [
                      wikiEntryId,
                      wikiEntryDataTable[wikiEntryId]!.refItemId,
                    ],
                  )"
                  :key="wikiEntryId"
                  class="weapon-item"
                  @click="addStatFromPreset(statsForWeapon.get(weaponId)!)"
                >
                  <ContainerItemIcon :item-id="weaponId" show-item-name />
                </div>
              </div>
            </div>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel value="计算结果">
        <v-expansion-panel-title>{{
          t('page.tools.essenceCalculator.output')
        }}</v-expansion-panel-title>
        <v-expansion-panel-text>
          <template v-if="bestChoices.length > 0">
            <div v-for="(choice, i) in bestChoices" :key="i" class="mb-6">
              <v-card class="result-card" elevation="2" rounded="lg">
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
                    <v-chip class="font-weight-bold" color="success" size="small" variant="flat">
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
                        <v-icon class="mr-2" color="primary" icon="mdi-map-marker" size="small" />
                        <span class="text-subtitle-1 font-weight-bold">{{
                          t('page.tools.essenceCalculator.farmLocation')
                        }}</span>
                      </div>

                      <div class="pl-1 mb-6">
                        <v-chip color="info" label variant="outlined">
                          {{ getGameName(choice.gameGroupId) }}
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
                              {{ getGemTagName(attr) }}
                            </v-chip>
                          </div>
                        </div>

                        <!-- Secondary Attribute -->
                        <div v-if="choice.selectedSecondary" class="mb-4">
                          <div class="text-medium-emphasis mb-1">
                            {{ t('page.tools.essenceCalculator.selectSecondaryAttribute') }}
                          </div>
                          <v-chip color="teal" label variant="flat">
                            {{ getGemTagName(choice.selectedSecondary) }}
                          </v-chip>
                        </div>

                        <!-- Skill Attribute -->
                        <div v-if="choice.selectedSkill" class="mb-4">
                          <div class="text-medium-emphasis mb-1">
                            {{ t('page.tools.essenceCalculator.selectSkillAttribute') }}
                          </div>
                          <v-chip color="blue" label variant="flat">
                            {{ getGemTagName(choice.selectedSkill) }}
                          </v-chip>
                        </div>
                      </div>
                    </v-col>

                    <v-divider vertical class="hidden-sm-and-down" />
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
                            <v-chip
                              v-for="index in choice.matchedSelectedIndices"
                              :key="index"
                              class="font-weight-medium"
                              color="success"
                              label
                              variant="tonal"
                            >
                              <span class="mr-1">#{{ index + 1 }}</span>
                              {{ getEssenceStatDescription(requiredEssenceStats[index]!) }}
                            </v-chip>
                          </div>
                        </div>

                        <!-- Matched Weapons -->
                        <div>
                          <div class="text-medium-emphasis mb-1">
                            {{ t('page.tools.essenceCalculator.matchedWeapons') }}
                          </div>
                          <div class="d-flex flex-wrap ga-2">
                            <v-chip
                              v-for="weaponId in choice.matchedWeaponIds"
                              :key="weaponId"
                              color="default"
                              label
                              variant="outlined"
                            >
                              {{ getLocalizedText(itemTable[weaponId]!.name) }}
                            </v-chip>
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
  </div>
</template>

<script lang="ts" setup>
import {
  gemTable,
  gemTagIdTable,
  getLocalizedText,
  weaponBasicTable,
  worldEnergyPointGroupTable,
  worldEnergyPointTable,
  itemTable,
} from '@/shared/utils/gameData/gameData';
import type { WikiEntryDataTable } from '@/shared/types/endfielddata/TableCfg/WikiEntryDataTable';
import type { WikiEntryTable } from '@/shared/types/endfielddata/TableCfg/WikiEntryTable';
import type { WikiGroupTable } from '@/shared/types/endfielddata/TableCfg/WikiGroupTable';

const { t } = useI18n();
const runtimeConfig = useRuntimeConfig();

// 从 runtimeConfig 获取 Wiki 相关数据表
const wikiEntryDataTable = computed<WikiEntryDataTable>(
  () => JSON.parse(runtimeConfig.public.wikiEntryDataTable) as WikiEntryDataTable,
);
const wikiEntryTable = computed<WikiEntryTable>(
  () => JSON.parse(runtimeConfig.public.wikiEntryTable) as WikiEntryTable,
);
const wikiGroupTable = computed<WikiGroupTable>(
  () => JSON.parse(runtimeConfig.public.wikiGroupTable) as WikiGroupTable,
);

const allAttributeStats = computed(() =>
  Object.values(gemTable.value)
    .filter((gem) => gem.termType === 0)
    .map((gem) => gem.gemTermId),
);
const allSecondaryStats = computed(() =>
  Object.values(gemTable.value)
    .filter((gem) => gem.termType === 1)
    .map((gem) => gem.gemTermId),
);
const allSkillStats = computed(() =>
  Object.values(gemTable.value)
    .filter((gem) => gem.termType === 2)
    .map((gem) => gem.gemTermId),
);

interface EssenceStat {
  isCustom: boolean;
  weaponId: string | null;
  attribute: string | null;
  secondary: string | null;
  skill: string | null;
}

interface BattleChoice {
  gameGroupId: string;
  selectedAttribute: string[];
  selectedSecondary: string | null;
  selectedSkill: string | null;
  matchedSelectedIndices: number[];
  matchedWeaponIds: string[];
}

const emptyStat: EssenceStat = {
  isCustom: true,
  weaponId: null,
  attribute: null,
  secondary: null,
  skill: null,
};

/** 需求的基质属性 */
const requiredEssenceStats = ref<EssenceStat[]>([{ ...emptyStat }]);

function getGemTagName(gemTermId: string): string {
  const gem = gemTable.value[gemTermId];
  if (gem === undefined) {
    return gemTermId;
  }
  return getLocalizedText(gem.tagName) || gemTermId;
}

function getGameName(gameGroupId: string): string {
  const worldLevel2GameMechanicsIdMap =
    worldEnergyPointGroupTable.value[gameGroupId]!.worldLevel2GameMechanicsIdMap;
  const lastGameMechanicsId =
    worldLevel2GameMechanicsIdMap[
      Math.max(...Object.keys(worldLevel2GameMechanicsIdMap).map(Number))
    ]!;
  const worldEnergyPoint = worldEnergyPointTable.value[lastGameMechanicsId]!;
  return getLocalizedText(worldEnergyPoint.gameName);
}

function getStatsForWeapon(weaponId: string): EssenceStat {
  const weapon = weaponBasicTable.value[weaponId];
  if (!weapon) {
    return { ...emptyStat };
  }

  const result = { ...emptyStat, isCustom: false, weaponId };
  for (const weaponSkill of weapon.weaponSkillList) {
    const skillPatch = skillPatchTable.value[weaponSkill]!;
    const tagId = skillPatch.SkillPatchDataBundle[0]!.tagId;
    const gemStat = gemTagIdTable.value[tagId]!;
    const gem = gemTable.value[gemStat]!;
    switch (gem.termType) {
      case 0:
        result.attribute = gem.gemTermId;
        break;
      case 1:
        result.secondary = gem.gemTermId;
        break;
      case 2:
        result.skill = gem.gemTermId;
        break;
    }
  }
  return result;
}

const statsForWeapon = computed(() => {
  const result: Map<string, EssenceStat> = new Map(
    Object.keys(weaponBasicTable.value).map((weaponId) => [weaponId, getStatsForWeapon(weaponId)]),
  );
  return result;
});

// function weaponTypeToWeaponTypeName(weaponType: number): string {
//   return getLocalizedText(textTable.value[`LUA_WEAPON_TYPE_${weaponType}`]!);
// }

function getGroupIconUrl(iconId: string): string {
  return `https://cos.yituliu.cn/endfield/sprites_selective/wiki/groupicon/${iconId}.png`;
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
    return getLocalizedText(itemTable.value[stat.weaponId!]!.name);
  }
}

const battleChoices = computed(() => {
  const result: BattleChoice[] = [];
  // 枚举所有能量淤积点
  for (const { gameGroupId, primAttrTermIds, secAttrTermIds, skillTermIds } of Object.values(
    worldEnergyPointGroupTable.value,
  )) {
    // 枚举基础属性组合
    for (const selectedAttribute of combinations(primAttrTermIds, 3)) {
      // 枚举附加属性
      for (const selectedSecondary of secAttrTermIds) {
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
            skillTermIds.includes(skill)
          ) {
            matchedSelectedIndices.push(index);
          }
        }
        for (const weaponId of Object.keys(weaponBasicTable.value)) {
          const { attribute, secondary, skill } = statsForWeapon.value.get(weaponId)!;
          if (
            attribute &&
            selectedAttribute.includes(attribute) &&
            secondary &&
            selectedSecondary === secondary &&
            skill &&
            skillTermIds.includes(skill)
          ) {
            matchedWeaponIds.push(weaponId);
          }
        }
        if (matchedSelectedIndices.length > 0) {
          result.push({
            gameGroupId,
            selectedAttribute,
            selectedSecondary,
            selectedSkill: null,
            matchedSelectedIndices,
            matchedWeaponIds,
          });
        }
      }
      // 枚举技能属性
      for (const selectedSkill of skillTermIds) {
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
            secAttrTermIds.includes(secondary) &&
            skill &&
            selectedSkill === skill
          ) {
            matchedSelectedIndices.push(index);
          }
        }
        for (const weaponId of Object.keys(weaponBasicTable.value)) {
          const { attribute, secondary, skill } = statsForWeapon.value.get(weaponId)!;
          if (
            attribute &&
            selectedAttribute.includes(attribute) &&
            secondary &&
            secAttrTermIds.includes(secondary) &&
            skill &&
            selectedSkill === skill
          ) {
            matchedWeaponIds.push(weaponId);
          }
        }
        if (matchedSelectedIndices.length > 0) {
          result.push({
            gameGroupId,
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
  --weapon-icon-size: clamp(3rem, 16vw, 6rem);
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
</style>
