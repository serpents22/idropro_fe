import { defineStore } from 'pinia'
import planningAPI from '@/services/planningAPI'
import { ref } from 'vue'

export const usePlanningStore = defineStore('planningStore', {
  state: () => ({
    createPlanStatus: ref({
      message: null,
      isError: false,
      code: null,
    }),
    createPlanLoading: ref(false),
    getPlanningsStatus: ref({
      message: null,
      code: null,
    }),
    getPlanningsLoading: ref(false),
    plannings: ref([]),
    updatePlanningStatus: ref({
      message: null,
      code: null,
    }),
    updatePlanningLoading: ref(false),
    deletePlanningStatus: ref({
      message: null,
      code: null,
    }),
    deletePlanningLoading: ref(false),
    getPlanningStatus: ref({
      message: null,
      code: null,
    }),
    getPlanningLoading: ref(false),
    planning: ref([]),
  }),
  actions: {
    async createPlan(data) {
      this.createPlanLoading = true
      try {
        const res = await planningAPI.createPlan(data)
        console.log(res)
        this.createPlanLoading = false
        this.createPlanStatus.isError = false
        this.createPlanStatus.message = 'Plan Created'
        this.createPlanStatus.code = res.data.status
      } catch (err) {
        console.error(err)
        this.createPlanLoading = false
        this.createPlanStatus.isError = true
        this.createPlanStatus.message = err.response.data.message
        this.createPlanStatus.code = err.response.data.status
        return err
      }
    },
    async getPlannings(params) {
      this.getPlanningsLoading = true
      try {
        const res = await planningAPI.getPlannings(params)
        // Transforming the data
        const transformedPlannings = res.data.data.plannings.flatMap(({ date, program }) =>
          date.map(({ start, end }) => ({ program, start, end }))
        )
        this.plannings = transformedPlannings.map((data) => {
          const start = data.start
          const end = data.end
          const programName = 'Program ' + data.program.replace(/^\D+/g, '')
          const id = data.program.replace(/^\D+/g, '')
          return {
            start, end, programName, id
          }
        })
        // console.log(res.data.data.plannings)
        // console.log(this.plannings)
        this.getPlanningsLoading = false
        this.getPlanningsStatus.message = 'Planning Fetched'
        this.getPlanningsStatus.code = res.data.status
      } catch (err) {
        console.error(err)
        this.getPlanningsLoading = false
        this.createPlanStatus.message = err.response.data.error
        this.createPlanStatus.code = err.response.data.status
        return err
      }
    },
    async getPlanning(id, params) {
      this.getPlanningLoading = true
      try {
        const res = await planningAPI.getPlanning(id, params)
        this.planning.stations = res.data.data.planning.stations
        this.planning.isStationEmpty = res.data.data.planning.stations.length == 0
        this.getPlanningLoading = false
        this.getPlanningStatus.message = 'Planning Fetched'
        // this.getPlanningStatus.code = res.data.status
      } catch (err) {
        console.error(err)
        this.getPlanningLoading = false
        // this.createPlanStatus.message = err.response.data.error
        // this.createPlanStatus.code = err.response.data.status
        return err
      }
    },
    async updatePlanning(id, data) {
      this.updatePlanningLoading = true
      try {
        const res = await planningAPI.updatePlanning(id, data)
        console.log(res)
        this.updatePlanningLoading = false
        this.updatePlanningStatus.isError = false
        this.updatePlanningStatus.message = 'Plan Updated'
        this.updatePlanningStatus.code = res.data.status
      } catch (err) {
        console.error(err)
        this.updatePlanningLoading = false
        this.updatePlanningStatus.isError = true
        this.updatePlanningStatus.message = err.response.data.message
        this.updatePlanningStatus.code = err.response.data.status
        return err
      }
    },
    async deletePlanning(id) {
      this.deletePlanningLoading = true
      try {
        const res = await planningAPI.deletePlanning(id)
        console.log(res)
        this.deletePlanningLoading = false
        this.deletePlanningStatus.isError = false
        this.deletePlanningStatus.message = 'Plan Deleted'
        this.deletePlanningStatus.code = res.data.status
      } catch (err) {
        console.error(err)
        this.deletePlanningLoading = false
        this.deletePlanningStatus.isError = true
        this.deletePlanningStatus.message = err.response.data.message
        this.deletePlanningStatus.code = err.response.data.status
        return err
      }
    },
  }

})