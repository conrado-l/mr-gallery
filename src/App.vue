<template>
  <v-app>
    <Navigation></Navigation>

    <v-main>
      <router-view v-if="getIsUserAuthenticated"></router-view>
      <div v-else-if="!errorAuthenticating" class="mt-5">
        <div class="d-flex justify-center align-center">
          <v-progress-circular
            :size="50"
            color="secondary"
            indeterminate
          ></v-progress-circular>
          <span class="ml-3"> we're getting ready for you! please wait </span>
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<script>

import { mapGetters } from 'vuex'
import Navigation from '@/components/Navigation'

/** The app's main component **/
export default {
  name: 'App',
  components: { Navigation },
  data: () => ({
    errorAuthenticating: false,
    showSnackbar: false
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
        this.$toast('Welcome back!', { x: 'center', color: 'secondary' })
      })
      .catch(() => {
        this.$toast.error('An error has occurred while trying to authenticate')
        this.errorAuthenticating = true
      })
  }
}
</script>
