import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
      token: null,
      tagsStoreList: [],

  },
  mutations: {
      saveToken(state, data) {
          state.token = data;
          window.localStorage.setItem("Token", data);
      },
      saveTagsData(state, data) {
          state.tagsStoreList = data;
          sessionStorage.setItem("Tags",data)
      },

  },
  actions: {

  }
})
