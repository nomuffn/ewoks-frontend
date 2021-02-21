<template>
    <div class="main_content">

        <div class="col">
            <div class="title_container">
                <h2 class="title">General</h2>
            </div>

            <vs-alert color="primary">
                Maps ranked: 1789
                <br>
                <br>
                > 600pp:  {{ data.above600 }}
                <br>
                > 500pp:  {{ data.above500 }}
                <br>
                > 400pp:  {{ data.above400 }}
                <br>
                > 300pp: {{ data.above300 }}
                <br>
                > 200pp: {{ data.above200 }}
                <br>
                > 100pp: {{ data.above100 }}
                <br>
                > 50pp:  {{ data.above50 }}
                <br>
                > 0pp:  {{ data.above0 }}
            </vs-alert>
            <vs-alert color="primary">
                Very rough amount of mappers: 315
                <br>
                Unfortunately some mapper names are still scuffed from 2018
                <br>
                <br>
                Stats from beatsaver are gonna be put offhold for now until I find the motivation and solution for their api restrictions.
            </vs-alert>
        </div>

        <div class="col">
            <div class="title_container">
                <h2 class="title">Mapset Count by Mappers</h2>
            </div>

            <Loading v-if="loading" />
            <div class="card-container" >
                <vs-card :key="mapper" v-for="(value, mapper, index) in data.mappers"
                        v-on:click="openUrl(mapper)">
                    <template #text>
                    <h3><span class="colored">#{{ index + 1 }}</span> {{ mapper }}: {{ value }}</h3>
                    </template>
                </vs-card>
            </div>

        </div>

        <div class="col">
            <div class="title_container">
                <h2 class="title">Difficulty Count by Mappers</h2>
            </div>

            <Loading v-if="loading" />
            <div class="card-container" >
                <vs-card :key="mapper" v-for="(value, mapper, index) in data.mappersDiffs"
                        v-on:click="openUrl(mapper)">
                    <template #text>
                    <h3><span class="colored">#{{ index + 1 }}</span> {{ mapper }}: {{ value }}</h3>
                    </template>
                </vs-card>
            </div>

        </div>

        <div class="col">

            <div class="title_container">
                <h2 class="title">Difficulty Count by Song Artists</h2>
            </div>

            <Loading v-if="loading" />
            <div class="card-container" >
                <vs-card :key="artist" v-for="(value, artist, index) in data.artists"
                        v-on:click="openUrl(artist)">
                    <template #text>
                    <h3><span class="colored">#{{ index + 1 }}</span> {{ artist }}: {{ value }}</h3>
                    </template>
                </vs-card>
            </div>

        </div>

    </div>
</template>

<script>

import Loading from "@/components/LoadingSpinner.vue"
export default {
    data() {
        return {
            data: {},
            loading: true
        }
    },
    components: {
        Loading
    },
    async fetch() {
        this.data = await this.$axios.$get("?rankedStats")
        this.loading = false;
    },
    methods : {
        openUrl: function (mapper) {
            window.open("https://scoresaber.com/?search=" + mapper, "_blank");
        }
    }
}
</script>

<style scoped>

.main_content {
    justify-content: center;
}

/deep/ .card-container .vs-card-content:first-child .vs-card .colored {
    color: #FFCA28 !important;
}

/deep/ .card-container .vs-card-content:nth-child(2) .vs-card .colored {
    color: #BDBDBD !important;
}

/deep/ .card-container .vs-card-content:nth-child(3) .vs-card .colored {
    color: #FFA726 !important;
}


/deep/ .col {
    flex: inherit;
    max-width: 300px;
}

/deep/ h3 {
    padding: 20px 10px 10px 10px;
}

/deep/ .vs-card-content {
    margin-bottom: 15px;
}

/deep/ .card-container {
    margin-top: 10px;
}

/deep/ .vs-card-content {
    width: 100%;
}

/deep/ .vs-card {
    max-width: 400px;
}

</style>