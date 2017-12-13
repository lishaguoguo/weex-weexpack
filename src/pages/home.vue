<template>
	<div class = 'wrapper' @viewappear="enterView">
		<div class="content">
			<Container></Container>
		</div>
	</div>
</template>


<script>
	import Container from './mainpage/main.vue'
	import {showMge} from '../func/index'
	export default {
		components: {
			Container
		},
		mounted(){
			var domModule = weex.requireModule('dom')
			const src = '//at.alicdn.com/t/font_baezmq63jhpk3xr.ttf'
            const fontsrc='//at.alicdn.com/t/font_328579_dkofwh9c1f758kt9.ttf'

			domModule.addRule('fontFace', {
			    'fontFamily': "iconfont",
			    'src': `url('http:${src}')`
			})
			domModule.addRule('fontFace', {
			    'fontFamily': "iconfont1",
			    'src': `url('http:${fontsrc}')`
			})
		},
		methods:{
            enterView(){
//                showMge('触发首页了')
            }
		}
	}
	
</script>

<style lang = 'less'>
	.content{
		flex: 1;
		height: 100px;
		overflow-y: auto;
		overflow-x: hidden;
		background-color: #e7e7e7;
	}
	.trans{
		flex: 1;
		display: flex;
	}
	.fade-enter-active{
	  transition: transform .5s
	}
	.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
	  transform: translateX(100%);
	}
</style>