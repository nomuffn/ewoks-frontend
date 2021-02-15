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
                <br>
                <br>
                Very rough amount of mappers: 315
                <br>
                Unfortunately some mapper names are still scuffed from 2018
                <br>
                <br>
                Stats from beatsaver are gonna be put offhold for now<br>until I find the motivation and solution for their api restrictions.
            </vs-alert>
        </div>

        <div class="col">
            <div class="title_container">
                <h2 class="title">Distribution in mappers</h2>
            </div>

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
                <h2 class="title">Distribution in song artists</h2>
            </div>

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


    export default {
        components: {

        },
        data() {
            return {
                data: {}
            }
        },
        async fetch() {
            this.data = await fetch("https://ewoks.de/api.php?rankedStats").then(res => res.json())
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

/deep/ .col {
    flex: inherit;
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