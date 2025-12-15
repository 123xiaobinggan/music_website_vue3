<template>
  <div class="artists-page">
    <div class="container">
      <!-- 首字母筛选 -->
      <div class="filter-section">
        <ul class="filter-list">
          <li 
            :class="{ active: currentLetter === '' }"
            @click="selectLetter('')"
            class="filter-item"
          >
            全部
          </li>
          <li 
            v-for="letter in letters" 
            :key="letter"
            :class="{ active: currentLetter === letter }"
            @click="selectLetter(letter)"
            class="filter-item"
          >
            {{ letter }}
          </li>
        </ul>
      </div>

      <!-- 地域筛选 -->
      <div class="filter-section">
        <ul class="filter-list">
          <li 
            :class="{ active: currentArea === '' }"
            @click="selectArea('')"
            class="filter-item"
          >
            全部
          </li>
          <li 
            v-for="area in areas" 
            :key="area.id"
            :class="{ active: currentArea === area.id }"
            @click="selectArea(area.id)"
            class="filter-item"
          >
            {{ area.name }}
          </li>
        </ul>
      </div>

      <!-- 性别筛选 -->
      <div class="filter-section">
        <ul class="filter-list">
          <li 
            :class="{ active: currentGender === '' }"
            @click="selectGender('')"
            class="filter-item"
          >
            全部
          </li>
          <li 
            v-for="gender in genders" 
            :key="gender.id"
            :class="{ active: currentGender === gender.id }"
            @click="selectGender(gender.id)"
            class="filter-item"
          >
            {{ gender.name }}
          </li>
        </ul>
      </div>

      <!-- 风格类型筛选 -->
      <div class="filter-section">
        <ul class="filter-list">
          <li 
            :class="{ active: currentGenre === '' }"
            @click="selectGenre('')"
            class="filter-item"
          >
            全部
          </li>
          <li 
            v-for="genre in genres" 
            :key="genre.id"
            :class="{ active: currentGenre === genre.id }"
            @click="selectGenre(genre.id)"
            class="filter-item"
          >
            {{ genre.name }}
          </li>
        </ul>
      </div>

      <!-- 歌手列表 -->
      <div class="artists-grid">
        <div 
          v-for="artist in filteredArtists" 
          :key="artist.id"
          class="artist-card"
          @click="goToArtist(artist.id)"
        >
          <div class="artist-avatar">
            <img :src="artist.avatar" :alt="artist.name" />
          </div>
          <div class="artist-info">
            <h3 class="artist-name">{{ artist.name }}</h3>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredArtists.length === 0" class="empty-state">
        <p>没有找到符合条件的歌手</p>
      </div>
    </div>
  </div>
</template>



<script setup>
import {defineOptions} from "vue";
defineOptions({
  name: "ArtistsPage",
});
import useArtists from "./Index.js";
let {
      letters,
      areas,
      genders,
      genres,
      artists,
      currentLetter,
      currentArea,
      currentGender,
      currentGenre,
      filteredArtists,
      selectLetter,
      selectArea,
      selectGender,
      selectGenre,
      goToArtist
    } = useArtists()
  
</script>

<style scoped>
@import url('Index.css')
</style>