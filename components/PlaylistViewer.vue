<template>
    <div class="playlist-viewer">
        <div class="flex justify-between">
            <div class="self-center">
                <template v-if="playlistFields">
                    <p
                        v-for="[key, value] of Object.entries(playlistFields)"
                        :key="key"
                        class="mb-2"
                        style="line-break: anywhere"
                    >
                        <strong>{{ key }}: </strong> {{ value }}
                    </p>
                </template>
            </div>
            <img class="w-32 object-contain" :src="image" />
        </div>
        <div>
            <vs-pagination
                v-model="page"
                :length="Math.ceil(playlist['songs'].length / offset)"
                class="my-3"
                :disabled="loading"
            />

            <loading-spinner v-if="loading" />
            <div
                v-for="song of songs"
                class="card mb-3 flex flex-row overflow-hidden"
                @click=""
            >
                <div class="flex justify-start">
                    <template v-if="!song.key">
                        <div class="flex flex-col">
                            <p v-if="song.songName">{{ song.songName }}</p>
                            <p v-if="song.levelAuthorName">
                                mapped by {{ song.levelAuthorName }}
                            </p>
                            <p>{{ song.hash }}</p>
                            <p>not available anymore :(</p>
                        </div>
                    </template>
                    <template v-else>
                        <img
                            style="
                                margin: -20px;
                                max-height: 155px;
                                max-width: 155px;
                                object-fit: contain;
                            "
                            :src="`https://eu.cdn.beatsaver.com/${song.hash.toLowerCase()}.jpg`"
                        />
                        <div
                            v-if="song.difficulties"
                            style="
                                position: absolute;
                                left: 0;
                                bottom: 0;
                                padding: 5px;
                                background-color: #00000082;
                            "
                        >
                            <p v-for="diff of song.difficulties">
                                {{ diff.name }}
                            </p>
                        </div>
                        <div class="details flex flex-col justify-center ml-12">
                            <p style="font-size: 1.25rem; line-height: 1.75rem">
                                {{
                                    `${song.songAuthorName} - ${song.songName} ${song.songSubName} (#${song.key})`
                                }}
                            </p>
                            <p>
                                Uploaded/mapped by:
                                <strong>{{
                                    `${song.uploaderUsername} (${song.levelAuthorName})`
                                }}</strong>
                            </p>
                            <p>
                                {{
                                    `${song.upvotes} 👍 / ${song.downvotes} 👎`
                                }}
                            </p>
                            <p
                                class="opacity-50"
                                style="
                                    position: absolute;
                                    bottom: 20px;
                                    right: 20px;
                                "
                            >
                                {{ song.hash }}
                            </p>
                            <p
                                class="opacity-50"
                                style="
                                    position: absolute;
                                    bottom: 40px;
                                    right: 20px;
                                "
                            >
                                Uploaded:
                                {{ new Date(song.uploaded).toLocaleString() }}
                            </p>
                            <vs-button
                                style="width: 160px; margin-top: 5px"
                                :href="`https://beatsaver.com/maps/${song.key}`"
                                blank
                            >
                                Open on Beatsaver
                            </vs-button>
                        </div>
                    </template>
                </div>
            </div>
            <vs-pagination
                v-model="page"
                :length="Math.ceil(playlist['songs'].length / offset)"
                class="my-3"
                :disabled="loading"
            />
        </div>
    </div>
</template>

<script>
import Cookies from 'js-cookie'

export default {
    mounted() {
        this.paginationLength = this.loadSongs()
    },
    props: {
        playlist: {
            required: true,
        },
    },
    data() {
        return {
            offset: 50,
            page: 1,
            paginationLength: 1,
            songs: [],
            loading: false,
        }
    },
    computed: {
        playlistFields() {
            let obj = this.readObject(this.playlist)
            if (this.playlist['customData'])
                obj = {
                    ...obj,
                    ...this.readObject(
                        this.playlist['customData'],
                        'customData_',
                    ),
                }
            delete obj.customData
            return obj
        },
        image() {
            let image = this.playlist['image'].replace('base64,', '')
            try {
                image = this.playlist['image'].split(',')[1]
            } catch (e) {}
            return `data:image/png;base64,${image}`
        },
    },
    watch: {
        async page(newVal, oldVal) {
            await this.loadSongs()
        },
        playlist(newval, oldval) {
            console.log('playlist change')
            this.page = 1
            this.loadSongs()
        },
    },
    methods: {
        async loadSongs() {
            this.loading = true
            this.songs = []
            const offset = this.offset * (this.page - 1)

            const songs = this.playlist['songs'].slice(
                offset,
                offset + this.offset,
            )

            let headers = {
                withCredentials:
                    process.env.NODE_ENV === 'development' ? false : true,
                headers: {
                    'content-type': 'application/json',
                    'X-CSRFToken': Cookies.get('csrftoken'),
                },
            }

            let newSongs = await this.$defaultApi.$post(
                'beatsaver/hashes',
                { songs: songs.map((item) => item.hash) },
                headers,
            )

            this.songs = songs.map((item) => {
                return {
                    ...item,
                    ...newSongs.find(
                        (innerItem) =>
                            item.hash.toLowerCase() ==
                            innerItem.hash.toLowerCase(),
                    ),
                }
            })
            this.loading = false
        },
        readObject(object, prefix = '') {
            let obj = {}
            const ignoredKeys = ['songs', 'image']
            for (const [key, value] of Object.entries(object)) {
                if (ignoredKeys.includes(key)) continue
                obj[prefix + key] = value
            }
            return obj
        },
    },
}
</script>

<style lang="scss"></style>
