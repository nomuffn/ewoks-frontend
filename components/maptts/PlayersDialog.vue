<template>
    <vs-dialog auto-width not-center dark v-model="value['players']">
        <template #header>
            <h3>Approved players the script checks</h3>
        </template>

        <div class="con-content">
            <div
                class="player"
                v-for="player of players"
                :key="player.scoresaberId"
            >
                <a
                    target="_blank"
                    :href="`https://www.twitch.tv/${player.twitchName}`"
                    ><b>{{ `twitch.tv/${player.twitchName}` }}</b></a
                >
                <a
                    target="_blank"
                    :href="`https://scoresaber.com/u/${player.scoresaberId}`"
                    >> {{ `scoresaber.com/u/${player.scoresaberId}` }}</a
                >
            </div>
        </div>
    </vs-dialog>
</template>

<script>
import Cookies from "js-cookie";
export default {
    props: {
        value: Object,
    },
    data() {
        return {
            players: [],
        };
    },
    async fetch() {
        this.players = await fetch(
            `https://ewoks.de/backend/api/maptts/players`
        ).then((res) => res.json());
        console.log(this.players);
    },
};
</script>

<style lang="scss">
.vs-dialog {
    .vs-input-parent {
        margin-top: 30px;
    }
    .con-content {
        display: flex;
        flex-direction: column;
    }
    .player {
        margin-bottom: 20px;
        text-align: left;
        padding: 0px 50px;
        display: flex;
        flex-direction: column;

        a {
            color: inherit;
            text-decoration: none;
            position: relative;
            &:after {
                background: none repeat scroll 0 0 transparent;
                bottom: 0;
                content: "";
                display: block;
                height: 2px;
                left: 50%;
                position: absolute;
                background: #fff;
                transition: width 0.3s ease 0s, left 0.3s ease 0s;
                width: 0;
            }
            &:hover:after {
                width: 100%;
                left: 0;
            }
        }
    }
    h3 {
        margin: 20px 0px;
    }
}
.vs-dialog-content {
    padding-top: 0px;
    padding-bottom: -240px;
    text-align: center;
}
</style>
