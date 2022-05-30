<template>
  <v-container class="pa-0" fluid>
    <v-app-bar
      extended
      :extension-height="extensionHeight"
      color="#ffffff80"
      style="backdrop-filter: blur(8px)"
      height="64"
      flat
      app
    >
      <v-img :src="require('../assets/restorepro.png')" contain height="30" />

      <!-- <v-toolbar-items>
        
        <v-btn icon color="green"><v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar-items> -->
      <div
        slot="extension"
        class="flex"
        style="border-bottom: 1px solid #eeeeee"
      >
        <div style="height: 60px" class="flex">
          <v-btn
            tile
            depressed
            @click="resetSelectedPerson()"
            block
            :style="nameSelectStyle"
            class="text-none"
            id="buttonStyle"
          >
            <v-row
              no-gutters
              align="center"
              justify="start"
              class="fill-height"
            >
              <v-icon size="25" class="mr-3">mdi-account</v-icon>
              <v-slide-x-transition hide-on-leave>
                <span
                  v-if="selectedPerson"
                  class="text-truncate"
                  style="width: 60vw; text-align: left"
                  >{{ selectedPerson.firstName }}
                  {{ selectedPerson.lastName }}</span
                >
              </v-slide-x-transition>
              <v-slide-x-reverse-transition hide-on-leave>
                <span v-if="!selectedPerson">Select your name</span>
              </v-slide-x-reverse-transition>
              <v-spacer />
              <v-scale-transition origin="center center" hide-on-leave>
                <v-chip
                  dark
                  color="red"
                  v-if="selectedPerson !== null && activeShift === null"
                >
                  <span>OUT</span>
                </v-chip>
              </v-scale-transition>
              <v-scale-transition origin="center center" hide-on-leave>
                <v-chip
                  dark
                  color="green"
                  v-if="selectedPerson !== null && activeShift !== null"
                >
                  <span>IN</span>
                </v-chip>
              </v-scale-transition>
            </v-row>
          </v-btn>
        </div>
        <div
          v-if="progress > 0"
          style="height: 60px; background-color: transparent"
          class="flex"
        >
          <v-btn
            tile
            depressed
            @click="resetSelectedProject()"
            block
            :disabled="!selectedPerson"
            :style="projectSelectStyle"
            class="text-none"
            id="buttonStyle"
          >
            <v-row no-gutters align="center" justify="start">
              <v-icon size="25" class="mr-3">mdi-office-building</v-icon>
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
        </div>
        <div
          v-if="progress > 1"
          style="height: 60px; background-color: transparent"
          class="flex"
        >
          <v-btn
            tile
            depressed
            @click="resetSelectedTask()"
            block
            :disabled="!selectedPerson || !selectedProject"
            :style="taskSelectStyle"
            class="text-none"
            id="buttonStyle"
          >
            <v-row no-gutters align="center" justify="start">
              <v-icon size="25" class="mr-3">mdi-hammer-wrench</v-icon>
              <v-slide-x-transition hide-on-leave>
                <span
                  class="text-truncate"
                  style="width: 70vw; text-align: left"
                  v-if="selectedTask"
                  >{{ selectedTask.name }}</span
                >
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
        </div>
      </div>
    </v-app-bar>

    <v-slide-y-reverse-transition hide-on-leave>
      <v-row v-if="progress === 0" class="mx-4 mt-4" no-gutters>
        <v-col cols="12">
          <v-card
            v-for="(person, index) in jobState.people"
            :key="index + 'person'"
            @click="(selectedPerson = person), (progress = progress + 1)"
            class="flex mb-4 pa-4"
            flat
            rounded="lg"
            color="grey lighten-3"
          >
            <v-row justify="start" align="center" no-gutters>
              <v-icon class="mr-3" size="25">mdi-account</v-icon>
              <span style="font-size: 18px" class="font-weight-bold mr-1">{{
                person.firstName
              }}</span>
              <span style="font-size: 18px" class="font-weight-bold">{{
                person.lastName
              }}</span>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-slide-y-reverse-transition>
    <v-slide-y-reverse-transition hide-on-leave>
      <v-row v-if="progress === 1" class="mx-4 mt-4" no-gutters>
        <v-col cols="12">
          <v-card
            v-for="(project, index) in jobState.projects"
            :key="index + 'project'"
            @click="(selectedProject = project), (progress = progress + 1)"
            class="flex mb-4 pa-4"
            flat
            rounded="lg"
            color="grey lighten-3"
          >
            <v-row justify="start" align="center" no-gutters>
              <v-icon class="mr-3" size="25">mdi-office-building</v-icon>
              <span style="font-size: 18px" class="font-weight-bold">{{
                project.name
              }}</span>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-slide-y-reverse-transition>

    <v-slide-y-reverse-transition hide-on-leave>
      <v-row v-if="progress === 1 && false" no-gutters>
        <v-col cols="12">
          <v-card
            v-for="(project, index) in jobState.projects"
            :key="index + 'project'"
            @click="(selectedProject = project), (progress = progress + 1)"
            class="flex pa-4"
            flat
            color="grey lighten-3"
            tile
            style="margin-top: 1px"
          >
            <v-row justify="start" align="center" no-gutters>
              <v-icon class="mr-3" size="25">mdi-office-building</v-icon>
              <span style="font-size: 18px" class="font-weight-bold">{{
                project.name
              }}</span>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-slide-y-reverse-transition>

    <v-slide-y-reverse-transition hide-on-leave>
      <v-row v-if="progress === 2" class="mx-4 mt-4" no-gutters>
        <v-col cols="12">
          <v-card
            v-for="(task, index) in jobState.tasks"
            :key="index + 'task'"
            @click="(selectedTask = task), (progress = progress + 1)"
            class="flex mb-4 pa-4"
            flat
            rounded="lg"
            color="grey lighten-3"
          >
            <v-row justify="start" align="center" no-gutters>
              <v-icon class="mr-3" size="25">mdi-hammer-wrench</v-icon>
              <span style="font-size: 18px" class="font-weight-bold">{{
                task.name
              }}</span>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-slide-y-reverse-transition>

    <!-- <v-slide-y-reverse-transition hide-on-leave>
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
    </v-slide-y-reverse-transition> -->

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

    <!-- <v-slide-y-reverse-transition hide-on-leave>
      <v-footer v-if="progress === 3" color="transparent" class="pb-4" app>
        <v-row no-gutters>
          <v-col cols="12">
            <v-btn
              id="buttonStyle"
              depressed
              dark
              color="green"
              x-large
              @click="setShift()"
              block
              >Clock In</v-btn
            >
           
          </v-col>
        </v-row>
      </v-footer>
    </v-slide-y-reverse-transition> -->

    <v-slide-y-reverse-transition hide-on-leave>
      <v-footer v-if="progress > 2" color="transparent" class="pb-8" app>
        <v-row no-gutters>
          <v-col>
            <v-btn
              v-if="progress > 2"
              id="actionButtonStyle"
              depressed
              dark
              color="green"
              x-large
              @click="setShift()"
              block
            >
              <span v-if="!activeShift">Start</span>
              <span v-if="activeShift">{{ sessionLengthString }}</span>
            </v-btn>
            <v-expand-transition>
              <div v-if="progress === 4">
                <v-btn
                  id="actionButtonStyle"
                  depressed
                  dark
                  color="grey darken-3"
                  x-large
                  @click="switchTasks"
                  class="mb-4 mt-4"
                  block
                  >Switch Task</v-btn
                >
                <v-btn
                  id="actionButtonStyle"
                  depressed
                  dark
                  color="red"
                  x-large
                  @click="clockOut"
                  block
                  >Clock Out</v-btn
                >
              </div>
            </v-expand-transition>
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

    const extensionHeight = computed(() => {
      if (progress.value === 0) {
        return 60;
      }

      if (progress.value === 1) {
        return 120;
      }

      return 180;
    });

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
        return "background-color: #ffffff4d;";
      }
      return "background-color: transparent";
    });

    const projectSelectStyle = computed(() => {
      if (selectedPerson.value !== null && selectedProject.value === null) {
        return "background-color: #ffffff4d;";
      }
      if (selectedPerson.value !== null && selectedProject.value !== null) {
        return "background-color: transparent";
      }

      return "background-color: transparent";
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
        return "background-color: transparent";
      }
      return "background-color: transparent";
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
      if (activeShift.value) {
        return;
      }
      progress.value = 0;
      selectedPerson.value = null;
      selectedProject.value = null;
      selectedTask.value = null;
    };

    const resetSelectedProject = () => {
      if (activeShift.value) {
        return;
      }
      progress.value = 1;
      selectedProject.value = null;
      selectedTask.value = null;
    };

    const resetSelectedTask = () => {
      if (activeShift.value) {
        return;
      }
      progress.value = 2;
      selectedTask.value = null;
    };

    const setShift = async () => {
      if (!activeShift.value) {
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
      }
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
      extensionHeight,
    };
  },
});
</script>

<style lang="scss" scoped>
#buttonStyle {
  //background-color: green;
  //transition: all 0.2s;
  height: 60px;
  font-size: 20px;
  font-weight: 700;
}

#actionButtonStyle {
  //background-color: green;
  //transition: all 0.2s;
  height: 60px;
  font-size: 18px;
  font-weight: 700;
}
</style>
