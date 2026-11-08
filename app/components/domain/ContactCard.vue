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
  <UiCard class="flex flex-col gap-3">
    <h2 class="t-d4 text-ink m-0 flex items-center gap-2"><UiIcon :name="open ? 'phone' : 'lock'" size="text-xl" />Kontak</h2>
    <template v-if="open">
      <p v-if="phone" class="t-mono-m text-ink m-0">{{ formatPhone(phone) }}</p>
      <UiButton icon="external" :href="href" class="self-start">WhatsApp {{ name.split(" ")[0] }}</UiButton>
    </template>
    <p v-else class="t-body-s text-ink-2 m-0">{{ lockedText }}</p>
  </UiCard>
</template>
