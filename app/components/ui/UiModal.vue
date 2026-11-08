<script setup>
const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, required: true },
  width: { type: String, default: "max-w-[480px]" },
});
const emit = defineEmits(["close"]);

const onKey = (event) => {
  if (event.key === "Escape" && props.open) emit("close");
};
onMounted(() => window.addEventListener("keydown", onKey));
onBeforeUnmount(() => window.removeEventListener("keydown", onKey));
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 flex items-end justify-center bg-backdrop md:items-center md:p-6" @click.self="emit('close')">
      <div class="w-full max-h-[92dvh] flex flex-col bg-elevated shadow-modal rounded-t-lg md:rounded-lg border border-hairline" :class="width" role="dialog" aria-modal="true">
        <header class="flex items-center justify-between gap-4 px-6 pt-5 pb-3">
          <h2 class="t-d4 text-ink m-0">{{ title }}</h2>
          <UiIconButton icon="close" label="Tutup" @click="emit('close')" />
        </header>
        <div class="px-6 py-3 overflow-y-auto flex flex-col gap-4"><slot /></div>
        <footer v-if="$slots.footer" class="flex flex-col gap-3 px-6 py-4 border-t border-hairline sm:flex-row-reverse sm:items-center sm:justify-start [&>*]:w-full sm:[&>*]:w-auto"><slot name="footer" /></footer>
      </div>
    </div>
  </Teleport>
</template>
