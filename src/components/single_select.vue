<script setup>
import { ref, watch, watchEffect } from "vue";
import { useField } from "vee-validate";
import vClickOutside from "@/directives/click-outside.js";
import Visible from "@/directives/visible";
import { XMarkIcon } from "@heroicons/vue/24/solid";

const props = defineProps({
  id: String,
  trailingIcon: Function,
  query: Object,
  items: {
    type: Array,
    default: () => [],
  },
  placeholder: String,
  label: String,
  clearable: Boolean,
  returnObject: Boolean,
  modelValue: {
    type: [String, Number, Object],
    default: undefined,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "text",
    required: false,
  },
  labelClass: {
    type: String,
    default: "",
    required: false,
  },
  rules: {
    type: String,
    default: "",
    required: false,
  },
  listClass: {
    type: String,
  },
});

const emit = defineEmits(["update:modelValue"]);

let items = ref(props.items || []);
const show = ref(false);
const placeholder = ref("");
const input = ref(null);
const {
  errorMessage,
  value: inputValue,
  meta,
} = useField(props.name, props.rules, {
  initialValue: props.modelValue,
});

const outside = () => {
  show.value = false;
};

const set = (item) => {
  inputValue.value = item["id"];
  show.value = false;
  if (props.returnObject) {
    emit("update:modelValue", item);
  } else {
    emit("update:modelValue", item.id);
  }
};
const clear = () => {
  placeholder.value = undefined;
  inputValue.value = "";
  show.value = false;
  input.value.focus();
  emit("update:modelValue", undefined);
};

watchEffect(() => {
  inputValue.value = props.modelValue;
  let selectedItem = {};
  selectedItem = items.value.find((itm) => itm.id === props.modelValue);
  if (selectedItem) {
    placeholder.value = selectedItem.name;
  }
});
</script>
<template>
  <div class="relative" v-click-outside="outside">
    <label :for="id" :class="labelClass" class="block">{{ label }}</label>
    <div class="mt-1 relative rounded-md shadow-sm">
      <input
        ref="input"
        v-model="placeholder"
        @click="show = true"
        @focus="show = true"
        autocomplete="off"
        :type="type"
        :placeholder="placeholder"
        :name="props.name"
        :id="id"
        :class="{
          'focus:ring-primary  focus:border-primary hover:border-primary-2 border-gray-300':
            !errorMessage,
          'focus:ring-red-500 focus:border-red-500 hover:border-red-500 border-red-500':
            errorMessage,
        }"
        class="block w-full pr-10 text-hahugray placeholder-hahugray focus:outline-none text-base rounded-md h-list"
        aria-invalid="true"
        aria-describedby="email-error"
      />
      <!-- icon -->
      <div
        v-if="trailingIcon"
        class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
      >
        <component class="h-5 w-5 text-gray-400" :is="trailingIcon"></component>
      </div>
      <div
        v-if="clearable"
        @click="clear"
        class="absolute inset-y-0 right-0 pr-3 flex items-center"
      >
        <XMarkIcon class="h-5 w-5 text-gray-800 cursor-pointer"></XMarkIcon>
      </div>
    </div>
    <ul
      v-show="show"
      class="absolute z-10 w-full bg-white border shadow max-h-56 rounded-md text-base overflow-auto"
      :class="[listClass || '']"
    >
      <li
        v-for="item in items"
        :key="item.id"
        @click="set(item)"
        class="border-b select-none relative py-3 px-3 hover:bg-ilo-blue text-ilo-black cursor-pointer"
      >
        <div class="flex items-center justify-between">
          <span class="text-ilo-black font-semibold block truncate">{{
            item.name
          }}</span>
          <!-- <CheckIcon
            v-if="multiple && selected[item[value]]"
            class="w-5 h-5 text-ilo-black"
          />
          <CheckIcon
            v-else-if="selected === item[value]"
            class="w-5 h-5 text-ilo-black"
          /> -->
        </div>
      </li>
    </ul>
    <p
      :visible="errorMessage"
      class="mt-2 text-sm text-red-600"
      id="email-error"
    >
      {{ errorMessage }} &nbsp;
    </p>
  </div>
</template>
