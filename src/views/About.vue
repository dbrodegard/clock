<template>
  <v-container fluid class="pt-4">
    <v-app-bar rounded="lg" color="blue-grey lighten-5" dense flat>
      <v-app-bar-title>Project Tracking </v-app-bar-title>
    </v-app-bar>
    <v-navigation-drawer color="blue-grey lighten-1" permanent app>
      <v-row class="py-3 px-4" no-gutters justify="center">
        <v-card
          flat
          class="flex"
          height="200"
          rounded="lg"
          color="blue-grey lighten-2"
        >
        </v-card>
      </v-row>
    </v-navigation-drawer>

    <v-card flat outlined class="mt-4 mb-4" rounded="lg">
      <v-card-title
        ><v-icon class="mr-2">mdi-account-hard-hat</v-icon> People
      </v-card-title>
      <v-data-table :headers="peopleHeaders" :items="jobState.people">
        <template v-slot:item.lastName="{ item }">
          {{ item.firstName }} {{ item.lastName }}
        </template>
      </v-data-table>
    </v-card>
    <v-card flat outlined class="mb-4" rounded="lg">
      <v-card-title
        ><v-icon class="mr-2">mdi-office-building</v-icon> Projects
      </v-card-title>
      <v-data-table :headers="projectHeaders" :items="jobState.projects">
        <template v-slot:item.lastName="{ item }">
          {{ item.firstName }} {{ item.lastName }}
        </template>
      </v-data-table>
    </v-card>
    <v-card flat outlined class="mb-4" rounded="lg">
      <v-card-title
        ><v-icon class="mr-2">mdi-clock</v-icon> Shifts
      </v-card-title>
      <v-data-table :headers="shiftHeaders" :items="jobState.shifts">
        <template v-slot:item.person="{ item }">
          {{ jobState.personDict[item.person].firstName }}
          {{ jobState.personDict[item.person].lastName }}
        </template>
        <template v-slot:item.project="{ item }">
          {{ jobState.projectDict[item.project].name }}
        </template>
        <template v-slot:item.start="{ item }">
          {{ new Date(item.start).toISOString() }}
        </template>
        <template v-slot:item.end="{ item }">
          {{ new Date(item.end).toISOString() }}
        </template>
        <template v-slot:item.duration="{ item }">
          {{ new Date(item.end).toISOString() }}
        </template>
      </v-data-table>
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
    const peopleHeaders = [
      {
        text: "ID",
        align: "start",
        sortable: true,
        value: "pid",
        width: 120,
      },
      {
        text: "Name",
        align: "start",
        sortable: true,
        value: "lastName",
      },
      {
        text: "Active",
        align: "start",
        sortable: true,
        value: "active",
        width: 120,
      },
    ];

    const projectHeaders = [
      {
        text: "ID",
        align: "start",
        sortable: true,
        value: "id",
        width: 120,
      },
      {
        text: "Name",
        align: "start",
        sortable: true,
        value: "name",
      },
      {
        text: "Street",
        align: "start",
        sortable: true,
        value: "addressLine1",
      },
      {
        text: "City",
        align: "start",
        sortable: true,
        value: "city",
      },
      {
        text: "State",
        align: "start",
        sortable: true,
        value: "state",
      },
      {
        text: "Zip",
        align: "start",
        sortable: true,
        value: "zip",
      },
    ];
    const shiftHeaders = [
      {
        text: "Person",
        align: "start",
        sortable: true,
        value: "person",
      },
      {
        text: "Project",
        align: "start",
        sortable: true,
        value: "project",
      },
      {
        text: "Start",
        align: "start",
        sortable: true,
        value: "start",
      },
      {
        text: "End",
        align: "start",
        sortable: true,
        value: "end",
      },
      {
        text: "Duration",
        align: "start",
        sortable: true,
        value: "duration",
      },
    ];

    onMounted(() => {});
    return {
      jobState,
      selectedPerson,
      selectedProject,
      peopleHeaders,
      projectHeaders,
      shiftHeaders,
    };
  },
});
</script>
