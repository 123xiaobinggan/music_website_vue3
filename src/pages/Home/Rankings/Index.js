import {ref, computed} from 'vue'


export default function useRankings() {
    // 模拟排行榜数据
const rankings = ref([
  {
    id: 1,
    cover: "https://picsum.photos/60/60?random=1",
    title: "夜曲",
    artist: "周杰伦",
    duration: "3:45"
  },
  {
    id: 2,
    cover: "https://picsum.photos/60/60?random=2",
    title: "青花瓷",
    artist: "周杰伦",
    duration: "3:58"
  },
  {
    id: 3,
    cover: "https://picsum.photos/60/60?random=3",
    title: "稻香",
    artist: "周杰伦",
    duration: "4:12"
  },
  {
    id: 4,
    cover: "https://picsum.photos/60/60?random=4",
    title: "告白气球",
    artist: "周杰伦",
    duration: "3:33"
  },
  {
    id: 5,
    cover: "https://picsum.photos/60/60?random=5",
    title: "晴天",
    artist: "周杰伦",
    duration: "4:20"
  },
  {
    id: 6,
    cover: "https://picsum.photos/60/60?random=6",
    title: "七里香",
    artist: "周杰伦",
    duration: "4:05"
  },
  {
    id: 7,
    cover: "https://picsum.photos/60/60?random=7",
    title: "简单爱",
    artist: "周杰伦",
    duration: "3:20"
  },
  {
    id: 8,
    cover: "https://picsum.photos/60/60?random=8",
    title: "双截棍",
    artist: "周杰伦",
    duration: "3:15"
  },
  {
    id: 9,
    cover: "https://picsum.photos/60/60?random=9",
    title: "龙卷风",
    artist: "周杰伦",
    duration: "3:40"
  },
  {
    id: 10,
    cover: "https://picsum.photos/60/60?random=10",
    title: "听妈妈的话",
    artist: "周杰伦",
    duration: "4:10"
  }
]);

// 获取奖牌图标
function getMedal(index) {
  const medals = ['🥇', '🥈', '🥉'];
  return medals[index];
}

// 定义操作函数
const playSong = (song) => {
  console.log("播放歌曲:", song);
  // 这里可以调用播放器逻辑
};

const addToPlaylist = (song) => {
  console.log("添加到歌单:", song);
  // 这里可以实现添加到歌单的逻辑
};

const shareSong = (song) => {
  console.log("分享歌曲:", song);
  // 这里可以实现分享逻辑
};

return{
  rankings,
  getMedal,
  playSong,
  addToPlaylist,
  shareSong
}
}