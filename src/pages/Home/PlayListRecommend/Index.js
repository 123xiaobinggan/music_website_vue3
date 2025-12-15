
import { ref,computed } from 'vue'

export default function usePlayListRecommend() {

    // 模拟歌单数据
    const playlists = ref([
        { id: 1, cover: 'https://picsum.photos/200/200?random=1', title: '流行音乐精选', description: '最新流行歌曲合集' },
        { id: 2, cover: 'https://picsum.photos/200/200?random=2', title: '经典老歌回顾', description: '怀旧金曲珍藏' },
        { id: 3, cover: 'https://picsum.photos/200/200?random=3', title: '摇滚激情', description: '释放内心的狂野' },
        { id: 4, cover: 'https://picsum.photos/200/200?random=4', title: '轻音乐放松', description: '舒缓心灵的旋律' },
        { id: 5, cover: 'https://picsum.photos/200/200?random=5', title: '电子舞曲', description: '节拍动感十足' },
        { id: 6, cover: 'https://picsum.photos/200/200?random=6', title: '民谣小调', description: '温暖人心的故事' },
        { id: 7, cover: 'https://picsum.photos/200/200?random=7', title: '爵士风情', description: '优雅的都市夜晚' },
        { id: 8, cover: 'https://picsum.photos/200/200?random=8', title: '古典音乐', description: '跨越世纪的经典' },
        { id: 9, cover: 'https://picsum.photos/200/200?random=9', title: '嘻哈节奏', description: '街头文化的韵律' },
        { id: 10, cover: 'https://picsum.photos/200/200?random=10', title: '乡村音乐', description: '简单纯朴的生活' }
    ])

    // 模拟新歌数据
    const newSongs = ref([
        { id: 1, cover: 'https://picsum.photos/200/200?random=11', title: '夏日微风', artist: '张三' },
        { id: 2, cover: 'https://picsum.photos/200/200?random=12', title: '星空下的约定', artist: '李四' },
        { id: 3, cover: 'https://picsum.photos/200/200?random=13', title: '时光旅行', artist: '王五' },
        { id: 4, cover: 'https://picsum.photos/200/200?random=14', title: '梦想启航', artist: '赵六' },
        { id: 5, cover: 'https://picsum.photos/200/200?random=15', title: '心之所向', artist: '钱七' },
        { id: 6, cover: 'https://picsum.photos/200/200?random=16', title: '青春不散场', artist: '孙八' },
        { id: 7, cover: 'https://picsum.photos/200/200?random=17', title: '雨后彩虹', artist: '周九' },
        { id: 8, cover: 'https://picsum.photos/200/200?random=18', title: '逆风飞翔', artist: '吴十' },
        { id: 9, cover: 'https://picsum.photos/200/200?random=19', title: '月光奏鸣曲', artist: '郑一' },
        { id: 10, cover: 'https://picsum.photos/200/200?random=20', title: '晨曦初现', artist: '王二' }
    ])

    // 歌单分页相关
    const playlistCurrentPage = ref(0)
    const itemsPerPage = 5

    // 计算歌单分页
    const playlistPages = computed(() => {
        const pages = []
        for (let i = 0; i < playlists.value.length; i += itemsPerPage) {
            pages.push(playlists.value.slice(i, i + itemsPerPage))
        }
        return pages
    })

    // 计算新歌分页
    const newSongPages = computed(() => {
        const pages = []
        for (let i = 0; i < newSongs.value.length; i += itemsPerPage) {
            pages.push(newSongs.value.slice(i, i + itemsPerPage))
        }
        return pages
    })

    // 新歌分页相关
    const newSongCurrentPage = ref(0)

    // 歌单翻页功能
    const nextPlaylistPage = () => {
        if (playlistCurrentPage.value < playlistPages.value.length - 1) {
            playlistCurrentPage.value++
        } else {
            playlistCurrentPage.value = 0 // 循环回到第一页
        }
    }

    const prevPlaylistPage = () => {
        if (playlistCurrentPage.value > 0) {
            playlistCurrentPage.value--
        } else {
            playlistCurrentPage.value = playlistPages.value.length - 1 // 循环到最后一页
        }
    }

    const goToPlaylistPage = (index) => {
        playlistCurrentPage.value = index
    }

    // 新歌翻页功能
    const nextNewSongPage = () => {
        if (newSongCurrentPage.value < newSongPages.value.length - 1) {
            newSongCurrentPage.value++
        } else {
            newSongCurrentPage.value = 0 // 循环回到第一页
        }
    }

    const prevNewSongPage = () => {
        if (newSongCurrentPage.value > 0) {
            newSongCurrentPage.value--
        } else {
            newSongCurrentPage.value = newSongPages.value.length - 1 // 循环到最后一页
        }
    }

    const goToNewSongPage = (index) => {
        newSongCurrentPage.value = index
    }
    return {
        playlists,
        newSongs,
        playlistPages,
        newSongPages,
        playlistCurrentPage,
        newSongCurrentPage,
        nextPlaylistPage,
        prevPlaylistPage,
        goToPlaylistPage,
        nextNewSongPage,
        prevNewSongPage,
        goToNewSongPage
    }
}