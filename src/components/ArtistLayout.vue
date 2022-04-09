<template>
  <div class="artistbox">
    <el-card>
      <div id="baseChart"></div>
    </el-card>
    <el-card>
      <div id="activeChart"></div>
    </el-card>
  </div>
</template>
<script setup>
import { request } from "../../config/request";
import { getCurrentInstance, defineExpose } from "vue";
import axios from "axios";
import { objectKeys } from "@antfu/utils";
import { comment } from "postcss";
// 应用实例
const instance = getCurrentInstance();
const globalProperty = instance.appContext.config.globalProperties;
const echarts = globalProperty.$echarts;
function renderEcharts(curId) {
  axios.all([getbaseChart(curId), getComment(curId)]).then((res) => {
    renderBaseChart(res[0]);
    renderCommentChart(res[1]);
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

// 整合数组，并使用echart渲染数据
const renderCommentChart = function (res) {
  const activeChart = echarts.init(document.getElementById("activeChart"));
  let songs = res.data.songs;
  let commentArr = [];
  //   let commentArr = new Array(songs.length)
  //     .fill(null)
  //     .map((item) => new Object());
  songs.forEach((item) => {
    let tempObj = {};
    tempObj["name"] = item.name;
    let commentoptions = {
      url: `/comment/music?id=${item.id}`,
    };
    request(commentoptions).then((cmtRes) => {
      tempObj["comments"] = cmtRes.data.total;
      commentArr.push(tempObj);
    });
  });
  console.log(commentArr);
  console.log(commentArr[0]);
  //   console.log(JSON.parse(commentArr[0]));
  //   let songsName = new Array(commentArr.length);
  //   let data = new Array(commentArr.length);
  //   console.log(data);
  //   commentArr.forEach((item, index) => {
  //     // songsName[index] = item.name;
  //     // comments[index] = item.comments;
  //   });
  //echart 渲染数据
  //   const data = [];
  //   for (let i = 0; i < 5; ++i) {
  //     data.push(Math.round(Math.random() * 200));
  //   }
  //   option = {
  //     xAxis: {
  //       max: "dataMax",
  //     },
  //     yAxis: {
  //       type: "category",
  //       data: ["A", "B", "C", "D", "E"],
  //       inverse: true,
  //       animationDuration: 300,
  //       animationDurationUpdate: 300,
  //       max: 2, // only the largest 3 bars will be displayed
  //     },
  //     series: [
  //       {
  //         realtimeSort: true,
  //         name: "X",
  //         type: "bar",
  //         data: data,
  //         label: {
  //           show: true,
  //           position: "right",
  //           valueAnimation: true,
  //         },
  //       },
  //     ],
  //     legend: {
  //       show: true,
  //     },
  //     animationDuration: 0,
  //     animationDurationUpdate: 3000,
  //     animationEasing: "linear",
  //     animationEasingUpdate: "linear",
  //   };
  //   function run() {
  //     for (var i = 0; i < data.length; ++i) {
  //       if (data[i] > 100) {
  //         data[i] = 100;
  //         clearInterval();
  //       } else {
  //         data[i] += 2;
  //       }
  //     }
  //     myChart.setOption({
  //       series: [
  //         {
  //           type: "bar",
  //           data,
  //         },
  //       ],
  //     });
  //   }
  //   setTimeout(function () {
  //     run();
  //   }, 0);
  //   setInterval(function () {
  //     run();
  //   }, 3000);
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
</style>