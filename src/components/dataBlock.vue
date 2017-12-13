<template>
	<div class = 'blockWrapper'>
		<!--<div>-->
			<image :src="url" class = 'blockContent' :style = "{height: imgHeight}"></image>
			<text class = 'blockText'>{{text}}</text>
		<!--</div>-->
	</div>
</template>

<script>
	import { getImgUrl } from '../func'
	export default {
		data(){
			return {
				url: getImgUrl(this.src)
			}
		},
		props: {
			text: {
				default: '暂无数据',
				type: String
			},
			src: {
				default: 'kong2x'
			},
			imgHeight: {
				default: '128px'
			}
		}
	}
</script>

<style lang = 'less'>
	.blockWrapper{
		width: 750px;
		padding-top: 128px;
	}
	.blockContent{
		width: 750px;
	}
	.blockText{
		width: 750px;
		text-align: center;
		color: #666;
		font-size: 30px;
		padding-top: 25px;
	}
</style>