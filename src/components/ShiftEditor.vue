<template>
  <v-dialog v-model="internalDialog" width="400">
    <v-card v-if="selectedShift">
      <v-toolbar style="font-weight: 700" dark flat>
        <span v-if="jobState.personDict[selectedShift.person]">
          {{ jobState.personDict[selectedShift.person].firstName }}
          {{ jobState.personDict[selectedShift.person].lastName }}
        </span>
        <v-spacer> </v-spacer>
        <span v-if="selectedShift.start">
          {{ new Date(selectedShift.start).toLocaleDateString() }}
          {{ new Date(selectedShift.start).toLocaleTimeString() }}
        </span>
      </v-toolbar>
      <!-- <v-subheader> Team Member </v-subheader>
      <v-row class="px-4" no-gutters>
        <v-select
          :items="jobState.people"
          label="Project"
          dense
          item-value="reference"
          v-model="selectedShift.person"
          solo
          flat
          background-color="grey lighten-4"
          hide-details
          readonly
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
      </v-row> -->

      <v-row class="px-4 pt-4 pb-1" no-gutters>
        <span>Project</span>
      </v-row>
      <v-row class="px-4" no-gutters>
        <v-select
          :items="jobState.projects"
          label="Project"
          item-value="reference"
          v-model="selectedShift.project"
          solo
          flat
          background-color="grey lighten-4"
          hide-details
          @change="needsUpdate()"
        >
          <template v-slot:item="{ item }">
            {{ item.name }}
          </template>
          <template v-slot:selection="{ item }">
            <span class="text-truncate" style="width: 300px">{{
              item.name
            }}</span>
          </template>
        </v-select>
      </v-row>
      <v-row class="px-4 pt-4 pb-1" no-gutters>
        <span>Task</span>
      </v-row>
      <v-row class="px-4" no-gutters>
        <v-select
          :items="jobState.tasks"
          label="Task"
          item-value="reference"
          v-model="selectedShift.task"
          solo
          flat
          background-color="grey lighten-4"
          hide-details
          @change="needsUpdate()"
        >
          <template v-slot:item="{ item }">
            {{ item.name }}
          </template>
          <template v-slot:item="{ item }">
            {{ item.name }}
          </template>
          <template v-slot:selection="{ item }">
            <span class="text-truncate" style="width: 300px">{{
              item.name
            }}</span>
          </template>
        </v-select>
      </v-row>
      <v-row class="px-4 pt-4 pb-1" no-gutters>
        <span>Start</span>
      </v-row>
      <v-row class="px-4" no-gutters>
        <v-col>
          <v-menu
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                flat
                solo
                background-color="grey lighten-4"
                v-model="startDateInput"
                v-bind="attrs"
                v-on="on"
                label="Date"
                hide-details
                @change="needsUpdate()"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="startDate"
              @change="saveStartDate(startDate)"
              no-title
            ></v-date-picker>
          </v-menu>
        </v-col>

        <v-text-field
          class="ml-3"
          placeholder="0"
          solo
          background-color="grey lighten-4"
          v-model="startHours"
          flat
          hide-details
          @keydown="needsUpdate()"
          style="width: 44px; max-width: 44px"
        />

        <v-text-field
          class="ml-3"
          placeholder="0"
          solo
          background-color="grey lighten-4"
          v-model="startMinutes"
          flat
          hide-details
          style="width: 50px; max-width: 50px"
          @keydown="needsUpdate()"
        />

        <v-select
          class="ml-3"
          flat
          v-model="startP"
          :items="['AM', 'PM']"
          style="width: 50px; max-width: 60px"
          solo
          background-color="grey lighten-4"
          hide-details
          append-icon=""
          @change="needsUpdate()"
        >
        </v-select>
      </v-row>

      <v-subheader> End</v-subheader>
      <v-row class="px-4" no-gutters>
        <v-col>
          <v-menu
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                flat
                solo
                background-color="grey lighten-4"
                v-model="endDateInput"
                v-bind="attrs"
                v-on="on"
                label="Date"
                hide-details
                @change="needsUpdate()"
                style="max-width: 250px"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="endDate"
              @change="saveEndDate(endDate)"
              no-title
            ></v-date-picker>
          </v-menu>
        </v-col>

        <v-text-field
          class="ml-3"
          placeholder="hh"
          solo
          background-color="grey lighten-4"
          v-model="endHours"
          flat
          hide-details
          @keydown="needsUpdate()"
          style="width: 44px; max-width: 44px"
        />

        <v-text-field
          class="ml-3"
          placeholder="mm"
          solo
          background-color="grey lighten-4"
          v-model="endMinutes"
          flat
          hide-details
          style="width: 50px; max-width: 50px"
          @keydown="needsUpdate()"
        />

        <v-select
          class="ml-3"
          flat
          v-model="endP"
          :items="['AM', 'PM']"
          placeholder="a/p"
          style="width: 50px; max-width: 60px"
          solo
          background-color="grey lighten-4"
          hide-details
          append-icon=""
          @change="needsUpdate()"
        >
        </v-select>
      </v-row>

      <v-card class="pa-4 mt-4 flex" flat>
        <v-row no-gutters align="center" class="fill-height">
          <v-btn @click="internalDialog = false" depressed> Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn
            :style="
              applyChangesOnExit ? null : 'opacity: 0.3; pointer-events: none'
            "
            @click="applyChangesToShift"
            color="green darken-2"
            dark
            depressed
          >
            Save Changes</v-btn
          >
        </v-row>
      </v-card>
    </v-card>
  </v-dialog>
</template>
<script>
import { defineComponent, ref, watch } from "@vue/composition-api";
import { state as jobState, updateShift } from "@/store.js";

export default defineComponent({
  props: {
    selectedShift: {
      type: Object,
      default: () => null,
    },
    dialog: false,
  },
  setup(props) {
    const endDate = ref(null);
    const endHours = ref(null);
    const endMinutes = ref(null);
    const endP = ref(null);

    const endTimeInput = ref(null);
    const endDateInput = ref(null);

    const applyChangesOnExit = ref(false);

    const startDate = ref(null);
    const startHours = ref(null);
    const startMinutes = ref(null);
    const startP = ref(null);
    const startTimeInput = ref(null);
    const startDateInput = ref(null);

    const internalDialog = ref(false);

    watch(
      () => internalDialog,
      () => {
        if (internalDialog.value === true) {
          applyChangesOnExit.value = false;
          startDate.value = null;
          (endDate.value = null), (startHours.value = null);
          startMinutes.value = null;
          startP.value = null;
          endHours.value = null;
          endMinutes.value = null;
          endP.value = null;
          if (props.selectedShift.start) {
            startDate.value =
              new Date(props.selectedShift.start).getFullYear() +
              "-" +
              (
                "0" +
                (new Date(props.selectedShift.start).getMonth() + 1)
              ).slice(-2) +
              "-" +
              ("0" + new Date(props.selectedShift.start).getDate()).slice(-2);

            console.log("start date", startDate.value);
            startHours.value = new Date(props.selectedShift.start).getHours();
            startMinutes.value = new Date(
              props.selectedShift.start
            ).getMinutes();

            if (startHours.value > 11) {
              if (startHours.value > 12) {
                startHours.value = startHours.value - 12;
              }
              startP.value = "PM";
            } else {
              startP.value = "AM";
            }

            startHours.value = ("0" + startHours.value).slice(-2);
            startMinutes.value = ("0" + startMinutes.value).slice(-2);
            startDateInput.value = new Date(
              props.selectedShift.start
            ).toLocaleDateString();
          }

          if (props.selectedShift.end) {
            endHours.value = new Date(props.selectedShift.end).getHours();
            endMinutes.value = new Date(props.selectedShift.end).getMinutes();

            endDate.value =
              new Date(props.selectedShift.end).getFullYear() +
              "-" +
              ("0" + (new Date(props.selectedShift.end).getMonth() + 1)).slice(
                -2
              ) +
              "-" +
              ("0" + new Date(props.selectedShift.end).getDate()).slice(-2);

            if (endHours.value > 11) {
              if (endHours.value > 12) {
                endHours.value = endHours.value - 12;
              }
              endP.value = "PM";
            } else {
              endP.value = "AM";
            }

            endHours.value = ("0" + endHours.value).slice(-2);
            endMinutes.value = ("0" + endMinutes.value).slice(-2);

            endDateInput.value = new Date(
              props.selectedShift.end
            ).toLocaleDateString();
          }
        }
      },
      { deep: true }
    );

    const saveEndDate = (date) => {
      endDate.value = date;
      endDateInput.value = formatDate(date);
      needsUpdate();
    };

    const saveStartDate = (date) => {
      startDate.value = date;
      startDateInput.value = formatDate(date);
      needsUpdate();
    };

    const formatDate = (date) => {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    };

    const applyChangesToShift = async () => {
      if (applyChangesOnExit.value) {
        if (startDate.value && startHours.value && startHours.value) {
          let adjustedHours = parseInt(startHours.value);
          let adjustedMinutes = parseInt(startMinutes.value);

          if (startP.value === "PM" && adjustedHours < 12) {
            adjustedHours = adjustedHours + 12;
          }

          let newStart = new Date(
            startDate.value.substring(0, 4),
            parseInt(startDate.value.substring(5, 7)) - 1,
            parseInt(startDate.value.substring(8, 10)),
            adjustedHours,
            adjustedMinutes
          );

          props.selectedShift.start = newStart.getTime();
        }

        if (endDate.value && endHours.value && endMinutes.value) {
          let adjustedHours = parseInt(endHours.value);
          let adjustedMinutes = parseInt(endMinutes.value);
          if (endP.value === "PM" && adjustedHours < 12) {
            adjustedHours = adjustedHours + 12;
          }
          let newEnd = new Date(
            endDate.value.substring(0, 4),
            parseInt(endDate.value.substring(5, 7)) - 1,
            parseInt(endDate.value.substring(8, 10)),
            adjustedHours,
            adjustedMinutes
          );

          props.selectedShift.end = newEnd.getTime();
        }
      }

      if (props.selectedShift.end && props.selectedShift.start) {
        props.selectedShift.duration =
          props.selectedShift.end - props.selectedShift.start;
      }

      let goodToGo = true;

      if (props.selectedShift.duration && props.selectedShift.duration < 0) {
        goodToGo = false;
      }

      if (goodToGo) {
        console.log("startStamp", props.selectedShift.start);
        console.log("start", new Date(props.selectedShift.start));
        console.log("end", new Date(props.selectedShift.end));
        await updateShift(props.selectedShift);
        internalDialog.value = false;
      }

      let boom = false;

      if (boom) {
        await updateShift(props.selectedShift);
      }
    };

    const needsUpdate = () => {
      applyChangesOnExit.value = true;
    };

    return {
      jobState,
      endDate,
      saveEndDate,
      formatDate,
      endTimeInput,
      endDateInput,
      startDate,
      startDateInput,
      startTimeInput,
      saveStartDate,
      applyChangesToShift,
      needsUpdate,
      internalDialog,
      startMinutes,
      startP,
      startHours,
      endMinutes,
      endHours,
      endP,
      applyChangesOnExit,
    };
  },
});
</script>
