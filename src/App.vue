<template>
  <b-container id="app" fluid="xl">
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
  margin: 10px;
}

.my-widget {
  color: var(--danger);
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
//  text-align: center;
  color: #2c495f;
  margin-outside: 30px;
}
.error-row {
  background: var(--danger);
}
</style>
