<template>
    <div class="beatsaver">
        <div class="filter-container">
            <div class="filter">
                <h2>Filter for ranked songs</h2>
                <div class="row">
                    <label>Filter by mapper</label>
                    <vs-input v-model="mapperName" type="search" placeholder="Mapper name" />
                </div>
                <div class="row">
                    <label>Order by</label>
                    <vs-select placeholder="Order by" v-model="column">
                        <vs-option v-for="col in allColumns" :key="col" :label="col" :value="col">
                            {{ col }}
                        </vs-option>
                    </vs-select>
                </div>
                <div class="row">
                    <label>Minimum stars: {{ stars }}</label>
                    <Slider v-model="stars" :max="14" :tooltips="false" />
                </div>
                <div class="row">
                    <label>Minimum bpm: {{ bpm }}</label>
                    <Slider v-model="bpm" :max="350" :tooltips="false" />
                </div>
                <div class="row">
                    <label>Uploaded since: {{ getFormattedMonths }}</label>
                    <Slider v-model="months" :min="0" :max="getMonthsDifference" :tooltips="false" />
                </div>
                <div class="row">
                    <div class="radios">
                        <vs-radio v-model="descending" val="-">
                            Descending
                        </vs-radio>
                        <vs-radio style="margin-left: 10px" v-model="descending" val="+">
                            Ascending
                        </vs-radio>
                    </div>
                </div>
                <div class="row">
                    <vs-button :loading="loading" @click="loadResults">
                        Filter
                    </vs-button>
                </div>
                <div class="row">
                    <vs-alert color="primary">
                        Beatsaver doesn't give downloads properly anymore :(
                    </vs-alert>
                </div>
            </div>
        </div>
        <div class="results-container">
            <h2>Results</h2>
            <Loading v-if="loading" />
            <p v-else-if="getVisibleItems.length == 0" class="grey">No results</p>
            <div v-else class="results">
                <vs-card v-for="(item, index) in getVisibleItems" :key="item.key">
                    <template #text>
                        <div class="top">
                            <div>
                                <p class="mapper">{{ item["levelAuthorName"] }}</p>
                                <h3 class="name">{{ item["songName"] }}</h3>
                            </div>
                            <div>
                                <p>#{{ index + 1 }}</p>
                            </div>
                        </div>
                        <div class="stats">
                            <p :class="{ colored: isActive('downloads') }">Downloads: {{ item["downloads"] }}</p>
                            <p :class="{ colored: isActive('ratio') }">Ratio: {{ item["ratio"] }}</p>
                            <p :class="{ colored: isActive('upvotes') }">Upvotes: {{ item["upvotes"] }}</p>
                            <p>Star: {{ item["highestStar"] }}</p>
                            <p :class="{ colored: isActive('downvotes') }">Downvotes: {{ item["downvotes"] }}</p>
                            <p>Bpm: {{ item["bpm"] }}</p>
                            <p style="flex: 1 1 100%">Uploaded: {{ getFormattedUploaded(item["uploaded"]) }}</p>
                        </div>
                    </template>
                </vs-card>
                <vs-button v-if="visibleItems < results.length" class="showMore" icon @click="visibleItems += 50">
                    Show more
                </vs-button>
            </div>
        </div>
        <div class="placeholder"></div>
    </div>
</template>

<script>
import Cookies from "js-cookie";
export default {
    transition: "slide-bottom",
    data() {
        return {
            loading: false,
            descending: "-",
            stars: 0,
            bpm: 0,
            months: 0,
            mapperName: "",
            allColumns: ["Ratio", "Upvotes", "Downvotes"],
            column: "Ratio",
            results: [],
            visibleItems: 10,
            gameReleaseDate: 1525179660 //Tuesday, May 1, 2018
        };
    },
    computed: {
        getVisibleItems() {
            return this.results.slice(0, this.visibleItems);
        },
        getDescending() {
            return this.descending.replace("+", "");
        },
        getFormattedMonths() {
            const now = new Date(this.gameReleaseDate * 1000);
            const newDate = new Date(now.setMonth(now.getMonth() + this.months));
            const month = newDate.getMonth() + 1;
            return `${(month > 9 ? "" : "0") + month}-${newDate.getFullYear()}`;
        },
        getMonthsDifference() {
            var date1 = new Date(this.gameReleaseDate * 1000);
            var difference = date1.getTime() - new Date();
            return Math.abs(Math.floor(difference / 1000 / 60 / 60 / 24 / 30.437)) - 1;
        }
    },
    created() {
        this.loadResults();
    },
    methods: {
        async loadResults() {
            this.loading = true;
            this.results = [];

            let headers = {
                withCredentials: process.env.NODE_ENV === "development" ? false : true,
                headers: {
                    "content-type": "application/json",
                    "X-CSRFToken": Cookies.get("csrftoken")
                }
            };
            const data = {
                column: this.getDescending + this.column.toLowerCase(),
                stars: this.stars,
                bpm: this.bpm,
                months: this.months,
                mapper: this.mapperName
            };
            this.results = await this.$defaultApi.$post("beatsaver/stats/", data, headers);
            this.visibleItems = 10;
            this.loading = false;
        },
        isActive(string) {
            return this.column.toLowerCase() == string;
        },
        getFormattedUploaded(date) {
            return date.split("T")[0];
        }
    }
};
</script>

<style lang="scss">
.page .beatsaver {
    margin-top: 20px;

    h2 {
        color: #fff;
        font-weight: normal;
        margin: 15px 0;
    }

    .placeholder {
        flex: 1;
        @media (max-width: 1500px) {
            display: none;
        }
    }

    .filter-container {
        flex: 1;
        display: flex;
        justify-content: center;
        min-width: 350px;

        .filter {
            max-width: 400px;
            display: flex;
            flex-direction: column;

            @media (max-width: 1000px) {
                max-width: 100%;
                width: 100%;
            }

            .row {
                margin: 7px 0px;

                > label {
                    display: block;
                    color: #fff;
                    font-weight: bold;
                    margin-bottom: 5px;
                }
            }

            .radios {
                display: flex;
                justify-content: space-around;
            }

            .vs-select-content {
                max-width: inherit;
            }

            .vs-button {
                width: 100%;
                margin: 0px;
            }
            .vs-alert {
                margin: 0;
            }
        }
    }
    .results-container {
        flex: 1;
        min-width: 400px;
        margin-left: 50px;

        @media (max-width: 1000px) {
            flex: 1 1 100%;
            margin-left: 0px;
        }

        .results {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        > p {
            text-align: center;
        }

        .vs-card-content {
            margin-bottom: 20px;
            width: 100%;
            .vs-card {
                max-width: 100%;

                .top {
                    margin-bottom: 10px;
                    display: flex;
                    width: 100%;
                    place-content: space-between;
                    .mapper {
                    }
                    .name {
                    }
                }
                .stats {
                    display: flex;
                    flex-wrap: wrap;
                    > p {
                        white-space: nowrap;
                        flex: 1 1 50%;
                        text-align: left;
                    }
                    p:nth-child(2),
                    p:nth-child(4),
                    p:nth-child(6) {
                        text-align: right;
                    }
                    p:last-child {
                        text-align: center;
                    }
                }
            }
        }
    }
}
</style>
