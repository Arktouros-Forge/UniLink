<script setup>
defineProps({ items: { type: Array, required: true } });
const marker = { done: "bg-blue", current: "bg-yellow", todo: "bg-card" };
</script>

<template>
  <ol class="m-0 p-0 list-none flex flex-col">
    <li v-for="(item, index) in items" :key="item.title" class="flex gap-4">
      <div class="flex flex-col items-center">
        <span class="size-4 shrink-0 border-2 border-outline" :class="marker[item.state || 'todo']" />
        <span v-if="index < items.length - 1" class="w-px flex-1 bg-hairline min-h-6" />
      </div>
      <div class="flex flex-col gap-0.5 pb-5">
        <p class="t-label m-0" :class="item.state === 'todo' ? 'text-ink-2' : 'text-ink'">{{ item.title }}</p>
        <p v-if="item.text" class="t-body-s text-ink-2 m-0">{{ item.text }}</p>
        <p v-if="item.at" class="t-mono-s text-ink-3 m-0">{{ item.at }}</p>
      </div>
    </li>
  </ol>
</template>
