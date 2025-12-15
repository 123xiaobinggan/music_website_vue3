<template>
  <div class="my-music-page">
    <!-- 用户信息背景区域 -->
    <div class="user-banner">
      <div class="banner-overlay"></div>
      <div class="user-info-container">
        <div class="user-avatar">
          <img src="https://picsum.photos/120/120?random=1" alt="用户头像" />
        </div>
        <h2 class="username">用户名</h2>
        <div class="user-stats">
          <span class="stat-item">关注: 128</span>
          <span class="stat-item">粉丝: 8.6万</span>
        </div>
      </div>

      <!-- 背景图内侧导航 -->
      <div class="inner-nav">
        <ul class="nav-list">
          <li class="nav-item">
            <router-link
              to="/myMusics"
              class="nav-link"
              exact-active-class="active"
              >我喜欢</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              to="/myMusics/myPlayList"
              class="nav-link"
              active-class="active"
              >我的歌单</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              to="/myMusics/following"
              class="nav-link"
              active-class="active"
              >关注</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              to="/myMusics/followers"
              class="nav-link"
              active-class="active"
              >粉丝</router-link
            >
          </li>
        </ul>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script setup>
import { defineOptions } from "vue";
defineOptions({
  name: "MyMusicsPage",
});
import useMyMusics from "./Index.js";
</script>



<style scoped>
@import url("Index.css");
</style>