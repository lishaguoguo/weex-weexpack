<template>
	<div class = 'top-count'>
		<div class = 'count-cell' v-for = 'item, index in data' :key = 'index'>
			<text class = 'count'>{{item.count}}</text>
			<text class = 'title'>{{item.title}}</text>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			data: {
				required: true,
				type: Array
			}
		}
	}
</script>

<style lang = 'less' scoped>
	.fontPub(@size){
		color: #fff;
		text-align: center;
		font-size: @size;
	}

	.top-count{
		height: 200px;
		background-color: #3eba6c;
		flex-direction: row;
		align-items: center;
		border-bottom-style: solid;
		border-bottom-width: 1px;
		border-bottom-color: #dedede;
	}
	.count-cell{
		flex: 1;
	}
	.count{
		.fontPub(48px);
		font-weight: bold;
	}
	.title{
		.fontPub(30px);
		padding-top: 25px;
	}
</style>