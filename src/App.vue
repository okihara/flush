<template>
  <section type="section">
<!--    <b-navbar type="is-white" style="padding: 4px;">-->
<!--      <template slot="start">-->
<!--        <b-navbar-item tag="router-link" :to="{ path: '/' }">-->
<!--          Flush ver.0.10000000-->
<!--        </b-navbar-item>-->
<!--      </template>-->
<!--    </b-navbar>-->

    <router-view></router-view>

<!--    <div id="my-progress" class="modal is-active">-->
<!--      <div class="modal-background"></div>-->
<!--      <div class="modal-content" style="width:640px;">-->
<!--        <progress class="progress is-large is-success" max="100">60%</progress>-->
<!--      </div>-->
<!--    </div>-->
  </section>
</template>

<script>
const ctx = require("./main")

export default {
  name: "App",
  data() {
    return {
      user: null
    }
  },
  methods: {
    twitterLogin() {
      // this.$buefy.dialog.alert('Everything looks fine!')

      const provider = new firebase.auth.TwitterAuthProvider();
      firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
        // You can use these server side with your app's credentials to access the Twitter API.
        const token = result.credential.accessToken;
        const secret = result.credential.secret;
        // The signed-in user info.
        const user = result.user;
        // ...
      }).catch(function (error) {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        const credential = error.credential;
        // ...
        alert('twitter login failed: ' + errorMessage)
      });
    },
    twitterLogout() {
      firebase.auth().signOut();
    }
  },
  computed: {
    displayName: function () {
      if (!this.user) {
        return 'loading...';
      }

      return this.user.isAnonymous ? '名無しさん' : this.user.displayName;
    },
    photoURL: function () {
      if (!this.user || this.user.isAnonymous || !this.user.photoURL) {
        return "https://bulma.io/images/placeholders/128x128.png";
      }

      return this.user.photoURL;
    },
    loggedIn: function () {
      if (!this.user) {
        return false;
      }

      return !this.user.isAnonymous;
    },
    userId: function () {
      if (!this.user) {
        return '...';
      }

      return this.user.uid;
    }
  },
  beforeMount: function () {
    // ctx.auth((user) => {
    //   // TODO: iwakan
    //   this.user = user;
    //   this.$store.commit('setUser', user);
    // })
  },
}
</script>