<template>
	<div>
		<div class = 'edit-container'>
			<div class="input-wrapper">
			<input type = 'tel' class = 'edit-input' @input = 'changeValue' :value = 'value' :autofocus="true"/>
				<div class="input-icon" @click="iconShow">
					<image class="deleteimg" :src="getImg('alldelete')" v-if="value"></image>
				</div>
			</div>
			<text class = 'edit-btn' @click = 'savePhone'>保存</text>
		</div>
	</div>
</template>

<script>
	import { saveEditData,getImgUrl, changeStorage, storageName,showMessage } from '../../func'

	export default {
		data(){
			return {
				value: ''
			}
		},
		methods: {
            getImg(path){
              return getImgUrl(path)
			},
            iconShow(){
              this.value=''
			},
			changeValue(e){
                this.value = e.value.replace(/\s+/g,"");
			},
			savePhone(){
//           (/^0\d{2,3}-?\d{7,8}$/).test(this.value)  验证座机号
				(/^1(3|4|5|7|8)\d{9}$/).test(this.value) ? saveEditData({
					phone: this.value
				}) : showMessage('60027')//请输入正确的手机号
			}
		},
		mounted(){
			changeStorage('get', storageName.editData)
				.then(e => this.value = e.data.phone)
		}
	}
</script>

<style lang = 'less' scoped>
	.fontPub(@size, @color){
		font-size: @size;
		color: @color;
	}

	.edit-container{
		flex: 1;
		background-color: #eee;
		padding-top: 40px;
		padding-left: 36px;
		padding-right: 36px;
		align-items: center;
	}
	.input-wrapper{
		height: 80px;
		flex-direction: row;
		align-items: center;
		border-radius: 5px;
		background-color: #fff;
		box-sizing: border-box;
		width: 678px;
	}
	.edit-input{
		flex:1;
		border-radius: 5px;
		background-color: #fff;
		padding-left: 12px;
		padding-right: 12px;
		box-sizing: border-box;
		height: 80px;
		line-height: 80px;
		.fontPub(28px, #000);
	}
	.edit-btn{
		.fontPub(36px, #fff);
		width: 654px;
		height: 92px;
		text-align: center;
		line-height: 92px;
		background-color: #3eba6c;
		border-radius: 6px;
		margin-top: 90px;
	}
	.input-icon{
		width:35px;
		height:35px;
		margin-right:20px;
		text-align: center;
		justify-content: center;
	}
	.deleteimg{
		width:28px;
		height:28px;
	}
</style>