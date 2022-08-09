<template>
    <div id="box">
        <NavBar class="nav-bar">
            <template v-slot:default>个人中心</template>
        </NavBar>
        <div class="user-box">
            <div class="user-info">
                <div class="info">
                    <img :src="userData.avatar_url" />
                    <div class="user-desc">
                        <span>昵称:{{userData.name}}</span>
                        <span>登录名:{{userData.email}}</span>
                        <span class="name">个性签名:成就自己的只需要一套精品</span>
                    </div>
                </div>
            </div>
            <ul class="user-list">
                <li class="van-hairline--bottom" @click="goTo('/Address')">
                    <span>地址管理</span>
                    <van-icon name="arrow" />
                </li>
                <li class="van-hairline--bottom" @click="goTo('/about')">
                    <span>关于我们</span>
                    <van-icon name="arrow" />
                </li>
            </ul>
        </div>

        <div style="margin:15px;margin-top:30px;">
            <van-button round block color="#44BA80" @click="tologout">退出</van-button>
        </div>
    </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import { logout, getUser } from "network/user";
import { Toast } from "vant";
import { useRouter } from "vue-router";
import { computed, onMounted, reactive, toRefs } from "vue";
import { useStore } from "vuex";

export default {
    name: "profile",
    components: { NavBar },

    setup() {
        const router = useRouter();
        const store = useStore();
        //创建一个用户信息的数据模型用于存储接收过来的用户数据
        let state = reactive({
            userData: {},
        });
        onMounted(() => {
            Toast.loading({
                message: "加载中...",
                forbidClick: true,
            });
            getUser().then((res) => {
                state.userData = res;
                Toast.clear();
            });
        });
        const tologout = () => {
            logout().then((res) => {
                if (res.status == 204) {
                    Toast.success("退出成功");
                    //清除token
                    window.localStorage.setItem("token", "");
                    store.commit("setIsLogin", false);
                    setTimeout(() => {
                        router.push({ path: "/login" });
                    }, 500);
                }
            });
        };
        //跳转方法
        const goTo = (path, query) => {
            router.push({ path, query: query || {} });
        };

        return {
            tologout,
            ...toRefs(state),
            goTo,
        };
    },
};
</script>

<style scoped lang='scss'>
#box {
    background: #fcfcfc;
    height: 100vh;
}
.user-box {
    margin-top: 65px;
    .user-header {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 100;
        width: 100%;
        height: 44px;
        line-height: 44px;
        padding: 0 10px;
        color: #252525;
        background: #fff;
        border-bottom: 1px solid #dcdcdc;
        .user-name {
            font-size: 14px;
        }
    }
    .user-info {
        width: 94%;
        margin: 10px;
        height: 115px;
        background: linear-gradient(90deg, #31c7a7, #a1c7c7);
        box-shadow: 0 2px 5px #269090;
        border-radius: 6px;
        margin-top: 50px;
        text-align: left;
        .info {
            position: relative;
            display: flex;
            width: 100%;
            height: 100%;
            padding: 25px 20px;
            img {
                width: 60px;
                height: 60px;
                border-radius: 50px;
                margin-top: 4px;
            }
            .user-desc {
                display: flex;
                flex-direction: column;
                margin-left: 10px;
                line-height: 20px;
                font-size: 14px;
                color: #fff;
                span {
                    color: #fff;
                    font-size: 14px;
                    padding: 2px 0;
                }
            }
            .account-setting {
                position: absolute;
                top: 10px;
                right: 20px;
                font-size: 13px;
                color: #fff;
                .van-icon-setting-o {
                    font-size: 16px;
                    vertical-align: -3px;
                    margin-right: 4px;
                }
            }
        }
    }
    .user-list {
        padding: 0 8px;
        margin-top: 40px;
        li {
            padding-left: 5px;
            padding-right: 5px;
            height: 40px;
            line-height: 40px;
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            .van-icon-arrow {
                margin-top: 13px;
            }
            margin: 20px 0 !important;
            background: #ffffff;
            border-radius: 3px;
        }
    }
}
</style>