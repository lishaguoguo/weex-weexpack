<template>
        <!-- <sHeader>{{header}}</sHeader> -->
        <list class = 'shop-list-container'>
            <cell class = 'shop-cell' v-for="store,index in stores" :key="index" append="tree">
                <div class = 'shop-content' @click="permission(index,store.subUserId)">
                    <div class = 'mockImage'>
                        <image :style = "{
							width: '100px',
							height: '100px'
						}" :src="getImgUrl('headerimg')"></image>
                    </div>
                    <div class = 'shop-text'>
                        <text class = 'shop-name'>{{store.account}}</text>
                        <text class = 'shop-address'>{{shopName}}</text>
                    </div>
                    <div class = 'mockImage'>
                        <image :style = "{
							width: '60px',
							height: '60px'
						}" :src="getImgUrl('erweimaicon2')"></image>
                    </div>
                </div>
                <div class = 'shop-btn'>
                    <div class = 'btn-container' @click="editoperate(index,store.subUserId)">
                        <image
                                :style = "{
							width: '28px',
							height: '28px'
						}"
                                :src = 'getImgUrl("editicon")'></image>
                        <text class = 'btn-text'>编辑</text>
                    </div>
                    <div class = 'btn-container' @click="deloperate(index,store.subUserId)">
                        <image
                                :style = "{
							width: '28px',
							height: '31px'
						}"
                                :src = 'getImgUrl("deleteicon")'></image>
                        <text class = 'btn-text'>删除</text>
                    </div>
                </div>
                <div class = 'block'></div>
            </cell>
        </list>
</template>

<script>
 import {getImgUrl,fetchRemoteImg} from '../func/index'
export default {
        props: {
            stores: Array,
            shopName:''
        },
        methods: {
            permission(index, userId){
                this.$emit('_click', index, userId)
            },
            editoperate(index, userId){
                this.$emit('edit', index, userId)
            },
            deloperate(index, userId){
                this.$emit('del', index, userId)
            },
            getImgUrl(path){
                return getImgUrl(path)
            },
        }
    }
</script>

<style lang = 'less' scoped>
    .borderBot(@top){
        border-bottom-width: 1px;
        border-color: #dedede;
        border-style: solid;
        border-top-width: @top;
    }
    .blockPub(@height, @top: 0){
        .borderBot(@top);
        flex-direction: row;
        align-items: center;
        padding-left: 36px;
        padding-right: 36px;
        background-color: #fff;
        height: @height;
    }
    .fontPub(@size, @color){
        font-size: @size;
        color: @color;
    }

    .shop-list-container{
        flex: 1;
        background-color: #f6f6f6;
    }
    .block{
        height: 18px;
    }
    .shop-content{
        .blockPub(162px, 1px);
    }
    .shop-text{
        padding-left: 30px;
        flex: 1;
    }
    .shop-name{
        .fontPub(32px, #000);
    }
    .shop-address{
        .fontPub(28px, #3a3a3a);
        padding-top: 21px;
    }
    .shop-btn{
        .blockPub(72px);
        justify-content: flex-end;
    }
    .btn-container{
        padding-left: 50px;
        flex-direction: row;
        align-items: center;
    }
    .btn-text{
        .fontPub(28px, #000);
        padding-left: 10px;
    }

    .mockImage{
        width: 100px;
        height: 100px;
       align-items: center;
        justify-content: center;
    }
</style>