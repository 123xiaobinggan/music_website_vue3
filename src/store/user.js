import { defineStore } from "pinia";
import axios from "axios";
import { usePlayerStore } from "./player.js";
import { watch } from "vue";

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
      ILike: { songs: [], albums: [] },
      playlists: [
        { name: '最近听过', coverUrl: 'https://picsum.photos/200/200?random=' + Math.floor(Math.random() * 100), songs: [] },
        { name: '我喜欢', coverUrl: "https://picsum.photos/200/200?random=" + Math.floor(Math.random() * 100), songs: [] }
      ],
      listenTime: 0,
    },
  }),
  persist: true,

  actions: {

    initializeStore() {
      console.log('initializeStore')
      watch(
        // 使用可选链安全查找
        () => {
          const playlist = this.user.playlists.find(p => p.name === '我喜欢');
          console.log('ILike playlist', playlist);
          return playlist?.songs || []; // 提供默认值
        },
        (newSongs, oldSongs) => {
          // 安全赋值
          if (!this.user.ILike) {
            this.user.ILike = {};
          }
          this.user.ILike.songs = newSongs;

          console.log('"我喜欢"歌单的歌曲已同步:', newSongs.length, '首');
        },
        {
          deep: true, // 深度监听 songs 数组变化
          immediate: true // 立即执行一次，初始化同步
        }
      );
    },

    async addSongToHistory(song) {
      var historyPlaylist = this.user.playlists.find(playlist => playlist.name === '最近听过')
      const existingIndex = historyPlaylist.songs.findIndex(item =>
        item.title === song.title
      );

      if (existingIndex === -1) {
        historyPlaylist.songs.unshift(song)


        try {
          await axios.post(this.url + "/Update_History_Listen", { accountId: this.user.accountId, song })
        } catch (error) {
          console.log(error)
        }
      }
    },

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
          this.user.listenTime = res.data.data.listenTime;
          await this.getPlaylists();
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
          this.user.accountId = res.data.data.accountId;
          this.user.username = res.data.data.username;
          this.user.avatar = res.data.data.avatar;
          this.user.vip = res.data.data.vip;
          this.user.listenTime = res.data.data.listenTime;
          await this.getPlaylists();
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
      this.user.ILike = { "songs": [], "playlists": [], "albums": [] };
      this.user.playlists = [];
      this.user.listenTime = 0;
      this.isLogin = false;
    },

    async getPlaylists() {
      const playerStore = usePlayerStore()
      try {
        const res = await axios.post(this.url + "/GetMyPlaylists", { accountId: this.user.accountId })
        console.log('getPlaylists', res.data)
        if (res.status != 200) {
          console.log(res.status, res.statusText)
        } else {
          this.user.ILike.songs = res.data.data.filter(item => item.name === '我喜欢')[0].songs
          this.user.playlists = res.data.data;
          playerStore.playlist = res.data.data.filter(item => item.name === '最近听过')[0].songs
        }
      } catch (error) {
        console.log(error)
      }
    },

    async createPlaylist(playlistName, coverUrl) {
      const newPlaylist = { name: playlistName, coverUrl: coverUrl, songs: [] };

      try {
        const res = await axios.post(this.url + "/Create_Playlist", { accountId: this.user.accountId, playlist: newPlaylist });
        if (res.status != 200) {
          console.log(res.status, res.statusText)
          return {
            code: res.status,
            msg: res.statusText
          }
        } else {
          this.user.playlists.push(newPlaylist);
          return {
            code: res.data.code,
            msg: res.data.msg
          }
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoading = false;
      }
    },

    async removePlaylist(name) {
      try {
        const res = await axios.post(this.url + "/Remove_playlist", { accountId: this.user.accountId, name });
        if (res.status != 200) {
          console.log(res.status, res.statusText)
          return {
            code: res.status,
            msg: res.statusText

          }
        } else {
          this.user.playlists = this.user.playlists.filter(playlist => playlist.name !== name)
          return {
            code: res.data.code,
            msg: res.data.msg
          }
        }
      } catch (error) {
        console.log(error)
      }
    },

    async addSongToPlaylist(playlistName, song) {
      try {
        const res = await axios.post(this.url + "/Add_Song_To_Playlist", { accountId: this.user.accountId, name: playlistName, song })
        if (res.status != 200) {
          return {
            code: res.status,
            msg: res.statusText
          }
        } else {
          const playlist = this.user.playlists.find(playlist => playlist.name === playlistName)
          console.log(playlist.songs)
          if (playlist.songs.find(item => item.songKey === song.songKey)) {
            return {
              code: 1,
              msg: '歌曲已存在'
            }
          }
          playlist.songs.unshift(song);
          return {
            code: 0,
            msg: res.data.msg
          }
        }
      } catch (error) {
        console.log(error)
      }
    },

    async removeSongFromPlaylist(playlistName, song) {
      try {
        const res = await axios.post(this.url + "/Remove_Song_From_Playlist", { accountId: this.user.accountId, name: playlistName, song })
        if (res.status != 200) {
          return {
            code: res.status,
            msg: res.statusText
          }
        } else {
          const playlist = this.user.playlists.find(playlist => playlist.name === playlistName)
          playlist.songs = playlist.songs.filter(item => item.title !== song.title)
          return {
            code: res.data.code,
            msg: res.data.msg
          }
        }
      } catch (error) {
        console.log(error)
        return {
          code: 500,
          msg: error.message
        }
      }
    },

    async deletePlaylist(name) {
      try {
        const res = await axios.post(this.url + "/Delete_Playlist", { accountId: this.user.accountId, name })
        console.log('deletePlaylist', res.data)
        if (res.status != 200) {
          return {
            code: res.status,
            msg: res.statusText
          }
        } else {
          this.user.playlists = this.user.playlists.filter(playlist => playlist.name !== name)
          return {
            code: 0,
            msg: res.data.msg
          }
        }
      } catch (error) {
        console.log(error)
      }
    },

    async updateUserInfo(username, avatar, avatarFile, password, newPassword) {
      console.log(username, avatar, password, newPassword)
      if (avatarFile) {
        this.avatarVersion = Date.now();
        const resUrl = await this.uploadAvatar(avatarFile, `music_website_vue3_User/${this.user.accountId}.jpg`)
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
        }, {
          timeout: 5000
        }
        );
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

    async updatePlaylist(newName, coverUrl, name) {
      let originalCoverUrl = this.user.playlists.find(playlist => playlist.name === name).coverUrl;
      if (coverUrl) {
        const resUrl = await this.uploadAvatar(coverUrl, `music_website_vue3_User/${this.user.accountId}_cover.jpg`);
        if (resUrl === 1) {
          return {
            code: 500,
            msg: '上传失败'
          }
        } else {
          originalCoverUrl = resUrl;
        }
      }
      try {
        const res = await axios.post(this.url + "/Update_Playlist", { accountId: this.user.accountId, newName, coverUrl: originalCoverUrl, name });
        if (res.status != 200) {
          console.log(res.status, res.statusText)
          return {
            code: res.status,
            msg: res.statusText
          }
        } else {
          this.user.playlists.find(playlist => playlist.name === name).coverUrl = originalCoverUrl + "?v=" + Math.random();
          this.user.playlists.find(playlist => playlist.name === name).name = newName;
          return {
            code: res.data.code,
            msg: res.data.msg
          }
        }
      } catch (error) {
        console.log(error);
        return {
          code: 500,
          msg: error.message
        }
      }
    },

    async uploadAvatar(avatarFile, filePath) {
      // const filePath = `music_website_vue3_User/${this.user.accountId}.jpg`; // 上传路径
      const signedUrl = await this.getSignature(filePath); // 获取签名
      console.log('signedUrl', signedUrl);
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
          return `https://binggan-1358387153.cos.ap-guangzhou.myqcloud.com/${filePath}`
          // return `https://binggan-1358387153.cos.ap-guangzhou.myqcloud.com/music_website_vue3_User/${this.user.accountId}.jpg`
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


