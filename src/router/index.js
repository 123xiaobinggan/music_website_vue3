import { createRouter, createWebHistory } from 'vue-router'
import IndexPage from '@/pages/Index/Index.vue'
import HomePage from '@/pages/Home/Index.vue'
import MyMusicsPage from '@/pages/MyMusics/Index.vue'
import ArtistsPage from '@/pages/Artists/Index.vue'
import AboutPage from '@/pages/About/Index.vue'

import PlaylistRecommendPage from '@/pages/Home/PlaylistRecommend/Index.vue'
import NewAlbumsPage from '@/pages/Home/NewAlbums/Index.vue'
import RankingsPage from '@/pages/Home/Rankings/Index.vue'
import MVPage from '@/pages/Home/MV/Index.vue'

import ILikePage from '@/pages/MyMusics/ILike/Index.vue'
import MyPlaylistPage from '@/pages/MyMusics/MyPlaylist/Index.vue'
import FollowingPage from '@/pages/MyMusics/Following/Index.vue'
import FollowersPage from '@/pages/MyMusics/Followers/Index.vue'

import MyPlaylistAllPage from '@/pages/MyMusics/MyPlaylist/Playlist/Index.vue'
import MyPlaylistDetailPage from '@/pages/MyMusics/MyPlaylist/PlaylistDetail/Index.vue'

import SearchPage from '@/pages/Search/Index.vue'
import SongsSearchPage from '@/pages/Search/Songs/Index.vue'
import MVSearchPage from '@/pages/Search/MV/Index.vue'
import AlbumSearchPage from '@/pages/Search/Albums/Index.vue'
import AccountSearchPage from '@/pages/Search/Account/Index.vue'

const routes = [
  {
    path: '/',
    component: IndexPage,
    children: [
      {
        path: '', component: HomePage,
        children: [
          { path: '', component: PlaylistRecommendPage },
          { path: 'newAlbums', component: NewAlbumsPage },
          { path: 'rankings', component: RankingsPage },
          { path: 'mv', component: MVPage },
        ]
      },
      {
        path: 'myMusics', component: MyMusicsPage,
        children: [
          { path: '', component: ILikePage },
          {
            path: 'myPlaylist', component: MyPlaylistPage,
            children: [
              { path: '', component: MyPlaylistAllPage },
              { path: 'detail/:id', name: 'detail', component: MyPlaylistDetailPage },
            ]
          },
          { path: 'following', component: FollowingPage },
          { path: 'followers', component: FollowersPage }
        ]
      },
      { path: 'artists', component: ArtistsPage },
      { path: 'about', component: AboutPage },
      {
        path: 'search',
        component: SearchPage,
        children: [
          { path: 'songs', component: SongsSearchPage },  // 默认显示歌曲搜索
          { path: 'albums', component: AlbumSearchPage },
          { path: 'mvs', component: MVSearchPage },
          { path: 'accounts', component: AccountSearchPage },
        ]
      },
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  document.body.style.overflow = ""
  next()
})


export default router
