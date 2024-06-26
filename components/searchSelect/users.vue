<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Search And Select Employees'" :fn="fnClose" class="w-100 flex align-items-center"
        style="color:white;" />

      <form action="#" class="w-full flex p-1">
        <div class="grow">
          <div class="font-bold"> Keyword </div>
          <input class="" type="text" v-model="search" name="search"
            placeholder="Keyword">
        </div>
        <div class="pl-1">
          <div class="font-bold"> Sort By </div>
          <select class="" v-model="sort.field">
            <option value="created_at">Created At</option>
            <option value="email">Email</option>
            <option value="fullname">Fullname</option>
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
          <button class="" type="submit" name="button" @click.prevent="searching()">
            <IconsSearch class="text-2xl" />
          </button>
        </div>
      </form>
      <div class="w-full flex justify-center items-center grow h-0 p-1">

        <div v-if="users.length == 0" class="">
          Maaf Tidak Ada Record
        </div>

        <div v-else class="w-full h-full overflow-auto" role="sticky" ref="loadRef" @scroll="loadMore">
          <table class="tacky">
            <thead>
              <tr class="sticky top-0 !z-[2]">
                <th>No.</th>
                <th>Email</th>
                <th>Fullname</th>
                <th>Role</th>
                <th>Tanggal Dibuat</th>
                <th>Tanggal Diubah</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user, index) in users" :key="index" @click="countClickListFn(index,()=>{selected = index},selectRow)"
                :class="selected == index ? 'active' : ''">
                <td>{{ index + 1 }}.</td>
                <td class="bold">{{ user.email }}</td>
                <td>{{ user.fullname }}</td>
                <td>{{ user.role }}</td>
                <td>{{ $moment(user.created_at).format("DD-MM-Y HH:mm:ss") }}</td>
                <td>{{ $moment(user.updated_at).format("DD-MM-Y HH:mm:ss") }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="flex" style="justify-content:end; padding:5px;">
        <button @click="selectRow()" class="w-36 m-1 bg-blue-600 text-white rounded-sm">
          Select
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>

const { $moment } = useNuxtApp()
import { storeToRefs } from 'pinia';
import { useErrorStore } from '~/store/error';
import { useCommonStore } from '~/store/common';
import { useAlertStore } from '~/store/alert';


const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  fnClose: {
    type: Function,
    required: false,
  },
  fnSelect: {
    type: Function,
    required: false,
  },
  excludes: {
    type: String,
    required: false,
    // default: '',
  },
  exclude_lists: {
    type: Array,
    required: false,
    // default: '',
  },
})

const { countClickListFn } = useUtils();

const token = useCookie('token');

const users = ref([]);


const search = ref("");
const sort = ref({
  field: "created_at",
  by: "desc"
});
const selected = ref(-1);
const scrolling = ref({
  page: 1,
  is_last_record: false,
  scrollLeft: 0,
  may_get_data: true
});
const params = {};
params._TimeZoneOffset = new Date().getTimezoneOffset();

const inject_params = () => {
  params.like = "";
  if (search.value != "") {
    params.like = `email:%${search.value}%,fullname:%${search.value}%`;
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
  if(params.first_row) delete params.first_row;
  if(params.page > 1){
    params.first_row = JSON.stringify(users.value[0]);
  }
  const { data, error, status } = await useMyFetch("/users", {
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

const selectRow = () => {
  if (selected.value > -1) {
    props.fnSelect(users.value[selected.value]);
  } else {
    props.fnSelect({
      id: "",
      email: "",
      fullname: ""
    });
  }
}

watch(() => props.show, (newVal, oldVal) => {
  if (newVal == true)
    searching();
}, {
  immediate: true
});

</script>
<style scoped="">
table.sticky thead th:nth-child(2) {
  position: -webkit-sticky;
  position: sticky;
  left: 0;
  z-index: 2;
}

table.sticky thead tr {
  top: 0;
}

</style>
