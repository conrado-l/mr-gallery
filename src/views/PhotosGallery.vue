<template>
  <div class="photos-gallery-container">
    <PhotosGrid :photos="getPhotos"
                :fetching-photos="getIsFetchingPhotos"
                :fetching-photo-details="getIsFetchingPhotoDetails"
                @load-more-photos="fetchThumbnailPhotos()"
                @load-photo-detail="fetchPhotoDetail($event)">
    </PhotosGrid>
    </div>
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
      'getPhotosAmount',
      'getIsFetchingPhotos',
      'getIsFetchingPhotoDetails',
      'getIsPhotoDetailsLoaded'
    ])
  },
  methods: {
    /**
     * Fetches the thumbnail photos
     * @return {promise}
     /**/
    fetchThumbnailPhotos () {
      // Prevent multiple calls if there is a fetch in progress
      if (this.getIsFetchingPhotos) {
        return
      }

      return this.$store.dispatch('photos/fetchPhotos')
        .catch(() => {
          this.$toast.error('An error has occurred while fetching the photos')
        })
    },

    /**
     * Fetches the photo detail
     * @param {string} photoId
     **/
    fetchPhotoDetail (photoId) {
      // Avoid duplicating requests
      if (this.getIsPhotoDetailsLoaded(photoId)) {
        return
      }

      // Fetch a photo's details
      if (photoId) {
        this.$store.dispatch('photos/fetchPhotoDetail', photoId)
          .catch(() => {
            this.$toast.error('An error has occurred while fetching the photo detail')
          })
      } else {
        // No ID was provided, so a new/unknown photo is requested
        this.fetchMorePhotosWithDetail()
      }
    },
    /***
     * Fetches more photos and the details for the first new one
     */
    fetchMorePhotosWithDetail () {
      const currentPhotosAmount = this.getPhotosAmount

      this.fetchThumbnailPhotos()
        .then(() => {
          const newPhotosAmount = this.getPhotosAmount

          // If there are new photos, fetch the details from the first new one
          if (newPhotosAmount > currentPhotosAmount) {
            const photoId = this.getPhotos[currentPhotosAmount].id
            this.fetchPhotoDetail(photoId)
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.photos-gallery-container {
  margin-top: 40px;
}
</style>
