<template>
  <h1>{{ msg }}</h1>
</template>



<script setup>
import { defineOptions } from "vue";
defineOptions({
  name: "MyPlayListPage",
});
import useMyPlayList from "./Index.js";
let { msg } = useMyPlayList();
</script>

<style scoped>
@import url("Index.css");
</style>
