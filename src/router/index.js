// Vue
import Vue from 'vue'

// Plugins
import VueRouter from 'vue-router'

// Views
import PhotosGallery from '../views/PhotosGallery.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Gallery',
    component: PhotosGallery
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
