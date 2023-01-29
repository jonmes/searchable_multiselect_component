<script setup>
import { ref } from "vue";
import Single_select from "./single_select.vue";
const set = ref("ab");
</script>

<template>
  <div class="w-1/2">
    <h1 class="text-4xl text-white">{{ set }}</h1>
    <Single_select
      v-model="set"
      name="selector"
      :items="[
        { name: 'abebe', id: 'ab' },
        { name: 'kebede', id: 'kb' },
      ]"
    />
  </div>
</template>
