import { ref, computed } from 'vue'
import {format} from 'date-fns'

export default function useMV() {
    // 分类数据
    const categories = ref([
        { id: 'all', name: '全部' },
        { id: 'mainland', name: '内地' },
        { id: 'hktw', name: '港台' },
        { id: 'euus', name: '欧美' },
        { id: 'korea', name: '韩国' },
        { id: 'japan', name: '日本' }
    ]);

    // 当前选中的分类
    const currentCategory = ref('all');

    // MV 数据（模拟数据）
    const allMvData = ref([
        {
            id: 1,
            title: '夜曲',
            artist: '周杰伦',
            cover: 'https://picsum.photos/300/200?random=1',
            duration: '03:45',
            plays: '128万',
            publishDate: new Date('2023-01-15'),
            category: 'hktw'
        },
        {
            id: 2,
            title: '青花瓷',
            artist: '周杰伦',
            cover: 'https://picsum.photos/300/200?random=2',
            duration: '03:20',
            plays: '95万',
            publishDate: new Date('2023-02-20'),
            category: 'hktw'
        },
        {
            id: 3,
            title: '告白气球',
            artist: '周杰伦',
            cover: 'https://picsum.photos/300/200?random=3',
            duration: '03:34',
            plays: '210万',
            publishDate: new Date('2023-03-10'),
            category: 'hktw'
        },
        {
            id: 4,
            title: 'Shape of You',
            artist: 'Ed Sheeran',
            cover: 'https://picsum.photos/300/200?random=4',
            duration: '04:23',
            plays: '350万',
            publishDate: new Date('2023-01-30'),
            category: 'euus'
        },
        {
            id: 5,
            title: 'Dynamite',
            artist: 'BTS',
            cover: 'https://picsum.photos/300/200?random=5',
            duration: '03:19',
            plays: '520万',
            publishDate: new Date('2023-04-05'),
            category: 'korea'
        },
        {
            id: 6,
            title: 'Lemon',
            artist: '米津玄师',
            cover: 'https://picsum.photos/300/200?random=6',
            duration: '04:15',
            plays: '310万',
            publishDate: new Date('2023-02-18'),
            category: 'japan'
        },
        {
            id: 7,
            title: '光年之外',
            artist: '邓紫棋',
            cover: 'https://picsum.photos/300/200?random=7',
            duration: '03:52',
            plays: '180万',
            publishDate: new Date('2023-03-22'),
            category: 'mainland'
        },
        {
            id: 8,
            title: '泡沫',
            artist: '邓紫棋',
            cover: 'https://picsum.photos/300/200?random=8',
            duration: '04:18',
            plays: '165万',
            publishDate: new Date('2023-05-12'),
            category: 'mainland'
        }
    ]);

    // 当前页码和每页数量
    const currentPage = ref(1);
    const itemsPerPage = ref(8);

    // 根据当前分类过滤MV数据
    const filteredMvList = computed(() => {
        if (currentCategory.value === 'all') {
            return allMvData.value;
        }
        return allMvData.value.filter(mv => mv.category === currentCategory.value);
    });

    // 分页后的MV列表
    const mvList = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage.value;
        const end = start + itemsPerPage.value;
        return filteredMvList.value.slice(start, end);
    });

    // 是否还有更多数据
    const hasMore = computed(() => {
        return currentPage.value * itemsPerPage.value < filteredMvList.value.length;
    });

    // 切换分类
    const switchCategory = (categoryId) => {
        currentCategory.value = categoryId;
        currentPage.value = 1; // 重置到第一页
    };

    // 播放MV
    const playMv = (mv) => {
        console.log('播放MV:', mv);
        // 实际项目中这里会跳转到播放页面或者弹出播放器
    };

    // 加载更多
    const loadMore = () => {
        currentPage.value++;
    };

    // 格式化日期
    const formatDate = (date) => {
        return format(date, 'yyyy-MM-dd');
    };

    return {
        categories,
        currentCategory,
        mvList,
        hasMore,
        switchCategory,
        playMv,
        loadMore,
        formatDate,
        currentPage,
        itemsPerPage,
        filteredMvList, // 暴露过滤后的MV列表
        allMvData // 暴露所有MV数据，用于搜索功能
    }
}