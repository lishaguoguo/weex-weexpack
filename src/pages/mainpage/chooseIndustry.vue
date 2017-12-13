<template>
	<div>
		<div class = 'industry-container'>
			<div class = 'industry-top'>
				<text :class = "[
					'top-sub',
					first ? 'top-active' : ''
				]">一级分类</text>
				<text :class = "[
					'top-sub',
					!first ? 'top-active' : ''
				]">二级分类</text>
			</div>
			<list class = 'industry-content' v-if = 'first'>
				<cell class = 'cell-container' v-for = 'item, index in dataList' :key = 'index' @click = 'saveNum(index, item)'>
					<div class = 'industry-cell' :style = "{ borderTopWidth: (index === 0 ? 0 : 1) + 'px' }">
						<text class = 'cell-title'>{{item.name}}</text>
						<text 
					    :style="{
					        fontFamily:'iconfont',
					        color: '#9e9e9e',
					        fontSize:'30px'
					    }"
					    >{{icon}}</text>
					</div>
				</cell>
			</list>

			<list class = 'industry-content' v-if = '!first'>
				<cell class = 'cell-container' v-for = 'item, index in dataList[index].childList' :key = 'index' @click = 'saveEditData(item)'>
					<div class = 'industry-cell' :style = "{ borderTopWidth: (index === 0 ? 0 : 1) + 'px' }">
						<text class = 'cell-title'>{{item.name}}</text>
					</div>
				</cell>
			</list>
		</div>
	</div>
</template>

<script>
	import { decode, changeStorage, fetchIndustry, saveEditData ,showMge} from '../../func'
	export default {
		data(){
			return {
				icon: decode('&#xe680;'),
				dataList: [],
				first: true,
				depthFirNum: '',
				depthFirName: '',
				index: 0
			}
		},
		mounted(){
			fetchIndustry()
				.then(data => this.dataList = data.data)
		},
		methods: {
			saveNum(index, item){
				this.depthFirNum = item.code
				this.depthFirName = item.name
				this.index = index
				this.first = !this.first
			},
			saveEditData(item){
				saveEditData({
					spIndustryName: `${this.depthFirName}-${item.name}`,
					spIndustryCode: item.code
				})
			}
		}
	}
</script>

<style lang = 'less' scoped>
	.fontPub{
		font-size: 32px;
		color: #646464;
	}
	.borderPub(@color, @bottom, @top: 0px){
		border-color: @color;
		border-style: solid;
		border-bottom-width: @bottom;
		border-top-width: @top;
	}
	.flexPub{
		flex-direction: row;
		align-items: center;
	}


	.industry-container{
		flex: 1;
		background-color: #eee;
	}
	.industry-top{
		.flexPub;
		height: 90px;
		background-color: #fff;
	}
	.top-sub{
		.fontPub;
		.borderPub(#fff, 9px);
		height: 90px;
		text-align: center;
		line-height: 81px;
		flex: 1;
	}
	.top-active{
		border-color: #3eba6c;
	}
	.industry-content{
		flex: 1;
		padding-top: 20px;
	}
	.cell-container{
		padding-left: 36px;
		background-color: #fff;
	}
	.cell-container:active{
		background-color: #cdcdcd;
	}
	.industry-cell{
		.flexPub;
		.borderPub(#c9c9c9, 0px, 1px);
		padding-right: 36px;
		padding-left: 20px;
		height: 110px;
	}
	.cell-title{
		.fontPub;
		flex: 1;
	}
</style>