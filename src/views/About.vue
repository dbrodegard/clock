<template>
  <v-container class="pt-4">
    <v-card flat outlined class="mb-4" rounded="lg">
      <v-row class="pr-3" no-gutters align="center" justify="space-between">
        <v-card-title
          ><v-icon class="mr-3">mdi-account</v-icon> Team Members
        </v-card-title>
        <v-dialog v-model="newPersonDialog" max-width="400px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn depressed color="primary" dark v-bind="attrs" v-on="on">
              Add
            </v-btn>
          </template>
          <v-card class="py-2">
            <v-card-title>
              <span class="text-h5">Person</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="newPerson.firstName"
                      label="First Name"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="newPerson.lastName"
                      label="LastName"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="(newPersonDialog = false), resetNewPerson()"
              >
                Cancel
              </v-btn>
              <v-btn color="blue darken-1" text @click="submitNewPerson()">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
      <v-data-table :headers="peopleHeaders" :items="jobState.people">
        <template v-slot:item.lastName="{ item }">
          {{ item.firstName }} {{ item.lastName }}
        </template>
        <template v-slot:item.action="{ item }">
          <v-row no-gutters justify="center">
            <v-btn @click="removePerson(item)" icon
              ><v-icon>mdi-close</v-icon></v-btn
            >
          </v-row>
        </template>
      </v-data-table>
    </v-card>
    <v-card flat outlined class="mb-4" rounded="lg">
      <v-row class="pr-3" no-gutters align="center">
        <v-card-title
          ><v-icon class="mr-2">mdi-office-building</v-icon> Projects
        </v-card-title>
        <v-spacer />
        <v-dialog v-model="newProjectDialog" max-width="400px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn depressed color="primary" dark v-bind="attrs" v-on="on">
              Add
            </v-btn>
          </template>
          <v-card class="py-2">
            <v-card-title>
              <span class="text-h5">Project</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row no-gutters>
                  <v-col cols="12">
                    <v-text-field
                      v-model="newProject.name"
                      label="Display Name"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6" sm="6">
                    <v-text-field
                      v-model="newProject.client"
                      label="Client"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="6" sm="6">
                    <v-text-field
                      v-model="newProject.claimID"
                      label="Claim ID"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="(newProjectDialog = false), resetNewProject()"
              >
                Cancel
              </v-btn>
              <v-btn color="blue darken-1" text @click="submitNewProject()">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
      <v-data-table :headers="projectHeaders" :items="jobState.projects">
        <template v-slot:item.name="{ item }">
          {{ item.name }}
        </template>
        <template v-slot:item.action="{ item }">
          <v-row no-gutters justify="center">
            <v-btn @click="removeProject(item)" icon
              ><v-icon>mdi-close</v-icon></v-btn
            >
          </v-row>
        </template>
      </v-data-table>
    </v-card>

    <v-card flat outlined class="mb-4" rounded="lg">
      <v-row no-gutters class="pr-3" align="center">
        <v-card-title
          ><v-icon class="mr-2">mdi-clock</v-icon> Tasks
        </v-card-title>
        <v-spacer />
        <v-dialog v-model="newTaskDialog" max-width="400px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn depressed color="primary" dark v-bind="attrs" v-on="on">
              Add
            </v-btn>
          </template>
          <v-card class="py-2">
            <v-card-title>
              <span class="text-h5">Task</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row no-gutters>
                  <v-col cols="12">
                    <v-text-field
                      v-model="newTask.name"
                      label="Display Name"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="(newTaskDialog = false), resetNewTask()"
              >
                Cancel
              </v-btn>
              <v-btn color="blue darken-1" text @click="submitNewTask()">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
      <v-data-table :headers="taskHeaders" :items="jobState.tasks">
        <template v-slot:item.action="{ item }">
          <v-row no-gutters justify="center">
            <v-btn @click="removeTask(item)" icon
              ><v-icon>mdi-close</v-icon></v-btn
            >
          </v-row>
        </template>
      </v-data-table>
    </v-card>
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
  updatePerson,
} from "@/store.js";
import { defineComponent, onMounted, ref } from "@vue/composition-api";

export default defineComponent({
  setup() {
    const newPersonDialog = ref(false);
    const newProjectDialog = ref(false);
    const selectedPerson = ref(null);
    const selectedProject = ref(null);
    const newTaskDialog = ref(false);

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
      {
        text: "Remove",
        align: "center",
        sortable: false,
        value: "action",
        width: 100,
      },
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
      name: null,
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
      if (newProject.value.name && newProject.value.name !== "") {
        newProjectDialog.value = false;
        await addNewProject(newProject.value);
        resetNewProject();
      }
    };

    const submitNewTask = async () => {
      if (newTask.value.nme && newTask.value.name !== "") {
        newTaskDialog.value = false;
        await addNewTask(newTask.value);
        resetNewTask();
      }
    };

    const submitNewPerson = async () => {
      if (newPerson.value.lastName && newPerson.value.lastName !== "") {
        newPersonDialog.value = false;
        await addNewPerson(newPerson.value);
        resetNewPerson();
      }
    };

    const removePerson = async (person) => {
      person.active = false;
      await updatePerson(person);
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
      removePerson,
      removeProject,
      removeTask,
      newTaskDialog,
    };
  },
});
</script>
