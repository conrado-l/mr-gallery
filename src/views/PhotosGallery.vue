<template>
  <v-container>
    <v-row>
      <v-col
        v-for="photo in getPhotos"
        :key="photo.id"
        class="d-flex child-flex"
        cols="4"
      >
        <v-img
          :lazy-src="photo.cropped_picture"
          :src="photo.cropped_picture"
          aspect-ratio="1"
          class="grey lighten-2"
        >
          <template v-slot:placeholder>
            <v-row
              class="fill-height ma-0"
              align="center"
              justify="center"
            >
              <v-progress-circular
                indeterminate
                color="grey lighten-5"
              ></v-progress-circular>
            </v-row>
          </template>
        </v-img>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

/** Shows the photos organized in a grid **/
export default {
  name: 'PhotosGallery',
  data: () => ({}),
  computed: {
    ...mapGetters('photos', [
      'getPhotos',
      'getIsFetching'
    ])
  },
  /** Mounted life-cycle hook **/
  mounted () {
    this.$store.dispatch('photos/fetchPhotos')
  }
}
</script>
