<script setup>
defineProps({
  columns: { type: Array, required: true },
  rows: { type: Array, required: true },
});
</script>

<template>
  <div class="card overflow-x-auto">
    <table class="w-full min-w-[640px] text-left">
      <thead>
        <tr class="border-b border-rule">
          <th v-for="column in columns" :key="column.key" class="type-meta px-4 py-3 text-mute">{{ column.label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id" class="border-b border-rule last:border-0">
          <td v-for="column in columns" :key="column.key" class="type-body px-4 py-3 align-middle">
            <slot :name="column.key" :row="row">{{ row[column.key] }}</slot>
          </td>
        </tr>
        <tr v-if="!rows.length">
          <td :colspan="columns.length" class="type-body p-8 text-center text-mute"><slot name="empty">Belum ada data.</slot></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
