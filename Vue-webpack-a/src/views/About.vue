<template>
  <div class="about">
      <h3>About</h3>
      <div class="img">
        <img src="https://avatars1.githubusercontent.com/u/34123694?s=60&v=4" alt="">
      </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  props: {},
  components: {},
  data() {
    return {
    }
  },
  mounted () {
    axios.get('/vue/api/header.json').then(res => {
      console.log('res---:', res)
    })
    // this.axios.get('/list.json').then(res => {
    //   console.log('res---:', res)
    // })
  },
}
</script>
<style lang="less" scoped>
.about{
    img{
        width: 200px;
        height: 200px;
        border-radius: 50%;
    }
}
</style>