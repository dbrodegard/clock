<template>
  <v-container class="pa-0" fluid>
    <v-card
      v-if="false"
      dark
      :color="activeShift ? 'green' : '#222222'"
      tile
      flat
      style="position: sticky; top: 0px; z-index: 500"
    >
      <v-row class="pt-6" align="center" justify="center" no-gutters>
        <v-img
          :src="require('../assets/restoreproW.png')"
          contain
          height="40"
        />
      </v-row>
      <v-card flat color="transparent" class="flex px-4" height="50">
        <v-row no-gutters align="end" class="fill-height">
          <span style="font-size: 20px; font-weight: 900" v-if="selectedPerson"
            >{{ selectedPerson.firstName }} {{ selectedPerson.lastName }}</span
          >
        </v-row>
      </v-card>
      <v-window class="pa-0" v-model="progress">
        <v-window-item v-for="(item, index) in slides" :key="index">
          <v-card dark class="pa-4 pt-0" tile color="transparent">
            <v-row align="center" no-gutters>
              <h1 style="font-size: 38px; font-weight: 900">
                {{ item.title }}
              </h1>
              <v-spacer />
              <v-btn
                class="font-weight-bold"
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
    </v-card>

    <v-card
      dark
      :color="activeShift ? 'green' : '#222222'"
      tile
      flat
      style="position: sticky; top: 0px; z-index: 500"
    >
      <v-row class="py-6" align="center" justify="center" no-gutters>
        <v-img
          :src="require('../assets/restoreproW.png')"
          contain
          height="40"
        />
      </v-row>
      <v-btn
        tile
        x-large
        depressed
        @click="resetSelectedPerson()"
        block
        style="font-size: 16px; font-weight: 900"
        :style="nameSelectStyle"
        class="px-4 text-none"
      >
        <v-row no-gutters align="center" justify="start">
          <v-icon class="mr-2">mdi-account</v-icon>
          <v-slide-x-transition hide-on-leave>
            <span v-if="selectedPerson"
              >{{ selectedPerson.firstName }}
              {{ selectedPerson.lastName }}</span
            >
          </v-slide-x-transition>
          <v-slide-x-reverse-transition hide-on-leave>
            <span v-if="!selectedPerson">Select your name</span>
          </v-slide-x-reverse-transition>
          <v-spacer /><v-icon
            v-if="selectedPerson !== null && activeShift === null"
            >mdi-close</v-icon
          >
        </v-row>
      </v-btn>

      <v-btn
        tile
        x-large
        depressed
        @click="resetSelectedProject()"
        block
        style="font-size: 16px; font-weight: 900; opacity: 1"
        :disabled="!selectedPerson"
        :style="projectSelectStyle"
        class="px-4 text-none"
      >
        <v-row no-gutters align="center" justify="start">
          <v-icon class="mr-2">mdi-office-building</v-icon>
          <v-slide-x-transition hide-on-leave>
            <span
              class="text-truncate"
              style="width: 70vw; text-align: left"
              v-if="selectedProject"
              >{{ selectedProject.name }}</span
            >
          </v-slide-x-transition>
          <v-slide-x-reverse-transition hide-on-leave>
            <span v-if="!selectedProject">Select Project</span>
          </v-slide-x-reverse-transition>

          <v-spacer /><v-icon
            v-if="selectedProject !== null && activeShift === null"
            >mdi-close</v-icon
          >
        </v-row>
      </v-btn>

      <v-btn
        tile
        x-large
        depressed
        @click="resetSelectedTask()"
        block
        style="font-size: 16px; font-weight: 900"
        :disabled="!selectedPerson || !selectedProject"
        :style="taskSelectStyle"
        class="px-4 text-none"
      >
        <v-row no-gutters align="center" justify="start">
          <v-icon class="mr-2">mdi-hammer-wrench</v-icon>
          <v-slide-x-transition hide-on-leave>
            <span v-if="selectedTask">{{ selectedTask.name }}</span>
          </v-slide-x-transition>
          <v-slide-x-reverse-transition hide-on-leave>
            <span v-if="!selectedTask">Select Task</span>
          </v-slide-x-reverse-transition>
          <v-spacer /><v-icon
            v-if="selectedTask !== null && activeShift === null"
            >mdi-close</v-icon
          >
        </v-row>
      </v-btn>
    </v-card>

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
      <v-card
        v-if="progress > 2"
        class="mt-4 px-4"
        flat
        rounded="lg"
        color="transparent"
      >
        <v-row class="fill-height" no-gutters align="center" justify="center">
          <span style="font-weight: 900; font-size: 55px">{{
            sessionLengthString
          }}</span>
        </v-row>
      </v-card>
    </v-slide-y-reverse-transition>

    <!-- <v-slide-y-reverse-transition hide-on-leave>
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
    </v-slide-y-reverse-transition> -->

    <v-slide-y-reverse-transition hide-on-leave>
      <v-footer v-if="progress === 3" color="transparent" class="pb-6" app>
        <v-row v-if="progress === 3" class="mt-4" no-gutters>
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
            <v-btn
              depressed
              dark
              color="red"
              x-large
              @click="cancelBack()"
              block
              >Cancel</v-btn
            >
          </v-col>
        </v-row>
      </v-footer>
    </v-slide-y-reverse-transition>

    <v-slide-y-reverse-transition hide-on-leave>
      <v-footer v-if="progress === 4" color="transparent" class="pb-6" app>
        <v-row no-gutters>
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
      </v-footer>
    </v-slide-y-reverse-transition>

    <!-- <v-footer color="transparent" class="pb-12" app>
      <v-row justify="center" no-gutters>
        <v-scale-transition origin="center center">
          <v-chip
            v-if="selectedPerson"
            class="font-weight-bold"
            :color="activeShift !== null ? 'green' : 'red'"
            dark
          >
            <span v-if="activeShift"> {{ sessionLengthString }} </span>
            <span v-else> Currently Clocked Out </span>
          </v-chip>
        </v-scale-transition>
      </v-row>
    </v-footer> -->
  </v-container>
</template>

<script>
// @ is an alias to /src
import {
  state as jobState,
  addNewShift,
  updateShift,
  storedSettings,
  msToMinutesAndSeconds,
} from "@/store.js";
import {
  defineComponent,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  computed,
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
        title: "Clocked In",
        array: null,
        description: "Active Task",
      },
    ]);

    const selectedPerson = ref(null);
    const selectedProject = ref(null);
    const selectedTask = ref(null);

    const activeShift = ref(null);

    const nameSelectStyle = computed(() => {
      if (selectedPerson.value === null) {
        return "background-color: #ffffff1a";
      }
      return "background-color: #ffffff1a";
    });

    const projectSelectStyle = computed(() => {
      if (selectedPerson.value !== null && selectedProject.value === null) {
        return "background-color: #ffffff33;";
      }
      if (selectedPerson.value !== null && selectedProject.value !== null) {
        return "background-color: #ffffff33";
      }

      return "background-color: #ffffff33;";
    });

    const taskSelectStyle = computed(() => {
      if (
        selectedPerson.value !== null &&
        selectedProject.value !== null &&
        selectedTask.value === null
      ) {
        return "background-color: #ffffff4d;";
      }
      if (
        selectedPerson.value !== null &&
        selectedProject.value !== null &&
        selectedTask.value !== null
      ) {
        return "background-color: #ffffff4d";
      }
      return "background-color: #ffffff4d;";
    });

    watch(selectedPerson, (currentValue) => {
      if (currentValue) {
        localStorage.setItem("selectedPersonReference", currentValue.reference);
        if (jobState.openShiftsByPerson[currentValue.reference]) {
          console.log(
            "looks like you found a job",
            jobState.openShiftsByPerson[currentValue.reference]
          );

          activeShift.value =
            jobState.openShiftsByPerson[currentValue.reference];

          selectedProject.value =
            jobState.fullProjectsDict[activeShift.value.project];

          selectedTask.value = jobState.fullTasksDict[activeShift.value.task];
          progress.value = 4;
        }
      } else {
        activeShift.value = null;
        selectedProject.value = null;
        selectedTask.value = null;
      }
    });

    const resetSelectedPerson = () => {
      progress.value = 0;
      selectedPerson.value = null;
      selectedProject.value = null;
      selectedTask.value = null;
    };

    const resetSelectedProject = () => {
      progress.value = 1;
      selectedProject.value = null;
      selectedTask.value = null;
    };

    const resetSelectedTask = () => {
      progress.value = 2;
      selectedTask.value = null;
    };

    const setShift = async () => {
      let shift = {
        person: selectedPerson.value.reference,
        project: selectedProject.value.reference,
        task: selectedTask.value.reference,
        start: new Date().getTime(),
        open: true,
      };
      activeShift.value = shift;
      progress.value = 4;

      let reference = await addNewShift(shift);
      shift.reference = reference.id;
      activeShift.value = shift;
    };

    const clockOut = async () => {
      // there should only ever be one open task...
      let taskToUpdate = activeShift.value;

      if (taskToUpdate) {
        taskToUpdate.end = new Date().getTime();
        taskToUpdate.open = false;
        taskToUpdate.duration = taskToUpdate.end - taskToUpdate.start;
        updateShift(taskToUpdate);
      }
      activeShift.value = null;
      selectedProject.value = null;
      selectedTask.value = null;
      progress.value = 1;
    };

    const switchTasks = async () => {
      let taskToUpdate = activeShift.value;

      if (taskToUpdate) {
        taskToUpdate.end = new Date().getTime();
        taskToUpdate.open = false;
        taskToUpdate.duration = taskToUpdate.end - taskToUpdate.start;
        updateShift(taskToUpdate);
      }
      selectedTask.value = null;
      activeShift.value = null;
      progress.value = 2;
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

    onBeforeMount(() => {
      console.log("stored settings", storedSettings.person);
      if (storedSettings.person) {
        selectedPerson.value = storedSettings.person;
        progress.value = 1;
      } else {
        progress.value = 0;
      }
    });

    const clock = ref(null);
    const sessionLengthString = ref("00:00:00");

    onMounted(() => {
      clock.value = setInterval(function () {
        if (activeShift && activeShift.value && activeShift.value.start) {
          sessionLengthString.value = msToMinutesAndSeconds(
            new Date().getTime() - activeShift.value.start
          );
        } else {
          sessionLengthString.value = "00:00:00";
        }
      }, 1000);
    });

    onBeforeUnmount(() => {
      clearInterval(clock.value);
    });

    return {
      jobState,
      selectedPerson,
      selectedProject,
      setShift,
      activeShift,
      progress,
      slides,
      selectedTask,
      clockOut,
      switchTasks,
      cancelBack,
      storedSettings,
      sessionLengthString,
      resetSelectedPerson,
      resetSelectedProject,
      resetSelectedTask,
      nameSelectStyle,
      projectSelectStyle,
      taskSelectStyle,
    };
  },
});
</script>
