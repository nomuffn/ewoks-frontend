<template>
    <div class="main_content rankedstats">
        <div v-if="stats && mappers" class="col">
            <div class="title_container">
                <h2 class="title">General</h2>
            </div>

            <vs-alert color="primary">
                Maps ranked: {{ stats["total"] }}
                <br />
                Rough amount of mappers: {{ Object.keys(mappers).length }}
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
                <br />
            </vs-alert>
        </div>

        <div class="col">
            <div class="title_container">
                <h2 class="title">Mapset Count by Mappers</h2>
            </div>

            <Loading v-if="loading['mapperdist']" />
            <div v-if="mappers" class="card-container">
                <vs-card
                    :key="index"
                    v-for="(mapper, index) in getMappers"
                    v-on:click="openUrl(mapper[0])"
                >
                    <template #text>
                        <h3>
                            <span class="colored">#{{ index + 1 }}</span>
                            {{ mapper[0] }}: {{ mapper[1] }}
                        </h3>
                    </template>
                </vs-card>
                <vs-button
                    v-if="visibleMappers < Object.keys(mappers).length"
                    class="showMore"
                    icon
                    @click="visibleMappers += 50"
                >
                    Show more
                </vs-button>
            </div>
        </div>

        <div class="col">
            <div class="title_container">
                <h2 class="title">Difficulty Count by Mappers</h2>
            </div>

            <Loading v-if="loading['mapperdiffdist']" />
            <div v-if="mappersDiffs" class="card-container">
                <vs-card
                    :key="index"
                    v-for="(mapper, index) in getMapperDiffs"
                    v-on:click="openUrl(mapper[0])"
                >
                    <template #text>
                        <h3>
                            <span class="colored">#{{ index + 1 }}</span>
                            {{ mapper[0] }}: {{ mapper[1] }}
                        </h3>
                    </template>
                </vs-card>
                <vs-button
                    v-if="
                        visibleMappersDiffs < Object.keys(mappersDiffs).length
                    "
                    class="showMore"
                    icon
                    @click="visibleMappersDiffs += 50"
                >
                    Show more
                </vs-button>
            </div>
        </div>

        <div class="col">
            <div class="title_container">
                <h2 class="title">Mapset Count by Song Artists</h2>
            </div>

            <Loading v-if="loading['artistdist']" />
            <div v-if="artists" class="card-container">
                <vs-card
                    :key="index"
                    v-for="(artist, index) in getArtists"
                    v-on:click="openUrl(mapper[0])"
                >
                    <template #text>
                        <h3>
                            <span class="colored">#{{ index + 1 }}</span>
                            {{ artist[0] }}: {{ artist[1] }}
                        </h3>
                    </template>
                </vs-card>
                <vs-button
                    v-if="visibleArtists < Object.keys(artists).length"
                    class="showMore"
                    icon
                    @click="visibleArtists += 50"
                >
                    Show more
                </vs-button>
            </div>
        </div>
    </div>
</template>

<script>
/*
 * TODO make code for lists nicer
 */

import Loading from "@/components/LoadingSpinner.vue";
export default {
    transition: "slide-bottom",
    data() {
        return {
            stats: null,
            mappers: null,
            mappersDiffs: null,
            artists: null,
            visibleMappers: 10,
            visibleMappersDiffs: 10,
            visibleArtists: 10,
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
    computed: {
        getMappers() {
            return Object.entries(this.mappers).slice(0, this.visibleMappers);
        },
        getMapperDiffs() {
            return Object.entries(this.mappersDiffs).slice(
                0,
                this.visibleMappersDiffs
            );
        },
        getArtists() {
            return Object.entries(this.artists).slice(0, this.visibleArtists);
        },
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

<style lang="scss" scoped>
.rankedstats {
    justify-content: center;

    .card-container {
        display: flex;
        flex-direction: column;
        align-items: center;

        .vs-card-content:first-child .vs-card .colored {
            color: #ffca28 !important;
        }

        .vs-card-content:nth-child(2) .vs-card .colored {
            color: #bdbdbd !important;
        }

        .vs-card-content:nth-child(3) .vs-card .colored {
            color: #ffa726 !important;
        }
    }

    .col {
        flex: inherit;
        max-width: 300px;
    }

    h3 {
        padding: 20px 10px 10px 10px;
    }

    .vs-card-content {
        margin-bottom: 15px;
    }

    .card-container {
        margin-top: 10px;
    }

    .vs-card-content {
        width: 100%;
    }

    .vs-card {
        max-width: 400px;
    }
}
</style>
