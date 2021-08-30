<template>
    <div class="beatsaver">
        <div class="filter">
            <h2>Filter</h2>
            <vs-select placeholder="Order by" v-model="column">
                <vs-option v-for="col in allColumns" :key="col" :label="col" :value="col">
                    {{ col }}
                </vs-option>
            </vs-select>
            <p>
                <strong>Minimum stars: {{ stars }}</strong>
            </p>
            <slider v-model="stars" :max="14" :tooltips="false" />
            <p>
                <strong>Minimum bpm: {{ bpm }}</strong>
            </p>
            <slider v-model="bpm" :max="350" :tooltips="false" />
            <div class="radios">
                <vs-radio v-model="descending" val="-">
                    Descending
                </vs-radio>
                <vs-radio style="margin-left: 10px" v-model="descending" val="">
                    Ascending
                </vs-radio>
            </div>
            <vs-button :loading="loading" @click="loadResults">
                Filter
            </vs-button>
        </div>
        <div class="results-container">
            <h2>Results</h2>
            <div class="results">
                <vs-card v-for="(item, index) in getVisibleItems" :key="item.key">
                    <template #text>
                        <div class="top">
                            <div>
                                <p class="mapper">{{ item["levelAuthorName"] }}</p>
                                <p class="name">{{ item["songName"] }}</p>
                            </div>
                            <div>
                                <p>#{{ index + 1 }}</p>
                            </div>
                        </div>
                        <div class="stats">
                            <p :class="{ bold: isBold('downloads') }">Downloads: {{ item["downloads"] }}</p>
                            <p :class="{ bold: isBold('upvotes') }">Upvotes: {{ item["upvotes"] }}</p>
                            <p :class="{ bold: isBold('downvotes') }">Downvotes: {{ item["downvotes"] }}</p>
                            <p :class="{ bold: isBold('ratio') }">Ratio: {{ item["ratio"] }}</p>
                            <p>Star: {{ item["highestStar"] }}</p>
                        </div>
                    </template>
                </vs-card>
                <vs-button v-if="visibleItems < results.length" class="showMore" icon @click="visibleItems += 50">
                    Show more
                </vs-button>
            </div>
        </div>
        <div style="flex: 1"></div>
    </div>
</template>

<script>
export default {
    transition: "slide-bottom",
    data() {
        return {
            loading: false,
            descending: "-",
            stars: 0,
            bpm: 0,
            allColumns: ["Ratio", "Downloads", "Upvotes", "Downvotes"],
            column: "Ratio",
            results: [],
            visibleItems: 10
        };
    },
    computed: {
        getVisibleItems() {
            return this.results.slice(0, this.visibleItems);
        }
    },
    methods: {
        async loadResults() {
            this.loading = true;
            this.results = [];
            const data = { column: this.descending + this.column.toLowerCase(), stars: this.stars, bpm: this.bpm };
            this.results = await this.$defaultApi.$post("beatsaver/stats", data);
            this.loading = false;
        },
        isBold(string) {
            return this.column.toLowerCase() == string;
        }
    }
};
</script>

<style lang="scss">
.page .beatsaver {
    display: flex;
    place-content: center;
    margin-top: 20px;

    h2 {
        color: #fff;
        font-weight: normal;
        margin-bottom: 10px;
    }

    .filter {
        flex: 1;
        max-width: 300px;
        margin-right: 200px;

        .radios {
            display: flex;
            margin-top: 20px;
        }

        > p {
            color: #fff;
            margin-top: 15px;
        }

        .slider {
            margin-top: 10px;
        }
        .vs-select-content {
            margin-top: 10px;
            max-width: inherit;
        }

        .vs-button {
            width: 100%;
            margin-top: 20px;
        }
    }
    .results-container {
        flex: 1;

        h3 {
            text-align: center;
        }

        .vs-card-content {
            margin-bottom: 20px;

            .vs-card {
                max-width: inherit;

                .top {
                    margin-bottom: 10px;
                    display: flex;
                    width: 100%;
                    place-content: space-between;
                    .mapper {
                    }
                    .name {
                        font-weight: bold;
                    }
                }
                .stats {
                    display: flex;
                    flex-wrap: wrap;
                    place-content: space-between;
                    > p {
                        white-space: nowrap;
                        margin-right: 25px;
                    }
                }
            }
        }
    }

    .bold {
        font-weight: bold;
    }
}
</style>
