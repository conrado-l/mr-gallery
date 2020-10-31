<template>
  <div>
    <Navigation></Navigation>

    <router-view v-if="getIsUserAuthenticated"></router-view>
    <div v-else-if="!errorAuthenticating" class="mt-5">
      <div class="d-flex justify-center align-center">
        <span class="ml-3"> we're getting ready for you! please wait </span>
      </div>
    </div>
  </div>
</template>

<script>

// Vuex
import { mapGetters } from 'vuex'

// Components
import Navigation from '@/components/Navigation'

/** The app's main component **/
export default {
  name: 'App',
  components: { Navigation },
  data: () => ({
    errorAuthenticating: false
  }),
  computed: {
    ...mapGetters('auth', [
      'getIsUserAuthenticated'
    ])
  },
  /** Created life-cycle hook */
  created () {
    this.$store.dispatch('auth/fetchToken')
      .then(() => {
        // this.$toast('Welcome back!', { color: 'primary' })
      })
      .catch(() => {
        // this.$toast.error('An error has occurred while trying to authenticate')
        this.errorAuthenticating = true
      })
  }
}
</script>
