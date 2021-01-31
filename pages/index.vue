<template>
  <div class="container">

	<vs-navbar square center-collapsed v-model="active">
        <template #left>
			<h2 class="title">Ewoks</h2>
        </template>
        <vs-navbar-item :active="active == 'home'" id="home">
          Home
        </vs-navbar-item>
        <vs-navbar-item :active="active == 'categorized'" id="categorized">
          Categorized Maps
        </vs-navbar-item>
      </vs-navbar>

	<div class="content">

		<Home v-show="active == 'home'" />
		<CategorizedMaps v-show="active == 'categorized'" />

	</div>
  </div>
</template>

<script>

import Home from "@/components/tabs/Home.vue";
import CategorizedMaps from "@/components/tabs/CategorizedMaps.vue";

export default {

	data : () => ({
		active: "home"
	}),

	components: {
		Home,
    CategorizedMaps
	}

}
</script>

<style>

html, body {
  max-width: 100%;
  overflow-x: hidden;
}

:root {
	--vs-background: #fff !important;
  --vs-primary:  156, 39, 176;
}

.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: left;
  text-align: left;
  background-color: #18191c;
  padding-top: 80px;
}

.content {
  width: 100%;
}

</style>