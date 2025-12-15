import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

export default function useArtists() {
  const router = useRouter()
  
  // 筛选条件
  const currentLetter = ref('')
  const currentArea = ref('')
  const currentGender = ref('')
  const currentGenre = ref('')

  // 26个英文字母
  const letters = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
  ]

  // 地域分类
  const areas = [
    { id: 'mainland', name: '内地' },
    { id: 'hktw', name: '港台' },
    { id: 'euus', name: '欧美' },
    { id: 'japan', name: '日本' },
    { id: 'korea', name: '韩国' }
  ]

  // 性别分类
  const genders = [
    { id: 'male', name: '男' },
    { id: 'female', name: '女' },
    { id: 'band', name: '组合' }
  ]

  // 风格类型
  const genres = [
    { id: 'pop', name: '流行' },
    { id: 'rap', name: '说唱' },
    { id: 'guofeng', name: '国风' },
    { id: 'rock', name: '摇滚' },
    { id: 'electronic', name: '电子' },
    { id: 'folk', name: '民谣' },
    { id: 'rnb', name: 'R&B' },
    { id: 'ethnic', name: '民族乐' },
    { id: 'light', name: '轻音乐' },
    { id: 'jazz', name: '爵士' },
    { id: 'classic', name: '古典' },
    { id: 'country', name: '乡村' },
    { id: 'blues', name: '蓝调' }
  ]

  // 歌手数据（模拟数据）
  const artists = [
    {
      id: 1,
      name: '周杰伦',
      avatar: 'https://picsum.photos/200/200?random=1',
      firstLetter: 'Z',
      area: 'hktw',
      gender: 'male',
      genres: ['pop', 'rnb', 'rap']
    },
    {
      id: 2,
      name: '邓紫棋',
      avatar: 'https://picsum.photos/200/200?random=2',
      firstLetter: 'D',
      area: 'mainland',
      gender: 'female',
      genres: ['pop', 'rock']
    },
    {
      id: 3,
      name: '林俊杰',
      avatar: 'https://picsum.photos/200/200?random=3',
      firstLetter: 'L',
      area: 'hktw',
      gender: 'male',
      genres: ['pop', 'rnb']
    },
    {
      id: 4,
      name: 'Taylor Swift',
      avatar: 'https://picsum.photos/200/200?random=4',
      firstLetter: 'T',
      area: 'euus',
      gender: 'female',
      genres: ['pop', 'country']
    },
    {
      id: 5,
      name: '五月天',
      avatar: 'https://picsum.photos/200/200?random=5',
      firstLetter: 'W',
      area: 'hktw',
      gender: 'band',
      genres: ['rock', 'pop']
    },
    {
      id: 6,
      name: 'BTS',
      avatar: 'https://picsum.photos/200/200?random=6',
      firstLetter: 'B',
      area: 'korea',
      gender: 'band',
      genres: ['pop', 'rap']
    },
    {
      id: 7,
      name: '宇多田光',
      avatar: 'https://picsum.photos/200/200?random=7',
      firstLetter: 'Y',
      area: 'japan',
      gender: 'female',
      genres: ['pop', 'rnb']
    },
    {
      id: 8,
      name: 'Coldplay',
      avatar: 'https://picsum.photos/200/200?random=8',
      firstLetter: 'C',
      area: 'euus',
      gender: 'band',
      genres: ['pop', 'rock']
    },
    {
      id: 9,
      name: '李荣浩',
      avatar: 'https://picsum.photos/200/200?random=9',
      firstLetter: 'L',
      area: 'mainland',
      gender: 'male',
      genres: ['pop', 'rock']
    },
    {
      id: 10,
      name: '蔡依林',
      avatar: 'https://picsum.photos/200/200?random=10',
      firstLetter: 'C',
      area: 'hktw',
      gender: 'female',
      genres: ['pop', 'dance']
    },
    {
      id: 11,
      name: 'Bruno Mars',
      avatar: 'https://picsum.photos/200/200?random=11',
      firstLetter: 'B',
      area: 'euus',
      gender: 'male',
      genres: ['pop', 'rnb', 'funk']
    },
    {
      id: 12,
      name: 'BLACKPINK',
      avatar: 'https://picsum.photos/200/200?random=12',
      firstLetter: 'B',
      area: 'korea',
      gender: 'band',
      genres: ['pop', 'dance']
    }
  ]

  // 筛选后的歌手列表
  const filteredArtists = computed(() => {
    return artists.filter(artist => {
      // 首字母筛选
      if (currentLetter.value && artist.firstLetter !== currentLetter.value) {
        return false
      }
      
      // 地域筛选
      if (currentArea.value && artist.area !== currentArea.value) {
        return false
      }
      
      // 性别筛选
      if (currentGender.value && artist.gender !== currentGender.value) {
        return false
      }
      
      // 风格类型筛选
      if (currentGenre.value && !artist.genres.includes(currentGenre.value)) {
        return false
      }
      
      return true
    })
  })

  // 选择首字母
  const selectLetter = (letter) => {
    currentLetter.value = letter
  }

  // 选择地域
  const selectArea = (area) => {
    currentArea.value = area
  }

  // 选择性别
  const selectGender = (gender) => {
    currentGender.value = gender
  }

  // 选择风格类型
  const selectGenre = (genre) => {
    currentGenre.value = genre
  }

  // 跳转到歌手详情页
  const goToArtist = (artistId) => {
    router.push(`/artist/${artistId}`)
  }

  return {
    letters,
    areas,
    genders,
    genres,
    artists,
    currentLetter,
    currentArea,
    currentGender,
    currentGenre,
    filteredArtists,
    selectLetter,
    selectArea,
    selectGender,
    selectGenre,
    goToArtist
  }
}