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
</script>



<style scoped>
  .my-music-page {
    background-color: #ffffff;
    min-height: 100vh;
}

/* 用户信息背景区域 */
.user-banner {
    position: relative;
    height: 300px;
    background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
        url('https://picsum.photos/1200/300?random=2') center/cover no-repeat;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    overflow: hidden;
}

.banner-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    z-index: 1;
}

.user-info-container {
    position: relative;
    z-index: 2;
    text-align: center;
    margin-bottom: 40px;
}

.user-avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 3px solid rgba(255, 255, 255, 0.3);
    overflow: hidden;
    margin: 0 auto 15px;
}

.user-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.username {
    font-size: 24px;
    font-weight: 600;
    margin: 0 0 10px 0;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

.user-stats {
    display: flex;
    gap: 20px;
    justify-content: center;
}

.stat-item {
    font-size: 16px;
    opacity: 0.9;
}

/* 背景图内侧导航 */
.inner-nav {
    position: absolute;
    bottom: 0;
    left: 5%;
    width: 100%;
    z-index: 2;
}

.nav-list {
    display: flex;
    list-style: none;
    padding: 0 30px;
    margin: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.nav-item {
    padding: 12px 20px;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.3s ease;
}


.nav-link {
  color: inherit; /* 继承父元素的颜色 */
  text-decoration: none; /* 去掉下划线 */
  display: block;
  padding: 12px 0px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: #1db954;
}

.nav-link.active{
    color:#1db954
}

</style>