<template>
        <list class="set-list">
            <cell class="set-list-item" v-for="item,index in lists" append="tree" @click="switchAcount(item,index)">
                <zz-checkbox class="cart-select" :deleteinfo="isDelete" :check="item.selectDelete"></zz-checkbox>
                <div class="set-img" v-if="item.icon">
                    <image class="set-image" :src="item.icon"></image>
                </div>
                <div class="set-account">
                    <text class="set-title">{{item.tex}}</text>
                    <text :style="{color:item.decColor}" class="set-dec">{{item.dec}}</text>
                </div>
                <div class="next-wrapper">
                    <text class="next"
                          v-if="!isDelete&item.current"
                          :style="{
		        fontFamily:'iconfont1',
		        'color': '#3eba6c',
		        fontSize:'65px'}">{{switchicon}}</text>
                </div>
            </cell>
        </list>
</template>

<script>
    import he from 'he'
    import zzCheckbox from '../components/zz-checkbox.vue'
    export default {
        name: 'mt-set',
        components: {
            zzCheckbox
        },
        props: {
            lists: {
                type: Array,
                required: true
            },
            isDelete:Boolean,
            isAllselect:Boolean
        },
        data(){
            return {
                nexticon: he.decode('&#xe680'),
                switchicon:he.decode('&#xe8e5')
            }
        },
        methods: {
            switchAcount(item,i){
                if(this.isDelete){
                    this.$emit('inverseSelect',item)
                }else {
                    this.$emit('switchAcount',i)
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    @color_black:#333;
    .set-list {
        margin-bottom: 18px;
        padding-left: 30px;
        padding-right: 30px;
        background-color: #fff;
    }

    .set-list-item {
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        height: 128px;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #dedede;
        background-color: #fff;
    }
    .cart-select{
        margin-right:18px;
    }
    .set-title, .set-dec, .set-img, .next-wrapper {
        justify-content: center;
    }

    .set-img {
        flex: 1;
    }

    .set-image {
        width: 50px;
        height: 50px;
    }

    .set-account {
        flex: 7;
    }

    .set-title {
        margin-bottom: 15px;
        font-size: 24px;
        color:#999;
    }

    .set-dec {
        font-size: 28px;
        color:@color_black;
    }

    .next-wrapper {
        flex: 1;
        align-items: flex-end;
    }
</style>
