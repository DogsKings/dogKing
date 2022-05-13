<template>
    <div>
        <NavBar>
            <template v-slot:default>用户登录</template>
        </NavBar>
        <div style="margin-top:50px">
            <div style="text-align:center; ">
                <van-image
                    width="10rem"
                    height="10rem"
                    fit="contain"
                    src="https://cdn.jsdelivr.net/npm/@vant/assets/cat.jpeg"
                />
            </div>
        </div>
        <van-form @submit="onSubmit">
            <van-cell-group inset>
                <van-field
                    v-model="email"
                    name="用户名"
                    label="用户名"
                    placeholder="用户名"
                    :rules="[{ required: true, message: '请填写用户名' }]"
                />
                <van-field
                    v-model="password"
                    type="password"
                    name="密码"
                    label="密码"
                    placeholder="密码"
                    :rules="[{ required: true, message: '请填写密码' }]"
                />
            </van-cell-group>
            <div style="margin: 16px;">
                <div class="link-login" @click="$router.push({path:'/register'})">没有账号,去注册</div>
                <van-button round block type="primary" color="#aa290c" native-type="submit">登录</van-button>
            </div>
        </van-form>
    </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar.vue";
import { ref, reactive, toRefs } from "vue";
import { login } from "network/user.js";
import { Notify, Toast } from "vant";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
export default {
    name: "Login",
    components: { NavBar },
    setup() {
        const router = useRouter();
        const store = useStore();
        const userinfo = reactive({
            email: "",
            password: "",
        });

        const onSubmit = () => {
            login(userinfo).then((res) => {
                //将token保存到本地window.localStorage
                window.localStorage.setItem("token", res.access_token);
                //在vuex isLogin
                store.commit("setIsLogin", true);

                Toast.success("登录成功");
                userinfo.email = "";
                userinfo.password = "";

                setTimeout(() => {
                    router.go(-1);
                }, 500);
            });
        };

        return { ...toRefs(userinfo), onSubmit };
    },
};
</script>

<style scoped>
.link-login {
    font-size: 14px;
    margin-bottom: 20px;
    color: #aa290c;
}
</style>