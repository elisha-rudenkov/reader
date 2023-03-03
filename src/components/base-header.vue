<template>
  <div class="header">
    <div class="user">
      <img :src="img_url" @click="openLogout()" alt="user" />
    </div>
    <div class="logo">
      <img src="../assets/logo-png.png" alt="" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { auth } from "@/main";
export default defineComponent({
  methods: {
    openLogout() {
      if (auth.currentUser) {
        this.$store.state.signout_visible = true;
      }
    },
  },
  computed: {
    img_url(): string {
      if (this.$store.state.user && this.$store.state.user.photoURL) {
        return this.$store.state.user.photoURL;
      } else {
        //get random number
        let random_num = Math.random();
        return `https://api.dicebear.com/5.x/personas/svg?seed=${random_num}&backgroundColor=c0aede`;
      }
    },
  },
  setup() {
    return {};
  },
});
</script>

<style lang="scss" scoped>
.header {
  background-color: var(--bg);
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  box-sizing: border-box;
  max-width: 850px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  img {
    width: 46px;
  }
}

.user {
  display: flex;
  align-items: center;
  gap: 10px;
  img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
  }
}
</style>
