<template>
  <v-container class="px-0 px-sm-4" fluid>
    <header class="page-title mb-4">选剑演武计算器</header>

    <!-- ============ 上半部分：左右分栏 ============ -->
    <v-row>
      <!-- ===== 左栏：输出区 ===== -->
      <v-col cols="12" md="6">
        <v-expansion-panels v-model="左侧面板展开值" class="mb-4" multiple>
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
                  <v-col class="text-caption text-medium-emphasis" cols="6" sm="6">
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
                        .join(' ') || '空'
                    }}
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
                <div v-for="(item, i) in 计算结果" :key="i">
                  <v-badge
                    class="strategy-card-track"
                    :color="item.is最优 ? 'success' : 'primary'"
                    location="top left"
                    offset-x="80"
                  >
                    <template #badge>
                      <v-icon class="mr-1">{{
                        item.is最优 ? 'mdi-crown' : 'mdi-subdirectory-arrow-right'
                      }}</v-icon>
                      {{ item.is最优 ? '当前最优' : '备选决策 ' + String(i).padStart(2, '0') }}
                    </template>
                    <div
                      class="strategy-result-card"
                      :class="[
                        `${决策按钮主题类(item.决策)}`,
                        item.is最优 ? 'is-best' : 'not-best',
                      ]"
                      :style="{ '--strategy-card-width': 收益卡片宽度(item) }"
                    >
                      <div class="strategy-card-action">
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
                                :prepend-icon="`mdi-dice-${x}-outline`"
                                @click="执行抽指定点数(x)"
                              >
                                <v-list-item-title>抽到 {{ x }} 点</v-list-item-title>
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
                        <div v-if="!mobile" class="strategy-metric">
                          <span>本次收益</span>
                          <strong>{{ item.即时奖励.toFixed(0) }}</strong>
                        </div>
                        <div v-if="!mobile" class="strategy-metric">
                          <span>
                            未来期望
                          </span>
                          <strong>{{ 格式化万元(item.期望未来价值) }}</strong>
                        </div>
                        <div class="strategy-metric total">
                          <span>全体期望</span>
                          <strong>{{ 格式化万元(item.总价值) }}</strong>
                        </div>
                      </div>
                    </div>
                  </v-badge>
                </div>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel value="settings">
            <v-expansion-panel-title>
              <v-icon class="mr-2" color="primary">mdi-cog-outline</v-icon>
              基础设定区
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
                    :label="`${i + 1} 点数量`"
                    max="20"
                    min="0"
                    type="number"
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="4" sm="2">
                  <v-btn
                    block
                    class="fill-height"
                    color="grey-darken-1"
                    prepend-icon="mdi-restore"
                    variant="outlined"
                    @click="执行重置初始铭牌库"
                  >
                    重置初始库
                  </v-btn>
                </v-col>
              </v-row>
              <div class="text-subtitle-2 text-medium-emphasis">
                <v-icon icon="mdi-information"></v-icon>
                <span>
                  铭牌库每 3 天更新一次，但我们不一定每 3 天更新一次网站，若与游戏内不一致请手动调整。
                  <br>上次更新时间：{{ 当前牌库记录时间文本 }}。
                </span>
              </div>
              <v-alert
                v-if="显示牌库更新提醒"
                border="start"
                class="deck-version-alert mt-3"
                density="comfortable"
                type="warning"
                variant="tonal"
              >
                <div class="deck-version-alert-content">
                  <div>
                    <div class="font-weight-bold">牌库数据可能需要手动更新</div>
                    <div class="text-body-2">
                      当前周期：{{ 当前牌库周期范围文本 }}。现有牌库记录时间是 {{ 当前牌库记录时间文本 }}，
                      请核对初始铭牌库是否与游戏内一致，若不一致请手动调整。
                    </div>
                  </div>
                  <v-btn color="warning" size="small" variant="flat" @click="保存当前牌库数据">
                    已手动更新
                  </v-btn>
                </div>
              </v-alert>

              <!-- 数据溢出设置 -->
              <div class="text-subtitle-2 my-4">数据溢出容许</div>
              <v-radio-group v-model="数据溢出模式值" density="compact" hide-details>
                <v-radio :label="`不接受数据溢出`" :value="数据溢出模式.不接受" />
                <v-radio
:class="{ 'text-error font-weight-bold': 数据溢出模式值 == 数据溢出模式.接受1次 }" :color="数据溢出模式值 == 数据溢出模式.接受1次 ? 'error' : undefined"
                  :label="`接受 1 次数据溢出`"
                  :value="数据溢出模式.接受1次" />
                <v-radio
:class="{ 'text-red-darken-1 font-weight-bold': 数据溢出模式值 == 数据溢出模式.接受1至2次 }" :color="数据溢出模式值 == 数据溢出模式.接受1至2次 ? 'red-darken-1' : undefined"
                  :label="`接受 1 ~ 2 次数据溢出`"
                  :value="数据溢出模式.接受1至2次" />
              </v-radio-group>

              <!-- 演武平台等级 -->
              <div class="text-subtitle-2 my-4">演武平台等级</div>
              <v-select
                v-model="演武平台等级"
                class="w-100"
                density="compact"
                hide-details
                item-title="label"
                item-value="value"
                :items="
                  演武平台等级表.map((_, i) => {
                    return {
                      value: i + 1,
                      label: `Lv.${i + 1}`,
                    };
                  })
                "
                label="演武平台等级"
              />
              <div class="text-subtitle-2 my-4">演武平台属性</div>
              <ul>
                <li><strong>翻倍次数上限</strong> {{ 翻倍次数上限 }}</li>
                <li>
                  <strong>演算奖励数量（0 ~ 10 战力点）</strong><br />{{ 演算奖励元组.join(' / ') }}
                </li>
              </ul>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>

      <!-- ===== 右栏：输入区 ===== -->
      <v-col cols="12" md="6">
        <v-expansion-panels v-model="右侧面板展开值" class="mb-4" multiple>
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
                    :prepend-icon="`mdi-dice-${x}-outline`"
                    variant="outlined"
                    @click="执行抽指定点数(x)"
                    >抽到 {{ x }} 点
                  </v-btn>
                </v-col>
                <v-col cols="6" sm="4">
                  <v-btn
                    block
                    color="secondary"
                    :disabled="!可重置手牌"
                    prepend-icon="mdi-hand-back-right"
                    variant="outlined"
                    @click="执行重置手牌"
                  >
                    重置手牌
                  </v-btn>
                </v-col>
              </v-row>

              <ToolsTrialSwordmancyBattlePointSlider
                class="mt-3"
                :cur-real-point="当前手牌点数和"
                :overflow="战力点已溢出"
                :point="当前战力点"
              />
              <div class="remaining-deck text-caption text-medium-emphasis">
                <span>铭牌库存：</span>
                <span v-for="(总数, i) in 牌库数量元组" :key="i" class="remaining-deck-item">
                  <v-icon class="remaining-deck-icon" size="small"
                    >mdi-dice-{{ i + 1 }}-outline</v-icon
                  >
                  <span>× {{ 总数 - (当前手牌数量元组[i] ?? 0) }}</span>
                </span>
              </div>
              <div class="post-battle-action-row mt-3">
                <v-switch
                  v-model="输入.是否翻倍"
                  class="double-state-switch"
                  color="orange-darken-1"
                  density="compact"
                  :disabled="当前手牌总数 !== 2 || 输入.剩余翻倍次数 <= 0"
                  hide-details
                  inset
                  :label="`奖励翻倍（${输入.剩余翻倍次数 > 0 ? `剩余 ${输入.剩余翻倍次数} 次` : '已耗尽'}）`"
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
                    <v-icon icon="mdi-code-brackets"></v-icon>
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
                    <v-icon icon="mdi-logout"></v-icon>
                    <span class="abandon-action-content">
                      <span class="abandon-action-text">放弃</span>
                    </span>
                  </button>
                </div>
                <div>
                  <v-btn
                    block
                    prepend-icon="mdi-restore"
                    size="large"
                    variant="outlined"
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
              <v-icon class="mr-2" color="primary">mdi-help-circle</v-icon>
              帮助与说明
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <h3>基本规则</h3>
              <p>在选剑演武中，您需要从牌库中抽取铭牌，凑出特定战力点进行挑战。</p>
              <p>
                每次演算可以抽取最多 5
                张铭牌，每张铭牌都有其对应的战力点数。所有铭牌的战力点数和会决定最终战力点。
              </p>
              <p><strong>最终战力点</strong> = (所有铭牌的战力点数和) mod 11</p>
              <p>管理员可在演武平台进行两种演算：</p>
              <ul>
                <li>
                  <strong>奖励演算：</strong
                  >默认类型的演算；挑战成功时，会根据最终战力点数和翻倍状态（后述）获得武陵调度券奖励。<br />
                  管理员可以随时选择<strong class="text-error">放弃</strong
                  >，但每次放弃会消耗一次弃权次数。<br />
                  <strong class="text-error"
                    >每日拥有<strong>3次</strong>弃权次数；弃权次数耗尽时，继续弃权将扣除奖励演算次数。</strong
                  ><br />
                  奖励演算每日可进行3次。
                </li>
                <li>
                  <strong>自由演算：</strong
                  >奖励演算次数耗尽后，本日的后续演算将变为“自由演算”。<br />
                  自由演算不会给予奖励，管理员可以反复挑战。
                </li>
              </ul>
              <v-card class="mx-auto" color="error" variant="outlined">
                <template #text>
                  <v-icon class="mr-2" color="error">mdi-alert</v-icon>
                  <span class="text-body-1">
                    <strong>注意：</strong>当铭牌的战力点数和超过 10
                    时，最终战力点会溢出，报酬量将会重新计算，并同时<strong>触发溢出惩罚。</strong>
                    <ul>
                      <li>溢出 1 次（11+）时：所有敌人等级+30（达到<strong>Lv.90</strong>）</li>
                      <li>溢出 2 次（22+）时：演算时间缩减至180秒（<strong>3分钟</strong>）</li>
                    </ul>
                    <strong>请谨慎考虑在溢出状态下进行奖励演算。</strong>
                  </span>
                </template>
              </v-card>
              <p>在演武开始前，管理员可在演武场地东侧的专用区域设置战斗辅助设备以辅助战斗。</p>

              <h3>规则假设</h3>
              <ul>
                <li>
                  <strong>等概率抽取假设</strong
                  >：每次抽取铭牌时，抽到某一点数铭牌的概率正比于牌库中该点数铭牌的剩余数量。<br />例如，牌库剩余
                  1 点 × 3、2 点 × 2，则抽到 1 点的概率为 3/5，抽到 2 点的概率为 2/5。
                </li>
              </ul>

              <h3>操作说明</h3>
              <p>您首先需要在【基础设定区】设置当前铭牌库的初始牌数、数据溢出容许及演算平台等级。</p>
              <ul>
                <li>
                  <strong
                    >铭牌库每3日会刷新一次，请务必确保【基础设定区】中的铭牌库数量与游戏内未抽取时的铭牌库数量一致。</strong
                  >
                </li>
                <li>
                  演算平台等级会影响最终战力点奖励量及每日翻倍次数。默认选用Lv.4。
                </li>
              </ul>
              <p>
                之后点击【输入区】的【重置全部】按钮，即可开始演算计算推演。<br />可用的操作如下：
              </p>
              <ul>
                <li>
                  <v-icon class="mr-2" color="secondary" size="small">mdi-hand-back-right</v-icon>
                  <strong>重置手牌</strong> — 清除当前手牌并重置翻倍状态，不消耗任何次数
                </li>
                <li>
                  <v-icon class="mr-2" size="small">mdi-restore</v-icon>
                  <strong>重置全部</strong> — 将所有状态（已抽手牌、翻倍状态、各次数计数）恢复为初始值
                </li>
                <li>
                  <v-icon class="mr-2" color="#c3ab71" size="small">mdi-code-brackets</v-icon>
                  <strong>开始演算</strong> —
                  消耗一次演算次数，根据当前手牌获得对应奖励，然后重置手牌。若已翻倍，同时消耗一次翻倍次数
                </li>
                <li>
                  <v-icon class="mr-2" color="error" size="small">mdi-logout</v-icon>
                  <strong>放弃</strong> —
                  放弃当前手牌。若还有放弃次数则消耗一次放弃次数并保留演算次数，否则消耗一次演算次数
                </li>
                <li>
                  <v-icon class="mr-2" color="orange-darken-1" size="small">mdi-plus-circle</v-icon>
                  <strong>奖励翻倍</strong> — 启用奖励翻倍，使本次演算的奖励 ×2。
                </li>
                <!-- 暂时隐藏随机抽牌说明，保留代码方便后续恢复
                <li>
                  <v-icon class="mr-2" size="small">mdi-shuffle</v-icon>
                  <strong>随机抽 1 张</strong> — 从牌库中按剩余概率随机抽取一张铭牌加入手牌
                </li>
                -->
                <li>
                  <v-icon class="mr-2" color="orange-darken-1" size="small"
                    >mdi-dice-multiple-outline</v-icon
                  >
                  <strong>抽到 X 点</strong> —
                  从牌库中抽取一张指定点数的铭牌加入手牌。仅当该点数的牌库还有余量时可用
                </li>
              </ul>

              <h3>算法说明</h3>
              <p>
                本计算器使用<strong>马尔可夫决策过程（MDP）</strong>求解最优策略。 通过反向 BFS
                拓扑排序 +
                动态规划，从所有可能的游戏状态中计算出每个状态下最优决策（最大化期望总奖励）。
              </p>
              <p>
                求解步骤：① 枚举所有合法状态 → ② 构建状态转移图 → ③ 反向拓扑排序 → ④ DP 求解 Bellman
                最优方程
              </p>

              <h3>输出区说明</h3>
              <p>计算完成后，输出区会展示当前状态下的决策分析与收益评估：</p>
              <ul>
                <li><strong>最优决策</strong> — MDP 求解出的当前状态最佳行动方案</li>
                <li>
                  <strong>总收益期望</strong> —
                  按照最优策略，从当前状态开始至结束所能获得的总收益期望
                </li>
                <li><strong>本次收益</strong> — 执行当前决策（如开始演武）本次获得的收益</li>
                <li><strong>未来期望</strong> — 选择某个决策后，后续演武收益的期望</li>
                <li>
                  <strong>全体期望</strong> = 本次收益 +
                  未来期望，表示选择该决策的总收益期望
                </li>
              </ul>
              <p>当剩余演算次数为 0 时，输出区会显示"已无演算次数"提示。</p>

              <h3>关于翻倍</h3>
              <p>
                在游戏中，当次奖励演算抽取了至少 1 张铭牌，且尚未抽取第 3
                张铭牌前，可以选择是否开启<strong style="color: #c3ab71">奖励翻倍模式</strong>。
              </p>
              <ul>
                <li>开启翻倍后，本次演算的调度券奖励 ×2。</li>
                <li>
                  <strong class="text-error">仅可在抽取第 3 张铭牌前决定是否翻倍。</strong
                  >一旦抽取了第 3 张铭牌，翻倍状态将被锁定，无法修改。<br />
                  弃权不会消耗翻倍次数，但只要正式进入演算挑战，该次翻倍次数就会被消耗。
                </li>
              </ul>
              <p>
                虽然只抽了 1 张铭牌时也可以选择翻倍，但是在最优策略下，一定至少抽 2
                张铭牌才会开始演算。<br/>
                为了性能考虑，在本计算器中，仅在刚好抽取了 2 张铭牌时才能选择是否翻倍。
              </p>

              <h3>数据溢出容许</h3>
              <p>设置后，将考虑溢出状态下的奖励收益。</p>
              <ul>
                <li><strong>不接受数据溢出</strong> — 总点数 ≥ 11 时奖励归零</li>
                <li><strong>接受 1 次数据溢出</strong> — 总点数 ≥ 22 时奖励归零</li>
                <li><strong>接受 1 ~ 2 次数据溢出</strong> — 无额外限制（默认）</li>
              </ul>
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
import { useDisplay } from 'vuetify';
import {
  type MDPResult,
  数据溢出模式,
  求解器类,
  演武平台等级表,
  type 状态类,
  状态键,
  计算战力点,
  默认牌库数据,
  默认牌库数量元组,
} from '@/shared/utils/trialOfSwordmancy';
import {
  写入本地牌库数据,
  格式化东八区时间,
  牌库周期范围文本,
  牌库数据快照,
  牌库数据需要更新,
  计算牌库刷新周期,
  读取本地牌库数据,
} from '@/shared/utils/trialOfSwordmancyDeck';
import {
  写入选剑演武页面状态,
  读取选剑演武页面状态,
  默认选剑演武页面状态,
} from '@/shared/utils/trialOfSwordmancyPageState';

definePageMeta({
  layout: 'default',
});

const { t } = useI18n();

usePageSeo({
  title: () => `${t('menu.trialOfSwordmancyStrategy')} - ${t('layout.siteName')}`,
  description: () => 'Strategy calculator for Trial of Swordmancy outcomes and hand composition.',
});

const { mobile } = useDisplay();

const 左侧面板展开值 = ref<string[]>(['output', 'settings']);
const 右侧面板展开值 = ref<string[]>(['input']);

// ==================== 响应式状态 ====================

const 牌库数量元组 = ref<number[]>([...默认牌库数量元组]);
const 演算奖励元组 = computed<number[]>(
  () => 演武平台等级表[演武平台等级.value - 1]?.演算奖励元组 ?? [],
);
const 翻倍次数上限 = computed<number>(() => 演武平台等级表[演武平台等级.value - 1]?.双倍次数 ?? 0);
const 演武平台等级 = ref(默认选剑演武页面状态.演武平台等级);
const 数据溢出模式值 = ref<数据溢出模式>(默认选剑演武页面状态.数据溢出模式值);

const 输入 = reactive({
  ...默认选剑演武页面状态.输入,
});

const 显示消息 = ref(false);
const 消息 = ref('');
const 牌库数据 = ref({
  deck: [...默认牌库数量元组],
  updatedAt: Date.now(),
});
const 当前时间Ms = ref(Date.now());
let 忽略下一次牌库自动保存快照: string | null = null;
let 正在恢复页面状态 = false;
let 牌库时间检查计时器: ReturnType<typeof setInterval> | undefined;

const 当前牌库记录时间文本 = computed(() => 格式化东八区时间(牌库数据.value.updatedAt));
const 当前牌库周期范围文本 = computed(() => 牌库周期范围文本(计算牌库刷新周期(当前时间Ms.value)));
const 显示牌库更新提醒 = computed(() => 牌库数据需要更新(牌库数据.value, 当前时间Ms.value));

function 设置牌库数据(deck: number[], updatedAt: number): void {
  忽略下一次牌库自动保存快照 = 牌库数据快照(deck);
  牌库数量元组.value = [...deck];
  牌库数据.value = {
    deck: [...deck],
    updatedAt,
  };
}

function 保存牌库数据(deck: number[], updatedAt: number = Date.now()): void {
  const data = {
    deck: [...deck],
    updatedAt,
  };
  牌库数据.value = data;

  if (import.meta.client) {
    写入本地牌库数据(localStorage, data);
  }
}

function 保存当前牌库数据(): void {
  保存牌库数据(牌库数量元组.value);
  消息.value = '当前牌库数据已记录时间戳';
  显示消息.value = true;
}

function 生成页面状态快照() {
  return {
    version: 1 as const,
    演武平台等级: 演武平台等级.value,
    数据溢出模式值: 数据溢出模式值.value,
    输入: { ...输入 },
    手牌插槽: [...手牌插槽.value],
  };
}

function 保存页面状态(): void {
  if (!import.meta.client || 正在恢复页面状态) {
    return;
  }

  写入选剑演武页面状态(localStorage, 生成页面状态快照());
}

function 应用页面状态(): void {
  if (!import.meta.client) {
    return;
  }

  正在恢复页面状态 = true;
  try {
    const saved = 读取选剑演武页面状态(localStorage);
    演武平台等级.value = saved.演武平台等级;
    数据溢出模式值.value = saved.数据溢出模式值;
    Object.assign(输入, saved.输入);
    手牌插槽.value = [...saved.手牌插槽];
  } finally {
    nextTick(() => {
      正在恢复页面状态 = false;
    });
  }
}

function 处理页面隐藏(): void {
  保存页面状态();
}

onMounted(() => {
  if (!import.meta.client) {
    return;
  }

  const data = 读取本地牌库数据(localStorage);
  设置牌库数据(data.deck, data.updatedAt);
  应用页面状态();
  window.addEventListener('pagehide', 处理页面隐藏);
  牌库时间检查计时器 = setInterval(() => {
    当前时间Ms.value = Date.now();
  }, 60_000);
});

onUnmounted(() => {
  保存页面状态();
  window.removeEventListener('pagehide', 处理页面隐藏);
  if (牌库时间检查计时器) {
    clearInterval(牌库时间检查计时器);
  }
});

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

const 手牌插槽 = ref<number[]>([...默认选剑演武页面状态.手牌插槽]);

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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  const 求解器 = new 求解器类(
    [...牌库数量元组.value],
    [...演算奖励元组.value],
    翻倍次数上限.value,
    数据溢出模式值.value,
  );
  求解器缓存.value = 求解器;
  MDP缓存.value = 求解器.求解MDP();
  更新计算结果();
}

watchDebounced(
  [牌库数量元组, 演算奖励元组, 数据溢出模式值, 演武平台等级],
  () => {
    重新计算MDP();
  },
  {
    deep: true,
    immediate: true,
    debounce: 300,
  },
);

watchDebounced(
  牌库数量元组,
  () => {
    const 快照 = 牌库数据快照(牌库数量元组.value);
    if (忽略下一次牌库自动保存快照 === 快照) {
      忽略下一次牌库自动保存快照 = null;
      return;
    }

    忽略下一次牌库自动保存快照 = null;
    保存牌库数据(牌库数量元组.value);
  },
  {
    deep: true,
    debounce: 500,
  },
);

watchDebounced(
  [
    演武平台等级,
    数据溢出模式值,
    () => 输入.剩余演算次数,
    () => 输入.剩余放弃次数,
    () => 输入.剩余翻倍次数,
    () => 输入.是否翻倍,
    手牌插槽,
  ],
  () => {
    保存页面状态();
  },
  {
    deep: true,
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

/** 重置初始铭牌库（恢复默认牌库数量，MDP 会通过 watch 自动重新计算） */
function 执行重置初始铭牌库(): void {
  设置牌库数据(默认牌库数据.deck, 默认牌库数据.updatedAt);
  保存牌库数据(默认牌库数据.deck, 默认牌库数据.updatedAt);

  消息.value = '初始铭牌库已重置';
  显示消息.value = true;
}

/** 重置全部（仅恢复操作状态，不重置需要重新计算 MDP 的设定） */
function 执行重置全部(): void {
  输入.剩余演算次数 = 3;
  输入.剩余放弃次数 = 3;
  输入.剩余翻倍次数 = 翻倍次数上限.value;
  输入.是否翻倍 = false;
  手牌插槽.value = [0, 0, 0, 0, 0];

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
  justify-content: center;
  gap: 0.45rem 0.75rem;
  margin-block-end: 1rem;
  min-height: 40px;
  padding: 0.45rem 0.6rem;
  color: var(--theme-text-primary);
  background: var(--theme-bg-secondary);
  border: 1px solid var(--theme-border);
  border-radius: 3px;
}

.daily-count-title {
  flex: 0 0 auto;
  font-weight: 700;
  white-space: nowrap;
}

.daily-count-field {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  min-width: 0;
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

.deck-version-alert :deep(.v-alert__content) {
  width: 100%;
}

.deck-version-alert-content {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
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

.post-battle-action-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
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
  gap: 0.5rem;
  width: var(--strategy-card-width);
  min-width: min(100%, 14rem);
  min-height: 77px;
  padding: 0.25rem 1rem;
  overflow: hidden;
  color: rgba(38, 52, 60, 0.92);
  background: linear-gradient(135deg, rgba(239, 247, 250, 0.98), rgba(219, 237, 242, 0.98));
  border: 1px solid rgba(107, 139, 150, 0.28);
  box-shadow: 0 5px 5px rgba(50, 85, 94, 0.14);
  transition:
    width 0.28s ease,
    transform 0.18s ease,
    box-shadow 0.18s ease;
}

.strategy-result-card.is-draw {
  background: linear-gradient(135deg, rgba(13, 92, 84, 0.3), rgba(13, 92, 84, 0.2));
}
.strategy-result-card.is-draw.is-best {
  background: linear-gradient(135deg, rgba(13, 92, 84, 1), rgba(84, 183, 185, 0.8));
  color: #fff;
}

.strategy-result-card.is-abandon {
  background: linear-gradient(135deg, rgba(85, 37, 38, 0.3), rgba(85, 37, 38, 0.2));
}
.strategy-result-card.is-abandon.is-best {
  background: linear-gradient(135deg, rgba(85, 37, 38, 1), rgba(61, 9, 10, 0.8));
  color: #fff;
}

.strategy-result-card.is-gold {
  background: linear-gradient(135deg, rgba(203, 177, 118, 0.3), rgba(203, 177, 118, 0.2));
}
.strategy-result-card.is-gold.is-best {
  background: linear-gradient(135deg, rgba(203, 177, 118, 1), rgba(216, 196, 148, 0.8));
  color: #fff;
}

/*
.strategy-result-card.is-best {
  color: white;
  background: linear-gradient(135deg, #1976d2 0%, #1e88e5 52%, #42a5f5 100%);
  border-color: rgba(255, 255, 255, 0.28);
  box-shadow: 0 5px 5px rgba(var(--v-theme-primary), 0.32);
}
*/

.strategy-result-card:hover {
  box-shadow: 0 10px 10px rgba(50, 85, 94, 0.18);
}

.strategy-card-action {
  min-width: 0;
  flex-grow: 100;
}

.strategy-decision-button {
  --strategy-button-bg: rgba(var(--v-theme-primary), 1);
  --strategy-button-color: #fff;

  color: var(--strategy-button-color);
  font-weight: 800;
  background: var(--strategy-button-bg);
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
  grid-template-rows: repeat(3, minmax(0, 1fr));
  min-width: 0;
}

.strategy-metric {
  display: flex;
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
  overflow: hidden;
  font-size: 0.72rem;
  font-weight: 700;
  color: rgba(38, 52, 60, 0.54);
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 0.25rem;
}

.strategy-result-card.is-best .strategy-metric span {
  color: rgba(255, 255, 255, 0.72);
}

.strategy-metric strong {
  display: block;
  overflow: hidden;
  font-weight: 900;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ========== 手牌卡片网格容器 ========== */
.hand-card-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.65rem;
}

@media (max-width: 700px) {
  .hand-card-grid {
    grid-template-columns: repeat(3, 1fr);
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
  .deck-version-alert-content {
    align-items: stretch;
    flex-direction: column;
  }

  .strategy-result-card {
    min-width: min(100%, 16rem);
    min-height: 72px;
    padding: 0.75rem;
  }

  .strategy-card-action {
    flex-grow: 0;
  }

  .strategy-card-metrics {
    flex: 1 1 6rem;
    grid-template-rows: 1fr;
    gap: 0;
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
}

ol li,
ul li {
  margin-block: 0.25rem;
  font-size: 1rem;
}

/* ========== 暗色主题适配 ========== */
[data-theme='dark'] .daily-count-field input {
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.04),
    0 1px 2px var(--theme-shadow-base);
}

[data-theme='dark'] .strategy-result-card.not-best .strategy-metric span,
[data-theme='dark'] .strategy-result-card.not-best .strategy-metric strong {
  color: rgba(211, 211, 211, 0.54);
}
</style>
