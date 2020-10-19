<template>
  <v-container>
    <!-- Coolbox photo library -->
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

    <div v-infinite-scroll="fetchThumnbnailImages" infinite-scroll-distance="10">
      <v-row>

        <v-col
          v-for="(photo, photoIndex) in getThumbnailPhotos"
          :key="photo.id"
          class="d-flex child-flex"
          xs="1"
          md="4"
          sm="1"
        >
          <!-- Thumbnail photos -->
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-img
                v-ripple
                :src="photo.src"
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
    </div>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import CoolLightBox from 'vue-cool-lightbox'
import 'vue-cool-lightbox/dist/vue-cool-lightbox.min.css'
import infiniteScroll from 'vue-infinite-scroll'

/** It renders a grid of clickable images, with the possibility to open them in full screen, for more details **/
export default {
  components: {
    CoolLightBox
  },
  directives: { infiniteScroll },
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
     * Fetches thumbnail images
     /**/
    fetchThumnbnailImages () {
      this.$store.commit('photos/SET_CURRENT_PAGE')
      this.$store.dispatch('photos/fetchPhotos')
    },
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
        // Open the modal and show the photo if it's currently closed
        if (!this.currentOpenedImageIndex) {
          this.currentOpenedImageIndex = photoIndex
        }
        return
      }

      this.$store.dispatch('photos/fetchPhotoDetail', photoId)
        .then(() => {
          setTimeout(() => {
            // Ugly workaround to make the library update the photo since it does not support it, neither V-viewer or the rest
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
