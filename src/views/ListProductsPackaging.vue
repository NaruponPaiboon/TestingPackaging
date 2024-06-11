<template>
  <div class="main-containers">
    <div class="search-containers">
      <div>
        <span>Material: </span>
        <input type="text" v-model="textSearch" />
      </div>
      <button @click="onSearch()">Search 🔍</button>
    </div>
    <div style="display: flex; justify-content: end">
      <button @click="onAdd()">➕</button>
    </div>
    <div>
      <base-table
        :column="columnTable"
        :data="dataTable"
        :isLoading="isLoading"
      >
        <template
          v-for="(col, index) in locationColumns"
          :key="index"
          v-slot:[`cell(${col.key})`]="slotProps"
        >
          <input
            type="number"
            v-model="slotProps.item[col.key]"
            @input="validate(slotProps.item, col.key)"
            :tabindex="
              dataTable.length * slotProps.indexCell +
              (slotProps.indexRow - dataTable.length + 1)
            "
          />
        </template>
        <template v-slot:cell(Sum)="slotProps">
          {{ calculateSum(slotProps.item) }}
        </template>
      </base-table>
    </div>
    <div style="display: flex; justify-content: end">
      <button @click="onSave()">{{ "Save" }}</button>
    </div>
  </div>

  <modal-add
    v-model:is-open-modal="isOpenModal"
    :data="dataTable"
    @add-material="setAddDataTable"
    @close="onCloseModal()"
  >
  </modal-add>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { TableColumn } from "@/types/BaseTable";
import BaseTable from "@/components/BaseTable.vue";
import ModalAdd from "@/components/ModalAdd.vue";
import { saveListMaterial, fetchLitsTable } from "@/services/mockApi";
import { SaveListMaterial, LitsTableResponse } from "@/types/Api";

interface DataTable {
  Material: string;
  [key: string]: any;
}

const columnTable = ref<TableColumn[]>([
  // { key: "Material", label: "Material" },
  // { key: "A1", label: "A1" },
  // { key: "A2", label: "A2" },
  // { key: "A3", label: "A3" },
  // { key: "Sum", label: "Sum" },
]);
const locationColumns = ref<TableColumn[]>([]);
const dataTable = ref<DataTable[]>([]);
const originalDataTable = ref<DataTable[]>([]);
const textSearch = ref<string>("");
const isLoading = ref<boolean>(false);
const isOpenModal = ref<boolean>(false);

const locationList = ref<string[]>([]);
function validate(item: Record<string, any>, key: string) {
  if (item[key] < 0) {
    item[key] = 0;
  }
}

function mapTable(dataMock: LitsTableResponse[]) {
  //unique location
  const locationSet = new Set<string>();
  dataMock.forEach((item) => {
    locationSet.add(item.Location);
  });
  locationList.value = Array.from(locationSet).sort();

  //map data
  dataMock.forEach((item) => {
    const { Material, Location, QTY } = item;
    const found = dataTable.value.find(
      (item: DataTable) => item.Material == Material
    );
    if (!found) {
      const data = ref<DataTable>({ Material: Material });
      locationList.value.forEach((itemLocation: string) => {
        if (Location == itemLocation) {
          data.value[itemLocation] = QTY;
        } else {
          data.value[itemLocation] = 0;
        }
      });
      dataTable.value.push(data.value);
    } else {
      dataTable.value.forEach((item: DataTable) => {
        if (item.Material == Material) {
          item[Location] = QTY;
        }
      });
    }
  });
  //map column
  const colLocation = ref<TableColumn[]>([]);
  columnTable.value.push({ key: "Material", label: "Material" });
  locationList.value.forEach((itemLocation: string) => {
    colLocation.value.push({ key: itemLocation, label: itemLocation });
  });
  colLocation.value.forEach((item: TableColumn) => {
    columnTable.value.push(item);
  });
  columnTable.value.push({ key: "Sum", label: "Sum" });
  locationColumns.value = colLocation.value;
}

function calculateSum(data: Record<string, any>) {
  let total = 0;
  Object.keys(data).forEach((key) => {
    if (key !== "Material" && key !== "Sum") {
      total += data[key] || 0;
    }
  });
  return total;
}
function setAddDataTable(Material: string) {
  const data = ref<DataTable>({ Material: Material });
  locationList.value.forEach((itemLocation: string) => {
    data.value[itemLocation] = 0;
  });
  data.value["Sum"] = 0;
  originalDataTable.value.push(data.value);
  dataTable.value = [...originalDataTable.value];
  textSearch.value = "";
}

async function onSearch() {
  if (textSearch.value) {
    dataTable.value = originalDataTable.value.filter((item) =>
      item.Material.includes(textSearch.value)
    );
  } else {
    dataTable.value = [...originalDataTable.value];
  }
}

function onAdd() {
  isOpenModal.value = true;
}
function onSave() {
  const dataSave = ref<SaveListMaterial[]>([]);
  originalDataTable.value.forEach((item) => {
    const total = Object.keys(item)
      .filter((key) => key !== "Material" && item[key] > 0)
      .map((key) => ({
        Material: item.Material,
        Location: key,
        QTY: Number(item[key]),
      }));

    total.forEach((totalItem) => {
      dataSave.value.push(totalItem);
    });
  });
  apiSaveListMaterial(dataSave.value);
}

async function apiGetLitsTable() {
  isLoading.value = true;
  try {
    await fetchLitsTable().then((response) => {
      columnTable.value = [];
      dataTable.value = [];
      originalDataTable.value = [];
      mapTable(response);
      originalDataTable.value = [...dataTable.value];
    });
  } catch (error) {
    console.error("Error fetching dataMock:", error);
  } finally {
    isLoading.value = false;
  }
}

async function apiSaveListMaterial(dataSave: SaveListMaterial[]) {
  try {
    const response = await saveListMaterial(dataSave);
    alert("Save successful! Data in console.");
    console.log("---------------------------------");
    console.log("Save: ", JSON.parse(JSON.stringify(response)));
    response.forEach((item) => {
      console.log(" -> ", JSON.parse(JSON.stringify(item)));
    });
    5555;
    console.log("---------------------------------");
  } catch (error) {
    console.error("Error saving data:", error);
  }
}

function onCloseModal() {
  isOpenModal.value = false;
}
watch(
  dataTable,
  (newDataTable) => {
    newDataTable.forEach((newItem) => {
      const originalItem = originalDataTable.value.find(
        (item) => item.Material === newItem.Material
      );
      if (originalItem) {
        Object.assign(originalItem, newItem);
      }
    });
  },
  { deep: true }
);

onMounted(() => {
  apiGetLitsTable();
});
</script>
<style scoped lang="scss">
@import url("../assets/styles/listProductsPackaging.scss");
</style>
