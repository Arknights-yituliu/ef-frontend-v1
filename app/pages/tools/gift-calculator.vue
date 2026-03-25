<template>
  <v-container class="page-container" fluid>
    <v-expansion-panels variant="accordion">
      <v-expansion-panel color="grey-darken-1">
        <template #title>
          <v-icon class="mr-1" icon="mdi-information-variant-circle"/>
          <b>{{ $t('page.tools.giftCalculator.giftExplain.title1') }}</b>
        </template>
        <template #text>
          <v-card-text class="text-body-2">
            <div class="mb-3">
              <p>{{ $t('page.tools.giftCalculator.giftExplain.text1-1') }}</p>
              <p>{{ $t('page.tools.giftCalculator.giftExplain.text1-2') }}</p>
              <p>{{ $t('page.tools.giftCalculator.giftExplain.text1-3') }}</p>
            </div>
            <p class="text-subtitle-1 font-weight-bold">{{ $t('page.tools.giftCalculator.giftExplain.title2') }}</p>
            <div class="mb-3">
              <p>{{ $t('page.tools.giftCalculator.giftExplain.text2-1') }}</p>
              <v-img class="mr-1" :src="getLocaleImg('hobby_check')" width="500" />
              <p>{{ $t('page.tools.giftCalculator.giftExplain.text2-2') }}</p>
              <v-img class="mr-1" :src="getLocaleImg('good_gift')" width="650" />
            </div>
            <p class="text-subtitle-1 font-weight-bold">{{ $t('page.tools.giftCalculator.giftExplain.title3') }}</p>
            <div class="mb-3">
              <p>{{ $t('page.tools.giftCalculator.giftExplain.text3-1') }}</p>
              <p>{{ $t('page.tools.giftCalculator.giftExplain.text3-2') }}</p>
              <v-img class="mr-1" :src="getLocaleImg('prefer_gift')" width="650" />
            </div>
            <p class="text-subtitle-1 font-weight-bold">{{ $t('page.tools.giftCalculator.giftExplain.title4') }}</p>
            <div class="mb-3">
              <p>{{ $t('page.tools.giftCalculator.giftExplain.text4-1') }}</p>
              <v-img class="mr-1" :src="getLocaleImg('hot_gift')" width="450" />
              <p>{{ $t('page.tools.giftCalculator.giftExplain.text4-2') }}</p>
              <p>{{ $t('page.tools.giftCalculator.giftExplain.text4-3') }}</p>
              <v-img class="mr-1" :src="getLocaleImg('hot_gift_limit')" width="350" />
              <p>{{ $t('page.tools.giftCalculator.giftExplain.text4-4') }}</p>
            </div>
            <p class="text-subtitle-1 font-weight-bold">{{ $t('page.tools.giftCalculator.giftExplain.title5') }}</p>
            <div>
              <p>{{ $t('page.tools.giftCalculator.giftExplain.text5-1') }}</p>
              <p>{{ $t('page.tools.giftCalculator.giftExplain.text5-2') }}</p>
            </div>
          </v-card-text>
        </template>
      </v-expansion-panel>
      <v-expansion-panel color="yellow-lighten-1">
        <template #title>
          <v-icon class="mr-1" icon="mdi-help-circle"/>
          <b>{{ $t('page.tools.giftCalculator.howToUseExplain.title') }}</b>
        </template>
        <template #text>
          <v-card-text class="text-body-2">
            <div>
              <p>{{ $t('page.tools.giftCalculator.howToUseExplain.text1') }}</p>
            </div>
            <v-list lines="one">
              <v-list-item
                v-for="n in 3"
                :key="n"
                :subtitle="$t(`page.tools.giftCalculator.howToUseExplain.textl-${n}-d`)"
                :title="$t(`page.tools.giftCalculator.howToUseExplain.textl-${n}`)"
              ></v-list-item>
            </v-list>
            <div>
              <p>{{ $t('page.tools.giftCalculator.howToUseExplain.text2') }}</p>
            </div>
          </v-card-text>
        </template>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-card class="mt-2 mb-2 pa-3">
      <div class="d-flex align-center">
        <div class="d-flex align-center flex-column flex-md-row filter-name">
          <div class="font-weight-bold mr-0 mr-md-1">
            {{ $t('page.tools.giftCalculator.filterGiftCategory') }}
          </div>
          <v-btn color="red-darken-1" icon="mdi-delete" size="x-small" @click="clearSelect('category')">
          </v-btn>
        </div>
        <div>
          <v-chip
            v-for="[cateId, cate] in Object.entries(gifts.giftProps.category)"
            class="ma-1"
            :color="selectedTags.category.includes(cateId) ? '#fffa00' : 'grey-lighten-2'"
            label variant="elevated"
            @click="selectTag('category', cateId)"
          >
            <v-img
:class="[
              'mr-1',
              'reverse-img'
            ]" height="16" :src="getCategoryIcon(cateId)" width="16" />
            {{ getLocaleText(cate) }}
          </v-chip>
        </div>
      </div>
      <div class="d-flex align-center">
        <div class="d-flex align-center flex-column flex-md-row filter-name">
          <div class="font-weight-bold mr-0 mr-md-1">
            {{ $t('page.tools.giftCalculator.filterGiftHobby') }}
          </div>
          <v-btn  color="red-darken-1" icon="mdi-delete" size="x-small" @click="clearSelect('hobby')">
          </v-btn>
        </div>
        <div>
          <v-chip
            v-for="[hobbyId, hobby] in Object.entries(gifts.giftProps.hobby)"
            class="ma-1"
            :color="selectedTags.hobby.includes(hobbyId) ? '#fffa00' : 'grey-lighten-2'"
            label variant="elevated"
            @click="selectTag('hobby', hobbyId)"
          >
            {{ getLocaleText(hobby) }}
          </v-chip>
        </div>
      </div>
      <v-switch v-model="mobileHelperEnabled" class="pl-2 d-md-none" color="#fffa00" density="compact" hide-details>
        <template #label>
          {{ $t('page.tools.giftCalculator.switchMobileHelper') }}
        </template>
      </v-switch>
    </v-card>
    <v-card class="mb-2" prepend-icon="mdi-hand-heart">
      <template #title>
        <span class="font-weight-black">
          {{ $t('page.tools.giftCalculator.allGifts') }}
        </span>
      </template>
      <v-card-text class="text-body-2">
        <div class="mb-3">
          <v-icon icon="mdi-information-variant-circle" />
          {{ $t('page.tools.giftCalculator.allGiftsCanSelect') }}
        </div>
        <div class="gift-grid">
          <div
            v-for="giftId in Object.keys(filtedGifts)" :key="giftId"
            class="gift-icon-wrapper gift-item position-relative"
          >
            <v-badge color="#0000" location="top right" :model-value="gifts.gift[giftId]?.isHot" offset-x="26" offset-y="2">
              <template #badge>
                <v-chip class="pa-0" color="#0000" density="compact" variant="outlined">
                  <v-img :src="hotIcon" width="32"/>
                </v-chip>
              </template>
              <v-badge color="#0000" location="top right" offset-x="42" offset-y="3">
                <template #badge>
                  <v-chip v-if="gifts.gift[giftId]?.isHotExpiring" class="pa-2" color="#f33e3a" density="compact" label size="x-small" variant="elevated">
                    <v-icon color="#fff" size="14">mdi-clock-alert-outline</v-icon>
                  </v-chip>
                </template>
                <div class="position-relative" @click="giftSelectTag(giftId)">
                  <ContainerItemIcon :item-id="giftId" show-item-name />
                  <v-img
:class="[
                    'mr-1 position-absolute position-cateicon-on-itemicon',
                    theme== 'dark' ? '' : 'reverse-img',
                    filtedGifts[giftId] ? (theme === 'dark' ? 'hilight-prefer-gift-dark' : 'hilight-prefer-gift-light') : ''
                  ]" height="16" :src="getCategoryIcon(gifts.gift[giftId]?.favorCategory)" width="16"/>
                </div>
              </v-badge>
            </v-badge>
            <v-tooltip
              activator="parent"
              location="bottom"
            >
              <div class="d-flex flex-column align-center">
                <div class="d-flex font-weight-bold align-center">
                  <v-img
class="mr-1" :class="theme== 'dark' ? 'reverse-img' : ''" height="16" :src="getCategoryIcon(gifts.gift[giftId]?.favorCategory)"
                  width="16"/>
                  {{ getLocaleText(gifts.giftProps.category[gifts.gift[giftId]?.favorCategory || ''] || {}) }}
                </div>
                <v-chip v-if="gifts.gift[giftId]?.isHot" class="mb-1" color="#f33e3a" density="compact" size="small" variant="elevated">
                  <span v-if="gifts.gift[giftId]?.isHotExpiring" class="pr-1 d-flex align-center">
                    <v-icon class="pr-2" color="white" size="16">mdi-clock-alert-outline</v-icon>
                    {{ $t('page.tools.giftCalculator.allGiftsExpiring') }}
                  </span> 
                  <span class="font-weight-bold">{{ $t('page.tools.giftCalculator.hot') }}</span>
                </v-chip>
                <div class="d-flex ga-1">
                  <v-chip v-for="hobby in gifts.gift[giftId]?.favorHobby" :key="hobby" density="compact" size="small" variant="outlined">
                    {{ getLocaleText(gifts.giftProps.hobby[hobby] || {}) }}
                  </v-chip>
                </div>
              </div>
            </v-tooltip>
            <div
v-if="checkForceSelectItem('gift', giftId)"
              class="position-absolute hilight-selection">
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
    <v-card prepend-icon="mdi-account-group">
      <template #title>
        <span class="font-weight-black">
          {{ $t('page.tools.giftCalculator.allOperators') }}
        </span>
      </template>
      <v-card-text class="text-body-2">
        <div class="mb-1">
          <v-icon icon="mdi-information-variant-circle" />
          {{ $t('page.tools.giftCalculator.allOperatorsInfo') }}
        </div>
        <div v-if="false">
          {{ selectedTags }}
        </div>
        <div v-if="false">
          {{ filtedOperators }}
        </div>
        <div class="gift-grid">
          <div v-for="opId in Object.keys(filtedOperators)" :key="opId">
            <div
              :class="[
                'op-card-wrapper border-md rounded border-opacity-25 position-relative',
                filtedOperators[opId] ? (theme === 'dark' ? 'hilight-op-dark' : 'hilight-op-light') : ''
              ]"
              @click="operatorSelectTag(opId)"
            >
              <v-img :src="getOperatorIcon(opId)" width="100%" />
              <div class="text-center w-100">
                {{ getLocaleText(gifts.operator[opId]?.name) }}
              </div>
              <v-tooltip
                activator="parent"
                location="bottom"
              >
                <div class="d-flex flex-column align-center">
                  <div v-for="cate in gifts.operator[opId]?.favorCategory" class="d-flex font-weight-bold align-center">
                    <v-img
class="mr-1" :class="theme== 'dark' ? 'reverse-img' : ''" height="16" :src="getCategoryIcon(cate)"
                    width="16"/>
                    {{ getLocaleText(gifts.giftProps.category[cate] || {}) }}
                  </div>
                  <div class="d-flex ga-1">
                    <v-chip v-for="hobby in gifts.operator[opId]?.favorHobby" :key="hobby" density="compact" size="small" variant="outlined">
                      {{ getLocaleText(gifts.giftProps.hobby[hobby] || {}) }}
                    </v-chip>
                  </div>
                </div>
              </v-tooltip>
              <div
v-if="checkForceSelectItem('operator', opId)"
                class="position-absolute hilight-selection-op">
              </div>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import type { Gift, GiftTag, OpName } from '@/custom/core/gifts';
import { getCategoryIcon, getOperatorIcon, gifts, hotIcon } from '@/custom/core/gifts';
const { theme } = useTheme();
const { locale } = useI18n();

function getLocaleText (textGroup: GiftTag | OpName | undefined) {
  return textGroup?.[locale.value]
}

function getLocaleImg (img: string) {
  return `/images/giftCalculator/${img}_${locale.value}.png`;
}

const selectedTags = ref({
  category: [] as string[],
  hobby: [] as string[],
});

function selectTag (type: 'category' | 'hobby', tag: string) {
  const index = selectedTags.value[type].indexOf(tag);
  if (index === -1) {
    selectedTags.value[type].push(tag);
  } else {
    selectedTags.value[type].splice(index, 1);
  }
  currentForceSelectItem.value = {
    type: '',
    id: '',
  }
}

function giftSelectTag (giftId: string) {
  if (mobileHelperEnabled.value) {return}
  const gift = gifts.gift[giftId];
  if (gift) {
    selectedTags.value.category = [gift.favorCategory];
    selectedTags.value.hobby = [...gift.favorHobby];
    currentForceSelectItem.value = {
      type: 'gift',
      id: giftId,
    }
  }
}

function operatorSelectTag (opId: string) {
  if (mobileHelperEnabled.value) {return}
  const operator = gifts.operator[opId];
  if (operator) {
    selectedTags.value.category = [...operator.favorCategory];
    selectedTags.value.hobby = [...operator.favorHobby];
    currentForceSelectItem.value = {
      type: 'operator',
      id: opId,
    }
  }
}

const currentForceSelectItem = ref({
    type: '' as 'operator' | 'gift' | '',
    id: '',
})

function checkForceSelectItem (type: 'operator' | 'gift', id: string) {
  return currentForceSelectItem.value.type === type && currentForceSelectItem.value.id === id;
}

function clearSelect (type: 'category' | 'hobby') {
  selectedTags.value[type] = [];
  currentForceSelectItem.value = {
    type: '',
    id: '',
  }
}

const mobileHelperEnabled = ref(false);

const filtedOperators = computed(() => {
  const res: Record<string, boolean> = {}
  const filted = Object.entries(gifts.operator)
    .filter(([_, operator]) => {
      if (selectedTags.value.hobby.length === 0) {
        if (selectedTags.value.category.length === 0) {
          return true;
        } else {
          const matchCategory = operator.favorCategory.some(cate => selectedTags.value.category.includes(cate));
          return matchCategory;
        }
      } else {
        const matchHobby = operator.favorHobby.some(hobby => selectedTags.value.hobby.includes(hobby));
        if (!matchHobby) { return false}
        else {
          const matchCategory = operator.favorCategory.some(cate => selectedTags.value.category.includes(cate));
          return matchCategory || matchHobby;
        }
      }
    })
  for (const [opId, operator] of filted) {
    res[opId] = operator.favorCategory.some(cate => selectedTags.value.category.includes(cate));
  }
  return res;
})

const filtedGifts = computed(() => {
  const res: Record<string, boolean> = {}
  const filted = Object.entries(gifts.gift).filter(([_, gift]) => {
    if (selectedTags.value.hobby.length === 0) {
      if (selectedTags.value.category.length === 0) {
        return true;
      } else {
        return selectedTags.value.category.includes(gift.favorCategory);
      }
    } else {
      const matchHobby = gift.favorHobby.some(hobby => selectedTags.value.hobby.includes(hobby));
      if (!matchHobby) { return false}
      else {
        return selectedTags.value.category.includes(gift.favorCategory) || matchHobby;
      }
    }
  })
  for (const [giftId, gift] of filted) {
    res[giftId] = selectedTags.value.category.includes(gift.favorCategory)
  }
  return res;
})

</script>

<style scoped>
.page-container {
  --weapon-icon-size: clamp(2.5rem, 16.4vw, 5rem);
}

.filter-name {
  min-width: 3em;
}

.gift-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, var(--weapon-icon-size));
  gap: calc(var(--weapon-icon-size) / 10);
}

.gift-icon-wrapper, .op-card-wrapper {
  position: relative;
  cursor: pointer;
}

.border-animation {
  animation: hilight-force-border 0.5s ease-out reverse forwards 1;
}

.border-animation-op {
  animation: hilight-force-border-op 0.5s ease-out reverse forwards 1;
}

.gift-item {
  width: var(--weapon-icon-size);
  height: var(--weapon-icon-size);
}

.hilight-op-light {
  background: linear-gradient(345deg, #fffa00, #0000 40%);
}

.hilight-op-dark {
  background: linear-gradient(345deg, #fffa008c, #0000 40%);
}

.hilight-prefer-gift-light {
  --border-c: #7b6d00a3;
    filter: brightness(0) saturate(100%) invert(95%) sepia(7%) saturate(5660%) hue-rotate(1deg) brightness(104%) contrast(104%) drop-shadow(2px 0px 0 var(--border-c)) drop-shadow(0 2px 0 var(--border-c)) drop-shadow(-2px 0 0 var(--border-c)) drop-shadow(0 -2px 0 var(--border-c)) !important;
}

.hilight-prefer-gift-dark {
  --border-c: #7b6d00a3;
    filter: brightness(0) saturate(100%) invert(95%) sepia(7%) saturate(5660%) hue-rotate(1deg) brightness(104%) contrast(104%) drop-shadow(2px 0px 0 var(--border-c)) drop-shadow(0 2px 0 var(--border-c)) drop-shadow(-2px 0 0 var(--border-c)) drop-shadow(0 -2px 0 var(--border-c));
}

.hilight-selection, .hilight-selection-op {
  border: 5px solid;
  border-color: #fff;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 7px #000c, inset 0 0 7px #000c;
  width: 120%;
  height: 120%;
  z-index: 1;
  animation: hilight-force-border 0.3s ease-out forwards;
}

.hilight-selection-op {
  animation-name: hilight-force-border-op;
}

.reverse-img {
  filter: invert(100%);
}

.position-cateicon-on-itemicon {
  left: 1px;
  top: 1px;
}

@keyframes hilight-force-border {
  0% {
    width: 200%;
    height: 200%;
    border-color: #fff;
  }
  100% {
    width: 120%;
    height: 120%;
    border-color: #fffa00;
  }
}

@keyframes hilight-force-border-op {
  0% {
    width: 200%;
    height: 190%;
    border-color: #fff;
  }
  100% {
    width: 125%;
    height: 115%;
    border-color: #fffa00;
  }
}
</style>
