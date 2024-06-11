<template>
  <div v-if="props.isOpenModal" class="main-modal-container">
    <div class="modal-inner" @click="handleClose">
      <div class="modal-container" @click.stop>
        <slot name="body"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

interface Props {
  isOpenModal: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(["is-open", "close"]);

const handleClose = () => {
  emit("close");
};
</script>

<style scoped lang="scss">
.main-modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.507); // Gray background with transparency

  .modal-inner {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  .modal-container {
    min-width: 400px;
    min-height: 250px;
    background-color: white;
    border-radius: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    position: relative;
    z-index: 1; // Ensure the modal is above the background
  }
}
</style>
