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
  neutral: ":uno: bg-hairline text-ink",
  blue: ":uno: bg-blue-soft text-ink",
  red: ":uno: bg-red-soft text-danger",
  yellow: ":uno: bg-yellow-soft text-ink",
  success: ":uno: bg-success-soft text-ink",
  warning: ":uno: bg-warning-soft text-ink",
  danger: ":uno: bg-danger-soft text-danger",
};
const solid = {
  neutral: ":uno: bg-ink text-paper",
  blue: ":uno: bg-blue text-onblue",
  red: ":uno: bg-red text-onblue",
  yellow: ":uno: bg-yellow text-[#16151a]",
  success: ":uno: bg-success text-white",
  warning: ":uno: bg-warning text-[#16151a]",
  danger: ":uno: bg-danger text-onblue",
};
</script>

<template>
  <span
    class=":uno: inline-flex max-w-full items-center gap-1 rounded-sm font-sans font-medium whitespace-nowrap"
    :class="[
      outline ? ':uno: border border-blue text-blue bg-card' : filled ? solid[tone] : soft[tone],
      size === 'md' ? ':uno: px-2.5 py-1 text-[13px] leading-5' : ':uno: px-2 py-1 text-xs leading-5',
    ]"
  >
    <UiIcon v-if="icon" :name="icon" size="text-sm" />
    <span class=":uno: truncate"><slot /></span>
    <button v-if="removable" type="button" class=":uno: inline-flex bg-transparent border-0 p-0 cursor-pointer text-current" aria-label="Hapus" @click="$emit('remove')">
      <UiIcon name="close" size="text-sm" />
    </button>
  </span>
</template>
