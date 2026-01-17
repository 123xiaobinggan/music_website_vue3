import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useUserStore } from '../../../store/user.js'

export default function useSongsSearch() {
    const route = useRoute()
    const router = useRouter()
    const userStore = useUserStore()

    const searchQuery = ref(route.query.keyword || '') // 搜索查询词
    let songs = ref([]);
    let loading = ref(false);
    let count = ref(0);
    const dropdownPosition = ref({ top: 0, left: 0 })
    const showDropdown = ref(false)
    const selectedSong = ref(null)
    const dropdownDirection = ref('bottom-right');

    watch(() => route.query.keyword, (newVal, oldVal) => {
        searchQuery.value = newVal || ''; // 更新搜索查询词
        if (newVal !== oldVal) {
            count.value = 0
            search_songs()
        }
    })

    async function search_songs() {
        let existSongs = []
        if (count.value !== 0) {
            existSongs = songs.value.map(song => song.songKey)
        }
        try {
            const res = await axios.post(userStore.url + '/Search_Songs', { keyword: searchQuery.value, existSongs });
            // console.log('search', res.data)
            if (res.status != 200) {
                console.log(res.status, res.statusText)
            } else {
                if (count.value === 0) {
                    songs.value = res.data.data
                    count.value = songs.value.length
                    console.log('count_value == 0, now_songs', songs.value)
                } else {
                    songs.value = songs.value.concat(res.data.data)
                    songs.value = songs.value.filter((song, index, self) => index === self.findIndex(s => s.songKey === song.songKey))
                    count.value = songs.value.length
                    console.log('count_value != 0, now_songs', songs.value)
                }
            }
            // songs.value = res.data.data
            // console.log('songs', songs.value)
        } catch (error) {
            console.log(error)
        }
    }

    function formatDuration(duration) {
        duration = parseInt(duration)
        const minutes = Math.floor(duration / 60)
        const seconds = Math.floor(duration % 60)
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
    }

    function showPlaylistDropdown(song, event) {
        selectedSong.value = song;
        showDropdown.value = true;

        const button = event.currentTarget;
        if (button) {
            const rect = button.getBoundingClientRect();
            if(rect.top + rect.height > window.innerHeight / 2){
                dropdownDirection.value = 'top-right'
                dropdownPosition.value = {
                    left: rect.left + rect.width,
                    top: rect.top
                }
            }else{
                dropdownDirection.value = 'bottom-right'
                dropdownPosition.value = {
                    left: rect.left + rect.width,
                    top: rect.bottom
                }
            }
        }
        console.log('dropdownPosition', dropdownDirection, dropdownPosition.value)
    }

    function hidePlaylistDropdown() {
        selectedSong.value = null;
        showDropdown.value = false;
    }

    function handleClickOutside(event) {
        const dropdown = event.target.closest('.playlist-dropdown');
        const addButton = event.target.closest('.action-btn.add-btn');

        // 如果点击的既不是下拉菜单也不是添加按钮，则隐藏下拉菜单
        if (!dropdown && !addButton) {
            hidePlaylistDropdown();
        }
    }

    async function addSongToPlaylist(playlistName) {
        try {
            const userStore = useUserStore()
            const res = await userStore.addSongToPlaylist(playlistName, selectedSong.value)
            console.log('addSongToPlaylist', res)
            if (res.code === 0) {
                alert('添加成功')
                hidePlaylistDropdown()
            } else {
                alert(res.msg)
            }
        } catch (err) {
            console.log(err)
            alert('添加失败')
        }
    }

    return {
        songs,
        loading,
        count,
        selectedSong,
        showDropdown,
        dropdownPosition,
        dropdownDirection,
        search_songs,
        showPlaylistDropdown,
        hidePlaylistDropdown,
        handleClickOutside,
        addSongToPlaylist,
        formatDuration
    }
}
