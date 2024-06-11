<template>
  <div class="table-container">
    <table class="custom-table">
      <thead>
        <tr>
          <th v-for="(column, colKey) in columnTable" :key="colKey">
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody v-if="isLoading">
        <tr>
          <td :colspan="columnTable.length + 1">
            <div style="width: 100%; display: flex; justify-content: center">
              <slot name="entry">{{ "Loading......." }}</slot>
            </div>
          </td>
        </tr>
      </tbody>
      <tbody v-else-if="dataTable.length > 0">
        <tr v-for="(row, rowKey) in dataTable" :key="rowKey">
          <td v-for="(colCell, cellKey) in columnTable" :key="cellKey">
            <slot
              :name="`cell(${colCell.key})`"
              :item="row"
              :indexRow="rowKey"
              :indexCell="cellKey"
              >{{ row[colCell.key] || "" }}</slot
            >
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td :colspan="columnTable.length + 1">
            <div style="width: 100%; display: flex; justify-content: center">
              <slot name="entry">{{ "No Item" }}</slot>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, onMounted, watch } from "vue";
import { TableColumn } from "@/types/BaseTable";
interface Props {
  column: Array<TableColumn>;
  data?: Record<string, any>[];
  isLoading: boolean;
  search?: string;
}

const props = defineProps<Props>();

const columnTable = ref<TableColumn[]>([]);
const dataTable = ref<Record<string, any>[]>([]);

watch(
  () => [props.column, props.data],
  () => {
    columnTable.value = props.column || [];
    dataTable.value = props.data || [];
  },
  { deep: true }
);

onMounted(() => {
  columnTable.value = props.column;
  dataTable.value = props.data || [];
});
</script>

<style scoped lang="scss">
.table-container {
  margin: 0 auto;
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ccc;
}

.custom-table th,
.custom-table td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: center;
}

.custom-table th {
  background-color: #f2f2f2;
}
</style>
