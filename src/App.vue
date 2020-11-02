<template>
  <div>
    <Navigation></Navigation>
        <router-view v-if="getIsUserAuthenticated"></router-view>
        <div v-else-if="!errorAuthenticating">
          <div class="d-flex-center">
              <Spinner></Spinner>
          </div>
        </div>
  </div>
</template>

<script>

// Vuex
import { mapGetters } from 'vuex'

// Components
import Navigation from '@/components/Navigation'
import Spinner from '@/components/Spinner'

/** The app's main component **/
export default {
  name: 'App',
  components: { Spinner, Navigation },
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
      .catch(() => {
        this.$toast.error('An error has occurred while trying to authenticate, please try again')
        this.errorAuthenticating = true
      })
  }
}
</script>

<style lang="scss" scoped>
@import "assets/styles/helpers";

.spinner-message-container {
  display: flex;
  justify-content: space-around;
  align-content: center;
}
</style>
