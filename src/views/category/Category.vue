<template>
    <div>
        <NavBar>
            <template v-slot:default>分类</template>
        </NavBar>
        <div id="mainbox">
            <div class="ordertab">
                <van-tabs v-model:active="activeKey" @click-tab="tabClick">
                    <van-tab title="销量排序"></van-tab>
                    <van-tab title="价格排序"></van-tab>
                    <van-tab title="评论排序"></van-tab>
                </van-tabs>
            </div>
            <van-sidebar class="leftmenu" v-model="active">
                <van-collapse v-model="activeName" accordion>
                    <van-collapse-item
                        v-for="item in categories"
                        :key="item.id"
                        :title="item.name"
                        :name="item.name"
                    >
                        <van-sidebar-item
                            v-for="sub in item.children"
                            :key="sub.id"
                            :title="sub.name"
                            @click="getGoods(sub.id)"
                        />
                    </van-collapse-item>
                </van-collapse>
            </van-sidebar>

            <div class="goodlist">
                <div class="content">
                    <van-card
                        v-for="item in showGoods"
                        :key="item.id"
                        @click="itemClick(item.id)"
                        :num="item.comments_count"
                        :price="item.price"
                        :desc="item.updated_at"
                        :title="item.title"
                        :thumb="item.cover_url"
                        :lazy-load="true "
                    />
                </div>
            </div>
        </div>
        <BackTop @bTop="bTop" v-show="isShowBackTop" />
    </div>
</template>

<script>
import { ref, reactive, onMounted, computed, watchEffect, nextTick } from "vue";
import NavBar from "components/common/navbar/NavBar";
import { getCategory, getCategoryGoods } from "network/category.js";
import BScroll from "better-scroll";
import BackTop from "components/common/backtop/BackTop";
import { useRoute, useRouter } from "vue-router";
import { Toast } from "vant";
export default {
    name: "Category",
    components: { NavBar, BScroll, BackTop },
    setup() {
        const activeName = ref("0");
        let categories = ref([]);
        const active = ref(0);
        const activeKey = ref(0);
        //当前的排序条件
        let currentOrder = ref("sales");
        //当前的分类id
        let currentCid = ref(0);
        //声明bscroll变量
        let bscroll = reactive({});
        let isShowBackTop = ref(false);
        const router = useRouter();
        //数据模型
        const goods = reactive({
            sales: { page: 1, list: [] },
            price: { page: 1, list: [] },
            comments_count: { page: 1, list: [] },
        });

        const init = () => {
            getCategoryGoods("sales", currentCid.value).then((res) => {
                goods.sales.list = res.goods.data;
            });
            getCategoryGoods("price", currentCid.value).then((res) => {
                goods.price.list = res.goods.data;
            });
            getCategoryGoods("comments_count", currentCid.value).then((res) => {
                goods.comments_count.list = res.goods.data;
            });
        };
        const showGoods = computed(() => {
            return goods[currentOrder.value].list;
        });

        onMounted(() => {
            init();
            Toast.loading({
                message: "加载中...",
                forbidClick: true,
            });
            getCategory().then((res) => {
                categories.value = res.categories;
            });

            getCategoryGoods(currentOrder.value, currentCid.value).then(
                (res) => {
                    goods[currentOrder.value].list = res.goods.data;

                    Toast.clear();
                }
            );
            bscroll = new BScroll(document.querySelector(".goodlist"), {
                probeType: 3,
                click: true, //是否允许点击
                pullUpLoad: true, //上拉加载更多
            });
            //注册滚动事件
            bscroll.on("scroll", (position) => {
                isShowBackTop.value = -position.y > 300;
            });

            //向上拉加载更多,触发pullingUp
            bscroll.on("pullingUp", () => {
                const page = goods[currentOrder.value].page + 1;
                getCategoryGoods(currentOrder.value, currentCid.value).then(
                    (res) => {
                        goods[currentOrder.value].list.push(...res.goods.data);
                        goods[currentOrder.value].page += 1;
                    }
                );

                //完成上拉,等数据请求完成,要将新数据展示出来
                bscroll.finishPullUp();
                //重新计算高度
                nextTick(() => {
                    //重新计算高度
                    bscroll && bscroll.refresh();
                });
            });
        });
        // 排序选项卡
        const tabClick = (index) => {
            let orders = ["sales", "price", "comments_count"];
            currentOrder.value = orders[index.name];
            getCategoryGoods(currentOrder.value, currentCid.value).then(
                (res) => {
                    goods[currentOrder.value].list = res.goods.data;
                    nextTick(() => {
                        //重新计算高度
                        bscroll && bscroll.refresh();
                    });
                }
            );
        };

        //通过分类得到商品
        const getGoods = (cid) => {
            currentCid.value = cid;
            getCategoryGoods(currentOrder.value, currentCid.value).then(
                (res) => {
                    goods[currentOrder.value].list = res.goods.data;
                }
            );
        };
        watchEffect(() => {
            nextTick(() => {
                //重新计算高度
                bscroll && bscroll.refresh();
            });
        });
        const bTop = () => {
            bscroll.scrollTo(0, 0, 300);
        };
        return {
            active,
            categories,
            activeName,
            activeKey,
            tabClick,
            currentOrder,
            getGoods,
            currentCid,
            goods,
            showGoods,
            bscroll,
            isShowBackTop,
            bTop,
            itemClick: (id) => {
                router.push({ path: "/detail", query: { id } });
            },
        };
    },
};
</script>

<style lang='scss' scoped>
#mainbox {
    margin-top: 45px;
    display: flex;
    .ordertab {
        flex: 1;
        float: right;
        height: 50px;
        z-index: 9;
        position: fixed;
        top: 45px;
        right: 0;
        left: 130px;
    }
    .leftmenu {
        position: fixed;
        top: 45px;
        left: 0;
        width: 130px;
    }
    .goodlist {
        flex: 1;
        bottom: 50px;
        position: absolute;
        top: 95px;
        left: 120px;
        right: 0;
        padding: 10px;
        text-align: left !important;
        z-index: 0;
    }
}
</style>