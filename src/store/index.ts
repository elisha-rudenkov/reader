import { createStore } from "vuex";
export type State = {
  books: any;
  local_books: any;
  user: any;
  adding_book: boolean;
  text_settings_visible: boolean;
  book_contents_visible: boolean;
  text_padding: number;
  text_font: string;
  text_font_size: number;
  text_line_height: number;
  scroll_progress: number;

  signout_visible: boolean;

  theme: string;
};

export default createStore({
  state: {
    books: [],
    local_books: [],
    user: null,
    adding_book: false,
    text_settings_visible: false,
    book_contents_visible: false,
    text_padding: 0,
    text_font: "Poppins, sans-serif",
    text_font_size: 18,
    text_line_height: 2,
    scroll_progress: 0,

    signout_visible: false,

    theme: "light",
  },
  getters: {},
  mutations: {
    addBook(state: State, book: any) {
      state.books.push(book);
    },
    addLocalBook(state: State, book: any) {
      state.local_books.push(book);
    },

    setUser(state: State, user: any) {
      state.user = user;
    },
    setAddingBook(state: State, adding_book: boolean) {
      state.adding_book = adding_book;
    },
    setTextSettingsVisible(state: State, text_settings_visible: boolean) {
      state.text_settings_visible = text_settings_visible;
    },
    setTextPadding(state: State, text_padding: number) {
      state.text_padding = text_padding;
    },
    setTextFont(state: State, text_font: string) {
      state.text_font = text_font;
    },
    setTextFontSize(state: State, text_font_size: number) {
      state.text_font_size = text_font_size;
    },
    setTextLineHeight(state: State, text_line_height: number) {
      state.text_line_height = text_line_height;
    },

    resetAllTextSettings(state: State) {
      state.text_padding = 0;
      state.text_font = "Poppins, sans-serif";
      state.text_font_size = 18;
      state.text_line_height = 2;
    },

    toggleTheme(state) {
      console.log("toggleTheme");

      if (state.theme === "light") {
        document.body.classList.add("dark-theme");

        state.theme = "dark";
        //save to local storage
        localStorage.setItem("theme", "dark");
      } else {
        document.body.classList.remove("dark-theme");

        state.theme = "light";
        //save to local storage
        localStorage.setItem("theme", "light");
      }
    },
  },
  actions: {
    addBook({ commit }, book: any) {
      commit("addBook", book);
    },
    addLocalBook({ commit }, book: any) {
      commit("addLocalBook", book);
    },

    setUser({ commit }, user: any) {
      commit("setUser", user);
    },
    setAddingBook({ commit }, adding_book: boolean) {
      commit("setAddingBook", adding_book);
    },
    setTextSettingsVisible({ commit }, text_settings_visible: boolean) {
      commit("setTextSettingsVisible", text_settings_visible);
    },
    setTextPadding({ commit }, text_padding: number) {
      commit("setTextPadding", text_padding);
    },
    setTextFont({ commit }, text_font: string) {
      commit("setTextFont", text_font);
    },
    setTextFontSize({ commit }, text_font_size: number) {
      commit("setTextFontSize", text_font_size);
    },
    setTextLineHeight({ commit }, text_line_height: number) {
      commit("setTextLineHeight", text_line_height);
    },
    resetAllTextSettings({ commit }) {
      commit("resetAllTextSettings");
    },
    toggleTheme({ commit }, payload) {
      commit("toggleTheme", payload);
    },
  },
  modules: {},
});
