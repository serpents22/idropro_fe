<template>
  <div>
    <alert :message="deletePlanningStatus.message" :modalActive="modalActive" :isError="deletePlanningStatus.isError"
      @close="closeNotification" />
    <transition name="fade">
      <div class="modal" v-show="isOpen">
        <transition name="drop-in">
          <div class="modal-inner" v-show="isOpen" ref="target">
            <div class="modal-content">
              <h1 class="title">{{ title }}</h1>
              <div class="flex flex-col gap-4 items-start mb-6">
                <div class="flex flex-col text-left text-white">
                  <p class="font-semibold">Program Name</p>
                  <p>{{ props.event.programName }}</p>
                </div>
                <div class="grid grid-cols-2 w-full">
                  <div class="flex flex-col text-left text-white">
                    <p class="font-semibold">Start Date</p>
                    <p>{{ props.event.start }}</p>
                  </div>
                  <div class="flex flex-col text-left text-white">
                    <p class="font-semibold">End Date</p>
                    <p>{{ props.event.end }}</p>
                  </div>
                </div>
                <div class="flex flex-col text-left text-white">
                  <p class="font-semibold">Stations Active</p>
                  <div v-if="planningStore.getPlanningLoading" class="mt-2 max-w-sm animate-pulse">
                    <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                  </div>
                  <p v-if="planning.isStationEmpty && !planningStore.getPlanningLoading">No Station</p>
                  <p v-if="!planningStore.getPlanningLoading" v-for="station in planning.stations">{{ station.groupName
                    }}</p>
                </div>
              </div>
              <!-- <BaseButton type="submit" class="filled__red" :label="deleteLabel" :loading="deletePlanningLoading"
                @click="deletePlanning" /> -->
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>


<script setup>
import BaseButton from '@/components/button/BaseButton.vue'
import { useDeviceManagement } from '@/stores/DeviceManagementStore'
import { storeToRefs } from 'pinia'
import { ref, onMounted, onBeforeUpdate, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { usePlanningStore } from '@/stores/planning/PlanningStore'

//stores
const planningStore = usePlanningStore()
const { deletePlanningStatus, planning, deletePlanningLoading } = storeToRefs(usePlanningStore())

const { t } = useI18n();

const props = defineProps({
  isOpen: Boolean,
  title: String,
  id: String,
  deviceCode: String,
  event: Object,
})


watch(() => props.isOpen, () => {
  if (props.isOpen) {
  planningStore.planning = []
  planningStore.getPlanning(props.id, { deviceCode: props.deviceCode })
  }
})

const modalActive = ref(false)
const cancelLabel = ref(t('cancel'))
const deleteLabel = ref(t('delete'))
const regButtonClick = ref(0)
const cancelButtonClick = ref(0)

const deletePlanning = async () => {
  regButtonClick.value = ++regButtonClick.value
  if (regButtonClick.value == 1) {
    deleteLabel.value = t('dataCorrect')
  }

  if (regButtonClick.value == 2) {
    await planningStore.deletePlanning(props.id)
    emits('close')
    modalActive.value = true
    setTimeout(closeNotification, 3000)
    deleteLabel.value = t('delete')
    regButtonClick.value = 0
  }
}

const closeNotification = () => {
  modalActive.value = false
}
// Define custom events
const emits = defineEmits(['close'])

const form = ref(null)
const target = ref(null)

onClickOutside(target, () => {
  cancelButtonClick.value = 0
  regButtonClick.value = 0
  deleteLabel.value = t('delete')
  cancelLabel.value = t('cancel')
  if (props.isOpen) {
    emits('close')
  }
})

function cancelForm() {
  cancelButtonClick.value = ++cancelButtonClick.value
  switch (cancelButtonClick.value) {
    case 1:
      cancelLabel.value = t('dataLost')
      break;
    case 2:
      emits('close')
      cancelButtonClick.value = 0
      cancelLabel.value = t('cancel')
      break;
  }
}




</script>

<style scoped>
.title {
  @apply text-left border-b-[1px] pb-[18px] text-[28px] font-normal text-white mb-4 sm:mb-10 text-base sm:text-xl
}


.message-wrapper {
  @apply flex items-center gap-2
}

.form-wrapper {
  @apply flex flex-col gap-6
}


.modal {
  @apply bg-[#ABADAF]/20 backdrop-blur-sm w-full h-full fixed top-0 left-0 px-8 py-10 overflow-x-hidden overflow-y-auto z-[999999] justify-center items-center flex
}

.modal-inner {
  background: linear-gradient(45.06deg, #010AD1 -8.2%, #1BF728 108.15%);
  @apply rounded-[40px] border-2 border-[#FFEE58] max-w-[500px] w-full h-fit p-10
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
  @apply px-2 py-1 sm:px-3 sm:py-2 rounded-lg border bg-white text-[12px] sm:text-base
}

.field-wrapper {
  @apply flex flex-col gap-1 text-left bg-white px-3 py-2 rounded-lg
}

.field-wrapper label {
  @apply text-xs font-semibold
}
</style>