<script lang="ts" setup>

</script>

<template>
  <v-card class="home-navigation-card">
    <v-card-title>
      <div class="home-navigation-card-title">
        <img alt="" class="home-navigation-card-title-icon" src="~/assets/icon/endfield-icon.png"/>
        <b>{{ $t('component.home.checkAccess.comprehensiveTestQualificationCheck') }}</b>
        <div class="flex-1"/>
      </div>
    </v-card-title>
    <v-card-text>
      <img alt="" class="test-kv" src="https://cos.yituliu.cn/endfield/other/test-kv.jpg">
      <v-card class="check-access-btn" hover
              @click="()=>openNewPage('https://endfield.hypergryph.com/checkAccess')">
        <v-card-text>
          <div>
            <span>
             {{ $t('component.home.checkAccess.checkAccessOnEndfieldOfficialSite') }}
            </span>
            <v-icon icon="mdi-open-in-new"></v-icon>
          </div>
        </v-card-text>
      </v-card>
    </v-card-text>
  </v-card>

</template>

<style scoped>

.check-access-btn {
  text-align: center;
  margin: var(--spacing-md) auto;
  width: 90%;
  align-content: center;
}

.test-kv {
  width: 90%;
  display: block;
  margin: auto;
}


</style>
