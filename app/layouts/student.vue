<template>
  <div class="min-h-dvh bg-paper md:grid md:grid-cols-[232px_1fr]">
    <SideNav class="hidden md:flex" nav="studentNav" />
    <div class="flex flex-col min-h-dvh pb-20 md:pb-0">
      <AppTopbar />
      <main class="flex-1 px-5 py-6 md:px-10 md:py-8 max-w-[1200px] w-full mx-auto"><slot /></main>
    </div>
    <MobileTabs class="md:hidden" />
  </div>
</template>
