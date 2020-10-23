// Vue Test Utils
import { createLocalVue, mount } from '@vue/test-utils'

// Plugins
import Vuetify from 'vuetify'

// Components
import PhotosGrid from '@/components/PhotosGrid'

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

  // TODO: find out why vm.$nextTick is not waiting for the VImg component to load the image, resulting in empty "src"
  // NOTE: the test runs properly when :lazy-src="photo.thumb" is set to the VImg component inside PhotosGrid.vue
  it('should render 10 thumbnail photos with the correct source URLs', async () => {
    // Photos mock array
    const photos = [{
      id: '1a5e86953ad5ac438130',
      thumb: 'http://interview.agileengine.com/pictures/cropped/0002.jpg',
      src: 'http://interview.agileengine.com/pictures/cropped/0002.jpg'
    }, {
      id: '49aa54843eaf3a0a49be',
      thumb: 'http://interview.agileengine.com/pictures/cropped/0015.jpg',
      src: 'http://interview.agileengine.com/pictures/cropped/0015.jpg'
    }, {
      id: 'd0d3fb4d11aaee9accce',
      thumb: 'http://interview.agileengine.com/pictures/cropped/0019.jpg',
      src: 'http://interview.agileengine.com/pictures/cropped/0019.jpg'
    }, {
      id: '5a83b798d52b0f673f66',
      thumb: 'http://interview.agileengine.com/pictures/cropped/0020.jpg',
      src: 'http://interview.agileengine.com/pictures/cropped/0020.jpg'
    }, {
      id: '305d191d6cb0c74159f3',
      thumb: 'http://interview.agileengine.com/pictures/cropped/005.jpg',
      src: 'http://interview.agileengine.com/pictures/cropped/005.jpg'
    }, {
      id: '155c9d2210b2bad61c1f',
      thumb: 'http://interview.agileengine.com/pictures/cropped/01.jpg',
      src: 'http://interview.agileengine.com/pictures/cropped/01.jpg'
    }, {
      id: 'cff3db4ea0c2809ed1e6',
      thumb: 'http://interview.agileengine.com/pictures/cropped/011129columbus1-01.jpg',
      src: 'http://interview.agileengine.com/pictures/cropped/011129columbus1-01.jpg'
    }, {
      id: '7319d1bd1e8c7614ac8f',
      thumb: 'http://interview.agileengine.com/pictures/cropped/018086b.jpg',
      src: 'http://interview.agileengine.com/pictures/cropped/018086b.jpg'
    }, {
      id: 'c0d2f9fe5f35132bd336',
      thumb: 'http://interview.agileengine.com/pictures/cropped/01sc087.jpg',
      src: 'http://interview.agileengine.com/pictures/cropped/01sc087.jpg'
    }, {
      id: 'e13a844e87c749edd2fc',
      thumb: 'http://interview.agileengine.com/pictures/cropped/02sc003.jpg',
      src: 'http://interview.agileengine.com/pictures/cropped/02sc003.jpg'
    }]

    // Instantiate the component
    const wrapper = factoryMount({
      ...defaultProps,
      photos
    })

    // Wait for the next tick
    await wrapper.vm.$nextTick()

    // Find the thumbnail photos
    const thumbnailPhotoWrappers = wrapper.findAll('.v-image__image.v-image__image--cover')

    // Check if 10 thumbnail photos were rendered
    expect(thumbnailPhotoWrappers.length).toEqual(10)

    // Check if the thumbnail photos sources are correct (VImg uses the "background-image" CSS property)
    thumbnailPhotoWrappers.wrappers.forEach((thumbnailPhoto, index) => {
      expect(thumbnailPhoto.element.style.backgroundImage).toBe(`url ("${photos[index].src}")`)
    })
  })
})
