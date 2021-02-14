<template>

	<div class="home">
		<vs-sidebar square v-model="active" open>

			<vs-sidebar-item id="rankingqueue">
				<template #icon>
					<i class='bx bx-list-ul'></i>
				</template>
				Ranking Queue
			</vs-sidebar-item>

			<vs-sidebar-item id="tools">
				<template #icon>
					<i class='bx bxs-category'></i>
				</template>
				Tools & Scripts
			</vs-sidebar-item>

			<vs-sidebar-item id="stats">
				<template #icon>
					<i class='bx bx-stats'></i>
				</template>
				Ranked Stats
			</vs-sidebar-item>

			<vs-sidebar-item id="miscellaneous">
				<template #icon>
					<i class='bx bx-stats'></i>
				</template>
				Miscellaneous
			</vs-sidebar-item>
		</vs-sidebar>

		<div class="main">
			<RankingQueue v-show="active == 'rankingqueue'" />
			<Tools v-show="active == 'tools'" />
			<RankedStats v-show="active == 'stats'" />
			<Miscellaneous v-show="active == 'miscellaneous'" />
		</div>
	</div>
</template>

<script>
	import RankingQueue from "@/components/tabs/home/RankingQueue.vue";
	import Tools from "@/components/tabs/home/Tools.vue";
	import RankedStats from "@/components/tabs/home/RankedStats.vue";
	import Miscellaneous from "@/components/tabs/home/Miscellaneous.vue";

	export default {

		data: () => ({
			active: "rankingqueue"
		}),

		components: {
			RankingQueue,
			Tools,
			RankedStats,
			Miscellaneous
		}
	}
</script>

<style>
	.main {
		margin: 0 auto;
		max-width: 90%;
		margin-top: 10px;
		margin-bottom: 100px;
	}

	.main_content {
		display: flex;
        flex-wrap: wrap;
		min-width: 100%;
		max-width: 100%;
		min-height: 100%;
		max-height: 100%;
	}

	.vs-navbar__left {
		height: 80px;
		position: relative;
	}

	.vs-navbar__left .title {
		position: absolute;
	}

	.vs-sidebar-content {
		width: 100%;
		height: auto !important;
		max-width: 100%;
		position: relative;
	}

	.vs-sidebar {
		flex-direction: row !important;
		justify-content: center !important;
		flex-wrap: wrap;
		padding: 0px 20px;
	}

	.vs-sidebar__item {
		width: auto;
		margin: 0px 10px;
	}

	.vs-sidebar__item::after {
		display: none;
	}

	.vs-alert {
		height: auto !important;
	}

	.vs-alert__content {
		min-height: auto !important;
	}

	.title {
		font-weight: 400;
		font-size: 30px;
		color: #fff;
		letter-spacing: 1px;
		text-transform: capitalize;
		margin-right: 15px;
	}

	.text {
		color: #fff;
		margin: 20px 10px;
	}

	h3 {
		font-size: 16px;
	}

	.title_container {
		display: flex;
		min-height: 80px;
		align-items: center;
	}

	.col {
		flex: 1;
		min-width: 330px;
		margin: 0px 10px;
	}

	.vs-alert {
		margin: 10px 0;
	}

	.sidebar {
		height: 100%;
	}

	.sidebar .vs-alert {
		width: 85%;
		margin-top: 100%;
	}

	.colored {
		color: rgb(var(--vs-color)) !important;
		font-weight: bold;
	}

	.vs-card {
		border-radius: 15px;
	}
</style>