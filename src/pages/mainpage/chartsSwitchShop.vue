<template>
    <div class="wrapper">
        <scroller class="cell-wrapper" show-scrollbar="false" v-if='!nulldata'>
            <div class="cell" v-for="item,index in shopList" :key="index" @click="changeSelected(item,index)">
                <div class="user-avator">
                    <image class="user-img" :src="item.headPortrait"></image>
                </div>
                <text class="cell-name">{{item.shopName}}</text>
                <div class="selected">
                    <image class='selected-icon' v-if="item.selected" :src="getImgUrl('xuanzhong')"></image>
                </div>
            </div>
        </scroller>
        <div class="nulldata" v-if='nulldata'>
            <dataBlock></dataBlock>
        </div>
        <zz-navbar title="切换店铺" @prevback="prevback"></zz-navbar>
    </div>
</template>

<script>
    import zzNavbar from '../../components/zz-navbar.vue'
    import {
        changePage,
        changeStorage,
        storageName,
        getImgUrl,
        fetchRemoteImg,
        fetchShopList,
        showMge,
        showMessage,
        saveValue,
        getValue,
        fetchUserPageInfo
    } from '../../func/index'
    import dataBlock from '../../components/dataBlock.vue'
    export default {
        data(){
            return {
                shopList: '',
                nulldata: false,
                selectedIndex: ''
            }
        },
        components: {
            dataBlock,
            zzNavbar
        },
        methods: {
            prevback(){
                changePage('back.js')()
            },
            getImgUrl(path){
                return getImgUrl(path)
            },
            getRemoteImg(path, item){
                return fetchRemoteImg({key: path})
                    .then(res => item.headPortrait = res.data)
                    .then(_=>saveValue('shopList')(this.shopList))
            },
            changeSelected(item,index){
                index!==this.selectedIndex?
                    (
                        item.selected = true,
                            this.shopList[this.selectedIndex].selected=false,
                                saveValue('shopList')(this.shopList)
                                  .then(_=>saveValue('chartsShopId')(item.id))
                                  .then(_=>changePage('charts.js')())
                    ):changePage('back.js')();
            }
        },
        mounted(){
            fetchShopList({
                lineState: 0
            })
                .then(data => data.code === '200' ? this.shopList = data.data
                    : data.code === '60012' ? this.nulldata = true : showMessage(data.code))
                .then(_ =>
                    this.shopList.forEach((item,index) => {
                        this.getRemoteImg(item.headPortrait, item)
                            .then(_=>getValue('chartsShopId'))
                            .then(res => {
                                Vue.set(item, 'selected', false);
                                return res
                            })
                            .then(res => {
                                item.id === res.value ? (item.selected = true,this.selectedIndex=index) : '';
                            })
                    })
                )
        }
    }
</script>

<style lang="less" scoped>
    .wrapper{
        background-color: #f6f6f6;
    }
    .cell-wrapper {
        margin-top: 106px;
        padding-left: 36px;
        padding-right: 36px;
    }

    .cell {
        flex-direction: row;
        align-items: center;
        height: 102px;
        border-bottom-style: solid;
        border-bottom-width: 1px;
        border-bottom-color: #dedede;
    }

    .user-avator {
        /*height: 42px;*/
        margin-right: 40px;
    }
    .user-img{
        width: 68px;
        height: 68px;
        border-radius: 74px;
    }
    .cell-name {
        flex: 10;
        font-size: 30px;
        color: #333;
    }
    .selected{
        margin-right:30px;
    }
    .selected,.selected-icon {
        width: 40px;
        height: 28px;
    }
    .nulldata{
        flex:1;
        justify-content: center;
        align-items: center;
    }
</style>