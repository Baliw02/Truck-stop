import Vue from 'vue';
import App from './App.vue';

import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import {store} from './store/store';

import VueRouter from 'vue-router';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faUserSecret, faSearch, faBars, faXmark, faTimes, faAngleLeft, faAngleRight, faAngleUp, faAngleDown, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faUserSecret, faSearch, faBars, faXmark, faTimes, faAngleLeft, faAngleRight, faAngleUp, faAngleDown, faUser);

import PrettyCheck from 'pretty-checkbox-vue/check';
Vue.component('p-check', PrettyCheck);


//Handling OSM map icon error.
delete L.Icon.Default.prototype._getIconUrl;

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.use(VueRouter);

Vue.component('l-map', LMap);
Vue.component('l-tile-layer', LTileLayer);
Vue.component('l-marker', LMarker);

import Map from './components/Map';

const routes = [
  {
    props: true,
    name:'map',
    path:'/',
    component: Map,
    meta: {title: 'Truck Stop | Map'}
  },
  {
    props: true,
    name:'Not found',
    path: '*',
    component: () => import('./components/NotFound'),
    meta: {title: '404 Page Not Found'}
  }
];

const router = new VueRouter({
  routes
});

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  router,
  store: store
}).$mount('#app');
