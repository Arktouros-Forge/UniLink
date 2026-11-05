<script setup>
import { useAuthStore } from "@app/stores/auth";
import { useMock } from "@app/composables/useMock";
import { incoming } from "@app/constants/mock/study.json";
import { teams } from "@app/constants/mock/competitions.json";
import { dayLabels } from "@app/constants/options.json";
import { dataNote } from "@app/constants/site.json";

definePageMeta({
    layout: "student",
    middleware: "auth",
    title: "Selamat pagi, Ayu.",
});
const auth = useAuthStore();
const { pending } = useMock("dashboard", { incoming });
const firstName = computed(() => auth.user.name.split(" ")[0]);
const request = incoming[0];
const team = teams[0];
const stats = [
    { label: "Permintaan menunggu", value: "03", trend: "+1 minggu ini" },
    { label: "Tim aktif", value: "02", trend: "GEMASTIK & Hackathon" },
    { label: "Tugas mendatang", value: "05", trend: "2 selesai minggu ini" },
];
const activeDays = [0, 2, 4];
</script>

<template>
    <PageHeading
        :title="`Selamat pagi, ${firstName}.`"
        text="Ada hal baik yang bisa dimulai minggu ini."
    >
        <UiButton icon="plus" to="/student/help-board/new"
            >Pasang tanda</UiButton
        >
    </PageHeading>
    <AutoSkeleton :loading="pending" id="dashboard-stats">
        <div class="grid gap-4 md:grid-cols-3 md:gap-6">
            <StatCard
                v-for="item in stats"
                :key="item.label"
                :label="item.label"
                :value="item.value"
                :trend="item.trend"
                :note="`${dataNote} · 2 Nov 2026`"
            />
        </div>
    </AutoSkeleton>
    <div class="grid gap-6 md:grid-cols-2 md:items-stretch">
        <div class="flex flex-col gap-6">
            <AutoSkeleton :loading="pending" id="dashboard-requests">
                <UiCard class="flex flex-col gap-4">
                    <h2 class="t-d4 text-ink m-0">Permintaan menunggu</h2>
                    <div class="flex items-center gap-4">
                        <UiAvatar :name="request.name" :size="40" />
                        <div class="flex-1 min-w-0">
                            <p class="t-d4 text-ink m-0 !text-lg">
                                {{ request.name }}
                            </p>
                            <p class="t-body-s text-ink-2 m-0">
                                Butuh bantuan Python
                            </p>
                        </div>
                        <UiButton
                            variant="secondary"
                            size="sm"
                            icon-end="arrowRight"
                            to="/student/study-match/requests"
                            >Tinjau</UiButton
                        >
                    </div>
                    <p class="t-body-s text-ink-2 m-0">
                        Citra Lestari dan Dewa Ngurah juga menunggu tanggapan.
                    </p>
                </UiCard>
            </AutoSkeleton>
            <AutoSkeleton :loading="pending" id="dashboard-team">
                <UiCard class="flex flex-col gap-4">
                    <h2 class="t-d4 text-ink m-0">Tim &amp; tindakan cepat</h2>
                    <p class="t-body-s text-ink m-0">
                        {{ team.name }} · {{ team.competition }} ·
                        {{ team.members.length }}/{{ team.capacity }} anggota
                    </p>
                    <div class="flex flex-wrap gap-3">
                        <UiButton
                            variant="secondary"
                            size="sm"
                            icon="search"
                            to="/student/study-match"
                            >Cari teman</UiButton
                        >
                        <UiButton
                            variant="link"
                            size="sm"
                            icon="calendar"
                            to="/student/timetable"
                            >Tambah jadwal</UiButton
                        >
                    </div>
                </UiCard>
            </AutoSkeleton>
        </div>
        <div class="flex flex-col gap-6">
            <AutoSkeleton :loading="pending" id="dashboard-week">
                <UiCard class="flex flex-col gap-4">
                    <h2 class="t-d4 text-ink m-0">Jadwal pekan ini</h2>
                    <div class="grid grid-cols-7 gap-1">
                        <div
                            v-for="(day, index) in dayLabels"
                            :key="day"
                            class="flex flex-col gap-2"
                        >
                            <span class="t-mono-s text-ink">{{ day }}</span>
                            <span
                                class="h-1.5"
                                :class="
                                    activeDays.includes(index)
                                        ? 'bg-blue'
                                        : 'bg-hairline'
                                "
                            />
                        </div>
                    </div>
                    <p class="t-mono-s text-ink m-0">
                        Sen · 08.00-09.40 · IF1234
                    </p>
                    <p class="t-body-s text-ink m-0">
                        Algoritma dan Pemrograman
                    </p>
                    <p class="t-body-s text-ink m-0">
                        Tugas: latihan rekursi · besok 23.59
                    </p>
                </UiCard>
            </AutoSkeleton>
        </div>
    </div>
</template>
