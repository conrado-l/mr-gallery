// Vue Test Utils
import { createLocalVue, mount } from '@vue/test-utils'

// Plugins
import Vuetify from 'vuetify'

// Components
import PhotosGrid from '@/components/PhotosGrid'

// Mocks
import photosMock from './mocks/photos'

describe('PhotosGrid.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  // Default props
  const defaultProps = {
    photos: [],
    fetchingPhotos: false,
    fetchingPhotoDetails: false
  }

  // Reusable factory mount
  const factoryMount = (props) => {
    return mount(PhotosGrid, {
      localVue,
      vuetify,
      propsData: {
        ...props
      }
    })
  }

  beforeEach(() => {
    vuetify = new Vuetify()
  })

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
    const thumbnailPhotoWrappers = wrapper.findAll('.v-image__image.v-image__image--cover')

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
    const thumbnailPhotoWrappers = wrapper.findAll('.v-image__image.v-image__image--cover')

    // Check if 10 thumbnail photos were rendered
    expect(thumbnailPhotoWrappers.length).toEqual(10)
  })

  // TODO: do (more) research on why "vue-infinite-scroll" is not triggering in tests. The component was tested isolated, as root
  //  component, and "onInfiniteScrollLoadMore" was executed properly in the browser.
  it.skip('should initially notify that the first photos should be loaded', done => {
    // Instantiate the component
    const wrapper = factoryMount({
      ...defaultProps
    })

    // Mock/stub method
    const mockOnInfiniteScrollLoadMore = jest.spyOn(wrapper.vm, 'onInfiniteScrollLoadMore')

    // Check that the function has been called
    expect(mockOnInfiniteScrollLoadMore).toHaveBeenCalled()
  })

  // TODO: do (more) research on why Vuetify's "VImg" component shows in the preload status in tests, even after using $nextTick,
  //  having the "src" unset, making the test fail.
  //  NOTE: The test runs properly when :lazy-src="photo.thumb" is set to the "v-img" component inside PhotosGrid.vue
  it('should render the thumbnail photos with the correct source URLs', async () => {
    // Instantiate the component
    const wrapper = factoryMount({
      ...defaultProps,
      photos: photosMock
    })

    // Wait for the next tick
    await wrapper.vm.$nextTick()

    // Find the thumbnail photos
    const thumbnailPhotoWrappers = wrapper.findAll('.v-image__image.v-image__image--cover')

    // Check if the thumbnail photos sources are correct (VImg uses the "background-image" CSS property)
    thumbnailPhotoWrappers.wrappers.forEach((thumbnailPhoto, index) => {
      expect(thumbnailPhoto.element.style.backgroundImage).toBe(`url(${photosMock[index].src})`)
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
    const thumbnailPhotoWrapper = wrapper.find('.v-image__image.v-image__image--cover')

    // Trigger a click over the photo
    await thumbnailPhotoWrapper.trigger('click')

    // Check if the modal is visible
    expect(wrapper.find('.cool-lightbox__slide.cool-lightbox__slide--current').exists()).toBe(true)
  })
})
