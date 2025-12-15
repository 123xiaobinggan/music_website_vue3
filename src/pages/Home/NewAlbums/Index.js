import { ref, computed } from 'vue'


export default function useNewAlbums() {
    const regions = ref([
        { key: 'mainland', name: '内地' },
        { key: 'hktw', name: '港台' },
        { key: 'europe', name: '欧美' },
        { key: 'japan', name: '日本' },
        { key: 'korea', name: '韩国' }
    ]);

    // 当前选中地区
    const currentRegion = ref('mainland');

    // 初始显示专辑数量
    const albumsToShow = ref(20);

    // 模拟专辑数据
    const albums = ref([
        // 内地专辑
        { id: 1, region: 'mainland', cover: 'https://picsum.photos/200/200?random=1', title: '夜曲', artist: '周杰伦', releaseDate: '2023-10-01' },
        { id: 2, region: 'mainland', cover: 'https://picsum.photos/200/200?random=2', title: '平凡之路', artist: '朴树', releaseDate: '2023-09-15' },
        { id: 3, region: 'mainland', cover: 'https://picsum.photos/200/200?random=3', title: '光年之外', artist: '邓紫棋', releaseDate: '2023-08-20' },
        { id: 4, region: 'mainland', cover: 'https://picsum.photos/200/200?random=4', title: '匆匆那年', artist: '王菲', releaseDate: '2023-07-12' },
        { id: 5, region: 'mainland', cover: 'https://picsum.photos/200/200?random=5', title: '演员', artist: '薛之谦', releaseDate: '2023-06-30' },
        { id: 6, region: 'mainland', cover: 'https://picsum.photos/200/200?random=6', title: '告白气球', artist: '周杰伦', releaseDate: '2023-05-18' },
        { id: 7, region: 'mainland', cover: 'https://picsum.photos/200/200?random=7', title: '消愁', artist: '毛不易', releaseDate: '2023-04-22' },
        { id: 8, region: 'mainland', cover: 'https://picsum.photos/200/200?random=8', title: '体面', artist: '于文文', releaseDate: '2023-03-10' },

        // 港台专辑
        { id: 9, region: 'hktw', cover: 'https://picsum.photos/200/200?random=9', title: '七里香', artist: '周杰伦', releaseDate: '2023-10-05' },
        { id: 10, region: 'hktw', cover: 'https://picsum.photos/200/200?random=10', title: '祝福', artist: '张学友', releaseDate: '2023-09-28' },
{ id: 11, region: 'hktw', cover: 'https://picsum.photos/200/200?random=11', title: '真情流露', artist: '张学友', releaseDate: '2023-08-15' },
{ id: 12, region: 'hktw', cover: 'https://picsum.photos/200/200?random=12', title: '忘记你我做不到', artist: '张学友', releaseDate: '2023-07-21' },
{ id: 13, region: 'hktw', cover: 'https://picsum.photos/200/200?random=13', title: '只想一生跟你走', artist: '张学友', releaseDate: '2023-06-08' },
{ id: 14, region: 'hktw', cover: 'https://picsum.photos/200/200?random=14', title: '爱不完', artist: '刘德华', releaseDate: '2023-05-12' },
{ id: 15, region: 'hktw', cover: 'https://picsum.photos/200/200?random=15', title: '忘情水', artist: '刘德华', releaseDate: '2023-04-19' },
{ id: 16, region: 'hktw', cover: 'https://picsum.photos/200/200?random=16', title: '中国人', artist: '刘德华', releaseDate: '2023-03-25' },

        // 欧美专辑
        { id: 17, region: 'europe', cover: 'https://picsum.photos/200/200?random=17', title: 'Divide', artist: 'Ed Sheeran', releaseDate: '2023-10-12' },
        { id: 18, region: 'europe', cover: 'https://picsum.photos/200/200?random=18', title: '25', artist: 'Adele', releaseDate: '2023-09-08' },
        { id: 19, region: 'europe', cover: 'https://picsum.photos/200/200?random=19', title: '1989', artist: 'Taylor Swift', releaseDate: '2023-08-30' },
        { id: 20, region: 'europe', cover: 'https://picsum.photos/200/200?random=20', title: 'Purpose', artist: 'Justin Bieber', releaseDate: '2023-07-14' },
        { id: 21, region: 'europe', cover: 'https://picsum.photos/200/200?random=21', title: 'Views', artist: 'Drake', releaseDate: '2023-06-29' },
        { id: 22, region: 'europe', cover: 'https://picsum.photos/200/200?random=22', title: 'Lemonade', artist: 'Beyoncé', releaseDate: '2023-05-03' },
        { id: 23, region: 'europe', cover: 'https://picsum.photos/200/200?random=23', title: 'Anti', artist: 'Rihanna', releaseDate: '2023-04-17' },
        { id: 24, region: 'europe', cover: 'https://picsum.photos/200/200?random=24', title: '24K Magic', artist: 'Bruno Mars', releaseDate: '2023-03-11' },

        // 日本专辑
        { id: 25, region: 'japan', cover: 'https://picsum.photos/200/200?random=25', title: 'Your Choice', artist: 'SEVENTEEN', releaseDate: '2023-10-18' },
        { id: 26, region: 'japan', cover: 'https://picsum.photos/200/200?random=26', title: 'One of a Kind', artist: '倖田來未', releaseDate: '2023-09-22' },
        { id: 27, region: 'japan', cover: 'https://picsum.photos/200/200?random=27', title: 'BANGERZ', artist: 'MILEY CYRUS', releaseDate: '2023-08-14' },
        { id: 28, region: 'japan', cover: 'https://picsum.photos/200/200?random=28', title: 'Unorthodox Jukebox', artist: 'Bruno Mars', releaseDate: '2023-07-09' },
        { id: 29, region: 'japan', cover: 'https://picsum.photos/200/200?random=29', title: 'Red', artist: 'Taylor Swift', releaseDate: '2023-06-15' },
        { id: 30, region: 'japan', cover: 'https://picsum.photos/200/200?random=30', title: 'Good Girl Gone Bad', artist: 'Rihanna', releaseDate: '2023-05-23' },
        { id: 31, region: 'japan', cover: 'https://picsum.photos/200/200?random=31', title: 'Back to Black', artist: 'Amy Winehouse', releaseDate: '2023-04-08' },
        { id: 32, region: 'japan', cover: 'https://picsum.photos/200/200?random=32', title: 'FutureSex/LoveSounds', artist: 'Justin Timberlake', releaseDate: '2023-03-28' },

        // 韩国专辑
        { id: 33, region: 'korea', cover: 'https://picsum.photos/200/200?random=33', title: 'MAP OF THE SOUL', artist: 'BTS', releaseDate: '2023-10-22' },
        { id: 34, region: 'korea', cover: 'https://picsum.photos/200/200?random=34', title: 'LOVE YOURSELF', artist: 'BTS', releaseDate: '2023-09-18' },
        { id: 35, region: 'korea', cover: 'https://picsum.photos/200/200?random=35', title: 'The War', artist: 'EXO', releaseDate: '2023-08-27' },
        { id: 36, region: 'korea', cover: 'https://picsum.photos/200/200?random=36', title: '180727', artist: 'Wanna One', releaseDate: '2023-07-16' },
        { id: 37, region: 'korea', cover: 'https://picsum.photos/200/200?random=37', title: 'What is Love?', artist: 'TWICE', releaseDate: '2023-06-11' },
        { id: 38, region: 'korea', cover: 'https://picsum.photos/200/200?random=38', title: 'Summer Vibes', artist: 'Red Velvet', releaseDate: '2023-05-29' },
        {
            id: 39, region: 'korea', cover: 'https://picsum.photos/200/200?random=39', title: 'The Best Thing I Ever Did', artist: 'Girls', releaseDate: '2023-04 - 25'
        },
        { id: 40, region: 'korea', cover: 'https://picsum.photos/200/200?random=40', title: 'I Need U', artist: 'BTS', releaseDate: '2023-03-30' }
    ]);

    // 根据当前地区过滤专辑
    const filteredAlbums = computed(() => {
        return albums.value
            .filter(album => album.region === currentRegion.value)
            .slice(0, albumsToShow.value);
    });

    // 切换地区
    function switchRegion(regionKey) {
        currentRegion.value = regionKey;
        // 重置显示数量
        albumsToShow.value = 20;
    }

    // 加载更多专辑
    function loadMore() {
        albumsToShow.value += 20;
    }
    return {
        regions,
        albums,
        currentRegion,
        filteredAlbums,
        switchRegion,
        loadMore,
    }
}