import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'vant/lib/index.css';

import {
    Swipe,
    SwipeItem,
    Lazyload,
    Badge,
    Sidebar,
    SidebarItem,
    Collapse,
    CollapseItem,
    Tab,
    Tabs,
    Card,
    Image as VanImage,
    Tag,
    Button,
    Form,
    Field,
    CellGroup,


} from 'vant';

createApp(App)
    .use(Swipe)
    .use(SwipeItem)
    .use(Sidebar)
    .use(SidebarItem)
    .use(Collapse)
    .use(CollapseItem)
    .use(Tab)
    .use(Tabs)
    .use(Card)
    .use(VanImage)
    .use(Tag)
    .use(Button)
    .use(Form)
    .use(Field)
    .use(CellGroup)


    .use(Lazyload, {
        loading: require('./assets/images/default.png')
    })
    .use(Badge)
    .use(store)
    .use(router)
    .mount('#app')
