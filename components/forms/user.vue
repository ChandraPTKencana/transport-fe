<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Form User'" :fn="fnClose" class="w-100 flex align-items-center"
        style="color:white;" />

        <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
          <div class="w-full flex flex-col items-center grow overflow-auto">
            <div class="w-full flex flex-row flex-wrap">

              <div class="w-full flex flex-col flex-wrap p-1">
                <label for="">Username</label>
                <input type="text" v-model="user.username">
                <p class="text-red-500">{{ field_errors.username }}</p>
              </div>

              <div class="w-full flex flex-col flex-wrap p-1">
                <label for="">Password</label>
                <input type="password" v-model="user.password">
                <p class="text-red-500">{{ field_errors.password }}</p>
              </div>

              <div class="w-full sm:w-4/12 md:w-3/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Hak Akses</label>
                <select v-model="user.hak_akses">
                  <option value="PabrikTransport">Pabrik Transport</option>
                  <option value="PabrikMandor">Pabrik Mandor</option>
                  <option value="Logistic">Logisitic</option>
                  <option value="Finance">Finance</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Accounting">Accounting</option>
                  <option value="MIS">MIS</option>
                  <option value="SuperAdmin">SuperAdmin</option>
                </select>
                <p class="text-red-500">{{ field_errors.hak_akses }}</p>
              </div>
            
              <div class="w-full sm:w-4/12 md:w-3/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Status</label>
                <select v-model="user.is_active">
                  <option value="1">Aktif</option>
                  <option value="0">Nonaktif</option>
                </select>
                <p class="text-red-500">{{ field_errors.is_active }}</p>
              </div>
            </div>
          </div>
          
          <div class="w-full flex items-center justify-end">
            <button type="button" name="button" class="w-36 m-1" @click="fnClose()">
              Cancel
            </button>
            <button type="submit" name="button" class="w-36 m-1 bg-blue-600 text-white  rounded-sm" @click.prevent="doSave()">
              Save
            </button>
          </div>
        </form>
    </div>
  </section>

</template>

<script setup>

const { $moment } = useNuxtApp()
import { storeToRefs } from 'pinia';

import { useAuthStore } from '~/store/auth';
import { useErrorStore } from '~/store/error';
import { useCommonStore } from '~/store/common';
import { useAlertStore } from '~/store/alert';
const { pointFormat } = useUtils();


const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  fnClose: {
    type: Function,
    required: false,
  },
  id:{
    type: Number,
    required: false,
    default: 0,
  },
  p_data:{
    type:Array,
    required:true,
    default:[]
  },
})

const user_temp = {
    id: -1,
    username: "",
    password: "",
    hak_akses:"PabrikTransport",
    is_active: 1,
};

const user = ref({...user_temp});

const token = useCookie('token');
const field_errors = ref({})



const doSave = async () => { 
  useCommonStore().loading_full = true;
  field_errors.value = {};

  const data_in = new FormData();
  
  data_in.append("username", user.value.username);
  if(user.value.password) data_in.append("password", user.value.password);
  data_in.append("hak_akses", user.value.hak_akses);
  data_in.append("is_active", user.value.is_active);

  let $method = "post";

  let id = props.id;
  if (id == 0) {
  } else {
    // $method = "put";
    // data_in['id'] = id;
    data_in.append("id", id);
    data_in.append("_method", "PUT");
  }

  const { data, error, status } = await useMyFetch("/user", {
    method: $method,
    headers: {
      'Authorization': `Bearer ${token.value}`,
      // 'Content-Type': 'application/json',
      'Accept': 'application/json',
      // "Content-Type": "multipart/form-data",
    },
    body: data_in,
    retry: 0,
    // server: true
  });
  useCommonStore().loading_full = false;
  if (status.value === 'error') {
    useErrorStore().trigger(error, field_errors);
    return;
  }

  
  if(props.id<=0){
    user.value.id = data.value.id;
    user.value.created_at = data.value.created_at;
    user.value.updated_at = data.value.updated_at;
    props.p_data.unshift(user.value);
  }else{
    user.value.updated_at = data.value.updated_at;

    let idx= props.p_data.map((x)=>x.id).indexOf(props.id);
    if(idx>=-1){
      props.p_data.splice(idx,1,{...user.value});    
    }
  }
  props.fnClose();
  // router.go(-1);
}


const callData = async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/user", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      // 'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    params: {id:props.id},
    // body: {
    //   sort: "updated_at:desc"
    // },
    retry: 0,
    // server: true
  });
  useCommonStore().loading_full = false;

  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return;
  }

  user.value = data.value.data;
}

watch(() => props.show, (newVal, oldVal) => {
  if (newVal == true){
    user.value = {...user_temp};
    field_errors.value = {};
    if(props.id!=0)
    callData();
  }
}, {
  immediate: true
});

</script>
<style scoped="">
/* table.sticky thead th:nth-child(2) {
  position: -webkit-sticky;
  position: sticky;
  left: 0;
  z-index: 2;
}

table.sticky thead tr {
  top: 0;
} */
</style>
