<template>
    <div class="main_content">
        <div v-if="stats && mappers" class="col">
            <div class="title_container">
                <h2 class="title">General</h2>
            </div>

            <vs-alert color="primary">
                Maps ranked: {{ stats["total"] }}
                <br />
                <br />
                > 600pp: {{ stats["600"] }}
                <br />
                > 500pp: {{ stats["500"] }}
                <br />
                > 400pp: {{ stats["400"] }}
                <br />
                > 300pp: {{ stats["300"] }}
                <br />
                > 200pp: {{ stats["200"] }}
                <br />
                > 100pp: {{ stats["100"] }}
                <br />
                > 0pp: {{ stats["0"] }}
            </vs-alert>
            <vs-alert color="primary">
                Very rough amount of mappers: {{ Object.keys(mappers).length }}
                <br />
                Unfortunately some mapper names are still scuffed from 2018
                <br />
                <br />
                Stats from beatsaver are gonna be put offhold for now until I
                find the motivation and solution for their api restrictions.
            </vs-alert>
        </div>

        <div class="col">
            <div class="title_container">
                <h2 class="title">Mapset Count by Mappers</h2>
            </div>

            <Loading v-if="loading['mapperdist']" />
            <div v-if="mappers" class="card-container">
                <vs-card
                    :key="mapper"
                    v-for="(value, mapper, index) in mappers"
                    v-on:click="openUrl(mapper)"
                >
                    <template #text>
                        <h3>
                            <span class="colored">#{{ index + 1 }}</span>
                            {{ mapper }}: {{ value }}
                        </h3>
                    </template>
                </vs-card>
            </div>
        </div>

        <div class="col">
            <div class="title_container">
                <h2 class="title">Difficulty Count by Mappers</h2>
            </div>

            <Loading v-if="loading['mapperdiffdist']" />
            <div v-if="mappersDiffs" class="card-container">
                <vs-card
                    :key="mapper"
                    v-for="(value, mapper, index) in mappersDiffs"
                    v-on:click="openUrl(mapper)"
                >
                    <template #text>
                        <h3>
                            <span class="colored">#{{ index + 1 }}</span>
                            {{ mapper }}: {{ value }}
                        </h3>
                    </template>
                </vs-card>
            </div>
        </div>

        <div class="col">
            <div class="title_container">
                <h2 class="title">Difficulty Count by Song Artists</h2>
            </div>

            <Loading v-if="loading['artistdist']" />
            <div v-if="artists" class="card-container">
                <vs-card
                    :key="artist"
                    v-for="(value, artist, index) in artists"
                    v-on:click="openUrl(artist)"
                >
                    <template #text>
                        <h3>
                            <span class="colored">#{{ index + 1 }}</span>
                            {{ artist }}: {{ value }}
                        </h3>
                    </template>
                </vs-card>
            </div>
        </div>
    </div>
</template>

<script>
import Loading from "@/components/LoadingSpinner.vue";
export default {
    transition: "slide-bottom",
    data() {
        return {
            stats: null,
            mappers: null,
            mappersDiffs: null,
            artists: null,
            loading: {
                ppdist: true,
                mapperdist: true,
                mapperdiffdist: true,
                artistdist: true,
            },
        };
    },
    components: {
        Loading,
    },
    async created() {
        this.stats = await this.$defaultApi.$get("ppdist");
        this.mappers = await this.$defaultApi.$get("mapperdist");
        this.loading["mapperdist"] = false;
        this.mappersDiffs = await this.$defaultApi.$get("mapperdiffdist");
        this.loading["mapperdiffdist"] = false;
        this.artists = await this.$defaultApi.$get("artistdist");
        this.loading["artistdist"] = false;
    },
    methods: {
        openUrl: function (mapper) {
            window.open("https://scoresaber.com/?search=" + mapper, "_blank");
        },
    },
};
</script>

<style scoped>
.main_content {
    justify-content: center;
}

/deep/ .card-container .vs-card-content:first-child .vs-card .colored {
    color: #ffca28 !important;
}

/deep/ .card-container .vs-card-content:nth-child(2) .vs-card .colored {
    color: #bdbdbd !important;
}

/deep/ .card-container .vs-card-content:nth-child(3) .vs-card .colored {
    color: #ffa726 !important;
}

/deep/ .col {
    flex: inherit;
    max-width: 300px;
}

/deep/ h3 {
    padding: 20px 10px 10px 10px;
}

/deep/ .vs-card-content {
    margin-bottom: 15px;
}

/deep/ .card-container {
    margin-top: 10px;
}

/deep/ .vs-card-content {
    width: 100%;
}

/deep/ .vs-card {
    max-width: 400px;
}
</style>
