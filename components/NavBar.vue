<template>
    <vs-navbar square center-collapsed v-model="active">
        <template #left>
            <h2 class="title">Ewoks</h2>
        </template>
        <vs-navbar-item to="/" id="home" :active="active == 'home'">
            Scoresaber stuff
        </vs-navbar-item>
        <!-- <vs-navbar-item to="/beatcat" id="beatcat" :active="active == 'beatcat'">
            BeatCat (WIP)
        </vs-navbar-item> -->
    </vs-navbar>
</template>

<script>
export default {
    props: {},
    data: () => ({
        active: "home",
    }),
};
</script>

<style>
.vs-navbar h2 {
    margin: 20px 10px;
}
.vs-navbar__item a {
    color: inherit;
    text-decoration: inherit;
}
.vs-navbar-content {
    position: relative;
}
</style>
