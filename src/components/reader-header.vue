<template>
  <div class="header">
    <Transition name="contents">
      <div class="contents" v-show="$store.state.book_contents_visible">
        <div
          class="header"
          :style="{
            justifyContent: 'flex-start !important',
            gap: '1rem',
          }"
        >
          <button
            class="back"
            @click="$store.state.book_contents_visible = false"
          >
            <svg
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="m15 18-6-6 6-6"></path>
            </svg></button
          >contents
        </div>
        <div class="chapters">
          <div
            class="chapter"
            v-for="(item, index) in book_chapters"
            :key="index"
            @mousedown="selectChapter(index)"
          >
            <div class="title">{{ item.title.p }}</div>
            <div class="divider"></div>
          </div>
        </div>
      </div>
    </Transition>
    <button class="back" @click="$router.push('/')">
      <svg
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="m15 18-6-6 6-6"></path>
      </svg>
    </button>

    <div class="controls">
      <button>
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
          <path d="M11 5 6 9H2v6h4l5 4V5Z"></path>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        </svg>
      </button>

      <button
        @click="
          $store.commit(
            'setTextSettingsVisible',
            !$store.state.text_settings_visible
          )
        "
      >
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
          <path d="M12 9a3 3 0 1 0 0 6 3 3 0 1 0 0-6z"></path>
          <path
            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
          ></path>
        </svg>
      </button>

      <button>
        <svg
          @click="$store.commit('toggleTheme')"
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
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { auth } from "@/main";
export default defineComponent({
  props: ["book_chapters"],
  methods: {
    logout() {
      this.$store.state.user = null;
      auth.signOut();
    },
    selectChapter(chapter_index: number) {
      this.$emit("selectChapter", chapter_index);
      //scroll to top
      window.scrollTo(0, 0);
      this.$store.state.book_contents_visible = false;
    },
  },
  computed: {},
  setup() {
    return {};
  },
});
</script>

<style lang="scss" scoped>
.header {
  background-color: var(--bg);
  padding: 15px;
  box-sizing: border-box;
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

  font-weight: 600;
  font-size: 23px;
  line-height: 28px;
  /* identical to box height */

  color: var(--text-color);
}

.contents {
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  gap: 20px;
  position: fixed;
  background-color: var(--bg);
  top: 0;
  left: 0;
  right: 0;
  height: 100vh;
  z-index: 999999999999999999;
  max-width: 850px;
  margin: 0 auto;

  .chapters {
    width: 90%;
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    overflow-x: hidden;
    max-height: 90%;
    font-weight: 400;
    font-size: 17px;
    line-height: 21px;
    /* identical to box height */

    color: var(--text-color);

    //hide scrollbar
    &::-webkit-scrollbar {
      display: none;
    }
  }
}
.chapter {
  padding: 10px;
  box-sizing: border-box;
  border-radius: 10px;
  transition: all 0.2s ease-in-out;
  &:hover {
    background-color: #f2f2f2;
  }
  &.active {
    background-color: #f2f2f2;
  }
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
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: all 0.2s ease-in-out;
  svg {
    stroke: var(--text-color);
  }
  &:hover {
    background-color: var(--bg);
  }
}

.controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
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
    width: 40px;
    height: 40px;
    border-radius: 50%;
    transition: all 0.2s ease-in-out;

    svg {
      stroke: var(--text-color);
    }
    &:hover {
      background-color: #f2f2f2;
    }
  }
}

.contents-enter-active,
.contents-leave-active {
  transition: all 0.2s ease-in-out;
}

.contents-enter,
.contents-leave-to {
  transform: translateY(-100%);
}

.contents-enter-from,
.contents-leave-to {
  transform: translateY(-100%);
}
.divider {
  width: 100%;
  height: 0px;
  border-radius: 5px;
  border: 3px solid var(--text-color);
  margin: 6px 0 20px 0;
}
</style>
