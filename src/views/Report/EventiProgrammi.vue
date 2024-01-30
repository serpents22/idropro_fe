<template>
  <div class="alarmi-container">
  <sidebar 
    :noSocial="true" 
    :backOn="true" 
    />
  <div class="device-container">
    <deviceCard 
      :small=true
      :content="newData" />
    <div class="xs-icon-card">
      <img src="@/assets/report_eventi_programmi.png">
      <p>{{ $t('programEventReports') }}</p>
    </div>
  </div>
  <div class="dashboard-container">
    <IdroTitle :title="title"/>
    <div class="content">
      <div class="header">
        <div class="date-filter">
          <DatePicker  
            @change="dateFiltering()"  
            v-model="startDate"
          />
          <label>AL</label>
          <DatePicker  
            @change="dateFiltering()"  
            v-model="endDate"
          />
          <!-- <div class="button-wrapper">
            <IveButton type="submit" label="Visualizza" />
          </div> -->
        </div>
        <div class="search-field">
          <SearchField v-model="searchValue" />
        </div>
      </div>
      <div class="table-wrap">
      <EasyDataTable
        table-class-name="customize-table"
        alternating
        buttons-pagination
        no-hover
        header-text-direction="center"
        body-text-direction="center"
        :loading="historicalDataIsLoading"
        :headers="headers"
        :items="formatedhistoricalEventi"
        :search-field="searchField"
        :search-value="searchValue"
        :rows-items="[5,10,20,30,40,50]"
        :rows-per-page="5"
        theme-color="#1363df">
        <template #loading>
          <img
            src="@/assets/loader/loader.gif"
            style="width: 100px; height: 80px;"
          />
        </template>
        <template #item-pompa1="{pompa1Value}">
          <div class="w-full flex justify-center">
            <Indicator :status="pompa1Value"/>
          </div>
        </template>
        <template #item-pompa2="{pompa2Value}">
          <div class="w-full flex justify-center">
            <Indicator :status="pompa2Value"/>
          </div>
        </template>
        <template #item-pompa3="{pompa3Value}">
          <div class="w-full flex justify-center">
            <Indicator :status="pompa3Value"/>
          </div>
        </template>
        <template #item-pompa4="{pompa4Value}">
          <div class="w-full flex justify-center">
            <Indicator :status="pompa4Value"/>
          </div>
        </template>
        <template #item-pompa5="{pompa5Value}">
          <div class="w-full flex justify-center">
            <Indicator :status="pompa5Value"/>
          </div>
        </template>
        <template #item-pompa6="{pompa6Value}">
          <div class="w-full flex justify-center">
            <Indicator :status="pompa6Value"/>
          </div>
        </template>
        <template #item-pompa7="{pompa7Value}">
          <div class="w-full flex justify-center">
            <Indicator :status="pompa7Value"/>
          </div>
        </template>
        <template #item-pompa8="{pompa8Value}">
          <div class="w-full flex justify-center">
            <Indicator :status="pompa8Value"/>
          </div>
        </template>
        <template #item-master1="{master1Value}">
          <div class="w-full flex justify-center">
            <Indicator :status="master1Value"/>
          </div>
        </template>
        <template #item-master2="{master2Value}">
          <div class="w-full flex justify-center">
            <Indicator :status="master2Value"/>
          </div>
        </template>
        <template #item-master3="{master3Value}">
          <div class="w-full flex justify-center">
            <Indicator :status="master3Value"/>
          </div>
        </template>
        <template #item-master4="{master4Value}">
          <div class="w-full flex justify-center">
            <Indicator :status="master4Value"/>
          </div>
        </template>
        <template #item-master5="{master5Value}">
          <div class="w-full flex justify-center">
            <Indicator :status="master5Value"/>
          </div>
        </template>
        <template #item-master6="{master6Value}">
          <div class="w-full flex justify-center">
            <Indicator :status="master6Value"/>
          </div>
        </template>
        <template #item-master7="{master7Value}">
          <div class="w-full flex justify-center">
            <Indicator :status="master7Value"/>
          </div>
        </template>
        <template #item-master8="{master8Value}">
          <div class="w-full flex justify-center">
            <Indicator :status="master8Value"/>
          </div>
        </template>
      </EasyDataTable>
      <download-csv
      :class="{'restrictedAccess': devicesStore.deviceData.role == 'user'}"
      	class   = "btn btn-default mt-6 justify-end flex"
      	:data   = "formatedhistoricalEventi"
      	:name    = "fileName">
        <div class="button-wrapper">
            <IveButton label="Export CSV" />
        </div>
      </download-csv>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup>
import { useDataStore } from '@/stores/DataStore'
import { useDevicesStore } from '@/stores/DevicesStore'
import { storeToRefs } from 'pinia'
import { defineAsyncComponent,  computed,  onMounted,  ref } from '@vue/runtime-core'
import SearchField from '@/components/input/searchField.vue'
import DatePicker from '@/components/input/datePicker.vue'
import IveButton from '@/components/input/iveButton.vue'
import Indicator from '@/components/Indicator.vue'
import { toInteger } from 'lodash'
// import { Header, Item } from "vue3-easy-data-table";
import { useI18n } from 'vue-i18n'
 
const {t} = useI18n()
//props
  const props = defineProps({
    id: String
  })

  
  //asynchronus component
  const deviceCard = defineAsyncComponent(
    () => import('@/components/cards/deviceCard.vue'),
  )
  //state
  const devicesStore = useDevicesStore()
  const dataStore = useDataStore()
  const { isLoading } = storeToRefs(useDevicesStore())
  const { historicalDataIsLoading } = storeToRefs(useDataStore())
  const formatedhistoricalEventi = ref([])
  const searchValue = ref()
  const searchField = 'tipoAlarme'
  const title = ref()
  
  //date filter init
  let MINIMUM_DIGIT = 2
  let date = new Date()
  let firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
  let tmpFirstYear = String(firstDay.getFullYear())
  let tmpFirstMonth = String((firstDay.getMonth()+1))
  let tmpFirstDay = String(firstDay.getDate())
  while (tmpFirstDay.length < MINIMUM_DIGIT) {
    tmpFirstDay = '0' + tmpFirstDay
  }
  const startDate = ref(String(tmpFirstYear + '-' + tmpFirstMonth + '-' + tmpFirstDay))

  let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  let tmpLastYear = String(lastDay.getFullYear())
  let tmpLastMonth = String((lastDay.getMonth()+1))
  let tmpLastDay = String(lastDay.getDate())
  while (tmpLastDay.length < MINIMUM_DIGIT) {
    tmpLastDay = '0' + tmpLastDay
  }
  const endDate = ref(String(tmpLastYear + '-' + tmpLastMonth + '-' + tmpLastDay))
  const fileName = ref(String(startDate.value + '_' + endDate.value) + '_Eventi_Programmi.csv')

  //change date format to ISOString
  const start = computed(() => {
    let tmpStart = startDate.value.split('-')
    let tmpYear = tmpStart[0]
    let tmpMonth = tmpStart[1]
    let tmpDay = tmpStart[2]
    console.log(tmpStart)
    return new Date(tmpYear, tmpMonth-1, tmpDay, '00', '00', '00').toISOString()
    // return new Date(Date.UTC(tmpYear, tmpMonth-1, tmpDay, '00', '00', '00')).toISOString()
  })
  const end = computed(() => {
    let tmpEnd = endDate.value.split('-')
    let tmpYear = tmpEnd[0]
    let tmpMonth = tmpEnd[1]
    let tmpDay = tmpEnd[2]
    console.log(tmpEnd)
    return new Date(tmpYear, tmpMonth-1, tmpDay, '24', '00', '00').toISOString()
    // return new Date(Date.UTC(tmpYear, tmpMonth-1, tmpDay, '24', '00', '00')).toISOString()
  })

  const historicalEventiParams = ref({
    fields: 'S84,S85',
    measurement: 'SATEVENTSTAT',
    device_code: null,
    start: start,
    end: end
  })


  function fillTableData() {
    console.log(dataStore.historicalData)
    formatedhistoricalEventi.value = []
    let tmphistoricalEventi, tmpPompaStatus,tmpMasterStatus,tmpRestOfContatore
    if (dataStore.historicalData !== undefined) {
      dataStore.historicalData.map((data) => {
        tmphistoricalEventi = data.S84.split(',')
        tmpPompaStatus = tmphistoricalEventi[5]
        let pompaStatus = ref([])
        if (tmpPompaStatus === undefined) {
        pompaStatus.value = [false,false,false,false,false,false,false,false]
        } else {
          if (tmpPompaStatus.charAt(0) === '1') { pompaStatus.value.push(true) } else {pompaStatus.value.push(false)}
          if (tmpPompaStatus.charAt(1) === '1') { pompaStatus.value.push(true) } else {pompaStatus.value.push(false)}
          if (tmpPompaStatus.charAt(2) === '1') { pompaStatus.value.push(true) } else {pompaStatus.value.push(false)}
          if (tmpPompaStatus.charAt(3) === '1') { pompaStatus.value.push(true) } else {pompaStatus.value.push(false)}
          if (tmpPompaStatus.charAt(4) === '1') { pompaStatus.value.push(true) } else {pompaStatus.value.push(false)}
          if (tmpPompaStatus.charAt(5) === '1') { pompaStatus.value.push(true) } else {pompaStatus.value.push(false)}
          if (tmpPompaStatus.charAt(6) === '1') { pompaStatus.value.push(true) } else {pompaStatus.value.push(false)}
          if (tmpPompaStatus.charAt(7) === '1') { pompaStatus.value.push(true) } else {pompaStatus.value.push(false)}
          console.log(pompaStatus.value)
        }
        tmpMasterStatus = tmphistoricalEventi[6]
        let masterStatus = ref([])
        if (tmpMasterStatus === undefined) {
        masterStatus.value = [false,false,false,false,false,false,false,false]
        } else {
          if (tmpMasterStatus.charAt(0) === '1') { masterStatus.value.push(true) } else {masterStatus.value.push(false)}
          if (tmpMasterStatus.charAt(1) === '1') { masterStatus.value.push(true) } else {masterStatus.value.push(false)}
          if (tmpMasterStatus.charAt(2) === '1') { masterStatus.value.push(true) } else {masterStatus.value.push(false)}
          if (tmpMasterStatus.charAt(3) === '1') { masterStatus.value.push(true) } else {masterStatus.value.push(false)}
          if (tmpMasterStatus.charAt(4) === '1') { masterStatus.value.push(true) } else {masterStatus.value.push(false)}
          if (tmpMasterStatus.charAt(5) === '1') { masterStatus.value.push(true) } else {masterStatus.value.push(false)}
          if (tmpMasterStatus.charAt(6) === '1') { masterStatus.value.push(true) } else {masterStatus.value.push(false)}
          if (tmpMasterStatus.charAt(7) === '1') { masterStatus.value.push(true) } else {masterStatus.value.push(false)}
          console.log(masterStatus.value)
        }

        if (data.hasOwnProperty('S85')) {
          tmpRestOfContatore = data.S85.split(',')
        } else {
          tmpRestOfContatore = ['-','-','-','-','-']
        }
        tmphistoricalEventi[3] = describeStatoCode(tmphistoricalEventi[3])
        let newObj = {
          date: new Date(toInteger(tmphistoricalEventi[0])*1000).toLocaleString(),
          programmaNumero: String(tmphistoricalEventi[1]),
          stazioneNumero: String(tmphistoricalEventi[2]),
          stato: String(tmphistoricalEventi[3]),
          durataIrrigazione: String(tmphistoricalEventi[4]),
          pompa1Value: pompaStatus.value[0],
          pompa2Value: pompaStatus.value[1],
          pompa3Value: pompaStatus.value[2],
          pompa4Value: pompaStatus.value[3],
          pompa5Value: pompaStatus.value[4],
          pompa6Value: pompaStatus.value[5],
          pompa7Value: pompaStatus.value[6],
          pompa8Value: pompaStatus.value[7],
          master1Value: masterStatus.value[0],
          master2Value: masterStatus.value[1],
          master3Value: masterStatus.value[2],
          master4Value: masterStatus.value[3],
          master5Value: masterStatus.value[4],
          master6Value: masterStatus.value[5],
          master7Value: masterStatus.value[6],
          master8Value: masterStatus.value[7],
          contatore1: tmphistoricalEventi[7],
          contatore2: tmphistoricalEventi[8],
          contatore3: tmphistoricalEventi[9],
          contatore4: tmpRestOfContatore[0],
          contatore5: tmpRestOfContatore[1],
          contatore6: tmpRestOfContatore[2],
          contatore7: tmpRestOfContatore[3],
          contatore8: tmpRestOfContatore[4],
        }

        formatedhistoricalEventi.value.push(newObj)
      })
    }
    console.log(formatedhistoricalEventi.value)
  }

  
  //table headers
  const headers = [
    { text: t('programNumber'), value: "programmaNumero",sortable: true, width: 80},
    { text: t('stationNumber'), value: "stazioneNumero",sortable: true, width: 80},
    { text: "Date Time", value: "date",sortable: true, width: 120},
    { text: t('irrigationTime'), value: "durataIrrigazione",sortable: true, width: 80},
    { text: t('programStatus'), value: "stato",sortable: true, width: 80},
    { text:  t('counter') +' 1', value: "contatore1",sortable: true, width: 80},
    { text:  t('counter') +' 2', value: "contatore2",sortable: true, width: 80},
    { text:  t('counter') +' 3', value: "contatore3",sortable: true, width: 80},
    { text:  t('counter') +' 4', value: "contatore4",sortable: true, width: 80},
    { text:  t('counter') +' 5', value: "contatore5",sortable: true, width: 80},
    { text:  t('counter') +' 6', value: "contatore6",sortable: true, width: 80},
    { text:  t('counter') +' 7', value: "contatore7",sortable: true, width: 80},
    { text:  t('counter') +' 8', value: "contatore8",sortable: true, width: 80},
    { text:  t('pump') +' 1', value: "pompa1",sortable: true, width: 80},
    { text:  t('pump') +' 2', value: "pompa2",sortable: true, width: 80},
    { text:  t('pump') +' 3', value: "pompa3",sortable: true, width: 80},
    { text:  t('pump') +' 4', value: "pompa4",sortable: true, width: 80},
    { text:  t('pump') +' 5', value: "pompa5",sortable: true, width: 80},
    { text:  t('pump') +' 6', value: "pompa6",sortable: true, width: 80},
    { text:  t('pump') +' 7', value: "pompa7",sortable: true, width: 80},
    { text:  t('pump') +' 8', value: "pompa8",sortable: true, width: 80},
    { text:  t('evMaster') +' 1', value: "master1",sortable: true, width: 80},
    { text:  t('evMaster') +' 2', value: "master2",sortable: true, width: 80},
    { text:  t('evMaster') +' 3', value: "master3",sortable: true, width: 80},
    { text:  t('evMaster') +' 4', value: "master4",sortable: true, width: 80},
    { text:  t('evMaster') +' 5', value: "master5",sortable: true, width: 80},
    { text:  t('evMaster') +' 6', value: "master6",sortable: true, width: 80},
    { text:  t('evMaster') +' 7', value: "master7",sortable: true, width: 80},
    { text:  t('evMaster') +' 8', value: "master8",sortable: true, width: 80}
  ]
    
    
  async function getHistoryData() {
    await dataStore.getHistoricalData(historicalEventiParams.value)
    fillTableData()
  }

  function dateFiltering() {
    historicalEventiParams.value.start = start
    historicalEventiParams.value.end = end
    fileName.value = String(startDate.value + '_' + endDate.value) + '_Eventi_Programmi.csv'
    getHistoryData()
  }

  onMounted( async () => {
    await devicesStore.loadDevice(props.id)
    historicalEventiParams.value.device_code = devicesStore.deviceData.code
    title.value = 'Idrosat:' + devicesStore.deviceData.name
    dateFiltering()
  })

  const newData = computed(() => {
      return [devicesStore.deviceData]
  })

  //other function
  function describeStatoCode(value) {
    switch (value) {
            case '0':
              value = 'Fermo'
              break;
            case '1':
              value = 'In attesa partenza'
              break;
            case '2':
              value = 'MV attiva (ad inizio ciclo)'
              break;
            case '3':
              value = 'In pausa tra due cicli'
              break;
            case '4':
              value = 'EV attiva'
              break;
            case '5':
              value = 'Sospeso (ad es.: per un sensore)'
              break;
            case '6':
              value = 'In pausa tra due EV'
              break;
            default:
              break;
          }
    return value
  }

</script>

<style scoped>

.indicator {
  @apply w-2 h-2 box-border rounded-full
}
.indicator-off {
  box-shadow: 0px 0px 4px 1px #ED0000, inset 0px 0px 7px #ED0000;
  border: 1px solid #EB5757;
  background:#EB5757
}
.indicator-on {
  box-shadow: 0px 0px 4px 1px #12F07D, inset 0px 0px 7px #12F07D;
  background:#78ECB0;
  border: 1px solid #78ECB0;
}
.alarmi-container {
  @apply 
    relative flex flex-col 
    px-[16px] md:px-[200px] lg:px-[260px] xl:px-[320px] 2xl:px-[360px]
    
}
.dashboard-container {
  @apply flex flex-col w-full justify-center items-center
}

.device-container {
  @apply 
    flex sm:flex-col fixed items-end sm:items-center gap-2
    bottom-0 left-4
    pb-4 sm:pb-8
}

 

.content {
  @apply 
    flex flex-col justify-center
    gap-2
    w-full
    sm:gap-4
    sm:my-[20px] 
}

.header {
  @apply 
    flex gap-2 sm:justify-between
    flex-col sm:flex-row
    h-full
}

.table-wrap {
  @apply
    h-[300px] sm:h-full
    overflow-auto sm:overflow-visible
}

.search-field {
  @apply
    relative 
    h-[24px]
    sm:w-[300px]
    sm:h-[40px]
}


.date-filter {
  @apply 
    relative items-center
    flex gap-2
    w-full
    h-[24px]
    sm:w-[500px]
    sm:h-[40px]
}

.date-filter label {
  @apply
  text-[12px] sm:text-[16px]
    relative
   text-white
}

.button-wrapper {
  @apply
    relative 
    h-full w-full
    sm:w-[100px]
    sm:h-[40px]
    max-w-[80px]
    sm:max-w-[100px]
}

.customize-table {
  --easy-table-header-font-size: 10px;
  --easy-table-header-background-color: #DFEAFB;
  --easy-table-row-border:	1px solid #D2DDEE;
  --easy-table-header-height:	30px;

  --easy-table-body-row-background-color: #DFEAFB;
  --easy-table-body-even-row-background-color:	#D2DDEE;
  --easy-table-body-row-font-size:	10px;
  --easy-table-body-row-height:	20px;

  --easy-table-footer-font-size:	8px;
  --easy-table-footer-height:	30px;
  --easy-table-footer-background-color:	#F5F8FA;	
  --easy-table-footer-font-color:	#3A3A3E;

}

@media only screen and (min-width: 1536px) {
  .customize-table {
    --easy-table-header-font-size: 16px;
    --easy-table-header-background-color: #DFEAFB;
    --easy-table-header-height:	60px;
    --easy-table-row-border:	2px solid #D2DDEE;

    --easy-table-body-row-background-color: #DFEAFB;
    --easy-table-body-even-row-background-color:	#D2DDEE;
    --easy-table-body-row-font-size:	16px;
    --easy-table-body-row-height:	60px;

    --easy-table-footer-font-size:	14px;
    --easy-table-footer-height:	50px;
    --easy-table-footer-background-color:	#F5F8FA;	
    --easy-table-footer-font-color:	#3A3A3E;

  }
}

</style>
