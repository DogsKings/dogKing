<template>
    <div class="recommend">
        <div class="Recommend-item" v-for="item in recommends.slice(0,4)" :key="item.id">
            <a href @click.prevent="goD(item.id)">
                <img v-lazy="item.cover_url" />
                <div>{{item.title}}</div>
            </a>
        </div>
    </div>
</template>

<script>
import { useRouter } from "vue-router";
export default {
    name: "RecommendView",
    props: {
        recommends: {
            type: Array,
            default() {
                return [];
            },
        },
    },
    setup() {
        const router = useRouter();
        const goD = (id) => {
            router.push({ path: "/detail", query: { id } });
        };

        return {
            goD,
        };
    },
};
</script>

<style scoped lang='scss'>
.recommend {
    display: flex;
    width: 100%;
    text-align: center;
    padding: 15px 0 30px 0;
    border-bottom: 8px solid #eee;
    font-size: 12px;
}
.Recommend-item {
    flex: 1;
    img {
        width: 70px;
        height: 70px;
        margin-bottom: 10px;
    }
}
</style>