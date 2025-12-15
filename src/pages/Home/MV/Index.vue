<template>
  <div class="mv-page">
    <div class="container">
      <!-- 分类导航 -->
      <div class="category-nav">
        <ul class="category-list">
          <li
            v-for="category in categories"
            :key="category.id"
            :class="{ active: currentCategory === category.id }"
            @click="switchCategory(category.id)"
            class="category-item"
          >
            {{ category.name }}
          </li>
        </ul>
      </div>

      <!-- MV 列表 -->
      <div class="mv-content">
        <div class="mv-grid">
          <div v-for="mv in mvList" :key="mv.id" class="mv-item">
            <div class="mv-cover" @click="playMv(mv)">
              <img :src="mv.cover" :alt="mv.title" />
              <div class="play-overlay">
                <span class="play-icon">▶</span>
              </div>
              <div class="mv-duration">{{ mv.duration }}</div>
            </div>
            <div class="mv-info">
              <h3 class="mv-title">{{ mv.title }}</h3>
              <p class="mv-artist">{{ mv.artist }}</p>
              <div class="mv-meta">
                <span class="mv-plays">播放量: {{ mv.plays }}</span>
                <span class="mv-date">{{ formatDate(mv.publishDate) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 加载更多 -->
        <div class="load-more" v-if="hasMore">
          <button @click="loadMore">加载更多</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { defineOptions } from "vue";
defineOptions({
  name: "MvPage",
});
import useMV from "./Index.js";
let {
  categories,
  currentCategory,
  mvList,
  hasMore,
  switchCategory,
  playMv,
  loadMore,
  formatDate,
  currentPage,
  itemsPerPage,
  filteredMvList,
  allMvData,
} = useMV();
</script>


<style lang="scss" scoped>
@import url("./Index.css");
</style>
