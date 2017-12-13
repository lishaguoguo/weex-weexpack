<template>
	<div class = 'header-wrapper'>
		<div class = 'header-icon' @click = 'backTo'>
			<text 
		    :style="{
		        fontFamily:'iconfont',
		        color: '#fff',
		        fontSize:'45px'
		    }"
		    >{{icon}}</text>
		</div>		
		<text class = 'header-title'>
			<slot></slot>
		</text>
		<div class= 'header-icon' @click = 'navigatorTo'>
			<text 
			class = 'h-more'
			v-if = 'more === "filter"'
			>筛选</text>
			<text 
		    :style="{
		        fontFamily:'iconfont',
		        color: '#fff',
		        fontSize:'45px',
		        textAlign: 'right'
		    }"
		    v-if = 'more !== "filter"'
		    >{{decodeIcon(more)}}</text>
		</div>
	</div>
</template>

<script>
	import { decode, changePage, backPage } from '../func'
	export default {
		data(){
			return {
				icon: decode('&#xe611;')
			}
		},
		props: {
			more: {
				type: String,
				default: ''
			}
		},
		methods: {
			backTo(){
				backPage()
			},
			navigatorTo(){
				this.$emit('navigatorTo')
			},
			decodeIcon(iconStr){
				return decode(iconStr)
			}
		}
	}
</script>

<style lang = 'less'>
	.header-wrapper{
		height: 88px;
		background-color: #3eba6c;
		flex-direction: row;
		align-items: center;
		padding-left: 25px;
		padding-right: 25px;
	}
	.header-icon{
		width: 70px;
	}
	.header-title{
		flex: 1;
		text-align: center;
		color: #fff;
		font-size: 38px;
	}
	.h-more{
		color: #fff;
		text-align: right;
		font-size: 30px;
	}
</style>