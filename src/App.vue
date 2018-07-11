<template>
  <div id="app">
    <Custom2048
      ref="custom2048"
      class="custom2048-outer-container"
      @changescore="handleChangeScore"
      @gameover="handleGameover"></Custom2048>
    <div class="menu-container">
      <div class="score-container">
        <div class="block current-score">
          得分
          <span>{{score}}</span>
        </div>
        <div class="block history-score">
          最高分
          <span>{{maxScore}}</span>
        </div>
      </div>
      <span class="block restart" @click="handleRestart">重新开始</span>
    </div>
  </div>
</template>

<script>
import Custom2048 from 'components/Custom2048'

export default {
  name: 'App',
  components: {
    Custom2048
  },
  data () {
    return {
      score: 0,
      maxScore: window.localStorage.getItem('custom2048_score') || 0
    }
  },
  watch: {
    score (val) {
      if (val > this.maxScore) {
        this.maxScore = val
        window.localStorage.setItem('custom2048_score', val)
      }
    }
  },
  methods: {
    handleRestart () {
      this.$nextTick(() => {
        this.score = 0
        this.$refs.custom2048.start()
      })
    },
    handleChangeScore (awardedMarks) {
      this.score += awardedMarks
    },
    handleGameover () {

    }
  }
}
</script>

<style lang="less">
  body {
    font-family: 'Microsoft YaHei';
    background-color: #faf8ef;
    .menu-container {
      width: 300px;
      margin: 0 auto;
      text-align: right;
    }
    .block {
      display: inline-block;
      padding: 3px 12px;
      height: 2;
      text-align: center;
      background-color: #8f7a66;
      color: #f9f6f2;
      border-radius: 6px;
      font-size: 18px;
      margin: 5px;
    }
    .score-container .block {
      color: rgba(255,255,255,0.6);
      font-size: 14px;
      width: 48px;
      background-color: rgba(143, 122, 102, .8);
      span {
        display: block;
        color: white;
      }
    }
    .restart {
      background-color: #d4430f;
      &:active {
        opacity: 0.8;
      }
    }
  }
</style>
