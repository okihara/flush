import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

import * as firebase from 'firebase'

Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(Buefy);

const App = require('./App.vue').default;
const Home = require('./pages/Home.vue').default;
const Map = require('./pages/Map.vue').default;

export let db: firebase.firestore.Firestore;

$(() => {
    initializeFirebase();

    const routes = [
        {path: '/', component: Home},
        {path: '/maps', component: Map}
    ];

    const router = new VueRouter({routes});

    const app = new Vue({
        router,
        render: h => h(App)
    }).$mount("#app")
});

function initializeFirebase() {
    // Your web app's Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyCrvRCVIl7WHsO06OJkI_xx7ST_cvlFK5M",
        authDomain: "flush-5e9e1.firebaseapp.com",
        projectId: "flush-5e9e1",
        storageBucket: "flush-5e9e1.appspot.com",
        messagingSenderId: "999120840801",
        appId: "1:999120840801:web:6feafa81ac03c5ff64e220"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    //
    db = firebase.firestore();
}
