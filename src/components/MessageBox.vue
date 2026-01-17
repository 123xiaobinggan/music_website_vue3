<template>
  <div class="message-box-overlay" v-if="visible" @click="handleOverlayClick">
    <div class="message-box" @click.stop>
      <div class="message-box-header">
        <h3>{{ title }}</h3>
        <button class="close-btn" @click="cancel">×</button>
      </div>
      <div class="message-box-content">
        <p>{{ message }}</p>
      </div>
      <div class="message-box-footer">
        <button class="btn btn-cancel" @click="cancel">{{ cancelText }}</button>
        <button class="btn btn-confirm" @click="confirm">{{ confirmText }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '提示'
  },
  message: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: '确定'
  },
  cancelText: {
    type: String,
    default: '取消'
  }
})

const emit = defineEmits(['confirm', 'cancel'])

const confirm = () => {
  emit('confirm')
}

const cancel = () => {
  emit('cancel')
}

const handleOverlayClick = () => {
  // 点击遮罩层时默认执行取消操作
  cancel()
}
</script>

<style scoped>
.message-box-overlay {
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

.message-box {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  min-width: 350px;
  max-width: 500px;
  animation: modalFadeIn 0.3s ease-out;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.message-box-header {
  padding: 20px 20px 10px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.message-box-header h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #666;
}

.message-box-content {
  padding: 20px;
}

.message-box-content p {
  margin: 0;
  color: #666;
  line-height: 1.6;
}

.message-box-footer {
  padding: 15px 20px 20px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn {
  padding: 8px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.btn-cancel {
  background-color: #f0f0f0;
  color: #666;
}

.btn-cancel:hover {
  background-color: #e0e0e0;
}

.btn-confirm {
  background-color: #1db954;
  color: white;
}

.btn-confirm:hover {
  background-color: #1aa34a;
}
</style>