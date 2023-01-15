<script setup>
import { ref, computed, inject, watchEffect } from "vue";
import MultipleSelect from "@/components/multiple-select.vue";
import { ChevronDownIcon } from "@heroicons/vue/24/outline";
const axios = inject("axios");

const search = ref("");
const search_loading = ref(false);
const search_result = ref();
let response;

const startSearch = async () => {
  if (search.value.length > 3) {
    try {
      if (search.value.length > 3) {
        search_loading.value = true;
        response = await axios.get(
          `${import.meta.env.VITE_ESCO_API}/search?text=${
            search.value
          }&language=en&type=occupation&facet=type&facet=isInScheme&limit=20&offset=0`
        );
        if (response && response.data) {
          search_result.value = response?.data?._embedded?.results.map(
            (val) => {
              return {
                title: val.title,
                esco_code: val.code,
                // search_hit: val.searchHit,
                job_uri: val.uri,
                selected: false,
                id: val.code,
                name: val.title,
              };
            }
          );
          // console.log("search result", search_result.value);
          // search_result.value = [search_result.value];
          search_loading.value = false;
        }
      }
    } catch (error) {
      console.log("error", error);
      search_loading.value = false;
    }
  }
};

const onFieldSearch = (d) => {
  // console.log('search',d )
  search.value = d;
  startSearch();
};
const item = ref({});

const init = ref([]);
</script>

<template>
  <div class="w-1/2">
    <!-- <span v-if="search_loading" class="text-7xl">Loading ......</span> -->
    <!-- <input
      v-model="search"
      @input="startSearch"
      class="border-2 border-red-600"
    /> -->
    {{ item.search }}
    <MultipleSelect
      :trailingIcon="ChevronDownIcon"
      placeholder="Test"
      name="Test"
      :items="search_result"
      :loading="search_loading"
      @search="onFieldSearch"
      v-model="item.search"
      supporter="max-h-36"
      multiple
      :init="init"
      init-id="field_of_study"
    >
      {{ item.field }}
      <template v-slot:label>
        <div class="text-lg mb-2 text-black font-body font-medium">
          Test <span class="text-red-500">*</span>
        </div>
      </template>
    </MultipleSelect>
  </div>
</template>
