import { defineStore } from 'pinia'
import axios from 'axios'
import { useUserStore } from './user.js'


export const usePlayerStore = defineStore('player', {
    state: () => ({
        audio: null,
        currentSong: 'k歌之王',
        isPlaying: false,
        volume: 0.7,
        currentTime: 0,
        duration: 0,
        playlist: [],
        nextSong: null,
        historyPlaylist: [],
        currentIndex: 0,
        playMode: 'sequence', // sequence, random, single
    }),

    persist: {
        paths: [
            'playlist',
            'currentSong',
            'currentIndex',
            'volume',
            'playMode',
        ]
    },


    getters: {
        progress: (state) => {
            return state.duration ? (state.currentTime / state.duration) * 100 : 0
        }
    },

    actions: {
        initAudio() {
            if (!(this.audio instanceof HTMLAudioElement)) {
                this.audio = new Audio()
            }
            this.audio.ontimeupdate = () => {
                this.currentTime = this.audio.currentTime
                this.duration = this.audio.duration
            }

            this.audio.onloadedmetadata = () => {
                this.duration = this.audio.duration
            }

            this.audio.onended = () => {
                this.isPlaying = false
                this.next()
            }
        },

        async playSong(song, index = null) {
            const userStore = useUserStore()
            if (!(this.playlist.find(s => s.songKey === song.songKey))) {
                console.log('添加歌曲到播放列表', song)
                this.playlist.unshift(song)
                userStore.addSongToHistory(song)
            }
            this.initAudio()

            this.currentSong = song
            if (index !== null) {
                this.currentIndex = index
            }

            try {
                // 设置音频源
                this.audio.src = song.audioUrl

                // 等待音频可以播放
                await this.audio.play()
                this.isPlaying = true
                console.log('Playing song:', song.title)
            } catch (error) {
                console.error('Error playing audio:', error)

                // 如果直接播放失败，尝试先加载再播放
                try {
                    await new Promise((resolve, reject) => {
                        const onCanPlay = () => {
                            this.audio.removeEventListener('canplay', onCanPlay)
                            this.audio.removeEventListener('error', onError)
                            resolve()
                        }

                        const onError = () => {
                            this.audio.removeEventListener('canplay', onCanPlay)
                            this.audio.removeEventListener('error', onError)
                            reject(new Error('Failed to load audio'))
                        }

                        this.audio.addEventListener('canplay', onCanPlay)
                        this.audio.addEventListener('error', onError)
                    })

                    await this.audio.play()
                } catch (loadError) {
                    console.error('Failed to load and play audio:', loadError)
                }
            }
        },

        togglePlay() {
            console.log('Toggle Play')
            if (!this.audio) return

            if (this.isPlaying) {
                console.log('Pause')
                this.audio.pause()
                this.isPlaying = false
                console.log('isPlaying', this.isPlaying)
            } else {
                console.log('Play')
                this.audio.play()
                this.isPlaying = true
                console.log('isPlaying', this.isPlaying)
            }
        },

        setVolume(volume) {
            this.volume = volume
            if (this.audio) {
                this.audio.volume = volume
            }
        },

        setCurrentTime(time) {
            if (this.audio && this.audio instanceof HTMLAudioElement) {
                this.audio.currentTime = time
                this.currentTime = time
            }
        },

        next() {
            if (this.playlist.length === 0) return

            if(this.nextSong){
                this.currentSong = this.nextSong
                this.nextSong = null;
                this.playSong(this.currentSong)
                if(this.historyPlaylist.length > 10){
                    this.historyPlaylist.shift()
                }
                this.historyPlaylist.push(this.currentSong)
                return;
            }

            let nextIndex = this.currentIndex
            if (this.playMode === 'random') {
                while (nextIndex === this.currentIndex) {
                    nextIndex = Math.floor(Math.random() * this.playlist.length)
                }
            } else if (this.playMode === 'sequence') {
                nextIndex = (this.currentIndex + 1) % this.playlist.length
            } else {
                nextIndex = this.currentIndex
            }
            this.currentIndex = nextIndex
            this.currentSong = this.playlist[nextIndex]
            if(this.historyPlaylist.length > 10){
                this.historyPlaylist.shift()
            }
            this.historyPlaylist.push(this.currentSong)
            console.log('Next song:', this.playMode, nextIndex, this.playlist, this.playlist[nextIndex])
            this.playSong(this.currentSong)
        },

        prev() {
            if (this.playlist.length === 0) return

            if(this.historyPlaylist.length > 0){
                this.currentSong = this.historyPlaylist.pop()
                this.playSong(this.currentSong)
                return;
            }

            let prevIndex = this.currentIndex
            if (this.playMode === 'random') {
                while (prevIndex === this.currentIndex) {
                    prevIndex = Math.floor(Math.random() * this.playlist.length)
                }
            } else if (this.playMode === 'sequence') {
                prevIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length
            } else {
                prevIndex = this.currentIndex
            }

            this.currentIndex = prevIndex
            this.currentSong = this.playlist[prevIndex]
            this.playSong(this.currentSong)
        },

        setPlaylist(songs, index = 0) {
            this.playlist = songs
            this.currentIndex = index
            if (songs.length > 0) {
                this.playSong(songs[index])
            }
        },

        setSongAsNext(song) {
            this.nextSong = song;
            alert('已设置下一首歌曲')
            console.log('setSongAsNext', song)
        },

        removeSongFromPlaylist(song) {
            this.playlist = this.playlist.filter(s => s.songKey !== song.songKey)
        },

        clearPlaylist() {
            this.playlist = []
            this.currentIndex = 0
            this.currentSong = null
        },

        async getSongs(title, artist, album, genre) {
            const user = useUserStore()
            try {
                const res = await axios.post(user.url + "/GetSongs", { title, artist, album, genre });
                console.log('getSong', res.data)
                if (res.status != 200) {
                    console.log(res.status, res.statusText)
                    return {
                        code: res.status,
                        msg: res.statusText
                    }
                } else {
                    return {
                        code: res.data.code,
                        data: res.data.data
                    }
                }
            } catch (error) {
                console.log(error.message)
                return {
                    code: 500,
                    msg: error.message
                }
            }
        },

        async recommendSongs() {
            const user = useUserStore()
            try {
                const res = await axios.post(user.url + "/Recommend_Songs", {
                    accountId: user.user.accountId
                });
                console.log('recommendSong', res.data)
                if (res.status != 200) {
                    console.log(res.status, res.statusText)
                    return {
                        code: res.status,
                        msg: res.statusText
                    }
                } else {
                    return {
                        code: res.data.code,
                        data: res.data.data
                    }
                }

            } catch (error) {
                console.log(error.message)
                return {
                    code: 500,
                    msg: error.message
                }
            }
        },

        formatDuration(duration) {
            duration = parseInt(duration)
            const minutes = Math.floor(duration / 60)
            const seconds = Math.floor(duration % 60)
            return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
        }

    }
})
