<template>
  <div class="book" @click="openBook(book_id)">
    <img v-if="base64_img != 'No Image'" :src="base64ToImg(base64_img)" />

    <img v-else class="book-cover-placeholder" />
    <div class="book-info">
      <h2 id="title">{{ title }}</h2>
      <p id="author">
        {{ author["first-name"] }} {{ author["last-name"] }}
      </p>

      <div class="progress-bar" v-show="!is_local">
        <Transition name="progress">
          <div
            class="progress"
            :style="{ width: getBookProgress() + '%' }"
          ></div>
        </Transition>
        <div class="progress-text">{{ getBookProgress() }}%</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {


    title: {
      type: String,
      required: true,
    },
    author: {
      type: Object as () => {
        "first-name": string;
        "last-name": string;
      },
      required: true,
    },
    base64_img: {
      type: String,
      required: true,
    },
    book_id: {
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
    base64ToImg(base64: string) {
      if (!base64) return "";
      return "data:image/png;base64," + base64;
    },
    openBook(book_id: string) {
      this.$router.push("/book/" + book_id);
    },

    getBookProgress() {
      if (this.total_chapters == 0) return 0;
      return Math.round((this.progress / this.total_chapters) * 100);
    },
  },
  computed: {
    is_local(){
      //get id from url
   
      if (this.book_id.startsWith("local_")) return true;
      return false;

    }
  },
  setup() {
    return {};
  },
});
</script>

<style lang="scss" scoped>
.book {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  gap: 20px;

  img {
    min-width: 100px;
    min-height: 150px;
    max-width: 100px;
    max-height: 150px;

    object-fit: cover;
    border-radius: 5px;
  }

  .book-cover-placeholder {
    min-width: 100px;
    min-height: 150px;
    max-width: 100px;
    max-height: 150px;

    box-sizing: border-box;
    border-radius: 5px;
    border: none;
    background: #f2f2f2;
  }
}

.book-info {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
  flex: 2;

  #title {
    all: unset;
    font-weight: 300;

    font-size: 23px;
    line-height: 27px;
    margin-bottom: 20px;
    /* identical to box height */

    color: var(--text-color);
  }

  #author {
    all: unset;
    font-size: 18px;
    line-height: 24px;
    /* identical to box height */
    margin-bottom: 10px;
    color: #bbbbbb;
  }

  #genres {
    all: unset;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    /* identical to box height */

    color: #bbbbbb;
  }

  .progress-text {
    font-weight: 400;
    font-size: 13px;
    line-height: 16px;
    /* identical to box height */
    margin-top: 15px;
    color: #bbbbbb;
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
    margin-bottom: 20px;

    .progress {
      height: 100%;
      background: linear-gradient(270deg, #e035a9 -14.58%, #fdbb5a 98.61%);
      border-radius: 5px;
    }
  }
}
</style>
