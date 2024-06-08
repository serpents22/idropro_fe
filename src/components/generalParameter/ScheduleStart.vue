<template>
    <form @submit.prevent="onSubmit" class="table-container">
        <h1 class="flex mb-2 font-bold">{{ $t('scheduleStart') }}</h1>
        <table style="margin-bottom:1rem">
            <thead>
                <tr>
                    <th class="w-10">
                        <label>{{ $t('activate') }}</label>
                    </th>
                    <th class="w-40">
                        <label>{{ $t('startTime') }}</label>
                    </th>
                    <th class="w-40">
                        <label v-if="endProgramMode == 1">{{ $t('cycles') }}</label>
                        <label v-else-if="endProgramMode == 0">{{ $t('endTime') }}</label>
                    </th>
                </tr>
            </thead>

            <tr v-if="isLoading">
                <td colspan="3" class="w-full">
                    <div class="flex justify-center">
                        <svg aria-hidden="true"
                            class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                            viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor" />
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill" />
                        </svg>
                    </div>
                </td>
            </tr>
            <tbody v-if="!isLoading">
                <tr name="Riga1" class="w-full">
                    <td name="Attivo">
                        <div class="flex gap-2 items-center">
                            <label>1</label>
                            <input @change ="onSubmit" v-model="satData.isAuto1" type="checkbox" name="auto-1">
                        </div>
                    </td>
                    <td name="Orario Inizio">
                        <div class="mp-flex">
                            <div class="flex gap-2 items-center td-gap">
                                <input v-model="satData.ore0" class="w-30" :disabled="satData.isAuto1 === false"
                                    type="number" name="ore0">
                                <label>{{ $t('hour') }}</label>
                            </div>
                            <div class="flex gap-2 items-center td-gap">
                                <input v-model="satData.min0" class="w-30" :disabled="satData.isAuto1 === false"
                                    type="number" name="min0">
                                <label>{{ $t('minute') }}</label>
                            </div>
                        </div>
                    </td>
                    <td v-if="endProgramMode == 1">
                        <div class="flex gap-2 items-center">
                            <input v-model="satData.S1" class="w-30" :disabled="satData.isAuto1 === false" type="number"
                                name="cicli0">
                            <label>{{ $t('cycles') }}</label>
                        </div>
                    </td>
                    <td name="OrarioFine1" v-else-if="endProgramMode == 0" :disabled="satData.isAuto1 === false">
                        <div class="mp-flex">
                            <div class="flex gap-2 items-center td-gap">
                                <input v-model="satData.Time1H" class="w-30" :disabled="satData.isAuto1 === false"
                                    type="number" name="ore2">
                                <label>{{ $t('hour') }}</label>
                            </div>
                            <div class="flex gap-2 items-center td-gap">
                                <input v-model="satData.Time1M" class="w-30" :disabled="satData.isAuto1 === false"
                                    type="number" name="min2">
                                <label>{{ $t('minute') }}</label>
                            </div>
                        </div>
                    </td>
                    <td v-else />
                </tr>
                <tr name="riga2" class="w-full">
                    <td>
                        <div class="flex gap-2 items-center">
                            <p>2</p>
                            <input @change ="onSubmit" v-model="satData.isAuto2" type="checkbox" name="auto-2">
                        </div>
                    </td>
                    <td>
                        <div class="mp-flex">
                            <div class="flex gap-2 items-center td-gap">
                                <input v-model="satData.ore2" class="w-30" :disabled="satData.isAuto2 === false"
                                    type="number" name="ore2">
                                <label>{{ $t('hour') }}</label>
                            </div>
                            <div class="flex gap-2 items-center td-gap">
                                <input v-model="satData.min2" class="w-30" :disabled="satData.isAuto2 === false"
                                    type="number" name="min2">
                                <label>{{ $t('minute') }}</label>
                            </div>
                        </div>
                    </td>
                    <td v-if="endProgramMode == 1">
                        <div class="flex gap-2 items-center">
                            <input v-model="satData.S3" class="w-30" :disabled="satData.isAuto2 === false" type="number"
                                name="cicli3">
                            <label>{{ $t('cycles') }}</label>
                        </div>
                    </td>
                    <td name="OrarioFine3" v-else-if="endProgramMode == 0">
                        <div class="mp-flex">
                            <div class="flex gap-2 items-center td-gap">
                                <input v-model="satData.Time3H" class="w-30" :disabled="satData.isAuto2 === false"
                                    type="number" name="ore2">
                                <label>{{ $t('hour') }}</label>
                            </div>
                            <div class="flex gap-2 items-center td-gap">
                                <input v-model="satData.Time3M" class="w-30" :disabled="satData.isAuto2 === false"
                                    type="number" name="min2">
                                <label>{{ $t('minute') }}</label>
                            </div>
                        </div>
                    </td>
                    <td v-else />
                </tr>
                <tr name="riga3" class="w-full">
                    <td>
                        <div class="flex gap-2 items-center">
                            <p>3</p>
                            <input @change ="onSubmit" v-model="satData.isAuto3" type="checkbox" name="auto-3">
                        </div>
                    </td>
                    <td>
                        <div class="mp-flex">
                            <div class="flex gap-2 items-center td-gap">
                                <input v-model="satData.ore4" class="w-30" :disabled="satData.isAuto3 === false"
                                    type="number" name="ore4">
                                <label>{{ $t('hour') }}</label>
                            </div>
                            <div class="flex gap-2 items-center td-gap">
                                <input v-model="satData.min4" class="w-30" :disabled="satData.isAuto3 === false"
                                    type="number" name="min4">
                                <label>{{ $t('minute') }}</label>
                            </div>
                        </div>
                    </td>
                    <td v-if="endProgramMode == 1">
                        <div class="flex gap-2 items-center">
                            <input v-model="satData.S5" class="w-30" :disabled="satData.isAuto3 === false" type="number"
                                name="cicli5">
                            <label>{{ $t('cycles') }}</label>
                        </div>
                    </td>
                    <td name="OrarioFine5" v-else-if="endProgramMode == 0">
                        <div class="mp-flex">
                            <div class="flex gap-2 items-center td-gap">
                                <input v-model="satData.Time5H" class="w-30" :disabled="satData.isAuto3 === false"
                                    type="number" name="ore2">
                                <label>{{ $t('hour') }}</label>
                            </div>
                            <div class="flex gap-2 items-center td-gap">
                                <input v-model="satData.Time5M" class="w-30" :disabled="satData.isAuto3 === false"
                                    type="number" name="min2">
                                <label>{{ $t('minute') }}</label>
                            </div>
                        </div>
                    </td>
                    <td v-else />
                </tr>
                <tr name="riga4" class="w-full">
                    <td>
                        <div class="flex gap-2 items-center">
                            <p>4</p>
                            <input @change ="onSubmit" v-model="satData.isAuto4" type="checkbox" name="auto-4">
                        </div>
                    </td>
                    <td>
                        <div class="mp-flex">
                            <div class="flex gap-2 items-center td-gap">
                                <input v-model="satData.ore6" class="w-30" :disabled="satData.isAuto4 === false"
                                    type="number" name="ore6">
                                <label>{{ $t('hour') }}</label>
                            </div>
                            <div class="flex gap-2 items-center td-gap">
                                <input v-model="satData.min6" class="w-30" :disabled="satData.isAuto4 === false"
                                    type="number" name="min6">
                                <label>{{ $t('minute') }}</label>
                            </div>
                        </div>
                    </td>
                    <td v-if="endProgramMode == 1">
                        <div class="flex gap-2 items-center">
                            <input v-model="satData.S7" class="w-30" :disabled="satData.isAuto4 === false" type="number"
                                name="cicli7">
                            <label>{{ $t('cycles') }}</label>
                        </div>
                    </td>
                    <td name="OrarioFine7" v-else-if="endProgramMode == 0">
                        <div class="mp-flex">
                            <div class="flex gap-2 items-center td-gap">
                                <input v-model="satData.Time7H" class="w-30" :disabled="satData.isAuto4 === false"
                                    type="number" name="ore2">
                                <label>{{ $t('hour') }}</label>
                            </div>
                            <div class="flex gap-2 items-center td-gap">
                                <input v-model="satData.Time7M" class="w-30" :disabled="satData.isAuto4 === false"
                                    type="number" name="min2">
                                <label>{{ $t('minute') }}</label>
                            </div>
                        </div>
                    </td>
                    <td v-else />
                </tr>
            </tbody>
        </table>
        <div class="button-wrapper">
            <MyButton type="submit" class="filled" :label="$t('save')" :loading="isLoading" />
        </div>
    </form>
</template>

<script setup>
import { useDataStore } from '@/stores/DataStore'
import { storeToRefs } from 'pinia'
import { computed, ref, onMounted } from '@vue/runtime-core'
import MyButton from '@/components/button/BaseButton.vue'

const dataStore = useDataStore()
const { postControlIsLoading } = storeToRefs(useDataStore())

//props
const props = defineProps({
    id: String,
    programNumber: Number,
    base_reg: Number,
    device_code: String,
    programConfig: Object,
    programStart: Object,
    parentIsLoading: Boolean
})

const postSatConData = ref({
    command: 'SATPRGSTARTS1',
    payload: {}
})

const endProgramRegister = computed(() => "S" + (props.base_reg + 3))
const endProgramMode = computed(() => props.programConfig[endProgramRegister.value])
const nameRegister = computed(() => "S" + (props.base_reg + 4))

const localIsLoading = ref(false)
const isLoading = computed(() => localIsLoading.value || props.parentIsLoading || postControlIsLoading.value)

const satData = computed(() => {
    let tempSatData = {}
    const { base_reg, programStart, programConfig } = props

    if (programStart === undefined || programConfig === undefined) {
        return tempSatData
    }

    let programRegister = "S" + (base_reg + 50)
    let tmpOreMin0 = programStart === undefined ? undefined : programStart[programRegister]?.split('.')

    programRegister = "S" + (base_reg + 52);
    let tmpOreMin2 = programStart === undefined ? undefined : programStart[programRegister]?.split('.')

    programRegister = "S" + (base_reg + 54);
    let tmpOreMin4 = programStart === undefined ? undefined : programStart[programRegister]?.split('.')

    programRegister = "S" + (base_reg + 56);
    let tmpOreMin6 = programStart === undefined ? undefined : programStart[programRegister]?.split('.')

    tempSatData.programName = programConfig[nameRegister.value]

    tempSatData.ore0 = tmpOreMin0 === undefined ? 0 : tmpOreMin0[0]
    tempSatData.min0 = tmpOreMin0 === undefined ? 0 : tmpOreMin0[1]
    tempSatData.isAuto1 = tmpOreMin0 === undefined ? false : Boolean(Number(tmpOreMin0[2]))

    tempSatData.ore2 = tmpOreMin2 === undefined ? 0 : tmpOreMin2[0]
    tempSatData.min2 = tmpOreMin2 === undefined ? 0 : tmpOreMin2[1]
    tempSatData.isAuto2 = tmpOreMin2 === undefined ? false : Boolean(Number(tmpOreMin2[2]))

    tempSatData.ore4 = tmpOreMin4 === undefined ? 0 : tmpOreMin4[0]
    tempSatData.min4 = tmpOreMin4 === undefined ? 0 : tmpOreMin4[1]
    tempSatData.isAuto3 = tmpOreMin4 === undefined ? false : Boolean(Number(tmpOreMin4[2]))

    tempSatData.ore6 = tmpOreMin6 === undefined ? 0 : tmpOreMin6[0]
    tempSatData.min6 = tmpOreMin6 === undefined ? 0 : tmpOreMin6[1]
    tempSatData.isAuto4 = tmpOreMin6 === undefined ? false : Boolean(Number(tmpOreMin6[2]))

    if (endProgramMode.value == 0) {
        programRegister = "S" + (base_reg + 51);
        var timeValue = programStart === undefined ? '0.00' : String(programStart[programRegister])?.split('.')
        tempSatData.Time1H = timeValue?.length > 0 ? timeValue[0] : null
        tempSatData.Time1M = timeValue?.length > 1 ? timeValue[1] : null

        programRegister = "S" + (base_reg + 53);
        timeValue = programStart === undefined ? '0.00' : programStart[programRegister]?.split('.')
        tempSatData.Time3H = timeValue?.length > 0 ? timeValue[0] : null
        tempSatData.Time3M = timeValue?.length > 1 ? timeValue[1] : null

        programRegister = "S" + (base_reg + 55);
        timeValue = programStart === undefined ? '0.00' : programStart[programRegister]?.split('.')
        tempSatData.Time5H = timeValue?.length > 0 ? timeValue[0] : null
        tempSatData.Time5M = timeValue?.length > 1 ? timeValue[1] : null

        programRegister = "S" + (base_reg + 57);
        timeValue = programStart === undefined ? '0.00' : programStart[programRegister]?.split('.')
        tempSatData.Time7H = timeValue?.length > 0 ? timeValue[0] : null
        tempSatData.Time7M = timeValue?.length > 1 ? timeValue[1] : null
    } else {
        //Lavora a cicli
        programRegister = "S" + (base_reg + 51);
        tempSatData.S1 = programStart === undefined ? 0 : programStart[programRegister]

        programRegister = "S" + (base_reg + 53);
        tempSatData.S3 = programStart === undefined ? 0 : programStart[programRegister]

        programRegister = "S" + (base_reg + 55);
        tempSatData.S5 = programStart === undefined ? 0 : programStart[programRegister]

        programRegister = "S" + (base_reg + 57);
        tempSatData.S7 = programStart === undefined ? 0 : programStart[programRegister]
    }

    return tempSatData
})

defineExpose({
    refreshData
})

function refreshData() {

}

function onSubmit() {
    const { programNumber } = props

    localIsLoading.value = true

    postSatConData.value.payload = {}
    postSatConData.value.command = String('SATPRGSTARTS' + (programNumber + 1))

    if (endProgramMode.value == 0) {
        satData.value.S1 = String(satData.value.Time1H) + "." + String(satData.value.Time1M)
        satData.value.S3 = String(satData.value.Time3H) + "." + String(satData.value.Time3M)
        satData.value.S5 = String(satData.value.Time5H) + "." + String(satData.value.Time5M)
        satData.value.S7 = String(satData.value.Time7H) + "." + String(satData.value.Time7M)
    }

    postSatConData.value.payload['S' + ((programNumber * 1000) + 10050)] = String(satData.value.ore0 + '.' + satData.value.min0 + "." + Number(satData.value.isAuto1))
    postSatConData.value.payload['S' + ((programNumber * 1000) + 10051)] = String(satData.value.S1)

    postSatConData.value.payload['S' + ((programNumber * 1000) + 10052)] = String(satData.value.ore2 + '.' + satData.value.min2 + "." + Number(satData.value.isAuto2))
    postSatConData.value.payload['S' + ((programNumber * 1000) + 10053)] = String(satData.value.S3)

    postSatConData.value.payload['S' + ((programNumber * 1000) + 10054)] = String(satData.value.ore4 + '.' + satData.value.min4 + "." + Number(satData.value.isAuto3))
    postSatConData.value.payload['S' + ((programNumber * 1000) + 10055)] = String(satData.value.S5)

    postSatConData.value.payload['S' + ((programNumber * 1000) + 10056)] = String(satData.value.ore6 + '.' + satData.value.min6 + "." + Number(satData.value.isAuto4))
    postSatConData.value.payload['S' + ((programNumber * 1000) + 10057)] = String(satData.value.S7)

    dataStore.postControl(props.device_code, postSatConData.value)

    localIsLoading.value = false
}

</script>


<style scoped>
.partenze-container {
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

.header {
    @apply flex flex-col justify-center items-center
}

.dropdown {
    @apply pl-2 rounded w-fit py-2 sm:py-3 cursor-pointer outline-none
}



input[type=text], input[type=password], input[type=number] {
    @apply pl-2 rounded w-10 md:w-20 py-2
}

.button-wrapper {
    @apply mt-3 flex w-[100px] mx-auto
}


/* Table Style */
.table-container {
    @apply w-full relative h-[300px] sm:h-full overflow-auto sm:overflow-visible
}

.table-container table {
    @apply mb-10 w-full
}


.table-container th {
    @apply font-semibold py-[10px] px-[10px] text-left sticky top-0 border-b-2 border-[#3a3a3e] bg-[#DDE8FA]/60 backdrop-blur-lg z-10
}

.table-container td {
    @apply py-[10px] px-[10px] bg-[#DDE8FA]/60 backdrop-blur-lg
}

.table-container th, td {
    @apply text-[10px] md:text-[16px]
}

.table-container tr {
    @apply text-left
}

.w-50 {
    width: 50%;
}

.w-10 {
    width: 10%;
}

.w-30 {
    width: 30%;
    min-width: 40px;
}

/* .w-40{
    width: 40%;
    min-width: 100px;
  } */

.mp-flex {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
}

.td-gap {
    margin-right: 1rem;
}
</style>