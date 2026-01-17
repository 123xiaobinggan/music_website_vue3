<template>
  <div class="songs-page-wrapper">
    <div class="scroll-content">
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
        <div
          v-for="song in songs"
          :key="song.songKey || song.title"
          class="song-item"
          :class="{
            'no-hover': showDropdown && selectedSong.songKey !== song.songKey,
            'locked-hover': selectedSong?.songKey === song.songKey,
          }"
        >
          <div class="song-index">{{ song.index }}</div>
          <div class="song-info">
            <div class="song-name">{{ song.title }}</div>
          </div>

          <!-- 歌手区域，包含悬浮按钮 -->
          <div class="song-artist-wrapper">
            <div class="song-action-buttons">
              <button
                class="action-btn play-btn"
                @click.stop="playerStore.playSong(song)"
              >
                ▶
              </button>
              <button
                class="action-btn add-btn"
                @click.stop="showPlaylistDropdown(song, $event)"
              >
                +
              </button>
              <button
                class="action-btn next-btn"
                id="下一首播放"
                @click.stop="playerStore.setSongAsNext(song)"
              >
                <i class="fas fa-step-forward"></i>
              </button>
            </div>
            <div class="song-artist">{{ song.artist }}</div>
          </div>

          <div class="song-album">{{ song.album }}</div>
          <div class="song-duration">{{ formatDuration(song.duration) }}</div>
        </div>
      </div>

      <!-- 歌单下拉菜单 -->
      <div v-if="showDropdown" class="playlist-dropdown" :style="dropdownStyle">
        <div class="dropdown-header">
          <span>添加到歌单</span>
          <button class="close-btn" @click.stop="hidePlaylistDropdown()">
            &times;
          </button>
        </div>
        <div class="playlist-list">
          <div
            v-for="playlist in userStore.user.playlists.filter(
              (playlist) => playlist.name !== '最近听过'
            )"
            :key="playlist.name"
            class="playlist-item"
            @click.stop="addSongToPlaylist(playlist.name)"
          >
            <img class="playlist-cover" :src="playlist.coverUrl" />
            <span class="playlist-name">{{ playlist.name }}</span>
            <span class="song-count"
              >({{ playlist.songs ? playlist.songs.length : 0 }})</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  defineOptions,
  onMounted,
  onUnmounted,
  nextTick,
  watch,
  computed,
} from "vue";
import { usePlayerStore } from "../../../store/player.js";
import { useUserStore } from "../../../store/user.js";
defineOptions({
  name: "SongsSearchPage",
});

import useSongsSearch from "./Index.js";
const playerStore = usePlayerStore();
const userStore = useUserStore();
let {
  songs,
  loading,
  selectedSong,
  showDropdown,
  dropdownPosition,
  dropdownDirection,
  search_songs,
  showPlaylistDropdown,
  hidePlaylistDropdown,
  handleClickOutside,
  addSongToPlaylist,
  formatDuration,
} = useSongsSearch();

watch(
  () => showDropdown.value,
  (newVal) => {
    if (newVal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }
);

const dropdownStyle = computed(() => {
  const style = {
    position: "fixed",
    left: `${dropdownPosition.value.left}px`,
    zIndex: 9999,
  };

  if (dropdownDirection.value === "bottom-right") {
    style.top = `${dropdownPosition.value.top}px`;
  } else {
    style.top = `${dropdownPosition.value.top}px`;
    style.transform = "translateY(-100%)";
  }
  return style;
});

onMounted(async () => {
  // 等待DOM完全渲染
  await nextTick();
  await search_songs();

  document.addEventListener("click", handleClickOutside);
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

const handleScroll = async (event) => {
  const scrollTop =
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    document.body.scrollTop;
  const scrollHeight =
    document.documentElement.scrollHeight || document.body.scrollHeight;
  const clientHeight =
    document.documentElement.clientHeight || document.body.clientHeight;

  // console.log("滚动位置:", scrollTop);

  // 检测是否滚动到底部
  if (scrollHeight - scrollTop <= clientHeight + 50) {
    // 50px 容差
    console.log("滚动到底部");
    if (loading.value === false) {
      search_songs();
      loading.value = true;
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 等待2秒
      loading.value = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import url("./Index.css");
</style>
