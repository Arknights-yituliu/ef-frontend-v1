<template>
  <section class="skland-card">
    <!-- 基础信息 -->
    <div class="profile-head">
      <v-avatar class="profile-avatar" size="4rem">
        <img v-if="detail.base?.avatarUrl" :alt="baseName" :src="detail.base.avatarUrl" />
        <span v-else>{{ baseName.slice(0, 1) }}</span>
      </v-avatar>
      <div class="profile-info">
        <h2 class="profile-name">{{ baseName }}</h2>
        <div class="profile-chips">
          <v-chip size="small" variant="tonal">
            {{ t('page.sklandEndfield.detail.level') }} {{ detail.base?.level ?? '-' }}
          </v-chip>
          <v-chip size="small" variant="tonal">
            {{ t('page.sklandEndfield.detail.worldLevel') }} {{ detail.base?.worldLevel ?? '-' }}
          </v-chip>
          <v-chip size="small" variant="tonal">
            {{ t('page.sklandEndfield.detail.charNum') }} {{ detail.base?.charNum ?? '-' }}
          </v-chip>
          <v-chip size="small" variant="tonal">
            {{ t('page.sklandEndfield.detail.weaponNum') }} {{ detail.base?.weaponNum ?? '-' }}
          </v-chip>
        </div>
      </div>
    </div>

    <dl class="info-grid">
      <div class="info-item">
        <dt class="info-label">{{ t('page.sklandEndfield.detail.mission') }}</dt>
        <dd class="info-value">{{ detail.base?.mainMission?.description || '-' }}</dd>
      </div>
      <div class="info-item">
        <dt class="info-label">{{ t('page.sklandEndfield.detail.createTime') }}</dt>
        <dd class="info-value">{{ formatTime(detail.base?.createTime) }}</dd>
      </div>
      <div class="info-item">
        <dt class="info-label">{{ t('page.sklandEndfield.detail.lastLoginTime') }}</dt>
        <dd class="info-value">{{ formatTime(detail.base?.lastLoginTime) }}</dd>
      </div>
      <div class="info-item">
        <dt class="info-label">{{ t('page.sklandEndfield.detail.saveTime') }}</dt>
        <dd class="info-value">{{ formatTime(detail.base?.saveTime) }}</dd>
      </div>
    </dl>

    <!-- 资源与任务进度 -->
    <div class="stat-grid">
      <div v-for="stat in stats" :key="stat.label" class="stat-item">
        <span class="stat-value">{{ stat.value }}</span>
        <span class="stat-label">{{ stat.label }}</span>
      </div>
    </div>

    <!-- 干员列表 -->
    <section v-if="detail.chars?.length" class="section">
      <h3 class="section-title">
        {{ t('page.sklandEndfield.detail.chars') }}（{{ detail.chars.length }}）
      </h3>
      <div class="char-grid">
        <article v-for="(char, index) in detail.chars" :key="index" class="char-card">
          <div class="char-head">
            <span class="char-name">{{ charName(char) }}</span>
            <v-chip
              v-if="rarityText(char)"
              :color="rarityColor(char)"
              size="x-small"
              variant="flat"
            >
              {{ rarityText(char) }}
            </v-chip>
          </div>
          <div class="char-meta">
            <span>Lv.{{ char.level ?? '-' }}</span>
            <span>E{{ char.evolvePhase ?? '-' }}</span>
            <span>P{{ char.potentialLevel ?? '-' }}</span>
          </div>
          <div v-if="char.weapon?.weaponData" class="char-weapon">
            <span>{{ weaponName(char) }} Lv.{{ char.weapon.level ?? '-' }}</span>
            <span v-if="char.weapon.refineLevel !== undefined">
              {{ t('page.sklandEndfield.detail.refine') }}{{ char.weapon.refineLevel }}
            </span>
          </div>
        </article>
      </div>
    </section>

    <!-- 地区建设 -->
    <section v-if="detail.domain?.length" class="section">
      <h3 class="section-title">{{ t('page.sklandEndfield.detail.domains') }}</h3>
      <div class="domain-list">
        <div v-for="(domain, index) in detail.domain" :key="index" class="domain-item">
          <span class="domain-name">{{ domain.name || '-' }}</span>
          <span class="domain-level">Lv.{{ domain.level ?? '-' }}</span>
        </div>
      </div>
    </section>

    <!-- 原始数据 -->
    <v-expansion-panels class="mt-4" variant="accordion">
      <v-expansion-panel>
        <v-expansion-panel-title>
          {{ t('page.sklandEndfield.detail.raw') }}
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <pre class="raw-json">{{ rawJson }}</pre>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </section>
</template>

<script lang="ts" setup>
import type { SklandCardChar, SklandEndfieldCardDetail } from '@/shared/types/skland';
import { dateFormat } from '@/shared/utils/dateUtil';

const props = defineProps<{
  /** 角色卡片详情 */
  detail: SklandEndfieldCardDetail;
}>();

const { t } = useI18n();

/** 玩家昵称 */
const baseName = computed(
  () => props.detail.base?.name || t('page.sklandEndfield.detail.unknownPlayer'),
);

/** 原始 JSON 文本，便于核对接口新增字段 */
const rawJson = computed(() => JSON.stringify(props.detail, null, 2));

/** 资源与任务进度概览 */
const stats = computed(() => [
  {
    label: t('page.sklandEndfield.detail.stamina'),
    value: `${props.detail.dungeon?.curStamina ?? '-'} / ${props.detail.dungeon?.maxStamina ?? '-'}`,
  },
  {
    label: t('page.sklandEndfield.detail.daily'),
    value: `${props.detail.dailyMission?.dailyActivation ?? '-'} / ${props.detail.dailyMission?.maxDailyActivation ?? '-'}`,
  },
  {
    label: t('page.sklandEndfield.detail.weekly'),
    value: `${props.detail.weeklyMission?.score ?? '-'} / ${props.detail.weeklyMission?.total ?? '-'}`,
  },
  {
    label: t('page.sklandEndfield.detail.bp'),
    value: `${props.detail.bpSystem?.curLevel ?? '-'} / ${props.detail.bpSystem?.maxLevel ?? '-'}`,
  },
]);

/**
 * 格式化森空岛时间字段（兼容秒级与毫秒级时间戳字符串）
 * @param value 时间戳字符串或原始时间文本
 * @returns 格式化后的时间文本
 */
function formatTime(value?: string): string {
  if (!value) {
    return '-';
  }
  const num = Number(value);
  if (!Number.isFinite(num)) {
    return value;
  }
  const ms = num < 1_000_000_000_000 ? num * 1000 : num;
  return dateFormat(new Date(ms), 'yyyy/MM/dd HH:mm');
}

/**
 * 解析干员名称（不同版本字段可能不同，逐级兜底）
 * @param char 干员条目
 * @returns 干员名称
 */
function charName(char: SklandCardChar): string {
  const data = char.charData;
  return data?.name || data?.charName || data?.id || t('page.sklandEndfield.detail.unknownChar');
}

/**
 * 解析武器名称
 * @param char 干员条目
 * @returns 武器名称
 */
function weaponName(char: SklandCardChar): string {
  const weapon = char.weapon?.weaponData;
  return (
    weapon?.name ||
    weapon?.weaponName ||
    weapon?.id ||
    t('page.sklandEndfield.detail.unknownWeapon')
  );
}

/**
 * 解析稀有度星级文本
 * @param char 干员条目
 * @returns 形如 `6★` 的文本，无法解析时返回空串
 */
function rarityText(char: SklandCardChar): string {
  const key = char.charData?.rarity?.key ?? '';
  const matched = /rarity_(\d)/.exec(key);
  return matched?.[1] ? `${matched[1]}★` : '';
}

/**
 * 稀有度对应的展示色
 * @param char 干员条目
 * @returns Vuetify 颜色名
 */
function rarityColor(char: SklandCardChar): string {
  const star = rarityText(char).replace('★', '');
  const colorMap: Record<string, string> = {
    '3': 'blue',
    '4': 'purple',
    '5': 'amber',
    '6': 'deep-orange',
  };
  return colorMap[star] ?? 'grey';
}
</script>

<style scoped>
.skland-card {
  margin-bottom: 1.5rem;
  padding: 1.25rem;
  border: 1px solid rgba(var(--v-border-color), 0.16);
  border-radius: 12px;
  background: rgb(var(--v-theme-surface));
}

.profile-head {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.profile-avatar {
  flex-shrink: 0;
  overflow: hidden;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-info {
  min-width: 0;
}

.profile-name {
  margin: 0 0 0.5rem;
  font-size: 1.2rem;
  font-weight: 700;
}

.profile-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem 1.5rem;
  margin: 1rem 0 0;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.info-label {
  color: rgba(var(--v-theme-on-surface), 0.6);
  font-size: 0.8rem;
}

.info-value {
  margin: 0;
  font-size: 0.9rem;
  word-break: break-word;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
  gap: 0.75rem;
  margin-top: 1.25rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  background: rgba(var(--v-border-color), 0.06);
}

.stat-value {
  font-size: 1.1rem;
  font-weight: 700;
}

.stat-label {
  color: rgba(var(--v-theme-on-surface), 0.6);
  font-size: 0.8rem;
}

.section {
  margin-top: 1.5rem;
}

.section-title {
  margin: 0 0 0.75rem;
  font-size: 1rem;
  font-weight: 700;
}

.char-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(11rem, 1fr));
  gap: 0.75rem;
}

.char-card {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 0.75rem;
  border: 1px solid rgba(var(--v-border-color), 0.16);
  border-radius: 10px;
}

.char-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.char-name {
  overflow: hidden;
  font-weight: 600;
  font-size: 0.9rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.char-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  color: rgba(var(--v-theme-on-surface), 0.7);
  font-size: 0.8rem;
}

.char-weapon {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  color: rgba(var(--v-theme-on-surface), 0.6);
  font-size: 0.75rem;
}

.domain-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.domain-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  background: rgba(var(--v-border-color), 0.06);
}

.domain-name {
  font-size: 0.875rem;
}

.domain-level {
  color: rgba(var(--v-theme-on-surface), 0.6);
  font-size: 0.8rem;
}

.raw-json {
  max-height: 24rem;
  margin: 0;
  overflow: auto;
  font-size: 0.75rem;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-all;
}

@media (max-width: 600px) {
  .info-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
