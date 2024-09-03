<template>
  <div class="relative flex gap-4 items-center justify-end py-8">

    <a-button type="primary" @click="onRefresh">Refresh</a-button>
    <a-button type="primary" @click="onDownload">Export</a-button>
    <a-button type="primary" @click="toggleAdvanceSearch">Advance Search</a-button>
    <div
    :class="toggleFilter ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
    class="absolute right-0 top-20 z-10 w-96  grid transition-[grid-template-rows] duration-300 px-6 bg-slate-200">
      <div class="flex flex-col gap-8 overflow-hidden">

        <div class="py-4">
          <h3>Filter By Status</h3>
          <a-checkbox-group v-model:value="selectedStatuses" @change="onStatusFilterChange">
                <a-checkbox value="Konfirmasi Pembayaran">Konfirmasi Pembayaran</a-checkbox>
                <a-checkbox value="Lunas">Lunas</a-checkbox>
                <a-checkbox value="Proses Pembayaran">Proses Pembayaran</a-checkbox>
              </a-checkbox-group>
        </div>
      
        <div>
          <h3>Filter By Price</h3>
          <a-slider
          v-model="priceRange"
          range
          :min="0"
          :max="50000000"
          :step="50000"
          :marks="marks"
          @change="onPriceFilterChange"
          />
        </div>
      </div>
  
  </div>
  </div>
<div>

	<a-table
  class="h-full w-full"
  :scroll="{ x: 1500,}"
  
		:columns="columns"
		:data-source="filteredData"
		:pagination="{
			total: pagination.total,
			current: pagination.current,
			pageSize: pagination.pageSize,
			pageSizeOptions: pagination.pageSizeOptions,
			showSizeChanger: pagination.showSizeChanger,
			onChange: onPageChange,
		}"
    :row-key="record => record.id"
	>
		<template #headerCell="{ column }">
			<template v-if="column.key === 'name'">
				<span>
					<smile-outlined />
					Name
				</span>
			</template>
		</template>

		<template #bodyCell="{ column, record }">
			<template v-if="column.key === 'name'">
				<a>
					{{ record.name }}
				</a>
			</template>
			<template v-else-if="column.key === 'tags'">
				<span>
					<a-tag
						v-for="tag in record.tags"
						:key="tag"
						:color="
							tag === 'loser'
								? 'volcano'
								: tag.length > 5
								? 'geekblue'
								: 'green'
						"
					>
						{{ tag.toUpperCase() }}
					</a-tag>
				</span>
			</template>
			<template v-else-if="column.key === 'action'">
				<span>
					<a>Invite 一 {{ record.name }}</a>
					<a-divider type="vertical" />
					<a>Delete</a>
					<a-divider type="vertical" />
					<a class="ant-dropdown-link">
						More actions
						<down-outlined />
					</a>
				</span>
			</template>
		</template>
	</a-table>
</div>
</template>

<script lang="ts" setup>
import {
	SmileOutlined,
	DownOutlined,
} from '@ant-design/icons-vue';
import axios from 'axios';
import {columns} from '../tableColumns'
import { computed, onMounted, ref } from 'vue';
import DummyData from '../assets/dummyData.json';


const data = ref([]); // State untuk menyimpan data
const filteredData = ref([...DummyData]);
const selectedStatuses = ref([]);
const priceRange = ref([10000000, 50000000]);
const minPrice = computed(() => priceRange.value[0]);
const maxPrice = computed(() => priceRange.value[1]);
const marks = {
  0: '0',
  5000000: '5jt',
  10000000: '10jt',
  20000000: '20jt',
  30000000: '30jt',
  40000000: '40jt',
  50000000: '50jt',
};

const toggleFilter = ref(false);
const toggleAdvanceSearch = () => {
  toggleFilter.value = !toggleFilter.value;
};

const onPriceFilterChange = (values: [number, number]) => {
  priceRange.value = values;
  onStatusFilterChange(); // Apply price filter when price changes
};

// Fungsi untuk menyaring data berdasarkan status yang dipilih
const onStatusFilterChange = () => {
  filteredData.value = data.value.filter(item =>
    (selectedStatuses.value.length === 0 || selectedStatuses.value.includes(item.status)) &&
    item.hargaTerbentuk >= minPrice.value && item.hargaTerbentuk <= maxPrice.value
  );
};

// Fungsi untuk mereset semua filter dan memuat ulang data
const onRefresh = () => {
  selectedStatuses.value = [];
  priceRange.value = [0, 50000000];
  fetchData();
  onStatusFilterChange(); // Terapkan filter ulang setelah reset
};


// Fungsi untuk melakukan fetch data
const fetchData = () => {
	data.value = DummyData;
	pagination.value.total = DummyData.length;
};

// Mengambil data saat komponen di-mount
onMounted(() => {
  console.log('Initial data:', data.value);
	fetchData({});
  onStatusFilterChange();
});

console.log(data);
const pagination = ref({
	current: 1,
	pageSize: 10,
	total: 0,
	pageSizeOptions: [10, 50, 100, 500, 'All Entry'], // Pilihan jumlah entri
	showSizeChanger: true, // Menampilkan pilihan jumlah entri per halaman
});

const onPageChange = (page: number, pageSize: number) => {
	pagination.value.current = page;
	pagination.value.pageSize =
		pageSize === pagination.value.total
			? data.value.length
			: pageSize;
	// Lakukan fetch atau filter data jika diperlukan
	fetchData({});
};


</script>

<style>
/* Styling pageSizeOptions */
.ant-select-single:not(.ant-select-customize-input)
	.ant-select-selector {
	width: 100px !important;
	height: 32px;
	padding: 0 11px;
}
</style>
