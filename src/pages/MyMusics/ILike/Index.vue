<template>
  <div class="ilike-page">
    <!-- 背景图外侧导航 -->
    <div class="outer-nav">
      <ul class="nav-tabs">
        <li class="tab-item active">歌曲</li>
        <li class="tab-item">专辑</li>
      </ul>
    </div>

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
        v-for="song in userStore.user.ILike.songs"
        :key="song.songKey"
        class="song-item"
        :class="{
          'no-hover': showDropdown && selectedSong.songKey !== song.songKey,
          'locked-hover': selectedSong?.songKey === song.songKey,
        }"
      >
        <div class="song-index"></div>
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
              class="action-btn delete-btn"
              @click.stop="deleteSong(song)"
            >
              ×
            </button>
          </div>
          <div class="song-artist">{{ song.artist }}</div>
        </div>

        <div class="song-album">{{ song.album }}</div>
        <div class="song-duration">{{ playerStore.formatDuration(song.duration) }}</div>
      </div>
    </div>
  </div>

  <!-- 删除确认框 -->
  <MessageBox
    :visible="messageBox.visible"
    :message="messageBox.message"
    @confirm="messageBox.confirmCallback"
    @cancel="messageBox.cancelCallback"
  />

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
</template>


<script setup>
import { defineOptions, onMounted, watch, computed } from "vue";
import { useUserStore } from "../../../store/user.js";
import { usePlayerStore } from "../../../store/player.js";
import MessageBox from "@/components/MessageBox.vue";
defineOptions({
  name: "ILikePage",
});
import useILike from "./Index.js";
const userStore = useUserStore();
const playerStore = usePlayerStore();
let {
  dropdownPosition,
  showDropdown,
  selectedSong,
  dropdownDirection,
  messageBox,
  playSong,
  addSongToPlaylist,
  deleteSong,
  showMessageBox,
  hideMessageBox,
  showPlaylistDropdown,
  hidePlaylistDropdown,
  handleClickOutside,
} = useILike();

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
})

watch(
  // 使用可选链安全查找
  () => {
    const playlist = userStore.user.playlists.find((p) => p.name === "我喜欢");
    console.log("ILike playlist", playlist);
    return playlist?.songs || []; // 提供默认值
  },
  (newSongs, oldSongs) => {
    // 安全赋值
    if (!userStore.user.ILike) {
      userStore.user.ILike = {};
    }
    userStore.user.ILike.songs = newSongs;
    console.log('"我喜欢"歌单的歌曲已同步:', newSongs.length, "首");
  },
  {
    deep: true, // 深度监听 songs 数组变化
    immediate: true, // 立即执行一次，初始化同步
  }
);

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
</script>

<style scoped>
@import url("./Index.css");
</style>
