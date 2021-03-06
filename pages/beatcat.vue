<template>
	<div style="text-align: center;">

        <button v-on:click="login" >asdfasdfdfasd</button>

        <button v-on:click="refresh" >refresh</button>

        <vs-alert color="warn">
            soon
        </vs-alert>

        <!-- <img style="width: 50%; height: 80vh; object-fit: contain;" src="pain.png"/> -->

	</div>
</template>

<script>

export default {
    methods: {
        login: function() {
            this.$auth.loginWith('social').then(() => console.log("logged in!"));
        },
        refresh: function() {
            // Access using $auth
            console.log(this.$auth.user);
            console.log(this.$store.state.auth.user);
            console.log(this.$store.state.auth.loggedIn);
        }
    },

}
</script>

<style>

</style>
