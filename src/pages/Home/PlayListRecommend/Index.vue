<template>
  <div class="playlist-recommend">
    <!-- 歌单推荐 -->
    <div class="section">
      <h2 class="section-title">歌单推荐</h2>
      <div class="carousel-container">
        <button class="carousel-btn prev" @click="prevPlaylistPage">
          <i class="fas fa-chevron-left"></i>
        </button>

        <div class="carousel-wrapper">
          <div
            class="carousel-track"
            :style="{ transform: `translateX(-${playlistCurrentPage * 100}%)` }"
          >
            <div
              v-for="(page, pageIndex) in playlistPages"
              :key="pageIndex"
              class="carousel-page"
            >
              <div
                v-for="(playlist, index) in page"
                :key="index"
                class="playlist-item"
              >
                <div class="playlist-cover">
                  <img :src="playlist.cover" :alt="playlist.title" />
                  <div class="play-overlay">
                    <i class="fas fa-play-circle"></i>
                  </div>
                </div>

                <div class="playlist-info">
                  <h3 class="playlist-title">{{ playlist.title }}</h3>
                  <br />
                  <p class="playlist-desc">{{ playlist.description }}</p>
                </div>
                
              </div>
            </div>
          </div>
        </div>

        <button class="carousel-btn next" @click="nextPlaylistPage">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>

      <div class="carousel-indicators">
        <span
          v-for="(page, index) in playlistPages"
          :key="index"
          :class="{ active: playlistCurrentPage === index }"
          @click="goToPlaylistPage(index)"
        ></span>
      </div>
    </div>
    <!-- 新歌首发 -->
    <div class="section">
      <h2 class="section-title">新歌首发</h2>
      <div class="carousel-container">
        <button class="carousel-btn prev" @click="prevNewSongPage">
          <i class="fas fa-chevron-left"></i>
        </button>

        <div class="carousel-wrapper">
          <div
            class="carousel-track"
            :style="{ transform: `translateX(-${newSongCurrentPage * 100}%)` }"
          >
            <div
              v-for="(page, pageIndex) in newSongPages"
              :key="pageIndex"
              class="carousel-page"
            >
              <div
                v-for="(playlist, index) in page"
                :key="index"
                class="playlist-item"
              >
                <div class="playlist-cover">
                  <img :src="playlist.cover" :alt="playlist.title" />
                  <div class="play-overlay">
                    <i class="fas fa-play-circle"></i>
                  </div>
                </div>
                <div class="playlist-info">
                  <h3 class="playlist-title">{{ playlist.title }}</h3>
                  <p class="playlist-desc">{{ playlist.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button class="carousel-btn next" @click="nextNewSongPage">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>

      <div class="carousel-indicators">
        <span
          v-for="(page, index) in newSongPages"
          :key="index"
          :class="{ active: newSongCurrentPage === index }"
          @click="goToNewSongPage(index)"
        ></span>
      </div>
    </div>
  </div>
</template>


<script setup>
import { defineOptions } from "vue";
defineOptions({
  name: "PlayListRecommendPage",
});
import usePlayListRecommend from "./Index.js";
let {
  playlists,
  newSongs,
  playlistPages,
  newSongPages,
  playlistCurrentPage,
  newSongCurrentPage,
  nextPlaylistPage,
  prevPlaylistPage,
  goToPlaylistPage,
  nextNewSongPage,
  prevNewSongPage,
  goToNewSongPage,
} = usePlayListRecommend();
</script>

<style lang="scss" scoped>
@import url("./Index.css");
</style>