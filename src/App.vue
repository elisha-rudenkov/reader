<template>
  <router-view />
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { db, auth } from "@/main";
import { getDoc, collection, doc } from "@firebase/firestore";
export default defineComponent({
  methods: {
    validateFontSize(size: number): number {
      return size > 0 && size < 100 ? size : 18;
    },
    validatePadding(padding: number): number {
      return padding >= 0 && padding < 20 ? padding : 0;
    },
    validateLineHeight(lineHeight: number): number {
      return lineHeight >= 0 && lineHeight <= 5 ? lineHeight : 2;
    },
  },
  computed: {},

  mounted() {
    //load user preferences
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        let docRef = doc(collection(db, `users`), user.uid);

        const userDoc = await getDoc(docRef);
        const userData = userDoc.data();
        console.log(userData);

        if (userData) {
          if (
            userData.text_font_size &&
            this.$store.state.text_font_size !== userData.text_font_size
          ) {
            this.$store.commit(
              "setTextFontSize",
              this.validateFontSize(userData.text_font_size)
            );
          }

          if (
            userData.text_padding &&
            this.$store.state.text_padding !== userData.text_padding
          ) {
            this.$store.commit(
              "setTextPadding",
              this.validatePadding(userData.text_padding)
            );
          }

          if (
            userData.text_line_height &&
            this.$store.state.text_line_height !== userData.text_line_height
          ) {
            console.log(
              `setting line height ${
                this.$store.state.text_line_height !== userData.text_line_height
              }`
            );

            this.$store.commit(
              "setTextLineHeight",
              this.validateLineHeight(userData.text_line_height)
            );
          }
        }
      }
    });
  },

  setup() {
    return {};
  },
});
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700&family=Poppins:wght@100;200;300;400;500;600;700&family=Roboto:wght@100;300;400;500;700&display=swap");

body {
  margin: 0;
  padding: 0;
  background: var(--bg);

  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  max-width: 850px;
  margin: 0 auto;
}

.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
}

:root {
  --bg: #ffffff;
  --text-color: #000;
}

.dark-theme {
  --bg: #191a23;
  --text-color: #fff;
}

#file-upload {
  display: none !important;
}

#app {
  font-family: "Poppins", sans-serif;
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  flex-direction: column;
  background: var(--bg);
  color: var(--text-color);
}
.outlined-btn {
  all: unset;
  cursor: pointer;
  box-sizing: border-box;
  border: 1px solid var(--text-color);
  border-radius: 5px;
  display: flex;
  gap: 11px;
  align-items: center;
  justify-content: center;

  width: 100%;
  padding: 10px 20px;
  font-weight: 700;
  font-size: 18px;
  line-height: 27px;
  /* identical to box height */
  max-width: 280px;
  color: var(--text-color);
  transition: all 0.3s ease-in-out;

  &:hover {
    background: var(--bg);
    color: var(--text-color);
  }
}
.gradient-btn {
  all: unset;
  cursor: pointer;
  box-sizing: border-box;
  background: linear-gradient(
    270deg,
    #de2cae 0%,
    #ee7384 31.77%,
    #f07e7e 61.98%,
    #fbaf61 77.08%,
    #febe58 100%
  );
  border-radius: 5px;
  display: flex;
  gap: 11px;
  align-items: center;
  justify-content: center;

  width: 100%;
  padding: 10px 20px;
  font-weight: 700;
  font-size: 18px;
  line-height: 27px;
  /* identical to box height */
  max-width: 280px;
  color: #ffffff;
  transition: all 0.3s ease-in-out;
}

.gradient-btn-inactive {
  background: #8b8b8b !important;
  cursor: not-allowed;
  transition: all 0.3s ease-in-out;
}
</style>
