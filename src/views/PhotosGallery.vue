<template>
  <v-container>
    <PhotosGrid :full-size-photos="getFullSizePhotos"
                :thumbnail-photos="getThumbnailPhotos"
                :is-fetching="getIsFetching"
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
      'getThumbnailPhotos',
      'getFullSizePhotos',
      'getIsFetching',
      'getIsFullPhotoAlreadyLoaded'
    ])
  },
  methods: {
    /**
     * Fetches the thumbnail photos
     /**/
    fetchThumbnailPhotos () {
      // Prevent multiple calls if there is a fetch in progress
      if (this.getIsFetching) {
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
      if (this.getIsFullPhotoAlreadyLoaded(photoId)) {
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
