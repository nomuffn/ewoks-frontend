<template>
    <div class="scoresaber">
        <vs-navbar color="#18191c" text-white square v-model="activeList">
            <vs-navbar-item v-for="(item, key) in lists" :key="key" :active="activeList == key" :id="key">
                {{ item.title }}
            </vs-navbar-item>
        </vs-navbar>

        <div class="sub-content">
            <div v-if="activeList" class="list">
                <div class="title_container">
                    <h2 class="title">{{ lists[activeList].title }}</h2>
                </div>

                <loading-spinner v-if="loading" style="margin-bottom: 500px;" />
                <div v-else-if="!loading && data.length > 0" class="cards vertical">
                    <p>Amount: {{ data.length }}</p>
                    <div
                        class="card"
                        v-for="(item, index) in getVisibleItems"
                        v-on:click="openUrl(item.name)"
                        :key="index"
                    >
                        <h3>
                            <span class="colored">#{{ index + 1 }}</span>
                            {{ item.name }}: {{ item.value }}
                        </h3>
                        <vs-button v-if="item.maps" v-on:click.stop="mapsDialog = item" border>Maps</vs-button>
                    </div>
                    <vs-button v-if="visibleItems < data.length" class="showMore" icon @click="visibleItems += 50">
                        Show more
                    </vs-button>
                </div>
            </div>
        </div>
        <dialogs-maps-dialog v-model="mapsDialog" @close="mapsDialog = null" />
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
            mapsDialog: null,
            lists: {
                mapsetMappers: {
                    title: "Mapset Count By Mappers",
                    getData: () => {
                        return this.loadFromApi("scoresaber/mapperdist");
                    }
                },
                diffMappers: {
                    title: "Difficulty Count By Mappers",
                    getData: () => {
                        return this.loadFromApi("scoresaber/mapperdiffdist");
                    }
                },
                mapsetArtists: {
                    title: "Mapset Count By Song Artists",
                    getData: () => {
                        return this.loadFromApi("scoresaber/artistdist");
                    }
                },
                mapsetMappersQueue: {
                    title: "Mappers Count (Ranking Queue)",
                    getData: async () => {
                        return (await this.loadFromApi("scoresaber/rq/mappers")).map(mapper => {
                            return { ...mapper, value: mapper.value.length, maps: mapper.value };
                        });
                    }
                }
            }
        };
    },
    computed: {
        getVisibleItems() {
            return this.data.slice(0, this.visibleItems);
        }
    },

    async created() {
        this.stats = await this.$defaultApi.$get("scoresaber/ppdist");
        this.activeList = this.$route.query?.list || "mapsetMappers";
    },
    watch: {
        async activeList() {
            this.loading = true;
            this.$router.push({ query: { list: this.activeList } });
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
        }
    }
};
</script>

<style lang="scss">
.page .scoresaber {
    position: relative;
    justify-content: center;
    flex-direction: column;
    align-content: center;
    align-items: center;
    margin-top: 0;
    max-width: 100%;

    .sub-content {
        width: 100%;
        position: relative;

        .vs-alert {
            position: absolute;
            top: 0;
            left: 0;
            margin: 40px 0px 0px 0px;
            max-width: 400px;

            @media (max-width: 1350px) {
                display: none;
            }
        }

        .list {
            display: flex;
            flex-direction: column;
            align-items: center;

            .title_container {
                .title {
                    padding-bottom: 0px;
                }
            }
        }
    }

    .vs-navbar-content {
        position: relative;

        button {
            white-space: pre-line;
            padding-top: 0px;
            padding: 0px 10px 15px 10px;
        }
    }

    .cards {
        display: flex;
        flex-direction: column;
        align-items: center;

        > p {
            color: #fff;
            opacity: 0.5;
            margin-bottom: 20px;
        }

        .card:nth-child(2) .colored {
            color: #ffca28 !important;
        }

        .card:nth-child(3) .colored {
            color: #bdbdbd !important;
        }

        .card:nth-child(4) .colored {
            color: #ffa726 !important;
        }
    }

    .col {
        flex: inherit;
        max-width: 300px;
    }

    .card {
        max-width: 400px;
        width: 400px;

        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        .colored {
            font-size: 1rem;
        }

        button {
            padding: 0px 5px;
            margin: 0px;
        }
    }
}
</style>
