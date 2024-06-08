<template>
  <div class="stato-programmi-container">
    <sidebar :noSocial="true" :backOn="true" />
    <div class="device-container">
      <deviceCard :small="true" :content="newData" />
      <div class="xs-icon-card">
        <img src="@/assets/stato_programmi.png">
        <p>{{ $t('programStatus') }}</p>
      </div>
    </div>
    <div class="content">
      <IdroTitle :title="title" />
      <div class="main">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th class="text-center">
                  <span>{{ $t('program') }}</span>
                </th>
                <th class="text-center">
                  <span>{{ $t('status') }}</span>
                </th>
                <th class="text-center">
                  <span>{{ $t('stationUsed') }}</span>
                </th>
                <th>
                  <span>{{ $t('remainingTime') }}</span>
                </th>
                <th>
                  <span>{{ $t('action') }}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td>
                  <div role="status" class="max-w-sm animate-pulse">
                    <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-800 w-full"></div>
                  </div>
                </td>
                <td>
                  <div role="status" class="max-w-sm animate-pulse">
                    <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-800 w-full"></div>
                  </div>
                </td>
                <td>
                  <div role="status" class="max-w-sm animate-pulse">
                    <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-800 w-full"></div>
                  </div>
                </td>
                <td>
                  <div role="status" class="max-w-sm animate-pulse">
                    <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-800 w-full"></div>
                  </div>
                </td>
                <td>
                  <div role="status" class="max-w-sm animate-pulse">
                    <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-800 w-48"></div>
                  </div>
                </td>
              </tr>
              <tr v-for="tData in satData" :key="tData.programma">
                <td>
                  <p>{{ tData.programma }}</p>
                </td>
                <td>
                  <div class="w-full flex justify-center">
                    <Indicator :status="tData.stato" />
                  </div>
                </td>
                <td>
                  <p>{{ tData.stazione }}</p>
                </td>
                <td class="text-left">
                  <p>{{ tData.tempo }}</p>
                </td>
                <td class="text-left">
                  <p>{{ tData.azione }}</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDevicesStore } from '@/stores/DevicesStore'
import { useDataStore } from '@/stores/DataStore'
import { defineAsyncComponent, computed, onMounted, ref, onBeforeMount, onUnmounted } from '@vue/runtime-core'
import Indicator from '@/components/Indicator.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
//props
const props = defineProps({
  id: String
})

//device card handler
const deviceCard = defineAsyncComponent(
  () => import('@/components/cards/deviceCard.vue'),
)
const deviceStore = useDevicesStore()
const newData = computed(() => {
  return [deviceStore.deviceData]
})

const dataStore = useDataStore()
const title = ref()

const satStatParams = ref({
  fields: 'S16,S40000,S40001,S40002,S40003,S40004,S40005,S40006,S40007,S40008,S40009,S40010,S40011,S40012,S40013,S40014,S40015,S40016,S40017,S40018,S40019,S40020,S40021,S40022,S40023,S40024,S40025,S40026,S40027,S40028,S40029',
  measurement: 'SATSTAT',
  device_code: null
})



const satData = ref([])
const activeProgramsList = ref([])
const activeStationsList = ref([])
const loading = ref(true)
let MAX_PROGRAM_NUMBER = 30

async function checkProgramsStatus() {
  //check active programs list
  activeProgramsList.value = []
  let activePrograms
  await dataStore.getLastSatStat(satStatParams.value)
  activePrograms = dataStore.satStat === undefined ? 0 : dataStore.satStat.S16
  const activeProgramsArray = activePrograms.split(",").map(Number)

  activeProgramsList.value = Array.from({ length: MAX_PROGRAM_NUMBER }, (_, index) => {
    const numberToCheck = index + 1 // Numbers are from 1 to 30
    return activeProgramsArray.includes(numberToCheck);
  })

  //check station data
  activeStationsList.value = []
  let azioneStartAddress = 40000

  for (let i = 0; i < MAX_PROGRAM_NUMBER; i++) {
    let stationData = dataStore.satStat['S' + (azioneStartAddress + i)] === undefined ? undefined : dataStore.satStat['S' + (azioneStartAddress + i)].split(',')
    let action
    let usedStations
    let remainingTime
    if (stationData !== undefined) {
      remainingTime = stationData[2].replaceAll('.', ' : ')
      usedStations = stationData[1]
      let actionState = stationData[0]
      switch (actionState) {
        case '1':
          action = t('waitingDeparture')
          break;
        case '2':
          action = t('mvActive')
          break;
        case '3':
          action = t('pause')
          break;
        case '4':
          action = t('evActive')
          break;
        default:
          action = t('notActive')
          break;
      }
    } else {
      action = t('notActive')
      remainingTime = '00:00:00'
      usedStations = '0'
    }
    let newObj = {
      stazione: usedStations,
      azione: action,
      tempo: remainingTime
    }
    activeStationsList.value.push(newObj)
  }
}

function fillSatData() {
  satData.value = []
  for (let i = 0; i < MAX_PROGRAM_NUMBER; i++) {
    let newObj = {
      programma: String(i + 1),
      stato: activeProgramsList.value[i],
      azione: activeStationsList.value[i].azione,
      stazione: activeStationsList.value[i].stazione,
      tempo: activeStationsList.value[i].tempo
    }
    satData.value.push(newObj)
  }
}

async function getLastData() {
  await checkProgramsStatus()
  fillSatData()
}


const delay = (time) => new Promise((resolve) => setTimeout(resolve, time))
const whileState = ref(true)

onMounted(async () => {
  await deviceStore.loadDevice(props.id)
  satStatParams.value.device_code = deviceStore.deviceData.code
  title.value = 'Idrosat:' + deviceStore.deviceData.name
  loading.value = false
  while (whileState.value) {
    getLastData()
    console.log('repeat')
    await delay(5000)
  }
})

onUnmounted(() => {
  whileState.value = false
})


</script>

<style scoped>
.stato-programmi-container {
  @apply relative flex flex-col px-[16px] md:px-[200px] lg:px-[260px] xl:px-[320px] 2xl:px-[360px] 
}

.main {
  @apply flex flex-col w-full justify-center items-center relative
}

.device-container {
  @apply flex sm:flex-col fixed items-end sm:items-center gap-2 bottom-0 left-4 pb-4 sm:pb-8
}

.content {
  @apply flex flex-col justify-center gap-2 w-full sm:gap-4 sm:my-[20px]
}


input[type=text], input[type=password], input[type=number] {
  @apply pl-2 rounded w-10 md:w-20 py-2
}

.button-wrapper {
  @apply mt-3 flex w-[100px] mx-auto
}


/* Table Style */
.table-container {
  @apply w-full relative h-[390px] sm:h-full overflow-auto sm:overflow-visible
}

.table-container table {
  @apply mb-10 w-full
}


.table-container th {
  @apply font-semibold py-[10px] px-[10px] text-left sticky top-0 border-b-2 border-[#3a3a3e] bg-[#DDE8FA]/60 backdrop-blur-lg z-10
}

.table-container td {
  @apply py-[10px] px-[10px] bg-[#DDE8FA]/60 backdrop-blur-lg text-center
}

.table-container th, td {
  @apply text-[10px] md:text-[16px]
}

.table-container tr {
  @apply text-left
}
</style>