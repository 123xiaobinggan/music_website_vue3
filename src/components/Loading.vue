<!-- src/components/LoadingOverlay.vue -->
<template>
  <div v-if="visible" class="loading-overlay" @click="handleOverlayClick">
    <div class="loading-container" @click.stop>
      <div class="spinner"></div>
      <p v-if="message" class="loading-message">{{ message }}</p>
      <button 
        v-if="closable" 
        class="close-button" 
        @click="close"
      >
        ×
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits,defineOptions } from 'vue';
defineOptions({
  name: 'Loading'
})

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: '加载中...'
  },
  closable: {
    type: Boolean,
    default: false
  },
  closeOnClickOutside: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);

function close() {
  emit('close');
}

function handleOverlayClick() {
  if (props.closeOnClickOutside) {
    close();
  }
}
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-container {
  background: white;
  border-radius: 8px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  min-width: 200px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #1db954;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-message {
  margin: 0;
  font-size: 16px;
  color: #333;
  text-align: center;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  color: #333;
  background-color: #f0f0f0;
  border-radius: 50%;
}
</style>