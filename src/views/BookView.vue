<template>
  <div class="home" @click="nav_visible = true">
    <Transition name="top-nav">
      <readerHeader
        :book_chapters="chapters"
        @selectChapter="selectChapter($event)"
        v-show="nav_visible"
      ></readerHeader>
    </Transition>
    <div class="no-book" v-if="no_book_or_unauthorized">
      <h1>Oops, that's awkward 😅</h1>
      <p>Sorry, we couldn't find the book you were looking for.</p>
      <p>Try searching for it in the library.</p>
      <button class="back-btn" @click="$router.push('/')">
        Back To Library
      </button>
    </div>

    <div class="chapter" v-if="current_chapter">
      <button
        class="chapter-nav-btn"
        @click="previousChapter"
        v-if="current_chapter_index != 0"
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
          <path d="M12 19V5"></path>
          <path d="m5 12 7-7 7 7"></path>
        </svg>
      </button>
      <h3>{{ book.title }}</h3>
      <h4>{{ book.author["first-name"] }} {{ book.author["last-name"] }}</h4>
      <h2>{{ current_chapter.title.p }}</h2>
      <p
        class="noselect"
        :style="{
          fontSize: $store.state.text_font_size + 'px',
          lineHeight: $store.state.text_line_height,
          fontFamily: $store.state.text_font,
          padding: '0 ' + $store.state.text_padding + 'px !important',
        }"
        v-for="(paragraph, index) in current_chapter.text"
        :key="index"
        :id="index.toString()"
        v-html="trimChar(paragraph)"
      ></p>

      <button
        class="chapter-nav-btn"
        @click="nextChapter"
        v-if="current_chapter_index != chapters.length"
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
          <path d="M12 5v14"></path>
          <path d="m19 12-7 7-7-7"></path>
        </svg>
      </button>
    </div>
    <Transition name="bottom-nav">
      <readerBottom
        :chapter_title="current_chapter_title"
        :progress="current_chapter_index"
        :total_chapters="chapters.length"
        v-show="nav_visible"
      ></readerBottom>
    </Transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { db, auth } from "@/main";
import { getDocs, getDoc, collection, doc, setDoc } from "@firebase/firestore";

import readerHeader from "@/components/reader-header.vue";
import readerBottom from "@/components/reader-bottom.vue";

export default defineComponent({
  name: "HomeView",
  components: { readerHeader, readerBottom },

  data() {
    return {
      test: 0,
      is_local_book: false,
      loading: false,
      no_book_or_unauthorized: false,
      //general book data
      book: null as any,
      //actual chapters
      chapters: [] as any[],
      //current chapter index
      current_chapter_index: 0,
      //current chapter
      /* current_chapter: null as any, */
      current_paragraph: 0,
      nav_visible: false,
    };
  },
  methods: {
    trimChar(text: string) {
      //remove first and last character
      return text.substring(1, text.length - 1);
    },
    getCurrentParagraph() {
      //get the id of the paragraph that is currently in view at the top
      let paragraphs = document.querySelectorAll(".chapter p");
      let current_paragraph = 0;
      for (let i = 0; i < paragraphs.length; i++) {
        let paragraph = paragraphs[i];
        let rect = paragraph.getBoundingClientRect();
        if (rect.top > 0) {
          current_paragraph = i;
          break;
        }
      }

      this.current_paragraph = current_paragraph;
    },
    scrollToParagraph(paragraph: number) {
      if (!paragraph) return;
      let paragraphs = document.querySelectorAll(".chapter p");
      if (!paragraphs || !paragraphs[paragraph]) return;
      let paragraph_to_scroll_to = paragraphs[paragraph];
      paragraph_to_scroll_to.scrollIntoView({ behavior: "smooth" });
    },
    selectChapter(ev: number) {
      this.current_chapter_index = ev;
    },
    loadLocalBook(book_id: string) {
      //find in vuex
      this.book = this.$store.state.local_books.find(
        (book: any) => book.id == book_id
      );

      if (!this.book) {
        this.no_book_or_unauthorized = true;
        return;
      }

      //load chapters
      this.chapters = this.book.chapters;

      //load progress
      let progress = JSON.parse(localStorage.getItem("progress") || "[]");
      let book_progress = progress.find((book: any) => book.book_id == book_id);

      if (book_progress) {
        console.log(`progress found: ${book_progress.progress}`);

        this.current_chapter_index = book_progress.progress;
        this.current_paragraph = book_progress.current_paragraph;
      }
    },
    async loadChapters() {
      if (!auth.currentUser) return;

      //get book id from url

      let book_id = this.$route.params.id.toString();
      if (book_id == "undefined" || book_id == "null") {
        this.$router.push("/");
      }

      //if book id starts with local_ then it's a local book
      if (book_id.startsWith("local_")) {
        this.is_local_book = true;
        this.loadLocalBook(book_id);
        return;
      }

      //load general book data
      let book = await getDoc(
        doc(db, `users/${auth.currentUser.uid}/books`, book_id)
      );

      if (book.exists()) {
        this.book = book.data();
        if (this.book.progress) {
          this.current_chapter_index = this.book.progress;
          this.current_paragraph = this.book.current_paragraph;
        }
      } else {
        this.no_book_or_unauthorized = true;
        return;
      }

      //load chapters
      let chapters = await getDocs(
        collection(
          db,
          `users/${auth.currentUser.uid}/books`,
          book_id,
          "chapters"
        )
      );

      chapters.forEach((chapter) => {
        let temp = chapter.data();
        temp.id = chapter.id;
        this.chapters.push(temp);
      });
    },

    async saveProgress() {
      if (!auth.currentUser) return;
      if (this.is_local_book) {
        this.saveProgressLocal();
        return;
      }
      console.log(`not local saving progress ${this.is_local_book}`);

      //get book id
      let book_id = this.$route.params.id.toString();

      if (!book_id) return;

      //save progress to db

      await setDoc(
        doc(db, `users/${auth.currentUser.uid}/books`, book_id),
        {
          progress: this.current_chapter_index,
          current_paragraph: this.current_paragraph,
        },
        { merge: true }
      );
    },

    saveProgressLocal() {
      //

      //save progress to local storage

      let progress = [
        {
          book_id: this.book.id,
          progress: this.current_chapter_index,
          current_paragraph: this.current_paragraph,
        },
      ];

      //get books form local storage
      let all_books = JSON.parse(localStorage.getItem("progress") || "[]");

      //find book in local storage
      let book_index = all_books.findIndex(
        (book: any) => book.book_id == this.book.id
      );

      //if book is found, replace it
      if (book_index > -1) {
        all_books[book_index] = progress[0];
      } else {
        //if book is not found, add it
        all_books.push(progress[0]);
      }

      //save to local storage
      localStorage.setItem("progress", JSON.stringify(all_books));
    },

    nextChapter() {
      if (this.current_chapter_index < this.chapters.length - 1) {
        this.current_chapter_index++;
        //scroll to top
        window.scrollTo(0, 0);

        //save progress
        this.saveProgress();
      }
    },
    previousChapter() {
      if (this.current_chapter_index > 0) {
        this.current_chapter_index--;
      }
      this.saveProgress();
    },
    handleScroll(event: any) {
      console.log("scrolling");

      let scroll = window.scrollY;
      let height = document.body.scrollHeight - window.innerHeight;
      this.$store.state.scroll_progress = Math.round((scroll / height) * 100);
      this.getCurrentParagraph();
      this.debouncedParagraphSave();
      if (!this.nav_visible || this.$store.state.book_contents_visible) return;
      setTimeout(() => {
        this.$store.state.text_settings_visible = false;
      }, 150);
      setTimeout(() => {
        this.$store.state.text_settings_visible = false;
        this.nav_visible = false;
      }, 200);
    },

    debouncedParagraphSave() {
      let temp = this.current_paragraph;
      setTimeout(() => {
        if (temp == this.current_paragraph) {
          console.log("saving paragraph");

          if (this.is_local_book) {
            this.saveProgressLocal();
            console.log("saving local");
          } else {
            this.saveProgress();
            console.log("saving not local");
          }
        }
      }, 5000);
    },
  },

  async mounted() {
    await this.loadChapters();
    this.scrollToParagraph(this.current_paragraph);
  },

  created() {
    window.addEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },

  computed: {
    current_chapter(): any {
      return this.sorted_chapters[this.current_chapter_index];
    },
    current_chapter_title(): string {
      if (!this.current_chapter) return "";
      return this.current_chapter.title.p;
    },

    sorted_chapters(): any[] {
      if (!this.chapters) return [];
      return this.chapters.sort((a: any, b: any) => {
        return parseInt(a.id) - parseInt(b.id);
      });
    },
  },
});
</script>

<style lang="scss" scoped>
b {
  text-emphasis: 1.5;
  text-emphasis-style: filled;
}

.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;

  background: var(--bg);
  color: var(--text-color);
  //hide scrollbar

  &::-webkit-scrollbar {
    display: none;
  }
}

h3 {
  font-size: 24px;
  font-weight: 300;
  text-align: center;
  margin: 0;
}

h4 {
  font-size: 16px;
  font-weight: 300;
  text-align: center;
  margin: 0;
}

.chapter {
  max-width: 650px;
  box-sizing: border-box;
  height: 90vh;
  margin: 2rem 0;
  background-color: var(--bg);
  color: var(--text-color);

  h2 {
    font-size: 28px;
    line-height: 1.5;
    margin-bottom: 10px;
    text-align: center;
    color: var(--text-color);
  }
  p {
    font-size: 18px;
    line-height: 2;
    font-weight: 400 !important;
    color: var(--text-color);
  }
}
.no-book {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  padding: 2rem 10px;
  box-sizing: border-box;
  text-align: center;
  background: var(--bg);

  h2 {
    font-size: 24px;
    font-weight: 300;
    margin: 0;
    color: var(--text-color);
  }
  p {
    font-size: 18px;
    font-weight: 300;
    padding: 0 10px;
    margin: 0;
    color: var(--text-color);
  }

  .back-btn {
    all: unset;

    padding: 10px 15px;
    display: flex;
    align-items: center;
    justify-content: center;

    margin-top: 20px;

    background-color: #e4479e;
    color: white;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    font-size: 20px;
    font-weight: 700;
  }
}
.chapter-nav-btn {
  all: unset;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 650px;

  padding: 20px 0;

  svg {
    width: 50px;
    height: 50px;
    color: rgb(163, 163, 163);
  }
}

.top-nav-enter-active,
.top-nav-leave-active {
  transition: all 0.3s ease-in-out;
}
.top-nav-enter,
.top-nav-leave-to {
  transform: translateY(-100%);
}

.top-nav-enter-from,
.top-nav-leave-to {
  transform: translateY(-100%);
}

.bottom-nav-enter-active,
.bottom-nav-leave-active {
  transition: all 0.3s ease-in-out;
}
.bottom-nav-enter,
.bottom-nav-leave-to {
  transform: translateY(1100%);
}

.bottom-nav-enter-from,
.bottom-nav-leave-to {
  transform: translateY(100%);
}

//media query for mobile
@media (max-width: 768px) {
}
</style>
