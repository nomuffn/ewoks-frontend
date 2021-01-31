<template>

	<div>
		<vs-sidebar notShadow absolute v-model="active" open>

			<vs-sidebar-item id="rankingqueue">
			<template #icon>
				<i class='bx bx-list-ul'></i>
			</template>
			Ranking Queue
			</vs-sidebar-item>

			<vs-sidebar-item id="toptenfeed">
			<template #icon>
				<i class='bx bx-line-chart-down'></i>
			</template>
			Top Ten Feed
			</vs-sidebar-item>

			<vs-sidebar-item id="tools">
			<template #icon>
				<i class='bx bxs-category'></i>
			</template>
			Tools
			</vs-sidebar-item>

			<vs-sidebar-item id="scripts">
			<template #icon>
				<i class='bx bx-code-alt'></i>
			</template>
			Scripts
			</vs-sidebar-item>

			<vs-sidebar-item id="stats">
			<template #icon>
				<i class='bx bx-stats' ></i>
			</template>
			Ranked Stats
			</vs-sidebar-item>
		</vs-sidebar>

		<RankingQueue v-show="active == 'rankingqueue'" />
		<TopTenFeed v-show="active == 'toptenfeed'" />
		<Tools v-show="active == 'tools'" />
		<Scripts v-show="active == 'scripts'" />
		<RankedStats v-show="active == 'stats'" />

	</div>
</template>

<script>

import RankingQueue from "@/components/tabs/home/RankingQueue.vue";
import TopTenFeed from "@/components/tabs/home/TopTenFeed.vue";
import Tools from "@/components/tabs/home/Tools.vue";
import Scripts from "@/components/tabs/home/Scripts.vue";
import RankedStats from "@/components/tabs/home/RankedStats.vue";

export default {

	data:()=>({
		active: "rankingqueue"
	}),

	components: {
		RankingQueue,
		TopTenFeed,
		Tools,
		Scripts,
		RankedStats
	}
}
</script>

<style>

.vs-sidebar-content {
	margin-top: 80px;
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
</style>
