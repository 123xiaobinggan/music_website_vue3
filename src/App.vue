<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { usePlayerStore } from "./store/player.js";
onMounted(() => {
  const playerStore = usePlayerStore();
  playerStore.initAudio();

  if (usePlayerStore.currentSong) {
    usePlayerStore.audio.src = usePlayerStore.currentSong.url;
    usePlayerStore.audio.volume = usePlayerStore.volume;
  }
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
