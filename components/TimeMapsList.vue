<template>
    <div class="card-container">
        <vs-card
            :key="index"
            v-for="(map, index) of maps"
            v-on:click="openUrl(map.scoresaberid)"
        >
            <template #text>
                <h3>{{ map.name }}</h3>
                <p>by {{ map.mapper }}</p>
                <p class="time">~{{ map.hoursleft }} hours</p>
            </template>
        </vs-card>
    </div>
</template>

<script>
export default {
    props: ["maps"],
    methods: {
        openUrl: function (id) {
            if (id != null)
                window.open(
                    "https://scoresaber.com/leaderboard/" + id,
                    "_blank"
                );
        },
    },
};
</script>

<style scoped></style>
