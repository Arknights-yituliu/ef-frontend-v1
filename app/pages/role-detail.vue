<template>
  <div class="page-container">
    <!-- 页面标题区域 -->
    <div class="page-header">
      <div class="title-wrapper">
        <div class="title-decorator"></div>
        <h1 class="page-title">{{ $t('page.roleDetail') }}</h1>
      </div>
      <div class="header-divider"></div>
    </div>

    <!-- 内容区域 -->
    <div class="content-wrapper">
      <!-- 角色信息卡片 -->
      <div class="info-card">
        <div class="card-header">
          <div class="card-header-bg"></div>
          <h2 class="card-title">角色信息</h2>
        </div>
        <div class="card-content">
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">角色名称</span>
              <span class="info-value">示例角色</span>
            </div>
            <div class="info-item">
              <span class="info-label">职业</span>
              <span class="info-value">近卫</span>
            </div>
            <div class="info-item">
              <span class="info-label">稀有度</span>
              <span class="info-value rarity-6">★★★★★★</span>
            </div>
            <div class="info-item">
              <span class="info-label">阵营</span>
              <span class="info-value">示例阵营</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 属性展示卡片 -->
      <div class="stats-card">
        <div class="card-header">
          <div class="card-header-bg"></div>
          <h2 class="card-title">属性数据</h2>
        </div>
        <div class="card-content">
          <div class="stats-list">
            <div class="stat-item" v-for="(stat, index) in stats" :key="index">
              <div class="stat-bar-wrapper">
                <div class="stat-label">{{ stat.name }}</div>
                <div class="stat-value">{{ stat.value }}</div>
              </div>
              <div class="stat-bar">
                <div 
                  class="stat-bar-fill" 
                  :style="{ width: stat.percentage + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 技能展示卡片 -->
      <div class="skills-card">
        <div class="card-header">
          <div class="card-header-bg"></div>
          <h2 class="card-title">技能列表</h2>
        </div>
        <div class="card-content">
          <div class="skills-grid">
            <div 
              class="skill-item" 
              v-for="(skill, index) in skills" 
              :key="index"
              @mouseenter="hoveredSkill = index"
              @mouseleave="hoveredSkill = null"
            >
              <div class="skill-icon-wrapper">
                <div class="skill-icon"></div>
                <div class="skill-decorator" :class="{ active: hoveredSkill === index }"></div>
              </div>
              <div class="skill-info">
                <h3 class="skill-name">{{ skill.name }}</h3>
                <p class="skill-desc">{{ skill.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const hoveredSkill = ref<number | null>(null)

const stats = ref([
  { name: '生命值', value: '1500', percentage: 75 },
  { name: '攻击力', value: '800', percentage: 80 },
  { name: '防御力', value: '600', percentage: 60 },
  { name: '法术抗性', value: '20', percentage: 40 },
  { name: '部署费用', value: '18', percentage: 90 },
  { name: '阻挡数', value: '2', percentage: 66 }
])

const skills = ref([
  {
    name: '技能一',
    description: '这是第一个技能的描述信息，展示了角色的主要战斗技能。'
  },
  {
    name: '技能二',
    description: '这是第二个技能的描述信息，展示了角色的辅助战斗技能。'
  },
  {
    name: '技能三',
    description: '这是第三个技能的描述信息，展示了角色的特殊战斗技能。'
  }
])
</script>

<style scoped>
.page-container {
  padding: 3.75rem 0;
  animation: fadeIn 0.6s ease-out;
  position: relative;
}

/* 页面标题区域 */
.page-header {
  margin-bottom: 3.75rem;
  position: relative;
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.875rem;
  position: relative;
}

.title-decorator {
  width: 0.75rem;
  height: 4.375rem;
  background-color: var(--theme-accent-color);
  flex-shrink: 0;
  position: relative;
  filter: drop-shadow(0 0 0.5rem var(--theme-accent-color));
}

.title-decorator::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background-image: linear-gradient(
    -45deg,
    transparent,
    transparent 13.9512529279%,
    var(--theme-text-primary) 0,
    var(--theme-text-primary) 36.0487470721%,
    transparent 0,
    transparent 63.9512529279%,
    var(--theme-text-primary) 0,
    var(--theme-text-primary) 86.0487470721%,
    transparent 0,
    transparent
  );
  background-size: 0.5rem 0.5rem;
  opacity: 0.2;
}

.page-title {
  font-size: var(--font-size-5xl);
  font-weight: 700;
  color: var(--theme-text-primary);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  position: relative;
  line-height: 1.2;
}

.page-title::before {
  content: '';
  position: absolute;
  left: -2rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.5rem;
  height: 0.25rem;
  background-color: var(--theme-accent-color);
  opacity: 0.8;
}

.header-divider {
  height: 2px;
  background: linear-gradient(
    to right,
    var(--theme-accent-color) 0%,
    transparent 100%
  );
  position: relative;
}

.header-divider::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 60%;
  height: 1px;
  background-color: var(--theme-border);
}

/* 内容区域 */
.content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

/* 卡片通用样式 */
.info-card,
.stats-card,
.skills-card {
  background-color: var(--theme-bg-secondary);
  border: 2px solid var(--theme-border);
  border-radius: var(--radius-sm);
  position: relative;
  overflow: hidden;
  transition: all var(--transition-base);
  filter: drop-shadow(0 0 0.75rem var(--color-shadow));
}

.info-card:hover,
.stats-card:hover,
.skills-card:hover {
  border-color: var(--theme-accent-color);
  box-shadow: 0 0 1.5rem var(--theme-shadow-accent);
}

.card-header {
  height: 5rem;
  background-color: var(--theme-bg-tertiary);
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 1.875rem;
  border-bottom: 2px solid var(--theme-accent-color);
  overflow: hidden;
}

.card-header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: linear-gradient(
    -45deg,
    transparent,
    transparent 13.9512529279%,
    var(--theme-decorative-overlay) 0,
    var(--theme-decorative-overlay) 36.0487470721%,
    transparent 0,
    transparent 63.9512529279%,
    var(--theme-decorative-overlay) 0,
    var(--theme-decorative-overlay) 86.0487470721%,
    transparent 0,
    transparent
  );
  background-size: 0.5rem 0.5rem;
  opacity: 0.3;
}

.card-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--theme-text-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  position: relative;
  z-index: 1;
}

.card-title::before {
  content: '';
  position: absolute;
  left: -1.25rem;
  top: 50%;
  transform: translateY(-50%);
  width: 0.5rem;
  height: 0.5rem;
  background-color: var(--theme-accent-color);
  box-shadow: 0 0 0.5rem var(--theme-accent-color);
}

.card-content {
  padding: 2.5rem 1.875rem;
}

/* 信息网格 */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.25rem;
  background-color: var(--theme-bg-tertiary);
  border-left: 0.375rem solid var(--theme-accent-color);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
  position: relative;
  overflow: hidden;
}

.info-item::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 3rem;
  height: 3rem;
  background: linear-gradient(
    135deg,
    var(--theme-accent-color) 0%,
    transparent 100%
  );
  opacity: 0.05;
  transition: opacity var(--transition-fast);
}

.info-item:hover {
  background-color: var(--theme-bg-secondary);
  transform: translateX(0.25rem);
  border-left-width: 0.5rem;
}

.info-item:hover::before {
  opacity: 0.1;
}

.info-label {
  font-size: var(--font-size-sm);
  color: var(--theme-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 500;
}

.info-value {
  font-size: var(--font-size-lg);
  color: var(--theme-text-primary);
  font-weight: 700;
}

.rarity-6 {
  color: var(--theme-text-primary);
  letter-spacing: 0.1em;
}

/* 属性列表 */
.stats-list {
  display: flex;
  flex-direction: column;
  gap: 1.875rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.stat-bar-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-label {
  font-size: var(--font-size-base);
  color: var(--theme-text-primary);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-value {
  font-size: var(--font-size-lg);
  color: var(--theme-text-primary);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.stat-bar {
  height: 1.25rem;
  background-color: var(--theme-bg-tertiary);
  border: 1px solid var(--theme-border);
  border-radius: var(--radius-sm);
  position: relative;
  overflow: hidden;
}

.stat-bar-fill {
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--theme-accent-color) 0%,
    var(--theme-accent-hover) 100%
  );
  border-radius: var(--radius-sm);
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  box-shadow: 0 0 0.5rem var(--theme-shadow-accent-strong);
}

.stat-bar-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: linear-gradient(
    -45deg,
    transparent,
    transparent 13.9512529279%,
    var(--theme-decorative-overlay) 0,
    var(--theme-decorative-overlay) 36.0487470721%,
    transparent 0,
    transparent 63.9512529279%,
    var(--theme-decorative-overlay) 0,
    var(--theme-decorative-overlay) 86.0487470721%,
    transparent 0,
    transparent
  );
  background-size: 0.5rem 0.5rem;
}

/* 技能网格 */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.skill-item {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  background-color: var(--theme-bg-tertiary);
  border: 1px solid var(--theme-border);
  border-radius: var(--radius-sm);
  transition: all var(--transition-base);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.skill-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--theme-accent-color);
  transform: scaleX(0);
  transition: transform var(--transition-base);
}

.skill-item:hover {
  background-color: var(--theme-bg-secondary);
  border-color: var(--theme-accent-color);
  transform: translateY(-0.25rem);
  box-shadow: 0 0.5rem 1rem var(--color-shadow);
}

.skill-item:hover::before {
  transform: scaleX(1);
}

.skill-icon-wrapper {
  position: relative;
  width: 5rem;
  height: 5rem;
  flex-shrink: 0;
}

.skill-icon {
  width: 100%;
  height: 100%;
  background-color: var(--theme-bg-tertiary);
  border: 2px solid var(--theme-border);
  border-radius: var(--radius-sm);
  position: relative;
  overflow: hidden;
}

.skill-icon::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: linear-gradient(
    -45deg,
    transparent,
    transparent 13.9512529279%,
    var(--theme-decorative-overlay) 0,
    var(--theme-decorative-overlay) 36.0487470721%,
    transparent 0,
    transparent 63.9512529279%,
    var(--theme-decorative-overlay) 0,
    var(--theme-decorative-overlay) 86.0487470721%,
    transparent 0,
    transparent
  );
  background-size: 0.5rem 0.5rem;
}

.skill-decorator {
  position: absolute;
  top: -0.25rem;
  right: -0.25rem;
  width: 1.5rem;
  height: 1.5rem;
  background-color: var(--theme-accent-color);
  clip-path: polygon(0 0, 100% 0, 100% 50%, 50% 100%, 0 50%);
  opacity: 0;
  transform: scale(0);
  transition: all var(--transition-base);
}

.skill-decorator.active {
  opacity: 1;
  transform: scale(1);
}

.skill-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.skill-name {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--theme-text-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.skill-desc {
  font-size: var(--font-size-base);
  color: var(--theme-text-secondary);
  line-height: 1.6;
}

/* 响应式设计 */
@media (orientation: portrait) {
  .page-container {
    padding: 2rem 0;
  }

  .page-title {
    font-size: var(--font-size-4xl);
  }

  .title-decorator {
    height: 3rem;
  }

  .info-grid,
  .skills-grid {
    grid-template-columns: 1fr;
  }

  .card-content {
    padding: 1.5rem 1.25rem;
  }
}


</style>

