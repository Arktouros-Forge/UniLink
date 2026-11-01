<script setup>
defineProps({
    error: { type: Object, required: true },
});

const goHome = () => clearError({ redirect: "/" });
</script>

<template>
    <div class="grid min-h-screen place-items-center p-6 text-center">
        <div class="grid justify-items-center gap-4">
            <InterlockArt />
            <p class="type-numeral">{{ error.statusCode }}</p>
            <h1 class="type-h2">
                {{
                    error.statusCode === 404
                        ? "Halaman tidak ditemukan"
                        : "Terjadi kesalahan"
                }}
            </h1>
            <p class="type-body text-mute">{{ error.statusMessage }}</p>
            <AppButton @click="goHome">Kembali ke beranda</AppButton>
        </div>
    </div>
</template>
