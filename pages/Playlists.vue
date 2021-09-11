<template>
    <div class="playlists">
        <div class="header">
            <div class="left">
                <div class="aaa">
                    <h2 class="title">
                        Playlist maker thing
                    </h2>
                    <p>
                        Filters by various conditions across all maps on beatsaver and puts it into a playlist
                    </p>
                </div>
            </div>
        </div>
        <div class="content">
            <div class="filter-container">
                <div class="filter">
                    <h2>Settings</h2>
                    <div class="row search">
                        <label>Enter mappers and press enter</label>
                        <p class="grey">Will include all occurences in mapper names</p>
                        <p class="grey">You can also enter a comma separated list</p>
                        <vs-input
                            v-model="mapperInput"
                            type="search"
                            placeholder="Mapper name"
                            v-on:keyup.enter="addMapper"
                        />
                        <div v-if="mappers.length" class="mappers">
                            <div class="mapper" v-for="mapper in mappers" :key="mapper">
                                <vs-button icon @click="removeMapper(mapper)">
                                    {{ mapper }}
                                    <i class="bx bx-x"></i>
                                </vs-button>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <label>Uploaded after: {{ getFormattedMonths }}</label>
                        <Slider v-model="months" :min="0" :max="getMonthsDifference" :tooltips="false" />
                    </div>
                    <div class="row">
                        <label>Minimum upvotes: {{ minUpvotes }}</label>
                        <Slider v-model="minUpvotes" :max="10000" :tooltips="false" />
                    </div>
                    <div class="row">
                        <label>Minimum downvotes: {{ minDownvotes }}</label>
                        <Slider v-model="minDownvotes" :max="10000" :tooltips="false" />
                    </div>

                    <div class="row">
                        <vs-button :loading="loading" @click="fetchPlaylist" :disabled="!mappers.length || loading">
                            Make da playlist
                        </vs-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Cookies from "js-cookie";

export default {
    transition: "slide-bottom",
    data() {
        return {
            mapperInput: "",
            mappers: [],
            loading: false,
            minUpvotes: 0,
            minDownvotes: 0,
            uploadedAfter: 0,
            gameReleaseDate: 1525179660, //Tuesday, May 1, 2018
            months: 0
        };
    },
    computed: {
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
    methods: {
        async fetchPlaylist() {
            this.loading = true;
            try {
                let headers = {
                    withCredentials: process.env.NODE_ENV === "development" ? false : true,
                    responseType: "blob",
                    headers: {
                        "content-type": "application/json",
                        "X-CSRFToken": Cookies.get("csrftoken")
                    }
                };
                const data = {
                    mappers: this.mappers,
                    uploadedAfter: this.months,
                    minUpvotes: this.minUpvotes,
                    minDownvotes: this.minDownvotes
                };

                this.$defaultApi
                    .$post("beatsaver/playlists/", data, headers)
                    .then(response => {
                        const blob = new Blob([response], { type: "application/json" });
                        const link = document.createElement("a");
                        link.href = URL.createObjectURL(blob);
                        link.download = "maps for " + this.mappers.join(",");
                        link.click();
                        URL.revokeObjectURL(link.href);
                    })
                    .catch(e => {
                        console.log(e);
                        alert("No maps found");
                    });
            } catch (e) {
                alert("Something went wrong");
            } finally {
                this.loading = false;
            }
        },
        addMapper() {
            if (this.mapperInput) {
                const mappers = this.mapperInput.split(",");
                for (let mapper of mappers) {
                    mapper = mapper.trim();
                    if (mapper && !this.mappers.includes(mapper)) this.mappers.push(mapper);
                }
                this.mapperInput = "";
            }
        },
        removeMapper(mapper) {
            this.mappers = this.mappers.filter(m => m != mapper);
        },
        getFormattedUploaded(date) {
            return date.split("T")[0];
        }
    }
};
</script>

<style lang="scss">
.playlists {
    h2 {
        color: #fff;
        font-weight: normal;
        margin: 15px 0;
    }

    .filter-container {
        flex: 1;
        display: flex;
        justify-content: center;
        min-width: 350px;

        .filter {
            max-width: 800px;
            display: flex;
            flex-direction: column;
            width: 100%;

            .vs-input-parent {
                margin-top: 5px;
            }
            .mappers {
                display: flex;
                flex-wrap: wrap;
                margin-top: 15px;
                .mapper {
                    max-width: 200px;
                    margin: 0px 10px 10px 0px;

                    button {
                        padding: 0px 10px;
                    }

                    i {
                        margin-left: 5px;
                    }
                }
            }

            .row {
                margin: 7px 0px;

                > label {
                    display: block;
                    color: #fff;
                    font-weight: bold;
                    margin-bottom: 5px;
                }
                &.search label {
                    margin: 0;
                }
            }

            .vs-button {
                width: 100%;
                margin: 0px;
            }
        }
    }
}
</style>
