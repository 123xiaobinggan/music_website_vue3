<template>
  <div class="index-page">
    <NaviGationBar />
    <router-view />
  </div>
</template>


<script>
import NaviGationBar from "../../components/NavigationBar.vue";
export default {
  name: "IndexPage",
  components: {
    NaviGationBar,
  },
};
</script>

<style lang="scss" scoped>
@import "Index.css";
</style>
