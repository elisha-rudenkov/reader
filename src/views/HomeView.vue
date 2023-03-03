<template>
  <div class="home">
    <Transition name="login">
      <div class="login-wrap" v-show="test_visibility">
        <div class="login-box">
          <svg
            id="logo"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 170 118"
            fill="none"
          >
            <path
              d="M3 3C11.5132 18.8164 42.2054 88.509 54.0791 97.8982C65.9527 107.287 65.9527 57.6028 74.2419 59.3353C82.531 61.0679 97.037 117.347 103.814 108.293C110.591 99.2395 104.374 16.022 114.903 5.01198C125.433 -5.998 167.719 32.509 166.991 42.2335C166.263 51.9581 114.343 57.2116 110.535 63.3593C106.726 69.507 141.899 70.513 144.14 79.1198C146.38 87.7265 127.337 109.02 123.977 115"
              stroke="url(#paint0_linear_3_3)"
              stroke-width="5"
              stroke-linecap="round"
            />
            <defs>
              <linearGradient
                id="paint0_linear_3_3"
                x1="3"
                y1="3"
                x2="167"
                y2="3"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#FEBE58" />
                <stop offset="1" stop-color="#DE2BAE" />
              </linearGradient>
            </defs>
          </svg>
          <h2>welcome back</h2>
          <p>
            login to view your library or <span id="purple">skip</span> to open
            a book on your device
          </p>

          <button class="provider-btn" @click="signInWithGoogle()">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="24"
              viewBox="0 0 26 24"
              fill="none"
            >
              <path
                d="M23.5561 12.25C23.5561 11.47 23.4844 10.72 23.3511 10H12.7302V14.26H18.7993C18.5327 15.63 17.7331 16.79 16.5336 17.57V20.34H20.1935C22.3259 18.42 23.5561 15.6 23.5561 12.25Z"
                fill="#4285F4"
              />
              <path
                d="M12.7302 23C15.775 23 18.3277 22.02 20.1935 20.34L16.5336 17.57C15.529 18.23 14.2475 18.63 12.7302 18.63C9.79822 18.63 7.30703 16.7 6.41512 14.1H2.66296V16.94C4.51854 20.53 8.32196 23 12.7302 23Z"
                fill="#34A853"
              />
              <path
                d="M6.41512 14.09C6.18958 13.43 6.0563 12.73 6.0563 12C6.0563 11.27 6.18958 10.57 6.41512 9.91001V7.07001H2.66296C1.89407 8.55001 1.45325 10.22 1.45325 12C1.45325 13.78 1.89407 15.45 2.66296 16.93L5.58472 14.71L6.41512 14.09Z"
                fill="#FBBC05"
              />
              <path
                d="M12.7302 5.38C14.391 5.38 15.8673 5.94 17.0462 7.02L20.2756 3.87C18.3175 2.09 15.775 1 12.7302 1C8.32196 1 4.51854 3.47 2.66296 7.07L6.41512 9.91C7.30703 7.31 9.79822 5.38 12.7302 5.38Z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          <div class="separator">
            <div class="line"></div>
            <div class="or">or</div>
            <div class="line"></div>
          </div>

          <button class="gradient-btn" @click="skipLogin()">skip</button>
        </div>
      </div>
    </Transition>

    <Transition name="login"
      ><div class="signout-box" v-show="$store.state.signout_visible">
        <div class="signout">
          <div class="signout-text">
            <p>are you sure you want to sign out?</p>
          </div>
          <div class="controls">
            <button
              class="outlined-btn"
              @click="$store.state.signout_visible = false"
            >
              cancel
            </button>
            <button class="gradient-btn" @click="signOut()">sign out</button>
          </div>
        </div>
      </div></Transition
    >

    <addBookModal v-show="$store.state.adding_book"></addBookModal>
    <baseHeader :user_img_url="$store.state.user?.user_img_url"></baseHeader>

    <Transition name="main">
      <div class="hello" v-show="!test_visibility">
        <h1>
          {{ greeting() }}
        </h1>

        <p v-if="$store.state.books.length > 0">
          what adventure are we going on today?
        </p>
        <p v-else>looks like you don't have any books yet</p>
      </div>
    </Transition>
    <Transition name="main">
      <div class="no-books" v-show="!test_visibility">
        <img
          src="../assets/no-books.svg"
          v-if="$store.state.books.length == 0"
        />

        <button
          class="gradient-btn"
          @click="$store.commit('setAddingBook', true)"
        >
          open a new book
        </button>
      </div>
    </Transition>

    <div class="books" v-if="$store.state.books.length > 0">
      <h3>
        {{ $store.state.books.length > 0 ? "your library" : "" }}
      </h3>
      <bookCard
        v-for="book in $store.state.books"
        :key="book.id"
        :author="book.author"
        :title="book.title"
        :base64_img="book.image"
        :book_id="book.id"
        :total_chapters="book.total_chapters"
        :progress="book.progress"
      >
      </bookCard>
    </div>

    <div class="books" v-if="$store.state.local_books.length > 0">
      <h3>
        {{ $store.state.local_books.length > 0 ? "local books" : "" }}
      </h3>
      <bookCard
        v-for="book in $store.state.local_books"
        :key="book.id"
        :author="book.author"
        :title="book.title"
        :base64_img="book.image"
        :book_id="book.id"
        :total_chapters="book.total_chapters"
        :progress="book.progress"
      >
      </bookCard>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { auth, db } from "@/main";

import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

import { setDoc, doc, getDocs, collection } from "firebase/firestore";
import baseHeader from "@/components/base-header.vue";
import addBookModal from "@/components/add-book-modal.vue";
import bookCard from "@/components/book-card.vue";

export default defineComponent({
  name: "HomeView",
  components: { baseHeader, addBookModal, bookCard },
  data() {
    return {
      scroll_position: 0,
      signout_visible: false,
      test_visibility: true,
    };
  },
  methods: {
    async loadLibrary() {
      if (!auth.currentUser) return;

      const querySnapshot = await getDocs(
        collection(db, `users/${auth.currentUser.uid}/books`)
      );

      querySnapshot.forEach((doc) => {
        let temp = doc.data();
        temp.id = doc.id;
        //check if the book is already in the library
        let book = this.$store.state.books.find((book: any) => book.id == temp.id);
        if (!book) {
          this.$store.commit("addBook", temp);
        }
      });
    },
    greeting(): string {
      let username = "guest";
      if (auth.currentUser?.displayName) {
        username = auth.currentUser.displayName.split(" ")[0];
        if (!username) {
          username = auth.currentUser.displayName;
        }
      }
      let greetings = {
        morning: [
          "good morning",
          "here's your latte",
          "aloha kakahiaka",
          "bonjour",
          "hi",
        ],
        afternoon: ["good afternoon", "good day", "hi"],
        evening: ["good evening", "hello", "good night", "bonne nuit"],
      };

      //say hello to the user based on local time
      let date = new Date();
      let hour = date.getHours();
      let greeting = "hi";
      // return a random greeting from the appropriate array
      if (hour < 12) {
        greeting =
          greetings.morning[
            Math.floor(Math.random() * greetings.morning.length)
          ];
      } else if (hour < 18) {
        greeting =
          greetings.afternoon[
            Math.floor(Math.random() * greetings.afternoon.length)
          ];
      } else {
        greeting =
          greetings.evening[
            Math.floor(Math.random() * greetings.evening.length)
          ];
      }

      return `${greeting}, ${username}`;
    },
    skipLogin() {
      this.test_visibility = !this.test_visibility;
    },
    signOut() {
      auth.signOut();
      this.$store.commit("setUser", null);
      this.$store.state.signout_visible = false;
      this.$store.state.books = [];
      this.$store.state.local_books = [];
      this.test_visibility = true;
    },
    async signInWithGoogle() {
      /*  if (this.$store.state.user) {
        console.log("already signed in");
        return;
      } */
      const provider = new GoogleAuthProvider();
      try {
        let result = await signInWithPopup(auth, provider);
        this.$store.commit("setUser", result.user);
        this.loadLibrary();
        await setDoc(
          doc(db, `users`, result.user.uid),
          {
            username: result.user.displayName,
            email: result.user.email,
            user_img_url: result.user.photoURL,
          },
          { merge: true }
        );
        this.test_visibility = false;
      } catch (error) {
        console.log(error);
      }
    },
  },

  mounted() {
    this.greeting();
    if (auth.currentUser) {
      this.test_visibility = false;
      this.loadLibrary();
    }
  },

  computed: {
    username(): string {
      if (auth.currentUser?.displayName) {
        return auth.currentUser.displayName;
      } else {
        return "Guest";
      }
    },
    isLoggedIn(): boolean {
      console.log(this.$store.state.user ? true : false);
      return this.$store.state.user ? false : true;
    },
  },
});
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
  background-color: var(--bg);
  padding: 0 20px;
  box-sizing: border-box;
  padding-top: 6rem;
  gap: 2rem;
}

.login-wrap {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 1;
  background: var(--bg);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.login-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 26%;
  gap: 10px;

  #logo {
    width: 14rem;
  }

  h2 {
    all: unset;
    font-style: normal;
    font-weight: 500;
    font-size: 36px;
    line-height: 54px;
    /* identical to box height */
    text-align: left;
    color: var(--text-color);
  }

  p {
    margin: 14px;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    text-align: left;
    color: #8b8b8b;
    max-width: 260px;
  }

  #purple {
    background: #df2fac;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
    font-weight: 800;
  }

  .provider-btn {
    all: unset;
    cursor: pointer;
    display: flex;
    gap: 11px;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 10px 20px;

    border: 1px solid var(--text-color);
    box-sizing: border-box;
    border-radius: 5px;

    font-weight: 500;
    font-size: 18px;
    line-height: 27px;
    /* identical to box height */

    color: var(--text-color);

    svg {
      width: 24px;
    }
  }

  .separator {
    margin: 20px 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    font-weight: 500;
    font-size: 18px;
    line-height: 27px;

    color: var(--text-color);

    .line {
      width: 50%;
      max-width: 100px;
      height: 2px;
      background: var(--text-color);
    }
  }
}

//animations
.login-enter-active,
.login-leave-active {
  transition: all 0.5s ease-in-out;
}
.login-enter,
.login-leave-to {
  transform: translateY(-100%);
}

.login-enter-from,
.login-leave-to {
  transform: translateY(-100%);
}

//slide from top
.main-enter-active,
.main-leave-active {
  transition: all 0.2s ease-in-out;
}

.main-enter,
.main-leave-to {
  transform: translateY(-100%);
}

.main-enter-from,
.main-leave-to {
  transform: translateY(-100%);
}

.hello {
  display: flex;
  flex-direction: column;

  align-items: flex-start;
  justify-content: center;
  width: 100%;

  h1 {
    all: unset;
    font-style: normal;
    font-weight: 300;
    font-size: 36px;
    line-height: 54px;
    /* identical to box height */

    color: var(--text-color);
  }

  p {
    all: unset;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    /* identical to box height */

    color: #8b8b8b;
  }
}

.no-books {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 42px;
}

.books {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 20px;
  max-width: 600px;

  h3 {
    all: unset;
    width: 100%;
    text-align: left;
    font-style: normal;
    font-weight: 400;
    font-size: 30px;
    line-height: 36px;
    /* identical to box height */
    margin: 1rem 0;
    color: var(--text-color);
  }
}

.controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 400px;
  gap: 10px;
}
.signout-box {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 1;
  background: var(--bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .signout {
    padding: 15px;
    border-radius: 5px;
    background: var(--bg);
    color: var(--text-color);
    font-weight: 500;
    font-size: 18px;
    line-height: 27px;
    width: 60%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;

    p {
      font-style: normal;
      font-weight: 500;
      font-size: 20px;
      line-height: 24px;
      /* identical to box height */

      color: var(--text-color);
    }
  }
}
//media query for mobile
@media (max-width: 768px) {
}
</style>
