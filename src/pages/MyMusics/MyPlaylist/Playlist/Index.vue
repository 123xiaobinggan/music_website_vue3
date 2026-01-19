<template>
  <div class="playlists-container">
    <!-- 新建歌单按钮 -->
    <div class="header">
      <button class="create-playlist-btn" @click="showCreateModal">
        <i class="fas fa-plus"></i>
        新建歌单
      </button>
    </div>

    <!-- 歌单列表 -->
    <div class="playlists-list">
      <table class="playlists-table">
        <thead>
          <tr>
            <th class="playlist-name-header">歌单</th>
            <th class="track-count-header">曲目数</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="playlist in userStore.user.playlists.filter((playlist) => playlist.name !== '我喜欢')"
            :key="playlist.name"
            class="playlist-row"
            @mouseenter="hoveredPlaylistId = playlist.name"
            @mouseleave="hoveredPlaylistId = null"
            @click="goToPlaylist(playlist.name)"
          >
            <td class="playlist-name">
              <div class="playlist-info">
                <img
                  :src="playlist.coverUrl || defaultCover"
                  :alt="playlist.name"
                  class="playlist-cover"
                />
                <span class="playlist-title">{{ playlist.name }}</span>
                <div class="button-group">
                  <!-- 悬浮时在歌单名称列的最右侧显示删除按钮 -->
                  <button
                    v-if="hoveredPlaylistId === playlist.name"
                    class="delete-button"
                    @click.stop="deletePlaylist(playlist.name)"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                  <!-- 悬浮时在歌单名称列的最右侧显示播放按钮 -->
                  <button
                    v-if="hoveredPlaylistId === playlist.name"
                    class="play-button"
                    @click.stop="playerStore.setPlaylist(playlist.name)"
                  >
                    <i class="fas fa-play"></i>
                  </button>
                </div>
              </div>
            </td>
            <td class="track-count">
              <div class="track-count-content">
                <span class="count-text">{{ playlist.songs.length }}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 新建歌单模态框 -->
    <div
      v-if="isCreateModalVisible"
      class="modal-overlay"
      @click="hideCreateModal"
    >
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h3>新建歌单</h3>
          <button class="close-button" @click="hideCreateModal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="playlistName">歌单名称</label>
            <input
              type="text"
              id="playlistName"
              v-model="newPlaylist.name"
              placeholder="请输入歌单名称"
              maxlength="40"
            />
          </div>
          <div class="form-group">
            <label>封面</label>
            <div class="cover-upload">
              <div class="cover-preview-wrapper">
                <img
                  :src="newPlaylist.coverPreview || defaultCover"
                  alt="封面预览"
                  class="cover-preview"
                />
                <input
                  type="file"
                  ref="coverInput"
                  accept="image/*"
                  @change="handleCoverChange"
                  style="display: none"
                />
                <button
                  class="cover-overlay-button"
                  @click="triggerCoverUpload"
                >
                  <i class="fas fa-edit"></i>
                  选择封面
                </button>
              </div>
            </div>
          </div>
          <div class="form-actions">
            <button class="cancel-button" @click="hideCreateModal">取消</button>
            <button class="confirm-button" @click="createPlaylist">创建</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <MessageBox
    :visible="messageBox.visible"
    :message="messageBox.message"
    @confirm="messageBox.confirmCallback"
    @cancel="messageBox.cancelCallback"
  />
</template>

<script setup>
import { defineOptions, onMounted } from "vue";
import { useUserStore } from "../../../../store/user.js";
import { usePlayerStore } from "../../../../store/player.js";
import MessageBox from "../../../../components/MessageBox.vue";
defineOptions({
  name: "MyPlaylistAllPage",
});
const userStore = useUserStore();
const playerStore = usePlayerStore();
import useMyPlaylist from "./Index.js";
let {
  hoveredPlaylistId,
  isCreateModalVisible,
  newPlaylist,
  coverInput,
  messageBox,
  showCreateModal,
  hideCreateModal,
  showMessage,
  triggerCoverUpload,
  handleCoverChange,
  createPlaylist,
  playPlaylist,
  goToPlaylist,
  deletePlaylist,
} = useMyPlaylist();
</script>

<style scoped>
@import url("./Index.css");
</style>
