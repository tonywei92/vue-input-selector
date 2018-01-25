import Vue from 'vue';
import App from './app'
import InputSelector from './components/InputSelector.vue';

Vue.component('InputSelector', InputSelector);

new Vue({
    el: '#app',
    render: h => h(App)
});
