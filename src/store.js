import Vue from 'vue'
import Vuex from 'vuex'
import Cookies from 'js-cookie'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
      token: null,
      tokenExpire: null,
      tagsStoreList: [],
      language: Cookies.get('language') || 'en',

  },
  mutations: {
      saveToken(state, data) {
          state.token = data;
          window.localStorage.setItem("Token", data);
      },
      saveTokenExpire(state, data) {
          state.tokenExpire = data;
          window.localStorage.setItem("TokenExpire", data);
      },
      saveTagsData(state, data) {
          state.tagsStoreList = data;
          sessionStorage.setItem("Tags",data)
      },
      SET_LANGUAGE: (state, language) => {
          state.language = language
          Cookies.set('language', language)
      },

  },
  actions: {
      setLanguage({ commit }, language) {
          commit('SET_LANGUAGE', language)
      },

  }
})
