import { createApp } from 'vue';
import './main.css';
import App from './App.vue';
import Andt from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

const app = createApp(App);

app.use(Andt).mount('#app');
