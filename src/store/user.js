import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    isLogin: false,
    user: null,
    token: null,
  }),

  actions: {
    login(username, password) {
      // 你自己的接口请求
      this.user = { username,password };
      this.token = "xxxx-token";
    },

    logout() {
      this.user = null;
      this.token = null;
    }
  }
});
