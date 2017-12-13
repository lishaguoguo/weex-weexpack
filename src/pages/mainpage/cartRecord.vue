<template>
    <div class="cart-box">
        <zz-scroller v-if='!nulldata' class="scroller-list" ref="list" @refresh="onRefresh" @loading="onLoading"
                     :isOnepage="isOnepage" :style="{'margin-bottom':isDelete?'120px':'20px'}">
            <zz-cartlist :lists="lists" :isAllselect="isAllselect" @inverseSelect="inverseSelect"
                         :isDelete="isDelete" :isUsed="isUsed" :isShare='isShare' :clickApply='clickApply' @applyOnline="applyOnline"></zz-cartlist>
        </zz-scroller>
        <zz-button
                class="btn-submit"
                type="primary"
                size="96px"
                v-if="btnShow"
                :value="btnValue"
                :disabled="isDisabled"
                @_click="btnSubmit"></zz-button>
        <zz-actionsheet
                :items="['确定']"
                :show="showBar"
                :title="deletTitle"
                @close="closeActionsheet"
                @itemClick="actionsheetItemClick"
                @btnClick="actionsheetBtnClick"
                ref="actionsheet"
        ></zz-actionsheet>
        <div class="nulldata" v-if='nulldata'>
            <dataBlock></dataBlock>
        </div>
        <zz-dialog @btnClick="onDialogApplyback" :show="showApply" tipcont="申请成功" buttons="我知道了">
        </zz-dialog>
        <zz-navbar :title="navtitle" :previcon="previcon" :iconType="iconType"
                   :iconCont="iconCont" @navHandle="navHandle"
                   @prevback="prevback"></zz-navbar>
    </div>
</template>

<script>
    import he from 'he'
    import mixin from '../../func/mixins'
    import {
        fetchShopCart,
        fetchDeleteUsedCart,
        fetchDeleteCart,
        fetchUsedCart,
        fetchApplyCartLine,
        changeStorage,
        storageName,
        stringDate,
        getImgUrl,
        saveValue,
        getValue,
        showMessage,showMge,startLoading,endLoading
    } from '../../func/index'
    import zzNavbar from '../../components/zz-navbar.vue'
    import zzButton from '../../components/zz-button.vue';
    import zzCartlist from '../../components/zz-cartlist.vue';
    import zzActionsheet from '../../components/zz-actionsheet.vue'
    import zzScroller from '../../components/zz-scroller.vue'
    import zzDialog from '../../components/zz-dialog.vue'
    import dataBlock from '../../components/dataBlock.vue'
    const rowsNum = 10;
    export default {
        components: {
            zzNavbar,
            zzButton,
            zzCartlist,
            zzActionsheet,
            zzScroller,
            zzDialog,
            dataBlock
        },
        data(){
            return {
                currentPage: 1,
                totalPage: '',
                lists: [],
                isDelete: false,
                isAllselect: false,
                previcon: '',
                selectArr: [],
                showBar: false,
                isUsed: false,
                spShopId: '',
                couponType: '',
                couponStatus: '',
                navtitle: '',
                showDialog: false,
                showApply: false,
                successicon: he.decode('&#xe623'),
                nulldata: false,
                isAdds: true,
                isOnepage: false,
                iconType: 1,
                applyItem:'',       //暂时保存申请上线的卡券
                isShare:false,     //是否需要分享按钮
                clickApply:false     //是否需要点击上线下线卡券功能
            }
        },
        computed: {
            iconCont(){
                if(this.iconType===1){
                    return '说明'
                }else {
                    if (this.isAdds) {
                        if (!this.isDelete) {
                            return '删除'
                        } else {
                            if (this.isAllselect) {
                                return '全不选'
                            } else {
                                return '全选'
                            }
                        }
                    }
                }
            },
            description(){
                return 'shuoming'
            }
        },
        mounted(){
            startLoading();
            changeStorage('get', storageName.isDeleteCart, '')
                .then(res => this.isAdds = res.data)
                changeStorage('get', storageName.navigatorCartType, '')
                .then(param => {
                    this.couponType = param.data.couponType;
                    this.couponStatus = param.data.couponStatus;
                })
                .then(() => this.navTitle())
                  .then(_=>getValue('myShopId'))
                .then(res => this.spShopId = res.value)
                .then(_=>this.fetchListData(true))
        },
        methods: {
            getImg(path){
              return getImgUrl(path)
            },
            applyOnline(item){
                this.applyItem=item;
                let cartId = {
                    id: item.id
                };
                fetchApplyCartLine(cartId)
                    .then(res => {
                        endLoading()
                        if (res.code === '200') {
                            this.showApply = true;
                        } else {
                            showMessage(res.code)
                        }
                    });
            },
            onDialogApplyback(){
                this.showApply = false;
                this.colorStyle(this.applyItem, '审核中', '#ee4542', '#f5f5f5', '#ddd', '#3eba6c', '#ccc', true);
            },
            onDialogCallback(){
                this.showDialog = false;
            },
            navTitle(){
                let self = this;
                if (self.couponType) {
                    switch (self.couponType) {
                        case 1:
                            self.navtitle = '店铺优惠券';
                            self.iconType = 1;
                            self.isShare=true;
                            break;
                        case 2:
                            self.navtitle = '店铺红包';
                            self.iconType = 1;
                            self.isShare=true;
                            break;
                    }
                } else {
                    switch (self.couponStatus) {
                        case 1:
                        case 6:
                        case '1,6':
                            self.navtitle = '未上线卡券';
                            self.clickApply=true;
                            self.iconType = 2;
                            break;
                        case 2:
                        case 3:
                        case '2,3':
                            self.navtitle = '已上线卡券';
                            self.iconType = 0;
                            break;
                        case 4:
                            self.navtitle = '已使用卡券';
                            self.iconType = 0;
                            break;
                        case 5:
                            self.navtitle = '历史卡券';
                            self.iconType = 2;
                            break;
                    }
                }
            },
            cartStatus(item){
                item.startDate = stringDate(item.startDate);
                item.deadline = stringDate(item.deadline);
                if (item.serviceTime) {
                    item.serviceTime = stringDate(item.serviceTime);
                    this.colorStyle(item, '已使用', '#ccc', '#f5f5f5', '#ddd', '#ddd', '#ccc');
                } else {
                    switch (item.couponStatus) {
                        case '1':
                            this.colorStyle(item, '申请上线', '#ee4542', '#f5f5f5', '#ddd', '#3eba6c', '#ccc', false);
                            break;
                        case '2':
                            this.colorStyle(item, '未开始', '#ee4542', '#cfcfcf', '#fff', '#fff', '');
                            break;
                        case '3':
                            this.colorStyle(item, '已开始', '#ee4542', '#cfcfcf', '#fff', '#fff', '');
                            break;
                        case '5':
                            this.colorStyle(item, '已过期', '#ccc', '#f5f5f5', '#ddd', '#ddd', '#ccc');
                            break;
                        case '6':
                            this.colorStyle(item, '审核中', '#ee4542', '#f5f5f5', '#ddd', '#3eba6c', '#ccc', true);
                            break;
                    }
                }
            },
            colorStyle(item, type, moneyc, backc, itemc, statusc, decc, itemdisa = true){
                item.couponStatus = type;
                Vue.set(item, 'moneycolor', moneyc);
                Vue.set(item, 'cartbackcolor', backc);
                Vue.set(item, 'timecolor', itemc);
                Vue.set(item, 'statuscolor', statusc);
                Vue.set(item, 'deccolor', decc);
                Vue.set(item, 'itemdisabled', itemdisa);
            },
            fetchListData(isRefresh){
                let obj = {
                    spShopId: this.spShopId,
                    couponType: this.couponType,
                    couponStatus: this.couponStatus,
                    page: this.currentPage,
                    rows: rowsNum,
                };
                if (this.couponType === '') {
                    obj = {
                        spShopId: this.spShopId,
                        couponStatus: this.couponStatus,
                        page: this.currentPage,
                        rows: rowsNum,
                    };
                    if (this.couponStatus === 4) {
                        obj = {
                            spShopId: this.spShopId,
                            page: this.currentPage,
                            rows: rowsNum,
                        }
                    }
                }
                return this.couponStatus === 4 ? (
                    fetchUsedCart(obj)
                        .then(res=>{setTimeout(()=>{endLoading()},200);return res})
                        .then(res => this.fetchCartData(res,isRefresh))
                    ) : (
                    fetchShopCart(obj)
                        .then(res=>{setTimeout(()=>{endLoading()},200);return res})
                        .then(res => this.fetchCartData(res,isRefresh))
                )
            },
            fetchCartData(res,isRefresh){
                if (res.code === '200') {
                    this.couponStatus === 4 ? this.isUsed = true : '';
                    this.totalPage = res.data.pages;
                    isRefresh ? this.lists = res.data.list : this.lists = this.lists.concat(res.data.list);
                    this.lists.forEach(item => {
                        Vue.set(item, 'selectDelete', false);
                        this.cartStatus(item);
                    })
                } else if (res.code === '60012') {
                    isRefresh?(this.nulldata = true,this.lists=[]):this.$refs.list.$emit('reomveloading', true)
                } else {
                    showMessage(res.code)
                }
            },
            onRefresh(){
                this.currentPage = 1;
                this.fetchListData(true)
                    .then(() => {
                        this.$refs.list.$emit('refreshDone');
                        this.$refs.list.$emit('reomveloading', false)
                    });
            },
            onLoading(){
                this.currentPage++;
                    this.fetchListData(false)
                        .then(_ => {
                            this.$refs.list.$emit('loadingDone');
                        });
            },
            actionsheetItemClick(){
                let ids = '';
                this.selectArr.forEach(item => {
                    ids += `${item.id},`;
                });
                this.couponStatus === 4 ? (fetchDeleteUsedCart({ids:ids}).then(res=>this.deleteCartData(res))) : (fetchDeleteCart({id:ids}).then(res=>this.deleteCartData(res)))
                this.showBar = false;
            },
            deleteCartData(res){
                if (res.code === '200') {
                    this.onRefresh();
                    this.selectArr = [];
                } else {
                    showMessage(res.code)
                }
            }
        },
        mixins: [mixin]
    }
</script>

<style lang="less" scoped>
    .cart-box {
        background-color: #dedede;
    }

    .scroller-list {
        margin-top: 88px;
        flex:1;
        flex-direction: column;
    }

    .btn-submit {
        position: fixed;
        bottom: 0;
        left: -12px;
        right: -12px;
    }

    .dialog-success {
        margin-bottom: 35px;
        font-family: iconfont1;
        font-size: 120px;
        color: #3eba6c;
    }
.dialog-text{
    font-size:28px;
    color:#666;
}
    .dialog-texts {
        font-size: 33px;
        text-align: center;
        color: #3eba6c;
    }
    .nulldata{
        flex:1;
        justify-content: center;
        align-items: center;
    }
    .dialog-chenggong{
        width:136px;
        height:136px;
        margin-bottom: 35px;
    }
</style>