<template>
  <div class="nav-wrapper sm-device">
    <div class="xs-icon-card cursor-pointer" v-show="isAlarm" @click="emits('alarmList')">
      <img src="@/assets/icon/warning-icon.png" class="cursor-pointer">
      <p>{{ $t('alarms') }}</p>
    </div>
    <div v-if="showMenu" class="hidden-menu">
      <div class="xs-icon-card" v-show="noSocial">
        <router-link :to="{ name: 'Dashboard' }"><img src="@/assets/whatsapp.png"></router-link>
        <p>{{ $t('supportChat') }}</p>
      </div>
      <div class="xs-icon-card" v-show="!noSocial">
        <router-link :to="{ name: 'Dashboard' }"><img src="@/assets/apple.png"></router-link>
        <p>{{ $t('downloadIosApp') }}</p>
      </div>
      <div class="xs-icon-card" v-show="!noSocial">
        <router-link :to="{ name: 'Dashboard' }"><img src="@/assets/android.png"></router-link>
        <p>{{ $t('downloadAndroidApp') }}</p>
      </div>
      <div class="xs-icon-card" v-show="backOn" @click="goBack">
        <img src="@/assets/Indietro.png" class="cursor-pointer">
        <p>{{ $t('backwards') }}</p>
      </div>
      <div class="xs-icon-card" v-show="logout" @click="signOut">
        <router-link :to="{ name: 'Dashboard' }"><img src="@/assets/logout.png"></router-link>
        <p>{{ $t('logout') }}</p>
      </div>
      <div class="xs-icon-card">
        <router-link :to="{ name: 'Dashboard' }"><img src="@/assets/home.png"></router-link>
        <p>{{ $t('home') }}</p>
      </div>
      <div class="xs-icon-card" @click="showMenu = false">
        <p>Hide Menu</p>
      </div>
    </div>
    
    <div v-else class="xs-icon-card" @click="showMenu = true">
      <p>App Menu</p>
    </div>
  </div>

  <div class="nav-wrapper md-device">
    <div class="xs-icon-card cursor-pointer" v-show="isAlarm" @click="emits('alarmList')">
      <img src="@/assets/icon/warning-icon.png" class="cursor-pointer">
      <p>{{ $t('alarms') }}</p>
    </div>
    <div class="xs-icon-card" v-show="noSocial">
        <router-link :to="{ name: 'Dashboard' }"><img src="@/assets/whatsapp.png"></router-link>
        <p>{{ $t('supportChat') }}</p>
      </div>
      <div class="xs-icon-card" v-show="!noSocial">
        <router-link :to="{ name: 'Dashboard' }"><img src="@/assets/apple.png"></router-link>
        <p>{{ $t('downloadIosApp') }}</p>
      </div>
      <div class="xs-icon-card" v-show="!noSocial">
        <router-link :to="{ name: 'Dashboard' }"><img src="@/assets/android.png"></router-link>
        <p>{{ $t('downloadAndroidApp') }}</p>
      </div>
      <div class="xs-icon-card" v-show="backOn" @click="goBack">
        <img src="@/assets/Indietro.png" class="cursor-pointer">
        <p>{{ $t('backwards') }}</p>
      </div>
      <div class="xs-icon-card" v-show="logout" @click="signOut">
        <router-link :to="{ name: 'Dashboard' }"><img src="@/assets/logout.png"></router-link>
        <p>{{ $t('logout') }}</p>
      </div>
      <div class="xs-icon-card">
        <router-link :to="{ name: 'Dashboard' }"><img src="@/assets/home.png"></router-link>
        <p>{{ $t('home') }}</p>
      </div>
  </div>
</template>

<script setup>
import router from '@/router'
import { useAuthStore } from '@/stores/AuthStore'
import { ref } from 'vue';

//props
const props = defineProps([
  'backOn', 'noSocial', 'logout', 'isAlarm'
])
// Define custom events
const emits = defineEmits(['alarmList'])

const authStore = useAuthStore()

const showMenu = ref(false)

async function signOut() {
  await authStore.signOut()
}
const goBack = () => {
  router.go(-1)
}

</script>

<style scoped>
.nav-wrapper {
  @apply fixed z-10 flex flex-col gap-2 bottom-0 right-[16px] pb-[16px] transition-all ease-in-out duration-200
}

.nav-wrapper a {
  @apply items-center justify-center cursor-pointer flex
}

.hidden-menu {
  @apply flex flex-col gap-2 
}

.sm-device {
  @apply md:hidden
}

.md-device {
  @apply hidden md:flex
}

/* .nav-wrapper img {
  @apply 
    w-[40px] h-[40px] 
    sm:w-[60px] sm:h-[60px] 
    md:w-[70px] md:h-[70px] 
    lg:w-[80px] lg:h-[80px] 
    xl:w-[100px] xl:h-[100px]
    2xl:w-[130px] 2xl:h-[130px]
    transition-all ease-in-out duration-200 hover:scale-110
} */
</style>
