<template>
  <div class="index-page">
    <NaviGationBar />
    <router-view />
    <MusicPlayer />
  </div>
</template>


<script setup>
import NaviGationBar from "../../components/NavigationBar.vue";
import MusicPlayer from "../../components/MusicPlayer.vue";
import { defineOptions } from "vue";
defineOptions({
  name: "IndexPage",
});

</script>

<style lang="scss" scoped>
@import "Index.css";
</style>
