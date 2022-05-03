import Vue from "vue";
import VueCompositionAPI from "@vue/composition-api";
import { collection, query, onSnapshot } from "firebase/firestore";
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
});
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

  const db = getFirestore(app);

  const q = query(collection(db, "people"));
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

  const a = query(collection(db, "projects"));
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

  const c = query(collection(db, "shifts"));
  onSnapshot(c, (querySnapshot) => {
    state.shifts = [];
    querySnapshot.forEach((doc) => {
      state.shifts.push(doc.data());
    });
  });
};

export default {};
