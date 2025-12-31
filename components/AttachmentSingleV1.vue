<template>
  <div ref="wrapper" class="w-full flex flex-col flex-wrap p-1 justify-center items-center border-solid border-gray-300 border-[1px]">
      <div class="w-full">
        <label for="">{{label}}</label>
      </div>
      <div  class="w-full flex justify-center items-center border-[1px] border-gray-300 mb-1">
        <div class="image-box">
          <div v-if="src">
            <img
              v-if="blob?.type.match(/image/)"
              :src="src"
              class="w-full h-full object-cover"
            />
            <PDFJsView v-if="blob?.type.match(/application\/pdf/)"  :pdfObjUrl="objectUrl" />
          </div>
          <div v-else class="skeleton" />
        </div>
      </div>
      <button v-if="can_remove" type="button" v-show="src" class="bg-gray-600 w-36 text-white" @click="clearFile()">Clear</button>
      <input v-if="can_remove" class="w-full" v-show="!src" @change="changeFile($event)" ref="photo_input" type="file" name="photo">
    </div>

    
</template>
  
<script setup lang="ts">
  // const props = defineProps<{
  //   link: string| null,
    
  // }>()

  const props = defineProps({
  link: {
    type: [String,null],
    required: true,
    default: null,
  },
  label: {
    type: String,
    required: false,
    default:""
  },
  can_remove: {
    type: Boolean,
    required: false,
    default: false
  },
  show: {
    type: Boolean,
    required: false,
    default: false
  },

  // fn: {
  //   type: Function,
  //   required: false,
  // },
})
  
const emit = defineEmits(['setFile','setPreview']);

const photo = ref(false);
// const photo_input = ref<HTMLInputElement | null>(null);
const photo_input = ref(null);
const previewFile = ref(null);
const previewFileType = ref(null);
// const changeFile = ($e) => {
//   var files = $e.target.files;
//   if (files.length > 0) {
//     let reader = new FileReader();
//     reader.onload = function (e) {
//       let result = e.target?.result; //=>return base64/dataurl
//       previewFile.value = result;
//       emit('setPreview',result);
//     }
//     reader.readAsDataURL(files[0]);
//     emit('setFile',files[0]);
//   }
// };
const isUserFile = ref(false)

const changeFile = ($e) => {
  const files = $e.target.files
  if (!files || !files.length) return
  
  isUserFile.value = true

  const file = files[0]           // ✅ ini File (turunan Blob)
  blob.value = file
  
  if (objectUrl) URL.revokeObjectURL(objectUrl)

  objectUrl = URL.createObjectURL(file) // ✅ AMAN
  src.value = objectUrl
  emit('setPreview',"exist");
  emit('setFile', file)
}




const clearFile = () => {
  unload(true)

  // 3. Reset input file
  const el = photo_input.value as HTMLInputElement | null
  if (el) el.value = ''

  // 4. Emit ke parent
  emit('setFile', null)
  emit('setPreview', null)
};

  const wrapper = ref<HTMLElement | null>(null)
  const src = ref<string | null>(null)
  let objectUrl: string | null = null
  const token = useDynamicPathCookie('token');
  const { apiBase } = useApiBaseUrl();
  const blob = ref();

  watch(
  () => props.link,
  (val) => {
    if (!val) return
    if (wrapper.value) {
      load()
    }
  },
  { immediate: true }
)
  const loadedOnce = ref(false)

  watch(
  () => props.show,
  (val) => {
    unload(true);
    loadedOnce.value = false;
    isUserFile.value = false;
  },
  { immediate: true }
)
  async function load() {

    // console.log("++++++trigger load");
    // console.log("props.link",props.link);
    // console.log("src.value",src.value);
    // console.log("isUserFile.value",isUserFile.value);
    // console.log("loadedOnce.value",loadedOnce.value);
    // console.log("------trigger load");

    if (!props.link ||src.value || props.link =='exist' || isUserFile.value || loadedOnce.value) return

    const url = props.link.startsWith('http')
    ? props.link
    : `${apiBase}${props.link}`

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token.value}`
      },
    })

    if (!res.ok) {
      let elPhotoInput = photo_input.value;
      if (elPhotoInput) {
        elPhotoInput.value = "";
      }
      return;
    }
  
    blob.value = await res.blob()
    objectUrl = URL.createObjectURL(blob.value)
    src.value = objectUrl
    loadedOnce.value = true
  }
  
  function unload(force=false) {
    if ((isUserFile.value && force==false) || (loadedOnce.value && force==false)) return
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl)
      objectUrl = null
    }
    src.value = null
    blob.value = null
  }
  
  useLazyImage(wrapper, load, unload, {
    rootMargin: '300px 0px',
    threshold: 0
  })

  onUnmounted(()=>{
    loadedOnce.value = false
  })
</script>

<style scoped>
    .skeleton {
  background: linear-gradient(
    90deg,
    #eee 25%,
    #ddd 37%,
    #eee 63%
  );
  animation: shimmer 1.4s infinite;
}
</style>