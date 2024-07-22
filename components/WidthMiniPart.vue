<template>
  <div class="w-full flex flex-row flex-wrap">
    <template v-for="key in Object.keys(selected._)" >
      <div v-if="selected._[key].val" class="flex flex-col flex-wrap p-1">
        <label for="" class="text-xs">{{selected._[key].text}}</label>
        <div class="flex">
          <div class="flex items-center pr-[1px]">
            <component
              v-if="selected._[key].tcon"
              :is="resolveComponent(selected._[key].tcon)" />
          </div>
          <div>
            {{ selected._[key].val  }}
          </div>
        </div>
      </div>
    </template>
  </div>
  <div v-if="selected.note" class="w-full text-red-500 text-xs">
    {{ selected.note }}
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({

  selected:{
    type:Object,
    required:false,
    default:{
      _:{},
      id:-1,
      name:"",
      title:"",
    }
  }
  
})
</script>