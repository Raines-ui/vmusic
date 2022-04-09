<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header" height="80px">
        <div class="title">
          <img
            src="../../assets/logo.png"
            alt="网易云音乐数据展示平台"
            srcset="../../assets/logo.png"
          />
          <h1>网易云音乐数据展示平台</h1>
        </div>
      </el-header>
      <el-container>
        <el-aside width="300px">
          <el-scrollbar>
            <el-menu
              class="aside"
              :default-active="menuActive"
              @open="openMenu"
              @select="selectMenu"
              background-color="#314057"
              text-color="#f0f8ff"
              active-text-color="#f0f8ff"
            >
              <el-menu-item index="0">
                <el-icon><histogram /></el-icon>
                <template #title> 综合数据 </template>
              </el-menu-item>
              <el-sub-menu index="1">
                <template #title>
                  <el-icon><user-filled /></el-icon>热门歌手
                </template>
                <ul>
                  <li
                    class="menu-item"
                    v-for="(item, index) in artistslist"
                    :key="index"
                    :class="active == index ? 'active' : ''"
                    @click="changeActive(index)"
                  >
                    <img :src="item.picUrl" alt="item.name" />
                    <span>{{ item.name }}</span>
                  </li>
                </ul>
              </el-sub-menu>
            </el-menu>
          </el-scrollbar>
        </el-aside>
        <el-main>
          <el-space>
            <ArtistLayout
              ref="artistChart"
              v-show="menuActive === '1'"
            ></ArtistLayout>
          </el-space>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup>
import {
  ref,
  onMounted,
  createApp,
  getCurrentInstance,
  reactive,
  defineAsyncComponent,
  nextTick,
  onBeforeUpdate,
  onUpdated,
} from "vue";
import ArtistLayout from "../../components/ArtistLayout.vue";
import { request } from "../../../config/request.js";
const artistslist = ref(null);
const active = ref(0);
const menuActive = ref("0");
const curId = ref(0);
// 初始化组件ArtistLayout实例artistChart,挂载后即可获取当前实例
const artistChart = ref(null);
const changeActive = (index) => {
  active.value = index;
  curId.value = artistslist.value[active.value].id;
  artistChart.value.renderEcharts(curId.value);
};

const selectMenu = (index) => {
  menuActive.value = index;
  artistChart.value.renderEcharts(curId.value);
};
const openMenu = (index) => {
  menuActive.value = index;
};

function getArtists() {
  let options = {
    url: "/top/artists",
  };
  request(options).then((res) => {
    artistslist.value = res.data.artists;
    curId.value = artistslist.value[active.value].id;
    artistChart.value.renderEcharts(curId.value);
  });
}
onMounted(() => {
  getArtists();
});
</script>
<style scoped>
@import url(index.css);
</style>