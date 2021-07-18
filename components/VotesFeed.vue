<template>
    <div class="votesFeed">
        <vs-alert v-if="stats" color="primary">
            Updates every hour
            <br />
            Might be slightly off :)<br />
            Votes in the last month:<br />
            RT Up-/Downvotes:
            <b>{{ stats.lastMonth.rtupvotes__sum }}</b>
            /
            <b>{{ stats.lastMonth.rtdownvotes__sum }}</b>
            <br />
            QAT Up-/Downvotes:
            <b>{{ stats.lastMonth.qatupvotes__sum }}</b>
            /
            <b>{{ stats.lastMonth.qatdownvotes__sum }}</b>
            <br />
            <br />
            Votes since 8th August 2020:<br />
            RT Up-/Downvotes:
            <b>{{ stats.allTime.rtupvotes__sum }}</b>
            /
            <b>{{ stats.allTime.rtdownvotes__sum }}</b>
            <br />
            QAT Up-/Downvotes:
            <b>{{ stats.allTime.qatupvotes__sum }}</b>
            /
            <b>{{ stats.allTime.qatdownvotes__sum }}</b>
            <br />
        </vs-alert>

        <Loading v-if="loading" />
        <div class="cards">
            <vs-card
                v-for="(vote, index) of getVotes"
                :key="index"
                v-on:click="openUrl(vote.requestId)"
            >
                <template #text>
                    <h3>{{ vote.name }} by {{ vote.mapper }}</h3>

                    <div class="spans">
                        <span
                            v-for="(string, index) of vote.strings"
                            :key="index"
                        >
                            <span
                                v-bind:class="{
                                    red: string[0] == 'qat'
                                }"
                                >{{ string[0].toUpperCase() }}</span
                            >
                            {{ string[1] }}
                        </span>
                    </div>

                    <p class="time">
                        {{ vote.hoursago }}
                    </p>
                </template>
            </vs-card>
            <vs-button
                v-if="visibleItems < 25"
                class="showMore"
                icon
                @click="visibleItems += 10"
            >
                Show more
            </vs-button>
        </div>
    </div>
</template>

<script>
import Loading from "@/components/LoadingSpinner.vue";
export default {
    data() {
        return {
            stats: null,
            votes: null,
            loading: true,
            visibleItems: 10
        };
    },
    components: {
        Loading
    },
    async created() {
        this.stats = await this.$defaultApi.$get("rq/stats");
        this.votes = await this.$defaultApi.$get("rq/feed");
        this.loading = false;

        for (let index = 0; index < this.votes.length; index++) {
            let element = this.votes[index];

            if (element.hoursleft > 24) {
                this.votes[index].hoursago =
                    "~" + Math.round(element.hoursago / 24) + " days";
            } else {
                this.votes[index].hoursago = "~" + element.hoursago + " hours";
            }

            for (let [key, value] of Object.entries(this.votes[index].votes)) {
                let str = key.split("_");
                str[1] =
                    this.capitalizeTheFirstLetterOfEachWord(str[1]) +
                    ": " +
                    (value > 0 ? "+" + value : value);

                if (!this.votes[index].strings) this.votes[index].strings = [];
                this.votes[index].strings.push(str);
            }
        }
    },
    computed: {
        getVotes() {
            return this.votes?.slice(0, this.visibleItems);
        }
    },
    methods: {
        openUrl: function(id) {
            window.open(
                "https://new.scoresaber.com/ranking/request/" + id,
                "_blank"
            );
        },
        capitalizeTheFirstLetterOfEachWord(words) {
            var separateWord = words.toLowerCase().split(" ");
            for (var i = 0; i < separateWord.length; i++) {
                separateWord[i] =
                    separateWord[i].charAt(0).toUpperCase() +
                    separateWord[i].substring(1);
            }
            return separateWord.join(" ");
        }
    }
};
</script>

<style lang="scss">
.votesFeed {
    .spans {
        width: 50%;
        display: flex;
        flex-flow: column;
    }

    p {
        width: 50% !important;
    }

    span span {
        color: green;
        padding: 0;
        font-weight: bold;
    }

    .red {
        color: #b71c1c;
    }

    .vs-card-content {
        width: 100%;
        flex: 100% !important;
    }

    .vs-card {
        max-width: 100%;
    }

    .vs-card__text {
        flex-wrap: wrap;
        flex-direction: row !important;
    }

    .vs-card__text h3 {
        width: 100%;
        margin-bottom: 5px;
    }

    .time {
        align-self: center;
    }
}
</style>
