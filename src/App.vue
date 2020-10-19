<template>
  <v-app>
    <Navigation></Navigation>
    <v-snackbar v-model="getIsUserAuthenticated">
      Welcome back!
    </v-snackbar>

    <v-snackbar v-model="errorAuthenticating">
      An error has occurred while trying to authenticate
    </v-snackbar>

    <v-main>
      <router-view v-if="getIsUserAuthenticated"></router-view>
      <div v-else>
        <div class="d-flex justify-center align-center">
          <v-progress-circular
            :size="50"
            color="primary"
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
  /** Mounted life-cycle hook */
  created () {
    this.$store.dispatch('auth/fetchToken')
      .then(() => {
        this.showSnackbar = true
      })
      .catch(() => {
        this.errorAuthenticating = true
      })
  }
}
</script>
