<template>
	<div class = 'keyBWrapper'>
		<div class = 'numBoard'>
			<div v-for = 'item, index in list' :key = 'index' class = 'boardCell' @click = 'boardClick(item,index)'>
				<text :class="[index===9?'closeall':'numText']">{{item}}</text>
			</div>
		</div>
		<div class = 'confirm'>
			<div class = 'cancel' @click = 'deleteLast'>
				<text
						class = 'text-icon'
						:style="{
                    fontFamily:'iconfont1',
                    fontSize:'60px'
                }"
				>{{deleteIcon}}</text>
			</div>
			<div class = 'done' @click = 'done'>
				<text class = 'text'>确定</text>
			</div>
		</div>
	</div>
</template>

<script>
    import { decode } from '../func'
    export default {
        data(){
            return {
                list: ['1', '2', '3','4', '5', '6','7', '8', '9',decode('&#xe6e9'), '0', '.'], //decode('&#xe610')
                data: '',
                finalData:'',
                zhengshu:'',
                postFloar:0,
                xiaoshu:'',
                deleteIcon: decode('&#xe6a6;')
            }
        },
        props: {
            value: {
                default: '',
                required: true
            },
            regexp: ''
        },
        methods: {
            emit(val){
                this.$emit('getValue', val.length === 0 ? null : val)
            },
            boardClick(val,i){
                let testdata = this.data
                testdata += testdata.indexOf('.') > 0 ? val === '.' ? '' : (testdata.length - (testdata.indexOf('.') + 1)) >= 2 ? '' : val : val === '.' && testdata.length === 0 ? '0.' : val
                this.regexp ? (
                    this.regexp.test(parseFloat(testdata)) ? this.data = testdata : ''
                ) : this.data = testdata
                i===9?this.data='':'';
                this.emit(this.data)
            },
            done(){
                this.$emit('close', false)
            },
            deleteLast(){
                this.data = this.data.substring(0, this.data.length - 1)
                this.emit(this.data)
            }
        }
    }
    //keyboard  属性: getValue 函数 接收val参数为键盘传出的值
    //keyboard  属性: close 函数 改变键盘显示状态
    //keyBoard  属性: value 必选属性 type: number 默认值: 0
    //keyBoard  改变可见和隐藏: 修改 store.state 里的 keyBoardDisplay 属性  // beta 失效！
    //keyBoard  属性: regexp 正则表达式对象 如 判断 11位数字 /^-?(0|[1-9]\d{0,10})$/  ！每次输入都要判断  所以不能直接判断手机号 等 如要判断手机号 在父组件 input 输入完成之后再判断 （例如 在 父组件传入的 close 事件中判断）
</script>

<style lang = 'less'>
	@borderColor: #e3e7ee;
	.setBorder(@top, @right, @bottom, @left){
		border-top-width: @top;
		border-right-width: @right;
		border-bottom-width: @bottom;
		border-left-width: @left;
		border-color: @borderColor;
		border-style: solid;
	}
	.confSub(@color){
		flex: 1;
		justify-content: center;
		align-items: center;
		background-color: @color;
	}

	.keyBWrapper{
		.setBorder(1px, 0, 0, 0);
		height: 400px;
		background-color: #fff;
		flex-direction: row;
	}
	.numBoard{
		flex: 3;
		flex-wrap: wrap;
		flex-direction: row;
		align-content: space-around;
	}
	.boardCell{
		width:187px;
		height:100px;
		justify-content: center;
		align-items: center;
		.setBorder(0,1px,1px,0)
	}
	.boardCell:nth-child(3n){
		.setBorder(0,0,1px,0)
	}
	.subCell{
		.confSub(#fff);
		.setBorder(0, 1px, 1px, 0);
	}
	.subCell:active{
		background-color: @borderColor;
	}
	.subCellBlock{
		background-color: @borderColor;
	}
	.numText{
		font-size: 55px;
		text-align: center;
	}


	.confirm{
		flex: 1;
	}
	.cancel{
		.confSub(@borderColor);
	}
	.cancel:active{
		.confSub(#ccc);
	}
	.done{
		.confSub(#3eba6c);
	}
	.done:active{
		.confSub(#23b157);
	}
	.text{
		color: #fff;
		font-size: 40px;
	}
	.closeall{
		font-family:iconfont1;
		font-size:55px;
		text-align: center;
	}
</style>