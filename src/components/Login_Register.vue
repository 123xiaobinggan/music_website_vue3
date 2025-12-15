<!-- src/components/Login_Register.vue -->
<template>
  <div v-if="visible" class="modal-overlay" @click="closeModal">
    <div v-if="loginModal" class="modal-container" @click.stop>
      <div class="modal-header">
        <h3>用户登录</h3>
        <button class="close-button" @click="closeModal">&times;</button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="username">ID</label>
            <input
              type="text"
              id="accountId"
              v-model="userForm.accountId"
              required
              placeholder="请输入ID"
            />
          </div>
          <div class="form-group">
            <label for="password">密码</label>
            <input
              type="password"
              id="password"
              v-model="userForm.password"
              required
              placeholder="请输入密码"
            />
          </div>
          <div class="form-actions">
            <button type="submit" class="login-button" @click="handleLogin">
              登录
            </button>
            <button class="register-button" @click="go_register">去注册</button>
            <button type="button" class="cancel-button" @click="closeModal">
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
    <div v-if="registerModal" class="modal-container" @click.stop>
      <div class="modal-header">
        <h3>用户注册</h3>
        <button class="close-button" @click="closeModal">&times;</button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="handleLogin">
          <!-- 修改开始：为每个输入框创建独立的 form-group -->
          <div class="form-group">
            <label for="accountId" class="form-label">ID</label>
            <input
              type="text"
              id="accountId"
              v-model="userForm.accountId"
              required
              placeholder="请输入ID"
            />
          </div>
          <div class="form-group">
            <label for="username" class="form-label">用户名</label>
            <input
              type="text"
              id="username"
              v-model="userForm.username"
              required
              placeholder="请输入用户名"
            />
          </div>
          <div class="form-group">
            <label for="password">密码</label>
            <input
              type="password"
              id="password"
              v-model="userForm.password"
              required
              placeholder="请输入密码"
            />
          </div>
          <div class="form-group">
            <label for="confirmPassword">确认密码</label>
            <input
              type="confirmPassword"
              id="confirmPassword"
              v-model="userForm.confirmPassword"
              required
              placeholder="请确认密码"
            />
          </div>
          <div class="form-actions">
            <button
              type="submit"
              v-if="loginModal"
              class="login-button"
              @click="handleLogin"
            >
              登录
            </button>
            <button
              type="submit"
              v-if="registerModal"
              class="login-button"
              @click="go_login"
            >
              去登录
            </button>
            <button
              v-if="loginModal"
              class="register-button"
              @click="go_register"
            >
              去注册
            </button>
            <button
              v-if="registerModal"
              class="register-button"
              @click="handleRegister"
            >
              注册
            </button>
            <button type="button" class="cancel-button" @click="closeModal">
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive,defineEmits,defineProps } from "vue";
import { useUserStore } from "../store/user.js";
defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});

const userStore = useUserStore();
const emit = defineEmits(["hideLogin_RegisterModal","login_success"]);

let userForm = reactive({
  accountId: "",
  username: "",
  password: "",
  confirmPassword: ""
});

var loginModal = ref(true);
var registerModal = ref(false);

function closeModal() {
  emit("hideLogin_RegisterModal");
}

function go_register() {
  loginModal.value = false;
  registerModal.value = true;
}

function go_login() {
  loginModal.value = true;
  registerModal.value = false;
}

function handleRegister() {
  console.log("注册信息:", userForm);
  userStore.register("handleRegister", userForm);
}


function handleLogin() {
  userStore.login("handleLogin", userForm);
  // 这里可以添加登录逻辑
  console.log("登录信息:", userForm);
  login_success();
  // 登录成功后关闭弹窗
  closeModal();
}

function login_success() {
  emit("login_success");
  // 登录成功后，关闭登录注册模态框
  closeModal();
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
  width: 400px;
  max-width: 90%;
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

.form-group {
  display: flex;
  margin-bottom: 20px;
}

.form-group label {
  display: left;
  width: 18%;
  line-height: 50px;
  font-weight: bold;
  color: #555;
}

.form-group input {
  width: 70%;
  margin-left: 10px;
  margin-right: 0;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #1db954;
  box-shadow: 0 0 0 2px rgba(29, 185, 84, 0.2);
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.login-button,
.register-button,
.cancel-button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.login-button {
  background-color: #1db954;
  color: white;
}

.login-button:hover {
  background-color: #1aa34a;
}

.register-button {
  background-color: #75c5e4;
  color: white;
}

.cancel-button {
  background-color: #f0f0f0;
  color: #333;
}

.cancel-button:hover {
  background-color: #e0e0e0;
}


</style>