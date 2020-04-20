<template>
  <b-container id="app">
    <TheTitleBar :title="title"/>
    <router-view></router-view>
  </b-container>
</template>

<script>
import TheTitleBar from './components/TheTitleBar.vue'

export default {
  name: 'App',
  components: {
    TheTitleBar,
  },
  computed: {
    title() {
      return "Equipment Manager - " + this.env
    }
  },
  data: function () {
    return {
      version: process.env.VUE_APP_VERSION,
      env: process.env.NODE_ENV
    }
  }
}
</script>

<style lang="scss">
/* Import custom SASS variable overrides, or alternatively
 define your variable overrides here instead
 */
@import 'assets/custom-vars.scss';

/* Import Bootstrap and BootstrapVue source SCSS files
 */
@import '~bootstrap/scss/bootstrap.scss';
@import '~bootstrap-vue/src/index.scss';

/* General style overrides and custom classes
 */
body {
  margin: 0;
}

.my-widget {
  color: var(--danger);
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 30px;
}
</style>
