<template>

  <!-- 操作按钮区域 -->
  <div class="actions-bar">
    <div class="action-buttons">
      <button class="btn primary-btn">
        <span class="icon">▶</span> 播放全部
      </button>
      <button class="btn secondary-btn">
        <span class="icon">+</span> 添加到歌单
      </button>
      <button class="btn secondary-btn">
        <span class="icon">⬇</span> 下载
      </button>
      <button class="btn secondary-btn">
        <span class="icon">☑</span> 批量操作
      </button>
    </div>
  </div>

  <!-- 歌曲列表表头 -->
  <div class="songs-header">
    <div class="header-item" style="text-align: left">歌曲</div>
    <div class="header-item">歌手</div>
    <div class="header-item">专辑</div>
    <div class="header-item duration-col">时长</div>
  </div>

  <!-- 歌曲列表 -->
  <div class="songs-list">
    <div v-for="song in songs" :key="song.id" class="song-item">
      <div class="song-index">{{ song.index }}</div>
      <div class="song-info">
        <div class="song-name">{{ song.name }}</div>
      </div>

      <!-- 歌手区域，包含悬浮按钮 -->
      <div class="song-artist-wrapper">
        <div class="song-action-buttons">
          <button class="action-btn play-btn" @click.stop="playSong(song)">
            ▶
          </button>
          <button class="action-btn add-btn" @click.stop="addToPlaylist(song)">
            +
          </button>
          <button class="action-btn delete-btn" @click.stop="deleteSong(song)">
            ×
          </button>
        </div>
        <div class="song-artist">{{ song.artist }}</div>
      </div>

      <div class="song-album">{{ song.album }}</div>
      <div class="song-duration">{{ song.duration }}</div>
    </div>
  </div>
</template>



<script setup>
import { defineOptions} from "vue";
defineOptions({
  name: "MyPlayListDetailPage",
});

import useMyPlayListDetail  from "./Index.js";
let { songs, playSong, addToPlaylist, deleteSong } = useMyPlayListDetail();
</script>


<style scoped>
@import url("./Index.css");
</style>