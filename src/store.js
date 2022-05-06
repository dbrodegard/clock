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
Vue.use(VueCompositionAPI);

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
  person: {},
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

  const q = query(
    shiftsRef,
    where("open", "==", true),
    where("person", "==", personReference)
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    let task = doc.data();
    task.reference = doc.id;
    state.selectedPersonOpenTasks.push(task);
  });
};

export const updateShift = async (shift) => {
  console.log("updating shift", shift);
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
  await setDoc(doc(state.db, "project", project.reference), project);
};

export const initialize = () => {
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
  });

  const a = query(
    collection(state.db, "projects"),
    where("active", "==", true)
  );
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
  });

  const c = query(collection(state.db, "shifts"), orderBy("start", "desc"));
  onSnapshot(c, (querySnapshot) => {
    state.shifts = [];
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
  });

  return true;
};

export default {};
