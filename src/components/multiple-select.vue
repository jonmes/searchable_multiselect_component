<script setup>
import { ref, computed, watch, onBeforeMount, watchEffect } from "vue";
import { CheckIcon, XMarkIcon } from "@heroicons/vue/24/outline";
import { useDebounceFn } from "@vueuse/core";
import { useField } from "vee-validate";
import _uniqBy from "lodash.uniqby";
import hProgress from "./h-progress.vue";

const emit = defineEmits(["update:modelValue", "update:selected", "search"]);
const props = defineProps({
  id: String,
  label: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  items: {
    type: Array,
    required: true,
    default() {
      return [];
    },
  },
  init: {
    type: Array,
    default: () => [],
  },
  initId: {
    type: String,
  },
  text: {
    type: String,
    default: "name",
  },
  value: {
    type: String,
    default: "id",
  },
  search: {
    type: String,
  },
  modelValue: {
    type: [String, Array, Object],
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  errorMessages: {
    type: String,
  },
  placeHolder: {
    type: String,
  },
  supportClass: {
    type: String,
    default: "",
  },
  clearable: Boolean,
  trailingIcon: Function,
  rules: {
    type: String,
    default: "",
    required: false,
  },
  supporter: {
    type: String,
  },
  hideDetails: Boolean,
  disabled: [Boolean],
});

// ================================================================================================
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
  select(chips.value[index]);
  //   chips.value.splice(index, 1);
};

// const backspaceDelete = ({ which }) => {
//   which === 8 && currentInput.value === "" && chips.value.pop();
// };

// ================================================================================================

const data = computed(() => {
  const result = props.items.slice(0, props.items.length);

  const temp_init = props.init.map((itm) => {
    return itm[props.initId];
  });

  return _uniqBy(result.concat(temp_init), (itm) => {
    return itm.id;
  });
});

const {
  errorMessage,
  value: inputValue,
  meta,
} = useField(props.name, props.rules, {
  // initialValue: props.modelValue?.length ? props.modelValue : props.init?.length ? props.init : undefined,
  initialValue: props.modelValue?.length ? props.modelValue : null,
});

const vv = ref(props.modelValue);
const selected = ref({});
const _placeholder = ref("");
const show = ref(false);
const input = ref(null);
const search = ref(undefined);

onBeforeMount(() => {
  if (props.multiple && inputValue.value) {
    for (let v in inputValue.value) {
      selected.value[inputValue.value[v]] = true;
    }
  }
});

const placeholder = computed(() => {
  if (!props.multiple) {
    let v = data.value.find((e) => e[props.value] === vv.value);
    if (v) {
      selected.value = v[props.value];
      _placeholder.value = v[props.text];
    } else if (props.placeHolder) _placeholder.value = props.placeHolder;
    else _placeholder.value = "Select";
  } else if (
    props.multiple &&
    inputValue.value &&
    data.value.length &&
    inputValue.value.length > 0
  ) {
    let mv = [];
    vv.value.forEach((itm) => {
      data.value.forEach((it) => {
        if (it[props.value] == itm) {
          mv.push(it[props.text]);
        }
      });
    });

    if (mv.length)
      _placeholder.value = mv.reduce((prev, curr) => {
        return prev + ",  " + curr;
      });
    // else if(!vv.value.length) {
    //   _placeholder.value = "Select";
    //     inputValue.value = undefined
    // }
    else if (props.placeHolder) _placeholder.value = props.placeHolder;
    else {
      _placeholder.value = "Select";
      inputValue.value = undefined;
    }
  } else {
    _placeholder.value = "Select";
    inputValue.value = props.modelValue?.length
      ? props.modelValue
      : props.init?.length
      ? props.init
      : null;
  }
  return _placeholder.value;
});

const select = (item) => {
  search.value = undefined;
  if (props.multiple) {
    selected.value[item[props.value]] = !selected.value[item[props.value]];
    console.log(
      "selected value",
      selected.value,
      Object.values(selected.value)
    );
    if (!Object.values(selected.value).includes(false)) {
      console.log("add", item);
      chips.value.push(item);
    } else {
      console.log("to be delete", item);
      delete selected.value[item.esco_code];
      chips.value = chips.value.filter((e) => e != item);
      console.log(chips.value);
      //   console.log('found as',chips.value.filter(e => e != item))
    }
    // else {
    //   console.log("delete");
    // }
    let selectedd = [];
    let selectedObj = [];
    inputValue.value = [];
    for (let key of Object.keys(selected.value)) {
      if (selected.value[key]) {
        inputValue.value.push(key);
        selectedd.push(key);
        data.value.forEach((elt) => {
          if (elt.id === key) selectedObj.push(elt);
        });
      }
    }
    vv.value = selectedd.map((itm) => itm);
    emit("update:selected", selectedObj);
    emit("update:modelValue", selectedd);
    return;
  }
  vv.value = item.id;
  inputValue.value = item[props.value];
  emit("update:modelValue", item[props.value]);
  emit("update:selected", item);
  selected.value = item[props.value];
  _placeholder.value = item[props.text];
  show.value = false;
};

const outside = useDebounceFn(() => {
  show.value = false;
}, 300);

const queryList = () => {
  emit("search", search.value);
};
</script>
<template>
  <div>
    <slot name="label"></slot>
    <div class="relative">
      <div
        v-if="props.leadingIcon"
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
      >
        <component
          class="h-5 w-5 text-gray-400"
          :is="props.leadingIcon"
        ></component>
      </div>
      <div class="flex flex-wrap border-[1px] border-green-300">
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
          name="select"
          :disabled="props.disabled"
          ref="input"
          @click="show = true"
          autocomplete="off"
          v-model="search"
          @input="queryList"
          step="any"
          @blur="outside"
          :name="props.name"
          :class="[
            !errorMessage
              ? 'focus:ring-primary  focus:border-primary hover:border-primary border-gray-300 border-1'
              : 'focus:ring-red-500 focus:border-red-500 hover:border-red-500 border-red-500',
            props.leadingIcon ? 'pl-10' : '',
            props.trailingIcon ? 'pr-10' : '',
            supportClass ? supportClass : '',
          ]"
          class="block w-full flex-1 text-secondary focus:outline-none text-base px-3 py-2"
        />
      </div>
      <div
        v-if="props.trailingIcon"
        class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none ml-2"
      >
        <component
          class="h-5 w-5 text-gray-400 ml-2"
          :is="props.trailingIcon"
        ></component>
      </div>
      <ul
        v-show="show"
        class="absolute z-10 w-full bg-white border border-primary shadow max-h-56 rounded-md text-base overflow-auto"
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
          :key="item.id"
          @click="select(item)"
          class="border-b select-none relative py-3 px-3 hover:bg-ilo-blue text-gray-600 cursor-pointer"
        >
          <div class="flex items-center justify-between">
            <span class="text-gray-600 font-semibold block truncate">{{
              item.name
            }}</span>
            <CheckIcon
              v-if="multiple && selected[item[value]]"
              class="w-5 h-5 text-gray-600"
            />
            <CheckIcon
              v-else-if="selected === item[value]"
              class="w-5 h-5 text-gray-600"
            />
          </div>
        </li>
      </ul>
    </div>
    <p
      v-if="!hideDetails"
      :visible="errorMessage"
      class="mt-2 text-sm text-red-600"
      id="email-error"
    >
      {{ errorMessage }} &nbsp;
    </p>
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
