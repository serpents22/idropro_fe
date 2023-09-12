import { defineStore } from 'pinia'
import dataAPI from '@/services/dataAPI'
import { ref } from 'vue'


export const useFastWateringStore = defineStore('fastWatering', {
  state: () => ({
    fastWateringList: ref([]),
    fastWatering: ref(),
    status: ref({
      message: null,
      code: null,
      isError: null,
    }),
    setFastWateringStatus: ref({
      message: null,
      code: null,
      isError: null,
    }),
    isLoading: ref(false)
  }),
  actions: {
    async getFastWatering(params) {
      this.isLoading = true
      try {
        const res = await dataAPI.getLast(params)
        console.log(res)
        this.fastWatering = res.data.data
        this.isLoading = false
        // this.status.message = 'List Fetched'
        this.status.code = res.data.status
      } catch (err) {
        console.error(err)
        this.isLoading = false
        this.status.message = err.response.data.error
        this.status.code = err.response.data.status
        return err
      }
    },
    async setFastWatering(deviceCode, data) {
      this.isLoading = true
      try {
        const res = await dataAPI.postFastWatering(deviceCode, data)
        console.log(res)
        this.isLoading = false
        this.setFastWateringStatus.message = 'Fast Watering Update Success'
        this.setFastWateringStatus.isError = false
        this.setFastWateringStatus.code = res.data.status
      } catch (err) {
        console.error(err)
        this.isLoading = false
        this.setFastWateringStatus.message = 'Fast Watering Update Failed'
        this.setFastWateringStatus.code = err.response.data.status
        this.setFastWateringStatus.isError = true
        return err
      }
    }
  }
})