<template>
  <div class="artistbox">
    <el-card>
      <div id="baseChart"></div>
    </el-card>
    <el-card v-loading="loading">
      <div id="activeChart"></div>
    </el-card>
  </div>
</template>
<script setup>
import { request } from "../../config/request";
import { getCurrentInstance, defineExpose, ref } from "vue";
import axios from "axios";
// 应用实例
const instance = getCurrentInstance();
const globalProperty = instance.appContext.config.globalProperties;
const echarts = globalProperty.$echarts;
const loading = ref(false);
function renderEcharts(curId) {
  axios.all([getbaseChart(curId), getComment(curId)]).then((res) => {
    renderBaseChart(res[0]);
    mergeCommentArr(res[1]);
    // renderCommentChart(res[1]);
  });
}

// 请求接口，获取热门歌曲评论

const getComment = function (curId) {
  // 获取热门歌曲
  let songoption = {
    url: `artist/top/song?id=${curId}`,
  };
  return request(songoption);
};

// 请求接口，获取单曲、MV、专辑数量
const getbaseChart = function (curId) {
  // 获取当前音乐人id
  let baseoptions = {
    url: `/artist/detail?id=${curId}`,
  };
  return request(baseoptions);
};

// 获取歌曲评论

const getCommentInfo = function (item) {
  let commentoptions = {
    url: `/comment/music?id=${item.id}`,
  };
  return request(commentoptions);
};

//合并数组，热门歌曲以及评论数

const mergeCommentArr = async function (res) {
  loading.value = true;
  let songs = res.data.songs;
  let lens = songs.length;
  let commentArr = new Array(lens).fill(null).map((item) => new Object());
  // for循环中异步请求数据可使用async await 避免出现获取不到数据的情况 ,forEach 和 map 无法使用async/await
  for (let i = 0; i < lens; i++) {
    commentArr[i]["name"] = songs[i].name;
    const comments = await getCommentInfo(songs[i]);
    commentArr[i]["comments"] = comments.data.total;
  }
  renderCommentChart(commentArr);
};

// 整合数组，并使用echart渲染数据
const renderCommentChart = function (data) {
  const activeChart = echarts.init(document.getElementById("activeChart"));
  const songsName = new Array(data.length);
  const commentsArr = new Array(data.length);
  data.map((item, index) => {
    songsName[index] = item.name;
    commentsArr[index] = item.comments;
  });
  loading.value = false;
  console.log(songsName);
  console.log(commentsArr);
  //echart 渲染数据
  const activeOptions = {
    grid: {
      left: "20", // 固定左边刻度宽度
      containLabel: true,
    },
    dataZoom: [
      {
        type: "inside",
      },
      {
        type: "slider",
      },
    ],
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    xAxis: {
      show: false,
      type: "category",
      data: songsName,
    },
    yAxis: {
      type: "value",
      data: commentsArr,
    },
    series: [
      {
        data: commentsArr,
        type: "bar",
      },
    ],
  };
  activeChart.setOption(activeOptions);
};

const renderBaseChart = function (res) {
  const baseChart = echarts.init(document.getElementById("baseChart"));
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
            fontSize: "20",
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
};

defineExpose({
  renderEcharts,
});
</script>
<style scoped>
#baseChart {
  width: 300px;
  height: 300px;
}
#activeChart {
  width: 300px;
  height: 300px;
}
</style>