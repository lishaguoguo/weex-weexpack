<template>
	<div 
	:class = "[
		'stateBtn',
		this.checked === false ? 'testBtnNormal' : 'testBtnAct'
	]"
	@click = 'changeToggle'>
		<div class = 'btn-main'>
			<image :src = "src" class = 'type-img'></image>
			<text class = 'text'>{{text}}</text>
		</div>
		<image :src = 'getImgUrl()' class = 'cornor' v-if = 'checked'></image>
	</div>
</template>

<script>
	import { getImgUrl } from '../func'
	export default {
		props: {
			src: String,
			text: String,
			checked: {
				type: Boolean,
				required: true,
				default: false
			}
		},
		methods: {
			changeToggle(){
				this.$emit('changeToggle')
			},
			getImgUrl(){
				return getImgUrl('cornor')
			}
		}
	}
	//btn 属性 changeToggle 函数 改变选中状态
</script>

<style lang = 'less'>
	.backGround(@color){
		background-color: @color;
	}

	.stateBtn{
		flex-direction: row;
		align-items: center;
		border-radius: 4px;
		position: relative;
		width: 200px;
		height: 76px;
		margin-right: 26px;
	}
	.testBtnNormal{.backGround(#f0f0f0);}
	.testBtnAct{.backGround(#cdf0da);}
	.btn-main{
		flex-direction: row;
		align-items: center;
		padding-left: 30px;
	}
	.text{
		padding-left: 25px;
		font-size: 24px;
		color: #000;
	}
	.type-img{
		width: 50px;
		height: 44px;
	}
	.cornor{
		width: 43px;
		height: 29px;
		position: absolute;
		bottom: 0;
		right: 0;
	}
</style>