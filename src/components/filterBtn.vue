<template>
	<div 
	:class = "[
		'stateBtn',
		this.checked === false ? 'testBtnNormal' : 'testBtnAct'
	]"
	@click = 'changeToggle'>
		<text class = 'text'><slot></slot></text>
		<image :src = 'getImgUrl()' class = 'cornor' v-if = 'checked'></image>
	</div>
</template>

<script>
	import { getImgUrl } from '../func'
	export default {
		props: {
			checked: {
				required: true,
				default: false,
				type: Boolean
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
		width: 160px;
		height: 60px;
		margin-right: 26px;
	}
	.testBtnNormal{.backGround(#f0f0f0);}
	.testBtnAct{.backGround(#cdf0da);}
	.text{
		flex: 1;
		font-size: 21px;
		color: #000;
		text-align: center;
	}
	.cornor{
		width: 43px;
		height: 29px;
		position: absolute;
		bottom: 0;
		right: 0;
	}
</style>