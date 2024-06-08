<template>

  <alert :message="updatePlanningStatus.message" :modalActive="modalActive" :isError="updatePlanningStatus.isError"
    @close="closeNotification" />
  <NewSchedule :isOpen="isShowNewSchedule" @close="createPlanFinish" title="Create Planning" :startDate="startDate"
    :deviceCode="devicesStore.deviceData.code" />
  <ScheduleDetail :isOpen="isShowDetail" @close="detailClosed" title="Planning Detail" :id="planningId"
    :deviceCode="devicesStore.deviceData.code" :event="event" />
  <div class="planning-container">
    <sidebar :noSocial="true" :backOn="true" />
    <div class="device-container">
      <deviceCard :small="true" :content="newData" />
      <div class="xs-icon-card">
        <img src="@/assets/report_planning.png">
        <p>{{ $t('alarms') }}</p>
      </div>
    </div>
    <IdroTitle :title="title" />
    <div class="calendar-container">
      <!-- 
      <div class="program-list-container">
        <h1 class="font-semibold">Programs List</h1>
        <div id="external-events" class="program-list-wrapper">
          <div v-for="(program, index) in 30" class="program-list">Program {{ index + 1 }}</div>
        </div>
      </div> -->

      <FullCalendar :options="calendarOptions" ref="calendar">
        <template #eventContent="{ event }">
          <b class="mx-2 cursor-pointer">{{ event.extendedProps.programName }}</b>
        </template>
      </FullCalendar>
    </div>
  </div>
</template>

<script setup>
import FullCalendar from '@fullcalendar/vue3'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import NewSchedule from '@/components/modal/NewSchedule.vue'
import { useDevicesStore } from '@/stores/DevicesStore'
import { useI18n } from 'vue-i18n'
import { Draggable } from '@fullcalendar/interaction'
import { usePlanningStore } from '@/stores/planning/PlanningStore'
import { storeToRefs } from 'pinia'
import ScheduleDetail from '@/components/modal/ScheduleDetail.vue'

//stores
const planningStore = usePlanningStore()
const { updatePlanningStatus, updatePlanningLoading } = storeToRefs(usePlanningStore())

const { t } = useI18n()
//props
const props = defineProps({
  id: String
})

//asynchronus component
const deviceCard = defineAsyncComponent(
  () => import('@/components/cards/deviceCard.vue'),
)
const devicesStore = useDevicesStore()
const title = ref()
const modalActive = ref(false)
const closeNotification = () => {
  modalActive.value = false
}
const newData = computed(() => {
  return [devicesStore.deviceData]
})


onMounted(async () => {
  await devicesStore.loadDevice(props.id)
  fetchEventsAndUpdateCalendar()
  title.value = 'Idrosat:' + devicesStore.deviceData.name
  // const containerEl = document.getElementById('external-events');
  // new Draggable(containerEl, {
  //   itemSelector: '.program-list',
  //   eventData: function (eventEl) {
  //     console.log(eventEl)
  //     return {
  //       programName: eventEl.innerText.trim()
  //     }
  //   }
  // })

})


const calendar = ref(null)

const calendarOptions = {
  plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
  initialView: 'dayGridMonth',
  events: [],
  headerToolbar: {
    start: 'dayGridMonth,dayGridWeek,timeGridDay',
    center: 'title',
  },
  // editable: true,
  dayMaxEvents: true,
  //events
  // eventDrop: handleEventDrop,
  // eventResize: handleEventResize,
  // dateClick: handleDateClick,
  eventClick: handleEventClick,

}

async function fetchEventsAndUpdateCalendar() {
  const api = calendar.value.getApi()
  await planningStore.getPlannings({ deviceCode: devicesStore.deviceData.code })
  console.log(planningStore.plannings)
  api.removeAllEvents()   // Clear existing events (optional)
  api.addEventSource(planningStore.plannings)  // Add updated events to the calendar
}


async function handleEventDrop(arg) {
  let id = arg.event.id
  const startLocalDateTimeString = `${arg.event.startStr}T${arg.event.extendedProps.startHour}`
  const startLocalDateTime = new Date(startLocalDateTimeString).toISOString()
  const endLocalDateTimeString = `${arg.event.endStr}T${arg.event.extendedProps.endHour}`
  const endLocalDateTime = new Date(endLocalDateTimeString).toISOString()
  const payload = {
    startAt: startLocalDateTime,
    endAt: endLocalDateTime,
  }
  await planningStore.updatePlanning(id, payload)
  modalActive.value = true
  setTimeout(closeNotification, 3000)
  fetchEventsAndUpdateCalendar()
}

async function handleEventResize(arg) {
  let id = arg.event.id
  const startLocalDateTimeString = `${arg.event.startStr}T${arg.event.extendedProps.startHour}`
  const startLocalDateTime = new Date(startLocalDateTimeString).toISOString()
  const endLocalDateTimeString = `${arg.event.endStr}T${arg.event.extendedProps.endHour}`
  const endLocalDateTime = new Date(endLocalDateTimeString).toISOString()
  const payload = {
    startAt: startLocalDateTime,
    endAt: endLocalDateTime,
  }
  await planningStore.updatePlanning(id, payload)
  modalActive.value = true
  setTimeout(closeNotification, 3000)
  fetchEventsAndUpdateCalendar()
}



const startDate = ref('')
const isShowNewSchedule = ref(false)

function handleDateClick(arg) {
  isShowNewSchedule.value = true
  startDate.value = arg.dateStr
}

function createPlanFinish() {
  isShowNewSchedule.value = false
  fetchEventsAndUpdateCalendar()
}

const isShowDetail = ref(false)
const planningId = ref('')
const event = ref(
  { start: null, end: null, programName: null }
)

function handleEventClick(arg) {
  isShowDetail.value = true
  planningId.value = arg.event.id

  const startDate = new Date(arg.event.start)
  const startYear = startDate.getFullYear()
  const startMonth = String(startDate.getMonth() + 1).padStart(2, '0')
  const startDay = String(startDate.getDate()).padStart(2, '0')
  event.value.start = `${startYear}-${startMonth}-${startDay}`

  const endDate = new Date(arg.event.end || arg.event.start)
  const endYear = endDate.getFullYear();
  const endMonth = String(endDate.getMonth() + 1).padStart(2, '0')
  const endDay = String(endDate.getDate()).padStart(2, '0')
  event.value.end = `${endYear}-${endMonth}-${endDay}`
  console.log(arg.event.start, arg.event.end)
  event.value.programName = arg.event.extendedProps.programName
}

function detailClosed() {
  isShowDetail.value = false
  fetchEventsAndUpdateCalendar()
}





// function addEvent() {
//   const newEvent = { id: 'program2', programName: 'Program 2', start: '2024-05-02', end: '2024-05-06' }
//   calendar.value.getApi().addEvent(newEvent) // Add event to the calendar
// }

// function removeEvent() {
//   const eventIdToRemove = 'Program 2' // ID of the event to remove
//   const removedEvent = calendar.value.getApi().getEventById(eventIdToRemove)
//   if (removedEvent) {
//     removedEvent.remove() // Remove the event from the calendar
//   }
// }


</script>

<style scoped>
.planning-container {
  @apply relative flex flex-col px-[16px] md:px-[200px] lg:px-[260px] xl:px-[320px] 2xl:px-[360px];
}

.device-container {
  @apply flex sm:flex-col fixed items-end sm:items-center gap-2 bottom-0 left-4 pb-4 sm:pb-8;
}

.calendar-container {
  @apply bg-white p-4 rounded-lg border
}

.program-list-container {
  @apply sm:flex flex-col gap-2 text-left hidden mb-4
}

.program-list-wrapper {
  @apply w-full grid grid-cols-6 gap-2
}

.program-list {
  @apply cursor-pointer bg-blue-400 text-white font-semibold px-4 py-2 rounded text-xs
}

.fc {
  @apply text-[8px] sm:text-xs lg:text-base
}
</style>
