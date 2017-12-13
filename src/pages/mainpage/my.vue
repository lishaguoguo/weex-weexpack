<template>
    <div @viewappear="enterView">
        <div class='user-message'>
            <div class="user-bg"><image class="user-bgimg" :src="getImgUrl('beijing')"></image></div>
            <div class='user-avator' @click="shopType === '1'?changePageTo('', '个人资料'):''">
                <image class='user-avator' :style="{
							width: '114px',
							height: '114px'
						}" :src="userInfo.headImg"></image>
            </div>
            <div class='user-main' @click="shopType === '1'?changePageTo('', '个人资料'):''">
                <text class='user-id'>{{shopType === '3' ? '收银员: ' + userInfo.merchantName : userInfo.merchantName}}</text>
                <div class='user-shop'>
                    <text class='user-shop-name' v-if = 'shopType !== "2"'>{{userInfo.shopName}}</text>
                </div>
            </div>
            <div class="next-wrapper" v-if="shopId?true:false">
                <text v-if="shopType === '1'" @click="changePageTo('switchShop.js', '切换店铺')" class="switchshop">切换店铺</text>
            </div>
        </div>
        <div class='user-money' v-if='shopType !== "3"'>
            <div class='money-show' :style="shopType === '2'? {flexDirection: 'row'} : {flexDirection: 'column'}">
                <text class='mon-tit' v-if="shopType==='2'">店铺余额</text>
                <text class='mon-num'>￥{{userInfo.shopBalance ? userInfo.shopBalance : 0.00}}</text>
                <text class='mon-tit' v-if="shopType!=='2'">店铺余额</text>
            </div>
            <div class='money-func' v-if="!(shopType === '2')">
                <div class='func-item' v-for='item, index in funcList' :key='index'
                     @click='loading ? "" : navigatorTo(item.path, item.text)'>
                    <image class='my-icon' :src="getImgUrl(item.icon)"></image>
                    <text class='func-text'>{{item.text}}</text>
                </div>
            </div>
        </div>
        <scroller class='user-content' :show-scrollbar='false'>
            <div class='my-sep'></div>
            <appList v-for='item, index in listItem' :list="item" :shopId="shopId" :shopType="shopType"
                     :key='index'></appList>
        </scroller>
        <myAnimComp :items='shopList.map(val => val.shopName)' :show='isVisible' @itemClick='check'
                    @btnClick='isVisible = false' @close='isVisible = false'></myAnimComp>
    </div>
</template>

<script>
    const animation = weex.requireModule('animation')
    import appList from '../../components/myList.vue'
    import myAnimComp from '../../components/myAnimComp.vue'
    import zzScroller from '../../components/zz-scroller.vue'
    import {
        decode,
        changePage,
        getImgUrl,
        fetchUserPageInfo,
        fetchRemoteImg,
        showMge,
        showMessage,
        fetchShopList,
        changeStorage,
        storageName,
        cashQualification,
        fetchPermission,
        getVal,
        saveValue,
        getValue,
        startLoading,endLoading
    } from '../../func'
    export default {
        data(){
            return {
                userInfo: {
                    merchantName: '',
                    shopName: '',
                    headImg: '',
                    shopBalance:''
                },
                headPrevImg: '',
                icon: decode('&#xe680;'),
                listItem: [],
                isVisible: false,
                funcList: [],
                shopList: [],
                shopId: '',
                loading: false,
                shopType: '',
                apMPermission: {},
                isinitial:true
            }
        },
        components: {appList, myAnimComp, zzScroller},
        methods: {
            decodeIcon(icon){
                return decode(icon)
            },
            getImgUrl(path){
                return getImgUrl(path)
            },
            getRemoteImg(path){
                this.headPrevImg = path;
                fetchRemoteImg({key: path})
                    .then(res => this.userInfo.headImg = res.data)
            },
            navigatorTo(path, title){
                this.loading = true
                return this.shopId ? title === '提现' ? cashQualification({
                    spShopId: this.shopId
                })
                    .then(data => {
                        switch (data.code) {
                            case '200':
                                return changeStorage('set', storageName.beforeCashState, data.code)
                                    .then(_ => (this.loading = false,changePage(path)(title)))
                            case '60022':
                                this.loading = false
                                return changePage('cashdetail.js')('提现详情')
                            default:
                                this.loading = false
                                return showMessage(data.code)
                        }
                    }) : (_ => {
                    this.loading = false
                    return changePage(path)(title)
                }) : (_ => {
                    this.loading = false;
//                    showMge('请先添加店铺')
                    showMessage('40041') //请先添加店铺
                })()
            },
            changePageTo(path, title){
                changePage(path)(title)
            },
            saveShopName(name){
                return changeStorage('set', storageName.myShopName, name)
            },
            enterView(){
                this.isinitial?(this.initial(),this.shopType==='2'?this.showPemission():''):this.isinitial=true
            },
            initial(){
                getValue('myShopId')
                    .then(res => this.shopId = res.value)
                    .then(_ => this.shopId ? {id: this.shopId} : {})
                    .then(res => fetchUserPageInfo(res))
                    .then(data =>{
                        data.code === '200' ? (
                        this.headPrevImg === data.data.headImg ? '' : this.getRemoteImg(data.data.headImg),
                        this.userInfo.merchantName = data.data.merchantName,
                        this.userInfo.spShopId = data.data.spShopId,
                        this.userInfo.shopName =this.cutString(data.data.shopName),
                        this.userInfo.shopBalance = String((parseFloat(data.data.shopBalance)*100/100).toFixed(2)).replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,'),
                        this.shopId = data.data.spShopId
                    ) : showMessage(data.code)})
                    .then(_ =>this.saveShopName(this.userInfo.shopName))
                    .then(_=>saveValue('myShopId')(this.userInfo.spShopId))
                    .then(_ =>changeStorage('set', storageName.cashCardState, ''))
            },
            cutString(str){
                return str.length > 7 ? str.substring(0, 7)+'...' : str
            },
            showPemission(){
                fetchPermission()
                    .then(res=>{
                        changeStorage('set', storageName.savePermission, res.data);
                        res.data.forEach(item=>{
                            item.permissionId==='1'?this.apMPermission=item:''
                        })})
                    .then(_ => this.apMPermission.isSelect === 1 ? this.listItem[0].splice(1,1) : this.listItem[0].length===1?this.listItem[0].push(
                        {
                            title: '申请充值',
                            icon: 'myicon08',
                            path: 'applyMoney.js'
                        }
                    ):'')
            }
        },
        created(){
            this.isinitial=false;
            this.initial()
            getVal()
                .then(e => ({data: {accountType: e.accountType}}))
                .then(e => e.data.accountType === '2' ? (
                    this.shopType = e.data.accountType,
                        this.listItem = [
                            [
                                {
                                    title: '卡包',
                                    icon: 'myicon01',
                                    path: 'cartBag.js'
                                }
                            ],
                            [
                                {
                                    title: '我的客服',
                                    icon: 'myicon05',
                                    path: ''
                                },
                                {
                                    title: '账号切换',
                                    icon: 'myicon06',
                                    path: ''
                                },
                                {
                                    title: '退出登录',
                                    icon: 'myicon07',
                                    path: ''
                                }
                            ]
                        ],
                        this.showPemission()
//                        changeStorage('get', storageName.savePermission)
//                            .then(res=>res.data.forEach(item=>{
//                                item.permissionId==='1'?this.apMPermission=item:''
//                            }))
//                            .then(_ => this.apMPermission.isSelect === 1 ? '' : this.listItem[0].push(
//                                {
//                                    title: '申请充值',
//                                    icon: 'myicon08',
//                                    path: 'applyMoney.js'
//                                }
//                            ))
                ) : e.data.accountType === '1' ? (
                    this.shopType = e.data.accountType,
                        this.funcList = [
                            {
                                icon: 'myfuncicon02',
                                text: '提现',
                                path: 'encashment.js'
                            }
                        ],
                        this.listItem = [
                            [
                                {
                                    title: '卡包',
                                    icon: 'myicon01',
                                    path: 'cartBag.js'
                                },
                                {
                                    title: '实名认证',
                                    icon: 'myicon02',
                                    path: ''
                                }
                            ],
                            [
                                {
                                    title: '银行卡',
                                    icon: 'myicon03',
                                    path: ''
                                },
                                {
                                    title: '提现记录',
                                    icon: 'myicon04',
                                    path: 'withdrawRecord.js'
                                },
                                {
                                    title: '申请充值',
                                    icon: 'myicon08',
                                    path: 'applyMoney.js'
                                }
                            ],
                            [
                                {
                                    title: '我的客服',
                                    icon: 'myicon05',
                                    path: ''
                                },
                                {
                                    title: '账号切换',
                                    icon: 'myicon06',
                                    path: ''
                                },
                                {
                                    title: '退出登录',
                                    icon: 'myicon07',
                                    path: ''
                                }
                            ]
                        ]
                ) : (
                    this.shopType = e.data.accountType,
                        this.listItem = [
                            [
                                {
                                    title: '卡包',
                                    icon: 'myicon01',
                                    path: 'cartBag.js'
                                }
                            ],
                            [
                                {
                                    title: '我的二维码',
                                    icon: 'myicon03',
                                    path: ''
                                },
                                {
                                    title: '我的客服',
                                    icon: 'myicon05',
                                    path: ''
                                },
                                {
                                    title: '账号切换',
                                    icon: 'myicon06',
                                    path: ''
                                },
                                {
                                    title: '退出登录',
                                    icon: 'myicon07',
                                    path: ''
                                }
                            ]
                        ]
                ))
        }
    }
</script>

<style lang='less' scoped>
    .bgColor(@color) {
        background-color: @color
    }

    .monText(@size, @color: #fc0404, @align: center) {
        color: @color;
        text-align: @align;
        font-size: @size;
    }

    .flexD {
        flex-direction: row;
        align-items: center;
    }

    .borderRight {
        border-right-style: solid;
        border-right-color: #ccc;
        border-right-width: 1px;
    }

    .user-content {
        /*padding-bottom:20px;*/
        .bgColor(#f6f6f6);
    }

    .user-message {
        height: 180px;
        .flexD;
        padding-left: 39px;
        position: relative;
    }
    .user-bg,.user-bgimg{
        position: absolute;
        top:0;
        left:0;
        bottom:0;
        right:-20px;
    }
    .next-wrapper {
        height: 120px;
        justify-content: center;
        align-items: center;
        margin-left: 40px;
        padding-right:36px;
    }

    .switchshop {
        color: #fff;
        font-size: 26px;
        padding-top: 10px;
        padding-bottom: 10px;
        padding-left: 10px;
        padding-right: 10px;
        border-width: 1px;
        border-color: #fff;
        border-style: solid;
        border-radius: 50px;
    }

    .user-avator {
        height: 114px;
        width: 114px;
        border-bottom-left-radius: 60px;
        border-bottom-right-radius: 60px;
        border-top-left-radius: 60px;
        border-top-right-radius: 60px;
        overflow:hidden;
    }

    .user-main {
        flex: 1;
        padding-left: 45px;
    }

    .user-next {
        width: 120px;
        padding-right: 35px;
        text-align: right;
    }

    .user-shop {
        padding-top: 10px;
        .flexD;
    }

    .user-id {
        .monText(28px, #fff, left);
    }

    .user-shop-name {
        .monText(28px, #fff, left);
    }

    .user-money {
        height: 116px;
        .bgColor(#fff);
        .flexD;
    }

    .money-show {
        flex: 1;
        justify-content: center;
        align-items: center;
        .borderRight;
    }

    .mon-num {
        .monText(40px);
        font-weight: bold;
        margin-left: 10px;
        margin-right: 10px;
    }

    .mon-tit {
        .monText(30px);
        margin-left: 10px;
        margin-right: 10px;
    }

    .money-func {
        flex: 1;
        .flexD;
        justify-content: center;
        height: 116px;
    }

    .func-item {
        .flexD;
        height: 116px;
    }

    .func-text {
        color: #333;
        font-size: 36px;
        padding-left: 16px;
    }

    .my-sep {
        height: 20px;
    }

    .my-icon {
        width: 46px;
        height: 40px;
    }
</style>