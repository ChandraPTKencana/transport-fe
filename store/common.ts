import { defineStore } from 'pinia';


export const useCommonStore = defineStore('common', {
  state: () => ({
    is_sidebar_open: false,
    loading_full: false,
    // loading: false,

    _tv:{
      filter_box : false,
      filter_model:{},
      global_keyword:""
    }
  }),
  actions: {
    triggerSidebar(act: boolean) {
      this.is_sidebar_open = act;
    },
  },
});