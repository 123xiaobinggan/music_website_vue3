<template>
  <div class="music-player">
    <!-- 主播放控制栏 -->
    <div class="player-bar" v-if="playerStore.currentSong">
      <div class="song-info" @click="toggleExpanded">
        <img
          :src="playerStore.currentSong.coverUrl || defaultCover"
          :class="{ playing: playerStore.isPlaying }"
          alt="歌曲封面"
        />
        <div class="song-text">
          <div class="song-name">{{ playerStore.currentSong.title }}</div>
          <div class="song-artist">{{ playerStore.currentSong.artist }}</div>
        </div>
      </div>

      <div class="control-buttons">
        <!-- 播放模式选择框 -->
        <button @click="toggleMode" title="播放模式">
          <i :class="getPlayModeIcon()"></i>
        </button>

        <!-- 播放模式选项框 -->
        <div v-if="showMode" class="mode-options" @click.stop>
          <div
            v-for="mode in modeOptions"
            :key="mode.value"
            :class="{ active: playerStore.playMode === mode.value }"
            class="mode-option"
            @click="selectPlayMode(mode.value)"
          >
            <i :class="mode.icon"></i>
            <span>{{ mode.text }}</span>
          </div>
        </div>

        <!-- 上一曲 -->
        <button @click="playerStore.prev()" class="prev-btn" title="上一首">
          <i class="fas fa-step-backward"></i>
        </button>

        <!-- 播放/暂停 -->
        <button
          @click="playerStore.togglePlay()"
          class="play-btn"
          title="播放/暂停"
        >
          <i
            :class="playerStore.isPlaying ? 'fas fa-pause' : 'fas fa-play'"
          ></i>
        </button>

        <!-- 下一曲 -->
        <button @click="playerStore.next()" class="next-btn" title="下一首">
          <i class="fas fa-step-forward"></i>
        </button>

        <!-- 弹出播放列表 -->
        <button @click="togglePlaylist" class="playlist-btn" title="播放列表">
          <i class="fas fa-list"></i>
        </button>

        <!-- 歌曲加入歌单 -->
        <button @click="toggleAddToPlaylists" title="加入播放列表">
          <i class="fas fa-plus"></i>
        </button>

        <!-- 弹出加入的歌单列表 -->
        <div v-if="showAddToPlaylists" class="add-to-playlists">
          <div
            v-for="playlist in userStore.user.playlists.filter(
              (playlist) => playlist.name !== '最近听过'
            )"
            :key="playlist.name"
            class="add-to-playlist"
            @click="addSongToPlaylist(playlist.name)"
          >
            <i>
              <img
                :src="playlist.coverUrl || defaultCover"
                :alt="playlist.name"
                class="playlist-cover"
              />
            </i>
            <span>{{ playlist.name }}</span>
          </div>
        </div>
      </div>

      <div class="progress-volume">
        <span class="time">{{ formatTime(playerStore.currentTime) }}</span>
        <div class="progress-container" @click="onProgressClick">
          <div
            class="progress-bar"
            :style="{ width: playerStore.progress + '%' }"
          ></div>
        </div>
        <span class="time">{{ formatTime(playerStore.duration) }}</span>
        <div class="volume-control">
          <i
            class="volume-icon"
            :class="
              playerStore.volume === 0
                ? 'fas fa-volume-mute'
                : 'fas fa-volume-up'
            "
            @click="toggleMute"
            title="静音"
          ></i>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            :value="playerStore.volume"
            @input="onVolumeChange"
            class="volume-slider"
          />
        </div>
        <button
          @click="closePlayer"
          class="close-player-btn"
          title="关闭播放器"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>

    <!-- 展开的播放面板 -->
    <div v-if="isExpanded && playerStore.currentSong" class="expanded-player">
      <div class="expanded-header">
        <h3>{{ playerStore.playlistName }}</h3>
        <button @click="toggleExpanded" class="close-btn" title="收起">
          <i class="fas fa-chevron-down"></i>
        </button>
      </div>

      <div class="album-container">
        <img
          :src="playerStore.currentSong.coverUrl || defaultCover"
          :class="{ playing: playerStore.isPlaying }"
          :alt="playerStore.currentSong.title + ' 专辑封面'"
        />
      </div>

      <div class="song-info-expanded">
        <h2 class="song-title">{{ playerStore.currentSong.title }}</h2>
        <p class="song-artist">{{ playerStore.currentSong.artist }}</p>
      </div>

      <div class="lyrics-container">
        <div class="lyrics-content" ref="lyricsContainer">
          <div
            v-for="(line, index) in lyrics"
            :key="index"
            :class="{ active: isCurrentLyric(index) }"
            class="lyric-line"
          >
            {{ line.text }}
          </div>
        </div>
      </div>

      <div class="expanded-controls">
        <button
          @click="changePlayMode"
          class="mode-btn"
          :title="getPlayModeText()"
        >
          <i :class="getPlayModeIcon()"></i>
          <span class="mode-text">{{ getPlayModeText() }}</span>
        </button>
        <button @click="playerStore.prev" class="prev-btn" title="上一首">
          <i class="fas fa-step-backward"></i>
        </button>
        <button
          @click="playerStore.togglePlay"
          class="play-btn-large"
          title="播放/暂停"
        >
          <i
            :class="playerStore.isPlaying ? 'fas fa-pause' : 'fas fa-play'"
          ></i>
        </button>
        <button @click="playerStore.next" class="next-btn" title="下一首">
          <i class="fas fa-step-forward"></i>
        </button>
        <button @click="togglePlaylist" class="playlist-btn" title="播放列表">
          <i class="fas fa-list"></i>
          <span>播放列表</span>
        </button>
      </div>
    </div>

    <!-- 播放列表面板 -->
    <div v-if="showPlaylist" class="playlist-panel">
      <div class="playlist-header">
        <h3>
          {{ playerStore.playlistName }} ({{ playerStore.playlist.length }})
        </h3>
        <div class="playlist-actions">
          <button @click="clearPlaylist" class="clear-btn" title="清空播放列表">
            <i class="fas fa-trash"></i> 清空
          </button>
          <button @click="togglePlaylist" class="close-btn" title="关闭">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <div class="playlist-content">
        <div
          v-for="song in playerStore.playlist"
          :key="song.songKey"
          :class="{ active: song.songKey === playerStore.currentSong.songKey }"
          class="playlist-item"
          @click="playerStore.playSong(song)"
        >
          <img
            :src="song.coverUrl || defaultCover"
            :alt="song.title + '歌曲封面'"
            class="playlist-item-cover"
          />
          <div class="item-info">
            <div class="item-name">{{ song.title }}</div>
            <div class="item-artist">{{ song.artist }}</div>
          </div>
          <div class="item-duration">{{ formatTime(song.duration) }}</div>
          <button
            @click.stop="playerStore.removeSongFromPlaylist(song)"
            class="remove-btn"
            title="移除"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useUserStore } from "../store/user.js";
import { usePlayerStore } from "../store/player.js";

const playerStore = usePlayerStore();
const userStore = useUserStore();
const isExpanded = ref(false);
const showPlaylist = ref(false);
const lyricsContainer = ref(null);
const showMode = ref(false); // 控制播放模式选项框的显示
const showAddToPlaylists = ref(false); // 控制添加到播放列表的显示

// 默认封面图片
const defaultCover = new URL("../assets/default-cover.jpg", import.meta.url)
  .href;

// 示例歌词数据（实际应从API获取）
const lyrics = ref([
  { time: 0, text: "暂无歌词" },
  { time: 10, text: "请点击歌曲获取歌词" },
  { time: 20, text: "这里将显示歌词内容" },
  { time: 30, text: "支持歌词滚动显示" },
]);

const modeOptions = ref([
  { value: "sequence", text: "列表循环", icon: "fas fa-list" },
  { value: "random", text: "随机播放", icon: "fas fa-random" },
  { value: "single", text: "单曲循环", icon: "fas fa-redo" },
]);

// 切换展开/收起状态
function toggleExpanded() {
  isExpanded.value = !isExpanded.value;
}

// 切换播放列表显示
function togglePlaylist() {
  showPlaylist.value = !showPlaylist.value;
  isExpanded.value = false;
}

function toggleMode() {
  console.log("showMode", showMode.value);
  showMode.value = !showMode.value;
  console.log("showMode", showMode.value);
}

function selectPlayMode(mode) {
  console.log("selectPlayMode", mode);
  playerStore.playMode = mode;
  showMode.value = false; // 关闭选项框
}

function toggleAddToPlaylists() {
  showAddToPlaylists.value = !showAddToPlaylists.value;
}

async function addSongToPlaylist(playlistName) {
  console.log("addSongToPlaylist", playlistName);
  try {
    const res = await userStore.addSongToPlaylist(
      playlistName,
      playerStore.currentSong
    );
    if (res.code === 0) {
      alert("添加成功");
      toggleAddToPlaylists();
    } else {
      alert(res.msg);
    }
  } catch (err) {
    console.log(err);
  }
}

// 关闭播放器
function closePlayer() {
  playerStore.clearPlaylist();
  isExpanded.value = false;
  showPlaylist.value = false;
}

// 格式化时间
function formatTime(seconds) {
  if (isNaN(seconds) || seconds === Infinity) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// 进度条点击事件
function onProgressClick(event) {
  const progressBar = event.currentTarget;
  const rect = progressBar.getBoundingClientRect();
  const percent = (event.clientX - rect.left) / rect.width;
  const time = percent * playerStore.duration;
  playerStore.setCurrentTime(time);
}

// 音量控制
function onVolumeChange(event) {
  const volume = parseFloat(event.target.value);
  playerStore.setVolume(volume);
}

// 静音切换
function toggleMute() {
  if (playerStore.volume > 0) {
    playerStore.setVolume(0);
  } else {
    playerStore.setVolume(0.7);
  }
}

// 获取播放模式图标
function getPlayModeIcon() {
  switch (playerStore.playMode) {
    case "sequence":
      return "fas fa-list";
    case "random":
      return "fas fa-random";
    case "single":
      return "fas fa-redo";
    default:
      return "fas fa-list";
  }
}

// 获取播放模式文字说明
function getPlayModeText() {
  switch (playerStore.playMode) {
    case "sequence":
      return "fas fa-list";
    case "random":
      return "fas fa-random";
    case "single":
      return "fas fa-redo";
    default:
      return "fas fa-list";
  }
}

// 判断是否为当前歌词
function isCurrentLyric(index) {
  // 实际应用中应根据当前播放时间判断
  return index === 1; // 示例：高亮第二行
}

// 清空播放列表
function clearPlaylist() {
  if (confirm("确定要清空播放列表吗？")) {
    playerStore.clearPlaylist();
  }
}

// 监听键盘事件（可选功能）
onMounted(() => {
  window.addEventListener("keydown", handleKeyPress);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyPress);
});

function closeModeDropdown() {
  console.log("closeMode");
  showMode.value = false;
}

function handleKeyPress(event) {
  // // 空格键播放/暂停
  // if (event.code === "Space" && playerStore.currentSong) {
  //   event.preventDefault();
  //   playerStore.togglePlay();
  // }
  // // 左箭头上一首
  // else if (event.code === "ArrowLeft") {
  //   playerStore.prev();
  // }
  // // 右箭头下一首
  // else if (event.code === "ArrowRight") {
  //   playerStore.next();
  // }
  // // ESC键关闭面板
  // else if (event.code === "Escape") {
  //   isExpanded.value = false;
  //   showPlaylist.value = false;
  // }
}
</script>

<style scoped>
.music-player {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

/* 主播放控制栏 */
.player-bar {
  display: flex;
  align-items: center;
  height: 60px;
  background: linear-gradient(90deg, #e3f2fd 0%, #bbdefb 100%);
  color: #1976d2;
  padding: 0 16px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.song-info {
  display: flex;
  align-items: center;
  flex: 1;
  cursor: pointer;
}

.song-info img {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  margin-right: 12px;
  animation: rotate 20s linear infinite;
  animation-play-state: paused;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.song-info img.playing {
  animation-play-state: running;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.song-text {
  display: flex;
  flex-direction: column;
}

.song-name {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}

.song-artist {
  font-size: 12px;
  color: #42a5f5;
}

.control-buttons {
  display: flex;
  align-items: center;
  margin: 0 20px;
}

.control-buttons button {
  background: none;
  border: none;
  color: #1976d2;
  font-size: 16px;
  cursor: pointer;
  padding: 8px;
  margin: 0 5px;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.control-buttons button:hover {
  background: rgba(25, 118, 210, 0.1);
  transform: scale(1.1);
}

.play-btn {
  background: #1976d2 !important;
  color: white !important;
  width: 36px !important;
  height: 36px !important;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.2);
}

.play-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
}

.progress-volume {
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: flex-end;
}

.time {
  font-size: 12px;
  color: #42a5f5;
  margin: 0 8px;
}

.progress-container {
  width: 100px;
  height: 4px;
  background: rgba(25, 118, 210, 0.2);
  border-radius: 2px;
  cursor: pointer;
  position: relative;
}

.progress-bar {
  height: 100%;
  background: #1976d2;
  border-radius: 2px;
  width: 0%;
  transition: width 0.1s linear;
}

.volume-control {
  display: flex;
  align-items: center;
  margin-left: 20px;
}

.volume-icon {
  margin-right: 8px;
  cursor: pointer;
  color: #42a5f5;
  transition: color 0.2s ease;
}

.volume-icon:hover {
  color: #1976d2;
}

.volume-slider {
  width: 80px;
  height: 4px;
  -webkit-appearance: none;
  background: rgba(25, 118, 210, 0.2);
  border-radius: 2px;
  outline: none;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #1976d2;
  cursor: pointer;
}

.close-player-btn {
  background: none;
  border: none;
  color: #42a5f5;
  font-size: 18px;
  cursor: pointer;
  margin-left: 16px;
  padding: 8px;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-player-btn:hover {
  background: rgba(25, 118, 210, 0.1);
  color: #1976d2;
}

/* 展开的播放面板 */
.expanded-player {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  color: #1976d2;
  border-top: 1px solid rgba(25, 118, 210, 0.2);
  height: calc(100vh - 60px);
  max-height: 400px;
  box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.1);
}

.expanded-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid rgba(25, 118, 210, 0.2);
}

.expanded-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: #1976d2;
  font-size: 16px;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}

.close-btn:hover {
  background: rgba(25, 118, 210, 0.1);
}

.album-container {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.album-container img {
  width: 250px;
  height: 250px;
  border-radius: 16px;
  animation: rotate 20s linear infinite;
  animation-play-state: paused;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.album-container img.playing {
  animation-play-state: running;
}

.song-info-expanded {
  text-align: center;
  padding: 0 20px 20px;
}

.song-info-expanded .song-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-info-expanded .song-artist {
  font-size: 16px;
  color: #42a5f5;
  margin: 0;
}

.lyrics-container {
  height: 150px;
  overflow-y: auto;
  margin: 0 20px 20px;
  text-align: center;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  padding: 10px;
}

.lyrics-content {
  padding: 20px 0;
}

.lyric-line {
  padding: 8px 0;
  font-size: 16px;
  color: #42a5f5;
  transition: all 0.3s;
}

.lyric-line.active {
  color: #1976d2;
  font-size: 18px;
  font-weight: bold;
}

.expanded-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.expanded-controls button {
  background: none;
  border: none;
  color: #1976d2;
  font-size: 16px;
  cursor: pointer;
  padding: 12px;
  margin: 0 10px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.2s ease;
}

.expanded-controls button:hover {
  color: #0d47a1;
  transform: scale(1.1);
}

.play-btn-large {
  background: #1976d2 !important;
  color: white !important;
  width: 50px !important;
  height: 50px !important;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
}

.play-btn-large:hover {
  transform: scale(1.15);
  box-shadow: 0 6px 16px rgba(25, 118, 210, 0.4);
}

.mode-text,
.expanded-controls .playlist-btn span {
  font-size: 12px;
  margin-top: 4px;
}

/* 播放列表面板 */
.playlist-panel {
  position: fixed;
  bottom: 60px;
  right: 0;
  width: 350px;
  height: calc(100vh - 120px);
  background: white;
  color: #333;
  border-left: 1px solid #e0e0e0;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.05);
  z-index: 1001;
  display: flex;
  flex-direction: column;
}

.playlist-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
  background: linear-gradient(90deg, #e3f2fd 0%, #bbdefb 100%);
  color: #1976d2;
}

.playlist-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.playlist-actions {
  display: flex;
  align-items: center;
}

.clear-btn {
  background: none;
  border: none;
  color: #42a5f5;
  font-size: 14px;
  cursor: pointer;
  margin-right: 16px;
  display: flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.clear-btn:hover {
  background: rgba(25, 118, 210, 0.1);
  color: #1976d2;
}

.clear-btn i {
  margin-right: 4px;
}

.playlist-content {
  flex: 1;
  overflow-y: auto;
}

.playlist-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f5f5f5;
  transition: background 0.2s ease;
}

.playlist-item:hover {
  background: #f5f9ff;
}

.playlist-item.active {
  background: rgba(25, 118, 210, 0.1);
  border-left: 3px solid #1976d2;
}

.playlist-item-cover {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  margin-right: 12px;
  object-fit: cover;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
}

.item-artist {
  font-size: 12px;
  color: #666;
}

.item-duration {
  font-size: 12px;
  color: #999;
  margin: 0 12px;
}

.remove-btn {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.remove-btn:hover {
  color: #f44336;
  background: #ffebee;
}

.mode-options {
  position: absolute;
  bottom: 100%;
  left: 46%;
  transform: translateX(-50%);
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  z-index: 1002;
  min-width: 120px;
  margin-top: 10px;
  padding: 4px 0;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(25, 118, 210, 0.1);
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.mode-option,
.add-to-playlist {
  display: flex;
  align-items: center;
  padding: 6px 5px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 8px;
  margin: 4px 4px;
}

.mode-option:hover,
.add-to-playlist:hover {
  background-color: #f5f5f5;
}

.mode-option.active,
.add-to-playlist.active {
  background-color: #e3f2fd;
  color: #1976d2;
  font-weight: 500;
}

.mode-option i,
.add-to-playlist i {
  margin-right: 10px;
  width: 16px;
}

.add-to-playlists {
  position: absolute;
  bottom: 100%;
  left: 60%;
  transform: translateX(-50%);
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  z-index: 1002;
  min-width: 120px;
  margin-top: 10px;
  padding: 4px 0;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(25, 118, 210, 0.1);
  animation: slideDown 0.2s ease-out;
}

.playlist-cover {
  width: 20px;
  height: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .song-text {
    max-width: 100px;
  }

  .progress-container {
    width: 60px;
  }

  .volume-control {
    display: none;
  }

  .playlist-panel {
    width: 100%;
    height: 50vh;
  }

  .album-container img {
    width: 180px;
    height: 180px;
  }
}
</style>
