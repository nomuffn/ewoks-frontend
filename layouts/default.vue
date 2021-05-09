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
        ColorHandler.setColor();
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

.page-enter-active,
.page-leave-active {
    transition: opacity 0.5s;
}
.page-enter,
.page-leave-to {
    opacity: 0;
}

.layout-enter-active,
.layout-leave-active {
    transition: opacity 0.5s;
}
.layout-enter,
.layout-leave-to {
    opacity: 0;
}

.slide-bottom-enter-active,
.slide-bottom-leave-active {
    transition: opacity 0.25s ease-in-out, transform 0.25s ease-in-out;
}
.slide-bottom-enter,
.slide-bottom-leave-to {
    opacity: 0;
    transform: translate3d(0, 15px, 0);
}
.bounce-enter-active {
    transform-origin: top;
    animation: bounce-in 0.8s;
}
.bounce-leave-active {
    transform-origin: top;
    animation: bounce-out 0.5s;
}
@keyframes bounce-in {
    0% {
        transform: scale(0);
    }
    50% {
        transform: scale(1.25);
    }
    100% {
        transform: scale(1);
    }
}
@keyframes bounce-out {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.25);
    }
    100% {
        transform: scale(0);
    }
}
</style>
