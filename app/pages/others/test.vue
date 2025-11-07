<template>
  <div class="others-test-page">
    <h1 class="page-title">{{ $t('page.others.test.title') }}</h1>
    <p class="page-description">{{ $t('page.others.test.description') }}</p>

    <v-container>
      <v-row>
        <v-col cols="12" md="6">
          <v-card class="mb-4">
            <v-card-title>按钮组件</v-card-title>
            <v-card-text>
              <div class="d-flex flex-wrap" style="gap: 0.5rem;">
                <v-btn color="primary">Primary 按钮</v-btn>
                <v-btn color="secondary">Secondary 按钮</v-btn>
                <v-btn color="accent">Accent 按钮</v-btn>
                <v-btn color="primary" variant="outlined">Outlined</v-btn>
                <v-btn color="primary" variant="text">Text</v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card class="mb-4">
            <v-card-title>输入框组件</v-card-title>
            <v-card-text>
              <v-text-field
                label="输入框示例"
                placeholder="请输入内容"
                color="primary"
                variant="outlined"
                class="mb-2"
              />
              <v-textarea
                label="文本域示例"
                placeholder="请输入多行文本"
                color="primary"
                variant="outlined"
              />
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12">
          <v-card class="mb-4">
            <v-card-title>表格组件</v-card-title>
            <v-card-text>
              <v-table>
                <thead>
                  <tr>
                    <th class="text-left">名称</th>
                    <th class="text-left">类型</th>
                    <th class="text-left">状态</th>
                    <th class="text-left">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>示例项目 1</td>
                    <td>
                      <v-chip color="primary" size="small">类型A</v-chip>
                    </td>
                    <td>
                      <v-chip color="success" size="small">正常</v-chip>
                    </td>
                    <td>
                      <v-btn size="small" color="primary" variant="text">查看</v-btn>
                    </td>
                  </tr>
                  <tr>
                    <td>示例项目 2</td>
                    <td>
                      <v-chip color="secondary" size="small">类型B</v-chip>
                    </td>
                    <td>
                      <v-chip color="warning" size="small">警告</v-chip>
                    </td>
                    <td>
                      <v-btn size="small" color="primary" variant="text">查看</v-btn>
                    </td>
                  </tr>
                  <tr>
                    <td>示例项目 3</td>
                    <td>
                      <v-chip color="accent" size="small">类型C</v-chip>
                    </td>
                    <td>
                      <v-chip color="error" size="small">错误</v-chip>
                    </td>
                    <td>
                      <v-btn size="small" color="primary" variant="text">查看</v-btn>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card class="mb-4">
            <v-card-title>开关和选择器</v-card-title>
            <v-card-text>
              <v-switch
                label="启用选项"
                color="primary"
                class="mb-2"
              />
              <v-checkbox
                label="复选框选项"
                color="primary"
                class="mb-2"
              />
              <v-radio-group color="primary">
                <v-radio label="选项 1" value="1" />
                <v-radio label="选项 2" value="2" />
                <v-radio label="选项 3" value="3" />
              </v-radio-group>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card class="mb-4">
            <v-card-title>进度条和滑块</v-card-title>
            <v-card-text>
              <v-progress-linear
                color="primary"
                model-value="45"
                class="mb-4"
              />
              <v-progress-circular
                color="accent"
                model-value="70"
                class="mb-4"
              />
              <v-slider
                label="滑块示例"
                color="primary"
                track-color="secondary"
                min="0"
                max="100"
                model-value="50"
              />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})
</script>

<style scoped>
.others-test-page {
  padding: 2rem 0;
}

.page-title {
  font-size: var(--font-size-3xl);
  color: var(--theme-text-primary);
  margin-bottom: 1rem;
  font-weight: 700;
}

.page-description {
  font-size: var(--font-size-md);
  color: var(--theme-text-secondary);
  margin-bottom: 2.5rem;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .page-title {
    font-size: var(--font-size-2xl);
  }
}

@media (max-width: 480px) {
  .others-test-page {
    padding: 1rem 0;
  }

  .page-title {
    font-size: var(--font-size-xl);
  }
}
</style>

