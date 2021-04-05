<template>
    <div class="beatcat" style="text-align: center">
        <div class="title_container">
            <div class="left">
                <h2 class="title">BeatCat - Categorized Beatmaps</h2>
                <vs-button icon transparent>
                    <i class="noMargin bx bx-info-circle"></i>
                </vs-button>
            </div>

            <vs-button class="disc" :href="discord['href']" icon color="discord">
                {{ discord["status"] }}
                <i class="bx bxl-discord"></i>
            </vs-button>
        </div>

        <div class="main_content">
            <div class="tags">
                <div class="title_container">
                    <h2 class="title">Tags</h2>

                    <vs-button icon transparent>
                        Suggest tag
                        <i class="bx bxs-message-square-add"></i>
                    </vs-button>
                </div>

                <vs-switch v-for="tag of tags" @input="toggleTag(tag)" v-model="activeTags" :val="tag.id" :key="tag.id">
                    {{ tag.name }}
                </vs-switch>
            </div>

            <div class="maps">
                <div class="title_container">
                    <h2 class="title">Maps</h2>

                    <vs-button icon transparent>
                        Suggest map
                        <i class="bx bxs-message-square-add"></i>
                    </vs-button>
                </div>

                <div class="cards">
                    <MapCard v-for="map of maps" :key="map.id" :map="map" :tags="tags" @openOptions="openOptionsDialog" />
                </div>
            </div>
        </div>

        <OptionsDialog v-if="optionsDialog['map'] != null" v-model="optionsDialog" :tags="tags" />
    </div>
</template>

<script>
import MapCard from "@/components/beatcat/MapCard.vue";

export default {
    components: {
        MapCard,
        OptionsDialog: () => import("@/components/dialogs/OptionsDialog.vue"),
    },
    created() {
        if (this.doesHttpOnlyCookieExist("sessionid")) {
            this.discord["status"] = "Logout ";
            this.discord["href"] = "http://192.168.2.116:8000/logout";
        }
    },
    data() {
        return {
            activeTags: [],
            tags: [],
            maps: [],
            discord: { status: "Login ", href: "http://192.168.2.116:8000/discord/login" },
            optionsDialog: { show: false, map: null },
        };
    },
    async fetch() {
        console.log("fetch");
        this.tags = await fetch("http://192.168.2.116:8000/api/tags").then((res) => res.json());

        this.activeTags.push(this.tags[0].id);
        this.loadMapsForTag(this.tags[0]);
    },
    methods: {
        toggleTag(tag) {
            if (this.activeTags.includes(tag.id)) {
                // just got enabled, load new maps
                this.loadMapsForTag(tag);
            } else {
                //remove all maps with only that tag
                for (let index = 0; index < this.maps.length; index++) {
                    const map = this.maps[index];
                    if (!this.anyTagsSelected(map.tags)) {
                        this.maps.splice(index, 1);
                        index = -1;
                    }
                }
            }
        },
        anyTagsSelected(tags) {
            //any tags currently selected?
            for (let index = 0; index < tags.length; index++) {
                for (let ind = 0; ind < this.tags.length; ind++) {
                    const tag = this.tags[ind];
                    if (this.activeTags.includes(tag.id) && tag.id == tags[index]) return true;
                }
            }
            return false;
        },
        doesHttpOnlyCookieExist(cookiename) {
            var d = new Date();
            d.setTime(d.getTime() + 1000);
            var expires = "expires=" + d.toUTCString();

            document.cookie = cookiename + "=new_value;path=/;" + expires;
            if (document.cookie.indexOf(cookiename + "=") == -1) return true;
            else return false;
        },
        async loadMapsForTag(tag) {
            let result = await fetch(`http://192.168.2.116:8000/api/maps/${tag.id}`).then((res) => res.json());

            result.forEach((map) => {
                if (this.containsMap(map) == false) this.maps.push(map);
            });
        },
        containsMap(newMap) {
            for (let index = 0; index < this.maps.length; index++) {
                const map = this.maps[index];
                if (map.id == newMap.id) return true;
            }
            return false;
        },
        openUrl: function (id) {
            window.open("https://scoresaber.com/leaderboard/" + id, "_blank");
        },
        getTagNameById(id) {
            let ta = null;
            /*
             * Future reference; foreach goes into a function so simple return wouldnt work in there :/
             */
            this.tags.forEach((element) => {
                if (element.id == id) ta = element;
            });
            return ta.name;
        },

        openOptionsDialog(map) {
            this.optionsDialog["map"] = map;
            this.optionsDialog["show"] = true;
        },
    },
};
</script>

<style lang="scss" scoped>
.beatcat {
    p {
        color: #fff;
        text-align: left;
    }

    .title_container {
        justify-content: space-between;

        i {
            margin-left: 5px;

            &.noMargin {
                margin-left: 0px;
            }
        }

        .left {
            display: flex;
            .title {
                padding: 0px;

                i {
                    margin-top: 5px;
                }
            }
        }
    }

    > .title_container {
        background: #141417;
        border-radius: 0px 0px 20px 20px;
        padding: 0px 5%;
    }

    .disc {
        font-size: 15px;
    }

    .main_content {
        display: flex;

        .tags {
            min-width: 300px;
            margin-right: 100px;

            .vs-switch {
                margin-bottom: 20px;
            }
        }

        .maps {
            flex: 1;

            .cards {
                display: flex;
                flex-wrap: wrap;

                .vs-card-content {
                    margin: 0px 15px 15px 0px;
                    text-align: left;
                    max-width: 250px;
                }
            }

            .map-tags {
                display: flex;
                flex-wrap: wrap;
                margin-top: 10px;

                .tag {
                    padding: 0px 10px;
                    margin: 5px 10px 5px 0px;
                    border-radius: 20px;
                }
            }
            .options {
                background-color: rgb(var(--vs-primary));
            }
        }
    }
}
</style>
