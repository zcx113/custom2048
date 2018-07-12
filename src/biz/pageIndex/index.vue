<template>
  <div class="pageIndex">
    <ul>
      <li v-for="(item, key) in list" :key="key">
        <h2>{{key}}</h2>
        <nav v-for="(item2, key2) in item" :key="key2">
          <router-link :to="key2" class="block-link">
            {{item2.meta && item2.meta.title || key2}}
          </router-link>
        </nav>
      </li>
    </ul>
  </div>
</template>
<script>
import routerConfig from 'src/router-config'
console.log(routerConfig)
export default {
  data () {
    return {
      list: routerConfig
    }
  }
}
</script>
<style lang="less">
  body {
    background-color: #efeff4;
  }
  .pageIndex {
    li {
      h2 {
        padding: 0 16px;
      }
      h2, nav {
        height: 44px;
        line-height: 44px;
      }
      nav {
        position: relative;
        padding-left: 16px;
        background-color: white;
        margin-bottom: 1px;
        &::after {
          content: '';
          position: absolute;
          right: 16px;
          top: 50%;
          width: 10px;
          height: 10px;
          border: 1px solid #ddd;
          border-width: 1px 1px 0 0;
          transform: rotate(45deg) translateY(-50%);
        }
      }
      .block-link {
        display: block;
      }
    }
  }
</style>
