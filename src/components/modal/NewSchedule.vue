<template>
  <div>
    <alert :message="createPlanStatus.message" :modalActive="modalActive" :isError="createPlanStatus.isError"
      @close="closeNotification" />
    <transition name="fade">
      <div class="modal" v-show="isOpen">
        <transition name="drop-in">
          <div class="modal-inner" v-show="isOpen" ref="target">
            <div class="modal-content">
              <h1 class="title">{{ title }}</h1>
              <form @submit.prevent="onSubmit" preven class="form-wrapper">
                <div class="field-wrapper">
                  <label for="startDate">Start Date</label>
                  <input name="startDate" type="date" placeholder="Start Date" class="white" label="Start Date"
                    v-model="props.startDate" required />
                </div>
                <div class="field-wrapper">
                  <label for="startDate">Start Time</label>
                  <input name="startDate" type="time" placeholder="Start Date" class="white" label="Start Date"
                    v-model="startTime" required />
                </div>
                <div class="field-wrapper">
                  <label for="endDate">End Date</label>
                  <input name="endDate" type="date" placeholder="End Date" class="white" label="End Date"
                    v-model="endDate" required />
                </div>
                <div class="field-wrapper">
                  <label for="endDate">End Time</label>
                  <input name="endDate" type="time" placeholder="End Date" class="white" label="End Date"
                    v-model="endTime" required />
                </div>
                <div class="select-option flex flex-col gap-1 text-left">
                  <label for="programName" class="text-xs font-bold ">{{ $t('program') }}</label>
                  <select name="programName" v-model="selectedProgram"
                    class="cursor-pointer bg-transparent text-[#3a3a3a]" required>
                    <option class="text-[#3a3a3a]" v-for="program in programs" :key="program" :value="program">
                      {{ $t('program') }} {{ program }}</option>
                  </select>
                </div>
                <div class="sm:flex-row flex-col flex justify-between gap-4 sm:gap-10">
                  <BaseButton type="button" class="outlined" :label="cancelLabel" @click="cancelForm" />
                  <BaseButton type="submit" class="filled" :label="registerLabel" :loading="createPlanLoading" />
                </div>
              </form>
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
import { ref, onMounted, onBeforeUpdate } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { usePlanningStore } from '@/stores/planning/PlanningStore'

//stores
const planningStore = usePlanningStore()
const { createPlanStatus, createPlanLoading } = storeToRefs(usePlanningStore())


const { t } = useI18n();

const props = defineProps({
  isOpen: Boolean,
  title: String,
  startDate: Date,
  deviceCode: String,
})

const programs = ref(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'])
const selectedProgram = ref('')
const startTime = ref('')
const endDate = ref(props.startDate)
const endTime = ref('')

const modalActive = ref(false)
const cancelLabel = ref(t('cancel'))
const registerLabel = ref(t('save'))
const regButtonClick = ref(0)
const cancelButtonClick = ref(0)

const onSubmit = async () => {
  const payload = {}


  const startLocalDateTimeString = `${props.startDate}T${startTime.value}`
  const endLocalDateTimeString = `${endDate.value}T${endTime.value}`

  payload.startAt = new Date (startLocalDateTimeString).toISOString()
  payload.endAt = new Date (endLocalDateTimeString).toISOString()
  payload.programName = selectedProgram.value
  payload.deviceCode = props.deviceCode
  console.log(payload)
  regButtonClick.value = ++regButtonClick.value
  if (regButtonClick.value == 1) {
    registerLabel.value = t('dataCorrect')
  }

  if (regButtonClick.value == 2) {
    await planningStore.createPlan(payload)
    modalActive.value = true
    if (createPlanStatus.value.isError == true) {
      setTimeout(closeNotification, 3000)
    } else {
      startTime.value = ''
      endDate.value = props.startDate
      endTime.value = ''
      setTimeout(closeNotification, 3000)
    }
    registerLabel.value = t('save')
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
  registerLabel.value = t('save')
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
  @apply bg-[#ABADAF]/20 backdrop-blur-sm w-full h-full fixed top-0 left-0 px-8 py-10 overflow-x-hidden overflow-y-auto z-40 justify-center items-center flex
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