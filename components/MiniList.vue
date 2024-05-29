<template>

    <div class="w-full h-full relative">
    <input type="text" :value="inputVal"
      @keyup="change($event.target.value)" 
      @blur="blur($event),$emit('nextBlur',$event)"
    >
    {{lists}}
      <div class="absolute bottom-0">
        <div class="w-full" v-for="list in lists" @click="list.get"> {{ list.show}}  </div>
      </div>
    </div>
</template>

<script lang="ts" setup>

const props = defineProps({
  value: {
    type: String,
    required: true,
    default: "",
  },
  lists: {
    type: Array,
    required: false,
    default:[]
  },
})

const inputVal = ref("");
// const emit = defineEmits(['input','nextBlur']);
// const writeIDFormat=(m:any)=>{
//   m = m.toString().replace(/[^,0-9]/ig, '').replace(',','.').replace(/,/ig, '');
//   let splitM = m.split(".");
//   splitM[0] = splitM[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
//   let joinM= splitM.join(",");
//   return joinM;
// };

// const blurIDFormat=(m:any)=>{
//   m = m.toString().replace(/[^,0-9]/ig, '').replace(',','.').replace(/,/ig, '');
//   let splitM = m.split(".");
//   splitM[0] = splitM[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
//   if (splitM.length > 1) {
//     splitM[1] = splitM[1].replace(/0+$/,"");
//   }
//   let joinM= splitM.join(",");
//   return joinM;
// };

// const oriIDFormat=(m:any)=>{
//   return m.toString().replace(/[^,0-9]/ig, '').replace(',','.').replace(/,/ig, '');
// };

// const change=(val:any)=>{
//   // if(val.target) val.preventDefault();
//   // let result = (typeof val == 'object' ? val.target.value : val).toString();  
//   // // if(result && result.match(/[a-z]+/ig)){
//   // //   inputVal.value = 0;
//   // // }
//   // // else
//   // inputVal.value = writeIDFormat(result);
// }

const blur=(val:any)=>{
  // let result = typeof val == 'object' ? val.target.value : val;
  // result = result || props.value;
  // inputVal.value = blurIDFormat(result);  
  // emit('input',Number(oriIDFormat(result))); 
}

onMounted(() => {
  change(props.value)
});



// const reAbj = /[a-zA-Z .,<>?/\\|:;'"\[\]{}=+=_()*&^%$#@!~`]/;
// let full = before.replace(/([.?*+^$[\]\\/(){}|-])/g, "");

const change=(val)=>{
  // let newVal = val;
  
  // if(val.toString().length > 1)
  // newVal = val.toString().replace(/^0/g, "");
  
  // inputVal.value = writeIDFormat(newVal);
}


watch(() => props.value, (newVal, oldVal) => {
  change(newVal);
}, {
  immediate: true,
  deep:true
});
</script>
<style scoped>

</style>
