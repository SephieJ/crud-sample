<template>
	<div>
		<b-alert variant="success" show>{{ message }}</b-alert>
	</div>
</template>


<script>
	
	export default {
		data (){
			return {
				dismissSecs: 5,
				dismissCountDown: 0
			}
		},
		methods: {
			countDownChanged (dismissCountDown) {
				this.dismissCountDown = dismissCountDown;
			},
			showAlert () {
				this.dismissCountDown = this.dismissSecs;
			}
		}
	};
</script>