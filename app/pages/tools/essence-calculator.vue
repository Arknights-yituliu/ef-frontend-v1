<template>
  <div class="page-container">
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
          </v-container>
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
                />
                <h3>{{ getLocalizedText(groupName) }}</h3>
              </div>
              <div class="weapon-grid">
                <div
                  v-for="[wikiEntryId, weaponId] in wikiEntryTable[groupId]!.list.map(
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

      <v-expansion-panel value="输出">
        <v-expansion-panel-title>{{
          t('page.tools.essenceCalculator.output')
        }}</v-expansion-panel-title>
        <v-expansion-panel-text>
          <template v-if="bestChoice && bestChoice.matchedSelectedCount > 0">
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
                <template #matchedSelectedCount>
                  <strong>{{ bestChoice.matchedSelectedCount }}</strong>
                </template>
                <template #matchedAllCount>
                  <strong>{{ bestChoice.matchedAllCount }}</strong>
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
  </div>
</template>

<script lang="ts" setup>
import {
  gemTable,
  gemTagIdTable,
  getLocalizedText,
  weaponBasicTable,
  wikiEntryDataTable,
  wikiEntryTable,
  wikiGroupTable,
  worldEnergyPointGroupTable,
  worldEnergyPointTable,
} from '@/shared/utils/gameData/gameData';
const { t } = useI18n();

const allAttributeStats = Object.values(gemTable.value)
  .filter((gem) => gem.termType === 0)
  .map((gem) => gem.gemTermId);
const allSecondaryStats = Object.values(gemTable.value)
  .filter((gem) => gem.termType === 1)
  .map((gem) => gem.gemTermId);
const allSkillStats = Object.values(gemTable.value)
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
  matchedSelectedCount: number;
  matchedAllCount: number;
}

const emptyStat: EssenceStat = {
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
  const result = { ...emptyStat };
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
  // 枚举所有能量淤积点
  for (const { gameGroupId, primAttrTermIds, secAttrTermIds, skillTermIds } of Object.values(
    worldEnergyPointGroupTable.value,
  )) {
    // 枚举基础属性组合
    for (const selectedAttribute of combinations(primAttrTermIds, 3)) {
      // 枚举附加属性
      for (const selectedSecondary of secAttrTermIds) {
        let matchedSelectedCount = 0;
        let matchedAllCount = 0;
        for (const stat of validEssenceStats) {
          if (
            stat.attribute &&
            selectedAttribute.includes(stat.attribute) &&
            stat.secondary &&
            selectedSecondary === stat.secondary &&
            stat.skill &&
            skillTermIds.includes(stat.skill)
          ) {
            matchedSelectedCount++;
          }
        }
        for (const weaponId of Object.keys(weaponBasicTable.value)) {
          const weaponStats = statsForWeapon.value.get(weaponId)!;
          if (
            weaponStats.attribute &&
            selectedAttribute.includes(weaponStats.attribute) &&
            weaponStats.secondary &&
            selectedSecondary === weaponStats.secondary &&
            weaponStats.skill &&
            skillTermIds.includes(weaponStats.skill)
          ) {
            matchedAllCount++;
          }
        }
        if (matchedSelectedCount > 0) {
          result.push({
            gameGroupId,
            selectedAttribute,
            selectedSecondary,
            selectedSkill: null,
            matchedSelectedCount,
            matchedAllCount,
          });
        }
      }
      // 枚举技能属性
      for (const selectedSkill of skillTermIds) {
        let matchedSelectedCount = 0;
        let matchedAllCount = 0;
        for (const stat of validEssenceStats) {
          if (
            stat.attribute &&
            selectedAttribute.includes(stat.attribute) &&
            stat.secondary &&
            secAttrTermIds.includes(stat.secondary) &&
            stat.skill &&
            selectedSkill === stat.skill
          ) {
            matchedSelectedCount++;
          }
        }
        for (const weaponId of Object.keys(weaponBasicTable.value)) {
          const weaponStats = statsForWeapon.value.get(weaponId)!;
          if (
            weaponStats.attribute &&
            selectedAttribute.includes(weaponStats.attribute) &&
            weaponStats.secondary &&
            secAttrTermIds.includes(weaponStats.secondary) &&
            weaponStats.skill &&
            selectedSkill === weaponStats.skill
          ) {
            matchedAllCount++;
          }
        }
        if (matchedSelectedCount > 0) {
          result.push({
            gameGroupId,
            selectedAttribute,
            selectedSecondary: null,
            selectedSkill,
            matchedSelectedCount,
            matchedAllCount,
          });
        }
      }
    }
  }
  return result;
});

const bestChoice = computed(() => {
  if (
    !battleChoices.value.some(
      ({ matchedSelectedCount: matchedSelectedCount }) => matchedSelectedCount > 0,
    )
  ) {
    return null;
  }
  return battleChoices.value.reduce((prev, current) =>
    current.matchedSelectedCount > prev.matchedSelectedCount ||
    (current.matchedSelectedCount === prev.matchedSelectedCount &&
      current.matchedAllCount > prev.matchedAllCount)
      ? current
      : prev,
  );
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
