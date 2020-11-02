<template>
  <div class="card-container"
       :title="hoverTitle">
        <transition-group name="fade">
          <!-- Thumbnail -->
          <img v-if="thumbnailSrc"
               class="photo"
               :key="thumbnailSrc"
               :src="thumbnailSrc"
               data-test="thumbnail-photo"/>

          <!-- Placeholder -->
          <div v-else
               :key="thumbnail"
               class="photo-placeholder"
               data-test="thumbnail-photo">
          </div>
        </transition-group>
  </div>
</template>

<script>
export default {
  name: 'CardPhoto',
  data: () => ({
    thumbnailSrc: null
  }),
  props: {
    /** Photo thumbnail URL **/
    thumbnail: {
      type: String,
      required: true
    },
    /** Hover title **/
    hoverTitle: {
      type: String,
      default: 'Click for more details'
    }
  },
  watch: {
    thumbnail: {
      immediate: true,
      /**
       * Watch for the thumbnail src for transitioning without flickering
       * @param newValue
       * @param oldValue
       */
      handler (newValue, oldValue) {
        if (newValue && newValue !== oldValue) {
          // Reset the real thumbnail src
          this.thumbnailSrc = null

          // Create an Image instance
          const image = new Image()

          // Wait for the image to load
          image.onload = () => {
            // Assign the URL to the real source
            this.thumbnailSrc = this.thumbnail
          }

          // Catch the error while fetching the image and set an error image
          image.onerror = () => {
            // Assign the error URL to the real source
            this.thumbnailSrc = this.thumbnail
          }

          // Assign the URL to be used and wait for it to load
          image.src = this.thumbnail
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.card-container {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.photo-placeholder {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #ded8d8;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

</style>
