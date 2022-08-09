import store from '../store'
import { createRouter, createWebHashHistory } from 'vue-router'
import { Notify, Toast } from "vant";
const Home = () => import('../views/home/Home')
const Category = () => import('../views/category/Category')
const Detail = () => import('../views/detail/Detail')
const Profile = () => import('../views/profile/Profile')
const ShopCart = () => import('../views/shopcart/ShopCart')
const Register = () => import('../views/profile/Register')
const Login = () => import('../views/profile/Login')
const Address = () => import('../views/profile/Address')
const AddressEdit = () => import('../views/profile/AddressEdit')
const CreateOrder = () => import('../views/order/CreateOrder')




const routes = [
  {
    path: '',
    name: 'Home',
    component: Home,
    meta: {
      title: '小恐龙图书网-首页',
      keepAlive: true,
    },
  },
  {
    path: '/category',
    name: 'Category',
    component: Category,
    meta: {
      title: '小恐龙图书网-分类',
      keepAlive: true,
    }
  },
  {
    path: '/detail',
    name: 'Detail',
    component: Detail,
    meta: {
      title: '小恐龙图书网-详情',
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      title: '小恐龙图书网-个人中心',
      keepAlive: true,
      isAuthRequired: true

    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      title: '小恐龙图书网-用户注册',

    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: '小恐龙图书网-登录',

    }
  },
  {
    path: '/shopcart',
    name: 'ShopCart',
    component: ShopCart,
    meta: {
      title: '小恐龙图书网-购物车',
      isAuthRequired: true
    }
  },
  {
    path: '/address',
    name: 'Address',
    component: Address,
    meta: {
      title: '小恐龙图书网-地址管理',
      isAuthRequired: true
    }
  },
  {
    path: '/addressedit',
    name: 'AddressEdit',
    component: AddressEdit,
    meta: {
      title: '小恐龙图书网-设置地址',
      isAuthRequired: true
    }
  },
  {
    path: '/createorder',
    name: 'CreateOrder',
    component: CreateOrder,
    meta: {
      title: '小恐龙图书网-创建订单',
      isAuthRequired: true
    }
  },
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  //如果没有登录,在这里到login
  if (to.meta.isAuthRequired && store.state.user.isLogin === false) {
    Notify('你还没有登录，请登陆后访问')
    return next('/login');
  } else {
    next();
  }

  document.title = to.meta.title
})

export default router
