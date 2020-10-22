module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  transformIgnorePatterns: [
    'node_modules/(?!(vue-cool-lightbox)/)'
  ],
  setupFiles: ['./tests/unit/components/setup.js']
}
