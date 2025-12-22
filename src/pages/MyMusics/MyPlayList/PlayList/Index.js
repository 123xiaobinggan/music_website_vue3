import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router';
export default function useMyPlayList() {

  const router = useRouter();

  // 默认封面图片
  const defaultCover = "https://binggan-1358387153.cos.ap-guangzhou.myqcloud.com/User/xiaobinggan.jpg";

  // 歌单数据（模拟数据，实际应该从API获取）
  const playlists = ref([
    {
      id: 1,
      name: "我喜欢的音乐",
      cover: "https://picsum.photos/100/100?random=1",
      trackCount: 25
    },
    {
      id: 2,
      name: "学习专注",
      cover: "https://picsum.photos/100/100?random=2",
      trackCount: 18
    },
    {
      id: 3,
      name: "运动节拍",
      cover: "https://picsum.photos/100/100?random=3",
      trackCount: 32
    },
    {
      id: 4,
      name: "深夜电台",
      cover: "https://picsum.photos/100/100?random=4",
      trackCount: 15
    }
  ]);

  // 悬浮状态
  const hoveredPlaylistId = ref(null);

  // 模态框状态
  const isCreateModalVisible = ref(false);

  // 新歌单表单数据
  const newPlaylist = reactive({
    name: '',
    coverFile: null,
    coverPreview: ''
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
  function createPlaylist() {
    if (!newPlaylist.name.trim()) {
      alert("请输入歌单名称");
      return;
    }

    // 这里应该调用API创建歌单
    console.log("创建歌单:", {
      name: newPlaylist.name,
      cover: newPlaylist.coverFile
    });

    // 模拟创建成功
    const newId = playlists.value.length + 1;
    playlists.value.push({
      id: newId,
      name: newPlaylist.name,
      cover: newPlaylist.coverPreview || defaultCover,
      trackCount: 0
    });

    alert("歌单创建成功");
    hideCreateModal();
  }
  // 播放歌单
  function playPlaylist(playlistId) {
    console.log("播放歌单:", playlistId);
    // 这里应该调用播放功能
  }

  // 进入歌单详情页
  function goToPlaylist(playlistId) {
    router.push({
      name: 'detail',
      params: { id: playlistId }
    });
  }

  return { playlists, hoveredPlaylistId, isCreateModalVisible, newPlaylist, coverInput, showCreateModal, hideCreateModal, triggerCoverUpload, handleCoverChange, createPlaylist, playPlaylist, goToPlaylist }
}