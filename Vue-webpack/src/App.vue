<template>
  <div>
    <h1 @click="handleStart">hello Vue</h1>
    <router-link to='/'>home</router-link>
    <router-link to='/about'>about</router-link>
    <router-view />
  </div>
</template>

<script>
export default {
  props: {},
  components: {},
  data() {
    return {};
  },
  mounted () {
  },
  methods: {
    handleStart(){
      console.log(123)
    }
  },
};
</script>
   
<style lang="less" scoped>
</style>