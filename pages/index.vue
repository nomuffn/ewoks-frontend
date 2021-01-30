<template>
  <div class="container">
	<vs-row>
		<vs-col class="sidebar" vs-type="flex" vs-justify="center" vs-align="center" w="3">

			<h1 class="title">Ewoks</h1>

			<vs-alert color="success">
				<template #title>
					Updates
				</template>
				- Qualified maps updated to 7 days
			</vs-alert>

		</vs-col>
		<vs-col vs-type="flex" vs-justify="flex-start" vs-align="flex-start" w="3">

			<h2 class="title">Qualified Maps</h2>

			<vs-button href="https://scoresaber.com/ranking/requests" blank>
				Rank Requests
			</vs-button>

			<vs-alert color="primary">
				If a map disappears from the queue it will be seen as a new qualified map for now
			</vs-alert>

			<List url="http://localhost/api.php?qualifiedMaps" />

		</vs-col>
	</vs-row>
  </div>
</template>

<script>

import List from "@/components/List.vue";

export default {

	components: {
		List
	}

}
</script>

<style>

:root {
	--vs-background: #fff !important;
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

.title {
  display: block;
  font-weight: 400;
  font-size: 40px;
  color: #fff;
  letter-spacing: 1px;
  text-transform: capitalize;
  padding: 25px 0 15px 0;
  /* background-color: #141417; */
}

.text {
	color:#fff;
	margin: 20px 10px;
}

h1 {
	text-align: center;
}

h1, h2, h3 {
	color: #fff;
}

.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: left;
  text-align: left;
  background-color: #18191c;
}

</style>
