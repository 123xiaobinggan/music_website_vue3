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
            v-for="playlist in playlists"
            :key="playlist.id"
            class="playlist-row"
            @mouseenter="hoveredPlaylistId = playlist.id"
            @mouseleave="hoveredPlaylistId = null"
            @click="goToPlaylist(playlist.id)"
          >
            <td class="playlist-name">
              <div class="playlist-info">
                <img
                  :src="playlist.cover || defaultCover"
                  :alt="playlist.name"
                  class="playlist-cover"
                />
                <span class="playlist-title">{{ playlist.name }}</span>
                <!-- 悬浮时在歌单名称列的最右侧显示播放按钮 -->
                <button
                  v-if="hoveredPlaylistId === playlist.id"
                  class="play-button"
                  @click.stop="playPlaylist(playlist.id)"
                >
                  <i class="fas fa-play"></i>
                </button>
              </div>
            </td>
            <td class="track-count">
              <div class="track-count-content">
                <span class="count-text">{{ playlist.trackCount }}</span>
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
              <button class="upload-button" @click="triggerCoverUpload">
                上传封面
              </button>
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
</template>

<script setup>
import { defineOptions } from "vue";
defineOptions({
  name: "MyPlayListAllPage",
});
import useMyPlayList from "./Index.js";
let {
  playlists,
  hoveredPlaylistId,
  isCreateModalVisible,
  newPlaylist,
  coverInput,
  showCreateModal,
  hideCreateModal,
  triggerCoverUpload,
  handleCoverChange,
  createPlaylist,
  playPlaylist,
  goToPlaylist,
} = useMyPlayList();
</script>

<style scoped>
@import url('./Index.css')
</style>
