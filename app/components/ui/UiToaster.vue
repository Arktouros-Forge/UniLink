<script setup>
import { useToastStore } from "@app/stores/toast";

const toast = useToastStore();
const icons = { success: "checkCircle", danger: "alert", info: "info" };
const bars = { success: "bg-success", danger: "bg-danger", info: "bg-blue" };
</script>

<template>
  <Teleport to="body">
    <div class="fixed z-60 inset-x-5 bottom-24 flex flex-col gap-2 md:inset-x-auto md:right-6 md:bottom-6 md:w-[360px]" aria-live="polite">
      <div v-for="item in toast.items" :key="item.id" class="surface shadow-popover flex items-stretch overflow-hidden" role="status">
        <span class="w-1 shrink-0" :class="bars[item.tone]" />
        <p class="t-body-s text-ink m-0 flex-1 px-4 py-3 flex items-center gap-2"><UiIcon :name="icons[item.tone]" size="text-xl" />{{ item.message }}</p>
        <button type="button" class="px-3 bg-transparent border-0 cursor-pointer text-ink-2 hover:text-ink" aria-label="Tutup" @click="toast.dismiss(item.id)"><UiIcon name="close" size="text-lg" /></button>
      </div>
    </div>
  </Teleport>
</template>
