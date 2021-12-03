<template>
    <vs-dialog auto-width not-center dark v-model="value['suggest']" v-on:close="close">
        <template #header>
            <h3>Suggest a player</h3>
        </template>

        <div class="con-content">
            <vs-input v-model="twitch" label-placeholder="Twitch Name" />
            <vs-input v-model="scoresaber" label-placeholder="Scoresaber ID" />
            <p class="hint">
                After suggesting a player it will
                <br />
                have to be approved until their scores
                <br />
                will be checked by the script
            </p>

            <vs-button style="max-width: 60px" animation-type="scale" @click="submit" :loading="loading">
                <i class="noMargin bx bxs-paper-plane"></i>
                <template #animate> submit </template>
            </vs-button>

            <p v-if="response != ''" class="response">
                {{ response }}
            </p>
        </div>
    </vs-dialog>
</template>

<script>
import Cookies from 'js-cookie'
export default {
    watch: {},
    props: {
        value: Object,
    },
    data() {
        return {
            twitch: '',
            scoresaber: '',
            loading: false,
            response: '',
        }
    },
    methods: {
        async submit() {
            if (this.twitch == '' || this.scoresaber == '') {
                this.response = "Fields can't be empty :("
                return
            }

            this.loading = true
            this.response = ''

            var CSRF_TOKEN = Cookies.get('csrftoken')
            let headers = {
                'content-type': 'application/json',
                'X-CSRFToken': CSRF_TOKEN,
            }

            this.response = (
                await this.$mapttsApi.post(
                    `players/`,
                    {
                        twitchName: this.twitch,
                        scoresaberId: this.scoresaber,
                    },
                    { withCredentials: true, headers },
                )
            ).data

            this.loading = false
        },
        close() {
            this.twitch = ''
            this.scoresaber = ''
            this.response = ''
        },
    },
}
</script>

<style lang="scss" scoped>
.vs-dialog {
    h3 {
        text-align: center;
        margin-top: 20px;
        margin-bottom: -20px;
    }

    .hint {
        font-size: 10pt;
        opacity: 0.7;
        margin-left: 5px;
    }

    p {
        margin: 10px 0px;
    }

    .vs-button {
        margin-left: 5px;
        max-width: 80px;
        padding: 0px 20px;
        align-self: center;
    }

    .vs-input-parent {
        margin-top: 30px;
    }

    .con-content {
        display: flex;
        flex-direction: column;
    }

    .response {
        margin: 15px 0px 0px 0px;
    }
}
.vs-dialog-content {
    padding-top: 0px;
    padding-bottom: -240px;
    text-align: center;
}
</style>
