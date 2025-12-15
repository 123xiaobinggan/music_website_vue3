<template>
  <h1>{{ msg }}</h1>
</template>


<script setup>
import { defineOptions } from "vue";
defineOptions({
  name: "FollowersPage",
});
import useFlowers from "./Index.js";
let { msg } = useFlowers();
</script>


<style scoped>
@import url("Index.css");
</style>