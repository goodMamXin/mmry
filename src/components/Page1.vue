<template>
    <div class="page1">       
        <p>{{msg}}</p>
    </div>
</template>
<script>
    export default {
        name: 'page1',
        data () {
            return {
                msg: "我是page1组件"
            }
        }
    }
</script>
<style scoped>
.page1 p {
  font-weight: normal;
  color:#333;
}
</style>