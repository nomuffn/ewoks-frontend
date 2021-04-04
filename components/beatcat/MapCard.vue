<template>
    <vs-card class="mapcard">
        <template #title>
            <h3>{{ map.name }}</h3>
        </template>
        <template #img>
            <img :src="map.cover" alt="" />
        </template>
        <template #text>
            <p>{{ map.artist }}</p>
            <p>{{ map.mapper }}</p>

            <div class="map-tags">
                <vs-button border v-for="tag of map.tags" class="tag" :key="tag">{{ getTagNameById(tag) }}</vs-button>
            </div>
        </template>

        <template #interactions>
            <!-- Download zip -->
            <vs-button shadow>
                <i class="bx bxs-download"></i>
            </vs-button>

            <!-- OneClick Download -->
            <vs-button shadow>
                <i class="bx bxs-hand-up"></i>
            </vs-button>

            <!-- Scoresaber -->
            <vs-button color="#F9A825"> S </vs-button>

            <!-- Options dialog -->
            <vs-button class="options" shadow primary @click="$emit('openOptions', map)">
                <i class="bx bx-dots-horizontal-rounded"></i>
            </vs-button>
        </template>
    </vs-card>
</template>

<script>
export default {
    props: {
        tags: Array,
        map: Object,
    },
    data() {
        return {
            activeDialog: { optionsDialog: false },
        };
    },
    methods: {
        openUrl: function (id) {
            window.open("https://scoresaber.com/leaderboard/" + id, "_blank");
        },
        getTagNameById(id) {
            /*
             * Future reference; foreach goes into a function so simple return wouldnt work in there :/
             */
            let tag = null;
            this.tags.forEach((element) => {
                if (element.id == id) tag = element;
            });
            return tag.name;
        },
    },
};
</script>

<style lang="scss" scoped>
.mapcard {
    .vs-card-content {
        margin: 0px 15px 15px 0px;
        text-align: left;
        max-width: 250px;
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

.vs-dialog {
    h4 {
        text-align: center;
        margin-top: 10px;
    }

    .vs-button {
        margin-bottom: 20px;
        width: 300px;

        i {
            margin-left: 5px;
        }
    }
}
</style>
