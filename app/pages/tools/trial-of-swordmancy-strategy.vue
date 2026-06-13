<template>
  <v-container class="page-container" fluid>
    <header class="page-title mb-4">选剑演武计算器</header>

    <!-- ============ 上半部分：左右分栏 ============ -->
    <v-row>
      <!-- ===== 左栏：输出区 ===== -->
      <v-col cols="12" md="6">
        <v-expansion-panels class="mb-4" :model-value="['output']" multiple>
          <!-- 输出区 -->
          <v-expansion-panel value="output">
            <v-expansion-panel-title>输出区</v-expansion-panel-title>
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

                <template v-if="输入.剩余演算次数 > 0 && 计算结果.length > 0">
                  <v-card
                    class="best-decision-hero mt-1"
                    color="primary"
                    rounded="lg"
                    theme="dark"
                    variant="elevated"
                  >
                    <v-card-text class="pa-4">
                      <v-row align="center" no-gutters>
                        <v-col class="text-center" cols="12" md="7">
                          <div class="mb-2">当前最优决策</div>
                          <div class="best-decision-name text-white">♔ {{ 最优决策名称 }}</div>
                        </v-col>
                        <v-col class="text-center" cols="12" md="5">
                          <v-divider class="d-md-none my-2" />
                          <div class="mb-2">最优价值</div>
                          <div class="best-decision-value text-white">
                            {{ 初始价值.toFixed(2) }}
                          </div>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </template>
                <template v-else-if="输入.剩余演算次数 === 0">
                  <div class="text-body-1 font-weight-bold text-grey">已无演算次数，明天再来吧</div>
                </template>
                <template v-else>
                  <div class="text-body-1 font-weight-bold text-grey">
                    当前状态不可达，请检查输入
                  </div>
                </template>
              </div>
              <v-table v-if="计算结果.length > 0" density="compact" hover>
                <thead>
                  <tr>
                    <th class="text-left">#</th>
                    <th class="text-left">决策</th>
                    <th class="text-right">即时奖励</th>
                    <th class="text-right">
                      期望未来价值
                      <v-tooltip location="top" text="按照最优策略，今天还能获得的调度券数量的期望">
                        <template #activator="{ props }">
                          <v-icon v-bind="props" size="small">mdi-information-outline</v-icon>
                        </template>
                      </v-tooltip>
                    </th>
                    <th class="text-right">总价值</th>
                    <th class="text-center">最优</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, i) in 计算结果"
                    :key="i"
                    :class="{ 'bg-primary-lighten-5': item.is最优 }"
                  >
                    <td>{{ i + 1 }}</td>
                    <td>
                      <template v-if="item.决策 === '抽取铭牌'">
                        <v-menu location="bottom">
                          <template #activator="{ props }">
                            <v-btn
                              v-bind="props"
                              :color="item.is最优 ? 'primary' : 'secondary'"
                              size="small"
                              variant="flat"
                            >
                              抽取铭牌
                            </v-btn>
                          </template>
                          <v-list density="compact">
                            <v-list-item :disabled="!可随机抽牌" @click="执行随机抽牌()">
                              <v-list-item-title>随机抽 1 张</v-list-item-title>
                            </v-list-item>
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
                          :color="item.is最优 ? 'primary' : 'secondary'"
                          size="small"
                          variant="flat"
                          @click="执行决策按钮(item.决策)"
                        >
                          {{ item.决策 }}
                        </v-btn>
                      </template>
                    </td>
                    <td class="text-right">{{ item.即时奖励.toFixed(0) }}</td>
                    <td class="text-right">{{ item.期望未来价值.toFixed(2) }}</td>
                    <td class="text-right font-weight-bold">{{ item.总价值.toFixed(2) }}</td>
                    <td class="text-center">
                      <v-icon v-if="item.is最优" color="primary">mdi-star</v-icon>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>

      <!-- ===== 右栏：游戏风格输入区 ===== -->
      <v-col cols="12" md="6">
        <!-- 可折叠的基础设定 -->
        <v-expansion-panels class="mb-4">
          <v-expansion-panel>
            <v-expansion-panel-title>
              <v-icon class="mr-2" size="small">mdi-cog</v-icon>
              基础设定
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <!-- 铭牌库 -->
              <div class="text-subtitle-2 my-4">初始铭牌库</div>
              <v-row dense>
                <v-col v-for="(_, i) in 手牌插槽" :key="i" cols="4" sm="2">
                  <v-text-field
                    v-model.number="牌库数量元组[i]"
                    density="compact"
                    hide-details
                    :label="`${i + 1} 点`"
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

              <v-btn
                block
                class="mt-4"
                color="grey-darken-1"
                prepend-icon="mdi-restore"
                size="small"
                variant="tonal"
                @click="执行重置全部"
              >
                重置全部
              </v-btn>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <!-- 游戏风格主面板 -->
        <div class="game-panel">
          <!-- ===== 顶部：剩余次数（可编辑） ===== -->
          <div class="game-top-bar">
            <div class="game-top-item">
              <span class="game-top-label">本日剩余</span>
            </div>
            <div class="game-top-divider" />
            <div class="game-top-item">
              <label class="game-top-label">演算</label>
              <input
                v-model.number="输入.剩余演算次数"
                class="game-top-input"
                max="3"
                min="0"
                type="number"
              />
            </div>
            <div class="game-top-item">
              <label class="game-top-label">放弃</label>
              <input
                v-model.number="输入.剩余放弃次数"
                class="game-top-input"
                max="3"
                min="0"
                type="number"
              />
            </div>
            <div class="game-top-item">
              <label class="game-top-label">翻倍</label>
              <input
                v-model.number="输入.剩余翻倍次数"
                class="game-top-input"
                max="2"
                min="0"
                type="number"
              />
            </div>
          </div>

          <!-- ===== 中间区域：手牌卡片 + 牌库剩余 ===== -->
          <v-row class="game-main" dense>
            <!-- 左侧 5 张手牌卡片（点击弹出菜单选择点数） -->
            <v-col class="hand-cards-area" cols="12" md="9">
              <v-menu v-for="(点, i) in 手牌插槽" :key="i" location="bottom">
                <template #activator="{ props }">
                  <div
                    v-bind="props"
                    class="hand-card fill-height"
                    :class="点 > 0 ? 'card-filled' : 'card-empty'"
                    style="cursor: pointer"
                  >
                    <template v-if="点 > 0">
                      <div class="card-dice">{{ dice[点] }}</div>
                      <div class="card-points">{{ 点 }} 点</div>
                    </template>
                    <template v-else>
                      <div class="card-placeholder">發</div>
                    </template>
                  </div>
                </template>
                <v-list density="compact">
                  <v-list-item :disabled="手牌插槽[i] === 0" @click="手牌插槽[i] = 0">
                    <v-list-item-title>— 清除</v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    v-for="x in 5"
                    :key="x"
                    :disabled="手牌插槽[i] === x"
                    @click="手牌插槽[i] = x"
                  >
                    <v-list-item-title>{{ dice[x] }} {{ x }} 点</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>

            <!-- 右侧牌库剩余 -->
            <v-col class="deck-sidebar" cols="12" md="3">
              <div class="deck-title">铭牌库剩余</div>
              <div
                v-for="(总数, i) in 牌库数量元组"
                :key="i"
                class="deck-row"
                :class="{ 'deck-row-empty': 总数 - (当前手牌数量元组[i] ?? 0) === 0 }"
              >
                <span class="deck-icon">{{ dice[i + 1] }}</span>
                <span class="deck-count">{{ 总数 - (当前手牌数量元组[i] ?? 0) }}</span>
              </div>
              <v-menu location="bottom">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    class="mt-2"
                    :disabled="!可随机抽牌 && 牌库还有余量"
                    variant="tonal"
                  >
                    抽取铭牌
                  </v-btn>
                </template>
                <v-list density="compact">
                  <v-list-item :disabled="!可随机抽牌" @click="执行随机抽牌">
                    <v-list-item-title>随机抽 1 张</v-list-item-title>
                  </v-list-item>
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
            </v-col>
          </v-row>

          <v-divider />

          <!-- ===== 底部战力点 / 奖励进度条 ===== -->
          <div class="game-reward-bar">
            <div
              v-for="p in 11"
              :key="p - 1"
              class="reward-cell"
              :class="{
                'reward-active': 当前战力点 === p - 1,
              }"
            >
              <div class="reward-point">{{ p - 1 }}</div>
              <div class="reward-value">{{ 演算奖励元组[p - 1]! * (输入.是否翻倍 ? 2 : 1) }}</div>
            </div>
          </div>

          <v-divider />

          <!-- ===== 翻倍状态 ===== -->
          <div class="game-double-bar">
            <span class="double-remaining">（剩余 {{ 输入.剩余翻倍次数 }} 次）</span
            >奖励翻倍<v-tooltip location="top">
              <template #activator="{ props }">
                <v-icon v-bind="props" size="small">mdi-help-circle-outline</v-icon>
              </template>
              <div>
                虽然只抽了 1 张铭牌时也可以选择翻倍，但是在最优策略下，一定至少抽 2
                张铭牌才会开始演算。
              </div>
              <div>为了性能考虑，计算器中要求抽至少 2 张铭牌时才能选择是否翻倍。</div>
            </v-tooltip>
            <v-switch
              v-model="输入.是否翻倍"
              class="mx-3"
              color="primary"
              density="compact"
              :disabled="当前手牌总数 < 2 || 输入.剩余翻倍次数 <= 0"
              hide-details
              inset
            />
          </div>

          <!-- ===== 底部操作按钮 ===== -->
          <div class="game-actions">
            <v-row dense>
              <v-col cols="6" md="3">
                <v-btn
                  block
                  color="red"
                  :disabled="!可放弃"
                  prepend-icon="mdi-close-circle-outline"
                  size="large"
                  variant="flat"
                  @click="执行放弃"
                >
                  放弃（剩余 {{ 输入.剩余放弃次数 }} 次）
                </v-btn>
              </v-col>
              <v-col cols="6" md="3">
                <v-btn
                  block
                  color="green"
                  :disabled="!可开始演算"
                  prepend-icon="mdi-play-circle-outline"
                  size="large"
                  variant="flat"
                  @click="执行开始演算"
                >
                  开始演算（剩余 {{ 输入.剩余演算次数 }} 次）
                </v-btn>
              </v-col>
              <v-col cols="6" md="3">
                <v-btn
                  block
                  color="secondary"
                  :disabled="!可重置手牌"
                  prepend-icon="mdi-hand-back-right"
                  size="large"
                  variant="tonal"
                  @click="执行重置手牌"
                >
                  重置手牌
                </v-btn>
              </v-col>
              <v-col cols="6" md="3">
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
              </v-col>
            </v-row>
          </div>
        </div>
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
                <li>
                  <v-icon class="mr-2" size="small">mdi-shuffle</v-icon>
                  <strong>随机抽 1 张</strong> — 从牌库中按剩余概率随机抽取一张铭牌加入手牌
                </li>
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
              <p>计算完成后，输出区会展示当前状态下的决策分析与价值评估：</p>
              <ul>
                <li><strong>最优决策</strong> — MDP 求解出的当前状态最佳行动方案</li>
                <li>
                  <strong>最优价值</strong> — 按照最优策略，从当前状态开始至结束所能获得的期望总奖励
                </li>
                <li>
                  <strong>期望未来价值</strong> — 选择某个决策后，未来一切演算所能获得的总奖励期望值
                </li>
                <li><strong>即时奖励</strong> — 执行当前决策（如开始演算）立即获得的奖励</li>
                <li>
                  <strong>总价值</strong> = 即时奖励 + 期望未来价值，表示选择该决策的期望总收益
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
const 初始价值 = ref(0);

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

const 当前战力点 = computed(() => 计算战力点(当前手牌数量元组.value));

/** 手牌是否为空（全为 0） */
const 手牌为空 = computed(() => 手牌插槽.value.every((s) => s === 0));

// ==================== 按钮禁用逻辑 ====================

/** 重置手牌按钮是否可用（手牌非空或已翻倍） */
const 可重置手牌 = computed(() => !手牌为空.value || 输入.是否翻倍);

/** 开始演算按钮是否可用（有演算次数且手牌非空） */
const 可开始演算 = computed(() => 输入.剩余演算次数 > 0 && !手牌为空.value);

/** 放弃按钮是否可用（有演算次数且手牌非空） */
const 可放弃 = computed(() => 输入.剩余演算次数 > 0 && !手牌为空.value);

/** 随机抽牌按钮是否可用（手牌未满且牌库还有余量） */
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

/** 最优决策名称 */
const 最优决策名称 = computed(() => 计算结果.value.find((item) => item.is最优)?.决策 ?? '-');

/** 牌库是否还有余量 */
const 牌库还有余量 = computed(() => {
  const 剩余总数 = 牌库数量元组.value.reduce(
    (sum, total, i) => sum + Math.max(0, total - (当前手牌数量元组.value[i] ?? 0)),
    0,
  );
  return 剩余总数 > 0;
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
    初始价值.value = 0;
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
    初始价值.value = 0;
    return;
  }

  const 最优决策 = result.最优策略[当前序号]!;

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
      is最优: 决策 === 最优决策,
    });
  }

  items.sort((a, b) => b.总价值 - a.总价值);

  计算结果.value = items;
  初始价值.value = result.价值函数[当前序号]!;
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

/** 执行当前最优决策 */
function 执行最优决策(): void {
  const 最优 = 计算结果.value.find((item) => item.is最优);
  if (!最优) return;
  执行决策按钮(最优.决策);
}
</script>

<style scoped>
* {
  letter-spacing: 0 !important;
}

/* ========== 最优决策英雄板块 ========== */
.best-decision-hero {
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 24px rgba(var(--v-theme-primary), 0.35);
  animation: heroPulse 2s ease-in-out infinite;
}

.best-decision-name {
  font-size: 1.75rem;
  font-weight: 800;
  line-height: 1.2;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}

.best-decision-value {
  font-size: 2rem;
  font-weight: 800;
  line-height: 1.2;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}

.best-decision-hero .v-icon {
  color: inherit !important;
}

@keyframes heroPulse {
  0%,
  100% {
    box-shadow: 0 4px 24px rgba(var(--v-theme-primary), 0.35);
  }
  50% {
    box-shadow: 0 4px 40px rgba(var(--v-theme-primary), 0.55);
  }
}

/* ========== 游戏风格面板 ========== */
.game-panel {
  background-color: rgb(var(--v-theme-surface));
  border-radius: 0.5rem;
  border: 1px solid rgba(var(--v-border-color), 0.3);
  overflow: hidden;
}

/* ---- 顶部次数条 ---- */
.game-top-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(var(--v-theme-primary), 0.08);
  border-bottom: 1px solid rgba(var(--v-border-color), 0.15);
  overflow-x: auto;
}

.game-top-item {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.game-top-label {
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface), 0.6);
  white-space: nowrap;
}

.game-top-input {
  width: 3rem;
  padding: 0.2rem 0.1rem;
  border: 1px solid rgba(var(--v-border-color), 0.35);
  border-radius: 6px;
  background: rgb(var(--v-theme-surface));
  font-weight: 700;
  text-align: center;
  outline: none;
  transition: border-color 0.15s ease;
}

.game-top-input:focus {
  border-color: rgb(var(--v-theme-primary));
  box-shadow: 0 0 0 1px rgba(var(--v-theme-primary), 0.3);
}

.game-top-divider {
  width: 1px;
  height: 1.5rem;
  background: rgba(var(--v-border-color), 0.2);
  margin: 0 0.25rem;
}

/* ---- 中间：手牌 + 牌库 ---- */
.game-main {
  display: flex;
  padding: 0.75rem;
}

/* 手牌卡片区域 */
.hand-cards-area {
  display: flex;
  gap: 0.5rem;
}

.hand-card {
  flex: 1;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(var(--v-border-color), 0.25);
  transition: all 0.2s ease;
  min-height: 80px;
}

.card-filled {
  background: linear-gradient(
    145deg,
    rgba(var(--v-theme-primary), 0.12),
    rgba(var(--v-theme-primary), 0.06)
  );
  border-color: rgba(var(--v-theme-primary), 0.35);
}

.card-empty {
  background: rgba(var(--v-theme-surface-variant), 0.3);
  border-style: dashed;
}

.card-dice {
  font-size: 2rem;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.card-points {
  font-weight: 700;
  color: rgb(var(--v-theme-on-surface), 0.8);
}

.card-placeholder {
  font-size: 1.75rem;
  font-weight: 800;
  color: rgba(var(--v-theme-on-surface), 0.15);
  line-height: 1;
}

/* ---- 右侧牌库侧栏 ---- */
.deck-sidebar {
  min-width: 100px;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding-left: 0.75rem;
  border-left: 1px solid rgba(var(--v-border-color), 0.15);
}

.deck-title {
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface), 0.5);
  text-transform: uppercase;
  margin-bottom: 0.25rem;
}

.deck-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.2rem 0;
}

.deck-row-empty {
  opacity: 0.35;
}

.deck-icon {
  font-size: 1.5rem;
  line-height: 0;
  width: 1.2rem;
  text-align: center;
}

.deck-count {
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

/* ---- 底部战力点 / 奖励进度条 ---- */
.game-reward-bar {
  display: flex;
  overflow-x: auto;
  padding: 0.5rem 0.25rem;
  gap: 0;
  background: rgba(var(--v-theme-surface-variant), 0.15);
}

.reward-cell {
  flex: 1 0 0;
  min-width: 3.6rem;
  text-align: center;
  padding: 0.25rem 0.2rem;
  border-right: 1px solid rgba(var(--v-border-color), 0.1);
  transition: background 0.15s ease;
}

.reward-cell:last-child {
  border-right: none;
}

.reward-cell.reward-active {
  background: rgba(var(--v-theme-primary), 0.2);
  border-radius: 4px;
}

.reward-point {
  font-weight: 700;
  color: rgb(var(--v-theme-on-surface), 0.7);
}

.reward-value {
  font-size: 0.8rem;
  color: rgb(var(--v-theme-on-surface), 0.5);
  white-space: nowrap;
}

/* ---- 翻倍状态 ---- */
.game-double-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
}

.double-remaining {
  color: rgb(var(--v-theme-on-surface), 0.5);
}

/* ---- 底部操作按钮 ---- */
.game-actions {
  padding: 0.5rem;
  background: rgba(var(--v-theme-surface-variant), 0.1);
}

.game-action {
  flex: 1;
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
</style>
