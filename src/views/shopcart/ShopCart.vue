<template>
    <div>
        <NavBar class="nav-bar">
            <template v-slot:default>
                购物车(
                <span style="color:red">{{$store.state.cartCount}}</span>)
            </template>
        </NavBar>
        <div class="cart-box">
            <div class="cart-body">
                <van-checkbox-group ref="checkboxGroup" @change="groupChange" v-model="result">
                    <van-swipe-cell :right-width="50" v-for="(item,index) in list" :key="index">
                        <div class="good-item">
                            <van-checkbox :name="item.id" />
                            <div class="good-img">
                                <img :src="item.goods.cover_url" alt />
                            </div>
                            <div class="good-desc">
                                <div class="good-title">
                                    <span>{{item.goods.title}}</span>
                                    <span>x{{item.goods.stock}}</span>
                                </div>
                                <div class="good-btn">
                                    <div class="price">
                                        <small>￥</small>
                                        {{item.goods.price}}
                                    </div>
                                    <van-stepper
                                        integer
                                        :min="1"
                                        :max="item.goods.stock"
                                        :model-value="item.num"
                                        :name="item.id"
                                        async-change
                                        @change="onChange"
                                    />
                                </div>
                            </div>
                        </div>

                        <template #right>
                            <van-button
                                square
                                icon="delete"
                                type="danger"
                                class="delete-button"
                                @click="deleteGood(item.id)"
                            />
                        </template>
                    </van-swipe-cell>
                </van-checkbox-group>
            </div>
            <van-submit-bar
                class="submit-all"
                :price="total*100"
                @submit="onSubmit"
                button-text="提交订单"
            >
                <van-checkbox v-model:checked="checkAll" @click="allCheck">全选</van-checkbox>
            </van-submit-bar>

            <div class="empty" v-if=" !list.length">
                <div class="title">购物车空空如也</div>
                <van-button round color="#1baeae" type="primary" block @click="goTo">前往选购</van-button>
            </div>
        </div>
    </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import { ref, reactive, toRefs, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { getCart, deleteCart, checkedCart, changeCart } from "network/cart";
import { useStore } from "vuex";
import { Toast } from "vant";
export default {
    name: "ShopCart",
    setup() {
        const router = useRouter();
        const store = useStore();

        //数据模型（状态）
        const state = reactive({
            list: [],
            result: [], //id数组
            checkAll: false,
        });
        //初始化购物车数据
        const init = () => {
            Toast.loading({
                message: "加载中...",
                forbidClick: true,
            });
            getCart("include=goods").then((res) => {
                state.list = res.data;

                state.result = res.data
                    .filter((n) => n.is_checked == 1)
                    .map((item) => item.id);
                Toast.clear();
            });
        };
        //复选框改变处理事件
        const groupChange = (result) => {
            //设置全选按钮随勾选商品改变
            if (result.length == state.list.length && result.length !== 0) {
                state.checkAll = true;
            } else {
                state.checkAll = false;
            }

            state.result = result;
            //改变数据表中选中状态
            checkedCart({ cart_ids: result });
        };
        //异步改变购物车数量
        const onChange = (value, detail) => {
            Toast.loading({
                message: "正在修改数量请稍等...",
                forbidClick: true,
            });
            changeCart(detail.name, { num: value }).then((res) => {
                //将在onMounted中的list中的num也要改
                state.list.forEach((item) => {
                    if (item.id == detail.name) {
                        item.num = value;
                    }
                    Toast.clear();
                });
            });
        };
        //全选框改变处理
        const allCheck = () => {
            if (!state.checkAll) {
                state.result = state.list.map((item) => item.id);
                state.checkAll = true;
            } else {
                state.result = [];
                state.checkAll = false;
            }
        };
        //删除商品回调
        const deleteGood = (id) => {
            deleteCart(id).then((res) => {
                init(); //重新初始化页面
                store.dispatch("updateCart"); //改变vuex中的状态数量
            });
        };
        onMounted(() => {
            init();
        });
        //通过计算属性计算商品总价
        const total = computed(() => {
            let sum = 0;
            state.list
                .filter((item) => state.result.includes(item.id))
                .forEach((item) => {
                    sum += parseInt(item.num) * parseFloat(item.goods.price);
                });
            return sum;
        });

        //前往购物方法
        const goTo = () => {
            router.push({ path: "/" });
        };
        //创建订单
        const onSubmit = () => {
            if (state.result.length == 0) {
                Toast.fail("请选择商品进行结算");
                return;
            } else {
                router.push({ path: "/createorder" });
            }
        };
        return {
            ...toRefs(state),
            goTo,
            onChange,
            groupChange,
            allCheck,
            deleteGood,
            onSubmit,
            total,
        };
    },
    components: { NavBar },
};
</script>

<style  scoped lang='scss'>
.cart-box {
    .cart-body {
        margin: 60px 0 100px 0;
        padding-left: 10px;
        .good-item {
            display: flex;
            .good-img {
                img {
                    width: 100px;
                    height: auto;
                }
            }
            .good-desc {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                flex: 1;
                padding: 20px;
                .good-title {
                    display: flex;
                    justify-content: space-between;
                }
                .good-btn {
                    display: flex;
                    justify-content: space-between;
                    .price {
                        font-size: 16px;
                        color: red;
                        line-height: 28px;
                    }
                    .van-icon-delete {
                        font-size: 20px;
                        margin-top: 4px;
                    }
                }
            }
        }
        .delete-button {
            width: 50px;
            height: 100%;
        }
    }
    .empty {
        width: 50%;
        margin: 0 auto;
        text-align: center;
        margin-top: 200px;
        .empty-cart {
            width: 150px;
            margin-bottom: 20px;
        }
        .van-icon-smile-o {
            font-size: 50px;
        }
        .title {
            font-size: 16px;
            margin-bottom: 20px;
        }
    }
    .submit-all {
        margin-bottom: 50px;
        z-index: 1;
        .van-checkbox {
            margin-left: 0;
        }
        .van-submit-bar__text {
            margin-right: 10px;
        }
        .van-submit-bar__button {
            background: red;
        }
    }
    .van-checkbox__icon--checked .van-icon {
        background-color: red;
        border-color: red;
    }
}
</style>