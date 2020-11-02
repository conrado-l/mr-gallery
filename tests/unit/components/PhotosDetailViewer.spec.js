// Vue Test Utils
import { createLocalVue, mount } from '@vue/test-utils'

// Components
import PhotosDetailViewer from '@/components/PhotosDetailViewer'

// Mocks
import photosMock from './mocks/photos'

describe('PhotosDetailViewer.vue', () => {
  const localVue = createLocalVue()

  // Default props
  const defaultProps = {
    photos: [],
    fetchingPhotos: false,
    fetchingPhotoDetails: false
  }

  // Used selectors
  const selectors = {
    viewer: '[data-test="viewer-container"]',
    mainPhoto: '[data-test="main-photo"]',
    nextPhotoButton: '[data-test="next-photo-button"]',
    previousPhotoButton: '[data-test="previous-photo-button"]',
    sharePhotoButton: '[data-test="share-url-button"]'
  }

  // Reusable factory mount
  const factoryMount = (props, attachToDocument = false) => {
    return mount(PhotosDetailViewer, {
      localVue,
      propsData: {
        ...props
      },
      attachToDocument
    })
  }

  it('should render the component correctly', () => {
    const wrapper = factoryMount(defaultProps)

    expect(wrapper.element).toMatchSnapshot()
  })

  it('should render the thumbnail photo since there is no full size one', async () => {
    const photos = [
      {
        id: 'd0d3fb4d11aaee9accce',
        thumbnailPhoto: 'http://interview.agileengine.com/pictures/cropped/0019.jpg'
      }
    ]
    // Instantiate the component
    const wrapper = factoryMount({
      ...defaultProps,
      photos,
      currentPhotoIndex: 0
    })

    // Wait for the next tick
    await wrapper.vm.$nextTick()

    // Find the main photo
    const mainPhotoWrapper = wrapper.find(selectors.mainPhoto)

    // Check if the thumbnail photo was rendered
    expect(mainPhotoWrapper.element.src).toBe(photos[0].thumbnailPhoto)
  })

  it('should render the full size photo', async () => {
    const photos = [
      {
        id: 'd0d3fb4d11aaee9accce',
        thumbnailPhoto: 'http://interview.agileengine.com/pictures/cropped/0019.jpg',
        fullPhoto: 'http://interview.agileengine.com/pictures/full_size/00219.jpg'
      }
    ]
    // Instantiate the component
    const wrapper = factoryMount({
      ...defaultProps,
      photos,
      currentPhotoIndex: 0
    })

    // Wait for the next tick
    await wrapper.vm.$nextTick()

    // Find the main photo
    const mainPhotoWrapper = wrapper.find(selectors.mainPhoto)

    // Check if the full size photo was rendered
    expect(mainPhotoWrapper.element.src).toBe(photos[0].fullPhoto)
  })

  // TODO: research why "return require('@/assets/images/image-not-found.webp')" is breaking the test
  it.skip('should render the fallback/placeholder error photo', async () => {
    const photos = [
      {
        id: 'd0d3fb4d11aaee9accce'
      }
    ]
    // Instantiate the component
    const wrapper = factoryMount({
      ...defaultProps,
      photos,
      currentPhotoIndex: 0
    })

    // Wait for the next tick
    await wrapper.vm.$nextTick()

    // Find the main photo
    const mainPhotoWrapper = wrapper.find(selectors.mainPhoto)

    // Check if the fallback error photo was rendered
    expect(mainPhotoWrapper.element.src).toBe(require('../../../src/assets/images/image-not-found.webp'))
  })

  it('should render the next photo after clicking the right navigation arrow', async () => {
    // Instantiate the component
    const wrapper = factoryMount({
      ...defaultProps,
      photos: photosMock,
      currentPhotoIndex: 0
    })

    // Wait for the next tick
    await wrapper.vm.$nextTick()

    // Find the next photo button
    const nextPhotoButtonWrapper = wrapper.find(selectors.nextPhotoButton)

    // Click on the button
    await nextPhotoButtonWrapper.trigger('click')

    // Check that the event was emitted for the new photo index, being 1
    expect(wrapper.emitted('photo-changed')[0]).toEqual([1])

    // Set the new index photo
    wrapper.setProps({
      currentPhotoIndex: 1
    })

    // Wait for the next tick
    await wrapper.vm.$nextTick()

    // Find the main photo
    const mainPhotoWrapper = wrapper.find(selectors.mainPhoto)

    // Check if the full size photo was rendered
    expect(mainPhotoWrapper.element.src).toBe(photosMock[1].fullPhoto)
  })

  it('should render the next photo after pressing the right arrow key', async () => {
    // Instantiate the component
    const wrapper = factoryMount({
      ...defaultProps,
      photos: photosMock,
      currentPhotoIndex: 0
    }, true)

    // Wait for the next tick
    await wrapper.vm.$nextTick()

    // Press the right arrow key
    await wrapper.trigger('keydown.right')

    // Wait for the next tick
    await wrapper.vm.$nextTick()

    // Check that the event was emitted for the new photo index, being 1
    expect(wrapper.emitted('photo-changed')[0]).toEqual([1])

    // Set the new index photo
    wrapper.setProps({
      currentPhotoIndex: 1
    })

    // Wait for the next tick
    await wrapper.vm.$nextTick()

    // Find the main photo
    const mainPhotoWrapper = wrapper.find(selectors.mainPhoto)

    // Check if the full size photo was rendered
    expect(mainPhotoWrapper.element.src).toBe(photosMock[1].fullPhoto)

    // Destroy the wrapper since we called attachToDocument
    wrapper.destroy()
  })

  it('should render the previous photo after clicking the left navigation arrow', async () => {
    // Instantiate the component
    const wrapper = factoryMount({
      ...defaultProps,
      photos: photosMock,
      currentPhotoIndex: 1
    })

    // Wait for the next tick
    await wrapper.vm.$nextTick()

    // Find the previous photo button
    const previousPhotoButtonWrapper = wrapper.find(selectors.previousPhotoButton)

    // Click on the button
    await previousPhotoButtonWrapper.trigger('click')

    // Check that the event was emitted for the new photo index, being 0
    expect(wrapper.emitted('photo-changed')[0]).toEqual([0])

    // Set the new index photo
    wrapper.setProps({
      currentPhotoIndex: 0
    })

    // Wait for the next tick
    await wrapper.vm.$nextTick()

    // Find the main photo
    const mainPhotoWrapper = wrapper.find(selectors.mainPhoto)

    // Check if the full size photo was rendered
    expect(mainPhotoWrapper.element.src).toBe(photosMock[0].fullPhoto)
  })

  it('should render the next photo after pressing the left arrow key', async () => {
    // Instantiate the component
    const wrapper = factoryMount({
      ...defaultProps,
      photos: photosMock,
      currentPhotoIndex: 1
    }, true)

    // Wait for the next tick
    await wrapper.vm.$nextTick()

    // Press the right arrow key
    await wrapper.trigger('keydown.left')

    // Wait for the next tick
    await wrapper.vm.$nextTick()

    // Check that the event was emitted for the new photo index, being 1
    expect(wrapper.emitted('photo-changed')[0]).toEqual([0])

    // Set the new index photo
    wrapper.setProps({
      currentPhotoIndex: 0
    })

    // Wait for the next tick
    await wrapper.vm.$nextTick()

    // Find the main photo
    const mainPhotoWrapper = wrapper.find(selectors.mainPhoto)

    // Check if the full size photo was rendered
    expect(mainPhotoWrapper.element.src).toBe(photosMock[0].fullPhoto)

    // Destroy the wrapper since we called attachToDocument
    wrapper.destroy()
  })

  it('should show a toast notification after clicking the share button', async () => {
    // Instantiate the component
    const wrapper = factoryMount({
      ...defaultProps,
      photos: photosMock,
      currentPhotoIndex: 0
    })

    wrapper.vm.copyTextToClipboard = jest.fn()

    // Set the loading state to false
    wrapper.setData({ isPhotoLoading: false })

    // Wait for the next tick
    await wrapper.vm.$nextTick()

    // Find the share photo button
    const sharePhotoButtonWrapper = wrapper.find(selectors.sharePhotoButton)

    // Click on the button
    await sharePhotoButtonWrapper.trigger('click')

    // Find the toast notification
    const toastNotificationWrapper = wrapper.find('.v-toast-text')

    // Check if the toast was shown with the correct message
    expect(toastNotificationWrapper.text()).toBe('The photo URL was copied to the clipboard')
  })
})
