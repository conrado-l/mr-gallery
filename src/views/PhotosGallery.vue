<template>
  <v-container>
    <PhotosGrid :photos="getPhotos"
                :fetching-photos="getIsFetchingPhotos"
                :fetching-photo-details="getIsFetchingPhotoDetails"
                @load-more-photos="fetchThumbnailPhotos()"
                @load-photo-detail="fetchPhotoDetail($event)">
    </PhotosGrid>
  </v-container>
</template>

<script>
// Vuex
import { mapGetters } from 'vuex'

// Components
import PhotosGrid from '@/components/PhotosGrid'

/**
 * A gallery of photos in a grid, fetched from the API
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
     * Fetches the photo detail
     * @param {string} photoId
     **/
    fetchPhotoDetail (photoId) {
      console.log('Photo ID', photoId)
      console.log('Is loaded', this.getIsPhotoDetailsLoaded(photoId))
      // Avoid duplicating requests
      if (this.getIsPhotoDetailsLoaded(photoId)) {
        debugger
        return
      }

      this.$store.dispatch('photos/fetchPhotoDetail', photoId)
        .catch(() => {
          this.$toast.error('An error has occurred while fetching the photo detail')
        })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
