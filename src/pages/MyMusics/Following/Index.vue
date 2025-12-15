<template>
  <h1>{{ msg }}</h1>
</template>


<script setup>
import { defineOptions } from "vue";
defineOptions({
  name: "FollowingPage",
});
import useFllowing from "./Index.js";
let { msg } = useFllowing();
</script>


<style scoped>
@import url("./Index.css");
</style>