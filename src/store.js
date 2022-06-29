import Vue from "vue";
import VueCompositionAPI from "@vue/composition-api";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  where,
  getDocs,
  setDoc,
  doc,
  orderBy,
} from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { reactive } from "@vue/composition-api";
import * as XLSX from "xlsx";

Vue.use(VueCompositionAPI);

export const writeToCSV = (shifts) => {
  console.log("should be adding shifts", shifts);

  const createCsvWriter = require("csv-writer").createObjectCsvWriter;
  const csvWriter = createCsvWriter({
    path: "path/to/file.csv",
    header: [
      { id: "name", title: "NAME" },
      { id: "lang", title: "LANGUAGE" },
    ],
  });

  const records = [
    { name: "Bob", lang: "French, English" },
    { name: "Mary", lang: "English" },
  ];

  csvWriter
    .writeRecords(records) // returns a promise
    .then(() => {
      console.log("...Done");
    });
};

export function createActivitySpreadsheet(cleanArray) {
  let arrayForExport = [];

  cleanArray.forEach((shift) => {
    let objectForReturn = {};
    let person = shift.person;

    if (state.fullPeopleDict[shift.person]) {
      person =
        state.fullPeopleDict[shift.person].firstName +
        " " +
        state.fullPeopleDict[shift.person].lastName;
    }

    objectForReturn.person = person;

    let project = shift.project;

    if (state.fullProjectsDict[shift.project]) {
      project = state.fullProjectsDict[shift.project].name;
    }

    objectForReturn.project = project;

    let task = shift.task;

    if (state.fullTasksDict[shift.task]) {
      task = state.fullTasksDict[shift.task].name;
    }

    objectForReturn.task = task;

    objectForReturn.start =
      new Date(shift.start).toLocaleDateString() +
      " " +
      new Date(shift.start).toLocaleTimeString();

    objectForReturn.end = "";

    if (shift.end) {
      objectForReturn.end =
        new Date(shift.end).toLocaleDateString() +
        " " +
        new Date(shift.end).toLocaleTimeString();
    }

    objectForReturn.duration = "";

    if (shift.duration) {
      objectForReturn.duration = msToMinutesAndSeconds(shift.duration);
    }

    arrayForExport.push(objectForReturn);
  });

  let goOn = true;

  if (goOn) {
    const worksheet = XLSX.utils.json_to_sheet(arrayForExport);

    XLSX.utils.sheet_add_aoa(
      worksheet,
      [["Person", "Project", "Task", "Start", "End", "Duration"]],
      { origin: "A1" }
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Shift Report");

    let dateExported = new Date().toLocaleDateString();
    let timeExported = new Date().toLocaleTimeString();

    XLSX.writeFile(
      workbook,
      "Shift Report " + dateExported + " " + timeExported + ".xlsb"
    );
  }
}

export const state = reactive({
  people: [],
  peopleDict: {},
  projectsDict: {},
  projects: [],
  shifts: [],
  tasks: [],
  taskDict: {},
  fullPeopleDict: null,
  fullProjectsDict: {},
  fullTasksDict: {},
  storedPerson: null,
  openShiftsByPerson: null,
  db: null,
});

export const storedSettings = reactive({
  person: null,
});

export const employees = reactive({});

export const addNewPerson = async (person) => {
  await addDoc(collection(state.db, "people"), person);
};

export const addNewProject = async (project) => {
  await addDoc(collection(state.db, "projects"), project);
};

export const addNewTask = async (task) => {
  await addDoc(collection(state.db, "tasks"), task);
};

export const addNewShift = async (shift) => {
  return await addDoc(collection(state.db, "shifts"), shift);
};

export const getOpenTasks = async (personReference) => {
  console.log("getting open tasks", personReference);
  state.selectedPersonOpenTasks = [];
  const shiftsRef = collection(state.db, "shifts");

  const q = query(shiftsRef, where("open", "==", true));
  const querySnapshot = await getDocs(q);

  let localShifts = {};
  querySnapshot.forEach((doc) => {
    let shift = doc.data();
    shift.reference = doc.id;
    if (shift.open) {
      localShifts[shift.person] = shift;
    }
    state.shifts.push(shift);
  });

  state.openShiftsByPerson = localShifts;
};

export const updateShift = async (shift) => {
  await setDoc(doc(state.db, "shifts", shift.reference), shift);
};

export const updateTask = async (task) => {
  await setDoc(doc(state.db, "tasks", task.reference), task);
};

export const updatePerson = async (person) => {
  console.log("removing person here too", person);
  await setDoc(doc(state.db, "people", person.reference), person);
};

export const updateProject = async (project) => {
  await setDoc(doc(state.db, "projects", project.reference), project);
};

export function msToMinutesAndSeconds(ms) {
  if (!ms) return "00:00:00";
  let seconds = Math.floor((ms / 1000) % 60);
  let minutes = Math.floor((ms / (1000 * 60)) % 60);
  let hours = Math.floor(ms / (1000 * 60 * 60));
  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds;
}

let shiftWatcher;

export const watchShifts = () => {
  console.log("watching the shifts");
  const c = query(collection(state.db, "shifts"), orderBy("start", "desc"));
  shiftWatcher = onSnapshot(c, (querySnapshot) => {
    state.shifts = [];
    querySnapshot.forEach((doc) => {
      let shift = doc.data();
      shift.reference = doc.id;
      state.shifts.push(shift);
    });
  });
};

export const unwatchShifts = () => {
  shiftWatcher();
};

export const initialize = async () => {
  let rememberedEmployee = localStorage.getItem("selectedPersonReference");
  const firebaseConfig = {
    apiKey: "AIzaSyDTiJAB4djq-6cSu8Zkrmt2uvhpTNwVoMc",
    authDomain: "legaldocs-d3265.firebaseapp.com",
    projectId: "legaldocs-d3265",
    storageBucket: "legaldocs-d3265.appspot.com",
    messagingSenderId: "584236907661",
    appId: "1:584236907661:web:0d836fdc2f8960ac9c36c4",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  state.db = getFirestore(app);

  const q = query(collection(state.db, "people"));
  onSnapshot(q, (querySnapshot) => {
    state.people = [];
    state.personDict = {};
    state.fullPeopleDict = {};
    querySnapshot.forEach((doc) => {
      let person = doc.data();
      person.reference = doc.id;
      state.fullPeopleDict[person.reference] = person;
      employees[person.reference] = person;
      if (rememberedEmployee === person.reference) {
        storedSettings.person = person;
      }
      if (person.active) {
        state.personDict[person.reference] = person;
        state.people.push(person);
      }
    });

    state.people.sort(function (a, b) {
      return a.lastName.localeCompare(b.lastName);
    });
  });

  const a = query(collection(state.db, "projects"));
  onSnapshot(a, (querySnapshot) => {
    state.projects = [];
    state.projectsDict = {};
    state.fullProjectsDict = {};
    querySnapshot.forEach((doc) => {
      let project = doc.data();
      project.reference = doc.id;
      state.fullProjectsDict[project.reference] = project;
      if (project.active) {
        state.projectsDict[project.reference] = project;
        state.projects.push(project);
      }
    });

    state.projects.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
  });

  const t = query(collection(state.db, "tasks"));
  onSnapshot(t, (querySnapshot) => {
    state.tasks = [];
    state.taskDict = {};
    state.fullTasksDict = {};
    querySnapshot.forEach((doc) => {
      let task = doc.data();
      task.reference = doc.id;
      state.fullTasksDict[task.reference] = task;
      if (task.active) {
        state.taskDict[task.reference] = task;
        state.tasks.push(task);
      }
    });

    state.tasks.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
  });

  const shiftsRef = collection(state.db, "shifts");

  const m = query(shiftsRef, where("open", "==", true));
  const querySnapshot = await getDocs(m);

  let localShifts = {};
  querySnapshot.forEach((doc) => {
    let shift = doc.data();
    shift.reference = doc.id;
    if (shift.open) {
      localShifts[shift.person] = shift;
    }
    state.shifts.push(shift);
  });

  state.openShiftsByPerson = localShifts;

  return true;
};

export default {};
