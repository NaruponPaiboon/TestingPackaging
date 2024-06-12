<template>
  <base-modal :isOpenModal="isOpenModal" @close="onCloseModal">
    <template v-slot:body="">
      <div class="modal-body-container">
        <div class="body-left">
          <div>{{ "Material : " }}</div>
          <div>{{ "Product Code : " }}</div>
          <div>{{ "Description : " }}</div>
        </div>
        <div class="body-right">
          <div class="input-material">
            <input type="text" name="" id="" v-model="inputMaterial" />
            <button @click="apiGet" :disabled="inputMaterial == ''">🔍</button>
          </div>
          <div>{{ productCodeData }}</div>
          <div>{{ descriptionData }}</div>
        </div>
      </div>
      <div class="modal-footer-container">
        <button @click="onAddMaterial" :disabled="isDisable">
          {{ "Add" }}
        </button>
        <button @click="onCloseModal()">{{ "Chancel" }}</button>
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
  const textLoading = "Loading...";
  productCodeData.value = textLoading;
  descriptionData.value = textLoading;

  try {
    await fetchMaterial({ Material: inputMaterial.value }).then(
      (response: GetMaterial[]) => {
        const text = "No Material";
        if (response.length === 0) {
          productCodeData.value = text;
          descriptionData.value = text;
          isDisable.value = true;
        } else {
          const productCode = response[0].ProductCode
            ? response[0].ProductCode
            : text;
          const description = response[0].Description
            ? response[0].Description
            : text;
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
.modal-body-container {
  height: 100%;
  padding: 2rem;
  display: flex;
  justify-content: center;
  .body-left {
    min-width: 200px;
    div {
      height: 30px;
      display: flex;
      justify-content: start;
      align-items: center;
    }
  }
  .body-right {
    min-width: 200px;
    div {
      height: 30px;
      display: flex;
      justify-content: start;
      align-items: center;
    }
  }
}
.modal-footer-container{
  display: flex;
  justify-content: center;
  align-items: center;
  button{
    margin: 0 0.2rem;
    padding: 0.2rem .5rem;
    min-width: 70px;
  }
}
</style>
