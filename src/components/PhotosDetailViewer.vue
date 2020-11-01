<template>
  <transition name="fade">
    <!-- Overlay -->
    <div v-if="visible" class="overlay">
      <!-- Outer container -->
      <div class="outer-container">
        <!-- Viewer container -->
        <div class="viewer-container">
          <div class="d-flex justify-content-center align-items-center w-100 h-100">
            <!-- Photo container -->
            <div class="photo-container"
                 :class="{zoom: isZooming, loading: isPhotoLoading }"
                 ref="photoContainer">
              <!-- Photo -->
              <img class="photo"
                   :src="getImageURLSource"
                   :key="getPhotoID"
                   draggable="false"
                   @load="onPhotoLoad()"
                   @click="zoomPhoto()"
                   @mousemove="handleMouseMove($event)"
                   @mousedown="handleMouseDown($event)"
                   @mouseup="handleMouseUp($event)">
            </div>
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
        <!-- Close button -->
        <div class="close-button-container cursor-pointer"
             title="Close viewer"
             @click="closeViewer()">
          <img class="overlay-action-button"
               src="../assets/images/icons/close.svg"
               >
        </div>
        <!-- Share button -->
        <div v-show="!isPhotoLoading"
             class="share-button-container cursor-pointer"
             title="Share photo URL"
             @click="onPhotoURLShare()">
          <img class="overlay-action-button"
               src="../assets/images/icons/share.svg">
        </div>

        <!-- Navigation arrows -->
        <!-- Previous photo -->
        <div v-show="!isFirstPhoto"
            class="previous-button-container overlay-button-container navigation-button cursor-pointer "
            @click="previousPhoto()"
            title="Previous photo">
          <img src="../assets/images/icons/left-arrow.svg"
               class="overlay-action-button">
        </div>

        <!-- Next photo -->
        <div v-show="!isLastPhoto"
            class="next-button-container overlay-button-container navigation-button cursor-pointer"
            @click="nextPhoto()"
            title="Next photo">
          <img src="../assets/images/icons/right-arrow.svg"
               class="overlay-action-button">
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
// Utils
import { copyTextToClipboard } from '@/utils/utils'

export default {
  name: 'PhotosDetailViewer',
  data: () => ({
    visible: false,
    isPhotoLoading: true,
    isZooming: false,
    isDragging: false,
    isSwipping: false,
    isDraggingSwipe: false,
    swipeType: null,
    top: 0,
    left: 0,
    lastX: 0,
    lastY: 0,
    canZoom: true,
    initialMouseX: 0,
    initialMouseY: 0,
    endMouseX: 0,
    endMouseY: 0
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
    },
    /** Close the viewer if the backdrop is clicked **/
    backdropClose: {
      type: Boolean,
      required: false,
      default: true
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
    },
    /**
     * Gets the photo's id
     * @returns {string}
     */
    getPhotoID () {
      return this.getPhotoField('id') || ''
    },
    /**
     * Gets the photo's full size URL
     * @returns {string}
     */
    getPhotoFullSizeURL () {
      return this.getPhotoField(this.fullPhotoField) || ''
    },
    /**
     * Gets the photo's full size URL
     * @returns {string}
     */
    getPhotoThumbnailURL () {
      return this.getPhotoField(this.thumbnailField) || ''
    },
    /**
     * Checks if the first photo is being displayed
     */
    isFirstPhoto () {
      return this.currentPhotoIndex === 0
    },
    /**
     * Checks if the last photo is being displayed
     */
    isLastPhoto () {
      return this.currentPhotoIndex === this.photos.length - 1
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
      this.resetViewerSettings()
      this.$emit('close', this.currentPhotoIndex)
    },
    /**
     * Next photo
     */
    nextPhoto () {
      if (this.isLastPhoto) {
        return
      }

      // TODO: check if its already loaded, avoid share URL flickering and wait cursor
      this.isPhotoLoading = true
      this.resetZoom()
      this.$emit('photo-changed', this.currentPhotoIndex + 1)
    },
    /**
     * Previous photo
     */
    previousPhoto () {
      const newCurrentPhotoIndex = this.currentPhotoIndex - 1

      // Check if the new photo is valid
      if (newCurrentPhotoIndex >= 0) {
        this.isPhotoLoading = true
        this.resetZoom()
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
    },
    /**
     * Handles the mouse move event
     */
    handleMouseMove (e) {
      if (!this.checkMouseEventPropButton(e.button)) {
        return
      }

      if (this.isDraging) {
        this.top = this.top - this.lastY + e.clientY
        this.left = this.left - this.lastX + e.clientX
        this.lastX = e.clientX
        this.lastY = e.clientY
        this.canZoom = false

        const item = e.target.parentNode
        const newZoom = 1.8
        item.style.transform = 'translate3d(calc(-50% + ' + this.left + 'px), calc(-50% + ' + this.top + 'px), 0px) scale3d(' + newZoom + ', ' + newZoom + ', ' + newZoom + ')'
      }
      e.stopPropagation()
    },
    /**
     * Handles the mouse down event
     */
    handleMouseDown (e) {
      if (!this.checkMouseEventPropButton(e.button)) {
        return
      }

      this.lastX = e.clientX
      this.lastY = e.clientY
      this.isDraging = true
      e.stopPropagation()
    },
    /**
     * Handles the mouse up event
     */
    handleMouseUp (e) {
      if (!this.checkMouseEventPropButton(e.button)) {
        return
      }

      this.isDraging = false

      this.lastX = 0
      this.lastY = 0

      const thisContext = this
      setTimeout(function () {
        thisContext.canZoom = true
      }, 100)
    },
    /**
     * Checks if it's allowed to drag
     */
    checkMouseEventPropButton (button) {
      if (!this.isZooming) {
        return false
      }

      return button === 0
    },

    /**
     * Zooms on the photo
     */
    zoomPhoto () {
      if (!this.canZoom) {
        return false
      }

      if (this.isSwipping) {
        return false
      }

      const item = this.$refs.photoContainer

      const isZooming = this.isZooming
      const thisContext = this

      if (isZooming) {
        if (!this.isDraging) {
          this.isZooming = false
        }
      } else {
        this.isZooming = true
      }
      if (this.isZooming) {
        item.style.transform = 'translate3d(calc(-50%), calc(-50%), 0px) scale3d(1.8, 1.8, 1.8)'
        setTimeout(function () {
          thisContext.transition = 'all .0s ease'
        }, 100)
      } else {
        this.resetZoom()
      }
    },
    /**
     * Resets the zoom
     */
    resetZoom () {
      this.left = 0
      this.top = 0
      this.isZooming = false
      this.swipeType = null

      if (this.currentPhotoIndex != null) {
        const item = this.$refs.photoContainer

        item.style.transform = 'translate3d(calc(-50% + ' + this.left + 'px), calc(-50% + ' + this.top + 'px), 0px) scale3d(1, 1, 1)'
        this.initialMouseX = 0
      }
    },
    /**
     * Resets the viewer settings to default
     */
    resetViewerSettings () {
      this.visible = false
      this.resetZoom()
      this.isDragging = false
      this.isPhotoLoading = true
    },
    /**
     * Sets the loading indicator when the photo is loaded
     */
    onPhotoLoad () {
      if (this.isFullPhotoURLSet()) {
        this.isPhotoLoading = false
      }
    },
    /**
     * Checks if the full size photo is currently set as source
    */
    isFullPhotoURLSet () {
      return !!this.getPhotoFullSizeURL
    },
    /**
     * Closes the viewer when the backdrop is clicked
     */
    onBackdropClick () {
      if (this.backdropClose) {
        this.closeViewer()
      }
    },
    /** Shares the full photo URL
     * Closes the viewer when the backdrop is clicked
     */
    onPhotoURLShare () {
      if (!this.isPhotoLoading) {
        copyTextToClipboard(this.getImageURLSource)
      }
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
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate3d(calc(-50% + 0px), calc(-50% + 0px), 0px) scale3d(1, 1, 1);
  cursor: zoom-in;
  box-shadow: 0 0 1.5rem rgba(0, 0, 0, .45);
  z-index: 5;

  &.zoomed {
    cursor: zoom-out;
  }

  &.loading {
    cursor: wait;
  }
}

.photo {
  max-width: 100%;
  max-height: 100%;
  margin: auto;
}

.overlay-action-button {
  width: 25px;
  height: 25px;
}

.close-button-container {
  position: absolute;
  right: 15px;
  top: 15px;
  z-index: 4;
}

.share-button-container {
  position: absolute;
  right: 65px;
  top: 15px;
  z-index: 4;
}

.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 20px;
}

.title-container {
  bottom: 5vh;
}

.description-container {
  bottom: 3vh;
}

.overlay-button-container {
  z-index: 4;
}

.navigation-button {
  position: absolute;
  top: 50%;
}

.previous-button-container {
  left: 30px;
}

.next-button-container {
  right: 30px;
}

// Animations
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

</style>
