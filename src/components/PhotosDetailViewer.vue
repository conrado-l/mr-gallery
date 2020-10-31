<template>
  <transition name="fade">
    <!-- Overlay -->
    <div v-if="visible" class="overlay">
      <!-- Outer container -->
      <div class="outer-container">
        <!-- Viewer container -->
        <div class="viewer-container">
          <!-- Photo container -->
          <div class="photo-container">
            <!-- Photo -->
            <img class="photo" :src="getImageURLSource"/>
          </div>
          <!-- Footer -->
          <div class="footer">
            <!-- Title container -->
            <div class="title-container text-align-center">
              <span class="font-weight-600 font-color-white">{{getPhotoTitle}}</span>
            </div>

            <!-- Description container -->
            <div class="description-container text-align-center">
              <span class=font-color-white>{{getPhotoDescription}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'PhotosDetailViewer',
  data: () => ({
    visible: false
  }),
  props: {
    /** Contains the photos to be displayed **/
    photos: {
      type: Array,
      required: true
    },
    /** Photo's index for the current open photo **/
    currentPhotoIndex: {
      type: Number
    },
    /** Thumbnail object field name **/
    thumbnailField: {
      type: String,
      required: false,
      default: 'thumbnailPhoto'
    },
    /** Full photo object field name **/
    fullPhotoField: {
      type: String,
      required: false,
      default: 'fullPhoto'
    },
    /** Title photo object field name **/
    titleField: {
      type: String,
      required: false,
      default: 'title'
    },
    /** Description photo object field name **/
    descriptionField: {
      type: String,
      required: false,
      default: 'description'
    }
  },
  computed: {
    /**
     * Gets the thumbnail or full size image URL for the current open photo
     * @returns {string}
     */
    getImageURLSource () {
      const fullPhotoSrc = this.getPhotoField(this.fullPhotoField)

      // Full photo is available
      if (fullPhotoSrc) {
        return fullPhotoSrc
      } else {
        const thumbnailSrc = this.getPhotoField(this.thumbnailField)

        // Thumbnail fallback
        if (thumbnailSrc) {
          return thumbnailSrc
        } else {
          // Placeholder fallback if the full photo and thumbnail failed
          return 'https://demofree.sirv.com/nope-not-here.jpg'
        }
      }
    },
    /**
     * Gets the photo's title
     * @returns {string}
     */
    getPhotoTitle () {
      return this.getPhotoField(this.titleField) || ''
    },
    /**
     * Gets the photo's description
     * @returns {string}
     */
    getPhotoDescription () {
      return this.getPhotoField(this.descriptionField) || ''
    }
  },
  methods: {
    /**
     * Checks if there are photos available to visible
     * @returns {boolean}
     */
    arePhotosAvailable () {
      return (!!(this.photos && Array.isArray(this.photos) && this.photos.length))
    },
    /**
     * Notifies when the viewer is closed
     */
    closeViewer () {
      this.visible = false
      this.$emit('close', this.currentPhotoIndex)
    },
    /**
     * Next photo
     */
    nextPhoto () {
      this.$emit('photo-changed', this.currentPhotoIndex + 1)
    },
    /**
     * Previous photo
     */
    previousPhoto () {
      const newCurrentPhotoIndex = this.currentPhotoIndex - 1

      // Check if the new photo is valid
      if (newCurrentPhotoIndex >= 0) {
        this.$emit('photo-changed', newCurrentPhotoIndex)
      }
    },
    /**
     * Enables/disables scrolling based on the viewer status (open/closed)
     */
    setScrolling () {
      if (this.visible) {
        this.disableScrolling()
      } else {
        this.enableScrolling()
      }
    },
    /**
     * Disables scrolling
     */
    disableScrolling () {
      document.body.setAttribute('style', 'overflow:hidden;')
    },
    /**
     * Enables scrolling
     */
    enableScrolling () {
      document.body.setAttribute('style', 'overflow:visible;')
    },
    /**
     * Register the key shortcuts
     */
    shortcutEventListener (event) {
      switch (event.keyCode) {
        // Right arrow
        case 39:
          return this.nextPhoto()
        // Left arrow
        case 37:
          return this.previousPhoto()
        // Prevent default down/up arrows
        case 38:
        case 40:
        case ' ':
          return event.preventDefault()
        // Escape key
        case 27:
          return this.closeViewer()
      }
    },
    /**
     * Gets a field from the current photo being displayed
     * @param {string} field
     * @return {string|number}
     */
    getPhotoField (field) {
      let photoField

      if (this.arePhotosAvailable()) {
        // Get the current open photo
        const currentOpenPhoto = this.photos[this.currentPhotoIndex]

        // Check if the current photo is valid
        if (currentOpenPhoto) {
          photoField = currentOpenPhoto[field]
        }
      }

      return photoField
    }
  },
  watch: {
    /**
     * Checks if the viewer needs to be opened, closed or change the photo
     * @param {number} newValue
     * @param {number} oldValue
     */
    currentPhotoIndex (newValue, oldValue) {
      // TODO: find way to avoid retriggering in a loop
      if (newValue === oldValue) {
        return
      }

      // Show/hide the viewer
      this.visible = newValue != null

      // Enable/disable scrolling
      this.setScrolling()
    }
  },
  mounted () {
    // Register the keydown event listener for key shortcuts
    window.addEventListener('keydown', this.shortcutEventListener)
  },
  beforeDestroy () {
    // Remove the keydown event listener for key shortcuts
    window.removeEventListener('keydown', this.shortcutEventListener)

    // Enable scrolling
    this.enableScrolling()
  }
}
</script>

<style lang="scss" scoped>

@import "../assets/styles/helpers";

.overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2;
}

.outer-container {
  position: relative;
}

.viewer-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  z-index: 3;
}

.photo-container {
  //box-shadow: 0 0 1.5rem rgba(0, 0, 0, .45)
}

.photo {
  max-width: 100%;
  max-height: 100%;
}

.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 50px;
}

.title-container {
  bottom: 40px;
}

.description-container {
  bottom: 20px;
}

// Animations
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

</style>
