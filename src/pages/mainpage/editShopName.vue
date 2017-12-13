<template>
	<div>
		<div class = 'edit-container'>
			<div class="input-wrapper">
				<input type = 'text' class = 'edit-input' @input='changeValue' :value = 'value' :autofocus="true"/>
				<div class="input-icon" @click="iconShow">
					<image class="deleteimg" :src="getImg('alldelete')" v-if="value"></image>
				</div>
			</div>
			<text class = 'edit-btn' @click = 'savePhone'>保存</text>
		</div>
	</div>
</template>

<script>
	import { saveEditData,getImgUrl, changeStorage, storageName ,showMge,showMessage} from '../../func'
	export default {
		data(){
			return {
				value: '',
				state: ''
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
				this.value = e.value
			},
			savePhone(){
                let reg=/^[^%&',;<>=?\s\/$\x22]+$/
				let regNum=/[^\d]/g
				this.value.length>16?this.state === '店铺负责人'?
				showMessage('50005'):this.state === '店铺名称' ?showMessage('50006'):'':reg.test(this.value)?regNum.test(this.value)?
                saveEditData(this.state === '店铺负责人' ? {
					contacts: this.value
				} : this.state === '店铺名称' ? {
					shopName: this.value
				} :''):this.state === '店铺负责人'?showMessage('50007'):showMessage('50008'):showMessage('50009') //存在非法字符，请重新输入
			}
		},
		mounted(){
            changeStorage('get', storageName.editListState)
				.then(e => this.state = e.data)
				.then(_ => changeStorage('get', storageName.editData))
				.then(e => this.value = this.state === '店铺负责人' ? e.data.contacts ? e.data.contacts : '' : e.data.shopName ? e.data.shopName : '')
		}
	}
</script>

<style lang = 'less'>
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