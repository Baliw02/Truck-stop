<template>
<div>
    <div class="loading__block" v-if="$store.state.responses.getStatus != 200"  style="z-index: 99999;">
        <div class="loading__block-circle"></div>
        <div class="loading__block-title">Loading</div>
    </div>
    <Header></Header>
    <div class="full__block">
    <transition name="fadeInOut">
        <Details v-if="detailOpened" />
    </transition>
    <div class="controller__block">
        <div class="controller__block-location button" @click="getLocation()">
        <img width="25px" src="../assets/Icon_Sammlung/17_Home/location-target.png" alt="current-location-button">
        </div>
        <!-- <div class="controller__block-filter button" @click="openFilter()">
        <img width="25px" src="../assets/Icon_Sammlung/17_Home/filter-1.png" alt="filter-location-button">
        </div> -->
    </div>
    <!-- <div v-if="filterOpened" class="filter">
        <FilterCat />
    </div> -->
    <div class="map-frame">
        <l-map ref="mymap" :zoom="$store.state.map.currentZoom" :center="$store.state.map.center" :options="$store.state.mapOptions" style="height:100%; width:100%;" @update:center="centerUpdate" @update:zoom="zoomUpdate" @click="resetSelectedPin">
        <l-tile-layer :url="$store.state.map.url" :attribution="$store.state.map.attribution" />
        <l-marker-cluster>
            <l-marker ref="markerref" v-for="pin in searchPin" :key="pin.title" :lat-lng="[pin.location.lat, pin.location.lon]" @click="selectPin(pin, pin.id)">
            <l-icon v-if="pin.icon != '' || pin.icon != undefined || pin.icon != null" :iconSize="[20, 25]" :iconAnchor="[10, 0]" :icon-url="pin.icon" />
            <l-popup>
                <p>{{pin.name}} <br> {{pin.openingHours[day].from}}:{{pin.openingHours[day].until}}</p>
            </l-popup>
            </l-marker>
        </l-marker-cluster>
        <l-marker v-if="currentLat != 0" :lat-lng="[currentLat, currentLon]">
            <l-icon :iconSize="[20, 25]" :iconAnchor="[10, 0]" icon-url="http://maps.gstatic.com/intl/de_de/mapfiles/ms/micons/red-pushpin.png"></l-icon>
        </l-marker>
        </l-map>
    </div>
    </div>
</div>
</template>
<script>
/*eslint-disable */
import Header from './Header'
import Details from './Details'
// import Filter from './Filter';

import L from "leaflet";
import { latLng, icon } from "leaflet";
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { LMap, LTileLayer, LPopup, LIcon } from "vue2-leaflet";
import 'leaflet-routing-machine'
import Vue2LeafletMarkerCluster from "vue2-leaflet-markercluster";
import { mapGetters } from 'vuex' 
/*eslint-enable */


export default {
    components: {
        Header: Header,
        Details: Details,
        // FilterCat: Filter,
        "l-map": LMap,
        "l-tile-layer": LTileLayer,
        "l-popup": LPopup,
        "l-icon": LIcon,
        "l-marker-cluster": Vue2LeafletMarkerCluster
    },
    data() {
        return {
            openedFilter:false,
            currentLat: 0,
            currentLon: 0,
            day:'',
            filteredCategory: [],
            map:{
                zoom: 12
            },
            provider: new OpenStreetMapProvider(),
            // pinIcons: icon({
            // }),
            clickedIcon: icon({
                iconUrl: 'http://maps.gstatic.com/intl/de_de/mapfiles/ms/micons/red-pushpin.png',
                iconSize:[20, 25],
                iconAnchor: [10, 0] 
            }),
            searchedPin: null,
            searchedArray: [],
            routeObject: '',
            route: {
                waypointObjects: [],
                waypointRoads: []
            },
        }
    },
    /*eslint-disable */

    watch:{
        '$route'(to, from){
            documet.title = to.meta.title || 'Truck stop'
        }
    },
    /*eslint-enable */
    methods: {
        openFilter(){
            this.$store.commit('controlFilterMenu');
        },
        getLocation(){
            navigator.geolocation.getCurrentPosition(position => {
                setTimeout(() => {
                this.currentLat = position.coords.latitude;
                this.currentLon = position.coords.longitude;
                
                this.$store.commit('setMapLatLng', {lat: this.currentLat, lon: this.currentLon, zoom: 14});
                this.$store.dispatch('viewController');
                }, 500);
        });
        },
        zoomUpdate(zoom) {
            this.$store.state.currentZoom = zoom;
        },
        centerUpdate(center) {
            this.$store.state.currentCenter = center;
        },
        selectPin(pin, index){
            this.$store.commit('setMapLatLng', {lat: pin.location.lat, lon: pin.location.lon, zoom: 14});
            this.$store.commit('setSelectedPin', index);
            this.$store.dispatch('getDetailapi');
            this.$store.commit('resetPagination');
            this.$store.commit('controlDetailMenu');
            setTimeout(() => {
                this.$store.dispatch('viewController');
            }, 500);
        },
        resetSelectedPin(){
            this.$store.commit('resetSelectedPin');
        },
        //Ez nezi a kategoriakat az arrayben
            // if(!checked){
            //     let idx = this.$store.state.point_arrays.filteredCategory.map((item) => item).indexOf(catName);
            //     this.$store.state.point_arrays.filteredCategory.splice(idx, 1);
            // }
            // else{
            //     this.$store.state.point_arrays.filteredCategory.push(this.$store.state.point_arrays.allCategory[index].name);
            // }
    },

    created(){
        var date = new Date();
        this.day = this.$store.state.days[date.getDay()].toLowerCase();
        
    },

    mounted(){
        document.title = 'Truck Stop | ' + this.$route.name[0].toUpperCase() + this.$route.name.slice(1);
        this.$store.commit('setMapObject', this.$refs.mymap.mapObject);
        this.$store.dispatch("getPoi");
        this.$store.dispatch("getCategory");
        this.$store.dispatch('getPoiAttributes');
    },

    computed:{
        ...mapGetters({
            filteredpin: 'filterPin',
        }),
        filteredPin(){
            return this.filteredpin;
        },
        //Itt nezi ha keresunk valamit
        searchPin(){
            return this.filteredPin.filter((poi) => { //ide megy a searched pin
                if(this.$store.state.search.result != null){
                    if(this.$store.state.search.pinName != null){
                        if(poi.name.includes(this.$store.state.search.pinName)){
                            var res = this.$refs.mymap.mapObject.distance(this.$store.state.search.result, latLng(poi.location.lat, poi.location.lon)) / 1000;
                            if(res < this.$store.state.search.radius * 5){
                                return poi;
                            }
                        }
                    }
                    else{
                        res = this.$refs.mymap.mapObject.distance(this.$store.state.search.result, latLng(poi.location.lat, poi.location.lon)) / 1000;
                        if(res < this.$store.state.search.radius * 5){
                            return poi;
                        }
                    }
                }
                else{
                    if(this.$store.state.search.pinName != null){
                        if(poi.name.includes(this.$store.state.search.pinName)){
                            return poi;
                        }
                    }
                    else{
                        return poi;
                    }
                }
            });
        },
        filterOpened: {
            get() {return this.$store.state.menu.filterOpened},
            set() {this.$store.commit('controlFilterMenu');}
        },
        detailOpened: {
            get() {return this.$store.state.menu.detailOpened},
            set() {this.$store.commit('controlDetailMenu');}
        },
    }
// console.log(parseInt(this.$refs.mymap.mapObject.distance(latLng(50.472578, 10.283203), latLng(47.41322, -1.219482)) / 1000))
    
}
</script>

<style lang="scss">

.loading__block{
width: 100%;
height: 100%;
position: absolute;
display: block;
margin: auto;
background-color:white;
    &-circle{
        width: 30px;
        height: 30px;
        position: absolute;
        display: block;
        top: 0; bottom: 0; left: 0; right: 0;
        margin: auto;
        border-radius: 100%;
        background: linear-gradient(90deg, rgba(0,71,107,1) 0%, rgba(12,118,164,1) 100%);
        transition: all .1s linear;
        animation-name: rotatecircle;
        animation-duration: 1s;
        animation-iteration-count: infinite;
    }
    &-title{
        font-weight: 600;
        width:fit-content;
        position: absolute;
        display: block;
        bottom: 45%; left: 0; right: 0;
        margin: auto;
    }
}
@keyframes rotatecircle{
    from{transform: rotate(0deg);}
    to{transform: rotate(360deg);}
}
.controller__block{
    >.button{
        width: 35px;
        height: 35px;
        position:absolute;
        background-color:white;
        border-radius:100%;
        -webkit-box-shadow: 0px 0px 4px 1px rgba(0,0,0,0.6); 
        box-shadow: 0px 0px 4px 1px rgba(0,0,0,0.6);
        top:70px;
        z-index: 999;    
    }
img{
    padding: 5px;
}

&-location{
    left:50px;
}
&-filter{
    left:90px;
}

}

.fadeInOut-enter-active{
    animation: slideInOut .1s;
}
.fadeInOut-leave-active{
    animation: slideInOut .1s reverse; 
}

.marker-cluster-small {
    background-color: rgba(181, 226, 140, 0.6);
    }
.marker-cluster-small div {
    background-color: rgba(110, 204, 57, 0.6);
    }

.marker-cluster-medium {
    background-color: rgba(241, 211, 87, 0.6);
    }
.marker-cluster-medium div {
    background-color: rgba(240, 194, 12, 0.6);
    }

.marker-cluster-large {
    background-color: rgba(253, 156, 115, 0.6);
    }
.marker-cluster-large div {
    background-color: rgba(241, 128, 23, 0.6);
    }

    /* IE 6-8 fallback colors */
.leaflet-oldie .marker-cluster-small {
    background-color: rgb(181, 226, 140);
    }
.leaflet-oldie .marker-cluster-small div {
    background-color: rgb(110, 204, 57);
    }

.leaflet-oldie .marker-cluster-medium {
    background-color: rgb(241, 211, 87);
    }
.leaflet-oldie .marker-cluster-medium div {
    background-color: rgb(240, 194, 12);
    }

.leaflet-oldie .marker-cluster-large {
    background-color: rgb(253, 156, 115);
    }
.leaflet-oldie .marker-cluster-large div {
    background-color: rgb(241, 128, 23);
}

.marker-cluster {
    background-clip: padding-box;
    border-radius: 20px;
    div{
        width: 30px;
        height: 30px;
        margin-left: 5px;
        margin-top: 5px;
        text-align: center;
        border-radius: 15px;
        font: 12px "Helvetica Neue", Arial, Helvetica, sans-serif;
    }
}
.marker-cluster span {
    line-height: 30px;
}
.map-frame{
    position:relative;
    display:block;
    max-width:100%;
    height: calc(100vh - 60px);
}
</style>