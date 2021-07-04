<template>
    <vs-alert
        v-if="alert.AlertText"
        :color="alert.Warning ? 'warn' : 'primary'"
    >
        <span v-html="this.$nl2br(alert.AlertText)" />
    </vs-alert>
</template>

<script>
export default {
    props: ["alert"],
};
</script>

<style lang="scss"></style>
