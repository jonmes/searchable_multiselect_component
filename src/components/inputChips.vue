<script setup>
import { ref } from "vue";
import { XMarkIcon } from "@heroicons/vue/24/solid";
const set = ref(true);
const chips = ref([]);
const currentInput = ref();

const saveChip = () => {
  ((set.value && chips.value.indexOf(currentInput.value) === -1) ||
    !set.value) &&
    chips.value.push(currentInput.value);
  currentInput.value = "";
};

const deleteChip = (index) => {
  chips.value.splice(index, 1);
};

const backspaceDelete = ({ which }) => {
  which === 8 && currentInput.value === "" && chips.value.pop();
};
</script>

<template>
  <div class="w-1/2 flex flex-wrap border-[1px] border-green-300">
    <div
      class="m-1 bg-gray-200 px-1 border-[1px] border-green-300 rounded-lg flex justify-center items-center break-words"
      v-for="(chip, i) of chips"
      :key="chip.label"
    >
      <span
        class="break-words whitespace-pre-wrap w-full flex flex-wrap overflow-hidden"
      >
        {{ chip }}
      </span>
      <XMarkIcon
        class="ml-1 w-4 h-4 hover:cursor-pointer"
        @click="deleteChip(i)"
        >clear</XMarkIcon
      >
    </div>
    <input
      class="focus:ring-0 focus:outline-none w-full flex-1"
      v-model="currentInput"
      @keypress.enter="saveChip"
      @keydown.delete="backspaceDelete"
    />
  </div>
</template>

<style></style>
