<template>
  <div id="app">
    <Custom2048></Custom2048>
  </div>
</template>

<script>
import Custom2048 from 'components/Custom2048'
export default {
  name: 'App',
  components: {
    Custom2048
  }
}
</script>

<style lang="less">
  body {
    background-color: #978e81;
  }
</style>
