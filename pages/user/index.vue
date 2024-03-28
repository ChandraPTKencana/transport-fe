<template>
  <div class="w-full h-full flex flex-col">
    <Header :title="'List User'" />
    <div class="w-full flex grow flex-col overflow-auto h-0">
      <div class="w-full flex">
        <button type="button" name="button" class="m-1 text-2xl "
          @click="form_add()">
          <IconsPlus />
        </button>
        <button type="button" name="button" class="m-1 text-2xl "
          @click="form_edit()">
          <IconsEdit />
        </button>
        <button type="button" name="button" class="m-1 text-2xl "
          @click="remove()">
          <IconsDelete />
        </button>
        <!-- <button type="button" name="button" style="margin:4px; " @click="cetak()">
          <fa :icon="['fas','print']"/>
        </button> -->
      </div>
      <div class="w-full flex p-1">
        <div class="grow">
          <div class="font-bold"> Keyword </div>
          <input class="" type="text" v-model="search" name="search"
            placeholder="Keyword">
        </div>
        <div class="pl-1">
          <div class="font-bold"> Sort By </div>
          <select class="" v-model="sort.field">
            <option value=""></option>
            <option value="username">Username</option>
            <option value="hak_akses">Hak Akses</option>
            <option value="is_active">Status</option>
          </select>
        </div>
        <div class="pl-1">
          <div class="font-bold"> Sort Order </div>
          <select class="" v-model="sort.by">
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>
        <div class="flex items-end pl-1">
          <button class="" type="button" name="button" @click="searching()">
            <IconsSearch class="text-2xl" />
          </button>
        </div>
      </div>
      <div class="w-full flex justify-center items-center grow h-0 p-1">

        <div v-if="users.length == 0" class="">
          Maaf Tidak Ada Record
        </div>

        <div v-else class="w-full h-full overflow-auto" role="sticky" ref="loadRef" @scroll="loadMore">
          <table class="tacky">
            <thead>
              <tr class="sticky top-0 !z-[2]">
                <th>No.</th>
                <th>Username</th>
                <th>Hak Akses</th>
                <th>Status</th>
                <th>Tanggal Dibuat</th>
                <th>Tanggal Diubah</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user, index) in users" :key="index" @click="selected = index"
                :class="selected == index ? 'active' : ''">
                <td>{{ index + 1 }}.</td>
                <td class="bold">{{ user.username }}</td>
                <td>{{ user.hak_akses }}</td>
                <td>{{ user.is_active ? 'Aktif' : 'Nonaktif' }}</td>
                <td>{{ $moment(user.created_at).format("DD-MM-Y HH:mm:ss") }}</td>
                <td>{{ $moment(user.updated_at).format("DD-MM-Y HH:mm:ss") }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- {{ data.greetings }} -->
      <!-- {{ users }} -->
    </div>
  </div>
  <PopupMini :type="'delete'" :show="delete_box" :data="delete_data" :fnClose="toggleDeleteBox" :fnConfirm="confirmed_delete" />
  <FormsUser :show="forms_user_show" :fnClose="()=>{forms_user_show=false}" :id="forms_user_id" :p_data="users"/>

</template>

<script setup>
const { $moment } = useNuxtApp()
import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/store/auth';
import { useErrorStore } from '~/store/error';
import { useCommonStore } from '~/store/common';
import { useAlertStore } from '~/store/alert';

definePageMeta({
  // layout: "clear",
  middleware: [
    function (to, from) {
      // if (!useAuthStore().checkScopes(['ap-trx_trp-view']))
      //   return navigateTo('/');
      if (!useAuthStore().checkRole(["SuperAdmin"]))
      return navigateTo('/');
    },
    // 'auth',
  ],
});


const params = {};
params._TimeZoneOffset = new Date().getTimezoneOffset();


const token = useCookie('token');
const { data: users } = await useAsyncData(async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/users", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json'
    },
    params: params,
    retry: 0,
  });
  useCommonStore().loading_full = false;

  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return [];
  }

  return data.value.data;
});


const search = ref("");
const sort = ref({
  field: "",
  by: "desc"
});
const selected = ref(-1);
const scrolling = ref({
  page: 1,
  is_last_record: false,
  scrollLeft: 0,
  may_get_data: true
});

const inject_params = () => {
  params.like = "";
  if (search.value != "") {
    params.like = `id:%${search.value}%,username:%${search.value}%`;
  }
  params.sort = "";
  if (sort.value.field) {
    params.sort = sort.value.field + ":" + sort.value.by;
  }
};

const loadRef = ref(null);

const callData = async () => {
  useCommonStore().loading_full = true;
  scrolling.value.may_get_data = false;
  params.page = scrolling.value.page;
  if (params.page == 1) users.value = [];

  const { data, error, status } = await useFetch("/users", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      // 'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    params: params,
    // body: {
    //   sort: "updated_at:desc"
    // },
    retry: 0,
    // server: true
  });
  useCommonStore().loading_full = false;
  scrolling.value.may_get_data = true;

  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return;
  }

  if (scrolling.value.page == 1) {
    users.value = data.value.data;
    if (loadRef.value) loadRef.value.scrollTop = 0;
  } else if (scrolling.value.page > 1) {
    users.value = [...users.value, ...data.value.data];
  }
  if (data.value.data.length == 0) {
    scrolling.value.is_last_record = true;
  }
}

const loadMore = async () => {

  if (!scrolling.value.may_get_data) return;
  let parent = loadRef.value;

  if (parent.scrollLeft != scrolling.value.scrollLeft) {
    scrolling.value.scrollLeft = parent.scrollLeft;
    return;
  }

  if (scrolling.value.is_last_record) return;

  let stuck = Math.round(parent.scrollTop) + parent.clientHeight >= parent.scrollHeight - 1 ? true : false;
  if (!stuck) return;

  scrolling.value.page++;
  await callData();

}

const searching = () => {
  scrolling.value.page = 1;
  scrolling.value.is_last_record = false;
  inject_params();
  callData();
}

const router = useRouter();

const forms_user_show =  ref(false);
const forms_user_id = ref(0);
const form_add = () => {
  forms_user_id.value = 0;
  forms_user_show.value = true;
}

const { display } = useAlertStore();
const { show, status, message } = storeToRefs(useAlertStore());

const form_edit = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    forms_user_id.value = users.value[selected.value].id;
    forms_user_show.value = true;
  }
};


const delete_data = ref({});
const delete_box = ref(false);

const toggleDeleteBox = async()=>{  
  if (delete_box.value) {
    delete_box.value = false;
  }
};

const remove = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    delete_data.value = {id : users.value[selected.value].id};
    delete_box.value = true;
  }
};

const confirmed_delete = async() => {
  useCommonStore().loading_full = true;

  const data_in = new FormData();
  data_in.append("id", users.value[selected.value].id);  
  data_in.append("_method", "DELETE");

  const { data, error, status } = await useMyFetch("/user", {
    method: "post",
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json',
    },
    body: data_in,
    retry: 0,
  });
  useCommonStore().loading_full = false;
  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return;
  }
  users.value.splice(selected.value,1);
  selected.value = -1;
  delete_box.value = false;
}

// const form_permission = () => {
//   if (selected.value == -1) {

//     display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
//   } else {
//     router.push({ name: 'user-permission', query: { id: users.value[selected.value].id } });
//   }
// };
//     // form_inject(){
//     //   if (selected==-1) {
//     //     this.$store.commit('alert/SET_ALERT',{
//     //       show:true,
//     //       status:"Gagal",
//     //       message:"Silahkan Pilih Data Terlebih Dahulu"
//     //     });
//     //   }else {
//     //     this.$router.push({name:'product-material_controls',query:{product_id:users[selected].id,status:"Inject"}})
//     //   }
//     // },
//     // form_rest(){
//     //   if (selected==-1) {
//     //     this.$store.commit('alert/SET_ALERT',{
//     //       show:true,
//     //       status:"Gagal",
//     //       message:"Silahkan Pilih Data Terlebih Dahulu"
//     //     });
//     //   }else {
//     //     this.$router.push({name:'product-material_controls',query:{product_id:users[selected].id,status:"Rest"}})
//     //   }
//     // },


//     // async cetak(){
//     //   if (selected==-1) {
//     //     this.$store.commit('alert/SET_ALERT',{
//     //       show:true,
//     //       status:"Gagal",
//     //       message:"Silahkan Pilih Data Terlebih Dahulu"
//     //     });
//     //     return;
//     //   }

//     //   try {
//     //     this.$store.commit("SET_LOADING",true);
//     //     let response = await this.$axios.$get('/product/cetak', {
//     //       params:{
//     //         id:users[selected].id
//     //       }
//     //     },{});
//     //     // downloadFile(response);
//     //     viewFile(response);
//     //   } catch (e) {
//     //   } finally {
//     //     this.$store.commit("SET_LOADING",false);
//     //   }
//     // },
//   },
// })

</script>
<!-- <scipt>


//   computed: {
//     // ...mapState('error', ['errors']),
//     // ...mapState('_product',{
//     //    users: state => state.users,
//     //    state_product: state => state.product,
//     //    last_record: state => state.last_record,
//     //    highlight_search:state=>state.search,
//     // }),
//   },

// }
</script> -->
<style scoped="">
/* table.sticky thead th:nth-child(2) {
  position: -webkit-sticky;
  position: sticky;
  left: 0;
  z-index: 2;
} */
</style>
