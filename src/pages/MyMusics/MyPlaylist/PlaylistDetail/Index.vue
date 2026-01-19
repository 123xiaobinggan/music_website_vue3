<template>
  <div class="playlist-detail-page">
    <!-- 操作按钮区域 -->
    <div class="actions-bar">
      <div class="action-buttons">
        <button class="btn primary-btn" @click.stop="playerStore.setPlaylist(playlistName)">
          <span class="icon">▶</span> 播放全部
        </button>
        <button class="btn secondary-btn">
          <span class="icon">+</span> 添加到歌单
        </button>
        <button class="btn secondary-btn">
          <span class="icon">☑</span> 批量操作
        </button>
        <button class="btn secondary-btn" @click.stop="isShowModal = true">
          <span class="icon">⚙️</span> 设置
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
        v-for="song in userStore.user.playlists.find(
          (playlist) => playlist.name === playlistName
        )?.songs"
        :key="song.title"
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
            <button class="action-btn play-btn" @click.stop="playSong(song)">
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

    <!-- 隐藏的文件输入 -->
    <input
      type="file"
      ref="fileInput"
      class="file-input-hidden"
      accept="image/*"
      @change="handleFileUpload"
    />
  </div>

  <!-- 设置弹窗 -->
  <div v-if="isShowModal" class="modal-overlay" @click="isShowModal = false">
    <div class="modal-content" @click.stop>
      <div class="modal-close" @click="isShowModal = false">✕</div>
      <h2>设置</h2>

      <!-- 封面预览和上传 -->
      <div class="cover-section">
        <label>歌单封面：</label>
        <div class="cover-preview-container">
          <img :src="coverUrl" alt="封面预览" class="cover-preview" />
          <div class="cover-overlay">
            <button class="change-cover-btn" @click="triggerFileSelect">
              更换封面
            </button>
          </div>
        </div>
      </div>

      <div class="modal-input">
        <label for="playlistName">歌单名称：</label>
        <input
          type="text"
          id="playlistName"
          v-model="newPlaylistName"
          :disabled="
            newPlaylistName === '最近听过' || newPlaylistName === '我喜欢'
          "
        />
      </div>

      <div class="modal-buttons">
        <button class="cancel-btn" @click="isShowModal = false">取消</button>
        <button class="save-btn" @click="save">保存</button>
      </div>
    </div>
  </div>

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
import { useUserStore } from "../../../../store/user.js";
import { usePlayerStore } from "../../../../store/player.js";
import MessageBox from "@/components/MessageBox.vue";
defineOptions({
  name: "MyPlaylistDetailPage",
});
const userStore = useUserStore();
const playerStore = usePlayerStore();
import useMyPlaylistDetail from "./Index.js";
let {
  isShowModal,
  newPlaylistName,
  coverUrl,
  fileInput,
  playlistName,
  messageBox,
  showDropdown,
  dropdownPosition,
  selectedSong,
  dropdownDirection,
  init,
  playSong,
  addSongToPlaylist,
  deleteSong,
  save,
  triggerFileSelect,
  handleFileUpload,
  showPlaylistDropdown,
  hidePlaylistDropdown,
  handleClickOutside,
} = useMyPlaylistDetail();

onMounted(() => {
  init();
  document.addEventListener("click", handleClickOutside);
});

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