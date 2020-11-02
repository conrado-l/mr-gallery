// Vue Test Utils
import { createLocalVue, mount } from '@vue/test-utils'

// Vuex
import { Store } from 'vuex-mock-store'

// Components
import App from '@/App'

describe('App.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  let store

  // Reusable factory mount
  const factoryMount = () => {
    return mount(App, {
      localVue,
      stubs: ['router-view'],
      mocks: {
        $store: store,
        $toast: {
          error: jest.fn()
        }
      }
    })
  }

  beforeEach(() => {

    store = new Store({
      state: {
        auth: {
          token: null,
          authenticated: false,
          fetching: false
        }
      },
      getters: {
        'auth/getToken': null,
        'auth/getIsUserAuthenticated': false,
        'auth/getFetchingState': false
      }
    })

    store.dispatch = jest.fn().mockResolvedValue('data') // dispatch has to return a promise
  })

  afterEach(() => {
    store.reset()
  })

  it('should render the component correctly', () => {
    // Instantiate the component
    const wrapper = factoryMount()

    expect(wrapper.element).toMatchSnapshot()
  })

  it('should initially call the fetch token action', () => {
    // Instantiate the component
    factoryMount()

    // Check if the action was dispatched
    expect(store.dispatch).toHaveBeenCalledWith('auth/fetchToken')
  })
})
