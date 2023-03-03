<template>
  <div class="footer">
    <Transition name="settings">
      <div class="settings" v-show="$store.state.text_settings_visible">
        <div class="setting">
          padding
          <div class="controls">
            <button @click="updatePadding(-1)">
              <svg
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                <path d="M8 12h8"></path>
              </svg>
            </button>
            <span>{{ $store.state.text_padding }}</span>
            <button @click="updatePadding(1)">
              <svg
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                <path d="M12 8v8"></path>
                <path d="M8 12h8"></path>
              </svg>
            </button>
          </div>
        </div>
        <div class="divider"></div>
        <div class="setting">
          line height
          <div class="controls">
            <button @click="updateLineHeight(-0.2)">
              <svg
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                <path d="M8 12h8"></path>
              </svg>
            </button>
            <span>{{
              Math.round($store.state.text_line_height * 10) / 10
            }}</span>
            <button @click="updateLineHeight(0.2)">
              <svg
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                <path d="M12 8v8"></path>
                <path d="M8 12h8"></path>
              </svg>
            </button>
          </div>
        </div>
        <div class="divider"></div>
        <div class="setting">
          <select name="Font" id="" v-model="$store.state.text_font">
            <option value="Inter, sans-serif">Inter</option>
            <option value="Poppins, sans-serif" default>Poppins</option>
            <option value="Roboto, sans-serif">Roboto</option>
          </select>
          <div class="controls">
            <button @click="updateFontSize(-1)">
              <svg
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                <path d="M8 12h8"></path>
              </svg>
            </button>
            <span>{{ $store.state.text_font_size }}</span>
            <button @click="updateFontSize(1)">
              <svg
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                <path d="M12 8v8"></path>
                <path d="M8 12h8"></path>
              </svg>
            </button>
          </div>
        </div>
        <div class="divider"></div>
        <button class="reset" @click="$store.commit('resetAllTextSettings')">
          Reset
        </button>
      </div>
    </Transition>
    <button class="back" @click="$store.state.book_contents_visible = true">
      <svg
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M8 6h13"></path>
        <path d="M8 12h13"></path>
        <path d="M8 18h13"></path>
        <path d="M3 6h.01"></path>
        <path d="M3 12h.01"></path>
        <path d="M3 18h.01"></path>
      </svg>
    </button>

    <div class="stats">
      <div class="progress-bar" v-show="!is_local">
        <Transition name="progress">
          <div
            class="progress"
            :style="{ width: $store.state.scroll_progress + '%' }"
          ></div>
        </Transition>
      </div>
      <div class="bottom">
        {{ chapter_title }}
        <span> {{ $store.state.scroll_progress }}%</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
//firestore doc update
import { db, auth } from "@/main";
import { updateDoc, doc, collection } from "@firebase/firestore";
export default defineComponent({
  data() {
    return {};
  },
  props: {
    chapter_title: {
      type: String,
      required: true,
    },
    total_chapters: {
      type: Number,
      required: true,
    },
    progress: {
      type: Number,
      required: true,
    },
  },
  methods: {
    getBookProgress() {
      //obsolete
      /*  if (this.total_chapters == 0) return 0;
      return Math.round((this.progress / this.total_chapters) * 100); */
    },
    updatePadding(value: number) {
      if (this.$store.state.text_padding + value < 0) return;
      this.$store.commit("setTextPadding", this.$store.state.text_padding + value);
      //save to Firestore

      let book_id = this.$route.params.id.toString();
      console.log(`book id: ${book_id}`);
      
      if (book_id.startsWith("local_")) return;

      let user = auth.currentUser;
      if (user) {
        let docRef = doc(collection(db, `users`), user.uid);
        updateDoc(docRef, {
          text_padding: this.$store.state.text_padding,
        });
      }


     
    },
    updateLineHeight(value: number) {
      if (this.$store.state.text_line_height + value < 1) return;

      this.$store.commit("setTextLineHeight", this.$store.state.text_line_height + value);

      //save to Firestore
      let book_id = this.$route.params.id.toString();
      if (book_id.startsWith("local_")) return;

      let user = auth.currentUser;
      if (user) {
        let docRef = doc(collection(db, `users`), user.uid);
        updateDoc(docRef, {
          text_line_height: this.$store.state.text_line_height,
        });
      }
    },
    updateFontSize(value: number) {
      if (this.$store.state.text_font_size + value < 1) return;

      this.$store.commit("setTextFontSize", this.$store.state.text_font_size + value);

      //save to Firestore
      let book_id = this.$route.params.id.toString();
      if (book_id.startsWith("local_")) return;

      let user = auth.currentUser;
      if (user) {
        let docRef = doc(collection(db, `users`), user.uid);
        updateDoc(docRef, {
          text_font_size: this.$store.state.text_font_size,
        });
      }

    },
  },
  computed: {
    is_local() {
      //get id from url
      let book_id = this.$route.params.id.toString();
      if (book_id.startsWith("local_")) return true;
      return false;
    },
  },
  setup() {
    return {};
  },
});
</script>

<style lang="scss" scoped>
select {
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  appearance: none;
  // Additional resets for further consistency
  background-color: transparent;
  border: none;
  padding: 0 1em 0 0;
  margin: 0;
  width: 100%;
  font-family: inherit;
  font-size: inherit;
  cursor: inherit;
  line-height: inherit;
  text-transform: lowercase;
  &:focus {
    outline: 2px solid #000;
    border-radius: 2px;
  }
}

.footer {
  background-color: var(--bg);
  padding: 15px;
  box-sizing: border-box;
  display: flex;
  gap: 10px;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  box-sizing: border-box;
  max-width: 650px;
}

.settings {
  background-color: var(--bg);

  padding: 30px;
  padding-top: 30px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  box-sizing: border-box;
  z-index: 9999;
  box-shadow: 0px -4px 12px -2px rgb(0 0 0 / 25%);
  border-radius: 22px 22px 0px 0px;
  flex-direction: column;
  max-width: 650px;
}

.back {
  background-color: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  margin-bottom: 10px;
  transition: all 0.2s ease-in-out;
  svg {
    stroke: var(--text-color);
  }

  &:hover {
    background-color: var(--bg);
  }
}

.stats {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  gap: 3px;
  .bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    font-style: normal;
    font-weight: 400;
    font-size: 13px;
    line-height: 16px;

    color: var(--text-color);
  }
}

.progress-bar {
  margin-top: auto;
  width: 100%;
  height: 9px;
  background: #e5e5e5;
  border-radius: 2px;
  position: relative;
  display: flex;
  justify-content: space-between;
  border-radius: 5px;

  .progress {
    height: 100%;
    background: linear-gradient(270deg, #e035a9 -14.58%, #fdbb5a 98.61%);
    border-radius: 5px;
  }
}

.settings-enter-active,
.settings-leave-active {
  transition: all 0.2s ease-in-out;
}

.settings-enter,
.settings-leave-to {
  transform: translateY(-100%);
}

.settings-enter-from,
.settings-leave-to {
  transform: translateY(100%);
}

.setting {
  display: flex;
  gap: 10px;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  text-transform: lowercase;
  font-weight: 400;
  font-size: 18px;
  /* or 27px */

  color: var(--text-color);

  span {
    background: #000000;
    border-radius: 4px;
    font-weight: 500;
    font-size: 15px;
    line-height: 149.02%;
    /* identical to box height, or 22px */
    padding: 3px 9px;
    color: #ffffff;
  }

  select{
    color: var(--text-color);

    option{
      color: var(--text-color);
      background: var(--bg);

      padding: 10px 0;
    }
  }

  svg{
    stroke: var(--text-color);

  }
}

.controls {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  button {
    background-color: transparent;
    border: none;
    outline: none;
    cursor: pointer;
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    transition: all 0.2s ease-in-out;
    &:hover {
      background-color: var(--bg);
    }

    svg {
      width: 36px;
      height: 36px;
    }
  }
}

.divider {
  width: 100%;
  height: 0px;
  border-radius: 5px;
  border: 3px solid var(--text-color);
  margin: 6px 0 20px 0;
}

.reset {
  display: flex;
  justify-content: center;
  padding: 10px 20px;
  border-radius: 5px;
  background: var(--text-color);
  color: var(--bg);
  font-weight: 700;
  font-size: 15px;
  width: 100%;
}




</style>
