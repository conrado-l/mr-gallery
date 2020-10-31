<template>
  <div class="card-container">
    <img class="photo" :src="thumbnail"/>
  </div>
</template>

<script>
export default {
  name: 'CardPhoto',
  props: {
    /** Photo thumbnail URL **/
    thumbnail: {
      type: String
    }
  }
}
</script>

<style lang="scss" scoped>

.card-container {
  width: 240px;
  height: 240px;
  cursor: pointer;
}

.photo {
  width: 240px;
  height: 240px;
}

</style>
