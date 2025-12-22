import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore("user", {
  state: () => ({
    url: "/api",
    isLogin: false,
    avatarVersion: 0,
    isLoading: false,
    user: {
      accountId: '',
      username: '',
      avatar: "https://binggan-1358387153.cos.ap-guangzhou.myqcloud.com/User/xiaobinggan.jpg",
      vip: 0,
      following: 0,
      followers: 0,
      ILike: { 'songs': [], 'playLists': [], 'albums': [] },
      playList: [],
      listenTime: 0
    },
  }),

  actions: {
    async login(accountId, password) {
      try {
        const res = await axios.post(this.url + "/Login", { accountId, password });
        console.log('login', res.data)
        if (res.status != 200) {
          return {
            code: res.status,
            msg: res.statusText
          }
        }
        if (res.data.code == 0) {
          this.isLogin = true;

          this.user.accountId = res.data.data.accountId;
          this.user.username = res.data.data.username;
          this.user.avatar = res.data.data.avatar;
          this.user.vip = res.data.data.vip;
          this.user.following = res.data.data.following;
          this.user.followers = res.data.data.followers;
          this.user.ILike = res.data.data.ILike;
          this.user.playList = res.data.data.playList;
          this.user.listenTime = res.data.data.listenTime;
        }
        return {
          code: res.data.code,
          msg: res.data.msg
        }
      } catch (error) {
        return {
          code: 500,
          msg: error.message
        }
      }
    },

    async register(accountId, username, password) {
      try {
        const res = await axios.post(this.url + "/Register", { accountId, username, password });
        if (res.status != 200) {
          return {
            code: res.status,
            msg: res.statusText
          }
        }
        if (res.data.code == 0) {
          this.isLogin = true;
          this.user.accountId = res.data.accountId;
          this.user.username = res.data.username;
          this.user.avatar = res.data.avatar;
          this.user.vip = res.data.vip;
          this.user.following = res.data.following;
          this.user.followers = res.data.followers;
          this.user.ILike = res.data.ILike;
          this.user.playList = res.data.playList;
          this.user.listenTime = res.data.listenTime;
        }
        return {
          code: res.data.code,
          msg: res.data.msg
        }

      } catch (error) {
        return {
          code: 500,
          msg: error.message
        }
      }
    },

    logout() {
      this.user.accountId = '未登录';
      this.user.username = '未登录';
      this.user.avatar = 'https://binggan-1358387153.cos.ap-guangzhou.myqcloud.com/User/xiaobinggan.jpg';
      this.user.vip = 0;
      this.user.following = 0;
      this.user.followers = 0;
      this.user.ILike = '';
      this.user.playList = '';
      this.user.listenTime = 0;
      this.isLogin = false;
    },

    async updateUserInfo(username, avatar, avatarFile, password, newPassword) {
      console.log(username, avatar, password, newPassword)
      if (avatarFile) {
        this.avatarVersion = Date.now();
        const resUrl = await this.uploadAvatar(avatarFile)
        if (resUrl === 1) {
          return {
            code: 500,
            msg: '上传失败'
          }
        } else {
          avatar = resUrl;
        }
      }
      try {
        const res = await axios.post(this.url + "/UpdateUserInfo", {
          accountId: this.user.accountId,
          username,
          avatar,
          password,
          newPassword
        });
        console.log('updateUserInfo', res.status, res.data)
        if (res.status != 200) {
          return {
            code: res.status,
            msg: res.statusText
          }
        } else {
          if (res.data.code == 0) {
            console.log('updateUserInfo', res.data)
            this.user.username = res.data.data.username;
            this.user.avatar = res.data.data.avatar;
            return {
              code: res.data.code,
              msg: res.data.msg
            }
          } else {
            return {
              code: res.data.code,
              msg: res.data.msg
            }
          }
        }
      } catch (error) {
        return {
          code: 500,
          msg: error.message
        }
      }
    },

    async uploadAvatar(avatarFile) {
      const filePath = `music_website_vue3_User/${this.user.accountId}.jpg`; // 上传路径
      const signedUrl = await this.getSignature(filePath); // 获取签名
      try {
        // 正确使用 FileReader 实例
        const arrayBuffer = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsArrayBuffer(avatarFile);
        });
        const res = await axios.put(signedUrl, arrayBuffer, {
          headers: {
            'Content-Type': 'image/jpeg'
          }
        });
        if (res.status != 200) {
          console.log(res.status, res.statusText)
          return 1;
        } else {
          return `https://binggan-1358387153.cos.ap-guangzhou.myqcloud.com/music_website_vue3_User/${this.user.accountId}.jpg`
        }
      } catch (error) {
        console.log(error.message)
        return 1;
      }
    },

    async getSignature(filePath) {
      try {
        const res = await axios.post(this.url + "/GetSignature", { accountId: this.user.accountId, filePath });
        console.log(res.data)
        if (res.status != 200) {
          console.log(res.status, res.statusText)
        } else {
          return res.data.url;
        }
      } catch (error) {
        console.log(error.message)
      }
    },

    showLoading() {
      this.isLoading = true;
    },
    closeLoading() {
      this.isLoading = false;
    },
  }
});


