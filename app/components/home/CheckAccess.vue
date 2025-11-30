<script setup lang="ts">

const openNewPage = (url:string)=>{
  window.open(url)
}

</script>

<template>
  <v-card class="home-navigation-card" elevation="6" >
    <v-card-title>
      <div class="home-navigation-card-title">
        <img src="~/assets/icon/endfield-icon.png" alt="" class="home-navigation-card-title-icon" />
        <b > 全面测试资格查询</b>
      </div>
    </v-card-title>
    <v-card-text>
      <img src="https://cos.yituliu.cn/endfield/other/test-kv.jpg" alt="" class="test-kv">
      <v-card class="check-access-btn"  hover @click="openNewPage('https://endfield.hypergryph.com/checkAccess')">
        <v-card-text>
          <div >
            <span>
              前往终末地官网查询资格
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
