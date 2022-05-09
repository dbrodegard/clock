<template>
  <v-container fluid class="pa-0">
    <v-navigation-drawer dark width="300" color="#222222" permanent app>
      <v-app-bar fixed flat height="64">
        <h1 style="font-size: 22px; font-weight: 900; opacity: 0.5">Filters</h1>
      </v-app-bar>
      <v-row
        style="postion: relative; margin-top: 80px"
        class="px-4"
        no-gutters
      >
        <v-card>
          <v-fab-transition>
            <v-btn
              v-show="dateRange.length > 0"
              color="red"
              fab
              dark
              small
              absolute
              top
              right
              @click="dateRange = []"
              style="margin-right: -27px"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-fab-transition>

          <v-date-picker
            dark
            full-width
            v-model="dateRange"
            range
            no-title
            flat
            color="green darken-1"
          ></v-date-picker>
        </v-card>
      </v-row>
      <!-- 
      <v-subheader>Projects</v-subheader>
      <div class="px-4">
        <v-chip-group
          v-model="selectedProjects"
          multiple
          active-class="green"
          column
        >
          <v-chip
            label
            v-for="project in jobState.projects"
            :key="project.reference"
            dark
            class="white--text"
          >
            {{ project.name }}
          </v-chip>
        </v-chip-group>
      </div>

      <v-subheader>Team Members</v-subheader>
      <div class="px-4">
        <v-chip-group multiple active-class="green darken-1" column>
          <v-chip
            label
            v-for="person in jobState.people"
            :key="person.reference"
            filter
          >
            {{ person.firstName }} {{ person.lastName }}
          </v-chip>
        </v-chip-group>
      </div>

      <v-subheader>Tasks</v-subheader>
      <div class="px-4">
        <v-chip-group multiple active-class="green darken-1" column>
          <v-chip label v-for="task in jobState.tasks" :key="task.reference">
            {{ task.name }}
          </v-chip>
        </v-chip-group>
      </div> -->

      <v-row class="px-4 pt-4" no-gutters>
        <v-select
          clearable
          :items="jobState.projects"
          dark
          label="Project"
          outlined
          dense
          return-object
        >
          <template v-slot:item="{ item }">
            {{ item.name }}
          </template>
          <template v-slot:selection="{ item }">
            <span class="text-truncate" style="width: 160px">{{
              item.name
            }}</span>
          </template>
        </v-select>
      </v-row>
      <v-row class="px-4" no-gutters>
        <v-select
          return-object
          clearable
          :items="jobState.people"
          dark
          label="Team Member"
          outlined
          dense
        >
          <template v-slot:item="{ item }">
            {{ item.firstName }} {{ item.lastName }}
          </template>
          <template v-slot:selection="{ item }">
            <span class="text-truncate" style="width: 160px"
              >{{ item.firstName }} {{ item.lastName }}</span
            >
          </template>
        </v-select>
      </v-row>
      <v-row class="px-4" no-gutters>
        <v-select
          return-object
          clearable
          :items="jobState.tasks"
          dark
          label="Task"
          outlined
          dense
        >
          <template v-slot:item="{ item }">
            {{ item.name }}
          </template>
          <template v-slot:selection="{ item }">
            {{ item.name }}
          </template>
        </v-select>
      </v-row>
    </v-navigation-drawer>
    <v-app-bar flat app height="64">
      <h1 style="font-size: 22px; font-weight: 900">Work</h1>

      <v-spacer />
      <v-btn dark depressed color="green darken-1">Export </v-btn>
    </v-app-bar>
    <v-data-table
      :items-per-page="100"
      fixed-header
      height="calc(100vh - 128px)"
      :headers="shiftHeaders"
      :items="jobState.shifts"
    >
      <template v-slot:item.person="{ item }">
        <span v-if="jobState.personDict[item.person]">
          {{ jobState.fullPeopleDict[item.person].firstName }}
          {{ jobState.fullPeopleDict[item.person].lastName }}
        </span>
      </template>
      <template v-slot:item.project="{ item }">
        <span v-if="jobState.fullProjectsDict[item.project]">{{
          jobState.fullProjectsDict[item.project].name
        }}</span>
      </template>

      <template v-slot:item.task="{ item }">
        <span v-if="jobState.fullTasksDict[item.task]">{{
          jobState.fullTasksDict[item.task].name
        }}</span>
      </template>

      <template v-slot:item.start="{ item }">
        <span
          >{{ new Date(item.start).toLocaleDateString() }}
          {{ new Date(item.start).toLocaleTimeString() }}</span
        >
      </template>

      <template v-slot:item.end="{ item }">
        <span v-if="item.end"
          >{{ new Date(item.end).toLocaleDateString() }}
          {{ new Date(item.end).toLocaleTimeString() }}</span
        >
      </template>

      <template v-slot:item.duration="{ item }">
        <span v-if="item.duration">{{
          msToMinutesAndSeconds(item.duration)
        }}</span>
        <v-chip outlined color="green" dark small v-if="!item.duration"
          >Active</v-chip
        >
      </template>

      <template v-slot:item.action="{ item }">
        <v-row no-gutters justify="center">
          <v-btn @click="removeShift(item)" icon
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-row>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
// @ is an alias to /src
import {
  addNewPerson,
  state as jobState,
  addNewProject,
  addNewTask,
  updateProject,
  updateTask,
  updateShift,
  msToMinutesAndSeconds,
} from "@/store.js";
import { defineComponent, onMounted, ref } from "@vue/composition-api";

export default defineComponent({
  setup() {
    const dateRange = ref([]);
    const newPersonDialog = ref(false);
    const newProjectDialog = ref(false);
    const selectedPerson = ref(null);
    const selectedProject = ref(null);
    const newTaskDialog = ref(false);

    const selectedProjects = ref([]);

    const peopleHeaders = [
      {
        text: "Name",
        align: "start",
        sortable: true,
        value: "lastName",
      },
      {
        text: "Remove",
        align: "center",
        sortable: false,
        value: "action",
        width: 100,
      },
    ];

    const projectHeaders = [
      {
        text: "Display Name",
        align: "start",
        sortable: true,
        value: "name",
      },
      {
        text: "Client",
        align: "start",
        sortable: true,
        value: "client",
      },
      {
        text: "Claim ID",
        align: "start",
        sortable: true,
        value: "claimID",
      },
      {
        text: "Remove",
        align: "center",
        sortable: false,
        value: "action",
        width: 100,
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
      {
        text: "Task",
        align: "start",
        sortable: true,
        value: "task",
      },
      // {
      //   text: "Remove",
      //   align: "center",
      //   sortable: false,
      //   value: "action",
      //   width: 100,
      // },
    ];

    const taskHeaders = [
      {
        text: "Name",
        align: "start",
        sortable: true,
        value: "name",
      },
      {
        text: "Remove",
        align: "center",
        sortable: false,
        value: "action",
        width: 100,
      },
    ];

    const newPerson = ref({
      firstName: null,
      lastName: null,
      pid: null,
      active: true,
    });

    const newProject = ref({
      displayName: null,
      claimID: null,
      client: null,
      active: true,
    });

    const newTask = ref({
      name: null,
      active: true,
    });

    const resetNewTask = () => {
      newTask.value = {
        name: null,
        active: true,
      };
    };

    const resetNewProject = () => {
      newPerson.value = {
        displayName: null,
        claimID: null,
        client: null,
        active: true,
      };
    };

    const resetNewPerson = () => {
      newPerson.value = {
        firstName: null,
        lastName: null,
        pid: null,
        active: true,
      };
    };

    const submitNewProject = async () => {
      await addNewProject(newProject.value);
      resetNewProject();
      newProjectDialog.value = false;
    };

    const submitNewTask = async () => {
      await addNewTask(newTask.value);
      resetNewTask();
      newTaskDialog.value = false;
    };

    const submitNewPerson = async () => {
      await addNewPerson(newPerson.value);
      resetNewPerson();
      newPersonDialog.value = false;
    };

    const removeShift = async (shift) => {
      shift.hidden = true;
      await updateShift(shift);
    };

    const removeProject = async (project) => {
      project.active = false;
      await updateProject(project);
    };

    const removeTask = async (task) => {
      task.active = false;
      await updateTask(task);
    };

    onMounted(() => {});
    return {
      jobState,
      selectedPerson,
      selectedProject,
      peopleHeaders,
      projectHeaders,
      shiftHeaders,
      newPerson,
      newPersonDialog,
      resetNewPerson,
      submitNewPerson,
      taskHeaders,
      newProjectDialog,
      newProject,
      resetNewProject,
      submitNewProject,
      submitNewTask,
      resetNewTask,
      newTask,
      removeProject,
      removeTask,
      newTaskDialog,
      dateRange,
      removeShift,
      msToMinutesAndSeconds,
      selectedProjects,
    };
  },
});
</script>
