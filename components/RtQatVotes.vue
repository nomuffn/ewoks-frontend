<template>
    <div>
        <div class="title_container">
            <h2 class="title">Latest RT/QAT Votes</h2>
        </div>
        <div class="votesfeed">
            <vs-alert v-if="stats" color="primary">
                <span v-html="this.$nl2br(content.Description[0].AlertText)" />
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

            <alert
                v-for="alert in getRestAlerts"
                :key="alert.id"
                :alert="alert"
            />

            <loading-spinner v-if="loading" />
            <div class="card-container">
                <vs-card
                    v-for="(vote, index) of votes"
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
                                        red: string[0] == 'qat',
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
            </div>
        </div>
    </div>
</template>

<script>
export default {
    transition: "slide-bottom",
    props: ["content"],
    computed: {
        getRestAlerts() {
            return this.content.Description.length > 1
                ? this.content.Description.slice(1)
                : [];
        },
    },
    data() {
        return {
            stats: null,
            votes: null,
            loading: true,
        };
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
    methods: {
        openUrl: function (id) {
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
        },
    },
};
</script>

<style lang="scss">
.RtQatVotes {
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
        min-width: 300px;

        .vs-card__text {
            flex-wrap: wrap;
            flex-direction: row !important;

            h3 {
                width: 100%;
                margin-bottom: 5px;
            }

            .time {
                align-self: center;
            }
        }
    }
}
</style>
