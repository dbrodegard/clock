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
  projectDict: {},
  projects: [],
  shifts: [],
  tasks: [],
  taskDict: {},
  selectedPersonOpenTasks: [],
  db: null,
});

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
  await addDoc(collection(state.db, "shifts"), shift);
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
  console.log("initializing");
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

  const q = query(collection(state.db, "people"), where("active", "==", true));
  onSnapshot(q, (querySnapshot) => {
    state.people = [];
    state.personDict = {};
    querySnapshot.forEach((doc) => {
      let person = doc.data();
      person.reference = doc.id;
      state.personDict[person.reference] = person;
      state.people.push(person);
    });
  });

  const a = query(
    collection(state.db, "projects"),
    where("active", "==", true)
  );
  onSnapshot(a, (querySnapshot) => {
    state.projects = [];
    state.projectsDict = {};
    querySnapshot.forEach((doc) => {
      let project = doc.data();
      project.reference = doc.id;
      state.projectDict[project.reference] = project;
      state.projects.push(project);
    });
  });

  const c = query(
    collection(state.db, "shifts"),

    // where("hidden", "!=", true),
    // orderBy("hidden", "desc"),
    orderBy("start", "desc")
  );
  onSnapshot(c, (querySnapshot) => {
    state.shifts = [];
    querySnapshot.forEach((doc) => {
      state.shifts.push(doc.data());
    });
  });

  const t = query(collection(state.db, "tasks"), where("active", "==", true));
  onSnapshot(t, (querySnapshot) => {
    state.tasks = [];
    state.taskDict = {};
    querySnapshot.forEach((doc) => {
      let task = doc.data();
      task.reference = doc.id;
      state.taskDict[task.reference] = task;
      state.tasks.push(task);
    });
  });
};

export default {};
