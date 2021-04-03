<template>
    <div class="beatcat" style="text-align: center">
        <div class="title_container">
            <h2 class="title">BeatCat - Categorized Beatmaps</h2>

            <vs-button class="disc" :href="discordHref" icon color="discord">
                <i class="bx bxl-discord"></i>
                {{ discordStatus }}
            </vs-button>
        </div>

        <div class="main_content">
            <div class="tags">
                <div class="title_container">
                    <h2 class="title">Tags</h2>

                    <vs-button icon border>
                        <i class="bx bxs-message-square-add"></i>
                    </vs-button>
                </div>
                <vs-switch
                    v-for="tag of tags"
                    @input="toggleTag(tag)"
                    v-model="tag.enabled"
                    :key="tag.id"
                    :id="tag.id"
                >
                    {{ tag.name }}
                </vs-switch>
            </div>

            <div class="maps">
                <div class="title_container">
                    <h2 class="title">Maps</h2>

                    <vs-button icon border>
                        <i class="bx bxs-message-square-add"></i>
                    </vs-button>
                </div>
                <vs-card :key="map.id" v-for="map of maps">
                    <template #text>
                        <h3>{{ map.name }}</h3>
                    </template>
                </vs-card>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    created() {
        if (this.doesHttpOnlyCookieExist("sessionid")) {
            this.discordStatus = "Logout ";
            this.discordHref = "http://192.168.2.116:8000/logout";
        }
    },
    data() {
        return {
            tags: [],
            maps: [],
            discordStatus: "Login ",
            discordHref: "http://192.168.2.116:8000/discord/login",
        };
    },
    async fetch() {
        this.tags = await fetch(
            "http://192.168.2.116:8000/api/tags"
        ).then((res) => res.json());

        let first = 0;
        this.tags.forEach((tag) => {
            if (first++ == 0) tag.enabled = true;
            else tag.enabled = false;
        });

        this.loadMapsForTag(this.tags[0]);
    },
    methods: {
        toggleTag(tag) {
            //remove all maps with only that tag
            if (tag.enabled) {
                // just got enabled, load new maps
                this.loadMapsForTag(tag);
            } else {
                //got disabled, remove maps
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
                    if (tag.enabled && tag.id == tags[index]) return true;
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
            let result = await fetch(
                `http://192.168.2.116:8000/api/maps/${tag.id}`
            ).then((res) => res.json());

            result.forEach((map) => {
                if (this.containsMap(map) == false) this.maps.push(map);
            });
        },
        containsMap(newMap) {
            console.log(newMap.id);
            for (let index = 0; index < this.maps.length; index++) {
                const map = this.maps[index];
                if (map.id == newMap.id) return true;
            }
            return false;
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
        }

        .maps {
            flex: 1;
        }
    }
}
</style>
