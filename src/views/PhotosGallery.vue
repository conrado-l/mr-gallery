<template>
  <v-container>
    <!-- Coolbox image library -->
    <CoolLightBox
      :items="getFullSizePhotos"
      :index="currentOpenedImageIndex"
      :useZoomBar="true"
      :fullScreen="true"
      @close="currentOpenedImageIndex = null"
      @on-change="onPhotoDetailChange($event)"
    >
    </CoolLightBox>
    <!---->

    <v-row>
      <v-col
        v-for="(photo, photoIndex) in getThumbnailPhotos"
        :key="photo.id"
        class="d-flex child-flex"
        xs="1"
        md="4"
      >
        <!-- Thumbnail images -->
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-img
              v-ripple
              :src="photo.src"
              aspect-ratio="1"
              v-bind="attrs"
              v-on="on"
              class="grey lighten-2 clickable"
              @click="fetchPhotoDetail(photoIndex, photo.id)"
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
  </v-container>
</template>

<script>
import CoolLightBox from 'vue-cool-lightbox'
import { mapGetters } from 'vuex'
import 'vue-cool-lightbox/dist/vue-cool-lightbox.min.css'

/** It renders a grid of clickable photos, with the possibility to open them in full screen **/
export default {
  components: {
    CoolLightBox
  },
  data: function () {
    return {
      currentOpenedImageIndex: null
    }
  },
  computed: {
    ...mapGetters('photos', [
      'getThumbnailPhotos',
      'getFullSizePhotos'
    ])
  },
  methods: {
    /**
     * Fired when the photo is changed from the detail modal
     * @param {number} photoIndex
     **/
    onPhotoDetailChange (photoIndex) {
      const photoId = this.getThumbnailPhotos[photoIndex].id

      this.fetchPhotoDetail(photoIndex, photoId)
    },
    /**
     * Fetches the photo detail and opens the modal if its not open already *
     * @param {number} photoIndex
     * @param {string} photoId
     **/
    fetchPhotoDetail (photoIndex, photoId) {
      // Avoid duplicating requests
      if (this.isPhotoAlreadyLoaded(photoId)) {
        // Open the modal and show the picture if it's currently closed
        if (!this.currentOpenedImageIndex) {
          this.currentOpenedImageIndex = photoIndex
        }
        return
      }

      this.$store.dispatch('photos/fetchPhotoDetail', photoId)
        .then(() => {
          setTimeout(() => {
            // Ugly workaround to make the library update the image since it does not support it, neither V-viewer or the rest
            // of the libraries that I tried, supporting zoom, panning and a modal
            document.querySelector('.cool-lightbox__slide.cool-lightbox__slide--current img').src = this.getFullSizePhotos[photoIndex].src
          })
          this.currentOpenedImageIndex = photoIndex
        })
    },
    /**
     * Checks if the photo was already loaded for avoiding duplicating requests
     * @param {string} photoId
     **/
    isPhotoAlreadyLoaded (photoId) {
      return this.$store.getters['photos/getIsFullPhotoAlreadyLoaded'](photoId)
    }
  },
  /** Mounted life-cycle hook **/
  mounted () {
    this.$store.dispatch('photos/fetchPhotos')
  }
}
</script>

<style lang="scss" scoped>
.clickable {
  cursor: pointer;
}
</style>
