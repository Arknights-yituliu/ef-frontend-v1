<template>
  <v-container>
    <h1 class="page-title">{{ $t('page.others.test.title') }}</h1>
    <p class="page-description">{{ $t('page.others.test.description') }}</p>

    <v-container>
      <v-row>
        <v-col cols="12" md="6">
          <v-card class="mb-4">
            <v-card-title>按钮组件</v-card-title>
            <v-card-text>
              <div class="d-flex flex-wrap" style="gap: 0.5rem">
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
                class="mb-2"
                color="primary"
                label="输入框示例"
                placeholder="请输入内容"
                variant="outlined"
              />
              <v-textarea
                color="primary"
                label="文本域示例"
                placeholder="请输入多行文本"
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
                      <v-btn color="primary" size="small" variant="text">查看</v-btn>
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
                      <v-btn color="primary" size="small" variant="text">查看</v-btn>
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
                      <v-btn color="primary" size="small" variant="text">查看</v-btn>
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
              <v-switch class="mb-2" color="primary" label="启用选项" />
              <v-checkbox class="mb-2" color="primary" label="复选框选项" />
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
              <v-progress-linear class="mb-4" color="primary" model-value="45" />
              <v-progress-circular class="mb-4" color="accent" model-value="70" />
              <v-slider
                color="primary"
                label="滑块示例"
                max="100"
                min="0"
                model-value="50"
                track-color="secondary"
              />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
});

const { t } = useI18n();

usePageSeo({
  title: () => `${t('page.others.test.title')} - ${t('layout.siteName')}`,
  description: () => t('page.others.test.description'),
  robots: 'noindex, follow',
});
</script>
