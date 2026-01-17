<template>
  <div class="search-container">
    <!-- 背景图 -->
    <div class="search-background" :style="{ backgroundImage: `url(${backgroundImage})` }">
      <div class="search-overlay"></div>
      <!-- 搜索框 -->
      <div class="search-box-container">
        <div class="search-input-wrapper">
          <i class="fas fa-search search-icon"></i>
          <input
            v-model="searchKeyword"
            type="text"
            class="search-input"
            placeholder="搜索音乐、艺术家或专辑"
            @keyup.enter="search"
          />
          <button class="search-button" @click="search" >搜索</button>
        </div>
      </div>
    </div>

    <!-- 搜索结果区域 -->
    <div class="search-results-container">
      <!-- 菜单导航栏 -->
      <div class="search-menu-nav">
        <router-link
          v-for="tab in tabs"
          :key="tab.key"
          :to="{
            path: tab.path,
            query: { keyword: searchKeyword },
          }"
          class="menu-nav-item"
          :class="{ active: $route.path.includes(tab.key) }"
        >
          {{ tab.name }}
        </router-link>
      </div>

      <!-- 路由视图 -->
      <router-view :searchResults="results" :currentKeyword="searchKeyword" />
    </div>
  </div>
</template>



<script setup>
import { defineOptions, onMounted } from "vue";
defineOptions({
  name: "SearchPage",
});

import useSearch from "./Index.js";
let { searchKeyword, tabs, backgroundImage, search } = useSearch();

onMounted(() => {});
</script>


<style lang="scss" scoped>
@import url("./Index.css");
</style>
