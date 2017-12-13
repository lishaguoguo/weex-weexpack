/**
 * Created by Administrator on 2017/7/24.
 */
const modal=weex.requireModule('modal');
const navigator=weex.requireModule('navigator');
import {changePage} from '../func/index'
export default {
    computed: {
        btnValue(){
            return this.selectArr.length>0?'删除（'+this.selectArr.length+'）':'删除';
        },
        btnShow(){
            return this.isDelete & !this.showBar
        },
        isDisabled(){
            let flag=false;
            for (let i = 0; i < this.lists.length; i++) {
                if (this.lists[i].selectDelete === true) {
                    flag = true;
                    break;
                }
            }
            return !flag;
        },
        deletTitle(){
            return '确定要删除'+this.selectArr.length+'张卡券？'
        }
    },
    methods: {
        allSelect(){
            for(let i=0;i<this.lists.length;i++){
                if (this.isAllselect) {
                    if(!this.lists[i].selectDelete){
                        this.selectArr.push(this.lists[i]);
                    }
                }else {
                    this.selectArr.pop()
                }
                this.lists[i].selectDelete=this.isAllselect;
            }
        },
        navHandle(id){
            if(id===2){
                if (this.isDelete) {
                    this.isAllselect = !this.isAllselect;
                    this.allSelect();
                }
                this.isDelete = true;
                this.previcon = '取消'
            }else if(id===1){
                // this.showDialog=true;
                this.couponStatus==='2,3'&&this.couponType===1?changePage('discountState.js')('使用说明'):''
                this.couponStatus==='2,3'&&this.couponType===2?changePage('redbagState.js')('使用说明'):''
            }
        },
        prevback(){
                if (this.isDelete) {
                    this.previcon = '';
                    // this.previcon = he.decode('&#xe611');
                    this.isDelete = false;
                    this.isAllselect = false;
                    this.allSelect();
                } else {
                    navigator.pop()
                }
        },
        inverseSelect(cart){
            cart.selectDelete=!cart.selectDelete;
            if(!cart.selectDelete){
                this.isAllselect=false;
                this.selectArr.pop()
            }else {
                this.selectArr.push(cart);
                if(this.selectArr.length===this.lists.length){
                    this.isAllselect=true;
                }
            }
        },
        btnSubmit(){
            this.showBar = true;
        },
        actionsheetBtnClick() {
            this.showBar = false;
        },
        closeActionsheet() {
            this.showBar = false;
        },
    }
}