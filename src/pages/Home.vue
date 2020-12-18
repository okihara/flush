<template>
  <div v-if="validUser">
    <div class="container">
      <section class="section">
        <div>
          <h2 class="title">あなたの部屋</h2>
          <ul>
            <li>
              <router-link v-if="myRoomId != 0" :to="'/rooms?roomId=' + myRoomId">あなたの部屋へ行く({{myRoomId}})</router-link>
              <span v-else>ロード中</span>
            </li>
          </ul>
        </div>
      </section>
      <section class="section">
        <div>
          <h2 class="title">あそべるゲーム</h2>
          <ul>
            <li>ゲームA</li>
            <li>ゲームB</li>
            <li>ゲームC</li>
            <li>ゲームD</li>
          </ul>
        </div>
      </section>
<!--      <section class="section">-->
<!--        <ul>-->
<!--          <li>-->
<!--            <router-link to="/rooms?roomId=8uD8sMlAYE8wYMzB0nFr">壱の部屋</router-link>-->
<!--          </li>-->
<!--          <li>-->
<!--            <router-link to="/rooms?roomId=rToPEp4234oofWTXXOqx">弐の部屋</router-link>-->
<!--          </li>-->
<!--          <li>-->
<!--            <router-link to="/rooms?roomId=h5W08iBvMCvhiRUHSbFa">参の部屋</router-link>-->
<!--          </li>-->
<!--          <li>-->
<!--            <router-link to="/rooms?roomId=EshKbuPTgK9L5jAuobsQ">肆の部屋</router-link>-->
<!--          </li>-->
<!--        </ul>-->
<!--      </section>-->
    </div>
  </div>
  <div class="container" v-else>
    <section class="section">
      <h2 class="title">友達の部屋に遊びに行こう</h2>
    </section>
  </div>
</template>

<script>
  const ctx = require('../main')


  export default {
    name: "Home",
    data: function () {
      return {
        myRoomId: 0
      }
    },
    methods: {
      findOrCreateRoom() {
        console.log(ctx.currentUser().uid)

        if(ctx.currentUser().isAnonymous) {
          return;
        }

        const myRoomQuery = ctx.db.collection('rooms').where('author_id', '==', ctx.currentUser().uid);
        myRoomQuery.get().then(value => {
          if (!value.empty) {
            console.log(value.docs[0].id);
            this.myRoomId = value.docs[0].id;
            return;
          }

          alert('部屋がないので作ります')

          // TODO: 切り出し
          // TODO: トランザクション
          // 部屋を作る
          ctx.db.collection('rooms').add({
            author_id: ctx.currentUser().uid,
            initials: [],
            name: ctx.currentUser().displayName + "の部屋"
          }).then(value1 => {
            this.myRoomId = value1.id;

            // カード追加
            value1.collection('cards').add({
              img_src: "https://kotoba-c3c67.web.app/images/default.png",
              back_img_src: "https://firebasestorage.googleapis.com/v0/b/kotoba-c3c67.appspot.com/o/back_img.png?alt=media&token=656002a4-d19f-472d-9ca8-ba6f088385af",
              pos: {
                top: -100,
                left: -150,
                "z-index": 100
              },
              state: 0,
              style: {
                boarder: "hidden",
                height: 200,
                width: 300
              },
              ownerId: "dummy"
            })
          });
        }).catch(reason => {
          alert(reason)
        });
      }
    },
    computed: {
      myRoomURL() {
        return this.$store.getters.myRoomURL;
      },
      validUser() {
        return this.$store.getters.loggedIn;
      }
    },
    mounted: function () {
      if (ctx.currentUser()) {
        this.findOrCreateRoom();
        return;
      }

      this.$store.subscribe(function (mutation, state) {
        if (mutation.type === 'setUser') {
          this.findOrCreateRoom();
        }
      }.bind(this))
    }
  }
</script>

<style scoped>

</style>
