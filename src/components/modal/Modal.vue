<template>
  <div class="modal">
    <slot></slot>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>



.modal {
  @apply  m-auto bg-white p-8 rounded-xl text-left drop-shadow-md flex flex-col box-border text-white 
          w-[360px]
          text-sm 
          transition-all ease-in-out duration-200 transform
          /* w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-[360px] lg:h-[464px] */
}

.modal {
  background: linear-gradient(45.06deg, #7F0808 -8.2%, #EA1111 108.15%);
  border-radius: 80px;
  border: 2px solid #000000;
}
</style>