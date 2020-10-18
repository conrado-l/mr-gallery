import Vue from 'vue'
import VueRouter from 'vue-router'
import PhotosGallery from '../views/PhotosGallery.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Gallery',
    component: PhotosGallery
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/PhotosGallery.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
