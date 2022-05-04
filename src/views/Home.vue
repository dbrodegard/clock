<template>
  <v-container class="pa-0" fluid>
    <v-window
      style="position: sticky; top: 0px"
      class="pa-0"
      v-model="progress"
    >
      <v-window-item v-for="(item, index) in slides" :key="index">
        <v-card dark class="pa-4 pt-7" tile color="#CA1615">
          <v-row align="center" no-gutters>
            <h1 style="font-size: 38px; font-weight: 900">
              {{ item.title }}
            </h1>
            <v-spacer />
            <v-btn
              class="font-weight-bold"
              getOpenTasks
              x-large
              v-if="progress === 0 && false"
              @click="toggleLang()"
              icon
              >EN</v-btn
            >
            <v-btn
              x-large
              v-if="progress < 4 && progress > 0"
              @click="cancelBack()"
              icon
              ><v-icon>mdi-close</v-icon></v-btn
            >
          </v-row>
          <v-row no-gutters>
            <h1 style="font-size: 18px" class="white--text">
              {{ item.description }}
            </h1>
          </v-row>
        </v-card>
      </v-window-item>
    </v-window>

    <v-slide-y-reverse-transition hide-on-leave>
      <v-row v-if="progress === 0" class="ml-4 mt-4" no-gutters>
        <v-col
          v-for="(person, index) in jobState.people"
          :key="index + 'person'"
          cols="6"
        >
          <v-card
            @click="(selectedPerson = person), (progress = progress + 1)"
            class="flex mr-4 mb-4 pa-4"
            flat
            rounded="lg"
            color="grey lighten-3"
          >
            <v-row class="py-3" no-gutters justify="center">
              <v-avatar size="60" color="#222222">
                <v-icon size="30" color="white">mdi-account</v-icon>
              </v-avatar>
            </v-row>
            <v-row justify="center" no-gutters>
              <span style="font-size: 18px">{{ person.firstName }}</span>
            </v-row>
            <v-row justify="center" no-gutters>
              <span style="font-size: 18px" class="font-weight-bold">{{
                person.lastName
              }}</span>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-slide-y-reverse-transition>
    <v-slide-y-reverse-transition hide-on-leave>
      <v-row v-if="progress === 1" class="ml-4 mt-4" no-gutters>
        <v-col
          v-for="(project, index) in jobState.projects"
          :key="index + 'project'"
          cols="12"
        >
          <v-card
            @click="(selectedProject = project), (progress = progress + 1)"
            class="flex mr-4 mb-4 pa-4"
            color="grey lighten-3"
            flat
            rounded="lg"
          >
            <v-row no-gutters>
              <v-avatar size="60" color="#222222">
                <v-icon size="30" color="white">mdi-office-building</v-icon>
              </v-avatar>

              <v-col class="ml-3">
                <v-row
                  style="font-size: 18px"
                  class="font-weight-bold"
                  justify="start"
                  no-gutters
                >
                  <span>{{ project.name }}</span>
                </v-row>
                <v-row style="font-size: 16px" justify="start" no-gutters>
                  <span>{{ project.client }}</span>
                  <span class="ml-2">{{ project.claimID }}</span>
                </v-row>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-slide-y-reverse-transition>

    <v-slide-y-reverse-transition hide-on-leave>
      <v-row v-if="progress === 2" class="ml-4 mt-4" no-gutters>
        <v-col
          v-for="(task, index) in jobState.tasks"
          :key="index + 'task'"
          cols="6"
        >
          <v-card
            @click="(selectedTask = task), (progress = progress + 1)"
            class="flex mr-4 mb-4 pa-4"
            flat
            rounded="lg"
            color="grey lighten-3"
            min-height="180"
          >
            <v-row class="py-3" no-gutters justify="center">
              <v-avatar size="60" color="#222222">
                <v-icon size="30" color="white">mdi-hammer-wrench</v-icon>
              </v-avatar>
            </v-row>
            <v-row justify="center" no-gutters>
              <span style="font-size: 18px" class="font-weight-bold">{{
                task.name
              }}</span>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-slide-y-reverse-transition>

    <v-slide-y-reverse-transition hide-on-leave>
      <v-row v-if="progress > 2" class="mx-4 mt-4" no-gutters>
        <v-col cols="12">
          <v-card
            rounded="lg"
            class="flex pa-4"
            :color="progress === 4 ? 'green' : '#222222'"
            flat
            dark
          >
            <v-expand-transition>
              <div v-if="progress === 4 && false">
                <v-row no-gutters align="center" justify="center">
                  <span class="text-h2">0:00</span>
                </v-row>
              </div>
            </v-expand-transition>
            <v-row align="start" no-gutters>
              <v-icon size="60" color="white">mdi-clock-outline</v-icon>

              <v-col class="ml-3">
                <v-row
                  style="font-size: 18px"
                  class="font-weight-bold"
                  justify="start"
                  no-gutters
                >
                  <span>{{ selectedPerson.firstName }}</span>
                  <span class="ml-1">{{ selectedPerson.lastName }}</span>
                </v-row>

                <v-row
                  style="font-size: 18px"
                  class="font-weight-bold"
                  justify="start"
                  no-gutters
                >
                  <span>{{ selectedProject.name }}</span>
                </v-row>
                <v-row
                  style="font-size: 18px"
                  class="font-weight-bold"
                  justify="start"
                  no-gutters
                >
                  <span>{{ selectedTask.name }}</span>
                </v-row>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-slide-y-reverse-transition>

    <v-slide-y-reverse-transition hide-on-leave>
      <v-row v-if="progress === 3" class="mx-4 mt-4" no-gutters>
        <v-col cols="12">
          <v-btn
            depressed
            dark
            color="green"
            class="mb-4"
            x-large
            @click="setShift()"
            block
            >Start</v-btn
          >
          <v-btn depressed dark color="red" x-large @click="cancelBack()" block
            >Cancel</v-btn
          >
        </v-col>
      </v-row>
    </v-slide-y-reverse-transition>

    <v-slide-y-reverse-transition hide-on-leave>
      <v-row v-if="progress === 4" class="mx-4 mt-4" no-gutters>
        <v-col>
          <v-btn
            depressed
            dark
            color="grey darken-3"
            x-large
            @click="switchTasks"
            class="mb-4"
            block
            >Switch Task</v-btn
          >
          <v-btn
            depressed
            dark
            color="red"
            x-large
            @click="clockOut"
            class="mb-4"
            block
            >Clock Out</v-btn
          >
        </v-col>
      </v-row>
    </v-slide-y-reverse-transition>

    <!-- <v-card class="pa-4 flex" rounded="xl" color="grey darken-3" dark>
      <v-card-title> Shift Management </v-card-title>
      <div class="home">
        <v-select
          return-object
          label="Person"
          v-model="selectedPerson"
          :items="jobState.people"
          solo
          flat
        >
          <template v-slot:selection>
            <span
              >{{ selectedPerson.firstName }}
              {{ selectedPerson.lastName }}</span
            >
          </template>
          <template v-slot:item="{ item }">
            <span>{{ item.firstName }} {{ item.lastName }}</span>
          </template>
        </v-select>
        <v-select
          return-object
          solo
          flat
          label="Project"
          v-model="selectedProject"
          :items="jobState.projects"
        >
          <template v-slot:selection>
            <span>{{ selectedProject.name }}</span>
          </template>
          <template v-slot:item="{ item }">
            <span>{{ item.name }}</span>
          </template>
        </v-select>

        <v-footer height="100" class="py-4" fixed>
          <v-btn
            :disabled="!selectedPerson || !selectedProject"
            rounded
            depressed
            dark
            block
            x-large
            color="green"
            @click="setShift"
            >Start</v-btn
          >
        </v-footer>
      </div>
    </v-card> -->
  </v-container>
</template>

<script>
// @ is an alias to /src
import {
  state as jobState,
  addNewShift,
  getOpenTasks,
  updateShift,
} from "@/store.js";
import {
  defineComponent,
  onMounted,
  ref,
  computed,
  watch,
} from "@vue/composition-api";

export default defineComponent({
  setup() {
    const progress = ref(0);

    const slides = ref([
      {
        title: "Team Member",
        array: jobState.people,
        description: "Select your name",
      },

      {
        title: "Project",
        array: jobState.projects,
        description: "Select the project",
      },
      {
        title: "Task",
        array: jobState.tasks,
        description: "Select the task",
      },
      {
        title: "Start",
        array: null,
        description: "Press the start button to begin",
      },
      {
        title: "Active Task",
        array: null,
        description: "Currently clocked in",
      },
    ]);

    const selectedPerson = ref(null);
    const selectedProject = ref(null);
    const selectedTask = ref(null);

    watch(selectedPerson, async (currentValue) => {
      console.log("selected person");
      if (currentValue) {
        await getOpenTasks(selectedPerson.value.reference);
      }
    });

    const activity = ref(["Drive", "cleanup"]);

    const activeShift = computed(() => {
      // see if there is an active shift for this person
      if (jobState.selectedPersonOpenTasks.length > 0) {
        return true;
      }
      return false;
    });

    watch(activeShift, (val) => {
      console.log("active shift");
      if (val) {
        console.log("updating selecteds", val);

        selectedProject.value = jobState.projects.find(
          (element) =>
            (element.reference = jobState.selectedPersonOpenTasks[0].project)
        );
        selectedTask.value = jobState.tasks.find(
          (element) =>
            (element.reference = jobState.selectedPersonOpenTasks[0].task)
        );

        console.log(selectedProject.value);
        progress.value = 4;
      }
    });

    const setShift = async () => {
      let shift = {
        person: selectedPerson.value.reference,
        project: selectedProject.value.reference,
        task: selectedTask.value.reference,
        start: new Date().getTime(),
        open: true,
      };

      console.log("shift", shift);
      await addNewShift(shift);
      await getOpenTasks(selectedPerson.value.reference);
    };

    const clockOut = async () => {
      // there should only ever be one open task...
      let taskToUpdate = jobState.selectedPersonOpenTasks[0];

      if (taskToUpdate) {
        taskToUpdate.end = new Date().getTime();
        taskToUpdate.open = false;
        taskToUpdate.duration = taskToUpdate.end - taskToUpdate.start;
        updateShift(taskToUpdate);
      }

      selectedPerson.value = null;
      selectedProject.value = null;
      progress.value = 0;
    };

    const switchTasks = async () => {
      let taskToUpdate = jobState.selectedPersonOpenTasks[0];

      if (taskToUpdate) {
        taskToUpdate.end = new Date().getTime();
        taskToUpdate.open = false;
        taskToUpdate.duration = taskToUpdate.end - taskToUpdate.start;
        updateShift(taskToUpdate);
      }
      selectedProject.value = null;
      progress.value = 1;
    };

    const cancelBack = () => {
      if (progress.value === 1) {
        selectedPerson.value = null;
        selectedProject.value = null;
        selectedTask.value = null;
        progress.value = 0;
      }

      if (progress.value === 2) {
        selectedProject.value = null;
        selectedTask.value = null;
        progress.value = 1;
      }

      if (progress.value === 3) {
        selectedTask.value = null;
        progress.value = 2;
      }
    };

    onMounted(() => {});
    return {
      jobState,
      selectedPerson,
      selectedProject,
      setShift,
      activity,
      activeShift,
      progress,
      slides,
      selectedTask,
      clockOut,
      switchTasks,
      cancelBack,
    };
  },
});
</script>
