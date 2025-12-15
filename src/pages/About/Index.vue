<template>
  <div class="about-page">
    <h1 class="title">{{ title }}</h1>
    <p v-for="i in member" :key="i">{{ i.name }}</p>
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
