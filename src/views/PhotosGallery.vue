<template>
  <v-container>
    <PhotosGrid :photos="getPhotos"
                :fetching-photos="getIsFetchingPhotos"
                :fetching-photo-details="getIsFetchingPhotoDetails"
                @load-more-photos="fetchThumbnailPhotos()"
                @photo-clicked="fetchPhotoDetail($event)">
    </PhotosGrid>
  </v-container>
</template>

<script>
// Vuex
import { mapGetters } from 'vuex'

// Components
import PhotosGrid from '@/components/PhotosGrid'

/**
 * It renders a gallery of photos in a grid
 **/
export default {
  components: { PhotosGrid },
  computed: {
    ...mapGetters('photos', [
      'getPhotos',
      'getIsFetchingPhotos',
      'getIsFetchingPhotoDetails',
      'getIsPhotoDetailsLoaded'
    ])
  },
  methods: {
    /**
     * Fetches the thumbnail photos
     /**/
    fetchThumbnailPhotos () {
      // Prevent multiple calls if there is a fetch in progress
      if (this.getIsFetchingPhotos) {
        return
      }

      this.$store.dispatch('photos/fetchPhotos')
        .catch(() => {
          this.$toast.error('An error has occurred while fetching the photos')
        })
    },

    /**
     * Fetches the photo detail *
     * @param {string} photoId
     **/
    fetchPhotoDetail (photoId) {
      // Avoid duplicating requests
      if (this.getIsPhotoDetailsLoaded(photoId)) {
        debugger
        return
      }

      this.$store.dispatch('photos/fetchPhotoDetail', photoId)
        .then(() => {
        })
        .catch(() => {
          this.$toast.error('An error has occurred while fetching the photo detail')
        })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
