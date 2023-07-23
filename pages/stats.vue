<template>
    <div class="rankingstats">
        <sub-header title="Statistics stuff">
            <p>
                <!-- pp distribution: fix backend calc -->
                Scoresaber stuff refreshes every hour
                <br />
                Beatsaver & RC Discord stuff every 24 hours
            </p>
        </sub-header>

        <TabMenu :model="items" :activeIndex.sync="active" />

        <!-- <vs-navbar color="#18191c" shadow text-white square>
            <vs-navbar-item
                to="/stats/beatsaver"
                :active="$route.path == '/stats/beatsaver'"
            >
                Beatsaver
            </vs-navbar-item>
            <vs-navbar-item
                to="/stats/scoresaber"
                :active="$route.path == '/stats/scoresaber'"
            >
                Scoresaber
            </vs-navbar-item>
            <vs-navbar-item
                to="/stats/discord"
                :active="$route.path == '/stats/discord'"
            >
                RC Discord
            </vs-navbar-item>
        </vs-navbar> -->

        <NuxtChild class="content sub-page" keep-alive />
    </div>
</template>

<script>
export default {
    transition: 'slide-bottom',
    data() {
        return {
            items: [
                { label: 'Beatsaver', to: '/stats/beatsaver' },
                { label: 'Scoresaber', to: '/stats/scoresaber' },
                { label: 'RC Discord', to: '/stats/discord' },
            ],
        }
    },
    beforeRouteEnter(to, from, next) {
        next((vm) => {
            if (to.path == '/stats') return next('/stats/beatsaver')
            next()
        })
    },
    async created() {
        // this.stats = await this.$defaultApi.$get('scoresaber/ppdist')
    },
}
</script>

<style lang="scss">
.rankingstats {
    justify-content: center;

    .p-tabmenu ul {
        justify-content: center;
    }

    .p-tabmenu,
    .p-tabmenu .p-tabmenu-nav .p-tabmenuitem .p-menuitem-link {
        background: rgb(30, 32, 35);
    }

    .vs-navbar-content {
        position: relative;

        button {
            white-space: pre-line;
            padding-top: 0px;
            padding: 0px 10px 15px 10px;
        }
    }
}
</style>
