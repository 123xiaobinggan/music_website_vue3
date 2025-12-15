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
        <router-link to="/" class="nav-link"  :class="{ active:['/','/newAlbums','/rankings','/mv'].includes($route.path) }"
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
    <!--login_Register-->
    <div class="login-section">
      <button class="login_register-button" @click="showLogin_RegisterModal">
        登录/注册
      </button>
    </div>
    <!-- 登录注册模态框 -->
    <Login_Register
      :visible="isLogin_RegisterModalVisible"
      @hideLogin_RegisterModal="hideLogin_RegisterModal"
      @login_success="login_success"
    />
  </nav>
</template>

<script setup>
import { useUserStore } from "../store/user.js";
import Login_Register from "./Login_Register.vue";
import { ref } from "vue";

const userStore = useUserStore();

let isLogin_RegisterModalVisible = ref(false);

function showLogin_RegisterModal() {
  console.log("showLogin_RegisterModal");
  isLogin_RegisterModalVisible.value = true;
}

function hideLogin_RegisterModal() {
  isLogin_RegisterModalVisible.value = false;
}

function login_success() {
  userStore.login();
  // 登录成功后，关闭登录注册模态框
  hideLogin_RegisterModal();
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

.nav-item:hover{
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


</style>