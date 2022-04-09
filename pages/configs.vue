<template>
    <div class="configs">
        <div class="header">
            <div class="left">
                <div class="aaa">
                    <h2 class="title">
                        Configs & files
                    </h2>
                    <p>
                        This is an attempt to gather most of the various player
                        configs & files for stuff like:
                        <br />
                        HitScoreVisualizer, Playlists, Counters+, public Sabers,
                        Hitsounds
                        <br />
                        If you want any of yours to be added here dm me your
                        file on discord: muffn#2345
                    </p>
                </div>
            </div>
        </div>

        <div class="content">
            <loading-spinner v-if="!configs.length" />
            <div v-for="cat in categories" :key="cat" class="category">
                <h2 class="title">{{ getCategoryName(cat) }}</h2>
                <div class="cards row">
                    <div
                        class="card"
                        v-for="(item, index) in getConfigs(cat)"
                        :key="index"
                    >
                        <p v-if="item.player">{{ item.player }}</p>
                        <h3 v-if="item.name">{{ item.name }}</h3>
                        <p v-if="item.description" class="description">
                            {{ item.description }}
                        </p>
                        <p class="updated_at">
                            Last updated:
                            {{ new Date(item.updated_at).toLocaleDateString() }}
                        </p>

                        <div class="buttons">
                            <vs-button
                                v-if="showSource(item)"
                                border
                                style="min-width: 60px"
                                primary
                                animation-type="scale"
                                blank
                                :href="item.file"
                            >
                                <i class="bx bx-code-alt"></i>
                                <template #animate> Open </template>
                            </vs-button>

                            <a class="nope" :href="item.file" download>
                                <vs-button
                                    border
                                    style="min-width: 80px"
                                    primary
                                    animation-type="scale"
                                >
                                    <i class="bx bx-download"></i>
                                    <template #animate> Download </template>
                                </vs-button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    transition: 'slide-bottom',
    data() {
        return {
            configs: [],
        }
    },
    async created() {
        this.configs = await this.$defaultApi.$get('general/configs')
    },
    methods: {
        getConfigs(category) {
            return this.configs.filter(conf => conf.category == category)
        },
        getCategoryName(category) {
            if (category == 'hsv') return 'HSV'
            if (category == 'customnotes') return 'Custom Notes'
            return category.charAt(0).toUpperCase() + category.slice(1)
        },
        showSource(item) {
            const type = item.file.substring(item.file.lastIndexOf('.') + 1)
            if (type == 'js') return true
            if (type == 'json') return true
            return false
        },
    },
    computed: {
        categories() {
            const confs = this.configs.map(conf => conf.category)
            return [...new Set(confs)] //makes it unique
        },
    },
}
</script>

<style lang="scss">
.configs {
    .content {
        flex-direction: column;

        .category {
        }
    }

    a {
        text-decoration: none;
    }

    .buttons {
        display: flex;
        justify-content: flex-end;
        margin-top: 10px;
    }
    .card {
        height: 100%;
        max-width: 500px;
        min-height: auto;
        cursor: default;
        p {
            font-size: 0.9rem;
        }
        .description {
            max-width: 500px;
        }
    }
    .updated_at {
        text-align: right;
        font-size: 90%;
        opacity: 0.5;
    }
}
</style>
