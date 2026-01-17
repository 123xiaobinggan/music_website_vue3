<template>
  <div class="about-page">
    <h1 class="title">{{ title }}</h1>
    <h2 >by 小饼干</h2>
    <p>QQ: 1398865656</p>
  </div>
</template>

<script setup>
import { defineOptions } from "vue";
defineOptions({
  name: "AboutPage",
});
import useAbout from "./Index.js";
let { title,member } = useAbout();
</script>

<style scoped>
@import url("Index.css");
</style>
