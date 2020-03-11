<template>
  <div>
      <h1>hello Vue</h1>
      <router-link to='/'>home</router-link>
      <router-link to='/about'>about</router-link>
      <router-view/>
  </div>
</template>

<script>
export default {
  props: {},
  components: {},
  data() {
    return {
    }
  },
}
</script>
<style lang="less" scoped>
</style>