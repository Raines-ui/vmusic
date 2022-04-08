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
            <el-menu :default-openeds="['1', '3']" class="aside">
              <el-sub-menu index="1">
                <template #title>
                  <el-icon><histogram /></el-icon>综合数据
                </template>
              </el-sub-menu>
              <el-sub-menu index="2">
                <template #title>
                  <el-icon><user-filled /></el-icon>热门歌手
                </template>
                <el-menu-item
                  class="menu-item"
                  v-for="(item, index) in artistslist"
                  :key="index"
                  :class="active == index ? 'active' : ''"
                  @click="changeActive(index)"
                  ><img :src="item.picUrl" alt="item.name" />
                  <span>{{ item.name }}</span></el-menu-item
                >
              </el-sub-menu>
            </el-menu>
          </el-scrollbar>
        </el-aside>
        <el-main>
          <el-space>
            <el-card>
              <div id="baseChart" ref="baseCharts"></div>
            </el-card>
          </el-space>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup>
import { ref, onMounted, createApp, getCurrentInstance } from "vue";
import HelloWorld from "../../components/HelloWorld.vue";
import { request } from "../../../config/request.js";
import axios from "axios";
// 应用实例
const instance = getCurrentInstance();
const globalProperty = instance.appContext.config.globalProperties;
const echarts = globalProperty.$echarts;
const artistslist = ref("");
const loading = ref("false");
const active = ref(0);
const activeName = ref("1");
function changeActive(index) {
  active.value = index;
  renderEcharts();
}
function getArtists() {
  let options = {
    url: "/top/artists",
  };
  request(options).then((res) => {
    artistslist.value = res.data.artists;
    loading.value = true;
    renderEcharts();
  });
}
function renderEcharts() {
  const baseChartDom = document.getElementById("baseChart");
  const baseChart = echarts.init(baseChartDom);
  // 获取当前音乐人id
  const curId = artistslist.value[active.value].id;
  let options = {
    url: `/artist/detail?id=${curId}`,
  };
  request(options).then((res) => {
    let fetchdata = res.data.data;
    let artistInfo = fetchdata.artist;
    let albumSize = artistInfo.albumSize;
    let mvSize = artistInfo.mvSize;
    let musicSize = artistInfo.musicSize;
    var chartsOption;
    chartsOption = {
      tooltip: {
        trigger: "item",
      },
      legend: {
        top: "5%",
        left: "center",
      },
      series: [
        {
          name: artistInfo.name,
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: "40",
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            { value: musicSize, name: "单曲数" },
            { value: albumSize, name: "专辑数" },
            { value: mvSize, name: "MV数" },
          ],
        },
      ],
    };
    chartsOption && baseChart.setOption(chartsOption);
  });
}
onMounted(() => {
  getArtists();
});
</script>
<style scoped>
@import url(index.css);
</style>