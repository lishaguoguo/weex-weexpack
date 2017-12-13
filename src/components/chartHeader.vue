<template>
	<div class = 'header'>
		<div class = 'topText'>
			<text class = 'textNum'>{{count ? count: 0}}</text>
			<text class = 'textItem'>总交易总额（元）</text>
		</div>
		<div class = "topText">
			<text class = 'textNum'>{{`${num ? num : 0}  笔`}}</text>
			<text class = 'textItem'>总交易笔数（笔）</text>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			num: String,
			count: String
		}
	}
</script>

<style lang = 'less'>
	@color: #3eba6c;
	.textPub(@size){
		text-align: center;
		color: #fff;
		font-size: @size;
	}

	.header{
		background-color: @color;
		height: 200px;
		flex-direction: row;
		align-items: center;
	}
	.topText{
		flex: 1;
	}
	.textNum{
		.textPub(48px);
		font-weight: bold;
	}
	.textItem{
		.textPub(30px);
		padding-top: 25px;
	}
</style>