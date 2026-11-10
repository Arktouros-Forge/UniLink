<script setup>
const props = defineProps({
    variant: { type: String, default: "primary" },
    size: { type: String, default: "md" },
    icon: { type: String, default: "" },
    iconEnd: { type: String, default: "" },
    to: { type: String, default: "" },
    href: { type: String, default: "" },
    type: { type: String, default: "button" },
    block: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
});

const tag = computed(() =>
    props.to ? resolveComponent("NuxtLink") : props.href ? "a" : "button",
);
const attrs = computed(() => {
    if (props.to) return { to: props.to };
    if (props.href)
        return { href: props.href, target: "_blank", rel: "noopener" };
    return { type: props.type, disabled: props.disabled || props.loading };
});

const variants = {
    primary: ":uno: border-transparent bg-blue text-onblue hover:opacity-90",
    secondary:
        ":uno: border-hairline bg-card text-blue shadow-rest hover:shadow-hover",
    ghost: ":uno: border-transparent bg-transparent text-blue hover:bg-blue-soft",
    link: ":uno: border-transparent bg-transparent text-blue !px-1 hover:underline",
    danger: ":uno: border-transparent bg-danger text-onblue hover:opacity-90",
    dangerLink:
        ":uno: border-transparent bg-transparent text-danger !px-1 hover:underline",
};
const sizes = {
    sm: ":uno: h-9 px-4 text-sm",
    md: ":uno: h-11 px-6",
    lg: ":uno: h-12 px-7",
};
</script>

<template>
    <component
        :is="tag"
        v-bind="attrs"
        class=":uno: inline-flex items-center justify-center gap-2 rounded-md border t-button whitespace-nowrap cursor-pointer transition-all focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
        :class="[variants[variant], sizes[size], block && 'w-full']"
    >
        <span
            v-if="loading"
            class=":uno: size-4 rounded-full border-2 border-current border-t-transparent animate-spin"
        />
        <UiIcon v-else-if="icon" :name="icon" :size="size === 'sm' ? ':uno: text-lg' : ':uno: text-xl'" />
        <slot />
        <UiIcon v-if="iconEnd" :name="iconEnd" :size="size === 'sm' ? ':uno: text-lg' : ':uno: text-xl'" />
    </component>
</template>
