<template>
	<div class="beatcat" style="text-align: center;">

        <button v-on:click="login" >login</button>

        <button v-on:click="refresh" >refresh</button>

        <p>user: {{ this.$auth.user }}</p>
        <p>store user: {{ this.$store.state.auth.user }}</p>
        <p>logged in: {{ this.$store.state.auth.loggedIn }}</p>

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
            this.$auth.loginWith('discord').then(() => console.log("logged in!"));
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

.beatcat {
}

.beatcat p {
    color: #fff;
    text-align: left;
}

</style>
