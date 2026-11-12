<script setup>
import { whatsappBase } from "@app/constants/site.json";
import { formatPhone, whatsappUrl } from "@app/utils/format";

const props = defineProps({
  name: { type: String, required: true },
  url: { type: String, default: "" },
  phone: { type: String, default: "" },
  unlocked: { type: Boolean, default: false },
  lockedText: { type: String, default: "Nomor WhatsApp terbuka setelah permintaan diterima." },
});
const open = computed(() => props.unlocked || Boolean(props.url));
const href = computed(() => props.url || whatsappUrl(whatsappBase, props.phone));
</script>

<template>
  <UiCard class=":uno: flex flex-col gap-3">
    <h2 class=":uno: t-d4 text-ink m-0 flex items-center gap-2"><UiIcon :name="open ? 'phone' : 'lock'" size="text-xl" />Kontak</h2>
    <template v-if="open">
      <p v-if="phone" class=":uno: t-mono-m text-ink m-0">{{ formatPhone(phone) }}</p>
      <UiButton icon="external" :href="href" class=":uno: self-start">WhatsApp {{ name.split(" ")[0] }}</UiButton>
    </template>
    <p v-else class=":uno: t-body-s text-ink-2 m-0">{{ lockedText }}</p>
  </UiCard>
</template>
