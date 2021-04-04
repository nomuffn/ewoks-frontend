<template>
    <div>
        <div class="navbar">
            <h2 class="title">Ewoks</h2>
        </div>

        <Nuxt keep-alive />

        <vs-button class="discord" primary gradient>
            <i class="bx bxl-discord bx-sm"></i>muffn#2345
        </vs-button>
    </div>
</template>

<script>
var ColorHandler = require("@/assets/ColorHandler.js");
export default {
    created() {
        ColorHandler.setColor(this);
    },
};
</script>

<style>
@import "@/assets/default.css";

.navbar {
    --vs-color: var(--vs-background);
    background: rgba(var(--vs-color), 1);
    text-align: center;
}
</style>
