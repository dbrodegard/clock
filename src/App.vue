<template>
  <v-app id="app">
    <v-main v-if="jobState.fullPeopleDict && jobState.openShiftsByPerson">
      <router-view />
    </v-main>
    <snackbar-refresh />
  </v-app>
</template>

<script>
import { initialize, state as jobState } from "@/store.js";
import { defineComponent, onMounted, ref } from "@vue/composition-api";
import SnackbarRefresh from "./components/SnackbarRefresh.vue";

export default defineComponent({
  components: { SnackbarRefresh },
  setup() {
    const isReady = ref(false);
    onMounted(async () => {
      isReady.value = await initialize();
    });
    return { jobState, isReady };
  },
});
</script>

<style></style>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
