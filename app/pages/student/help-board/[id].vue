<script setup>
import { sign as extras } from "@app/constants/guidance.json";
import { signDetail as copy, helpBoard } from "@app/constants/student.json";
import { formatDeadline } from "@app/utils/format";

definePageMeta({
    layout: "student",
    access: "student",
    title: "Detail tanda bantuan",
});

const route = useRoute();
const api = useApi();
const {
    data: sign,
    pending,
    refresh,
} = await useApiData(
    `sign-${route.params.id}`,
    `/student/study-match/help-signs/${route.params.id}`,
    {
        default: () => ({ skill: {}, author: { fullName: "" }, offers: [] }),
    },
);

const mine = computed(() => Boolean(sign.value.isOwner));
const isOpen = computed(() => sign.value.status === "open");
const open = ref(false);
const closeOpen = ref(false);

const respond = (action, message) =>
    useAction(
        async (offer) => {
            await api.patch(`/student/study-match/requests/${offer.id}`, {
                action,
            });
            await refresh();
        },
        { success: message },
    );
const accept = respond("accept", copy.accepted);
const decline = respond("decline", copy.declined);

const { run: closeSign } = useAction(
    async () => {
        await api.patch(`/student/study-match/help-signs/${route.params.id}`, {
            close: true,
        });
        closeOpen.value = false;
        await navigateTo("/student/help-board/mine");
    },
    { success: copy.closed },
);
const sent = async () => {
    open.value = false;
    await refresh();
};
</script>

<template>
    <PageBack :to="mine ? '/student/help-board/mine' : '/student/help-board'">{{
        mine ? copy.owner : copy.board
    }}</PageBack>
    <AutoSkeleton :loading="pending" id="sign-detail">
        <DetailLayout>
            <UiCard class=":uno: flex flex-col gap-4">
                <div class=":uno: flex flex-wrap items-center gap-2">
                    <UiChip tone="blue">{{ sign.skill.name }}</UiChip>
                    <UiChip :tone="isOpen ? 'success' : 'neutral'">{{
                        helpBoard[sign.status]
                    }}</UiChip>
                    <UiChip icon="clock">{{
                        formatDeadline(sign.expiresAt)
                    }}</UiChip>
                </div>
                <h1 class=":uno: t-d3 text-ink m-0">{{ sign.title }}</h1>
                <p class=":uno: t-body-m text-ink m-0">
                    {{ sign.description }}
                </p>
                <UiDivider />
                <div class=":uno: flex items-center gap-3">
                    <UiAvatar :name="sign.author.fullName" :size="40" />
                    <div>
                        <p class=":uno: t-label text-ink m-0">
                            {{ sign.author.fullName }}
                        </p>
                        <p class=":uno: t-body-xs text-ink-2 m-0">
                            {{ sign.author.major }} · Angkatan
                            {{ sign.author.year }}
                        </p>
                    </div>
                </div>
                <div class=":uno: flex flex-wrap gap-3">
                    <UiButton
                        v-if="!mine && isOpen && sign.canHelp"
                        icon="userPlus"
                        @click="open = true"
                        >{{ copy.offer }}</UiButton
                    >
                    <UiChip
                        v-else-if="!mine && sign.myOfferStatus"
                        tone="yellow"
                        >{{ copy.alreadyOffered }}</UiChip
                    >
                    <UiButton
                        v-else-if="mine && isOpen"
                        variant="dangerLink"
                        icon="close"
                        @click="closeOpen = true"
                        >{{ copy.close }}</UiButton
                    >
                </div>
            </UiCard>

            <UiCard class=":uno: flex flex-col gap-4">
                <div class=":uno: flex items-center justify-between">
                    <h2 class=":uno: t-d4 text-ink m-0">
                        {{ mine ? copy.offersIn : copy.offersYours }}
                    </h2>
                    <UiChip tone="yellow" filled>{{
                        sign.offers.length
                    }}</UiChip>
                </div>
                <div
                    v-if="sign.offers.length"
                    class=":uno: flex flex-col divide-y divide-hairline"
                >
                    <OfferRow
                        v-for="offer in sign.offers"
                        :key="offer.id"
                        :item="offer"
                        :owner="mine"
                        @accept="accept.run($event)"
                        @decline="decline.run($event)"
                    />
                </div>
                <UiEmpty
                    v-else-if="mine"
                    :title="copy.noOffers"
                    :text="copy.noOffersText"
                    icon="inbox"
                />
                <p v-else class=":uno: t-body-s text-ink-2 m-0">
                    {{ copy.yours }}
                </p>
            </UiCard>

            <template #aside>
                <UiCallout :title="copy.howTitle" tone="info"
                    ><ul class=":uno: m-0 pl-4 flex flex-col gap-1">
                        <li v-for="tip in extras.tips" :key="tip">{{ tip }}</li>
                    </ul></UiCallout
                >
            </template>
        </DetailLayout>
    </AutoSkeleton>
    <OfferHelpModal
        :open="open"
        :sign-id="String(route.params.id)"
        @close="open = false"
        @sent="sent"
    />
    <ConfirmModal
        :open="closeOpen"
        :title="copy.closeTitle"
        :text="copy.closeText"
        :action="copy.close"
        @close="closeOpen = false"
        @confirm="closeSign()"
    />
</template>
