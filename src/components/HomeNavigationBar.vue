<!-- src/components/HomeNavigationBar.vue -->
<template>
  <nav class="home-navbar">
    <div class="home-navbar-container">
      <ul class="home-nav-menu">
        <li class="home-nav-item">
          <router-link to="/" class="home-nav-link" exact-active-class="active">
            歌单推荐
          </router-link>
        </li>
        <li class="home-nav-item">
          <router-link
            to="/newAlbums"
            class="home-nav-link"
            active-class="active"
          >
            新碟
          </router-link>
        </li>
        <li class="home-nav-item">
          <router-link
            to="/rankings"
            class="home-nav-link"
            active-class="active"
          >
            排行榜
          </router-link>
        </li>
        <li class="home-nav-item">
          <router-link to="/mv" class="home-nav-link" active-class="active">
            MV一览
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { defineOptions } from "vue";
defineOptions({
  name: "HomeNavigationBar",
});
</script>

<style scoped>
.home-navbar {
  background-color: #f8f8f8;
  border-bottom: 1px solid #e0e0e0;
  padding: 0rem 0rem 0rem 32%;
  height: 60px;
  justify-content: center;
  align-items: center;
}

.home-navbar-container {
  display: flex;
}

.home-nav-bar-container {
  margin-left: 100px;
}

.home-nav-menu {
  margin-left: 30%;
  display: flex;
  list-style: none;
  align-items: center;
  margin: 0;
  padding: 0;
}

.home-nav-item {
  margin-right: 30px;
  width: 80px;
  text-align: center;
  justify-content: center;
}

.home-nav-link {
  display: block;
  text-decoration: none;
  color: #333;
  font-size: 1.1rem;
  padding: 15px 0;
  transition: all 0.3s ease;
}

/* 当前选中项样式 - 绿色文字 */
.home-nav-link.active {
  color: #1db954;
}

/* hover效果 - 绿色文字 */
.home-nav-link:hover {
  color: #1db954;
}

/* 底部指示线效果（可选） */
.home-nav-link.active::after {
  content: "";
  display: block;
  width: 100%;
  height: 3px;
  background-color: #1db954;
  margin-top: 5px;
}
</style>