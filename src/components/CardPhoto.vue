<template>
  <div class="card-container" :title="hoverTitle">
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
    },
    /** Hover title **/
    hoverTitle: {
      type: String,
      default: 'Click for more details'
    }
  }
}
</script>

<style lang="scss" scoped>

.card-container {
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.photo {
  //width: 240px;
  //height: 240px;
}

</style>
