<template>
  <div class="spinner"><div></div><div></div><div></div><div></div></div></template>
<script>
export default {
  name: 'Spinner'
}
</script>

<style lang="scss" scoped>
@import "../assets/styles/variables";

.spinner {
  display: inline-block;
  position: relative;
  width: 32px;
  height: 32px;
}

.spinner div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 32px;
  height: 32px;
  border: 4px solid #7ca3dc;
  border-radius: 50%;
  animation: spinner 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: $secondary-color transparent transparent transparent;
}

.spinner div:nth-child(1) {
  animation-delay: -0.45s;
}

.spinner div:nth-child(2) {
  animation-delay: -0.3s;
}

.spinner div:nth-child(3) {
  animation-delay: -0.15s;
}

@keyframes spinner {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

</style>
