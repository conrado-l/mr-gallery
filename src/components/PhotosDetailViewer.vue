<template>
  <transition name="fade">
    <!-- Overlay -->
    <div v-if="visible" class="overlay">
      <!-- Outer container -->
      <div class="outer-container">
        <!-- Viewer container -->
        <div class="viewer-container">
          <div class="d-flex justify-content-center align-items-center w-100 h-100"
               @click.self="onBackdropClick"
               @touchstart="handleTouchStart"
               @touchend="handleTouchEnd">
            <!-- Photo container -->
            <div class="photo-container"
                 :class="{zoom: isZooming, loading: isPhotoLoading }"
                 ref="photoContainer">
              <!-- Photo -->
              <img class="photo"
                   :src="getImageURLSource"
                   :key="getPhotoID"
                   draggable="false"
                   :title="getPhotoHoverTooltip"
                   @load="onPhotoLoad()"
                   @click="zoomPhoto()"
                   @mousemove="handleMouseMove"
                   @mousedown="handleMouseDown"
                   @mouseup="handleMouseUp">
            </div>
          </div>
          <!-- Footer -->
          <div class="footer">
            <!-- Title -->
            <transition name="fade">
              <div v-show="getPhotoTitle" class="title-container text-align-center">
                <span class="font-weight-600 font-color-white">{{getPhotoTitle}}</span>
              </div>
            </transition>

            <!-- Description -->
            <transition name="fade">
              <div v-show="getPhotoDescription" class="description-container text-align-center">
                <span class=font-color-white>{{getPhotoDescription}}</span>
              </div>
            </transition>
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
        <transition name="fade">
          <div v-show="!isPhotoLoading && !isZooming"
               class="share-button-container cursor-pointer"
               title="Share photo URL"
               @click="onPhotoURLShare()">
            <img class="overlay-action-button"
                 src="../assets/images/icons/share.svg">
          </div>
        </transition>

        <!-- Navigation arrows -->
        <!-- Previous photo -->
        <transition name="fade">
          <div v-show="!isFirstPhoto && !isZooming"
              class="previous-button-container overlay-button navigation-button cursor-pointer"
              @click="previousPhoto()"
              title="Previous photo">
            <img src="../assets/images/icons/left-arrow.svg"
                 class="overlay-action-button">
          </div>
        </transition>

        <!-- Next photo -->
        <transition name="fade">
          <div v-show="!isLastPhoto && !isZooming"
              class="next-button-container overlay-button navigation-button cursor-pointer"
              @click="nextPhoto()"
              title="Next photo">
            <img src="../assets/images/icons/right-arrow.svg"
                 class="overlay-action-button">
          </div>
        </transition>
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
    // Visibility
    visible: false,
    // Status
    isPhotoLoading: true,
    isZooming: false,
    isDragging: false,
    isSwipping: false,
    // Mouse zoom and panning
    canZoom: true,
    top: 0,
    left: 0,
    lastX: 0,
    lastY: 0,
    initialMouseX: 0,
    initialMouseY: 0,
    endMouseX: 0,
    endMouseY: 0,
    // Touch navigation
    startSwipeX: 0,
    startSwipeY: 0
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
    },
    /**
     * Gets the photo hover title depending on the zoom status
     */
    getPhotoHoverTooltip () {
      return `Click to zoom ${this.isZooming ? 'out' : 'in'}`
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
        const newZoom = 2
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
     * Handles the swiping start event for navigation
     */
    handleTouchStart (e) {
      this.startSwipeX = e.changedTouches[0].screenX
      this.startSwipeY = e.changedTouches[0].screenY
    },
    /**
     * Handles the swiping end event for navigation
     */
    handleTouchEnd (e) {
      const diffX = e.changedTouches[0].screenX - this.startSwipeX
      const diffY = e.changedTouches[0].screenY - this.startSwipeY
      const ratioX = Math.abs(diffX / diffY)
      const ratioY = Math.abs(diffY / diffX)
      const absDiff = Math.abs(ratioX > ratioY ? diffX : diffY)

      // Ignore small movements
      if (absDiff < 30) {
        return
      }

      // Right / left swipes
      if (ratioX > ratioY) {
        if (diffX >= 0) {
          // Right swipe
          this.nextPhoto()
        } else {
          // Left swipe
          this.previousPhoto()
        }
      }
    },
    /**
     * Zooms on the photo
     */
    zoomPhoto () {
      if (!this.canZoom) {
        return false
      }

      const item = this.$refs.photoContainer

      const isZooming = this.isZooming

      if (isZooming) {
        if (!this.isDraging) {
          this.isZooming = false
        }
      } else {
        this.isZooming = true
      }

      if (this.isZooming) {
        item.style.transform = 'translate3d(calc(-50%), calc(-50%), 0px) scale3d(2, 2, 2)'
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
    /**
     * Shares the full photo URL
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
@import "../assets/styles/breakpoints";

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
  max-width: 100%;
  transform: translate3d(calc(-50% + 0px), calc(-50% + 0px), 0px) scale3d(1, 1, 1);
  cursor: pointer;
  box-shadow: 0 0 1.5rem rgba(0, 0, 0, .45);
  z-index: 5;

  &.zoom {
    cursor: move;
  }

  &.loading {
    cursor: wait;
  }
}

.photo {
  max-width: 100%;
  max-height: 100%;
  will-change: transform;
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

.overlay-button {
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

// Responsive queries
@media only screen and (max-width: $sm) {
  .navigation-button {
    display: none;
  }

  .photo {
    max-width: 100vw;
  }
}

</style>
