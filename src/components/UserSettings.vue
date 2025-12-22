<!-- src/components/UserSettings.vue -->
<template>
  <div>
    <div v-if="visible" class="modal-overlay" @click="closeModal">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h3>用户设置</h3>
          <button class="close-button" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <!-- 头像设置 -->
          <div class="setting-section">
            <h4>头像设置</h4>
            <div class="avatar-setting">
              <img
                :src="localUser.avatar"
                alt="用户头像"
                class="current-avatar"
              />
              <div class="avatar-actions">
                <input
                  type="file"
                  ref="avatarInput"
                  accept="image/*"
                  @change="handleAvatarChange"
                  style="display: none"
                />
                <button class="upload-button" @click="triggerAvatarUpload">
                  上传新头像
                </button>
                <button class="reset-button" @click="resetAvatar">
                  重置头像
                </button>
              </div>
            </div>
          </div>

          <!-- 基本信息设置 -->
          <div class="setting-section">
            <h4>基本信息</h4>
            <div class="form-group">
              <label for="settingUsername">用户名</label>
              <input
                type="text"
                id="settingUsername"
                v-model="localUser.username"
                placeholder="请输入用户名"
              />
            </div>
            <div class="form-group">
              <label for="settingAccountId">账户ID</label>
              <input
                type="text"
                id="settingAccountId"
                v-model="localUser.accountId"
                disabled
              />
              <span class="disabled-tip">账户ID不可更改</span>
            </div>
          </div>

          <!-- 密码设置 -->
          <div class="setting-section">
            <h4>密码设置</h4>
            <div class="form-group">
              <label for="oldPassword">原密码</label>
              <input
                type="password"
                id="oldPassword"
                v-model="passwordForm.oldPassword"
                placeholder="请输入原密码"
              />
            </div>
            <div class="form-group">
              <label for="newPassword">新密码</label>
              <input
                type="password"
                id="newPassword"
                v-model="passwordForm.newPassword"
                placeholder="请输入新密码"
              />
            </div>
            <div class="form-group">
              <label for="confirmNewPassword">确认新密码</label>
              <input
                type="password"
                id="confirmNewPassword"
                v-model="passwordForm.confirmNewPassword"
                placeholder="请确认新密码"
              />
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="form-actions">
            <button class="save-button" @click="saveSettings">保存设置</button>
            <button class="cancel-button" @click="closeModal">取消</button>
          </div>
        </div>
      </div>
    </div>
    
    <Loading
      :visible="userStore.isLoading"
      message="正在保存设置..."
      :closable="true"
      @close="userStore.closeLoading"
    />
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  defineOptions,
  defineProps,
  defineEmits,
  watch,
} from "vue";
import { useUserStore } from "../store/user.js";
import Loading from "./Loading.vue";

defineOptions({
  name: "UserSettings",
});

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["hide-settings", "settings-updated"]);

const userStore = useUserStore();
const avatarInput = ref(null);
const originalAvatarFile = ref(null);

// 本地用户数据副本，避免直接修改store
const localUser = reactive({
  avatar: "",
  username: "",
  accountId: "",
});

// 密码表单
const passwordForm = reactive({
  oldPassword: "",
  newPassword: "",
  confirmNewPassword: "",
});

watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      resetLocalData();
    }
  },
  { immediate: true } // 立即执行一次
);

// 当模态框显示时重置数据
function resetLocalData() {
  if (userStore.user) {
    localUser.avatar = userStore.user.avatar || "";
    localUser.username = userStore.user.username || "";
    localUser.accountId = userStore.user.accountId || "";
  }
}

// 触发头像上传
function triggerAvatarUpload() {
  avatarInput.value.click();
}

// 处理头像更改
function handleAvatarChange(event) {
  const file = event.target.files[0];
  if (file) {
    // 这里可以添加文件验证逻辑
    if (file.size > 5 * 1024 * 1024) {
      alert("头像文件大小不能超过5MB");
      return;
    }
    originalAvatarFile.value = file;

    // 创建预览URL
    const reader = new FileReader();
    reader.onload = (e) => {
      localUser.avatar = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

// 重置头像
function resetAvatar() {
  localUser.avatar =
    "https://binggan-1358387153.cos.ap-guangzhou.myqcloud.com/User/xiaobinggan.jpg";
}

// 保存设置
async function saveSettings() {
  try {
    // 验证密码设置
    if (
      passwordForm.newPassword ||
      passwordForm.confirmNewPassword ||
      passwordForm.oldPassword
    ) {
      if (!passwordForm.oldPassword) {
        alert("请输入原密码");
        return;
      }
      if (!passwordForm.newPassword) {
        alert("请输入新密码");
        return;
      }
      if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
        alert("新密码与确认密码不一致");
        return;
      }
      if (passwordForm.newPassword.length < 6) {
        alert("密码长度至少6位");
        return;
      }
    }

    // 验证用户名
    if (!localUser.username.trim()) {
      alert("用户名不能为空");
      return;
    }

    console.log("保存用户设置:", {
      avatar: localUser.avatar,
      username: localUser.username,
      passwordChange: passwordForm.newPassword
        ? "需要更改密码"
        : "无需更改密码",
    });
    userStore.showLoading();
    const res = await userStore.updateUserInfo(
      localUser.username,
      localUser.avatar,
      originalAvatarFile.value,
      passwordForm.oldPassword,
      passwordForm.newPassword
    );
    console.log(res);
    if (res.code === 0) {
      alert("设置保存成功");
      emit("settings-updated");
      closeModal();
    } else {
      alert(res.msg);
    }
  } catch (error) {
    console.error("保存设置失败:", error);
    alert(error.message);
  }finally{
    userStore.closeLoading();
  }
}

// 关闭模态框
function closeModal() {
  // 重置密码表单
  passwordForm.oldPassword = "";
  passwordForm.newPassword = "";
  passwordForm.confirmNewPassword = "";

  emit("hide-settings");
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  width: 500px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
}

.close-button:hover {
  color: #333;
}

.modal-body {
  padding: 20px;
}

.setting-section {
  margin-bottom: 25px;
}

.setting-section h4 {
  margin: 0 0 15px 0;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}

.avatar-setting {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.current-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #1db954;
}

.avatar-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.upload-button,
.reset-button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.upload-button {
  background-color: #1db954;
  color: white;
}

.upload-button:hover {
  background-color: #1aa34a;
}

.reset-button {
  background-color: #f0f0f0;
  color: #333;
}

.reset-button:hover {
  background-color: #e0e0e0;
}

.form-group {
  display: flex;
  margin-bottom: 15px;
  align-items: center;
}

.form-group label {
  width: 100px;
  font-weight: bold;
  color: #555;
  margin-right: 15px;
}

.form-group input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #1db954;
  box-shadow: 0 0 0 2px rgba(29, 185, 84, 0.2);
}

.form-group input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.disabled-tip {
  margin-left: 10px;
  font-size: 12px;
  color: #999;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.save-button,
.cancel-button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.save-button {
  background-color: #1db954;
  color: white;
}

.save-button:hover {
  background-color: #1aa34a;
}

.cancel-button {
  background-color: #f0f0f0;
  color: #333;
}

.cancel-button:hover {
  background-color: #e0e0e0;
}
</style>