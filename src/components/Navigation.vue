<template>
  <div class="navigation-bar d-flex-center">
    <div class="text-align-center font-color-white font-weight-600">Madison Reed | Gallery</div>
  </div>
</template>

<script>
export default {
  name: 'Navigation'
}
</script>

<style lang="scss" scoped>
@import '../assets/styles/variables';
@import '../assets/styles/helpers';

.navigation-bar {
  height: 50px;
  width: 100%;
  background-color: $primary-color;
}

</style>
