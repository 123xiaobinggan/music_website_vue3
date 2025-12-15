import { createRouter, createWebHistory } from 'vue-router'
import IndexPage from '@/pages/Index/Index.vue'
import HomePage from '@/pages/Home/Index.vue'
import MyMusicsPage from '@/pages/MyMusics/Index.vue'
import ArtistsPage from '@/pages/Artists/Index.vue'
import AboutPage from '@/pages/About/Index.vue'

import PlayListRecommendPage from '@/pages/Home/PlayListRecommend/Index.vue'
import NewAlbumsPage from '@/pages/Home/NewAlbums/Index.vue'
import RankingsPage from '@/pages/Home/Rankings/Index.vue'
import MVPage from '@/pages/Home/MV/Index.vue'

import ILikePage from '@/pages/MyMusics/ILike/Index.vue'
import MyPlayListPage from '@/pages/MyMusics/MyPlayList/Index.vue'
import FollowingPage from '@/pages/MyMusics/Following/Index.vue'
import FollowersPage from '@/pages/MyMusics/Followers/Index.vue'

const routes = [
  {
    path: '/',
    component: IndexPage,
    children: [
      {
        path: '', component: HomePage,
        children: [
          { path: '', component: PlayListRecommendPage },
          { path: 'newAlbums', component: NewAlbumsPage },
          { path: 'rankings', component: RankingsPage },
          { path: 'mv', component: MVPage },
        ]
      },
      {
        path: 'myMusics', component: MyMusicsPage,
        children: [
          { path: '', component: ILikePage },
          { path: 'myPlayList', component: MyPlayListPage },
          { path: 'following', component: FollowingPage },
          { path: 'followers', component: FollowersPage }
        ]
      },
      { path: 'artists', component: ArtistsPage },
      { path: 'about', component: AboutPage }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
