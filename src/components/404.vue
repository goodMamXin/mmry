<template>
  <div class="container">
    <h2>{{msg}}</h2>
    <router-link to="/">回到首页</router-link>
  </div>
</template>

<script>

export default {
    name : '404',
    data () {
    return {
      msg: '未找到页面'
    }
  },
}
</script>