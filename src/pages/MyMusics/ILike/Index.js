import { ref, reactive } from 'vue'
import { usePlayerStore } from '../../../store/player.js'
import { useUserStore } from '../../../store/user.js'

export default function useILike() {

  const dropdownPosition = ref({ top: 0, left: 0 })
  const showDropdown = ref(false)
  const selectedSong = ref(null)
  const dropdownDirection = ref('bottom-right')

  const messageBox = reactive({
    visible: false, // 控制模态框的显示与隐藏
    message: '', // 消息内容
    confirmCallback: null, // 确认按钮回调函数
    cancelCallback: null, // 取消按钮回调函数
  });

  async function initSongs() {

  }


  function playSong(song) {
    console.log('播放歌曲：', song);
  }

  function showMessageBox(message, confirmCallback, cancelCallback) {
    messageBox.visible = true;
    messageBox.message = message;
    messageBox.confirmCallback = confirmCallback;
    messageBox.cancelCallback = cancelCallback;
  }

  function hideMessageBox() {
    messageBox.visible = false;
  }

  function deleteSong(song) {
    console.log('删除歌曲：', song);
    showMessageBox(`确定要删除歌曲"${song.title}"吗？`, async () => {
      try {
        const userStore = useUserStore();
        const res = await userStore.removeSongFromPlaylist('我喜欢', song);
        if (res.code !== 0) {
          console.log(res.msg);
          alert(`删除失败, ${res.msg}`);
        } else {
          console.log('删除成功');
          alert('删除成功');
          hideMessageBox();
        }
      } catch (err) {
        console.log(err);
      }
    }, () => {
      console.log('取消删除');
      hideMessageBox();
    });
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
    console.log('handleClickOutside', dropdown, addButton)
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
    dropdownPosition,
    showDropdown,
    selectedSong,
    dropdownDirection,
    messageBox,
    playSong,
    addSongToPlaylist,
    deleteSong,
    showMessageBox,
    hideMessageBox,
    showPlaylistDropdown,
    hidePlaylistDropdown,
    handleClickOutside
  }
}
