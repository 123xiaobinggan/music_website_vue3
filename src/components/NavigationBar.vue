<!-- src/components/NavigationBar.vue -->
<template>
  <nav class="navbar">
    <div class="nav-logo">
      <img src="../assets/logo.png" alt="Logo" class="logo" />
      <div class="nav-brand">微微音乐</div>
    </div>
    <ul class="nav-menu">
      <li class="nav-item">
        <!-- 首页使用 exact-active-class -->
        <router-link
          to="/"
          class="nav-link"
          :class="{
            active: ['/', '/newAlbums', '/rankings', '/mv'].includes(
              $route.path
            ),
          }"
          >音乐荟萃</router-link
        >
      </li>
      <li class="nav-item">
        <!-- 其他页面使用 active-class -->
        <router-link to="/myMusics" class="nav-link" active-class="active"
          >我的音乐</router-link
        >
      </li>
      <li class="nav-item">
        <!-- 其他页面使用 active-class -->
        <router-link to="/artists" class="nav-link" active-class="active"
          >艺术家</router-link
        >
      </li>
      <li class="nav-item">
        <!-- 其他页面使用 active-class -->
        <router-link to="/about" class="nav-link" active-class="active"
          >关于</router-link
        >
      </li>
    </ul>
    <div class="nav-search">
      <input type="text" placeholder="搜索音乐、艺术家或专辑" />
      <i class="fas fa-search search-icon"></i>
    </div>

    <!-- 用户头像区域 -->
    <div class="user-section" v-if="userStore.isLogin">
      <div
        class="avatar-container"
        @mouseenter="showUserProfile"
        @mouseleave="hideUserProfile"
      >
        <img :src="userStore.user.avatar + '?t' + userStore.avatarVersion" alt="用户头像" class="user-avatar" />
        <!-- 用户信息悬浮框 -->
        <div v-show="isProfileVisible" class="user-profile-popup">
          <div class="profile-header">
            <img
              :src="userStore.user.avatar + '?t=' + userStore.avatarVersion"
              alt="用户头像"
              class="profile-avatar"
            />
            <div class="profile-info">
              <div class="account-id">
                {{ userStore.user?.accountId || "未知ID" }}
              </div>
              <div class="username">
                {{ userStore.user?.username || "用户名" }}
              </div>
            </div>
          </div>
          <div class="profile-details">
            <div class="vip-level">VIP等级: {{ userStore.user?.vip }}</div>
            <div class="listening-time">
              听歌时长: {{ userStore.user?.listenTime }}
            </div>
          </div>
          <!-- 在 NavigationBar.vue 的用户信息面板中添加设置选项 -->
          <div class="profile-actions">
            <span class="action-link" @click="showSettingsModal">个人设置</span>
            <span class="separator"> | </span>
            <span class="action-link" @click="switchAccount">切换账户</span>
            <span class="separator"> | </span>
            <span class="action-link" @click="logout">退出账户</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 登录/注册按钮 -->
    <div class="login-section" v-else>
      <button class="login_register-button" @click="showLogin_RegisterModal">
        登录/注册
      </button>
    </div>

    <!-- 登录注册模态框 -->
    <Login_Register
      :visible="isLogin_RegisterModalVisible"
      @hideLogin_RegisterModal="hideLogin_RegisterModal"
      @success="success"
    />

    <!-- 在 NavigationBar.vue 的 template 中添加设置模态框 -->
    <UserSettings
      :visible="isSettingsModalVisible"
      @hide-settings="hideSettingsModal"
      @settings-updated="handleSettingsUpdated"
    />
  </nav>
</template>

<script setup>
import { useUserStore } from "../store/user.js";
import Login_Register from "./Login_Register.vue";
import UserSettings  from "./UserSettings.vue";
import { ref } from "vue";

const userStore = useUserStore();

let isLogin_RegisterModalVisible = ref(false);
let isProfileVisible = ref(false);
let isSettingsModalVisible = ref(false);
let avatarVersion = ref(0);

function showLogin_RegisterModal() {
  console.log("showLogin_RegisterModal", userStore.user);
  isLogin_RegisterModalVisible.value = true;
}

function hideLogin_RegisterModal() {
  isLogin_RegisterModalVisible.value = false;
}

function success() {
  console.log("success", userStore.user);
  hideLogin_RegisterModal();
}

// 显示用户信息面板
function showUserProfile() {
  isProfileVisible.value = true;
}

// 隐藏用户信息面板
function hideUserProfile() {
  isProfileVisible.value = false;
}

// 切换账户
function switchAccount() {
  hideUserProfile();
  showLogin_RegisterModal();
}

// 退出登录
function logout() {
  hideUserProfile();
  userStore.logout();
}

// 添加新的方法
function showSettingsModal() {
  hideUserProfile(); // 先隐藏用户信息面板
  isSettingsModalVisible.value = true;
}

function hideSettingsModal() {
  isSettingsModalVisible.value = false;
}

function handleSettingsUpdated() {
  // 设置更新后的回调
  console.log("用户设置已更新");
}
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  padding: 0rem 0rem 0rem 14%;
  background-color: #ffffff;
  color: black;
  border-bottom: 1px solid #ccc;
  position: relative;
}

.nav-brand {
  font-size: 2.5rem;
  font-weight: bold;
  text-decoration: none;
  color: rgb(0, 0, 0);
}

.nav-logo {
  display: flex;
  align-items: center;
}

.logo {
  width: 60px;
  margin-right: 0.5rem;
}

.nav-menu {
  display: flex;
  list-style: none;
}

.nav-item {
  width: 120px;
  padding: 0;
}

.nav-item:hover {
  border-bottom: 0px solid rgb(255, 255, 255);
}

.nav-link {
  text-decoration: none;
  color: black;
  font-size: 1.3rem;
  transition: all 0.3s;
  padding: 1.5rem 0;
  display: block;
  text-align: center;
  border-radius: 4px;
}

.nav-link:hover {
  color: white;
  background-color: #1db954;
}

/* 保持现有的 active 样式 */
.nav-link.active {
  color: white;
  background-color: #1db954;
}

.nav-search {
  margin-left: 20px;
  align-items: center;
  position: relative;
}

.search-container {
  position: relative;
  display: inline-block;
}

.nav-search input {
  font-size: 16px;
  padding: 0 40px 0 12px;
  height: 2rem;
  border: 1.2px solid rgb(0, 0, 0);
  border-radius: 4px;
  box-sizing: border-box;
  width: 100%;
}

.search-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  pointer-events: none;
}

.nav-search input:focus + .search-icon {
  color: #1db954;
}

/* 用户头像样式 */
.user-section {
  margin-left: 20px;
  margin-top: 15px;
  position: relative;
}

.avatar-container {
  position: relative;
  cursor: pointer;
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #1db954;
}

/* 用户信息悬浮框样式 */
.user-profile-popup {
  position: absolute;
  top: 60px;
  left: calc(100% - 80px);
  width: 160px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  padding: 16px;
  border: 1px solid #eee;
}

.profile-header {
  display: flex;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
}

.profile-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 12px;
}

.profile-info {
  flex: 1;
}

.account-id {
  font-weight: bold;
  font-size: 16px;
  color: #333;
}

.username {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

.profile-details {
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.vip-level,
.listening-time {
  font-size: 14px;
  color: #333;
  margin: 4px 0;
}


.switch-account-btn,
.logout-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.login-section {
  margin-left: 20px;
}

.login_register-button {
  background-color: #1db954;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login_register-button:hover {
  background-color: #1aa34a;
}

/* 在 NavigationBar.vue 的样式部分添加 */
.profile-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
}

.action-link {
  color: #1db954;
  cursor: pointer;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.action-link:hover {
  text-decoration: underline;
}

.separator {
  color: #ccc;
  margin: 0 4px;
}

</style>