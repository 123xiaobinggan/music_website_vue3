<template>
  <div class="new-albums">
    <div class="container">
      <!-- 地区分类导航 -->
      <div class="region-tabs">
        <button
          v-for="(region, index) in regions"
          :key="index"
          :class="['tab', { active: currentRegion === region.key }]"
          @click="switchRegion(region.key)"
        >
          {{ region.name }}
        </button>
      </div>

      <!-- 专辑列表 -->
      <div class="albums-grid">
        <div
          v-for="(album, index) in filteredAlbums"
          :key="index"
          class="album-card"
        >
          <div class="album-cover">
            <img :src="album.cover" :alt="album.title" />
            <div class="play-overlay">
              <i class="fas fa-play-circle"></i>
            </div>
          </div>
          <div class="album-info">
            <h3 class="album-title">{{ album.title }}</h3>
            <p class="album-artist">{{ album.artist }}</p>
            <p class="album-date">{{ album.releaseDate }}</p>
          </div>
        </div>
      </div>

      <!-- 加载更多按钮 -->
      <div class="load-more" v-if="filteredAlbums.length >= albumsToShow">
        <button @click="loadMore">加载更多</button>
      </div>
    </div>
  </div>
</template>


<script setup>
import { defineOptions } from "vue";
defineOptions({
  name: "NewAlbumsPage",
});
import useNewAlbums from "./Index.js";
let { regions, albums, currentRegion, filteredAlbums, switchRegion, loadMore } =
  useNewAlbums();
</script>


<style lang="scss" scoped>
@import url("./Index.css");
</style>