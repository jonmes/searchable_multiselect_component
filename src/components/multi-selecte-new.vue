<script setup>
import { ref } from "vue";
import {
  CheckIcon,
  XMarkIcon,
  ChevronDownIcon,
} from "@heroicons/vue/24/outline";
import hProgress from "./h-progress.vue";
import { useDebounceFn, onClickOutside } from "@vueuse/core";
import { MapIcon } from "@heroicons/vue/24/solid";
// import useClickOutside from '@/composable/clickOutside';

const props = defineProps({
  modelValue: {
    type: [String, Array, Object],
    default: () => [],
  },
  items: {
    type: Array,
    default: [],
  },
  init: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
    required: false,
  },
  value: {
    type: String,
    default: "id",
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  trailingIcon: {
    type: Function,
    default: ChevronDownIcon,
  },
});

const chips = ref([]);
const show = ref(false);
const search = ref(undefined);
const selected = ref({});
const set = ref(true);
const list_select = ref(null);

const emit = defineEmits(["update:modelValue", "update:selected", "search"]);

//=================== functions ============================

const select = (val) => {
  selected.value[val[props.value]] = !selected.value[val[props.value]];
  if (!Object.values(selected.value).includes(false)) {
    chips.value.push(val);
    console.log("selected", chips.value);
  } else {
    delete selected.value[val.id];
    console.log("val id", val.id);
    chips.value = chips.value.filter((e) => e.id != val.id);
    console.log("deleted", chips.value);
    // console.log(chips.value);
    //   console.log('found as',chips.value.filter(e => e != item))
  }
  emit("update:modelValue", chips.value);
};

const queryList = () => {
  emit("search", search.value);
};

if (props.init) {
  chips.value = [
    ...new Map(props.init.map((item) => [item[props.value], item])).values(),
  ];
  for (const val of chips.value) {
    selected.value[val[props.value]] = !selected.value[val[props.value]];
  }
  emit("update:modelValue", chips.value);
}

const deleteChip = (index) => {
  chips.value.splice(index, 1);
};

// const backspaceDelete = ({ which }) => {
//   which === 8 && currentInput.value === "" && chips.value.pop();
// };

onClickOutside(list_select, (e) => (show.value = false));
</script>

<template>
  <div class="w-full relative">
    <div class="flex flex-wrap bg-white relative pr-7">
      <div
        class="m-1 bg-gray-200 px-1 border-[1px] border-green-300 rounded-lg flex justify-center items-center break-words"
        v-for="(chip, i) of chips"
        :key="chip.label"
      >
        <span
          class="break-words whitespace-pre-wrap w-full flex flex-wrap overflow-hidden"
        >
          {{ chip.name }}
        </span>
        <XMarkIcon
          class="ml-1 w-4 h-4 hover:cursor-pointer"
          @click="deleteChip(i)"
          >clear</XMarkIcon
        >
      </div>
      <input
        class="flex-1 focus:ring-0 focus:outline-none min-w-5"
        name="select"
        @click="show = true"
        v-model="search"
        @input="queryList"
        @blur="outside"
        :disabled="false"
      />
      <div
        v-if="trailingIcon"
        class="absolute inset-y-0 right-0 pr-1 flex items-center pointer-events-none ml-2"
        @click="show = true"
      >
        <component
          class="h-5 w-5 text-red-400 ml-2"
          :is="trailingIcon"
        ></component>
      </div>
    </div>
    <ul
      ref="list_select"
      v-show="show"
      class="absolute z-10 w-full bg-white border border-primary shadow max-h-56 rounded-b-md text-base overflow-auto"
    >
      <li class="h-1">
        <h-progress
          v-if="loading"
          class="rounded-xl w-full"
          color1="bg-primary-lite"
          color2="bg-primary"
          color3="bg-primary-dark"
          height="h-1"
        ></h-progress>
      </li>
      <li
        v-for="item in items"
        @click="select(item)"
        class="border-b select-none relative py-3 px-3 hover:bg-ilo-blue text-gray-600 cursor-pointer"
      >
        <div class="flex items-center justify-between">
          <span class="text-gray-600 font-semibold block truncate">
            {{ item.title }}
            <!-- {{ selected[item[value]] }} -->
          </span>
          <CheckIcon
            v-if="multiple && selected[item[value]]"
            class="w-5 h-5 text-gray-600"
          />
        </div>
      </li>
    </ul>
  </div>
</template>
<style scoped>
/* width */
::-webkit-scrollbar {
  width: 4px;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px white;
  border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #009688;
  border-radius: 3px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #009688;
}
</style>
