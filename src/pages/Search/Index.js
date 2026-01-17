import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default function useSearch() {
    const route = useRoute()
    const router = useRouter()
    // 标签页配置
    const tabs = [
        { key: 'songs', name: '单曲', path: '/search/songs' },
        { key: 'albums', name: '专辑', path: '/search/albums' },
        { key: 'mvs', name: 'MV视频', path: '/search/mvs' },
        { key: 'accounts', name: '用户', path: '/search/accounts' }
    ]
    let searchKeyword = ref(route.query.keyword || '');
    const backgroundImage = ref('https://picsum.photos/200/200?random=' + Math.floor(Math.random() * 100))


    function search() {
        router.push({ path: '/search/songs', query: { keyword: searchKeyword.value } })
    }

    return { searchKeyword, tabs, backgroundImage, search }
}
