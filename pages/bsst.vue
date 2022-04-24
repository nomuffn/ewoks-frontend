<template>
    <div class="bsst">
        <div class="header">
            <div class="left">
                <div class="aaa">
                    <h2 class="title">
                        Beatsaver Stats Tracker (WIP)
                    </h2>
                    <p>
                        Updates every 24 hours
                        <br />
                        If you want your account to be tracked, message me on
                        discord
                    </p>
                </div>
            </div>
        </div>
        <div class="content">
            <vs-select
                v-if="mappers"
                v-model="selectedMapper"
                label-placeholder="Select mapper"
                class="select"
                :loading="loading"
            >
                <vs-option
                    v-for="(item, key) in mappers"
                    :key="key"
                    :value="item.mapperId"
                    :label="item.mapperName"
                >
                    {{ item.mapperName }}
                </vs-option>
            </vs-select>

            <vue-good-table
                v-if="maps"
                :columns="columns"
                :rows="rows"
                :search-options="{
                    enabled: true,
                }"
                :pagination-options="{
                    enabled: true,
                    perPage: 30,
                }"
            />
        </div>
    </div>
</template>

<script>
const timeRanges = [1, 7, 30, 30 * 3, 30 * 6, 30 * 12]

export default {
    transition: 'slide-bottom',
    data() {
        return {
            selectedMapper: '',
            mappers: null,
            maps: null,
            loading: false,
        }
    },
    async created() {
        this.mappers = await this.$defaultApi.$get('beatsaver/bsst_mappers')
        if (this.$route.query.mapperId) {
            this.selectedMapper = this.$route.query.mapperId
        }
    },
    methods: {
        getVotesString(map, rangeKey) {
            if (!map[rangeKey]) return '-'
            //pepegebadd
            const upvotes =
                map[rangeKey].upvotes > 0
                    ? '+' + map[rangeKey].upvotes
                    : map[rangeKey].upvotes
            const downvotes =
                map[rangeKey].downvotes > 0
                    ? '+' + map[rangeKey].downvotes
                    : map[rangeKey].downvotes
            return `<span class="upvotes">${upvotes}</span><span class="slash">/</span> <span class="downvotes">${downvotes}</span>`
        },
        sortVotes(x, y, col, rowX, rowY) {
            const colField = col.field
            x = rowX['map'][colField].upvotes + rowX['map'][colField].downvotes
            y = rowY['map'][colField].upvotes + rowY['map'][colField].downvotes
            return x < y ? -1 : x > y ? 1 : 0
        },
    },
    watch: {
        async selectedMapper(newval, oldval) {
            this.loading = true
            this.$router.push({ query: { mapperId: this.selectedMapper } })
            this.maps = await this.$defaultApi.$get(
                'beatsaver/bsst/' + this.selectedMapper,
            )
            this.loading = false
        },
    },
    computed: {
        columns() {
            const rangeFields = timeRanges.map(range => {
                let title
                if (range == 1) title = '24h'
                else if (range == 360) title = '1y'
                else title = `${range}d`

                return {
                    field: `days-${range}`,
                    key: `days-${range}`,
                    label: title,
                    thClass: 'text-center',
                    tdClass: 'votes text-center',
                    html: true,
                    sortFn: this.sortVotes,
                }
            })
            return [
                {
                    field: 'name',
                    key: 'a',
                    label: 'Map',
                    tdClass: 'mapname',
                    html: true,
                },
                {
                    field: 'latest',
                    key: 'b',
                    label: 'Latest',
                    thClass: 'text-center',
                    tdClass: 'votes text-center',
                    html: true,
                    sortFn: this.sortVotes,
                },
                ...rangeFields,
            ]
        },
        rows() {
            return this.maps.map(map => {
                let stats = {}
                timeRanges.forEach(range => {
                    const rangeKey = `days-${range}`
                    stats[rangeKey] = this.getVotesString(map, rangeKey)
                })
                return {
                    name: `<img src="https://cdn.scoresaber.com/covers/${map.hash.toUpperCase()}.png" />
                    <span>${map.songAuthorName}<br/>${map.songName} ${
                        map.songSubName
                    }</span>`,
                    latest: `<span class="upvotes">${map.latest.upvotes}</span><span class="slash">/</span> <span class="downvotes">${map.latest.downvotes}</span>`,
                    ...stats,
                    map,
                }
            })
        },
    },
}
</script>

<style lang="scss">
.bsst {
    .content {
        padding-top: 30px;
        justify-content: center;
    }
    .vgt-wrap {
        margin-top: 20px;
        width: 100%;

        .vgt-inner-wrap {
            box-shadow: none;
        }

        table.vgt-table {
            border: none;
            color: #fff;
            background-color: transparent;

            thead th {
                background: transparent;
                color: #fff;
                font-weight: bold;
                border: none;
            }
            thead tr {
                background: #18191c;
                border-bottom: 1px solid #dcdfe6;
            }
            tbody td {
                border: none;
                color: #fff;
                opacity: 0.7;
            }

            tbody tr {
                border-bottom: 1px solid #dcdfe6;
                transition: background-color 0.3s;

                &:hover {
                    background-color: rgba(#fff, 0.2);
                }
            }
            .mapname {
                > span {
                    display: flex;
                    align-items: center;
                    max-width: 400px;

                    > span {
                        margin-left: 20px;
                    }
                }
                img {
                    max-width: 80px;
                }
            }
            .text-center {
                text-align: center;
                vertical-align: middle;
            }
            .votes > span {
                display: flex;
                justify-content: center;
            }
            .upvotes {
                color: #00d900;
                font-weight: bold;
                flex-grow: 1;
                flex-basis: 0;
            }
            .downvotes {
                color: #ff1d1d;
                font-weight: bold;
                flex-grow: 1;
                flex-basis: 0;
            }
        }
        .vgt-global-search {
            background: transparent;
            border: none;

            input {
                color: #fff;
                background: transparent;
                border: none;
                &::placeholder {
                    color: #fff;
                    opacity: 0.5;
                }
            }
            .vgt-global-search__input {
                padding-left: 30px;
                .magnifying-glass {
                    width: 14px;
                    height: 14px;
                }
            }
        }
        .vgt-wrap__footer {
            background: none;
            border: none;
        }
    }
}
</style>
