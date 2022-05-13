<template>
    <div class="goods">
        <GoodsListItem v-for="item in goods" :key="item" :product="item"></GoodsListItem>
        
    </div>
</template>

<script>
import GoodsListItem from "./GoodsListItem.vue";
export default {
    name: "GoodsList",
    props: {
        goods: {
            type: Array,
            default() {
                return [];
            },
        },
    },
    components: { GoodsListItem },
    setup() {
    }
};
</script>

<style lang='scss' scoped>
.goods {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    padding: 5px;
}
</style>