<template>
    <div class="home">
        <vs-sidebar square v-model="active" open>
            <vs-sidebar-item to="/RankingQueue" id="/RankingQueue">
                <template #icon>
                    <i class="bx bx-list-ul"></i>
                </template>
                Ranking Queue
            </vs-sidebar-item>

            <vs-sidebar-item to="/MapTts" id="/MapTts">
                <template #icon>
                    <i class="bx bx-tv"></i>
                </template>
                Map Twitch
            </vs-sidebar-item>

            <vs-sidebar-item to="/Tools" id="/Tools">
                <template #icon>
                    <i class="bx bxs-category"></i>
                </template>
                Tools & Scripts
            </vs-sidebar-item>

            <vs-sidebar-item to="/RankedStats" id="/RankedStats">
                <template #icon>
                    <i class="bx bx-stats"></i>
                </template>
                Ranked Stats
            </vs-sidebar-item>

            <vs-sidebar-item to="/Miscellaneous" id="/Miscellaneous">
                <template #icon>
                    <i class="bx bx-library"></i>
                </template>
                Miscellaneous
            </vs-sidebar-item>

            <vs-sidebar-item to="BeatCat" id="/BeatCat">
                <template #icon>
                    <i class="bx bxs-tag-alt"></i>
                </template>
                BeatCat WIP
            </vs-sidebar-item>
        </vs-sidebar>

        <NuxtChild keep-alive />
    </div>
</template>

<script>
export default {
    created() {
        this.active = this.$route.path;
    },
    data() {
        return {
            active: "",
        };
    },
};
</script>

<style>
.main_content {
    display: flex;
    flex-wrap: wrap;

    margin: 0 auto;
    max-width: 90%;
    margin-top: 10px;
    margin-bottom: 100px;
}

.main_content {
    display: flex;
    flex-wrap: wrap;
    margin: 0 auto;
    max-width: 90%;
    margin-top: 10px;
    margin-bottom: 100px;
}

.vs-navbar__left {
    height: 80px;
    position: relative;
}

.vs-navbar__left .title {
    position: absolute;
}

.vs-sidebar-content {
    width: 100%;
    height: auto !important;
    max-width: 100%;
    position: relative;
}

.vs-sidebar {
    flex-direction: row !important;
    justify-content: center !important;
    flex-wrap: wrap;
    padding: 0px 20px;
}

.vs-sidebar__item {
    width: auto;
    margin: 0px 10px;
}

.vs-sidebar__item::after {
    display: none;
}

.vs-alert {
    height: auto !important;
}

.vs-alert__content {
    min-height: auto !important;
}

.title {
    font-weight: 400;
    font-size: 30px;
    color: #fff;
    letter-spacing: 1px;
    text-transform: capitalize;
    padding: 20px;
}

.text {
    color: #fff;
    margin: 20px 10px;
}

h3 {
    font-size: 16px;
}

.title_container {
    display: flex;
    min-height: 90px;
    align-items: center;
}

.col {
    flex: 1;
    min-width: 250px;
    margin: 0px 10px;
}

.vs-alert {
    margin: 10px 0;
}

.sidebar {
    height: 100%;
}

.sidebar .vs-alert {
    width: 85%;
    margin-top: 100%;
}

.colored {
    color: rgb(var(--vs-color)) !important;
    font-weight: bold;
}

.vs-card {
    border-radius: 15px;
}
.scorecard .vs-card {
    /* didnt work in maptts/Score.vue??? */
    max-width: none;
}
.scorecard .vs-card,
.tools .vs-card {
    cursor: auto;
}
.vs-input__label {
    /* didnt work in maptts/Score.vue????????????????????????????? */
    color: #fff;
}

.players-dialog .vs-dialog .con-content {
    overflow-y: scroll;
    position: relative;
    height: 600px;
}
</style>
