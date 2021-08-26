<template>
    <div class="rankingstats">
        <div class="header">
            <div class="left">
                <div class="aaa">
                    <h2 class="title">
                        Ranking Stats
                    </h2>
                    <p v-if="stats" class="alerts">
                        Difficulties ranked: {{ stats["total"] }}
                        <br />
                        <!-- Rough amount of mappers: {{ Object.keys(mappers).length }}
                        <br /> -->
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
                    </p>
                </div>
            </div>
        </div>
        <div class="content">
            <vs-navbar color="#18191c" shadow text-white square center-collapsed v-model="activeList">
                <vs-navbar-item v-for="(item, key) in lists" :key="key" :active="activeList == key" :id="key">
                    {{ item.title }}
                </vs-navbar-item>
            </vs-navbar>

            <div v-if="activeList" class="list">
                <div class="title_container">
                    <h2 class="title">{{ lists[activeList].title }}</h2>
                </div>

                <loading-spinner v-if="loading" style="margin-bottom: 500px;" />
                <div v-else-if="!loading && data.length > 0" class="cards">
                    <vs-card v-for="(item, index) in getVisibleItems" v-on:click="openUrl(item.name)" :key="index">
                        <template #text>
                            <h3>
                                <span class="colored">#{{ index + 1 }}</span>
                                {{ item.name }}: {{ item.value }}
                            </h3>
                        </template>
                    </vs-card>
                    <vs-button v-if="visibleItems < data.length" class="showMore" icon @click="visibleItems += 50">
                        Show more
                    </vs-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    transition: "slide-bottom",
    data() {
        return {
            data: [],
            activeList: null,
            visibleItems: 10,
            loading: false,
            stats: null,
            lists: {
                mapsetMappers: {
                    title: "Mapset Count By Mappers",
                    getData: () => {
                        return this.loadFromApi("mapperdist");
                    }
                },
                diffMappers: {
                    title: "Difficulty Count By Mappers",
                    getData: key => {
                        return this.loadFromApi("mapperdiffdist");
                    }
                },
                mapsetArtists: {
                    title: "Mapset Count By Song Artists",
                    getData: key => {
                        return this.loadFromApi("artistdist");
                    }
                }
                // mapsetMappersQueue: {
                //     title: "Mapset Count By Mappers\n(Ranking Queue)",
                //     getData: key => {
                //         return this.getQueueMapsetData();
                //     }
                // }
            }
        };
    },
    computed: {
        getVisibleItems() {
            return this.data.slice(0, this.visibleItems);
        }
    },

    async created() {
        this.stats = await this.$defaultApi.$get("ppdist");
        this.activeList = "mapsetMappers";
    },
    watch: {
        async activeList() {
            this.loading = true;
            this.visibleItems = 10;
            this.data = await this.lists[this.activeList].getData();
            this.loading = false;
        }
    },
    methods: {
        openUrl: function(mapper) {
            window.open("https://scoresaber.com/?search=" + mapper, "_blank");
        },
        async loadFromApi(endpoint) {
            return Object.entries(await this.$defaultApi.$get(endpoint)).map(item => {
                return { name: item[0], value: item[1] };
            });
        },
        getQueueMapsetData() {}
    }
};
</script>

<style lang="scss">
.rankingstats {
    justify-content: center;

    .content {
        position: relative;
        justify-content: center;
        flex-direction: column;
        align-content: center;
        align-items: center;
        margin-top: 0;
        max-width: 100%;

        .list {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
    }

    .vs-navbar-content {
        position: relative;

        button {
            // white-space: pre-line;
            padding-top: 0px;
            padding: 20px 10px;
        }
    }

    .cards {
        margin-top: 10px;
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

    .vs-card-content {
        margin-bottom: 15px;
    }

    .vs-card {
        max-width: 400px;
        width: 400px;
    }
}
</style>
