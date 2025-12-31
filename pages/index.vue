<script lang="ts" setup>
import { useCommonStore } from '~/store/common';
useCommonStore().loading_full = false;

</script>
<template>
    <Header :title="'Dashboard'" />

    <!-- flex grow flex-col justify-center px-6 py-12 lg:px-8 overflow-auto -->
    <div class="flex grow flex-row p-2 overflow-auto">
        <div class="grid grid-cols-2 gap-1">
            <a href="/service" target="_blank"> 
                <div class="bg-yellow-400 rounded p-2 text-white items-center aspect-square grid grid-row-2 place-items-center text-center">
                    <div>
                        <IconsCog class="mr-2 text-8xl"/>  
                    </div>
                    <div class="text-2xl">
                        SERVICE APPS
                    </div>
                </div>
            </a>
    
            <a href="http://192.168.1.248/genk/logistik/" target="_blank"> 
                <div class="bg-blue-400 rounded p-2 text-white flex items-center aspect-square grid grid-row-2 place-items-center text-center">
                    <div>
                        <IconsSyncCloud class="mr-2 text-8xl"/>  
                    </div>
                    <div class="text-2xl">
                        MANDIRI EXPORT APPS
                    </div>
                </div>
            </a>
        </div>
        
        
        
    </div>
</template>