<template>
  <v-container class="page-container" fluid>
    <header class="page-title mb-4">选剑演武计算器</header>

    <!-- ============ 上半部分：左右分栏 ============ -->
    <v-row>
      <!-- ===== 左栏：基础设定 + 输入区 ===== -->
      <v-col cols="12" md="6">
        <!-- 基础设定 -->
        <v-expansion-panels class="mb-4" :model-value="['input']" multiple>
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

          <!-- 输入区 -->
          <v-expansion-panel value="input">
            <v-expansion-panel-title>当前状态输入区</v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-row dense>
                <v-col cols="4">
                  <v-text-field
                    v-model.number="输入.剩余演算次数"
                    density="compact"
                    hide-details
                    label="剩余演算次数"
                    max="3"
                    min="0"
                    type="number"
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    v-model.number="输入.剩余放弃次数"
                    density="compact"
                    hide-details
                    label="剩余放弃次数"
                    max="3"
                    min="0"
                    type="number"
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    v-model.number="输入.剩余翻倍次数"
                    density="compact"
                    hide-details
                    label="剩余翻倍次数"
                    max="2"
                    min="0"
                    type="number"
                    variant="outlined"
                  />
                </v-col>
              </v-row>

              <v-divider class="my-3" />

              <div class="text-subtitle-2 mb-2">当前手牌（每张牌的点数，0=空位）</div>
              <v-row dense>
                <v-col v-for="(_, i) in 手牌插槽" :key="i" cols="4" sm="2">
                  <v-text-field
                    v-model.number="手牌插槽[i]"
                    density="compact"
                    hide-details
                    max="5"
                    min="0"
                    type="number"
                    variant="outlined"
                  />
                </v-col>
              </v-row>

              <div class="mt-2 text-caption text-medium-emphasis">
                手牌总数：{{ 当前手牌总数 }} / 5 &nbsp;|&nbsp; 当前战力点：{{ 当前战力点 }}
              </div>

              <v-divider class="my-3" />

              <div class="mt-2">
                <div class="text-body-2 mb-1">翻倍状态</div>
                <v-radio-group
                  v-model="输入.是否翻倍"
                  density="compact"
                  :disabled="当前手牌总数 < 2"
                  hide-details
                  inline
                >
                  <v-radio :label="'未翻倍'" :value="false" />
                  <v-radio :label="'已翻倍'" :value="true" />
                </v-radio-group>
                <div v-if="当前手牌总数 < 2" class="text-caption text-grey mt-1">
                  请在抽了至少 2 张铭牌后再选择是否翻倍
                </div>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>

      <!-- ===== 右栏：操作区 + 输出区 ===== -->
      <v-col cols="12" md="6">
        <v-expansion-panels class="mb-4" :model-value="['operation', 'output']" multiple>
          <!-- 操作区 -->
          <v-expansion-panel value="operation">
            <v-expansion-panel-title>操作区</v-expansion-panel-title>
            <v-expansion-panel-text>
              <!-- 第一部分 -->
              <div class="text-subtitle-2 mb-2">基本操作</div>
              <v-row class="mb-4" dense>
                <v-col cols="6" sm="4">
                  <v-btn
                    block
                    color="primary"
                    :disabled="计算中"
                    :loading="计算中"
                    size="large"
                    variant="flat"
                    @click="重新计算MDP"
                  >
                    <v-icon start>mdi-calculator</v-icon>
                    {{ 计算中 ? '计算中...' : '重新计算' }}
                  </v-btn>
                </v-col>
                <v-col cols="6" sm="4">
                  <v-btn
                    block
                    color="secondary"
                    :disabled="!可重置手牌"
                    size="large"
                    variant="tonal"
                    @click="执行重置手牌"
                  >
                    <v-icon start>mdi-hand-back-right</v-icon>
                    重置手牌
                  </v-btn>
                </v-col>
                <v-col cols="6" sm="4">
                  <v-btn
                    block
                    color="grey-darken-1"
                    size="large"
                    variant="tonal"
                    @click="执行重置全部"
                  >
                    <v-icon start>mdi-restore</v-icon>
                    重置全部
                  </v-btn>
                </v-col>
              </v-row>

              <v-divider class="my-3" />

              <!-- 第二部分 -->
              <div class="text-subtitle-2 mb-2">演算操控</div>
              <v-row class="mb-3" dense>
                <v-col cols="6" sm="4">
                  <v-btn
                    block
                    color="warning"
                    :disabled="!可开始演算"
                    size="large"
                    variant="tonal"
                    @click="执行开始演算"
                  >
                    <v-icon start>mdi-play</v-icon>
                    开始演算
                  </v-btn>
                </v-col>
                <v-col cols="6" sm="4">
                  <v-btn
                    block
                    color="error"
                    :disabled="!可放弃"
                    size="large"
                    variant="tonal"
                    @click="执行放弃"
                  >
                    <v-icon start>mdi-close-circle</v-icon>
                    放弃
                  </v-btn>
                </v-col>
                <v-col cols="6" sm="4">
                  <v-btn
                    block
                    color="orange-darken-1"
                    :disabled="!可翻倍"
                    size="large"
                    variant="tonal"
                    @click="执行翻倍"
                  >
                    <v-icon start>mdi-plus-circle</v-icon>
                    翻倍
                  </v-btn>
                </v-col>
              </v-row>

              <v-row dense>
                <v-col cols="6" sm="2">
                  <v-btn
                    block
                    color="orange-darken-1"
                    :disabled="当前手牌总数 >= 5"
                    variant="tonal"
                    @click="执行随机抽牌"
                  >
                    <v-icon start>mdi-shuffle</v-icon>
                    随机抽 1 张
                  </v-btn>
                </v-col>
                <v-col v-for="x in 5" :key="x" cols="6" sm="2">
                  <v-btn
                    block
                    color="orange-darken-1"
                    :disabled="!可抽点数(x)"
                    variant="outlined"
                    @click="执行抽指定点数(x)"
                  >
                    抽到 {{ x }} 点
                  </v-btn>
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <!-- 输出区 -->
          <v-expansion-panel value="output">
            <v-expansion-panel-title>输出区</v-expansion-panel-title>
            <v-expansion-panel-text>
              <!-- 当前状态摘要 -->
              <v-card class="mb-4" variant="outlined">
                <v-card-text class="pa-3">
                  <v-row dense>
                    <v-col class="text-caption text-medium-emphasis" cols="6" sm="3">
                      剩余演算/放弃/翻倍: {{ 输入.剩余演算次数 }} / {{ 输入.剩余放弃次数 }} /
                      {{ 输入.剩余翻倍次数 }}
                    </v-col>
                    <v-col class="text-caption text-medium-emphasis" cols="6" sm="3">
                      翻倍状态: {{ 输入.是否翻倍 ? '已翻倍' : '未翻倍' }}
                    </v-col>
                    <v-col class="text-caption text-medium-emphasis" cols="6" sm="3">
                      当前手牌:
                      {{
                        当前手牌数量元组
                          .map((c, i) => `${i + 1}点×${c}`)
                          .filter((s) => !s.endsWith('×0'))
                          .join('、') || '空'
                      }}
                    </v-col>
                    <v-col class="text-caption text-medium-emphasis" cols="6" sm="3">
                      战力点: {{ 当前战力点 }}
                    </v-col>
                  </v-row>
                  <v-divider class="my-2" />
                  <template v-if="输入.剩余演算次数 > 0">
                    <div class="d-flex align-center ga-4">
                      <div>
                        <span class="text-caption text-medium-emphasis">最优决策：</span>
                        <v-chip color="primary" size="small" variant="flat">
                          {{ 计算结果.find((item) => item.is最优)?.决策 ?? '-' }}
                        </v-chip>
                      </div>
                      <div>
                        <span class="text-caption text-medium-emphasis">最优价值：</span>
                        <span class="text-body-1 font-weight-bold text-primary">{{
                          初始价值.toFixed(2)
                        }}</span>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="text-body-1 font-weight-bold text-grey">已无演算次数</div>
                  </template>
                </v-card-text>
              </v-card>
              <v-table v-if="输入.剩余演算次数 > 0" density="compact" hover>
                <thead>
                  <tr>
                    <th class="text-left">#</th>
                    <th class="text-left">决策</th>
                    <th class="text-right">即时奖励</th>
                    <th class="text-right">期望未来价值</th>
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
                      <v-chip
                        :color="item.is最优 ? 'primary' : 'default'"
                        size="small"
                        variant="flat"
                      >
                        {{ item.决策 }}
                      </v-chip>
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
    </v-row>

    <!-- ============ 下半部分：文档区 ============ -->
    <v-row class="mt-6">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2" color="primary">mdi-book-open-variant</v-icon>
            玩法说明
          </v-card-title>
          <v-card-text class="text-body-2">
            <section class="mb-4">
              <h3 class="text-subtitle-1 font-weight-bold mb-2">📖 基本规则</h3>
              <p>
                在选剑演武中，您需要从牌库中抽取铭牌，凑出特定战力点来获得演算奖励。
                每次演算可以抽取最多 5 张铭牌，并根据最终手牌的战力点获取对应奖励。
              </p>
              <v-table class="mt-2" density="compact">
                <thead>
                  <tr>
                    <th>铭牌</th>
                    <th>点数</th>
                    <th>初始数量</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(n, i) in 牌库数量元组" :key="i">
                    <td>铭牌{{ i }}</td>
                    <td>{{ i + 1 }}</td>
                    <td>{{ n }}</td>
                  </tr>
                </tbody>
              </v-table>
              <p class="mt-2">
                <strong>战力点</strong> = (1×铭牌0数量 + 2×铭牌1数量 + 3×铭牌2数量 + 4×铭牌3数量 +
                5×铭牌4数量) mod 11
              </p>
            </section>

            <section class="mb-4">
              <h3 class="text-subtitle-1 font-weight-bold mb-2">🎮 操作说明</h3>
              <v-list density="compact" lines="one">
                <v-list-item>
                  <template #prepend><v-icon color="primary">mdi-calculator</v-icon></template>
                  <v-list-item-title>
                    <strong>开始计算</strong> — 运行 MDP
                    求解器，计算当前设定下所有状态的最优策略和价值
                  </v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <template #prepend><v-icon color="warning">mdi-play</v-icon></template>
                  <v-list-item-title>
                    <strong>开始演算</strong> —
                    消耗一次演算次数，根据当前手牌获得对应奖励，然后重置手牌
                  </v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <template #prepend><v-icon color="error">mdi-close-circle</v-icon></template>
                  <v-list-item-title>
                    <strong>放弃</strong> —
                    放弃当前手牌。若还有放弃次数则消耗一次放弃次数并保留演算次数，否则消耗一次演算次数
                  </v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <template #prepend><v-icon color="success">mdi-check-circle</v-icon></template>
                  <v-list-item-title>
                    <strong>结算（不消耗次数）</strong> — 查看当前手牌对应的奖励但不实际消耗演算次数
                  </v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <template #prepend><v-icon>mdi-cards-outline</v-icon></template>
                  <v-list-item-title>
                    <strong>抽一张</strong> — 从牌库中随机抽取一张铭牌加入手牌
                  </v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <template #prepend><v-icon color="orange-darken-1">mdi-target</v-icon></template>
                  <v-list-item-title>
                    <strong>抽到战力点 X</strong> — 模拟连续抽牌直到战力点达到目标值（或手牌满 5
                    张）
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </section>

            <section class="mb-4">
              <h3 class="text-subtitle-1 font-weight-bold mb-2">🧮 算法说明</h3>
              <p>
                本计算器使用<strong>马尔可夫决策过程（MDP）</strong>求解最优策略。 通过反向 BFS
                拓扑排序 +
                动态规划，从所有可能的游戏状态中计算出每个状态下最优决策（最大化期望总奖励）。
              </p>
              <p class="text-caption text-medium-emphasis">
                求解步骤：① 枚举所有合法状态 → ② 构建状态转移图 → ③ 反向拓扑排序 → ④ DP 求解 Bellman
                最优方程
              </p>
            </section>

            <section>
              <h3 class="text-subtitle-1 font-weight-bold mb-2">⚙️ 翻倍规则</h3>
              <p>当手牌抽到第 2 张时，必须决定是否<b>翻倍</b>：</p>
              <ul>
                <li>选择翻倍：本次演算的奖励 ×2，消耗一次翻倍次数</li>
                <li>选择不翻倍：奖励不变</li>
              </ul>
              <p class="mt-1">翻倍决定后不可更改。如果翻倍次数用完，则自动选择不翻倍。</p>
            </section>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
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

// ==================== 响应式状态 ====================

const 牌库数量元组 = ref<number[]>([...默认牌库数量元组]);
const 演算奖励元组 = ref<number[]>([...默认演算奖励元组]);

const 输入 = reactive({
  剩余演算次数: 3,
  剩余放弃次数: 3,
  剩余翻倍次数: 2,
  是否翻倍: false,
});

const 计算中 = ref(false);

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

/** 翻倍按钮是否可用（手牌2张、未翻倍、有翻倍次数） */
const 可翻倍 = computed(() => 当前手牌总数.value === 2 && !输入.是否翻倍 && 输入.剩余翻倍次数 > 0);

/** 抽指定点数按钮是否可用（手牌未满且该点数牌库还有余量） */
function 可抽点数(点数: number): boolean {
  if (当前手牌总数.value >= 5) return false;
  const 该点数已抽数量 = 当前手牌数量元组.value[点数 - 1]!;
  if (该点数已抽数量 >= 牌库数量元组.value[点数 - 1]!) return false;
  return true;
}

// ==================== 预计算 MDP（基础设定变化时触发） ====================

function 重新计算MDP(): void {
  计算中.value = true;
  const 求解器 = new 求解器类([...牌库数量元组.value], [...演算奖励元组.value]);
  求解器缓存.value = 求解器;
  MDP缓存.value = 求解器.求解MDP();
  计算中.value = false;
  更新计算结果();
}

watch(
  [牌库数量元组, 演算奖励元组],
  () => {
    重新计算MDP();
  },
  { deep: true, immediate: true },
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
  const 奖励 = 计算演算奖励(当前手牌数量元组.value, 输入.是否翻倍);
  const msg = `演算完成！获得奖励：${奖励}`;

  if (消耗次数) {
    输入.剩余演算次数 = Math.max(0, 输入.剩余演算次数 - 1);
    if (输入.是否翻倍) {
      输入.剩余翻倍次数 = Math.max(0, 输入.剩余翻倍次数 - 1);
    }
  }

  输入.是否翻倍 = false;
  手牌插槽.value = [0, 0, 0, 0, 0];

  ElMessage(msg);
}

function 执行放弃(): void {
  if (输入.剩余放弃次数 > 0) {
    输入.剩余放弃次数--;
  } else {
    输入.剩余演算次数 = Math.max(0, 输入.剩余演算次数 - 1);
  }
  输入.是否翻倍 = false;
  手牌插槽.value = [0, 0, 0, 0, 0];
}

/** 重置手牌（保留剩余次数） */
function 执行重置手牌(): void {
  输入.是否翻倍 = false;
  手牌插槽.value = [0, 0, 0, 0, 0];
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
}

/** 抽一张指定点数的牌加入手牌 */
function 执行抽指定点数(点数: number): void {
  if (当前手牌总数.value >= 5) {
    ElMessage('手牌已满！');
    return;
  }
  const 已抽数量 = 当前手牌数量元组.value[点数 - 1]!;
  if (已抽数量 >= 牌库数量元组.value[点数 - 1]!) {
    ElMessage(`${点数}点的牌库已空！`);
    return;
  }
  const 空位 = 手牌插槽.value.indexOf(0);
  if (空位 === -1) {
    ElMessage('手牌已满！');
    return;
  }
  手牌插槽.value[空位] = 点数;
}

/** 随机抽一张牌（按剩余牌库概率） */
function 执行随机抽牌(): void {
  if (当前手牌总数.value >= 5) {
    ElMessage('手牌已满！');
    return;
  }
  const 剩余数量 = 牌库数量元组.value.map((n, i) => n - 当前手牌数量元组.value[i]!);
  const 总剩余 = 剩余数量.reduce((a, b) => a + b, 0);
  if (总剩余 === 0) {
    ElMessage('牌库已空！');
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

function 计算演算奖励(手牌: number[], 是否翻倍: boolean): number {
  const 战力点 = 计算战力点(手牌);
  let 奖励 = 演算奖励元组.value[战力点] ?? 0;
  if (是否翻倍) 奖励 *= 2;
  return 奖励;
}

/** 翻倍：将状态设为已翻倍 */
function 执行翻倍(): void {
  输入.是否翻倍 = true;
}

let 提示计时器: ReturnType<typeof setTimeout>;
function ElMessage(msg: string): void {
  clearTimeout(提示计时器);
  const el = document.createElement('div');
  el.className = 'sword-calculator-toast';
  el.textContent = msg;
  Object.assign(el.style, {
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(0,0,0,0.8)',
    color: '#fff',
    padding: '10px 24px',
    borderRadius: '8px',
    zIndex: '9999',
    fontSize: '14px',
    transition: 'opacity 0.3s',
  });
  document.body.append(el);
  提示计时器 = setTimeout(() => {
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 300);
  }, 2000);
}
</script>

<style scoped>
:deep(.bg-primary-lighten-5) {
  background-color: rgba(var(--v-theme-primary), 0.08) !important;
}
</style>
