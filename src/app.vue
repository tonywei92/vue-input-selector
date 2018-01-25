<!-- app.vue  -->
<template>
	<div>
		<input-selector
			ref='customer'
	        :items="customItems"
	        :disabled="inputSelectorConfig.disabled"
	        :disabledMessage="inputSelectorConfig.disabledMessage"
	        :inputError="inputSelectorConfig.inputError"
	        :errorMessage="inputSelectorConfig.errorMessage"
	        :title="inputSelectorConfig.title"
	        :busy="inputSelectorConfig.busy"
	        @select="onStudentSelect">
		></input-selector>
		
		<p>
			name: {{ selectedItem.name }}, value: {{ selectedItem.value }}
		</p>

	</div>
</template>

<script>
	export default {
		data(){
			return {
				selectedItem: {},
				inputSelectorConfig :{
					title : "Students",
					disabled : false,
					disabledMessage : "Disabled, try again later",
					inputError : false,
					errorMessage : "Well, something goes wrong",
					busy :false
				},
				customItems:
				[{
				  "value": 1,
				  "name": "Delcina"
				 },
				  {
				  "value": 2,
				  "name": "Philippa"
				 },
				 {
				  "value": 3,
				  "name": "Pamela"
				 },
				 {
				  "value": 4,
				  "name": "Darla"
				 },
				 {
				  "value": 5,
				  "name": "Raymund"
				 }]
				}
		},
		methods:{
			onStudentSelect(item){
				this.selectedItem = item;
				this.inputSelectorConfig.inputError = false;
			}
		}	
	}
</script>