<template>
  <base-modal :isOpenModal="isOpenModal" @close="onCloseModal">
    <template v-slot:body="">
      <div class="modal-body-container">
        <div class="body-left">
          <div>{{ "Material:" }}</div>
          <div>{{ "ProductCode:" }}</div>
          <div>{{ "Description:" }}</div>
        </div>
        <div class="body-right">
          <div class="input-material">
            <input type="text" name="" id="" v-model="inputMaterial" />
            <button @click="apiGet">🔍</button>
          </div>
          <div>{{ productCodeData }}</div>
          <div>{{ descriptionData }}</div>
        </div>
      </div>
      <div>
        <button @click="onAddMaterial" :disabled="isDisable">ADD</button>
        <button @click="onCloseModal()">Chancel</button>
      </div>
    </template>
  </base-modal>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from "vue";
import { fetchMaterial } from "@/services/mockApi";
import { GetMaterial } from "@/types/Api";
import BaseModal from "@/components/BaseModal.vue";
interface DataTable {
  Material: string;
  [key: string]: any;
}
interface Props {
  isOpenModal: boolean;
  data?: DataTable[];
}

const props = defineProps<Props>();

const emit = defineEmits(["is-open", "close", "add-material"]);

const inputMaterial = ref<string>("");
const productCodeData = ref<string>("-");
const descriptionData = ref<string>("-");

const isDisable = ref<boolean>(true);

function onCloseModal() {
  isDisable.value = true;
  inputMaterial.value = "";
  productCodeData.value = "";
  descriptionData.value = "";
  emit("close");
}
function onAddMaterial() {
  emit("add-material", inputMaterial.value);
  onCloseModal();
}

function checkData(): boolean {
  const found = props.data?.some(
    (item) => item.Material == inputMaterial.value
  );
  return found ? true : false;
}

async function apiGet() {
  productCodeData.value = "Loading...";
  descriptionData.value = "Loading...";

  try {
    await fetchMaterial({ Material: inputMaterial.value }).then(
      (response: GetMaterial[]) => {
        if (response.length === 0) {
          productCodeData.value = "No Material";
          descriptionData.value = "No Material";
          isDisable.value = true;
        } else {
          const productCode = response[0].ProductCode
            ? response[0].ProductCode
            : "No Material";
          const description = response[0].Description
            ? response[0].Description
            : "No Material";
          productCodeData.value = productCode;
          descriptionData.value = description;
          isDisable.value = checkData();
        }
      }
    );
  } catch (error) {
    console.error("Error fetching dataMock:", error);
  }
}
</script>

<style scoped lang="scss">
.background-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.507);
  display: flex;
  justify-content: center;
  align-items: center;
  .modal-container {
    min-width: 400px;
    min-height: 250px;
    background-color: white;
    border-radius: 20px;
  }
}
</style>
