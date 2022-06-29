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
          <v-scale-transition origin="center center">
            <v-btn
              v-show="dateRange.length > 0"
              color="red"
              dark
              small
              absolute
              top
              right
              @click="dateRange = []"
              style="margin-right: -27px; margin-top: -2px; z-index: 10"
              fab
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-scale-transition>

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
          item-value="reference"
          v-model="selectedProjects"
          multiple
        >
          <template v-slot:item="{ item }">
            {{ item.name }}
          </template>
          <template v-slot:selection="{ item, index }">
            <span
              v-if="selectedProjects && selectedProjects.length === 0"
              class="text-truncate"
              style="width: 160px"
              >{{ item.name }}</span
            >
            <span
              v-if="
                selectedProjects && selectedProjects.length > 0 && index === 0
              "
              class="text-truncate"
              style="width: 160px"
              >{{ selectedProjects.length }} Selected</span
            >
          </template>
        </v-select>
      </v-row>
      <v-row class="px-4" no-gutters>
        <v-select
          item-value="reference"
          clearable
          :items="jobState.people"
          dark
          label="Team Member"
          outlined
          dense
          v-model="selectedPeople"
          multiple
        >
          <template v-slot:item="{ item }">
            {{ item.firstName }} {{ item.lastName }}
          </template>
          <template v-slot:selection="{ item, index }">
            <span
              v-if="selectedPeople && selectedPeople.length === 0"
              class="text-truncate"
              style="width: 160px"
              >{{ item.firstName }} {{ item.lastName }}</span
            >
            <span
              v-if="selectedPeople && selectedPeople.length > 0 && index === 0"
              class="text-truncate"
              style="width: 160px"
              >{{ selectedPeople.length }} Selected</span
            >
          </template>
        </v-select>
      </v-row>
      <v-row class="px-4" no-gutters>
        <v-select
          item-value="reference"
          clearable
          :items="jobState.tasks"
          dark
          label="Task"
          outlined
          dense
          v-model="selectedTasks"
          multiple
          item-text="name"
        >
          <template v-slot:item="{ item }">
            {{ item.name }}
          </template>
          <template v-slot:selection="{ item, index }">
            <span
              v-if="selectedTasks && selectedTasks.length === 0"
              class="text-truncate"
              style="width: 160px"
              >{{ item.name }}</span
            >
            <span
              v-if="selectedTasks && selectedTasks.length > 0 && index === 0"
              class="text-truncate"
              style="width: 160px"
              >{{ selectedTasks.length }} Selected</span
            >
          </template>
        </v-select>
      </v-row>
    </v-navigation-drawer>
    <v-app-bar flat app height="64">
      <h1 style="font-size: 22px; font-weight: 900">Work</h1>

      <v-spacer />

      <v-btn @click="generateXLSX()" dark depressed color="green darken-3"
        ><v-icon left>mdi-microsoft-excel</v-icon>Export
      </v-btn>
    </v-app-bar>
    <v-data-table
      :items-per-page="100"
      fixed-header
      height="calc(100vh - 128px)"
      :headers="shiftHeaders"
      :items="filteredShifts"
      @click:row="editShift"
      class="row-pointer"
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
      </template>

      <template v-slot:item.action="{ item }">
        <v-btn @click="editShift(item)" icon
          ><v-icon small>mdi-application-edit-outline</v-icon></v-btn
        >
      </template>
    </v-data-table>
    <shift-editor ref="editor" :selectedShift="selectedShift" />
  </v-container>
</template>

<script>
// @ is an alias to /src
import {
  state as jobState,
  msToMinutesAndSeconds,
  writeToCSV,
  createActivitySpreadsheet,
  watchShifts,
  unwatchShifts,
} from "@/store.js";
import {
  onBeforeMount,
  onBeforeUnmount,
  computed,
  defineComponent,
  onMounted,
  ref,
} from "@vue/composition-api";
import ShiftEditor from "../components/ShiftEditor.vue";

export default defineComponent({
  components: { ShiftEditor },
  setup() {
    const dateRange = ref([]);
    const editor = ref();
    const selectedProjects = ref([]);
    const selectedPeople = ref([]);
    const selectedTasks = ref([]);

    const selectedShift = ref(null);

    const dialog = ref(false);

    onBeforeMount(() => {
      console.log("activity is mounting");
      watchShifts();
    });

    onBeforeUnmount(() => {
      unwatchShifts();
    });

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
        text: "Task",
        align: "start",
        sortable: true,
        value: "task",
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

      // {
      //   text: "Remove",
      //   align: "center",
      //   sortable: false,
      //   value: "action",
      //   width: 100,
      // },
    ];

    const filteredShifts = computed(() => {
      let arrayToReturn = jobState.shifts;

      if (
        dateRange.value &&
        dateRange.value.length &&
        dateRange.value.length > 0
      ) {
        let start = new Date(
          dateRange.value[0].split("-")[0],
          dateRange.value[0].split("-")[1] - 1,
          dateRange.value[0].split("-")[2]
        );
        let end = new Date(
          dateRange.value[0].split("-")[0],
          dateRange.value[0].split("-")[1] - 1,
          dateRange.value[0].split("-")[2]
        );

        if (dateRange.value.length === 2) {
          end = new Date(
            dateRange.value[1].split("-")[0],
            dateRange.value[1].split("-")[1] - 1,
            dateRange.value[1].split("-")[2]
          );
        }

        end.setHours(23, 59, 59, 999);

        console.log("starting and ending", start.getTime());

        arrayToReturn = arrayToReturn.filter(
          (e) => e.start >= start.getTime() && e.start <= end.getTime()
        );
      }

      if (
        selectedProjects.value &&
        selectedProjects.value.length &&
        selectedProjects.value.length > 0
      ) {
        console.log("filtering shifts");
        arrayToReturn = arrayToReturn.filter((e) =>
          selectedProjects.value.includes(e.project)
        );
      }

      if (
        selectedPeople.value &&
        selectedPeople.value.length &&
        selectedPeople.value.length > 0
      ) {
        console.log("filtering shifts");
        arrayToReturn = arrayToReturn.filter((e) =>
          selectedPeople.value.includes(e.person)
        );
      }

      if (
        selectedTasks.value &&
        selectedTasks.value.length &&
        selectedTasks.value.length > 0
      ) {
        console.log("filtering shifts");
        arrayToReturn = arrayToReturn.filter((e) =>
          selectedTasks.value.includes(e.task)
        );
      }

      return arrayToReturn;
    });

    const generateCSV = () => {
      writeToCSV(filteredShifts.value);
    };

    const generateXLSX = () => {
      createActivitySpreadsheet(filteredShifts.value);
    };

    const editShift = (shift) => {
      selectedShift.value = JSON.parse(JSON.stringify(shift));
      editor.value.internalDialog = true;
    };

    onMounted(() => {});
    return {
      dateRange,
      msToMinutesAndSeconds,
      selectedProjects,
      shiftHeaders,
      jobState,
      filteredShifts,
      selectedTasks,
      selectedPeople,
      generateCSV,
      generateXLSX,
      editShift,
      selectedShift,
      dialog,
      editor,
    };
  },
});
</script>

<style lang="css" scoped>
.row-pointer >>> tbody tr :hover {
  cursor: pointer;
}
</style>
