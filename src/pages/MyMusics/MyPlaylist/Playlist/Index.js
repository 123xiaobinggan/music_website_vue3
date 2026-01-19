import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router';
import { useUserStore } from '../../../../store/user.js'

export default function useMyPlaylist() {

  const router = useRouter();

  // 默认封面图片
  const defaultCover = "https://picsum.photos/200/200?random=" + Math.floor(Math.random() * 1000);

  // 悬浮状态
  const hoveredPlaylistId = ref(null);

  // 模态框状态
  const isCreateModalVisible = ref(false);

  // 消息框状态
  const messageBox = reactive({
    visible: false,
    title: '',
    message: '',
    confirmCallback: null,
    cancelCallback: null
  })

  // 新歌单表单数据
  const newPlaylist = reactive({
    name: '',
    coverFile: null,
    coverPreview: "https://picsum.photos/200/200?random=" + Math.floor(Math.random() * 1000)
  });

  const coverInput = ref(null);

  // 显示创建歌单模态框
  function showCreateModal() {
    isCreateModalVisible.value = true;
  }

  // 隐藏创建歌单模态框
  function hideCreateModal() {
    isCreateModalVisible.value = false;
    // 重置表单
    newPlaylist.name = '';
    newPlaylist.coverFile = null;
    newPlaylist.coverPreview = '';
  }

  function showMessage(message, onConfirm = null, onCancel = null) {
    messageBox.visible = true;
    messageBox.message = message;
    messageBox.confirmCallback = onConfirm;
    messageBox.cancelCallback = onCancel;
  }

  // 触发封面上传
  function triggerCoverUpload() {
    coverInput.value.click();
  }

  // 处理封面更改
  function handleCoverChange(event) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("封面文件大小不能超过5MB");
        return;
      }

      newPlaylist.coverFile = file;

      // 创建预览URL
      const reader = new FileReader();
      reader.onload = (e) => {
        newPlaylist.coverPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // 创建歌单
  async function createPlaylist() {
    const userStore = useUserStore();
    if (!newPlaylist.name.trim()) {
      alert("请输入歌单名称");
      return;
    }

    if (userStore.user.playlists.some(playlist => playlist.name === newPlaylist.name)) {
      alert("歌单名称已存在");
      return;
    }

    // 这里应该调用API创建歌单
    console.log("创建歌单:", {
      name: newPlaylist.name,
      cover: "https://picsum.photos/id/" + Math.floor(Math.random() * 1000) + "/100/100"
    });
    userStore.isLoading = true;
    let uploadCoverUrl = defaultCover;
    if (newPlaylist.coverFile) {
      uploadCoverUrl = await userStore.uploadAvatar(newPlaylist.coverFile);
    }

    const res = await userStore.createPlaylist(
      newPlaylist.name,
      uploadCoverUrl,
    );
    if (res.code == 0) {
      alert("歌单创建成功");
      hideCreateModal();
    } else {
      alert("歌单创建失败");
    }
    userStore.isLoading = false;
  }

  // 播放歌单
  function playPlaylist(playlistId) {
    console.log("播放歌单:", playlistId);
    // 这里应该调用播放功能
  }

  // 进入歌单详情页
  function goToPlaylist(name) {
    router.push({
      name: 'detail',
      params: { id: name }
    });
  }

  // 歌单删除
  async function deletePlaylist(name) {
    if (name === '最近听过' || name === '我喜欢') {
      alert('无法删除固有歌单');
      return;
    }
    console.log('删除歌单：', name.value);
    showMessage("确定删除歌单 \"" + name + "\" 吗?", async () => {
      try {
        const userStore = useUserStore();
        const res = await userStore.deletePlaylist(name);
        if (res.code === 0) {
          console.log('删除成功')
          alert('删除成功');
        } else {
          console.log(res.msg)
          alert('删除失败');
        }
      } catch (err) {
        console.log(err)
        alert('删除失败');
      }
    },
      () => {
        console.log('取消删除')
      }
    )
  }

  return {
    hoveredPlaylistId,
    isCreateModalVisible,
    newPlaylist,
    coverInput,
    messageBox,
    showCreateModal,
    hideCreateModal,
    showMessage,
    triggerCoverUpload,
    handleCoverChange,
    createPlaylist,
    playPlaylist,
    goToPlaylist,
    deletePlaylist
  }
}