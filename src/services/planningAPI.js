import apiClient from "./API";


export default {
  createPlan(data) {
    return apiClient.post('planning', data)
  },
  getPlannings(params) {
    return apiClient.get('planning', {params})
  },
  updatePlanning(id,data) {
    return apiClient.put(`planning/${id}`, data)
  },
  getPlanning(id, params) {
    return apiClient.get(`planning/${id}`, {params} )
  },
  deletePlanning(id) {
    return apiClient.delete(`planning/${id}`)
  },
  
}