// Vue Test Utils
import Vue from 'vue'
import { mount } from '@vue/test-utils'

// Plugins
import { Store } from 'vuex-mock-store'

// Components
import PhotosGallery from '@/views/PhotosGallery'

describe('PhotosGallery.vue', () => {

  const store = new Store({
    state: {
      photos: { // Required for vuex-mock-store
        photos: [],
        currentPage: 1,
        fetching: false
      }
    },
    getters: {
      'photos/getPhotos': [],
      'photos/getThumbnailPhotos': [],
      'photos/getFullSizePhotos': [],
      'photos/getIsFetching': false
    }
  })

  const factoryMount = () => {
    return mount(PhotosGallery, {
      mocks: {
        $store: store
      }
    })
  }

  beforeEach(() => {
    store.dispatch = jest.fn().mockResolvedValue('data') // dispatch has to return a promise
  })

  afterEach(() => {
    store.reset()
  })

  it('should render the component correctly', () => {
    const wrapper = factoryMount()

    expect(wrapper.element).toMatchSnapshot()
  })

  it('should call the action for fetching the initial thumbnail photos', async () => {
    const wrapper = factoryMount()

    await Vue.nextTick()

    console.debug(wrapper)

    expect(store.dispatch).toHaveBeenNthCalledWith(1, 'photos/fetchPhotos')
  })
})
