<template>
    <div class="darken" vs-theme="dark">
        <NavBar />
        <Nuxt />

        <vs-button class="discord" primary gradient>
            <i class="bx bxl-discord bx-sm"></i>muffn#2345
        </vs-button>
    </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";

var ColorHandler = require("@/assets/ColorHandler.js");
export default {
    components: {
        NavBar,
    },
    created() {
        ColorHandler.setColor(this);
    },
};
</script>

<style>
@import "@/assets/default.css";
</style>
