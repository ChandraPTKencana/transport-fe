
<template>
  <div class="w-full flex justify-center items-center grow h-0 pb-1 px-1 flex-col">
    <div class="w-full flex justify-end">
      <button type="button" name="button" class="m-1 text-xs "
        @click="cogs_show=true">
        <IconsTableHeaderEye />
      </button>
    </div>

    <div v-if="cogs_show" class="w-full h-full flex items-center justify-center fixed top-0 left-0 z-20 p-3"
    style="background-color: rgba(255,255,255,0.9);">
      <div class="relative" style="width:95%; height: 90%;">
        <div class="absolute -top-7 right-0 bg-white"
          style="position: absolute; padding:5px 10px; border: solid 1px #ccc; border-bottom: none; border-top-right-radius: 5px;  border-top-left-radius: 5px;">
          <IconsTimes  style="color:black; cursor:pointer;" @click="cogs_show=false"/>
        </div>
        <div class="w-full h-full flex flex-col items-center justify-content-center bg-white">
          <div class="w-full text-blue-600 font-bold grid-">
            Set Show Column Field           
          </div>            
          <div class="w-full flex flex-wrap overflow-auto">
            <div v-for="(fd,index) in tbody_fields" class="p-2 m-1 font-bold cursor-pointer" :class="fd.tbl_show == 1 ? 'bg-green-600 text-white' : 'bg-gray-400 text-black'" @click="toggleVisible(fd,index)">
              {{ treeVisible(fd) }}
            </div>
          </div>
          <div class="w-full flex justify-end">
            <button class="bg-white font-bold mr-2"  @click="toggleAllFields('select')">
              Select All
            </button>
            <button class="bg-white font-bold" @click="toggleAllFields('invert')">
              Invert All
            </button>
          </div>
        </div>
        <div
          style="position: absolute; top: 12px; right: 98px; background-color: rgba(255,255,255,0); width: 37px; height: 36px; z-index:1; cursor: pointer;"
          @click="cogs_show=false">
        </div>
      </div>
    </div>



    <div class="w-full flex justify-center items-center grow h-0 text-sm flex-col">

      <div v-if="tbody.length == 0" class="">
        Maaf Tidak Ada Record
      </div>

      <div v-else class="w-full h-full overflow-auto" role="sticky" ref="loadRef" @scroll="loadMore">
        <table class="tacky">
          <thead  class="sticky top-0 !z-[2]">
            <tr v-for="(ts,idx) in thead_split">
                <template v-for="th in ts" >
                  <th v-if="th.permit" v-show="th.tbl_show" :rowspan="th.rowspan" :colspan="th.colspan" :class="th.freeze==1?'freeze':''">{{ th.label }}</th>
                </template>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(tb,index) in tbody" :key="index" @click="$emit('setSelected',index)"
              :class="selected == index ? 'active' : ''">
              <template v-for="tf in tbody_fields" >
                <component
                  :is="tf.freeze==0 ? 'td' : 'th'"
                  class="my-list"
                  v-if="tf.permit" v-show="tf.tbl_show"
                >
                  <div class="flex items-center" :class="tf.class ? tf.class : 'justify-center'">
                    <!-- {{ tf.id }} -->
                    <slot :name="tf.key" :item="tb" :index="index">
                      <template v-if="tf.dateformat">
                        {{ tb[tf.key] ? $moment(tb[tf.key]).format(tf.dateformat)  : "" }}
                      </template>
                      <template v-else>
                        {{ tb[tf.key] ? checkType(tb[tf.key],tf.type)  : "" }}
                      </template>
                    </slot>
                  </div>
                </component>
              </template>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="loadDataType=='paginate'" class="w-full pt-1 flex justify-end">
        <div class="flex gap-2">          
          <div class="w-7 h-7 flex items-center justify-center ring-2 ring-slate-800 cursor-pointer text-sm" @click="paginateToPage(1)" v-if="pagination.list_page.indexOf(1) == -1">
            <IconsCaretLeftDoubleBold />
          </div>
          <div class="w-7 h-7 flex items-center justify-center ring-2 ring-slate-800 cursor-pointer text-sm" @click="paginateToPage(pagination.current_page - 1)" v-if="pagination.list_page.indexOf(1) == -1">
            <IconsCaretLeftBold />
          </div>
  
          <div class="flex gap-2">
            <div v-for="lp in pagination.list_page" :class="lp==pagination.current_page ?'bg-slate-800 text-white' : 'bg-white text-slate-800'" class="px-3 h-7 flex items-center justify-center ring-2 ring-slate-800 cursor-pointer text-sm"
            @click="paginateToPage(lp)">
              {{lp}}
            </div>
          </div>

          <div class="w-7 h-7 flex items-center justify-center ring-2 ring-slate-800 cursor-pointer text-sm" @click="paginateToPage(pagination.current_page + 1)" v-if="pagination.list_page.indexOf(pagination.last_page) == -1">
            <IconsCaretRightBold />
          </div>
          <div class="w-7 h-7 flex items-center justify-center ring-2 ring-slate-800 cursor-pointer text-sm" @click="paginateToPage(pagination.last_page)" v-if="pagination.list_page.indexOf(pagination.last_page) == -1">
            <IconsCaretRightDoubleBold />
          </div>
        </div>
      </div>
    </div>
  </div>


 


</template>

<script setup>

const props = defineProps({
    title: {
        type: String, // Define the prop type
        required: false, // Specify if the prop is required
        default: 'Header Info', // Set a default value for the prop
    },
    thead:{
        type: Array, 
        required: true,
        default: [],
    },
    tbody:{
        type: Array, 
        required: false,
        default: [],
    },
    selected:{
      type:Number,
      required:false,
      default:-1
    },
    scrolling:{
      type:Object,
      required:false,
      default:{
        page: 1,
        is_last_record: false,
        scrollLeft: 0,
        may_get_data: true
      }
    },
    fnCallData:{
      type:Function,
      required:true,
    },
    loadDataType:{
      type:String,
      required:false,
      default:"scroll"
    }
});

const tbody_fields = ref([]);
const thead_split = ref([]);
let temp_rows=[];
let total_deep=1;
const rowColThead = (data,prev="",parentIdx=[])=>{
  data.forEach((e,k)=>{
    if(e.tbl_show==1){
      if(prev) {
        e.dChild = prev;
        e.parentIdx = parentIdx;
      };
      temp_rows.push(e);

      if(e.childs != undefined && e.childs.length > 0){
        let np = e.key;
        parentIdx = [k];
        if(prev){
          np=prev+","+np;
          parentIdx.push(k);
        }
        total_deep = (total_deep >= np.split(",").length + 1) ? total_deep  : np.split(",").length + 1;
        rowColThead(e.childs,np,parentIdx);
      }
    }
    // if(e.dChild && temp_rows.indexOf(e.dChild)==-1) temp_rows.push(e.dChild);
  })
};

const setTbodyFields = (data,parentIdx=[])=>{
  data.forEach((x,k)=>{
      if(parentIdx.length>0) {
        x.parentIdx = [...parentIdx];
      };

    if(x.childs==undefined || x.childs.length == 0)
    {
      tbody_fields.value.push(x);
    }
    else{
      if(parentIdx.length > 0){
        parentIdx.push(k);
      }else{
        parentIdx = [k];
      }
      setTbodyFields(x.childs,parentIdx);
    }
  })
  parentIdx.pop();
}

const recrusiveThead = (data)=>{
    let ori = JSON.parse(JSON.stringify(data));
    let dt = JSON.parse(JSON.stringify(data));

    thead_split.value.push(dt.map((x)=>{
        if(x.tbl_show==undefined) x.tbl_show=1;
        if(x.permit==undefined) x.permit=1;
        if(x.freeze==undefined) x.freeze=0;
        delete x.childs;
        return x;
    }));

    let childs = [];
    
    ori.filter((x)=>{
        return x.childs != undefined && x.childs.length > 0 ;
    }).forEach(e => {
        let nc = JSON.parse(JSON.stringify(e.childs));
        childs = childs.concat(nc);
    });;
    
    if(childs.length > 0)
    return recrusiveThead(childs);
};
let colx=0;
const setRowDeep = (data)=>{
  let rDataIdx = data.map((x)=>x.key);
  temp_rows.every(e=> {
    if(e.tbl_show==1){
      let hasChilds = e.childs == undefined ? [] : e.childs.filter((x)=>x.tbl_show==1);
    colx=(hasChilds.length > 0 && e.tbl_show==1 ) ? hasChilds.length : 1;
    deepColspan(e.childs);
    
      if(e.dChild == undefined){
        let idx = rDataIdx.indexOf(e.key);
        if(idx > -1) {
            // console.error("ID not found",e);
            // return false;
          if(e.childs==undefined || e.childs.length == 0)
          data[idx].rowspan = total_deep;
      
          if(e.childs!=undefined && e.childs.length > 0)
          data[idx].rowspan = 1;
  
          data[idx].colspan=colx;
        };
  
      }else{
        let the_parent = e.dChild.split(",");
        let nDT = searchTheIndex(data,the_parent,1,e);
        if(e.childs == undefined || e.childs.length == 0){
          nDT.rowspan = total_deep - e.dChild.split(",").length;
        }else{
          nDT.rowspan = 1;
        }
        nDT.colspan = colx;
      }
    }

    return true;
  });

  return data;
}

const searchTheIndex = (data,parents=[],parent,e)=>{
  
  if(parents.length==0) {
    let idx=data.childs.map(x=>x.key).indexOf(e.key);
    return data.childs[idx];
  };

  if(parents.length>0){
    let toloop=data;
    if(parent==0){
      toloop=data.childs;
    }
    let idx = toloop.map((x)=>x.key).indexOf(parents[0]);
    if(idx == -1) {
      console.error("ID not found");
      return;
    };
    parents.shift();
    return searchTheIndex(toloop[idx],parents,0,e);    
  }


}

const deepColspan=(a)=>{

  let lvl1 = a == undefined ? [] : a.filter((x)=>x.tbl_show==1);

  if(lvl1.length > 0){
    a.forEach(g => {
      let lvlb = g.childs==undefined ? [] : g.childs.filter((x)=>x.tbl_show==1);
      if(lvlb.length > 0 && g.tbl_show == 1){
        colx+=(lvlb.length - 1);
        deepColspan(g.childs);
      }
    });
  }
}

const changeableData=ref([]);

const removeUnusedData = (data,idxs=[])=>{

  data.forEach((e,idx)=>{
    if((e.permit!=undefined && e.permit == 0)){
      data.splice(idx,1);
    }else{
      if(e.permit == undefined) e.permit=1;
      if(e.tbl_show == undefined) e.tbl_show=1;
      if(e.freeze == undefined) e.freeze=0;
      data.splice(idx,1,e);

      if(e.childs!=undefined && e.childs.length > 0){
        idxs.push(e);
        removeUnusedData(e.childs,idxs);
      }
    }
  })

  idxs.reverse();
  idxs.forEach((e,k)=> {
    let thelength= e.childs.filter((x)=>x.tbl_show==1).length;
    if(thelength==0) e.tbl_show = 0;
    else e.tbl_show = 1;
  });
  idxs.reverse();
  

  idxs.shift();
}

const checkChildShow = (data,idxs=[])=>{
  data.forEach((e,idx)=>{
    if(e.childs!=undefined && e.childs.length > 0){
        idxs.push(e);
        checkChildShow(e.childs,idxs);
      }
  })

  idxs.reverse();
  idxs.forEach((e,k)=> {
    let thelength= e.childs.filter((x)=>x.tbl_show==1).length;
    if(thelength==0) e.tbl_show = 0;
    else e.tbl_show = 1;
  });
  idxs.reverse();
  

  idxs.shift();
}


watch(()=>props.thead,(newVal, oldVal) => {
    changeableData.value = JSON.parse(JSON.stringify(newVal));
    removeUnusedData(changeableData.value);
}, {
  deep:true,
  immediate: true
});

watch(()=>changeableData.value,(newVal, oldVal) => {
    temp_rows = [];
    thead_split.value=[];
    tbody_fields.value=[];
    checkChildShow(newVal);
    rowColThead(JSON.parse(JSON.stringify(newVal)));
    let toExplode = setRowDeep(JSON.parse(JSON.stringify(newVal)));
    setTbodyFields(toExplode);
    recrusiveThead(toExplode);
}, {
  deep:true,
  immediate: true
});


const emit = defineEmits(['setSelected','setScrollingPage']);

const { pointFormat } = useUtils();

const checkType = (val,type="")=>{
  if(type=="default") return val;
  if(val == parseFloat(val) ) return pointFormat(val);
  return val;
}

const loadRef = ref(null);

const loadMore = async () => {
  if(props.loadDataType!="scroll") return;

  if (!props.scrolling.may_get_data) return;
  let parent = loadRef.value;

  if (parent.scrollLeft != props.scrolling.scrollLeft) {
    props.scrolling.scrollLeft = parent.scrollLeft;
    return;
  }

  if (props.scrolling.is_last_record) return;

  let stuck = Math.round(parent.scrollTop) + parent.clientHeight >= parent.scrollHeight - 1 ? true : false;
  if (!stuck) return;

  let countPage = props.scrolling.page+1;
  emit('setScrollingPage',countPage );
  await props.fnCallData();

}

const cogs_show=ref(false);

const treeVisible = (data)=>{
  let label= data.label;
  if(data.parentIdx!=undefined && data.parentIdx.length > 0)
  {
    let parentLink = "";
    let parentLblArr = [];
    data.parentIdx.forEach((e,k)=> {  

      if(k==0)  parentLink =  changeableData.value[e];
      else parentLink = parentLink.childs[e]

      parentLblArr.push(parentLink.label);
    });
    label = parentLblArr.join(" ") + " " +label;
  }

  return label;
}

const toggleVisible=(data)=>{

  if(data.parentIdx!=undefined && data.parentIdx.length > 0){
    let parentLink = "";

    data.parentIdx.forEach((e,k)=> {  
      if(k==0)  parentLink =  changeableData.value[e];
      else parentLink = parentLink.childs[e]
    });

    let idx = parentLink.childs.map(x=>x.key).indexOf(data.key);
    if(idx!=-1)
    parentLink.childs[idx].tbl_show = !parentLink.childs[idx].tbl_show;
  }else{

    let idx = changeableData.value.map(x=>x.key).indexOf(data.key);
    if(idx!=-1)
    changeableData.value[idx].tbl_show = !changeableData.value[idx].tbl_show;
  }
}

const toggleAllFields=(v)=>{
  let jparse = JSON.parse(JSON.stringify(changeableData.value));
  if(v=="select"){
    changeTblShowAllFieldTo(jparse,1);
  }else{
    changeTblShowAllFieldTo(jparse,0);
  }
  changeableData.value = jparse;
}

const changeTblShowAllFieldTo=(data,x)=>{
  data.forEach((e)=>{
    e.tbl_show = x;
    if(e.childs !== undefined && e.childs.length > 0){
      changeTblShowAllFieldTo(e.childs,x);
    }
  })
}


const pagination = ref({
  current_page: 1,
  list_page:[],
  last_page:7,
  piece:2
  // perPage: 100,
});

const updatePagination = ()=>{
  pagination.value.current_page = props.scrolling.page;
  if(props.scrolling.is_last_record) pagination.value.current_page--;
  
  pagination.value.list_page = [];
  if(pagination.value.current_page>0){
    let limit_prev = 0;
    let limit_next = 0;
    let next = 0;
    let prev = 0;

    for (let index = pagination.value.current_page; index >= (pagination.value.current_page - pagination.value.piece); index--) {
      if(index>0) limit_prev=index;
      else next++;      
    }

    next += pagination.value.piece;

    if(pagination.value.current_page + next > pagination.value.last_page)
    {
      limit_next = pagination.value.last_page;
      for (let index = limit_prev - 1; index >= limit_prev - (pagination.value.current_page + next - limit_next); index--) {
        if(index>0) prev++;
      }
      limit_prev-=prev;
    }
    else
    limit_next = pagination.value.current_page + next;
    
    // if(limit_prev==0) limit_prev = pagination.value.current_page;

    for (let index = limit_prev; index <= limit_next; index++) {
      pagination.value.list_page.push(index);
    }

  }
}

watch(()=>props.scrolling.page,(newVal, oldVal) => {
  if(newVal==1 && loadRef.value) loadRef.value.scrollTop = 0;
  updatePagination();
}, {
  deep:true,
  immediate: true
});

watch(()=>props.scrolling.is_last_record,(newVal, oldVal) => {
  updatePagination();
}, {
  deep:true,
  immediate: true
});

const paginateToPage=async(page)=>{
  if(props.loadDataType!="paginate") return;
  emit('setScrollingPage',page );
  await props.fnCallData();
  if(loadRef.value)loadRef.value.scrollTop = 0;
}


// for example
// const fields_thead=ref([
//   {key:"status",label:"Status"},
//   {key:"app1",label:"App 1"},
//   {key:"app2",label:"App 2"},
//   {key:"id",label:"ID"},
//   {key:"tanggal",label:"U.Jalan Per",dateformat:"DD-MM-Y"},
//   {key:"no_pol",label:"No Pol"},
//   {key:"xto",label:"Tujuan"},
//   {key:"tipe",label:"Tipe"},
//   {key:"jenis",label:"Jenis"},
//   {key:"amount",label:"Amount"},
//   {key:"cost_center",label:"Cost Center",childs:[
//     {key:"cost_center_code",label:"Code"},
//     {key:"cost_center_desc",label:"Desc"},
//   ]},
//   {key:"pvr",label:"PVR",childs:[
//     {key:"pvr_no",label:"No"},
//     {key:"pvr_total",label:"Total"},
//     {key:"pvr_completed",label:"Completed"},
//   ]},
//   {key:"pv",label:"PV",childs:[
//     {key:"pv_no",label:"No"},
//     {key:"pv_total",label:"Total"},
//   ]},
//   {key:"transition_to",label:"Peralihan"},
//   {key:"ticket_a",label:"Ticket A",childs:[
//     {key:"ticket_a_no",label:"No"},
//     {key:"ticket_a_bruto",label:"Bruto"},
//     {key:"ticket_a_tara",label:"Tara"},
//     {key:"ticket_a_netto",label:"Netto"},
//     {key:"ticket_a_supir",label:"Supir",childs:[
//       {key:"test",label:"test no",childs:[
//         {key:"test2",label:"test no2",tbl_show:0},
//         {key:"test2xx",label:"test no2xx",permit:0},
//       ]},
//       {key:"test0",label:"test no2x"},
//     ]},
//     {key:"ticket_a_no_pol",label:"No Pol"},
//     {key:"ticket_a_in_at",label:"In At",dateformat:"DD-MM-Y HH:mm:ss"},
//     {key:"ticket_a_out_at",label:"Out At",dateformat:"DD-MM-Y HH:mm:ss"},
//   ]},
//     {key:"ticket_b",label:"Ticket B",childs:[
//       {key:"ticket_b_no",label:"No"},
//       {key:"ticket_b_bruto",label:"Bruto"},
//       {key:"ticket_b_tara",label:"Tara"},
//       {key:"ticket_b_netto",label:"Netto"},
//       {key:"ticket_b_supir",label:"Supir"},
//       {key:"ticket_b_no_pol",label:"No Pol",childs:[
//         {key:"test3",label:"Nox"},
//       ]},
//       {key:"ticket_b_in_at",label:"In At",dateformat:"DD-MM-Y HH:mm:ss"},
//       {key:"ticket_b_out_at",label:"Out At",dateformat:"DD-MM-Y HH:mm:ss"},
//     ]},
//   {key:"supir",label:"Supir"},
//   {key:"kernet",label:"Kernet"},
//   {key:"created_at",label:"Created At",dateformat:"DD-MM-Y HH:mm:ss"},
//   {key:"updated_at",label:"Updated At",dateformat:"DD-MM-Y HH:mm:ss"},
// ]);
</script>

<style scoped="">
.freeze {
  position: -webkit-sticky;
  position: sticky;
  left: 0;
  z-index: 2;
}
</style>


