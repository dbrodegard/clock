<template>
  <v-container class="pa-0" fluid>
    <v-card class="pa-4 flex" rounded="xl" color="#D71B20" dark>
      <div class="home">
        <v-select v-model="selectedPerson" :items="jobState.people">
          <template v-slot:selection>
            <span
              >{{ selectedPerson.firstName }}
              {{ selectedPerson.lastName }}</span
            >
          </template>
        </v-select>
        <v-select v-model="selectedProject" :items="jobState.projects">
          <template v-slot:selection>
            <span>{{ selectedProject.name }}</span>
          </template>
        </v-select>
        <v-footer height="100" class="py-4" fixed>
          <v-btn rounded depressed dark block x-large color="green"
            >Start</v-btn
          >
        </v-footer>
      </div>
    </v-card>
  </v-container>
</template>

<script>
// @ is an alias to /src
import { state as jobState } from "@/store.js";
import { defineComponent, onMounted, ref } from "@vue/composition-api";

export default defineComponent({
  setup() {
    const selectedPerson = ref(null);
    const selectedProject = ref(null);

    onMounted(() => {});
    return { jobState, selectedPerson, selectedProject };
  },
});
</script>
