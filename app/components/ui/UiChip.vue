<script setup>
defineProps({
  tone: { type: String, default: "neutral" },
  filled: { type: Boolean, default: false },
  outline: { type: Boolean, default: false },
  icon: { type: String, default: "" },
  removable: { type: Boolean, default: false },
  size: { type: String, default: "sm" },
});
defineEmits(["remove"]);

const soft = {
  neutral: "bg-hairline text-ink",
  blue: "bg-blue-soft text-ink",
  red: "bg-red-soft text-danger",
  yellow: "bg-yellow-soft text-ink",
  success: "bg-success-soft text-ink",
  warning: "bg-warning-soft text-ink",
  danger: "bg-danger-soft text-danger",
};
const solid = {
  neutral: "bg-ink text-paper",
  blue: "bg-blue text-onblue",
  red: "bg-red text-onblue",
  yellow: "bg-yellow text-[#16151a]",
  success: "bg-success text-white",
  warning: "bg-warning text-[#16151a]",
  danger: "bg-danger text-onblue",
};
</script>

<template>
  <span
    class="inline-flex items-center gap-1 rounded-sm font-sans font-medium whitespace-nowrap"
    :class="[
      outline ? 'border border-blue text-blue bg-card' : filled ? solid[tone] : soft[tone],
      size === 'md' ? 'px-2.5 py-1 text-[13px] leading-5' : 'px-2 py-1 text-xs leading-5',
    ]"
  >
    <UiIcon v-if="icon" :name="icon" size="text-sm" />
    <slot />
    <button v-if="removable" type="button" class="inline-flex bg-transparent border-0 p-0 cursor-pointer text-current" aria-label="Hapus" @click="$emit('remove')">
      <UiIcon name="close" size="text-sm" />
    </button>
  </span>
</template>
