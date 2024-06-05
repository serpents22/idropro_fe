<template>
  <loading :loading="allLoading" />
  <div class="avvio-container">
    <sidebar 
      :noSocial="true" 
      :backOn="true" 
      />
    <div class="device-container">
      <deviceCard 
        :small=true
        :content="newData" />
      <div class="xs-icon-card">
        <img src="@/assets/avvio_manuale.png">
        <p>{{ $t('manualStart') }}</p>
      </div>
    </div>
    <div class="content">
      <IdroTitle :title="title"/>
      <div class="main">
        <form @submit.prevent="onSubmit" class="form-container">
          <div class="frame">
            <div class="frame-header">
              <span class="font-bold text-xl">{{$t('manualIdrosatStart')}}</span>
            </div>
            <div class="frame-content">
              <div class="field-wrapper">
                <span class="w-[320px] flex text-left font-semibold">
                  <label for="radiazione-solare">{{$t('stationsNumber')}} :</label>
                </span>
                <span class="flex w-full gap-2 items-center">
                  
                  <select name="stationNumber" class="select-option" v-model="satData.stazione">
                    <!-- <option value="0" selected>0</option> -->
                    <option v-for="station in stazioneList" :value="station">{{ station }}</option>
                  </select>
                  <p>{{ groupData[satData.stazione-1] }}</p>
                </span>
              </div>
              <div class="field-wrapper flex-col sm:flex-row ">
                <span class="w-[320px] flex text-left font-semibold">
                  <label for="radiazione-solare">{{$t('irrigationTime')}} :</label>
                </span>
                <span class="flex w-full gap-2 items-center">
                  <input 
                    class="w-full" type="number" name="radiazione-solare"
                    v-model="satData.ore">
                  <p>ore</p>
                  <input 
                    class="w-full" type="number" name="radiazione-solare"
                    v-model="satData.min">
                  <p>min</p>
                  <input 
                    class="w-full" type="number" name="radiazione-solare"
                    v-model="satData.sec">
                  <p>sec</p>
                  <div class="flex w-[80px]">
                    <MyButton
                      @click="sendS996"
                      class="filled__blue" label="Start" 
                      :loading="postControlIsLoading" />
                  </div>
                </span>
              </div>
              <div class="field-wrapper">
                <span class="w-[320px] flex text-left font-semibold">
                  <label for="radiazione-solare">{{$t('stopStation')}} N :</label>
                </span>
                <span class="flex w-full gap-2 items-center">
                  <input 
                    class="w-full" type="number" name="radiazione-solare" 
                    v-model="satData.ferma">
                  <div class="flex w-[80px]">
                    <MyButton
                    @click="sedS998(1)"
                     class="filled__blue" label="Stop"
                     :loading="postControlIsLoading" />
                  </div>
                </span>
              </div>
              <div class="field-wrapper">
                <span class="w-[320px] flex text-left font-semibold">
                  <label for="radiazione-solare">{{$t('skipStation')}} :</label>
                </span>
                <span class="flex w-full gap-2 items-center">
                  <input class="w-full" type="number" name="radiazione-solare"
                    v-model="satData.salta">
                  <div class="flex w-[80px]">
                    <MyButton 
                      @click="sedS998(2)"
                      class="filled__blue" label="Skip" 
                      :loading="postControlIsLoading" />
                  </div>
                </span>
              </div>
              <div class="prog-wrapper">
                <div class="toggle-wrapper" v-for="prog,index in progs" :key="prog">
                  <span class="font-semibold">prog{{index+1}}</span>
                  <label class="inline-flex relative items-center cursor-pointer">
                   <input 
                    type="checkbox"
                    @click="onToggle(index+1)"
                    v-model="prog['prog' + (index+1)]"
                    class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
  </template>
  
  <script setup>
  import { useDevicesStore } from '@/stores/DevicesStore'
  import { useDataStore } from '@/stores/DataStore';
  import { storeToRefs } from 'pinia'
  import { defineAsyncComponent,  computed,  onMounted,  ref, onBeforeMount } from '@vue/runtime-core'
  import MyButton from '@/components/button/BaseButton.vue'
  import toggle from '@/components/button/Toggle.vue'
  
    //props
    const props = defineProps({
      id: String
    })
    //asynchronus component
    const deviceCard = defineAsyncComponent(
      () => import('@/components/cards/deviceCard.vue'),
    )
    //state
    const deviceStore = useDevicesStore()
    const dataStore = useDataStore()
    const { postControlIsLoading } = storeToRefs(useDataStore())
    const { isLoading } = storeToRefs(useDevicesStore())
    const newData = computed(() => {
        return [deviceStore.deviceData]
      })
    const title = ref()
    const satConfigParams = ref({
      fields: 'S16',
      measurement: 'SATSTAT',
      device_code: null
    })
  
    let allLoading = true
  
    const evConfFields = [...Array(1152)].map( (_, index) => `S${2000 + index}` ).join(',');
    const evConfigParams = ref({
      fields: evConfFields,
      measurement: 'EVCONFIG',
      device_code: null
    })
  
    const grConfFields = [...Array(1152)].map( (_, index) => `S${6000 + index}` ).join(',');
    const grConfigParams = ref({
      fields: grConfFields,
      measurement: 'GROUPCONFIG',
      device_code: null
    })
    const satData = ref({
      stazione: 0,
      ore: 0,
      min: 0,
      sec: 0,
      ferma: 0,
      salta: 0
    })
    
    function fillSatData() {
      // let tmpS16 = '1,2,3,4'
      let tmpS16 = dataStore.satConfig === undefined ? undefined : dataStore.satConfig.S16
  
      if (tmpS16 === undefined) {
        for (let index = 0; index < 30; index++) {
          let progFalse = {['prog' + (index+1)] : false}
          progs.value.push(progFalse)
        }
      } else {
        // let splitS16 = tmpS16.split('/')
        let tmpProg = tmpS16.split(',')
        // let tmpProg = splitS16[0].split(',')
        // let tmpStat = splitS16[1].split(',')
        progs.value =[]
        for (let index = 0; index < 30; index++) {
          if (tmpProg.includes(String((index+1)))) { 
            let progTrue = {['prog' + (index+1)] : true}
            progs.value.push(progTrue)
            // progs.value[index]['prog' + (index+1)] = true 
          } else {
            let progFalse = {['prog' + (index+1)] : false}
            progs.value.push(progFalse)
          }
        }
        console.log(progs.value)
      }
    }
  
    const postData = ref({
      command: 'SATSTAT',
      payload: {}
    })
  
  
  
    function sendS996() {
      postData.value.payload = {}
      let tmpStazione = satData.value.stazione
      let tmpOre = satData.value.ore
      let tmpMin = satData.value.min
      let tmpSec = satData.value.sec
      let appendedValue = String(tmpStazione + ',' + tmpOre + ',' + tmpMin + ',' + tmpSec)
      postData.value.payload.S996 = appendedValue
      console.log(postData.value.payload)
      dataStore.postControl(satConfigParams.value.device_code,postData.value)
    }
  
    function sedS998(index) {
      postData.value.payload = {}
      if (index === 1) {
        satData.value.ferma
        postData.value.payload.S998 = satData.value.ferma
        console.log(postData.value.payload)
        dataStore.postControl(satConfigParams.value.device_code,postData.value)
      } else if (index === 2) {
        satData.value.salta
        postData.value.payload.S998 = satData.value.salta
        console.log(postData.value.payload)
        dataStore.postControl(satConfigParams.value.device_code,postData.value)
      }
    }
    const stationData = ref([])
  
    function fillStationData() {
      let evIndex = 2000    
      let i = 0
      stationData.value = []
      for (let iFor = 0; iFor < dataStore.evConfigLength / 5; iFor++) {
        if (dataStore.evConfig.hasOwnProperty('S' + evIndex)) {
          if (dataStore.evConfig['S' + evIndex] !== "FFFFFF") {
            let mainDataObj = {
              id: i,
              stationNumber: i+1,
              ev: dataStore.evConfig === undefined ? undefined : dataStore.evConfig['S' + evIndex], 
              stazione: dataStore.evConfig === undefined ? undefined : dataStore.evConfig['S' + (evIndex+2)], 
              pompa: dataStore.evConfig === undefined ? undefined : dataStore.evConfig['S' + (evIndex+3)], 
              masterv: dataStore.evConfig === undefined ? undefined : dataStore.evConfig['S' + (evIndex+4)], 
            }
            stationData.value.push(mainDataObj)
            i++
          }
        } else {
          //i--
        }
        evIndex += 6
      }
      console.log('station',stationData.value)
    }
  
    const groupData = ref([])
    function fillGroupData() {
      let evIndex = 6000    
      let i = 0
      groupData.value = []
      for (let iFor = 0; iFor < dataStore.groupDataLength ; iFor++) {
        if (dataStore.groupData.hasOwnProperty('S' + evIndex)) {
          groupData.value.push(dataStore.groupData['S' + evIndex])
          i++
        }
        evIndex += 1
      }
      console.log(groupData.value)
    }
  
    onMounted( async () => {
      await deviceStore.loadDevice(props.id)    
      satConfigParams.value.device_code = deviceStore.deviceData.code
      grConfigParams.value.device_code = deviceStore.deviceData.code 
      evConfigParams.value.device_code = deviceStore.deviceData.code
      title.value = 'Idrosat:' + deviceStore.deviceData.name
      await fillStazioneList()
      // await dataStore.getLastEvConfig(evConfigParams.value) 
      // fillStationData()
      await dataStore.getLastGroupData(grConfigParams.value) 
      fillGroupData()
      await dataStore.getLastSatConfig(satConfigParams.value)
      fillSatData()
      allLoading = false
    })
  
  
    const progs = ref([])
  
    function onToggle(index) {
     console.log(index)
     console.log(progs.value)
     postData.value.payload = {}
  
     progs.value[index-1]['prog'+ index] = !progs.value[index-1]['prog'+ index]
  
     if (progs.value[index-1]['prog'+ index] === true) {
       postData.value.payload.S997 = String(index)
     } else if (progs.value[index-1]['prog'+ index] === false) {
       postData.value.payload.S999 = String(index)
     }
     console.log(postData.value.payload)
     dataStore.postControl(satConfigParams.value.device_code,postData.value)
    }
  
    ////new update
    const stazioneList = ref([])
    
    async function fillStazioneList() {
      stazioneList.value = []
      const tmpStazioneList = ref([])
      const groupedStazioneList = ref([])
      let EVCONFIG_START_ADDRESS = 2000
      await dataStore.getLastEvConfig(evConfigParams.value)
      let index = 1
      console.log('count', dataStore.evConfigLength)
      for (let i = 0; i < dataStore.evConfigLength / 5; i++) {
        if (dataStore.evConfig.hasOwnProperty('S' + EVCONFIG_START_ADDRESS)) {
          if (dataStore.evConfig['S' + EVCONFIG_START_ADDRESS] !== "FFFFFF") {
            // console.log('S'+EVCONFIG_START_ADDRESS)
            // console.log(index)
            let mainDataObj = {
              id: String(index++),
              ev: dataStore.evConfig === undefined ? undefined : dataStore.evConfig['S' + EVCONFIG_START_ADDRESS], 
              stazione: dataStore.evConfig === undefined ? undefined : dataStore.evConfig['S' + (EVCONFIG_START_ADDRESS+2)], 
              pompa: dataStore.evConfig === undefined ? undefined : dataStore.evConfig['S' + (EVCONFIG_START_ADDRESS+3)], 
              masterv: dataStore.evConfig === undefined ? undefined : dataStore.evConfig['S' + (EVCONFIG_START_ADDRESS+4)], 
            }
  
            console.log("appending", mainDataObj)
            tmpStazioneList.value.push(mainDataObj)
          }
        } 
        EVCONFIG_START_ADDRESS += 6
      }
      // console.log('station list', tmpStazioneList.value)
      
      groupedStazioneList.value = tmpStazioneList.value.reduce((r, a) => {
        r[a.stazione] = [...r[a.stazione] || [], a];
      return r;
      }, {});
      console.log('station list', groupedStazioneList.value)
      stazioneList.value = Object.keys(groupedStazioneList.value)
      console.log(stazioneList.value)
    }
  
  </script>
  
  <style scoped>
  
  .select-option {
    @apply  px-3 py-2
            rounded-lg border bg-white
            text-[14px]
  } 
  .avvio-container {
    @apply 
      relative flex flex-col 
      px-[16px] md:px-[200px] lg:px-[260px] xl:px-[320px] 2xl:px-[360px]
      
  }
  .main {
    @apply flex flex-col w-full justify-center items-center relative
  }
  
  .device-container {
    @apply 
      flex sm:flex-col fixed items-end sm:items-center gap-2
      bottom-0 left-4
      pb-4 sm:pb-8
  }
  
  
  .form-container {
    @apply 
      w-full
      relative
      h-[300px] sm:h-full
      overflow-auto sm:overflow-visible
  }
  
  .content {
    @apply 
      flex flex-col justify-center
      gap-2
      w-full
      sm:gap-4
      sm:my-[20px] 
  }
  
  
  input[type=text], input[type=password], input[type=number] {
    @apply pl-2 rounded py-2 w-full min-w-[30px]
  }
  
  .button-wrapper {
    @apply mt-3 flex mx-auto w-full min-w-[40px]
  }
  
  .frame {
    @apply  flex flex-col
            bg-[#DDE8FA]/60 backdrop-blur-lg
            w-full mb-10
  }
  .frame-header {
    @apply
            flex justify-center
            border-b-2 border-[#3a3a3e]
            py-3 px-5
  }
  
  .field-wrapper {
    @apply  flex gap-4
            py-3 px-5 items-center
  }
  
  .prog-wrapper {
    @apply flex flex-wrap gap-x-32 gap-y-8
  }
  .toggle-wrapper {
    @apply flex flex-col items-center 
    gap-4 px-5 py-3 w-20
  }
  </style>