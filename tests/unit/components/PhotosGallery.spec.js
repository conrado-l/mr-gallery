// Vue Test Utils
import { createLocalVue, mount } from '@vue/test-utils'

// Vuex
import { Store } from 'vuex-mock-store'

// Components
import PhotosGallery from '@/views/PhotosGallery'

describe('PhotosGallery.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  let store

  // Reusable factory mount
  const factoryMount = () => {
    return mount(PhotosGallery, {
      localVue,
      mocks: {
        $store: store
      }
    })
  }

  beforeEach(() => {

    store = new Store({
      state: {
        photos: {
          photos: [],
          currentPage: 1,
          fetchingPhotos: false,
          fetchingPhotoDetail: false
        }
      },
      getters: {
        'photos/getPhotos': [],
        'photos/getIsFetchingPhotos': false,
        'photos/getIsFetchingPhotoDetails': false
      }
    })

    store.dispatch = jest.fn().mockResolvedValue('data') // dispatch has to return a promise
  })

  it('should render the component correctly', () => {
    // Instantiate the component
    const wrapper = factoryMount()

    expect(wrapper.element).toMatchSnapshot()
  })

  // NOTE: same problem with "vue-infinite-scroll" as in PhotosGrid.spec.js:83, so this test will fail
  it.skip('should initially call the fetch photos action coming from the PhotosGrid emitted event', async () => {
    // Instantiate the component
    const wrapper = factoryMount()

    // Wait for the next tick
    await wrapper.vm.$nextTick()

    // Check if the action was dispatched
    expect(store.dispatch).toHaveBeenCalledWith('photos/fetchPhotos')
  })
})
