<template>
  <div class="d-flex justify-content-center align-items-center">
    <PhotosDetailViewer
      :photos="photos"
      :current-photo-index="currentOpenedPhotoIndex"
      thumbnailField="thumbnailPhoto"
      fullPhotoField="fullPhoto"
      @close="onViewerClose()"
      @photo-changed="onPhotoDetailChange($event)">
    </PhotosDetailViewer>
    <!-- Infinity scroll -->
    <div v-infinite-scroll="onInfiniteScrollLoadMore">
      <!-- Thumbnail photos -->
      <div class="grid-container">
        <CardPhoto
          v-for="(photo, photoIndex) in photos"
          :key="photo.id"
          :thumbnail="photo.thumbnailPhoto"
          data-test="thumbnail-photo"
          @click.native="onPhotoClick(photoIndex, photo.id)">
        </CardPhoto>
        <!---->
      </div>
    </div>
  </div>
</template>

<script>
// Components
import CardPhoto from '@/components/CardPhoto'
import PhotosDetailViewer from '@/components/PhotosDetailViewer'

// Plugins
import infiniteScroll from 'vue-infinite-scroll'

/**
 * A grid of clickable photos, using infinity scroll, with the ability to open them in full screen, for more details
 **/
export default {

  name: 'PhotosGrid',
  props: {
    /** Contains the photos to be displayed **/
    photos: {
      type: Array,
      required: true
    },
    /** Checks if the photos are being fetched **/
    fetchingPhotos: {
      type: Boolean,
      required: true
    },
    /** Checks if the photo's details are being fetched **/
    fetchingPhotoDetails: {
      type: Boolean,
      required: true
    }
  },
  data: function () {
    return {
      currentOpenedPhotoIndex: null
    }
  },
  components: {
    PhotosDetailViewer,
    CardPhoto
  },
  directives: { infiniteScroll },
  methods: {
    /**
     * Notifies that the user scrolled down for loading more images
     /**/
    onInfiniteScrollLoadMore () {
      if (this.fetchingPhotos) {
        return
      }

      this.$emit('load-more-photos')
    },
    /**
     * Notifies that the user changed the photo from the detail modal
     * @param {number} photoIndex
     **/
    onPhotoDetailChange (photoIndex) {
      this.currentOpenedPhotoIndex = photoIndex

      this.notifyPhotoDetail(this.photos[photoIndex].id)
    },
    /**
     * Notifies that a photo was clicked, it also opens the detail modal for showing the photo in full size
     * @param {number} photoIndex
     * @param {string} photoId
     **/
    onPhotoClick (photoIndex, photoId) {
      this.notifyPhotoDetail(photoId)
      this.currentOpenedPhotoIndex = photoIndex
    },
    /**
     * Notifies that we need the details for a particular photo
     * @param {string} photoId
     */
    notifyPhotoDetail (photoId) {
      this.$emit('load-photo-detail', photoId)
    },
    /**
     * Fired when the viewer is closed
     */
    onViewerClose () {
      this.currentOpenedPhotoIndex = null
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/styles/helpers";
@import "../assets/styles/breakpoints";

.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 15px;
}

@media only screen and (max-width: $md) {
  .grid-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media only screen and (max-width: $sm) {
  .grid-container {
    grid-template-columns: 1fr;
  }
}

</style>
