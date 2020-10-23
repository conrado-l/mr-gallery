<template>
  <div>
    <!-- Coolbox photo library -->
    <CoolLightBox
      :items="photos"
      :index="currentOpenedPhotoIndex"
      :useZoomBar="true"
      :fullScreen="true"
      :loop="false"
      :gallery="false"
      effect="fade"
      @close="currentOpenedPhotoIndex = null"
      @on-change="onPhotoDetailChange($event)"
    >
    </CoolLightBox>
    <!---->

    <!-- Infinity scroll -->
    <div v-infinite-scroll="onInfiniteScrollLoadMore"
         :infinite-scroll-distance="10">
      <v-row>
        <v-col
          v-for="(photo, photoIndex) in photos"
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
    CoolLightBox
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
      if (this.fetchingPhotoDetails) {
        return
      }

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
    }
  }
}
</script>

<style lang="scss" scoped>
.clickable {
  cursor: pointer;
}
</style>
