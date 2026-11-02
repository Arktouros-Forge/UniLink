<script setup>
import { statusTone } from "@app/constants/options.json";
import { whatsappBase, whatsappGreeting } from "@app/constants/site.json";
import { whatsappLink } from "@app/utils/tone";

defineProps({ item: { type: Object, required: true } });
defineEmits(["accept", "decline"]);
</script>

<template>
  <div class="card flex flex-col gap-3">
    <div class="flex items-center gap-3">
      <UiAvatar :name="item.from" />
      <div class="flex-1 min-w-0">
        <p class="type-label truncate">{{ item.from }}</p>
        <p class="type-meta">{{ item.topic }} · {{ item.expires }}</p>
      </div>
      <UiChip :tone="statusTone[item.status].tone">{{ statusTone[item.status].label }}</UiChip>
    </div>
    <p class="type-body">{{ item.message }}</p>
    <div v-if="item.status === 'pending'" class="flex gap-3">
      <button class="btn-primary btn-sm" @click="$emit('accept', item)">Terima</button>
      <button class="btn-secondary btn-sm" @click="$emit('decline', item)">Tolak</button>
    </div>
    <a v-else-if="item.phone" :href="whatsappLink(whatsappBase, item.phone, whatsappGreeting)" target="_blank" rel="noopener" class="btn-secondary btn-sm self-start">
      <span class="i-keyline-icons-message" />Buka WhatsApp
    </a>
  </div>
</template>
