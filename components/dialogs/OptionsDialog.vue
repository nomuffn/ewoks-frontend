<template>
    <vs-dialog not-padding auto-width not-center dark v-model="value['show']" v-on:close="close">
        <template #header>
            <img :src="value['map'].cover" alt="" />
            <p>{{ value["map"].artist }}</p>
            <h3>{{ value["map"].name }}</h3>
            <p>{{ value["map"].mapper }}</p>
        </template>

        <div class="con-content">
            <vs-button color="#7d33ff" relief @click="option = 1" :active="option == 1">
                Suggest a tag for this map <i class="bx bxs-message-square-add"></i>
            </vs-button>
            <div class="option" v-if="option == 1">
                <vs-select placeholder="Select tag" v-model="tagSelectionInput">
                    <vs-option v-for="tag of tags" :key="tag.id" :value="tag.id" :label="tag.name"> {{ tag.name }} </vs-option>
                </vs-select>

                <vs-button style="max-width: 60px" animation-type="scale">
                    <i class="noMargin bx bxs-paper-plane"></i>
                    <template #animate> submit </template>
                </vs-button>
            </div>

            <vs-button color="#00695C" relief @click="option = 2" :active="option == 2">
                Suggest a newer upload for this map <i class="bx bxs-paper-plane"></i>
            </vs-button>
            <div class="option" v-if="option == 2">
                <vs-input v-model="newUploadInput" placeholder="Scoresaber Leaderboard Link" />
                <p class="leaderboardHint">Any difficulty of a mapset</p>

                <vs-button style="max-width: 60px" animation-type="scale">
                    <i class="noMargin bx bxs-paper-plane"></i>
                    <template #animate> submit </template>
                </vs-button>
            </div>

            <vs-button color="#B71C1C" relief @click="option = 3" :active="option == 3">
                Suggest a removal of a tag on this map <i class="bx bxs-paper-plane"></i>
            </vs-button>
            <div class="option" v-if="option == 3">
                <vs-select placeholder="Select tag" v-model="removeTagInput">
                    <vs-option v-for="tag of value.map.tags" :key="tag" :value="tag" :label="getTagNameById(tag, tags)">
                        {{ getTagNameById(tag, tags) }}
                    </vs-option>
                </vs-select>

                <vs-button style="max-width: 60px" animation-type="scale">
                    <i class="noMargin bx bxs-paper-plane"></i>
                    <template #animate> submit </template>
                </vs-button>
            </div>
        </div>
    </vs-dialog>
</template>

<script>
import MapCard from "@/components/beatcat/MapCard.vue";

export default {
    props: {
        value: Object,
        tags: Array,
    },
    components: {
        MapCard,
    },
    data() {
        return {
            option: 0,
            tagSelectionInput: "",
            removeTagInput: "",
            newUploadInput: "",
        };
    },
    methods: {
        dialogButton(option) {},
        getTagNameById(id, tags) {
            let ta = null;
            /*
             * Future reference; foreach goes into a function so simple return wouldnt work in there :/
             */
            tags.forEach((element) => {
                if (element.id == id) ta = element;
            });
            return ta.name;
        },
        close() {
            this.option = 0;
            this.tagSelectionInput = "";
            this.removeTagInput = "";
            this.newUploadInput = "";
        },
    },
};
</script>

<style lang="scss" scoped>
.vs-dialog {
    h3 {
        text-align: center;
    }

    .vs-button {
        width: 300px;
        i {
            margin-left: 5px;
            &.noMargin {
                margin-left: 0px;
            }
        }
    }

    .option {
        margin-bottom: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;

        div {
            margin: 10px 0px;
        }

        .leaderboardHint {
            font-size: 10pt;
            margin: -5px 0px 5px 0px;
        }

        .vs-input {
            width: 250px;
        }
    }

    img {
        margin-bottom: 15px;
        max-height: 200px;
        width: 100%;
        object-fit: cover;
        border-radius: 20px;
    }
    .con-content {
        display: inline-block;
        margin: 20px 0px;
    }
}

.vs-dialog-content {
    padding-top: 0px;
    padding-bottom: -240px;
    text-align: center;
}
</style>
