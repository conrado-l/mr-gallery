// Vue Test Utils
import { createLocalVue, mount } from '@vue/test-utils'

// Components
import PhotosGrid from '@/components/PhotosGrid'

// Mocks
import photosMock from './mocks/photos'

describe('PhotosGrid.vue', () => {
  const localVue = createLocalVue()

  // Default props
  const defaultProps = {
    photos: [],
    fetchingPhotos: false,
    fetchingPhotoDetails: false
  }

  // Used selectors
  const selectors = {
    thumbnailPhoto: '[data-test="thumbnail-photo"]',
    viewer: '[data-test="viewer-container"]'
  }

  // Reusable factory mount
  const factoryMount = (props) => {
    return mount(PhotosGrid, {
      localVue,
      propsData: {
        ...props
      }
    })
  }

  it('should render the component correctly', () => {
    const wrapper = factoryMount(defaultProps)

    expect(wrapper.element).toMatchSnapshot()
  })

  it('should render no thumbnail photos', async () => {
    // Instantiate the component
    const wrapper = factoryMount({
      ...defaultProps
    })

    // Wait for the next tick
    await wrapper.vm.$nextTick()

    // Find the thumbnail photos
    const thumbnailPhotoWrappers = wrapper.findAll(selectors.thumbnailPhoto)

    // Check if no thumbnail photos were rendered
    expect(thumbnailPhotoWrappers.length).toEqual(0)
  })

  it('should render 10 thumbnail photos', async () => {
    // Instantiate the component
    const wrapper = factoryMount({
      ...defaultProps,
      photos: photosMock
    })

    // Wait for the next tick
    await wrapper.vm.$nextTick()

    // Find the thumbnail photos
    const thumbnailPhotoWrappers = wrapper.findAll(selectors.thumbnailPhoto)

    // Check if 10 thumbnail photos were rendered
    expect(thumbnailPhotoWrappers.length).toEqual(10)
  })

  // TODO: do (more) research on why "vue-infinite-scroll" is not triggering in tests. The component was tested isolated, as root
  //  component, and "onInfiniteScrollLoadMore" was executed properly in the browser.
  it.skip('should initially notify that the first photos should be loaded', async () => {
    // Instantiate the component
    const wrapper = factoryMount({
      ...defaultProps
    })

    // Mock/stub method
    const mockOnInfiniteScrollLoadMore = jest.spyOn(wrapper.vm, 'onInfiniteScrollLoadMore')

    // Check that the function has been called
    expect(mockOnInfiniteScrollLoadMore).toHaveBeenCalled()

    // Wait until $emits have been handled
    await wrapper.vm.$nextTick()

    // Check that the event was emitted
    expect(wrapper.emitted('load-more-photos')).toBeTruthy()
  })

  it('should render the thumbnail photos with the correct source URLs', async () => {
    // Instantiate the component
    const wrapper = factoryMount({
      ...defaultProps,
      photos: photosMock
    })

    // Wait for the next tick
    await wrapper.vm.$nextTick()

    // Find the thumbnail photos
    const thumbnailPhotoWrappers = wrapper.findAll(selectors.thumbnailPhoto)

    // Wait for the next tick
    await wrapper.vm.$nextTick()

    // Check if the thumbnail photos sources are correct
    thumbnailPhotoWrappers.wrappers.forEach((thumbnailPhoto, index) => {
      expect(thumbnailPhoto.element.src).toBe(photosMock[index].thumbnailPhoto)
    })
  })

  it('should open the details modals when clicking on a photo', async () => {
    // Instantiate the component
    const wrapper = factoryMount({
      ...defaultProps,
      photos: photosMock
    })

    // Wait for the next tick
    await wrapper.vm.$nextTick()

    // Find the thumbnail photo
    const thumbnailPhotoWrapper = wrapper.find(selectors.thumbnailPhoto)

    // Click over the photo
    await thumbnailPhotoWrapper.trigger('click')

    // Check if the modal is visible
    expect(wrapper.find(selectors.viewer).exists()).toBe(true)
  })

  it('should notify to load the photo detail when clicking on a photo from the grid', async () => {
    // Instantiate the component
    const wrapper = factoryMount({
      ...defaultProps,
      photos: photosMock
    })

    // Find the thumbnail photo
    const thumbnailPhotoWrapper = wrapper.find(selectors.thumbnailPhoto)

    // Click over the photo
    await thumbnailPhotoWrapper.trigger('click')

    // Wait until $emits have been handled
    await wrapper.vm.$nextTick()

    // Check that the event was emitted
    expect(wrapper.emitted('load-photo-detail')).toBeTruthy()
  })
})
