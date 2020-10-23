// Vue Test Utils
import Vue from 'vue'
import { createLocalVue, mount } from '@vue/test-utils'

// Plugins
import { Store } from 'vuex-mock-store'
import Vuetify from 'vuetify'

// Components
import PhotosGallery from '@/views/PhotosGallery'

describe('PhotosGallery.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  const store = new Store({
    state: {
      photos: { // Required for vuex-mock-store
        photos: [],
        currentPage: 1,
        fetching: false
      },
      auth: {
        token: null,
        authenticated: false,
        fetching: false
      }
    },
    getters: {
      'photos/getPhotos': [],
      'photos/getThumbnailPhotos': [],
      'photos/getFullSizePhotos': [],
      'photos/getIsFetching': false,
      'photos/getIsFullPhotoAlreadyLoaded': false
    }
  })

  const factoryMount = () => {
    return mount(PhotosGallery, {
      localVue,
      vuetify,
      mocks: {
        $store: store
      },
      stubs: { transition: false }
    })
  }

  beforeEach(() => {
    vuetify = new Vuetify()
    store.dispatch = jest.fn().mockResolvedValue('data') // dispatch has to return a promise
  })

  afterEach(() => {
    store.reset()
  })

  it('should render the component correctly', () => {
    const wrapper = factoryMount()

    expect(wrapper.element).toMatchSnapshot()
  })

  // TODO: find out why infinite-scroll is not being rendered and triggered correctly
  it('should call the action for fetching the initial thumbnail photos on the initial load', async () => {
    factoryMount()

    await Vue.nextTick()

    expect(store.dispatch).toHaveBeenNthCalledWith(1, 'photos/fetchPhotos')
  })

  // TODO: find out on why vm.$nextTick is not waiting for the VImg component to load the image, resulting in empty "src"
  // NOTE: the test runs properly when :lazy-src="photo.src" is set to the VImg component inside PhotosGallery.vue
  it('should render 10 thumbnail photos with the correct source URLs from the store', async () => {
    const wrapper = factoryMount()

    // Set the thumbnail photos mock array
    store.getters['photos/getThumbnailPhotos'] = [{
      id: '1a5e86953ad5ac438130',
      cropped_picture: 'http://interview.agileengine.com/pictures/cropped/0002.jpg',
      src: 'http://interview.agileengine.com/pictures/cropped/0002.jpg'
    }, {
      id: '49aa54843eaf3a0a49be',
      cropped_picture: 'http://interview.agileengine.com/pictures/cropped/0015.jpg',
      src: 'http://interview.agileengine.com/pictures/cropped/0015.jpg'
    }, {
      id: 'd0d3fb4d11aaee9accce',
      cropped_picture: 'http://interview.agileengine.com/pictures/cropped/0019.jpg',
      src: 'http://interview.agileengine.com/pictures/cropped/0019.jpg'
    }, {
      id: '5a83b798d52b0f673f66',
      cropped_picture: 'http://interview.agileengine.com/pictures/cropped/0020.jpg',
      src: 'http://interview.agileengine.com/pictures/cropped/0020.jpg'
    }, {
      id: '305d191d6cb0c74159f3',
      cropped_picture: 'http://interview.agileengine.com/pictures/cropped/005.jpg',
      src: 'http://interview.agileengine.com/pictures/cropped/005.jpg'
    }, {
      id: '155c9d2210b2bad61c1f',
      cropped_picture: 'http://interview.agileengine.com/pictures/cropped/01.jpg',
      src: 'http://interview.agileengine.com/pictures/cropped/01.jpg'
    }, {
      id: 'cff3db4ea0c2809ed1e6',
      cropped_picture: 'http://interview.agileengine.com/pictures/cropped/011129columbus1-01.jpg',
      src: 'http://interview.agileengine.com/pictures/cropped/011129columbus1-01.jpg'
    }, {
      id: '7319d1bd1e8c7614ac8f',
      cropped_picture: 'http://interview.agileengine.com/pictures/cropped/018086b.jpg',
      src: 'http://interview.agileengine.com/pictures/cropped/018086b.jpg'
    }, {
      id: 'c0d2f9fe5f35132bd336',
      cropped_picture: 'http://interview.agileengine.com/pictures/cropped/01sc087.jpg',
      src: 'http://interview.agileengine.com/pictures/cropped/01sc087.jpg'
    }, {
      id: 'e13a844e87c749edd2fc',
      cropped_picture: 'http://interview.agileengine.com/pictures/cropped/02sc003.jpg',
      src: 'http://interview.agileengine.com/pictures/cropped/02sc003.jpg'
    }]

    await wrapper.vm.$nextTick()

    // Find the thumbnail photos
    const thumbnailPhotoWrappers = wrapper.findAll('.v-image__image.v-image__image--cover')

    // Check if 10 thumbnail photos were rendered
    expect(thumbnailPhotoWrappers.length).toEqual(10)

    // Check if the thumbnail photos sources are correct (VImg uses the "background-image" CSS property)
    thumbnailPhotoWrappers.wrappers.forEach((thumbnailPhoto, index) => {
      expect(thumbnailPhoto.element.style.backgroundImage).toBe(`url ("${store.getters['photos/getThumbnailPhotos'][index].src}")`)
    })
  })
})
