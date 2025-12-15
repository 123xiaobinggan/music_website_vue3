<template>
  <HomeNavigationBar />
  <router-view />
</template>


<script setup>
import HomeNavigationBar from "@/components/HomeNavigationBar.vue";
import { defineOptions } from "vue";
defineOptions({
  name: "HomePage",
});
import useHome from "./Index.js";
let { msg } = useHome();
</script>


<style scoped>
@import url("Index.css");
</style>