<template>
  <div>
    <!-- Coolbox photo library -->
    <CoolLightBox
      :items="fullSizePhotos"
      :index="currentOpenedImageIndex"
      :useZoomBar="true"
      :fullScreen="true"
      @close="currentOpenedImageIndex = null"
      @on-change="onPhotoDetailChange($event)"
    >
    </CoolLightBox>
    <!---->

    <!-- Infinity scroll -->
    <div v-infinite-scroll="onInfiniteScrollLoadMore"
         :infinite-scroll-distance="10">
      <v-row>
        <v-col
          v-for="(photo, photoIndex) in thumbnailPhotos"
          :key="photo.id"
          class="d-flex child-flex"
          xs="1"
          sm="1"
          md="4"
        >
          <!-- Thumbnail photos -->
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-img
                class="grey lighten-2 clickable"
                :src="photo.thumb"
                v-ripple
                v-bind="attrs"
                v-on="on"
                data-test="thumbnail-photo"
                @click="onPhotoClick(photoIndex, photo.id)"
              >
                <template v-slot:placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular
                      indeterminate
                      color="grey lighten-5"
                    ></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
            </template>
            <span>Click for more details</span>
          </v-tooltip>
          <!---->
        </v-col>
      </v-row>
    </div>
    <!----->
  </div>
</template>

<script>
// Plugins
import CoolLightBox from 'vue-cool-lightbox'
import 'vue-cool-lightbox/dist/vue-cool-lightbox.min.css'
import infiniteScroll from 'vue-infinite-scroll'

/**
 * It renders a grid of clickable images, using infinity scroll, with the ability to open them in full screen,
 * for more details
 **/
export default {

  name: 'PhotosGrid',
  props: {
    /** Array containing the full size photos **/
    fullSizePhotos: {
      type: Array,
      required: true
    },
    /** Array containing the thumbnail photos **/
    thumbnailPhotos: {
      type: Array,
      required: true
    },
    /** Fetching state **/
    isFetching: {
      type: Boolean,
      required: true
    }
  },
  data: function () {
    return {
      currentOpenedImageIndex: null
    }
  },
  components: {
    CoolLightBox
  },
  directives: { infiniteScroll },
  methods: {
    /**
     * Fetches the thumbnail images
     /**/
    onInfiniteScrollLoadMore () {
      if (this.isFetching) {
        return
      }

      this.$emit('load-more-photos')
    },
    /**
     * Fired when the photo is changed from the detail modal
     * @param {number} photoIndex
     **/
    onPhotoDetailChange (photoIndex) {
      const photoId = this.thumbnailPhotos[photoIndex].id

      this.onPhotoClick(photoIndex, photoId)
    },
    /**
     * Fetches the photo detail and opens the modal if its not open already *
     * @param {number} photoIndex
     * @param {string} photoId
     **/
    onPhotoClick (photoIndex, photoId) {
      // Avoid duplicating requests
      // if (this.isPhotoAlreadyLoaded(photoId)) {
      //   // Open the modal and show the photo if it's currently closed
      //   if (!this.currentOpenedImageIndex) {
      //     this.currentOpenedImageIndex = photoIndex
      //   }
      //   return
      // }

      this.$emit('photo-clicked', photoId)
      //
      // this.$store.dispatch('photos/fetchPhotoDetail', photoId)
      //   .then(() => {
      //     setTimeout(() => {
      //       // Ugly workaround to make the library update the photo since it does not support it, neither V-viewer or the rest
      //       // of the libraries that I tried, supporting zoom, panning and a modal
      //       document.querySelector('.cool-lightbox__slide.cool-lightbox__slide--current img').src = this.fullSizePhotos[photoIndex].src
      //     })
      this.currentOpenedImageIndex = photoIndex
      //   })
      //   .catch(() => {
      //     this.$toast.error('An error has occurred while fetching the photo detail')
      //   })
    },
    /**
     * Checks if the photo was already loaded for avoiding duplicating requests
     * @param {string} photoId
     **/
    isPhotoAlreadyLoaded (photoId) {
      return this.$store.getters['photos/getIsFullPhotoAlreadyLoaded'](photoId)
    }
  }
}
</script>

<style lang="scss" scoped>
.clickable {
  cursor: pointer;
}
</style>
