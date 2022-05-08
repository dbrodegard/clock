<template>
  <v-snackbar
    app
    bottom
    centered
    :value="updateExists"
    :timeout="-1"
    color="grey darken-3"
    @click="refreshApp()"
  >
    <span class="font-weight-medium">There is a new version available.</span>
    <template v-slot:action="{ attrs }">
      <v-btn
        depressed
        small
        color="grey darken-3"
        v-bind="attrs"
        class="text-capitalize mr-2"
        @click="refreshApp()"
      >
        <span>Click To Refresh</span>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<style scoped>
.color {
  background: #565a81;
}
</style>

<script>
import { defineComponent, ref } from "@vue/composition-api";
import "@/registerServiceWorker";

export default defineComponent({
  setup() {
    const refreshing = ref(false);
    const registration = ref(null);
    const updateExists = ref(false);

    const updateAvailable = (evt) => {
      console.log("update available!!");
      registration.value = evt.detail;
      updateExists.value = true;
    };

    const refreshApp = () => {
      console.log("refreshing the app");
      closeRefresh();
      // Make sure we only send a 'skip waiting' message if the SW is waiting
      if (!registration.value || !registration.value.waiting) return;
      // send message to SW to skip the waiting and activate the new SW
      registration.value.waiting.postMessage("skipWaiting");
      // this.registration.waiting.postMessage({ type: 'SKIP_WAITING' })
    };

    const closeRefresh = () => {
      updateExists.value = false;
    };

    // Listen for our custom event from the SW registration
    // document.addEventListener('swUpdated', this.updateAvailable, { once: true })
    document.addEventListener("swUpdated", updateAvailable);

    if (navigator.serviceWorker) {
      // Prevent multiple refreshes
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        console.log("controller change");
        if (refreshing.value) return;
        refreshing.value = true;
        // Here the actual reload of the page occurs
        window.location.reload();
      });
    }

    return {
      refreshApp,
      refreshing,
      registration,
      updateExists,
    };
  },
});
</script>
