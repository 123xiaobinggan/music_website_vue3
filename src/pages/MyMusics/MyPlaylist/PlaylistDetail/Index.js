import { ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { usePlayerStore } from '@/store/player.js';
import { useUserStore } from '@/store/user.js';


export default function useMyPlaylistDetail() {
    const route = useRoute();
    const router = useRouter();
    const playlistName = route.params.id;
    let isShowModal = ref(false);
    let newPlaylistName = ref(playlistName);
    let fileInput = ref(null);
    let coverUrl = ref('https://picsum.photos/' + Math.floor(Math.random() * 1000) + '/200/200');
    const userStore = useUserStore();

    const dropdownPosition = ref({ top: 0, left: 0 })
    const showDropdown = ref(false)
    const selectedSong = ref(null)
    const dropdownDirection = ref('bottom-right')

    // 消息框状态
    const messageBox = reactive({
        visible: false,
        title: '',
        message: '',
        confirmCallback: null,
        cancelCallback: null
    })

    async function init() {
        console.log(userStore.user.playlists.find(
            (playlist) => playlist.name === playlistName
        )?.songs);
        const playlist = userStore.user.playlists.find(playlist => playlist.name === playlistName);
        if (playlist) {
            newPlaylistName.value = playlist.name;
            coverUrl.value = playlist.coverUrl;
        } else {
            newPlaylistName.value = playlistName;
            coverUrl.value = 'https://picsum.photos/' + Math.floor(Math.random() * 1000) + '/200/200';
        }
    }

    async function triggerFileSelect() {
        fileInput.value.click();
    }

    async function handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('文件大小不能超过5MB');
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                coverUrl.value = e.target.result;
            };
            reader.readAsDataURL(file);
        }

    }

    async function save() {
        if (newPlaylistName.value === '') {
            alert('歌单名称不能为空');
            return;
        }
        console.log('保存歌单：', newPlaylistName.value, fileInput.value.files[0]);
        userStore.isLoading = true;
        try {
            let coverToUpload = null;
            if (fileInput.value && fileInput.value.files && fileInput.value.files[0]) {
                coverToUpload = fileInput.value.files[0];
            }
            const res = await userStore.updatePlaylist(newPlaylistName.value, coverToUpload, playlistName);
            if (res.code === 0) {
                console.log('更新成功')
                isShowModal.value = false;
                alert('更新成功');
                if (newPlaylistName.value !== playlistName) {
                    router.replace({
                        name: 'detail',
                        params: { id: newPlaylistName.value }
                    });
                }
            } else {
                console.log(res.msg)
                alert('更新失败');
            }
        } catch (err) {
            console.log(err)
        } finally {
            userStore.isLoading = false;
        }
    }

    async function playSong(song) {
        console.log('播放歌曲：', song);
        const playerStore = usePlayerStore();
        await playerStore.playSong(song);
    }

    function showMessage(message, confirmCallback, cancelCallback) {
        messageBox.visible = true;
        messageBox.message = message;
        messageBox.confirmCallback = confirmCallback;
        messageBox.cancelCallback = cancelCallback;
    }

    function hideMessage() {
        messageBox.visible = false;
    }

    async function deleteSong(song) {
        console.log('删除歌曲：', song);
        showMessage("确定删除歌曲 \"" + song.title + "\" 吗?", async () => {
            try {
                const res = await userStore.removeSongFromPlaylist(playlistName, song);
                if (res.code === 0) {
                    console.log('删除成功')
                    alert('删除成功');
                } else {
                    console.log(res.msg)
                    alert('删除失败');
                }
            } catch (err) {
                console.log(err)
            } finally {
                hideMessage()
            }
        },
            () => {
                console.log('取消删除')
                hideMessage()
            }
        )
    }

    function showPlaylistDropdown(song, event) {
        selectedSong.value = song;
        showDropdown.value = true;

        const button = event.currentTarget;
        if (button) {
            const rect = button.getBoundingClientRect();
            if (rect.top + rect.height > window.innerHeight / 2) {
                dropdownDirection.value = 'top-right'
                dropdownPosition.value = {
                    left: rect.left + rect.width,
                    top: rect.top
                }
            } else {
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
        isShowModal,
        newPlaylistName,
        coverUrl,
        fileInput,
        playlistName,
        messageBox,
        showDropdown,
        dropdownPosition,
        selectedSong,
        dropdownDirection,
        init,
        save,
        playSong,
        addSongToPlaylist,
        deleteSong,
        triggerFileSelect,
        handleFileUpload,
        showPlaylistDropdown,
        hidePlaylistDropdown,
        handleClickOutside,
    }
}

