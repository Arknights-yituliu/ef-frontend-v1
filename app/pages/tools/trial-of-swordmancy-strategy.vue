<template>
  <v-container class="px-0 px-sm-4" fluid>
    <header class="page-title mb-4">选剑演武计算器</header>

    <!-- ============ 上半部分：左右分栏 ============ -->
    <v-row>
      <!-- ===== 左栏：输出区 ===== -->
      <v-col cols="12" md="6">
        <v-expansion-panels class="mb-4" :model-value="['output']" multiple>
          <!-- 输出区 -->
          <v-expansion-panel value="output">
            <v-expansion-panel-title>
              <v-icon class="mr-2" color="primary">mdi-chart-line</v-icon>
              输出区
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <!-- 当前状态摘要 -->
              <div class="mb-4">
                <v-row dense>
                  <v-col class="text-caption text-medium-emphasis" cols="6" sm="3">
                    剩余演算 / 放弃 / 翻倍: {{ 输入.剩余演算次数 }} / {{ 输入.剩余放弃次数 }} /
                    {{ 输入.剩余翻倍次数 }}
                  </v-col>
                  <v-col class="text-caption text-medium-emphasis" cols="6" sm="3">
                    翻倍状态: {{ 输入.是否翻倍 ? '已翻倍' : '未翻倍' }}
                  </v-col>
                  <v-col class="text-caption text-medium-emphasis" cols="6" sm="3">
                    当前手牌:
                    {{
                      手牌插槽
                        .filter((s) => s > 0)
                        .map((s) => String(s))
                        .join('、') || '空'
                    }}
                  </v-col>
                  <v-col class="text-caption text-medium-emphasis" cols="6" sm="3">
                    战力点: {{ 当前战力点 }}
                  </v-col>
                </v-row>

                <v-divider class="my-4" />

                <template v-if="输入.剩余演算次数 === 0">
                  <div class="text-body-1 font-weight-bold text-grey">已无演算次数，明天再来吧</div>
                </template>
                <template v-else-if="计算结果.length === 0">
                  <div class="text-body-1 font-weight-bold text-grey">
                    当前状态不可达，请检查输入
                  </div>
                </template>
              </div>
              <div v-if="计算结果.length > 0" class="strategy-card-list">
                <div v-for="(item, i) in 计算结果" :key="i" class="strategy-card-track">
                  <div
                    class="strategy-result-card"
                    :class="{ 'is-best': item.is最优 }"
                    :style="{ '--strategy-card-width': 收益卡片宽度(item) }"
                  >
                    <div class="strategy-card-rank">{{ i + 1 }}</div>
                    <div class="strategy-card-action">
                      <div class="strategy-card-label">
                        {{ item.is最优 ? '当前最优决策' : '备选决策' }}
                      </div>
                      <template v-if="item.决策 === '抽取铭牌'">
                        <v-menu location="bottom">
                          <template #activator="{ props }">
                            <v-btn
                              v-bind="props"
                              class="strategy-decision-button"
                              :class="决策按钮主题类(item.决策)"
                              size="small"
                              variant="flat"
                            >
                              抽取铭牌
                            </v-btn>
                          </template>
                          <v-list density="compact">
                            <!-- 暂时隐藏随机抽牌入口，保留代码方便后续恢复
                            <v-list-item :disabled="!可随机抽牌" @click="执行随机抽牌()">
                              <v-list-item-title>随机抽 1 张</v-list-item-title>
                            </v-list-item>
                            -->
                            <v-list-item
                              v-for="x in 5"
                              :key="x"
                              :disabled="!可抽点数(x)"
                              @click="执行抽指定点数(x)"
                            >
                              <v-list-item-title>{{ dice[x] }} 抽到 {{ x }} 点</v-list-item-title>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                      </template>
                      <template v-else>
                        <v-btn
                          class="strategy-decision-button"
                          :class="决策按钮主题类(item.决策)"
                          size="small"
                          variant="flat"
                          @click="执行决策按钮(item.决策)"
                        >
                          {{ item.决策 }}
                        </v-btn>
                      </template>
                    </div>
                    <div class="strategy-card-metrics">
                      <div class="strategy-metric mobile-hidden">
                        <span>本次演武收益</span>
                        <strong>{{ item.即时奖励.toFixed(0) }}</strong>
                      </div>
                      <div class="strategy-metric mobile-hidden">
                        <span>
                          未来演武收益的期望
                          <v-tooltip location="top" text="选择该决策后，后续演武收益的期望">
                            <template #activator="{ props }">
                              <v-icon v-bind="props" size="x-small">mdi-information-outline</v-icon>
                            </template>
                          </v-tooltip>
                        </span>
                        <strong>{{ 格式化万元(item.期望未来价值) }}</strong>
                      </div>
                      <div class="strategy-metric total">
                        <span>总收益期望</span>
                        <strong>{{ 格式化万元(item.总价值) }}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-expansion-panels class="mb-4">
          <v-expansion-panel value="settings">
            <v-expansion-panel-title>基础设定区</v-expansion-panel-title>
            <v-expansion-panel-text>
              <!-- 铭牌库 -->
              <div class="text-subtitle-2 my-4">初始铭牌库</div>
              <v-row dense>
                <v-col v-for="(_, i) in 手牌插槽" :key="i" cols="4" sm="2">
                  <v-text-field
                    v-model.number="牌库数量元组[i]"
                    density="compact"
                    hide-details
                    :label="`${i + 1} 点数量`"
                    max="20"
                    min="0"
                    type="number"
                    variant="outlined"
                  />
                </v-col>
              </v-row>

              <!-- 演算奖励 -->
              <div class="text-subtitle-2 my-4">演算奖励表</div>
              <v-row dense>
                <v-col v-for="(_, i) in 演算奖励元组" :key="i" cols="6" lg="3" sm="4">
                  <v-text-field
                    v-model.number="演算奖励元组[i]"
                    density="compact"
                    hide-details
                    :label="`战力点 ${i}`"
                    min="0"
                    type="number"
                    variant="outlined"
                  />
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>

      <!-- ===== 右栏：输入区 ===== -->
      <v-col cols="12" md="6">
        <v-expansion-panels class="mb-4" :model-value="['input']" multiple>
          <!-- 输入区 -->
          <v-expansion-panel value="input">
            <v-expansion-panel-title>
              <v-icon class="mr-2" color="primary">mdi-tune</v-icon>
              输入区
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <div class="daily-count-row">
                <span class="daily-count-title">本日剩余</span>
                <label class="daily-count-field">
                  <span>演算</span>
                  <input
                    v-model.number="输入.剩余演算次数"
                    aria-label="剩余演算次数"
                    max="3"
                    min="0"
                    type="number"
                  />
                </label>
                <label class="daily-count-field">
                  <span>放弃</span>
                  <input
                    v-model.number="输入.剩余放弃次数"
                    aria-label="剩余放弃次数"
                    max="3"
                    min="0"
                    type="number"
                  />
                </label>
                <label class="daily-count-field">
                  <span>翻倍</span>
                  <input
                    v-model.number="输入.剩余翻倍次数"
                    aria-label="剩余翻倍次数"
                    max="2"
                    min="0"
                    type="number"
                  />
                </label>
              </div>

              <v-divider class="my-4" />

              <div class="hand-card-grid">
                <ToolsTrialSwordmancyHandCard
                  v-for="(_, i) in 5"
                  :key="i"
                  v-model="手牌插槽[i]!"
                  :index="i"
                  @delete="删除手牌(i)"
                />
              </div>
              <v-row class="hand-action-row mt-2" dense>
                <!-- 暂时隐藏随机抽牌按钮，保留代码方便后续恢复
                <v-col cols="6" sm="4">
                  <v-btn
                    block
                    color="orange-darken-1"
                    :disabled="!可随机抽牌"
                    prepend-icon="mdi-shuffle"
                    variant="tonal"
                    @click="执行随机抽牌"
                  >
                    随机抽 1 张
                  </v-btn>
                </v-col>
                -->
                <v-col v-for="x in 5" :key="x" cols="6" sm="4">
                  <v-btn
                    block
                    color="orange-darken-1"
                    :disabled="!可抽点数(x)"
                    variant="outlined"
                    @click="执行抽指定点数(x)"
                  >
                    {{ dice[x] }} 抽到 {{ x }} 点
                  </v-btn>
                </v-col>
                <v-col cols="6" sm="4">
                  <v-btn
                    block
                    color="secondary"
                    :disabled="!可重置手牌"
                    prepend-icon="mdi-hand-back-right"
                    variant="tonal"
                    @click="执行重置手牌"
                  >
                    重置手牌
                  </v-btn>
                </v-col>
              </v-row>

              <ToolsTrialSwordmancyBattlePointSlider
                class="mt-3"
                :overflow="战力点已溢出"
                :point="当前战力点"
              />
              <div class="remaining-deck text-caption text-medium-emphasis">
                <span>牌库剩余：</span>
                <span v-for="(总数, i) in 牌库数量元组" :key="i" class="remaining-deck-item">
                  <v-icon class="remaining-deck-icon" size="small">{{ diceIcon[i + 1] }}</v-icon>
                  <span>× {{ 总数 - (当前手牌数量元组[i] ?? 0) }}</span>
                </span>
              </div>
              <div class="post-battle-action-row mt-3">
                <v-switch
                  v-model="输入.是否翻倍"
                  class="double-state-switch"
                  color="orange-darken-1"
                  density="compact"
                  :disabled="当前手牌总数 < 2"
                  hide-details
                  inset
                  label="奖励翻倍"
                />
              </div>

              <div class="quick-action-grid mt-3">
                <div class="quick-action-start">
                  <button
                    aria-label="开始演算"
                    class="start-calculation-button"
                    :disabled="!可开始演算"
                    type="button"
                    @click="() => 执行开始演算()"
                  >
                    <span class="start-calculation-mark">
                      <span class="start-calculation-dot" />
                      <span class="start-calculation-number">1</span>
                    </span>
                    <span class="start-calculation-text">开始演算</span>
                  </button>
                </div>
                <div>
                  <button
                    aria-label="放弃"
                    class="abandon-action-button"
                    :disabled="!可放弃"
                    type="button"
                    @click="执行放弃"
                  >
                    <span class="abandon-action-mark">
                      <v-icon class="abandon-action-icon" size="28">mdi-exit-run</v-icon>
                    </span>
                    <span class="abandon-action-content">
                      <span class="abandon-action-text">放弃</span>
                      <span class="abandon-action-code" />
                    </span>
                  </button>
                </div>
                <div>
                  <v-btn
                    block
                    color="grey-darken-1"
                    prepend-icon="mdi-restore"
                    size="large"
                    variant="tonal"
                    @click="执行重置全部"
                  >
                    重置全部
                  </v-btn>
                </div>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-expansion-panels :model-value="['docs']" multiple>
          <v-expansion-panel value="docs">
            <v-expansion-panel-title>
              <v-icon class="mr-2" color="primary">mdi-book-open-variant</v-icon>
              说明
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <h3>📖 基本规则</h3>
              <p>
                在选剑演武中，您需要从牌库中抽取铭牌，凑出特定战力点来获得演算奖励。
                每次演算可以抽取最多 5 张铭牌，并根据最终手牌的战力点获取对应奖励。
              </p>
              <p class="mt-2">
                <strong>战力点</strong> = (1 点铭牌数量 × 1 + 2 点铭牌数量 × 2 + 3 点铭牌数量 × 3 +
                4 点铭牌数量 × 4 + 5 点铭牌数量 × 5) mod 11
              </p>

              <h3>📋 规则假设</h3>
              <ul>
                <li>
                  <strong>等概率抽取假设</strong
                  >：每次抽取铭牌时，抽到某一点数铭牌的概率正比于牌库中该点数铭牌的剩余数量。例如，牌库剩余
                  1 点 × 3、2 点 × 2，则抽到 1 点的概率为 3/5，抽到 2 点的概率为 2/5。
                </li>
              </ul>

              <h3>🎮 操作说明</h3>
              <ul>
                <li>
                  <v-icon class="mr-2" color="secondary" size="small">mdi-hand-back-right</v-icon>
                  <strong>重置手牌</strong> — 清除当前手牌并重置翻倍状态，不消耗任何次数
                </li>
                <li>
                  <v-icon class="mr-2" size="small">mdi-restore</v-icon>
                  <strong>重置全部</strong> — 将所有状态恢复为初始值（3 次演算、3 次放弃、2 次翻倍）
                </li>
                <li>
                  <v-icon class="mr-2" color="warning" size="small">mdi-play</v-icon>
                  <strong>开始演算</strong> —
                  消耗一次演算次数，根据当前手牌获得对应奖励，然后重置手牌。若已翻倍，同时消耗一次翻倍次数
                </li>
                <li>
                  <v-icon class="mr-2" color="error" size="small">mdi-close-circle</v-icon>
                  <strong>放弃</strong> —
                  放弃当前手牌。若还有放弃次数则消耗一次放弃次数并保留演算次数，否则消耗一次演算次数
                </li>
                <li>
                  <v-icon class="mr-2" color="orange-darken-1" size="small">mdi-plus-circle</v-icon>
                  <strong>翻倍</strong> — 将本次演算的奖励 ×2。仅当手牌恰好为 2
                  张、未翻倍且还有翻倍次数时可用
                </li>
                <!-- 暂时隐藏随机抽牌说明，保留代码方便后续恢复
                <li>
                  <v-icon class="mr-2" size="small">mdi-shuffle</v-icon>
                  <strong>随机抽 1 张</strong> — 从牌库中按剩余概率随机抽取一张铭牌加入手牌
                </li>
                -->
                <li>
                  <v-icon class="mr-2" color="orange-darken-1" size="small">mdi-target</v-icon>
                  <strong>抽到 x 点</strong> —
                  从牌库中抽取一张指定点数的铭牌加入手牌。仅当该点数的牌库还有余量时可用
                </li>
              </ul>

              <h3>🧮 算法说明</h3>
              <p>
                本计算器使用<strong>马尔可夫决策过程（MDP）</strong>求解最优策略。 通过反向 BFS
                拓扑排序 +
                动态规划，从所有可能的游戏状态中计算出每个状态下最优决策（最大化期望总奖励）。
              </p>
              <p>
                求解步骤：① 枚举所有合法状态 → ② 构建状态转移图 → ③ 反向拓扑排序 → ④ DP 求解 Bellman
                最优方程
              </p>

              <h3>📊 输出区说明</h3>
              <p>计算完成后，输出区会展示当前状态下的决策分析与收益评估：</p>
              <ul>
                <li><strong>最优决策</strong> — MDP 求解出的当前状态最佳行动方案</li>
                <li>
                  <strong>总收益期望</strong> —
                  按照最优策略，从当前状态开始至结束所能获得的总收益期望
                </li>
                <li><strong>未来演武收益的期望</strong> — 选择某个决策后，后续演武收益的期望</li>
                <li><strong>本次演武收益</strong> — 执行当前决策（如开始演武）本次获得的收益</li>
                <li>
                  <strong>总收益期望</strong> = 本次演武收益 +
                  未来演武收益的期望，表示选择该决策的总收益期望
                </li>
              </ul>
              <p>当剩余演算次数为 0 时，输出区会显示"已无演算次数"提示。</p>

              <h3>⚙️ 翻倍规则</h3>
              <p>当手牌恰好为 2 张时，可以<b>主动选择</b>是否翻倍：</p>
              <ul>
                <li>选择翻倍：本次演算的奖励 ×2，消耗一次翻倍次数</li>
                <li>不选择翻倍：按正常奖励结算，保留翻倍次数</li>
              </ul>
              <p>
                翻倍决定后不可取消。翻倍只在手牌 2 张时可选，若跳过则后续无法再对本次演算翻倍。
                翻倍次数用完后翻倍按钮不可用。
              </p>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>

    <!-- 全局提示 -->
    <v-snackbar v-model="显示消息" location="top" :timeout="2000">
      {{ 消息 }}
    </v-snackbar>
  </v-container>
</template>

<script lang="ts" setup>
import { watchDebounced } from '@vueuse/core';
import {
  type MDPResult,
  求解器类,
  type 状态类,
  状态键,
  计算战力点,
  默认演算奖励元组,
  默认牌库数量元组,
} from '@/shared/utils/trialOfSwordmancy';

definePageMeta({
  layout: 'default',
});

const dice: Record<number, string> = {
  1: '⚀',
  2: '⚁',
  3: '⚂',
  4: '⚃',
  5: '⚄',
  6: '⚅',
} as const;

const diceIcon: Record<number, string> = {
  1: 'mdi-dice-1',
  2: 'mdi-dice-2',
  3: 'mdi-dice-3',
  4: 'mdi-dice-4',
  5: 'mdi-dice-5',
  6: 'mdi-dice-6',
} as const;

// ==================== 响应式状态 ====================

const 牌库数量元组 = ref<number[]>([...默认牌库数量元组]);
const 演算奖励元组 = ref<number[]>([...默认演算奖励元组]);

const 输入 = reactive({
  剩余演算次数: 3,
  剩余放弃次数: 3,
  剩余翻倍次数: 2,
  是否翻倍: false,
});

const 显示消息 = ref(false);
const 消息 = ref('');

// MDP 缓存：基础设定不变时，结果可复用
const 求解器缓存 = ref<求解器类 | null>(null);
const MDP缓存 = ref<MDPResult | null>(null);

interface 策略价值项 {
  决策: string;
  即时奖励: number;
  期望未来价值: number;
  总价值: number;
  is最优: boolean;
}

const 计算结果 = ref<策略价值项[]>([]);

const 最大总收益期望 = computed(() => Math.max(0, ...计算结果.value.map((item) => item.总价值)));

function 收益卡片宽度(item: 策略价值项): string {
  if (最大总收益期望.value <= 0) {
    return '100%';
  }

  const ratio = Math.max(0, item.总价值 / 最大总收益期望.value);
  return `${Math.max(0.16, ratio) * 100}%`;
}

function 格式化万元(value: number): string {
  return `${(value / 10_000).toFixed(2)}万`;
}

function 决策按钮主题类(决策: string): string {
  if (决策 === '抽取铭牌') {
    return 'is-draw';
  }
  if (决策 === '放弃') {
    return 'is-abandon';
  }
  if (决策 === '开始演算' || 决策 === '选择翻倍') {
    return 'is-gold';
  }
  return 'is-default';
}

// ==================== 手牌插槽（5 张牌的点数，0=空位） ====================

const 手牌插槽 = ref<number[]>([0, 0, 0, 0, 0]);

/** 将手牌插槽（点数数组）转换为求解器所需的铭牌数量元组 */
function 插槽转数量(插槽: number[]): number[] {
  const counts = [0, 0, 0, 0, 0];
  for (const slot of 插槽) {
    if (slot >= 1 && slot <= 5) counts[slot - 1]!++;
  }
  return counts;
}

// ==================== 计算属性 ====================

const 当前手牌总数 = computed(() => 手牌插槽.value.filter((s) => s > 0).length);

const 当前手牌数量元组 = computed(() => 插槽转数量(手牌插槽.value));

const 当前手牌点数和 = computed(() =>
  手牌插槽.value.reduce((sum, slot) => sum + Math.max(0, slot), 0),
);

const 当前战力点 = computed(() => 计算战力点(当前手牌数量元组.value));

const 战力点已溢出 = computed(() => 当前手牌点数和.value > 10);

/** 手牌是否为空（全为 0） */
const 手牌为空 = computed(() => 手牌插槽.value.every((s) => s === 0));

// ==================== 按钮禁用逻辑 ====================

/** 重置手牌按钮是否可用（手牌非空或已翻倍） */
const 可重置手牌 = computed(() => !手牌为空.value || 输入.是否翻倍);

/** 开始演算按钮是否可用（有演算次数且手牌非空） */
const 可开始演算 = computed(() => 输入.剩余演算次数 > 0 && !手牌为空.value);

/** 放弃按钮是否可用（有演算次数且手牌非空） */
const 可放弃 = computed(() => 输入.剩余演算次数 > 0 && !手牌为空.value);

/** 翻倍按钮是否可用（手牌2张、未翻倍、有翻倍次数） */
const 可翻倍 = computed(() => 当前手牌总数.value === 2 && !输入.是否翻倍 && 输入.剩余翻倍次数 > 0);

/** 随机抽牌按钮是否可用（手牌未满且牌库还有余量） */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- 随机抽牌入口暂时隐藏，保留逻辑方便恢复
const 可随机抽牌 = computed(() => {
  if (输入.剩余演算次数 <= 0) {
    return false;
  }
  if (当前手牌总数.value >= 5) {
    return false;
  }
  const 牌库剩余总数 = 牌库数量元组.value.reduce(
    (sum, total, i) => sum + (total - (当前手牌数量元组.value[i] ?? 0)),
    0,
  );
  return 牌库剩余总数 > 0;
});

/** 抽指定点数按钮是否可用（手牌未满且该点数牌库还有余量） */
function 可抽点数(点数: number): boolean {
  if (输入.剩余演算次数 <= 0) {
    return false;
  }
  if (当前手牌总数.value >= 5) {
    return false;
  }
  const 该点数已抽数量 = 当前手牌数量元组.value[点数 - 1]!;
  if (该点数已抽数量 >= 牌库数量元组.value[点数 - 1]!) {
    return false;
  }
  return true;
}

// ==================== 预计算 MDP（基础设定变化时触发） ====================

function 重新计算MDP(): void {
  const 求解器 = new 求解器类([...牌库数量元组.value], [...演算奖励元组.value]);
  求解器缓存.value = 求解器;
  MDP缓存.value = 求解器.求解MDP();
  更新计算结果();
}

watchDebounced(
  [牌库数量元组, 演算奖励元组],
  () => {
    重新计算MDP();
  },
  {
    deep: true,
    immediate: true,
    debounce: 300,
  },
);

// ==================== 查表更新结果（输入状态变化时触发） ====================

function 更新计算结果(): void {
  const 求解器 = 求解器缓存.value;
  const result = MDP缓存.value;
  if (!求解器 || !result) {
    计算结果.value = [];
    return;
  }

  const 当前状态: 状态类 = 求解器.获取状态(
    输入.剩余演算次数,
    输入.剩余放弃次数,
    输入.剩余翻倍次数,
    输入.是否翻倍,
    当前手牌数量元组.value,
  );

  const 当前序号 = result.状态索引.get(状态键(当前状态));
  if (当前序号 === undefined) {
    计算结果.value = [];
    return;
  }

  const items: 策略价值项[] = [];
  for (const 决策 of 求解器.状态容许决策(当前状态)) {
    const 即时奖励 = 求解器.行动奖励(当前状态, 决策);
    let 期望未来价值 = 0;
    for (const [目标状态, 概率] of 求解器.状态转移(当前状态, 决策)) {
      const 目标序号 = result.状态索引.get(状态键(目标状态))!;
      期望未来价值 += 概率 * result.价值函数[目标序号]!;
    }
    const 总价值 = 即时奖励 + 期望未来价值;
    items.push({
      决策,
      即时奖励,
      期望未来价值,
      总价值,
      is最优: false,
    });
  }

  items.sort((a, b) => b.总价值 - a.总价值);

  const 抽卡项索引 = items.findIndex((item) => item.决策 === '抽取铭牌');
  const 放弃项索引 = items.findIndex((item) => item.决策 === '放弃');
  const 抽卡项 = items[抽卡项索引];
  const 放弃项 = items[放弃项索引];
  if (抽卡项 && 放弃项 && 抽卡项索引 < 放弃项索引 && Math.abs(抽卡项.总价值 - 放弃项.总价值) < 1) {
    items.splice(放弃项索引, 1);
    items.splice(抽卡项索引, 0, 放弃项);
  }

  if (items[0]) {
    items[0].is最优 = true;
  }

  计算结果.value = items;
}

watch(
  [
    () => 输入.剩余演算次数,
    () => 输入.剩余放弃次数,
    () => 输入.剩余翻倍次数,
    () => 输入.是否翻倍,
    手牌插槽,
  ],
  () => {
    更新计算结果();
  },
  { deep: true },
);

function 执行开始演算(消耗次数: boolean = true): void {
  const 求解器 = 求解器缓存.value;
  const 奖励 = 求解器?.计算演算奖励(当前手牌数量元组.value, 输入.是否翻倍) ?? 0;
  const msg = `演算完成！获得奖励：${奖励}`;

  if (消耗次数) {
    输入.剩余演算次数 = Math.max(0, 输入.剩余演算次数 - 1);
    if (输入.是否翻倍) {
      输入.剩余翻倍次数 = Math.max(0, 输入.剩余翻倍次数 - 1);
    }
  }

  输入.是否翻倍 = false;
  手牌插槽.value = [0, 0, 0, 0, 0];

  消息.value = msg;
  显示消息.value = true;
}

function 执行放弃(): void {
  if (输入.剩余放弃次数 > 0) {
    输入.剩余放弃次数--;
  } else {
    输入.剩余演算次数 = Math.max(0, 输入.剩余演算次数 - 1);
  }
  输入.是否翻倍 = false;
  手牌插槽.value = [0, 0, 0, 0, 0];

  消息.value = `已放弃本局，剩余演算次数：${输入.剩余演算次数}，剩余放弃次数：${输入.剩余放弃次数}`;
  显示消息.value = true;
}

/** 重置手牌（保留剩余次数） */
function 执行重置手牌(): void {
  输入.是否翻倍 = false;
  手牌插槽.value = [0, 0, 0, 0, 0];

  消息.value = '手牌已重置';
  显示消息.value = true;
}

/** 删除指定手牌并让后续手牌前移 */
function 删除手牌(索引: number): void {
  const 剩余手牌 = 手牌插槽.value.filter((point, i) => i !== 索引 && point > 0);
  手牌插槽.value = [...剩余手牌, ...Array.from({ length: 5 - 剩余手牌.length }, () => 0)];
}

/** 重置全部（恢复初始状态） */
function 执行重置全部(): void {
  输入.剩余演算次数 = 3;
  输入.剩余放弃次数 = 3;
  输入.剩余翻倍次数 = 2;
  输入.是否翻倍 = false;
  手牌插槽.value = [0, 0, 0, 0, 0];
  牌库数量元组.value = [...默认牌库数量元组];
  演算奖励元组.value = [...默认演算奖励元组];
  // MDP 缓存会通过 watch 自动重新计算并更新结果

  消息.value = '已重置全部状态';
  显示消息.value = true;
}

/** 抽一张指定点数的牌加入手牌 */
function 执行抽指定点数(点数: number): void {
  if (当前手牌总数.value >= 5) {
    消息.value = '手牌已满！';
    显示消息.value = true;
    return;
  }
  const 已抽数量 = 当前手牌数量元组.value[点数 - 1]!;
  if (已抽数量 >= 牌库数量元组.value[点数 - 1]!) {
    消息.value = `${点数}点的牌库已空！`;
    显示消息.value = true;
    return;
  }
  const 空位 = 手牌插槽.value.indexOf(0);
  if (空位 === -1) {
    消息.value = '手牌已满！';
    显示消息.value = true;
    return;
  }
  手牌插槽.value[空位] = 点数;

  消息.value = `抽到 ${点数} 点，当前战力点：${当前战力点.value}`;
  显示消息.value = true;
}

/** 随机抽一张牌（按剩余牌库概率） */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- 随机抽牌入口暂时隐藏，保留逻辑方便恢复
function 执行随机抽牌(): void {
  if (当前手牌总数.value >= 5) {
    消息.value = '手牌已满！';
    显示消息.value = true;
    return;
  }
  const 剩余数量 = 牌库数量元组.value.map((n, i) => n - 当前手牌数量元组.value[i]!);
  const 总剩余 = 剩余数量.reduce((a, b) => a + b, 0);
  if (总剩余 === 0) {
    消息.value = '牌库已空！';
    显示消息.value = true;
    return;
  }
  let 随机值 = Math.random() * 总剩余;
  for (const [i, count] of 剩余数量.entries()) {
    随机值 -= count;
    if (随机值 < 0) {
      执行抽指定点数(i + 1);
      return;
    }
  }
}

/** 翻倍：将状态设为已翻倍 */
function 执行翻倍(): void {
  输入.是否翻倍 = true;

  消息.value = '已选择翻倍，本次演算奖励将翻倍';
  显示消息.value = true;
}

/** 根据决策文本执行对应操作 */
function 执行决策按钮(决策: string): void {
  switch (决策) {
    case '开始演算': {
      执行开始演算();
      break;
    }
    case '放弃': {
      执行放弃();
      break;
    }
    case '选择翻倍': {
      执行翻倍();
      break;
    }
  }
}
</script>

<style scoped>
* {
  letter-spacing: 0 !important;
}

:deep(.v-expansion-panel-text__wrapper) {
  padding-inline: 0.5rem;
}

@media screen and (min-width: 600px) {
  :deep(.v-expansion-panel-text__wrapper) {
    padding-inline: 1rem;
  }
}

/* ========== 快捷操作 ========== */
.daily-count-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem 0.75rem;
  min-height: 40px;
  padding: 0.45rem 0.6rem;
  color: var(--theme-text-primary);
  background: var(--theme-bg-secondary);
  border: 1px solid var(--theme-border);
  border-radius: 3px;
}

.daily-count-title {
  flex: 0 0 auto;
  font-size: 0.86rem;
  font-weight: 700;
  white-space: nowrap;
}

.daily-count-field {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  min-width: 0;
  font-size: 0.84rem;
  font-weight: 700;
  white-space: nowrap;
}

.daily-count-field input {
  appearance: textfield;
  width: 2.35rem;
  height: 1.8rem;
  padding: 0 0.25rem;
  font: inherit;
  font-weight: 800;
  color: var(--theme-text-primary);
  text-align: center;
  background: var(--theme-bg-primary);
  border: 1px solid var(--theme-border);
  border-radius: 6px;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 1px 2px var(--theme-shadow-base);
}

.daily-count-field input::-webkit-inner-spin-button,
.daily-count-field input::-webkit-outer-spin-button {
  margin: 0;
  appearance: none;
}

.daily-count-field input:focus {
  border-color: rgba(203, 177, 118, 0.95);
  outline: 2px solid rgba(203, 177, 118, 0.25);
  outline-offset: 1px;
}

.quick-action-grid {
  display: grid;
  grid-template-columns: minmax(10.5rem, 1.55fr) repeat(2, minmax(6.2rem, 1fr));
  gap: 0.5rem;
}

.quick-action-grid > * {
  min-width: 0;
}

.start-calculation-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 44px;
  padding: 0.35rem 0.55rem;
  overflow: hidden;
  font: inherit;
  color: rgba(255, 255, 255, 0.98);
  cursor: pointer;
  appearance: none;
  background: linear-gradient(90deg, rgba(194, 170, 112, 0.92), rgba(222, 204, 158, 0.86)), #cbb176;
  border: 0;
  border-radius: 2px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.22);
  transition:
    filter 0.18s ease,
    transform 0.18s ease,
    opacity 0.18s ease;
  isolation: isolate;
}

.start-calculation-button::before {
  position: absolute;
  inset: 0;
  z-index: -1;
  content: '';
  background:
    repeating-linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.12) 0,
      rgba(255, 255, 255, 0.12) 1px,
      transparent 1px,
      transparent 6px
    ),
    linear-gradient(120deg, transparent 0 48%, rgba(255, 255, 255, 0.14) 48% 54%, transparent 54%);
}

.start-calculation-button:hover:not(:disabled) {
  filter: brightness(1.04);
  transform: translateY(-1px);
}

.start-calculation-button:disabled {
  cursor: default;
  filter: grayscale(0.55);
  opacity: 0.58;
}

.start-calculation-button:focus-visible {
  outline: 2px solid rgba(215, 184, 104, 0.82);
  outline-offset: 2px;
}

.start-calculation-mark {
  position: relative;
  display: flex;
  flex: 0 0 2.35rem;
  align-items: center;
  justify-content: center;
  min-width: 0;
  height: 2rem;
}

.start-calculation-mark::before {
  position: absolute;
  inset: 0.28rem 0.36rem;
  content: '';
  border-left: 3px solid rgba(255, 255, 255, 0.94);
  border-bottom: 3px solid rgba(255, 255, 255, 0.94);
  transform: skewX(-16deg);
}

.start-calculation-dot {
  position: absolute;
  top: 0.18rem;
  left: 0.34rem;
  width: 0.38rem;
  height: 0.38rem;
  background: rgba(255, 255, 255, 0.96);
  border-radius: 1px;
}

.start-calculation-number {
  position: relative;
  z-index: 1;
  margin-left: 0.18rem;
  font-size: 2rem;
  font-weight: 900;
  line-height: 1;
  color: rgba(255, 255, 255, 0.96);
}

.start-calculation-text {
  min-width: 0;
  overflow: hidden;
  font-size: 1.28rem;
  font-weight: 900;
  line-height: 1;
  text-align: right;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-shadow: 0 1px 0 rgba(118, 95, 54, 0.2);
}

.abandon-action-button {
  position: relative;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 44px;
  padding: 0.34rem 0.5rem;
  overflow: hidden;
  font: inherit;
  color: rgba(255, 255, 255, 0.96);
  cursor: pointer;
  appearance: none;
  background: linear-gradient(90deg, rgba(87, 33, 34, 0.94), rgba(105, 42, 43, 0.88)), #552526;
  border: 2px solid rgba(255, 42, 44, 0.9);
  border-radius: 0;
  transition:
    filter 0.18s ease,
    transform 0.18s ease,
    opacity 0.18s ease;
  isolation: isolate;
}

.abandon-action-button::before {
  position: absolute;
  inset: 0;
  z-index: -1;
  content: '';
  background:
    repeating-linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.04) 0,
      rgba(255, 255, 255, 0.04) 1px,
      transparent 1px,
      transparent 6px
    ),
    linear-gradient(90deg, rgba(255, 42, 44, 0.08), transparent 42%);
}

.abandon-action-button:hover:not(:disabled) {
  filter: brightness(1.08);
  transform: translateY(-1px);
}

.abandon-action-button:disabled {
  cursor: default;
  filter: grayscale(0.45);
  opacity: 0.58;
}

.abandon-action-button:focus-visible {
  outline: 2px solid rgba(255, 42, 44, 0.82);
  outline-offset: 2px;
}

.abandon-action-mark {
  position: relative;
  display: flex;
  flex: 0 0 2.35rem;
  align-items: center;
  justify-content: center;
  min-width: 0;
  height: 2rem;
  background: rgba(255, 255, 255, 0.08);
}

.abandon-action-mark::before {
  position: absolute;
  inset: 0.18rem 0.34rem;
  content: '';
  border-left: 3px solid rgba(255, 255, 255, 0.94);
  transform: skewX(-10deg);
}

.abandon-action-icon {
  position: relative;
  z-index: 1;
  color: rgba(255, 255, 255, 0.96);
}

.abandon-action-content {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  min-width: 0;
}

.abandon-action-text {
  overflow: hidden;
  font-size: 1.28rem;
  font-weight: 900;
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-shadow: 0 1px 0 rgba(40, 10, 10, 0.34);
}

.abandon-action-code {
  width: 2.8rem;
  height: 0.24rem;
  margin-top: 0.18rem;
  background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.92) 0 0.32rem,
      transparent 0.32rem 0.46rem
    )
    0 0 / 0.46rem 100% repeat-x;
}

.post-battle-action-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.55rem;
}

.double-state-switch {
  flex: 1 1 9rem;
  min-width: 8.5rem;
}

/* ========== 收益卡片列表 ========== */
.strategy-card-list {
  display: grid;
  gap: 0.75rem;
}

.strategy-card-track {
  width: 100%;
  min-width: 0;
}

.strategy-result-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: var(--strategy-card-width);
  min-width: min(100%, 14rem);
  min-height: 86px;
  padding: 0.9rem 1rem;
  overflow: hidden;
  color: rgba(38, 52, 60, 0.92);
  background: linear-gradient(135deg, rgba(239, 247, 250, 0.98), rgba(219, 237, 242, 0.98));
  border: 1px solid rgba(107, 139, 150, 0.28);
  border-radius: 8px;
  box-shadow: 0 10px 24px rgba(50, 85, 94, 0.14);
  transition:
    width 0.28s ease,
    transform 0.18s ease,
    box-shadow 0.18s ease;
}

.strategy-result-card.is-best {
  color: white;
  background: linear-gradient(135deg, #1976d2 0%, #1e88e5 52%, #42a5f5 100%);
  border-color: rgba(255, 255, 255, 0.28);
  box-shadow: 0 14px 28px rgba(var(--v-theme-primary), 0.32);
}

.strategy-result-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 30px rgba(50, 85, 94, 0.18);
}

.strategy-card-rank {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  font-size: 0.95rem;
  font-weight: 900;
  color: rgba(var(--v-theme-primary), 0.92);
  background: rgba(255, 255, 255, 0.72);
  border-radius: 999px;
}

.strategy-result-card.is-best .strategy-card-rank {
  color: #1976d2;
  background: rgba(255, 255, 255, 0.96);
}

.strategy-card-action {
  flex: 1 1 8.5rem;
  min-width: 0;
}

.strategy-card-label {
  margin-bottom: 0.35rem;
  overflow: hidden;
  font-size: 0.74rem;
  font-weight: 700;
  color: rgba(38, 52, 60, 0.56);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.strategy-result-card.is-best .strategy-card-label {
  color: rgba(255, 255, 255, 0.72);
}

.strategy-decision-button {
  --strategy-button-bg: rgba(var(--v-theme-primary), 1);
  --strategy-button-color: #fff;

  max-width: 100%;
  color: var(--strategy-button-color) !important;
  font-weight: 800;
  background: var(--strategy-button-bg) !important;
  border-radius: 3px;
}

.strategy-decision-button.is-draw {
  --strategy-button-bg: #0d5c54;
}

.strategy-decision-button.is-gold {
  --strategy-button-bg: #cbb176;
}

.strategy-decision-button.is-abandon {
  --strategy-button-bg: #552526;
}

.strategy-decision-button.is-default {
  --strategy-button-bg: rgba(var(--v-theme-primary), 1);
}

.strategy-decision-button :deep(.v-btn__overlay) {
  opacity: 0;
}

.strategy-decision-button :deep(.v-btn__underlay) {
  display: none;
}

.strategy-card-metrics {
  display: grid;
  flex: 2 1 17rem;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
  min-width: 0;
}

.strategy-metric {
  min-width: 0;
  padding-left: 0.75rem;
  border-left: 1px solid rgba(107, 139, 150, 0.22);
}

.strategy-result-card.is-best .strategy-metric {
  border-left-color: rgba(255, 255, 255, 0.24);
}

.strategy-metric span {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  min-width: 0;
  margin-bottom: 0.22rem;
  overflow: hidden;
  font-size: 0.72rem;
  font-weight: 700;
  color: rgba(38, 52, 60, 0.54);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.strategy-result-card.is-best .strategy-metric span {
  color: rgba(255, 255, 255, 0.72);
}

.strategy-metric strong {
  display: block;
  overflow: hidden;
  font-size: 1.1rem;
  font-weight: 900;
  line-height: 1.1;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.strategy-metric.total strong {
  font-size: 1.35rem;
}

/* ========== 手牌卡片网格容器 ========== */
.hand-card-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(78px, 1fr));
  gap: 0.65rem;
}

@media (max-width: 700px) {
  .hand-card-grid {
    grid-template-columns: repeat(3, minmax(90px, 1fr));
  }
}

@media (max-width: 420px) {
  .hand-card-grid {
    grid-template-columns: repeat(2, minmax(110px, 1fr));
  }
}

.remaining-deck {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.2rem 0.55rem;
}

.remaining-deck-item {
  display: inline-flex;
  align-items: center;
  gap: 0.12rem;
  white-space: nowrap;
}

.remaining-deck-icon {
  color: rgba(var(--v-theme-primary), 0.9);
}

@media (max-width: 700px) {
  .strategy-result-card {
    min-width: min(100%, 16rem);
    min-height: 72px;
    padding: 0.75rem;
  }

  .strategy-card-action {
    flex-basis: 7.1rem;
  }

  .strategy-card-metrics {
    flex: 1 1 6rem;
    grid-template-columns: 1fr;
    gap: 0;
  }

  .strategy-metric.mobile-hidden {
    display: none;
  }

  .strategy-metric.total {
    padding-left: 0.65rem;
  }

  .strategy-metric.total strong {
    font-size: 1.18rem;
  }

  .quick-action-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .quick-action-start {
    grid-column: 1 / -1;
  }
}

h3 {
  margin-block: 2rem 1rem;
  font-size: 1.25rem;
  font-weight: bold;
}

p {
  margin-block: 1rem;
  font-size: 1rem;
}

ol,
ul {
  padding-left: 1.5rem;
  margin-block: 1rem;
}

ol li,
ul li {
  margin-block: 0.5rem;
  font-size: 1rem;
}

/* ========== 暗色主题适配 ========== */
[data-theme='dark'] .daily-count-field input {
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.04),
    0 1px 2px var(--theme-shadow-base);
}
</style>
