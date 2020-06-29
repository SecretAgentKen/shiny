<template>
	<nav class="panel">
		<p class="panel-heading">Ignore/Retain the following sites for cookies, cache, and storage</p>
		<div class="panel-block">
			<div class="buttons">
				<button class="button" @click.prevent="selectAll()">
					Select All
				</button>
				<button class="button" :disabled="!hasSelected" @click.prevent="removeOrigins()">
					Remove Selected
				</button>
			</div>
			{{validOrigin}}
		</div>
		<div class="panel-block">
			<div class="field is-grouped is-expanded">
				<div class="control is-expanded">
					<input class="input" type="text" placeholder="https://example.com" v-model="inputOrigin" @keyup.enter="addOrigin()">
				</div>
				<div class="control">
					<button class="button is-primary" :disabled="!canAdd" @click="addOrigin()">Add URL</button>
				</div>
			</div>
		</div>
		<label class="panel-block" v-for="obj in originObjects">
			<input type="checkbox" v-model="obj.selected">{{obj.origin}}
		</label>
	</nav>
</template>

<script>
export default {
	data(){
		return {
			originObjects: [],
			inputOrigin: ''
		}
	},
	mounted(){
		this.loadOrigins();
	},
	computed:{
		hasSelected(){
			return !!this.originObjects.find((obj)=>{
				return obj.selected;
			});
		},
		canAdd(){
			if ( !this.inputOrigin ) return false;
			try {
				return !!new URL(this.inputOrigin).origin;
			} catch(e){
				return false;
			}
		},
		validOrigin(){
			try {
				return new URL(this.inputOrigin).origin;
			} catch(e){
				return '';
			}
		}
	},
	methods: {
		selectAll(){
			let setting = null;
			this.originObjects.forEach((obj)=>{
				if ( setting === null ) {
					setting = !obj.selected;
				}
				obj.selected = setting;
			});
		},
		addOrigin(){
			if ( this.canAdd ) {
				let data = JSON.parse(localStorage['excludes']);
  				let origin = this.validOrigin;
  				if ( data.excludes.indexOf(origin) < 0 ) {
    				data.excludes.push(origin);
					data.excludes.sort();
					localStorage['excludes'] = JSON.stringify(data);
				}
				this.inputOrigin = '';
				this.loadOrigins();
			}
		},
		loadOrigins(){
			this.originObjects = JSON.parse(localStorage['excludes']).excludes.map((origin)=>{
				return {origin, selected: false};	
			});
		},
		removeOrigins(){
			let data = {excludes:[]};
			data.excludes = this.originObjects.filter((obj)=>{ return !obj.selected }).map((obj)=>{return obj.origin});
			data.excludes.sort();
			localStorage['excludes'] = JSON.stringify(data);
			this.loadOrigins();
		}
	}
}
</script>

<style lang="scss">
	nav {
		margin: 2rem;
	}
	.field {
		flex-grow: 1;
	}
</style>
