<template>
    <vs-dialog auto-width not-center dark v-model="active" v-on:close="$emit('close')">
        <template v-if="value" #header>
            <h3>{{ `${value.name}'s maps in queue` }}</h3>
        </template>

        <div v-if="value" class="con-content">
            <div class="map" v-for="map in value.maps" :key="map.id">
                <a class="link" :href="`https://scoresaber.com/leaderboard/${map.songId}`" target="_blank">{{
                    `${map.name} (id: ${map.id})`
                }}</a>
                <p>Mapper(s): {{ map.mapper }}</p>
                <p>
                    Queued:
                    {{ map.created_at.replace('T', ' ').replace('Z', '') }}
                </p>
                <p>
                    Rt Up/Downvotes:
                    {{ `${map.rtupvotes} / ${map.rtdownvotes}` }}
                </p>
                <p>
                    Qat Up/Downvotes:
                    {{ `${map.qatupvotes} / ${map.qatdownvotes}` }}
                </p>
                <p>Hash: {{ map.hash }}</p>
            </div>
        </div>
    </vs-dialog>
</template>

<script>
//whole thing with v model is unnecessarily complicated
export default {
    watch: {
        value: {
            immediate: true,
            handler(val) {
                this.active = val != null
            },
        },
    },
    props: ['value'],
    data() {
        return {
            active: false,
        }
    },
    async created() {},
}
</script>

<style lang="scss">
.vs-dialog-content {
    padding: 100px 0px;
    text-align: center;

    .vs-dialog {
        .vs-input-parent {
            margin-top: 30px;
        }
        .con-content {
            display: flex;
            flex-direction: column;
        }
        .map {
            text-align: left;
            margin: 0px 15px 30px 15px;

            .link {
                color: var(--primary-color);
                font-weight: bold;
            }
        }

        h3 {
            font-size: 1.3rem;
            margin: 20px 0px;
        }
    }
}

.vs-dialog-content {
}
</style>
