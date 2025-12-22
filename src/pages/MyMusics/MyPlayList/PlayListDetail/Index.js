import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router';

export default function useMyPlayListDetail() {
    let songs = ref([
        {
            id: 1,
            index: 1,
            name: '夜曲',
            artist: '周杰伦',
            album: '十一月的萧邦',
            duration: '03:45'
        },
        {
            id: 2,
            index: 2,
            name: '青花瓷',
            artist: '周杰伦',
            album: '我很忙',
            duration: '03:20'
        },
        {
            id: 3,
            index: 3,
            name: '告白气球',
            artist: '周杰伦',
            album: '周杰伦的床边故事',
            duration: '03:34'
        },
        {
            id: 4,
            index: 4,
            name: '稻香',
            artist: '周杰伦',
            album: '魔杰座',
            duration: '03:42'
        },
        {
            id: 5,
            index: 5,
            name: '七里香',
            artist: '周杰伦',
            album: '七里香',
            duration: '04:05'
        },
        {
            id: 6,
            index: 6,
            name: '简单爱',
            artist: '周杰伦',
            album: '范特西',
            duration: '03:21'
        },
        {
            id: 7,
            index: 7,
            name: '晴天',
            artist: '周杰伦',
            album: '叶惠美',
            duration: '04:29'
        },
        {
            id: 8,
            index: 8,
            name: '菊花台',
            artist: '周杰伦',
            album: '依然范特西',
            duration: '03:59'
        }
    ]);
    const route = useRoute();
    const router = useRouter();
    const playListId = route.params.id;
    const playSong = (song) => {
        console.log('播放歌曲：', song);
    };

    const addToPlaylist = (song) => {
        console.log('添加到播放列表：', song);
    };

    const deleteSong = (song) => {
        console.log('删除歌曲：', song);
    };
    return {
        songs,
        playSong,
        addToPlaylist,
        deleteSong
    }
}