<template>
	<div class="adver-wapper">
		<image class="adver" :src="getImg(m.img[0].href)" v-if="m.type == '0'"></image>

		<div class = 'message-wrapper' v-if="m.type == '1'">
			<div class = 'message-main'>
				<div class = 'message-mes'>
					<div class = 'mess-main'>
						<text class = 'mess-msg'>{{m.title}}</text>
						<text class = 'mess-state'>{{m.description}}</text>
					</div>
				</div>
			</div>
		</div>

		<slider class="slider" interval="3000" auto-play="true" v-if="m.type == '2'">
			<div class="frame" v-for="val, key in m.img" :key="key">
				<div @click="navigatorTo(val.url)">
					<image class="adver" resize="cover" :src="val.href"></image>
				</div>
			</div>
			<indicator class='indicator'></indicator>
		</slider>

	</div>
</template>


<script>
	export default {
		props: {
			m: Object
		}
	}
</script>

<style lang = 'less'>
	@fontSize: 24px;
	.padding(@top, @right, @bottom, @left){
		padding-top: @top;
		padding-right: @right;
		padding-bottom: @bottom;
		padding-left: @left;
	}
	.textStyle(@color: #888, @fontSize: @fontSize){
		color: @color;
		font-size: @fontSize;
	}

	.message-marg{
		height: 21px;
	}
	@height: 69px;
	.message-main{
		background-color: #fff;	
	}	
	.message-mes{
		.padding(32px, 25px, 32px, 25px);
		flex: 1;
	}
	@subHeight: 55px;
	.mess-title{
		height: @subHeight;
		flex-direction: row;
	}
	.mess-logo{
		width: @subHeight;
		height: @subHeight;
		border-radius: 3.5px;
		background-color: #ccc;
	}
	.mess-title-text{
		flex: 1;
		padding-left: 15px;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
	.mess-source{
		.textStyle(#666);
	}
	.mess-time{
		.textStyle;
	}

	.mess-main{
		/*49/68*/
		.padding(30px, 0, 0, 68px);
	}
	.mess-msg{
		.textStyle(#000, 40px);
		padding-bottom: 5px !important;
	}
	.mess-state{
		.textStyle(#333);
	}
	.mess-remark{
		.textStyle;
	}

	.mess-btn{
		height: @height;
		background-color: #f9f9f9;
		outline: none;
		text-align: center;
		font-size: @fontSize;
		color: #909090;
		line-height: @height;
	}



	.adver-wapper{
		margin-bottom:15px;
	}
	.adver,.slider,.frame{
		width:750px;
		height:280px;
	}
	.slider{
		margin-bottom:15px;
		position: relative;
	}
	.indicator{
		position:absolute;
		bottom:5px;
		width:700px;
		height:100px;
		item-color: #cfcfcf;
		item-selected-color: #fff;
		item-size: 15px;
	}
</style>