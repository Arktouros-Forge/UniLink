<script setup>
defineProps({ items: { type: Array, required: true } });
const marker = { done: ":uno: bg-blue", current: ":uno: bg-yellow", todo: ":uno: bg-card" };
</script>

<template>
  <ol class=":uno: m-0 p-0 list-none flex flex-col">
    <li v-for="(item, index) in items" :key="item.title" class=":uno: flex gap-4">
      <div class=":uno: flex flex-col items-center">
        <span class=":uno: size-4 shrink-0 border-2 border-outline" :class="marker[item.state || ':uno: todo']" />
        <span v-if="index < items.length - 1" class=":uno: w-px flex-1 bg-hairline min-h-6" />
      </div>
      <div class=":uno: flex flex-col gap-0.5 pb-5">
        <p class=":uno: t-label m-0" :class="item.state === 'todo' ? ':uno: text-ink-2' : ':uno: text-ink'">{{ item.title }}</p>
        <p v-if="item.text" class=":uno: t-body-s text-ink-2 m-0">{{ item.text }}</p>
        <p v-if="item.at" class=":uno: t-mono-s text-ink-3 m-0">{{ item.at }}</p>
      </div>
    </li>
  </ol>
</template>
