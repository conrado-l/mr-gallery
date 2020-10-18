<template>
  <v-container>
    <viewer :images="getPhotos" @inited="viewerInitialized">
      <v-row>
        <v-col
          v-for="photo in getPhotos"
          :key="photo.id"
          class="d-flex child-flex"
          md="4"
          sm="2"
          xs="2"
        >
          <img
            :src="photo.cropped_picture"
            class="grey lighten-2 v-chip--clickable"/>
        </v-col>
      </v-row>
    </viewer>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
import Vue from 'vue'

Vue.use(Viewer)

/** Shows the photos organized in a grid **/
export default {
  name: 'PhotosGallery',
  data: () => ({
    showPhotosDetail: false
  }),
  computed: {
    ...mapGetters('photos', [
      'getPhotos',
      'getIsFetching'
    ])
  },
  methods: {
    /** Fired when the image is clicked, opening the photo detail modal **/
    onImageClick () {
      this.showPhotosDetail = true
    },
    /** Fired when the viewer is initialized, it sets the access */
    viewerInitialized (viewer) {
      this.$viewer = viewer
    }
  },
  /** Mounted life-cycle hook **/
  mounted () {
    this.$store.dispatch('photos/fetchPhotos')
    setTimeout(() => {
      // this.$viewer.show()
    }, 2000)
  }
}
</script>
