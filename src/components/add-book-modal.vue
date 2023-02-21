<template>
  <div class="popup-wrap" @click.self="$store.commit('setAddingBook', false)">
    <div class="popup">
      <h2>open a book</h2>
      <p>
        only <span id="purple">FB2</span> format is accepted. we are working on
        adding more formats
      </p>

      <div
        v-if="!book_file && !book_file_name"
        class="upload-book"
        @dragover="dragover"
        @dragleave="dragleave"
        @drop="drop"
        @click="browse()"
      >
        <input
          class="hidden-input"
          type="file"
          accept=".fb2"
          id="book_upload"
          ref="book_upload"
          @change="processBook($event)"
        />
        <p>
          drop your book here, or
          <span id="purple">browse</span>
        </p>
      </div>
      <div class="uploaded-book" v-else>
        <p>{{ book_file_name }}</p>
        <svg
          @click="clearBook()"
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
          <path d="M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20z"></path>
          <path d="m15 9-6 6"></path>
          <path d="m9 9 6 6"></path>
        </svg>
      </div>
      <div class="error">{{ error }}</div>

      <div class="cloud" v-if="logged_in">
        <div
          :class="upload_to_cloud ? 'checkbox checked' : 'checkbox'"
          @click="upload_to_cloud = !upload_to_cloud"
        >
          <svg
            v-if="upload_to_cloud"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="3"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M20 6 9 17l-5-5"></path>
          </svg>
        </div>

        <div class="cloud-text">
          <p>upload to cloud library</p>
          <span>(access on any device and track progress)</span>
        </div>
      </div>

      <button
        class="gradient-btn"
        :class="
          book_file && book_file_name ? 'gradient-btn' : 'gradient-btn-inactive'
        "
        @click="openBook()"
      >
        {{ logged_in_and_cloud ? "upload & open" : "open" }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { db, auth } from "@/main";
import { doc, addDoc, collection, setDoc } from "@firebase/firestore";
import X2JS from "x2js";

export default defineComponent({
  props: {
    user_img_url: String,
  },
  data() {
    return {
      text: "" as any,
      book_file: null as any,
      book_file_name: null as any,
      isDragging: false,
      upload_to_cloud: false,
      error: null as any,
    };
  },
  methods: {
    dragover(e: any) {
      e.preventDefault();
      this.isDragging = true;
    },
    dragleave() {
      this.isDragging = false;
    },
    drop(e: any) {
      e.preventDefault();
      //this.$refs.file.files = e.dataTransfer.files;
      this.processBook(e);
      this.isDragging = false;
    },

    browse() {
      let fileInput = document.getElementById(
        "book_upload"
      ) as HTMLInputElement;

      fileInput.click();
    },
    async processBook(ev: any) {
      if (
        ev &&
        ev.dataTransfer &&
        ev.dataTransfer.files &&
        ev.dataTransfer.files.length > 0
      ) {
        this.book_file = ev.dataTransfer.files[0];
        this.book_file_name = ev.dataTransfer.files[0].name;
        const reader = new FileReader();
        reader.onload = () => {
          this.text = reader.result;
        };
        reader.readAsText(this.book_file);
      } else {
        this.book_file = ev.target.files[0];
        this.book_file_name = ev.target.files[0].name;
        const reader = new FileReader();
        reader.onload = () => {
          this.text = reader.result;
        };
        reader.readAsText(this.book_file);
      }
    },
    clearBook() {
      this.book_file = null;
      this.book_file_name = null;
    },
    validateField(toValidate: any, field: string) {
      //I bet there is a better way to do this
      //but I don't care at this point
      if (!toValidate) {
        return "No " + field;
      }

      return toValidate;
    },

    openBook() {
      if (this.book_file && this.book_file_name && this.text) {
        this.saveBookToCloud();
        this.$store.state.adding_book = false;
      }
    },

    hashString(str: string) {
      let hash = 0;
      if (str.length == 0) return hash;
      for (let i = 0; i < str.length; i++) {
        let char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return hash;
    },

    async saveBookToCloud() {
      if (!this.book_file || !this.book_file_name || !this.text) {
        return;
      }

      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(this.text, "text/xml");

      let x2js = new X2JS();
      let book_object = (await x2js.xml2js(
        htmlDoc.documentElement.outerHTML
      )) as any;

      console.log(book_object);

      let book: any = {
        title: this.validateField(
          book_object.FictionBook.description["title-info"]["book-title"],
          "Title"
        ),
        author: this.validateField(
          book_object.FictionBook.description["title-info"]["author"],
          "Author"
        ),
        annotation: this.validateField(
          book_object.FictionBook.description["title-info"]["annotation"].p,
          "Annotation"
        ),
        genres: this.validateField(
          book_object.FictionBook.description["title-info"]["genre"],
          "Genres"
        ),
        progress: 0,
        total_chapters: 0,
        id: "",
      };

      
      if (book_object.FictionBook.binary[0]) {
        book.image = book_object.FictionBook.binary[0].__text;
        
      }else{
        book.image = book_object.FictionBook.binary.__text;
      }

      let chapters = [] as any;

      if (book_object.FictionBook.body.length) {
        //there are multiple sections with chapters
        book_object.FictionBook.body.forEach((block: any) => {
          if (block.section) {
            block.section.forEach((chapter: any) => {
              let parsed_chapter = this.parseAdditional(chapter);

              chapters.push(parsed_chapter);
            });
          }
        });
      } else {
        //there is only one section with chapters
        book_object.FictionBook.body.section.forEach((chapter: any) => {
          //iterate over all the p tags and add them to parsed p
          //if a p is not a string convert it to a string

          /*  let parsed_p = [] as any;

          chapter.p.forEach((p: any) => {
            parsed_p.push(JSON.stringify(p));
          });

          chapters.push({
            title: chapter.title,
            text: parsed_p,
          }); */
          let parsed_chapter = this.parseAdditional(chapter);

          chapters.push(parsed_chapter);
        });
      }

      book.total_chapters = chapters.length;

      if (!this.upload_to_cloud) {
        //hash title

        book.id = "local_" + this.hashString(book.title);

        //add chapters too book
        book.chapters = chapters;
        book.total_chapters = chapters.length;
        book.progress = 0;

        this.$store.commit("addLocalBook", book);

        this.$router.push(`/book/${book.id}`);
        return;
      }

      //save book to firestore

      const docRef = await addDoc(
        collection(db, `users/${auth.currentUser?.uid}/books`),
        book
      );

      //save chapters to firestore under chapter name
      chapters.forEach((chapter: any, index: number) => {
        setDoc(
          doc(
            db,
            `users/${auth.currentUser?.uid}/books/${docRef.id}/chapters`,
            `${index + 1}`
          ),
          chapter
        );
      });

      this.$router.push(`/book/${docRef.id}`);
    },

    parseAdditional(chapter: any) {
      /*  if (chapter.section || !chapter.p) {
        return {
          title: "Sooooo, there was more",
          text: "There was more text here but there is something strange going on with the format of this book. No more for you. Deal with it.",
        };
      } */

      //check if p is a string instead of an array

      try {
        let new_p = [] as any;

        chapter.p.forEach((p: any) => {
          if (p.emphasis) {
            new_p.push(`<i>${p.emphasis}</i>`);
            /* let emphasisIndex = 0; */
            //let temp_p = JSON.stringify(p).replace(/\n/g, function () {
            //check if the next emphasis is a string or an array
            //return p.emphasis[emphasisIndex++];
            //return `<emphasis >${p.emphasis}</emphasis>`;
            /* if (typeof p.emphasis == "string") {
                console.log(
                  `[AWESOME] <emphasis >${p.emphasis}</emphasis>`
                );

                return `<emphasis >${p.emphasis}</emphasis>`;
              } else {
                console.log(
                  `[AWESOME] <emphasis >${
                    p.emphasis[emphasisIndex++]
                  }</emphasis>`
                );
                return `<emphasis>${p.emphasis[emphasisIndex++]}</emphasis>`;
              } 

             
            });

            new_p.push(temp_p);
            });*/

            // new_p.push(temp_p);
          } else if (p.strong) {
            let p_text = p.toString();
            //if p.strong is an array
            if (Array.isArray(p.strong)) {
              p.strong.forEach((strong: any) => {
                p_text = p_text.replace(/\n/, `<b>${strong}</b>`);
              });
            }
            //if p.strong is a string
            else {
              p_text = p_text.replace(/\n/, `<b>${p.strong}</b>`);
            }

            new_p.push(p_text);
          } else {
            new_p.push(JSON.stringify(p));
          }
        });

        return { title: chapter.title, text: new_p };
      } catch (error) {
        console.log(`[parseAdditional] error`, error);

        return {
          title: { p: "Sooooo, there was more" },
          text: [
            "There was more text here but there is something strange going on with the format of this book. No more for you. Deal with it.",
          ],
        };
      }
    },
  },
  computed: {
    logged_in_and_cloud() {
      if (auth.currentUser && this.upload_to_cloud) {
        return true;
      } else {
        return false;
      }
    },
    logged_in() {
      if (auth.currentUser) return true;
      else return false;
    },
  },
});
</script>

<style lang="scss" scoped>
.hidden-input {
  display: none;
}
.checked {
  background-color: #df2fac;
  border: none !important;
  svg {
    stroke: #ffffff;
  }
}

.checkbox {
  width: 24px;
  height: 24px;
  border: 1px solid #000000;
  border-radius: 7px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  cursor: pointer;
  box-sizing: border-box;
}
.header {
  background-color: #ffffff;
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

.popup-wrap {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  background: rgba(0, 0, 0, 0.31);
  z-index: 99999;
  transition: all 0.5s ease-in-out;

  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 10px;
}

.popup {
  background-color: #ffffff;
  padding: 20px;
  display: flex;
  box-sizing: border-box;
  flex-direction: column;

  align-items: center;
  border-radius: 18px;
  max-width: 400px;
  gap: 5px;

  h2 {
    all: unset;
    font-style: normal;
    text-align: left;
    font-weight: 400;
    font-size: 36px;
    line-height: 44px;
    width: 100%;
    /* identical to box height */

    color: #000000;
  }

  p {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    color: #8b8b8b;
  }

  #purple {
    background: #df2fac;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }
}

.upload-book {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;

  gap: 10px;
  margin: 30px 0;
  padding: 40px 30px;
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='17' ry='17' stroke='lightgrey' stroke-width='3' stroke-dasharray='8%2c 9%2c 7' stroke-dashoffset='3' stroke-linecap='round'/%3e%3c/svg%3e");

  p {
    font-weight: 700;
    font-size: 16px;
    line-height: 19px;

    color: #8b8b8b;
  }
}

.uploaded-book {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  padding: 8px;
  align-items: center;
  border: 2px #df2fac solid;
  border-radius: 8px;
  margin: 30px 0;

  p {
    all: unset;
    font-weight: 600;
    font-size: 16px;

    color: #494949;
  }

  svg {
    cursor: pointer;
  }
}

.cloud {
  display: flex;
  justify-content: flex-start;
  align-items: center;

  gap: 10px;
  margin: 40px 0;
  width: 100%;

  input[type="checkbox"] {
    border: 1px solid #df2fac;
  }

  .cloud-text {
    display: flex;
    flex-direction: column;

    p {
      all: unset;
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 19px;

      color: #8b8b8b;
    }

    span {
      font-weight: 400;
      font-size: 13px;
      line-height: 16px;
      /* identical to box height */

      color: #8b8b8b;
    }
  }
}

.error {
  color: #df2fac;
  font-size: 12px;
  margin-top: 10px;
  max-width: 90%;
}

.add-book-active {
  transition: all 0.5s ease-in-out;
}
.add-book-enter,
.add-book-leave-to {
  opacity: 1;
}

.add-book-enter-from,
.add-book-leave-to {
  opacity: 0;
}
</style>
