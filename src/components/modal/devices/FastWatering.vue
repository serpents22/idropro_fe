<template>
  <div>
  <alert 
    :message ="fastWateringStore.setFastWateringStatus.message"
    :modalActive="modalActive"
    :isError="fastWateringStore.setFastWateringStatus.isError"
     @close="closeNotification" />
     <transition name="fade">
       <div class="modal" v-show="isOpen" >
        <transition name="drop-in">
          <div class="modal-inner" v-show="isOpen" ref="target" >
            <div class="modal-content">
            <h1 class="title">{{title}}</h1>
            <div class="mb-8 overflow-y-scroll h-80 text-[8px] sm:text-base">
              <span class="grid grid-cols-2 text-start text-white mb-4 font-semibold">
                <p class="col-span-1 text-center">{{$t('plant')}}</p>
                <p class="col-span-1 text-center">{{ $t('state') }}</p>
              </span>
              <span v-for="device in devicesList" class="grid grid-cols-2 text-start text-white mb-2 border-b border-white">
                <p class="col-span-1 text-center">{{ device.name }}</p>
                <div class="w-full flex justify-center items-center mb-3">
                  <label class="inline-flex relative items-center cursor-pointer">
                    <input 
                    type="checkbox"
                    v-model="device.is_fast_watering"
                    @change="onToggle(device.code,device.is_fast_watering)"
                    class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <!-- <p class="col-span-1 text-center mb-2">{{ device.S988 }}</p> -->
              </span>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
  </div>
</template>

  
<script setup>
import BaseButton from '@/components/button/BaseButton.vue'
import { ref, onMounted, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useDevicesStore } from '@/stores/DevicesStore'
import { useFastWateringStore } from '@/stores/fast-watering/FastWateringStore'
import { storeToRefs } from 'pinia'
  const props = defineProps({
      isOpen: Boolean,
      title: String,
      id: String,
  })

  const fastWateringStore = useFastWateringStore()
  const { fastWateringList } = storeToRefs(useFastWateringStore())
  const devicesStore = useDevicesStore()
  const { devicesList } = storeToRefs(useDevicesStore())


  const fastWateringCommand = ref({
    isFastWatering : false
  })

  async function onToggle(code,state) {
    switch (state) {
      case true:
        fastWateringCommand.value.isFastWatering = true
        break;
      case false:
        fastWateringCommand.value.isFastWatering = false
        break;
    }
    await fastWateringStore.setFastWatering(code, fastWateringCommand.value)
    await devicesStore.loadDevices()
    emits('updated')
    modalActive.value = true
    setTimeout(closeNotification, 3000)
  }

  //open close modal
  const modalActive = ref(false)
  const emits = defineEmits(['close','updated'])
  const form = ref(null)
  const target = ref(null)
  const closeNotification = () => {
    modalActive.value = false
  }
  onClickOutside(target, () => {
    if (props.isOpen) {
      emits('close')
    }
  })

</script>
  
  <style scoped>

  .title {
    @apply 
      text-left border-b-[1px] pb-[18px] 
      sm:text-2xl text-base font-normal text-white mb-6
  }
  

  .message-wrapper {
    @apply flex items-center gap-2
  }
  
  .form-wrapper{
    @apply flex flex-col gap-6
  }

  
.modal {
  @apply 
    bg-[#ABADAF]/20 backdrop-blur-sm
    w-full h-full
    fixed top-0 left-0 px-8 pt-10 pb-4
    overflow-x-hidden overflow-y-auto z-40
    flex 
}

.modal-inner {
  background: linear-gradient(45.06deg, #7F0808 -8.2%, #EA1111 108.15%);
  @apply 
  rounded-[40px] border-2 border-[#000000] sm:w-[600px] w-full h-fit px-4 py-10 sm:p-10 m-auto
}

/* .modal-content {
  @apply 
    relative w-[600px] p-[40px] bg-white gap-[30px] rounded-xl
} */

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.drop-in-enter-active,
.drop-in-leave-active {
  transition: all 0.3s ease-out;
}

.drop-in-enter-from,
.drop-in-leave-to {
  opacity: 0;
  transform: translateY(-50px);
}

.select-option {
  @apply  px-3 py-2
          rounded-lg border bg-white
          text-[14px]
} 

  
  </style>