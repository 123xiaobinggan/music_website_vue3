<template>
  <div class="rankings-page">
    <div class="container">
      <!-- 排行榜信息条（表头） -->
      <div class="rankings-header">
        <div class="header-cover"></div>
        <!-- 封面占位 -->
        <div class="header-song">歌曲</div>
        <div class="header-artist">歌手</div>
        <div class="header-duration">时长</div>
      </div>

      <!-- 排行榜列表 -->
      <div class="rankings-list">
        <div
          v-for="(song, index) in rankings"
          :key="song.id"
          class="ranking-item"
          :class="{ 'top-three': index < 3 }"
        >
          <!-- 排名 -->
          <div class="rank-number">
            <span v-if="index < 3" class="medal">{{ getMedal(index) }}</span>
            <span v-else class="number">{{ index + 1 }}</span>
          </div>

          <!-- 歌曲图片 -->
          <div class="song-cover">
            <img :src="song.cover" :alt="song.title" />
          </div>

          <!-- 歌曲名 -->
          <div class="song-songname">
            <text>{{ song.title }}</text>
          </div>

          <!-- 操作按钮 + 歌手 -->
          <div class="artist-wrapper">
            <!-- 操作按钮 -->
            <div class="song-actions">
              <span class="action-btn play" @click="playSong(song)">▶</span>
              <span class="action-btn add" @click="addToPlaylist(song)"
                >+</span
              >
              <span class="action-btn share" @click="shareSong(song)">↗</span>
            </div>

            <!-- 歌手 -->
            <p class="song-artist">{{ song.artist }}</p>
          </div>

          <!-- 音乐时长 -->
          <div class="song-duration">
            {{ song.duration }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineOptions } from "vue";
defineOptions({
  name: "RankingsPage",
});
import useRankings from "./Index.js";
let { rankings, getMedal, playSong, addToPlaylist, shareSong } = useRankings();
</script>


<style scoped>
@import url("./Index.css");
</style>
