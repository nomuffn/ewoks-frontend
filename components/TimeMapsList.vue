<template>
    <div class="cards">
        <vs-card
            :key="index"
            v-for="(map, index) of maps"
            v-on:click="openUrl(map.scoresaberid)"
        >
            <template #text>
                <h3>{{ map.name }}</h3>
                <p>by {{ map.mapper }}</p>
                <span v-html="timeString(map.hoursleft)"></span>
            </template>
        </vs-card>
    </div>
</template>

<script>
export default {
    props: ["maps"],
    methods: {
        openUrl: function(id) {
            if (id != null)
                window.open(
                    "https://scoresaber.com/leaderboard/" + id,
                    "_blank"
                );
        },
        timeString(hoursleft) {
            // lazy :))
            if (hoursleft >= 0)
                return `<p class="time">~${hoursleft} hours</p>`;
            else
                return "<p style='color: green; text-align: right; font-weight: bold' >RANKED</p>";
        }
    }
};
</script>

<style scoped></style>
