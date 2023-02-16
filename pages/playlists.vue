<template>
    <div class="playlists">
        <div class="header">
            <div class="left">
                <div class="aaa">
                    <h2 class="title">Playlists stuff</h2>
                </div>
            </div>
        </div>
        <div class="content flex justify-evenly flex-wrap">
            <div class="feature">
                <h3 class="title" style="padding-left: 0px">Playlist Viewer</h3>
                <Message class="self-center mt-8 w-full" :closable="false">
                    <p>Look at playlists without opening the game wowww!</p>
                    <p>
                        Kinda limited with big playlists but it will do the job
                        for now
                    </p>
                    <p>Might not show maps uploaded within the last 24 hrs</p>
                </Message>
                <vs-button
                    border
                    primary
                    animation-type="scale"
                    @click="$refs.playlistInput.click()"
                >
                    <template> Upload playlist </template>
                </vs-button>
                <input
                    @change="readPlaylist"
                    style="display: None"
                    type="file"
                    ref="playlistInput"
                    id="file"
                    name="file"
                    accept=".json,.bplist"
                />
                <div v-if="playlist" class="mt-4">
                    <playlist-viewer v-if="playlist" :playlist="playlist" />
                </div>
            </div>
            <div class="feature">
                <h3 class="title" style="padding-left: 0px">Playlist maker</h3>
                <Message class="self-center mt-8 w-full" :closable="false">
                    <p>
                        Filters by various conditions across all maps on
                        beatsaver and puts them into a playlist
                    </p>
                    <p>
                        Database of all maps used for this only updates once a
                        day
                    </p>
                </Message>

                <div class="myrow search" style="padding-top: 10px">
                    <label>Enter mappers and press enter</label>
                    <p class="grey">
                        Will include all occurences in mapper names
                    </p>
                    <p class="grey">
                        You can also enter a comma separated list
                    </p>
                    <vs-input
                        v-model="mapperInput"
                        type="search"
                        placeholder="Mapper name"
                        v-on:keyup.enter="addMapper"
                    />
                    <div v-if="mappers.length" class="mappers">
                        <div
                            class="mapper"
                            v-for="mapper in mappers"
                            :key="mapper"
                        >
                            <vs-button icon @click="removeMapper(mapper)">
                                {{ mapper }}
                                <i class="bx bx-x"></i>
                            </vs-button>
                        </div>
                    </div>
                </div>
                <div class="myrow">
                    <label>Uploaded after: {{ getFormattedMonths }}</label>
                    <Slider
                        v-model="months"
                        :min="0"
                        :max="getMonthsDifference"
                        :tooltips="false"
                    />
                </div>
                <div class="myrow">
                    <label>Minimum ratio: {{ ratio }}%</label>
                    <p class="grey">
                        Ratio calculation (not the same like on beatsaver):
                        upvotes / (upvotes + downvotes) * 100
                    </p>
                    <p class="grey">
                        To get an idea of it go to
                        <nuxt-link style="color: grey" to="/stats/beatsaver"
                            >statistics/beatsaver</nuxt-link
                        >
                    </p>
                    <Slider v-model="ratio" :max="100" :tooltips="false" />
                </div>
                <div class="myrow">
                    <label>Minimum upvotes: {{ minUpvotes }}</label>
                    <Slider
                        v-model="minUpvotes"
                        :max="1000"
                        :tooltips="false"
                    />
                </div>
                <div class="myrow">
                    <label>Maximum downvotes: {{ getmaxDownvotes }}</label>
                    <Slider
                        v-model="maxDownvotes"
                        :max="1000"
                        :tooltips="false"
                    />
                </div>

                <div class="myrow">
                    <vs-button
                        :loading="loading"
                        @click="fetchPlaylist"
                        :disabled="!mappers.length || loading"
                    >
                        Make da playlist
                    </vs-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Cookies from 'js-cookie'

export default {
    transition: 'slide-bottom',
    data() {
        return {
            mapperInput: '',
            mappers: [],
            loading: false,
            minUpvotes: 0,
            maxDownvotes: 0,
            ratio: 0,
            uploadedAfter: 0,
            gameReleaseDate: 1525179660, //Tuesday, May 1, 2018
            months: 0,
            playlist: null,
        }
    },
    computed: {
        getFormattedMonths() {
            const now = new Date(this.gameReleaseDate * 1000)
            const newDate = new Date(now.setMonth(now.getMonth() + this.months))
            const month = newDate.getMonth() + 1
            return `${(month > 9 ? '' : '0') + month}-${newDate.getFullYear()}`
        },
        getMonthsDifference() {
            var date1 = new Date(this.gameReleaseDate * 1000)
            var difference = date1.getTime() - new Date()
            return (
                Math.abs(
                    Math.floor(difference / 1000 / 60 / 60 / 24 / 30.437),
                ) - 1
            )
        },
        getmaxDownvotes() {
            return this.maxDownvotes == 0 ? '-' : this.maxDownvotes
        },
    },
    methods: {
        async fetchPlaylist() {
            this.loading = true
            try {
                let headers = {
                    withCredentials:
                        process.env.NODE_ENV === 'development' ? false : true,
                    responseType: 'blob',
                    headers: {
                        'content-type': 'application/json',
                        'X-CSRFToken': Cookies.get('csrftoken'),
                    },
                }

                //use form
                const data = {
                    mappers: this.mappers,
                    uploadedAfter: this.months,
                    ratio: this.ratio,
                    minUpvotes: this.minUpvotes,
                    maxDownvotes: this.maxDownvotes,
                }

                this.$defaultApi
                    .$post('beatsaver/playlists/', data, headers)
                    .then((response) => {
                        const blob = new Blob([response], {
                            type: 'application/json',
                        })
                        const link = document.createElement('a')
                        link.href = URL.createObjectURL(blob)
                        link.download =
                            'muffnlabs playlist of ' +
                            this.mappers.length +
                            ' mappers'
                        link.click()
                        URL.revokeObjectURL(link.href)
                    })
                    .catch((e) => {
                        console.log(e)
                        alert('No maps found')
                    })
            } catch (e) {
                alert('Something went wrong')
            } finally {
                this.loading = false
            }
        },
        addMapper() {
            if (this.mapperInput) {
                const mappers = this.mapperInput.split(',')
                for (let mapper of mappers) {
                    mapper = mapper.trim()
                    if (mapper && !this.mappers.includes(mapper))
                        this.mappers.push(mapper)
                }
                this.mapperInput = ''
            }
        },
        removeMapper(mapper) {
            this.mappers = this.mappers.filter((m) => m != mapper)
        },
        getFormattedUploaded(date) {
            return date.split('T')[0]
        },
        async readPlaylist(input) {
            // TODO clean up at some point
            var f = input.target.files[0]
            if (f) {
                var r = new FileReader()
                r.onload = (e) => {
                    var contents = e.target.result
                    try {
                        var obj = JSON.parse(contents)
                        this.playlist = obj
                    } catch (err) {
                        console.log(err)
                        alert('Invalid file')
                    }
                }
                r.readAsText(f)
            } else {
                alert('Failed to load file')
            }
        },
    },
}
</script>

<style lang="scss">
.playlists {
    h2 {
        color: #fff;
        font-weight: normal;
        margin: 15px 0;
    }

    .feature {
        min-width: 350px;
        max-width: 800px;
        display: flex;
        flex-direction: column;
        width: 100%;

        .vs-input-parent {
            margin-top: 5px;
        }
        .mappers {
            display: flex;
            flex-wrap: wrap;
            margin-top: 15px;
            .mapper {
                max-width: 200px;
                margin: 0px 10px 10px 0px;

                button {
                    padding: 0px 10px;
                }

                i {
                    margin-left: 5px;
                }
            }
        }

        .myrow {
            margin: 7px 0px;

            > label {
                display: block;
                color: #fff;
                font-weight: bold;
                margin-bottom: 5px;
            }
            &.search label {
                margin: 0;
            }
        }

        .vs-button {
            width: 100%;
            margin: 0px;
        }
    }
}
</style>
