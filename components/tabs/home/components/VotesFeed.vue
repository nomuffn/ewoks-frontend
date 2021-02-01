<template>
    <div>
        <vs-alert color="primary">
            Updates every hour
            <br>
            Might be slightly off :)<br>
            Votes in the last 7 days:<br>
            RT Up-/Downvotes: <b>{{ lastWeek[0] }}</b> / <b>{{ lastWeek[1] }}</b><br>
            QAT Up-/Downvotes: <b>{{ lastWeek[2] }}</b> / <b>{{ lastWeek[3] }}</b><br>
            <br>
            Votes since 8th August 2020:<br>
            RT Up-/Downvotes: <b>{{ allTime[0] }}</b> / <b>{{ allTime[1] }}</b><br>
            QAT Up-/Downvotes: <b>{{ allTime[2] }}</b> / <b>{{ allTime[3] }}</b><br>

        </vs-alert>

        <div class="card-container" >
            <vs-card :key="vote.id" v-for="vote of votes" v-on:click="openUrl(vote.requestId)">
                <template #title>
                <h3>{{ vote.name }} by {{ vote.mapper }}</h3>
                </template>
                <template #text>

                <p>
                    {{ vote.time_voted_string }}
                </p>

                <span v-for="string of vote.strings">
                    <span v-bind:class="{ red : string.string_first == 'QAT' }">{{ string["string_first"] }}</span>
                    {{ string["string_second"] }}
                </span>
                </template>
            </vs-card>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            lastWeek: [],
            allTime: [],
            votes: []
        }
    },
    async fetch() {
        let result = await fetch("http://localhost/api.php?votesFeed").then(res => res.json())
        this.lastWeek = result.lastWeek;
        this.allTime = result.alltime;
        this.votes = result.votes;

        for (let index = 0; index < this.votes.length; index++) {
            let element = this.votes[index];

            if ( element.time_voted > 24 ) {
                this.votes[index].time_voted_string = "~"
                + Math.round(element.time_voted / 24) + " days";
            } else {
                this.votes[index].time_voted_string = "~" + element.time_voted + " hours";
            }

            for (let ii = 0; ii < this.votes[index].strings.length; ii++) {
                let string = this.votes[index].strings[ii];

                this.votes[index].strings[ii] = {string};
                this.votes[index].strings[ii].string_first = string.substr(0,string.indexOf(' '));
                this.votes[index].strings[ii].string_second = " " + string.substr(string.indexOf(' ')+1)
            }
        }
    },
    methods : {
        openUrl: function (id) {
            window.open("https://new.scoresaber.com/ranking/request/" + id, "_blank");
        }
    }
}
</script>

<style scoped>

/deep/ span {
    width: 100%;
    padding: 0 10px;
}

/deep/ span span {
    color: green;
    padding: 0;
    font-weight: bold;
}

/deep/ .red {
    color: #d50000;
}

</style>
