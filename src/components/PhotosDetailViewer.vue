<template>
  <transition name="fade">
    <!-- Overlay -->
    <div v-if="visible" class="overlay">
      <!-- Outer container -->
      <div class="outer-container">
        <!-- Viewer container -->
        <div class="viewer-container"
             data-test="viewer-container">
          <div class="d-flex-center w-100 h-100"
               data-test="overlay-backdrop"
               @click.self="onBackdropClick"
               @touchstart="startSwipe"
               @touchmove="continueSwipe"
               @touchend="endSwipe">
            <!-- Photo container -->
            <div class="photo-container"
                 :class="{zooming: isZooming, loading: isPhotoLoading }"
                 data-test="photo-container"
                 ref="photoContainer">
              <!-- Photo -->
              <transition name="slow-fade">
                <img v-show="getShowPhoto"
                     class="photo"
                     draggable="false"
                     data-test="main-photo"
                     :src="getImageURLSource"
                     :key="getPhotoID"
                     :title="getPhotoHoverTooltip"
                     @load="onPhotoLoad()"
                     @click="zoomPhoto()"
                     @touchstart="handleMouseDown"
                     @touchmove="handleMouseMove"
                     @touchend="handleMouseUp"
                     @mousemove="handleMouseMove"
                     @mousedown="handleMouseDown"
                     @mouseup="handleMouseUp">
              </transition>
              <transition name="fade">
                <Spinner v-show="isPhotoLoading"
                         class="photo-spinner"></Spinner>
              </transition>
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
             data-test="close-viewer-button"
             @click="closeViewer()">
          <img class="overlay-action-button"
               src="@/assets/images/icons/close.svg"
               >
        </div>
        <!-- Share button -->
        <transition name="fade">
          <div class="share-button-container cursor-pointer"
               title="Share photo URL"
               data-test="share-url-button"
               @click="onPhotoURLShare()">
            <img class="overlay-action-button"
                 src="@/assets/images/icons/share.svg">
          </div>
        </transition>

        <!-- Navigation arrows -->
        <!-- Previous photo -->
        <transition name="fade">
          <div v-show="!isFirstPhoto && !isZooming"
              class="previous-button-container overlay-button navigation-button cursor-pointer"
              @click="previousPhoto()"
              title="Previous photo"
              data-test="previous-photo-button">
          <img src="@/assets/images/icons/left-arrow.svg"
                 class="overlay-action-button">
          </div>
        </transition>

        <!-- Next photo -->
        <transition name="fade">
          <div v-show="!isZooming"
              class="next-button-container overlay-button navigation-button cursor-pointer"
              @click="nextPhoto()"
              title="Next photo"
              data-test="next-photo-button"
          >
            <img src="@/assets/images/icons/right-arrow.svg"
                 class="overlay-action-button">
          </div>
        </transition>
      </div>
    </div>
  </transition>
</template>

<script>

// Components
import Spinner from '@/components/Spinner'

// Utils
import { copyTextToClipboard } from '@/utils/utils'

export default {
  name: 'PhotosDetailViewer',
  components: { Spinner },
  data: () => ({
    // Visibility
    visible: false,
    // Status
    isPhotoLoading: true,
    isZooming: false,
    isDragging: false,
    isSwipping: false,
    isDraggingSwipe: false,
    swipeType: null,
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
    /** Zoom magnification level **/
    zoomLevel: {
      type: Number,
      required: false,
      default: 2
    },
    /** Close the viewer if the backdrop is clicked **/
    backdropClose: {
      type: Boolean,
      required: false,
      default: true
    },
    /** Indicates if the photos are being fetched **/
    fetchingPhotos: {
      type: Boolean,
      required: false
    },
    /** Use thumbnail photo as placeholder **/
    useThumbnail: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    /**
     * Gets the thumbnail or full size image URL for the current open photo
     * @returns {string}
     */
    getImageURLSource () {
      const fullPhotoSrc = this.getPhotoFullSizeURL

      // Full photo is available
      if (fullPhotoSrc) {
        return fullPhotoSrc
      } else {
        if (!this.useThumbnail) {
          return ''
        }

        const thumbnailSrc = this.getPhotoThumbnailURL

        // Thumbnail fallback, shown when the full size one could not be fetched
        if (thumbnailSrc) {
          return thumbnailSrc
        } else {
          // Placeholder fallback, shown when the next new/unknown photo could not be fetched (API/connectivity error)
          return require('@/assets/images/image-not-found.webp')
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
     * Checks if the photo should be shown
     * @returns {boolean}
     */
    getShowPhoto () {
      return ((this.useThumbnail && this.getPhotoThumbnailURL) ||
        (!this.useThumbnail && this.getPhotoFullSizeURL && !this.isPhotoLoading))
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
     * Notifies when the viewer is closed and resets the settings
     */
    closeViewer () {
      this.resetViewerSettings()
      this.$emit('close', this.currentPhotoIndex)
    },
    /**
     * Navigates to the next photo
     */
    nextPhoto () {
      if (this.fetchingPhotos) {
        return
      }

      const newCurrentPhotoIndex = this.currentPhotoIndex + 1

      // Avoid showing the spinner when the next photo is already loaded
      if (!this.isPhotoAlreadyLoaded(newCurrentPhotoIndex)) {
        this.isPhotoLoading = true
      }

      this.resetZoom()
      this.$emit('photo-changed', newCurrentPhotoIndex)
    },
    /**
     * Navigates to the previous photo
     */
    previousPhoto () {
      const newCurrentPhotoIndex = this.currentPhotoIndex - 1

      // Check if the new photo is valid
      if (newCurrentPhotoIndex >= 0) {
        // Avoid showing the spinner when the previous photo is already loaded
        if (!this.isPhotoAlreadyLoaded(newCurrentPhotoIndex)) {
          this.isPhotoLoading = true
        }

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
     * Disables scrolling, necessary for navigating with the arrow keys
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
        // X-Y diffs
        this.top = this.top - this.lastY + e.clientY
        this.left = this.left - this.lastX + e.clientX
        this.lastX = e.clientX
        this.lastY = e.clientY

        // Disable zooming for avoiding bugs
        this.canZoom = false

        const item = e.target.parentNode

        // Panning with the current zoom level
        item.style.transform = 'translate3d(calc(-50% + ' + this.left + 'px), calc(-50% + ' + this.top + 'px), 0px) scale3d(' + this.zoomLevel + ', ' + this.zoomLevel + ', ' + this.zoomLevel + ')'
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

      setTimeout(() => {
        this.canZoom = true
      }, 100)
    },
    /**
     * Checks if it's allowed to drag
     * @return {boolean}
     */
    checkMouseEventPropButton (button) {
      if (!this.isZooming) {
        return false
      }

      return button === 0
    },
    /**
     * Handles the start swiping event for navigation
     */
    startSwipe (e) {
      if (this.isZooming) {
        return false
      }

      // Starts swiping
      this.isDraggingSwipe = true
      this.initialMouseX = this.getMouseXPosFromEvent(e)
      this.initialMouseY = this.getMouseYPosFromEvent(e)
    },
    /**
     * Handles the "continue" swiping event for navigation
     */
    continueSwipe (e) {
      if (this.isDraggingSwipe) {
        this.isSwipping = true
        const currentPosX = this.getMouseXPosFromEvent(e)
        const currentPosY = this.getMouseYPosFromEvent(e)

        // X-Y diffs
        const diffX = Math.abs(currentPosX - this.initialMouseX)
        const diffY = Math.abs(currentPosY - this.initialMouseY)

        // Swipe orientation
        if (this.swipeType == null) {
          if (diffY > 5 || diffX > 5) {
            if (diffY > diffX) {
              this.swipeType = 'v'
            } else {
              this.swipeType = 'h'
            }
          }
        }

        // Mobile case
        if (e.type === 'touchmove') {
          this.endMouseX = this.getMouseXPosFromEvent(e)
          this.endMouseY = this.getMouseYPosFromEvent(e)
        }
      }
    },
    /**
     * Handles the end swiping event for navigation
     */
    endSwipe (e) {
      const swipeType = this.swipeType
      this.isDraggingSwipe = false

      // Horizontal swipe type
      if (this.initialMouseX === 0 && swipeType === 'h') {
        return false
      }

      // Touch end fixes
      if (e.type !== 'touchend') {
        this.endMouseX = this.getMouseXPosFromEvent(e)
        this.endMouseY = this.getMouseYPosFromEvent(e)
      } else {
        if (this.endMouseX === 0) {
          return
        }
      }

      // Check if is dragged
      if (
        ((this.endMouseX - this.initialMouseX === 0) && swipeType === 'h') ||
        this.isZooming ||
        ((this.endMouseY - this.initialMouseY === 0) && swipeType === 'v')
      ) {
        return
      }

      // Reset swipe
      setTimeout(() => {
        this.isSwipping = false
        this.initialMouseX = 0
        this.endMouseX = 0
      }, 10)

      // Swipe orientation
      if (this.swipeType === 'h') {
        // Right swipe
        if ((this.endMouseX - this.initialMouseX) < -40) {
          return this.nextPhoto()
        }
        // Left swipe
        if ((this.endMouseX - this.initialMouseX) > 40) {
          return this.previousPhoto()
        }
      }

      this.swipeType = null
    },
    /**
     * Gets the X position from the event (mouse/touch)
     */
    getMouseXPosFromEvent (event) {
      if (event.type.indexOf('mouse') !== -1) {
        return event.clientX
      }
      return event.touches[0].clientX
    },

    /**
     * Gets the Y position from the event (mouse/touch)
     */
    getMouseYPosFromEvent (event) {
      if (event.type.indexOf('mouse') !== -1) {
        return event.clientY
      }
      return event.touches[0].clientY
    },
    /**
     * Zooms on the photo
     */
    zoomPhoto () {
      if (!this.canZoom) {
        return false
      }

      // Disable for mobile, since it already supports it natively (pinch)
      if (window.innerWidth <= 576) {
        return
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
        item.style.transform = `translate3d(calc(-50%), calc(-50%), 0px) scale3d(${this.zoomLevel}, ${this.zoomLevel}, ${this.zoomLevel})`
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
      this.swipeType = null
      this.isDraggingSwipe = false
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
     * @return {boolean}
     */
    isFullPhotoURLSet () {
      return !!this.getPhotoFullSizeURL
    },
    /**
     * Checks if a photo was already laoded
     * @param {number} photoIndex
     * @return {boolean}
     */
    isPhotoAlreadyLoaded (photoIndex) {
      if (photoIndex > this.photos.length - 1) {
        return false
      }

      return this.photos[photoIndex].detailLoaded
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
        this.$toast.default('The photo\'s URL was copied to the clipboard')
      }
    }
  },
  watch: {
    /**
     * Checks if the viewer needs to be opened, closed or change the photo
     * @param {number} newValue
     * @param {number} oldValue
     */
    currentPhotoIndex: {
      immediate: true,
      handler (newValue, oldValue) {
        if (newValue === oldValue) {
          return
        }

        // Show/hide the viewer
        this.visible = newValue != null

        // Enable/disable scrolling
        this.setScrolling()
      }
    }
  },
  /** Mounted life-cycle hook **/
  mounted () {
    // Register the keydown event listener for key shortcuts
    window.addEventListener('keydown', this.shortcutEventListener)
  },
  /** Before destroy life-cycle hook **/
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
  z-index: 5;

  &.zooming {
    cursor: move;
  }

  &.loading {
    cursor: wait;
  }
}

.photo {
  max-width: 100%;
  max-height: 100%;
  box-shadow: 0 0 1.5rem rgba(0, 0, 0, 0.45);
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
  padding-bottom: 3vh;
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

.photo-spinner {
  position: absolute;
  top: calc(50% - 16px); // Subtracting the spinner size / 2
  left: calc(50% - 16px);// Subtracting the spinner size / 2
}

// Transitions
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.slow-fade-enter-active, .slow-fade-leave-active {
  transition: opacity .6s;
}

.slow-fade-enter, .slow-fade-leave-to {
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

  .footer {
    padding-bottom: 10vh;
  }
}

</style>
