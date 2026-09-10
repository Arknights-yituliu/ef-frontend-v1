<script setup lang="ts">
import { dateFormat } from '#shared/utils/dateUtil';
import { rawVersionReward } from '@/custom/core/gacha/versionReward';

usePageSeo({
  title: '版本奖励表 - 终末地一图流',
  description: '《明日方舟：终末地》各版本奖励一览表，汇总衍质源石、嵌晶玉与寻访凭证等版本资源。',
});

// 本地副本：仅用于本页筛选展示，默认全部置为非选中，避免影响共享的原始奖励数据
const rewards = ref<Reward[]>(rawVersionReward.map((reward) => ({ ...reward, active: false })));

// 筛选按钮数据源：提取所有非空的版本名称
const versions = [...new Set(rawVersionReward.map((reward) => reward.version))].filter(Boolean);

/**
 * 判断某个版本当前是否被选中
 * @param version 版本名称
 * @returns 该版本存在激活状态的奖励时返回 true
 */
function isVersionSelected(version: string): boolean {
  return rewards.value.some((reward) => reward.version === version && reward.active);
}

/**
 * 切换某个版本下所有奖励的选中状态（多选，可反复开关）
 * @param version 版本名称
 */
function toggleVersion(version: string) {
  const targets = rewards.value.filter((reward) => reward.version === version);
  // 该版本未全部选中时则全部选中，否则全部取消
  const nextActive = !targets.every((reward) => reward.active);
  for (const reward of targets) {
    reward.active = nextActive;
  }
}

// 常驻奖励常亮开关（默认开启）
const permanentAlwaysOn = ref(true);

// 常驻奖励判定阈值：结束日期年份大于等于该值即视为常驻
const PERMANENT_REWARD_END_YEAR = 2099;

/**
 * 判断是否为常驻奖励（结束日期年份 >= 2099）
 * @param reward 奖励数据
 * @returns 常驻奖励返回 true
 */
function isPermanentReward(reward: Reward): boolean {
  const end = typeof reward.end === 'string' ? new Date(reward.end) : reward.end;
  return end.getFullYear() >= PERMANENT_REWARD_END_YEAR;
}

/**
 * 判断奖励行是否需要高亮
 * 选中的版本，或开启常亮开关且属于常驻奖励时高亮
 * @param reward 奖励数据
 * @returns 需要高亮返回 true
 */
function isRowActive(reward: Reward): boolean {
  return reward.active || (permanentAlwaysOn.value && isPermanentReward(reward));
}
</script>

<template>
  <div>
    <div class="version-filter">
      <button
        v-for="version in versions"
        :key="version"
        class="version-filter-btn"
        :class="{ 'version-filter-btn--active': isVersionSelected(version) }"
        type="button"
        @click="toggleVersion(version)"
      >
        {{ version }}
      </button>
      <v-switch
        v-model="permanentAlwaysOn"
        class="version-filter-switch"
        color="primary"
        density="compact"
        hide-details
        label="常驻奖励常亮"
      />
    </div>
    <div class="version-reward-table-wrapper">
      <table class="version-reward-table">
        <thead>
          <tr>
            <th class="col-name">奖励名称</th>
            <th>衍质源石</th>
            <th>嵌晶玉</th>
            <th>标准寻访</th>
            <th>特许寻访</th>
            <th>限时寻访</th>
            <th>来源</th>
            <th>版本</th>
            <th class="col-date">开始日期</th>
            <th class="col-date">结束日期</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="reward in rewards"
            :key="reward.id"
            :class="
              isRowActive(reward) ? 'version-reward-row--active' : 'version-reward-row--inactive'
            "
          >
            <td class="col-name">{{ reward.name.zh }}</td>
            <td>{{ reward.content.originiumRecharge }}</td>
            <td>{{ reward.content.diamond }}</td>
            <td>{{ reward.content.ticketgachaStandardSingle }}</td>
            <td>{{ reward.content.ticketgachaSpecialSingle }}</td>
            <td>{{ reward.content.ticketgachaLimitedSingle }}</td>
            <td>{{ reward.module }}</td>
            <td>{{ reward.version }}</td>
            <td class="col-date">{{ dateFormat(reward.start) }}</td>
            <td class="col-date">{{ dateFormat(reward.end) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.version-filter {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  max-width: 1000px;
  margin: 20px auto 12px;
}

.version-filter-switch {
  margin-left: auto;
}

.version-filter-btn {
  padding: 6px 14px;
  border: 1px solid rgba(var(--v-theme-primary), 0.45);
  border-radius: 999px;
  background: transparent;
  color: rgb(var(--v-theme-primary));
  font-size: 14px;
  line-height: 1.2;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease;
}

.version-filter-btn:hover {
  background: rgba(var(--v-theme-primary), 0.12);
}

.version-filter-btn--active {
  border-color: rgb(var(--v-theme-primary));
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(var(--v-theme-primary), 0.35);
}

.version-reward-table-wrapper {
  width: 96%;
  margin: 0 auto 32px;
  overflow: auto;
  border: 1px solid rgba(var(--v-theme-primary), 0.25);
  border-radius: 0;
  background: rgb(var(--v-theme-surface));
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.version-reward-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 14px;

  td,
  th {
    padding: 10px 14px;
    text-align: center;
    white-space: nowrap;
  }

  /* 奖励名称列：限制最大宽度、允许换行、字号缩小 */
  th.col-name,
  td.col-name {
    width: 150px;
    max-width: 150px;
    white-space: normal;
    word-break: break-word;
  }

  td.col-name {
    font-size: 12px;
  }

  /* 开始/结束日期列：字号缩小 */
  td.col-date {
    font-size: 12px;
  }

  thead th {
    background: rgb(var(--v-theme-primary));
    color: rgb(var(--v-theme-on-primary));
    font-weight: 600;
    letter-spacing: 0.3px;
  }

  tbody tr {
    transition: background-color 0.15s ease;
  }

  /* 斑马纹：偶数行浅色底 */
  tbody tr:nth-child(even) {
    background: rgba(var(--v-theme-primary), 0.05);
  }

  /* 悬停高亮 */
  tbody tr:hover {
    background: rgba(var(--v-theme-primary), 0.12);
  }

  /* 行分隔线（避免最后一行出现多余边框） */
  tbody tr + tr td {
    border-top: 1px solid rgba(var(--v-theme-primary), 0.12);
  }

  /* 选中的版本行：文字加粗 */
  .version-reward-row--active {
    font-weight: bold;
  }

  /* 未选中的版本行：淡色显示但仍保留 */
  .version-reward-row--inactive {
    opacity: 0.35;
  }
}
</style>
