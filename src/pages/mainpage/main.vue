<template>
	<scroller class = 'content-wrapper' :show-scrollbar = 'false'>
		<refresh class = 'refresh' :display="refreshing ? 'show' : 'hide'" @refresh = 'onrefresh'>
			<loading-indicator style="height: 60px; width: 60px;color:#3eba6e;"></loading-indicator>
		</refresh>
		<FuncList></FuncList>
		<div class = 'content-main'>



			<div class="adver-wapper" v-for="v,k in advList" :key="k">
				<div @click="advLink(v[0])" v-if="v[0].type == '0'">
					<image class="adver" :src="v[0].url"></image>
				</div>

				<div class="advText" @click="advLink(v[0])" v-if="v[0].type=='1'">
					<div class="advContent">
						<text class = 'title'>{{v[0].title}}</text>
						<text class = 'description'>{{v[0].description}}</text>
					</div>
					<image class="advtextImg" :src="v[0].url" ></image>
				</div>


				<slider class="slider" interval="3000" auto-play="true" v-if="v[0].type == '2'">
					<div class="frame" v-for="val, key in v" :key="key">
						<div @click="advLink(val)">
							<image class="adver" resize="cover" :src="val.url"></image>
						</div>
					</div>
					<indicator class='indicator'></indicator>
				</slider>

			</div>

		</div>
	</scroller>
</template>

<script>
	import Message from '../../components/message.vue'
	import FuncList from '../../components/homeFunList.vue'
	import {getImgUrl,changePage,changeStorage,storageName, getAdvlist, advClick, showMge} from '../../func/index'
	export default {
		data(){
			return {
				loading: false,
				refreshing: false,
				advList: []
//                imageList: [
//                    { src: 'http://pic65.nipic.com/file/20150429/20318013_105209450000_2.jpg',url:'http://weex.apache.org/cn/'},
//                    { src: 'http://p1.so.qhmsg.com/t0191127bf13fe0ed16.jpg',url:'https://hao.360.cn/'},
//                    { src: 'http://d10.yihaodianimg.com/N09/M08/CF/35/ChEi2VdbjLeAEELsAAJM9E6dzhw94800.jpg',url:'https://www.baidu.com/'}
//                ],
////				messageList: [
////					{
////						title: '赞赞',
////						time: '2017/6/12 10:12',
////						msg: '¥30.00',
////						state: '付款成功',
////						remark: '一卡通充值',
////						type: 'message'
////					},{
////						title: '赞赞',
////						time: '2017/6/12 10:12',
////						msg: '你有新的动态',
////						state: '线下支付',
////						type: 'message'
////					},{
////						type: 'image',
////						src: 'https://img.alicdn.com/tps/TB1z.55OFXXXXcLXXXXXXXXXXXX-560-560.jpg'
////					},{
////						title: '赞赞',
////						time: '2017/6/12 10:12',
////						msg: '你有新的动态',
////						state: '线下支付',
////						type: 'message'
////					},{
////						title: '赞赞',
////						time: '2017/6/12 10:12',
////						msg: '你有新的动态',
////						state: '线下支付',
////						type: 'message'
////					},{
////						title: '赞赞',
////						time: '2017/6/12 10:12',
////						msg: '你有新的动态',
////						state: '线下支付',
////						type: 'message'
////					},{
////						title: '赞赞',
////						time: '2017/6/12 10:12',
////						msg: '你有新的动态',
////						state: '线下支付',
////						type: 'message'
////					}
////
//				advertising:[
//					{
//					    url:'advertising1'
//					},
//					{
//                        url:'advertising2'
//					}
//				]
			}
		},
		mounted(){
		  	getAdvlist({}).then(data => {
                this.advList = data.data
			})
		},
		methods: {
		    getImg(path){
		      return getImgUrl(path)
			},
            navigatorTo(url){
                changeStorage('set', storageName.adverUrl, url)
					.then(_=>changePage('adverInfor.js')('赞赞优惠'))
			},
			onrefresh (e) {
		        this.refreshing = true
		        setTimeout(() => {
		          	this.refreshing = false
		        }, 2000)
		    },
			advLink(o){
                advClick(o.id).then(_ => this.navigatorTo(o.href))
			}
		},
		components: {
			FuncList,
			Message
		}
	}
</script>

<style lang = 'less'>
	.content-wrapper{
		flex: 1;
	}
	.refresh{
		height: 120px;
		width: 750px;
		display: flex;
		align-items: center;
	}
	.loading-text{
		height: 100px;
		font-size: 32px;
	}
	.content-main{
		background-color: #f6f6f6;
		padding-top: 15px;
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
		bottom: 5px;
		width:700px;
		height:100px;
		item-color: #cfcfcf;
		item-selected-color: #fff;
		item-size: 15px;
	}


	.advText{
		display: flex;
		flex-direction: row;
		padding-left: 40px;
		padding-right: 40px;
		align-items: center;
		justify-content: space-between;
		width: 750px;
		height: 280px;
		background-color: #ffffff;
		border-bottom-width: 1px;
		border-bottom-color: #dedede;
		border-top-width: 1px;
		border-top-color: #dedede;
	}
	.advContent{
		flex: 1;
		padding-right: 38px;
	}
	.title{
		font-size: 38px;
		color: #333;
		padding-bottom: 25px;
	}
	.description{
		font-size: 25px;
		line-height: 35px;
		color: #777;
	}
	.advtextImg{
		width: 224px;
		height: 170px;
	}
</style>