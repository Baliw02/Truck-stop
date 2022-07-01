<template>
    <div class="search__block">
        <font-awesome-icon v-if="searchOpened" :icon="['fas', 'times']" class="search__block-close" @click="openSearch()" />
            <ul class="search__block-list">
                <li class="search__block-list--item" @click="selectSearch(index)" v-for="(category, index) in search" :key="index" :class="{active: selectedSearch === category}">{{category}}</li>
            </ul>
        <div class="search__block-wrapper">
            <div v-if="selectedSearch === 'Radius'" class="search__block-radius">
                <div class="search__block-radius-search">
                    <input type="text" name="location" class="search__input" placeholder="City Name" autocomplete="off" v-model="cityName" @keyup="searchResult">
                    <!-- Majd evvel fogom torolni a resultatot -->
                    <label for="location" class="search__label" @click="clearSearch" ><font-awesome-icon icon="icon fa-times" v-if="currentResult != null" /></label>
                    <div class="search__block-radius-search-result" :class="{active: resultArray.length > 0}" v-if="resultArray.length > 0">
                        <div class="search__block-radius-search-result--list" v-if="!resultLoading">
                            <button class="search__block-radius-search-result--list-item" v-for="(result, i) in resultArray" :key="result.x + i" @click="selectResult(i)">{{result.label}}</button>
                        </div>
                    </div>
                </div>
                <div class="search__block-radius-distance">
                    <input class="search__radius--input" type="range" name="radius" v-model="radius">
                    <label for="radius">{{$store.state.search.radius * 5}} km</label><br>
                </div>
                <button @click="openFilter()" class="search__block-radius--button">Filters <font-awesome-icon :icon="['fa', 'angle-right']" class="icon" :class="{dropped: filterOpened}" /></button>
                <div class="filter__block dropdown-list" :class="{active: filterOpened}">
                    <div class="filter__block-inner" v-for="(category, index) in getCategory" :key="category.name + index">
                        <img :src="category.icon" :alt="category.name + ' icon'" width="16px" height="16px">
                        <input class="p-default" @click="filterPin(!category.isDeleted, index, category.name)" type="checkbox" v-model="category.isDeleted">
                            {{category.name}}
                    </div>
                </div>
                <!-- <button @click="openAttributeFilter()">Filters</button>
                <div class="filter__block-attr dropdown-list" :class="{active: openedAttrFilter}">
                    <div class="filter__block-attr-inner" v-for="(attribute, index) in getAttributes" :key="index">
                        <img :src="'https://autohofe.webapix.hu/storage/' + attribute.icon" :alt="attribute.name + 'icon'" width="16px" height="16px">
                        <input class="checkbox" @click="attrFilter(attribute.name, index)" type="checkbox">
                    </div>
                </div> -->
                <button class="search__block-radius-search--button" v-if="currentResult != null" @click="enterSearch()">Search</button>
            </div>
            <div v-if="selectedSearch === 'Route'" class="search__block-route">
                <label class="search__block-route-start-label" for="start-location"><font-awesome-icon @click="resetStartRoute" icon="icon fa-times" v-if="routeStart" /></label>
                <input type="text" name="start-location" class="search__input" placeholder="Route start" autocomplete="off" v-model="routeStart" @keyup="searchStartRouteResult">
                <div class="search__block-route-result" :class="{active: startResultArray.length > 0}" v-if="startResultArray.length > 0">
                    <div class="search__block-route-result--list" v-if="!resultLoading">
                        <button class="search__block-route-result--list-item" v-for="(result, i) in startResultArray" :key="result.x + i" @click="selectStartResult(startResultArray[i])">{{result.label}}</button>
                    </div>
                </div>
                <label class="search__block-route-end-label" for="end-location"><font-awesome-icon @click="resetEndRoute" icon="icon fa-times" v-if="routeEnd" /></label>
                <input type="text" name="end-location" class="search__input" placeholder="Route end" autocomplete="off" v-model="routeEnd" @keyup="searchEndRouteResult">
                <div class="search__block-route-end-result" :class="{active: endResultArray.length > 0}" v-if="endResultArray.length > 0">
                    <font-awesome-icon @click="resetEndRoute" icon="icon fa-times" v-if="routeTriggered" />
                    <div class="search__block-route-end-result--list" v-if="!resultLoading">
                        <button class="search__block-route-end-result--list-item" v-for="(result, i) in endResultArray" :key="result.x + i" @click="selectEndResult(endResultArray[i])">{{result.label}}</button>
                    </div>
                </div>
                <button class="search__block-route--button" @click="setRoute">Search</button>
                <button class="search__block-route--remove" v-if="$store.state.search.routeObj != null" @click="removeRoute">Remove Route</button>
            </div>
            <div v-if="selectedSearch === 'Name'" class="search__block-name">
                <div class="search__block">
                    <label for="location" class="search__label" @click="clearSearchPinName" ><font-awesome-icon icon="icon fa-times" v-if="$store.state.search.pinName != null" /></label>
                    <input class="search__input" placeholder="Name" type="text" name="name" v-model="pinName">
                </div>
                <button class="search__block-name-button" @click="searchPinName">Search</button>
            </div>
            <div v-if="selectedSearch === 'Highway'" class="search__block-highway">
                Highways
            </div>
            
        </div>
    </div>
</template>

<script>
// import L from "leaflet";
import { latLng } from "leaflet";
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { mapGetters } from 'vuex';
//Egyetlen hiba a searchnel, ha kilepek a menubol akkor torlodok a result
export default {
    data(){
        return{
            search: ['Radius', 'Route', 'Name'],
            menuItem: [{item: 'Home'}, {item: 'Search'}, {item: 'Notifications'}, {item: 'Feedback'}],
            selectedSearch: 'Radius',
            provider: new OpenStreetMapProvider(),
            resultArray: [],
            startResultArray: [],
            endResultArray: [],
            resultBool: false,
            resultLoading: false,
            loadingCounter: 0,
            currentLat: 0,
            currentLon: 0,
            currentResult: this.$store.state.search.result,
            // pinName: '',
            filteredPins: [],
            openedFilter: false,
            openedAttrFilter: false,
            attributeActive: false,
            routeObject: '',
            routeTriggered: false,
            routeLayer: '',
            mapObject: '',
            filterDropped: false,
        }
    },
    //Atirni az egeszet mutationosreeeee
    mounted(){
        this.$store.dispatch("getCategory");
        this.$store.commit('resetFilterCategory');
        this.mapObject = this.$store.state.map.mapObj;
        
    },
    methods: {
        filterPin(checked, index, catName){
            console.log("asdasd");
            var pinData = {
                checked: checked,
                index: index,
                catName: catName
            };
            this.$store.commit('setFilterCategory', pinData);
        },
        attrFilter(name, index){
            var attrData = {
                name: name,
                index: index
            }
            this.$store.commit('setAttrFilter', attrData)
        },
        openFilter(){
            this.$store.commit('controlFilterMenu');
        },
        openAttributeFilter(){
            if(!this.openedAttrFilter){
                this.openedAttrFilter = true;
            }
            else{
                this.openedAttrFilter = false;
            }
        },
        selectSearch(index){
            this.selectedSearch = this.search[index];
        },
        openSearch(){
            this.$store.commit("controlSearchMenu");
        },
        async searchResult(){
            var result = [];
            var divider = 0;
            
            if(this.cityName.length >= 9){
                divider = this.cityName.length / 2 + 1;
            }
            else if(this.cityName.length < 4){
                divider = 1;
            }
            else{
                divider = 2;
            }
            if(this.cityName.length / 2 > divider){
                result = await this.provider.search({query: this.cityName});
                this.resultArray = result;
            }
            else{
                this.resultArray = [];
            }

        },
        async searchStartRouteResult(){
            var result = [];
            var divider = 0;
            if(this.routeStart >= 9){
                divider = this.routeStart.length / 2 + 1;
            }
            else if(this.routeStart.length < 4){
                divider = 1;
            }
            else{
                divider = 2;
            }
            if(this.routeStart.length / 2 > divider){
                result = await this.provider.search({query: this.routeStart});
                this.startResultArray = result;
            }
            else{
                this.startResultArray = [];
            }

            
        },
        async searchEndRouteResult(){
            var result = [];
            var divider = 0;

            if(this.routeEnd >= 9){
                divider = this.routeEnd.length / 2 + 1;
            }
            else if(this.routeEnd.length < 4){
                divider = 1;
            }
            else{
                divider = 2;
            }
            if(this.routeEnd.length / 2 > divider){
                result = await this.provider.search({query: this.routeEnd});
                this.endResultArray = result;
            }
            else{
                this.endResultArray = [];
            }
        },
        async selectStartResult(data){            
            this.routeObject = {}
            this.$store.commit('setStartRouteData', data);
            this.startResultArray = [];
        },
        async selectEndResult(data){            
            this.routeObject = {}
            this.$store.commit('setEndRouteData', data);
            this.endResultArray = [];
        },

        async selectResult(index){
            var searchObject = {
                label: this.resultArray[index].label
            };
            this.$store.commit('setSearchData', searchObject);
            this.currentResult = latLng(this.resultArray[index].y, this.resultArray[index].x);          
            this.currentLat = this.resultArray[index].y;
            this.currentLon = this.resultArray[index].x;

            this.resultArray = [];
        },
        async enterSearch(){
            var latlng = {
                lat: this.currentLat,
                lon: this.currentLon,
            }
            var result = {
                results: this.currentResult
            }
            this.$store.commit('setSearchData', result)
            this.$store.commit('setMapLatLng', {lat: latlng.lat, lon: latlng.lon, zoom: 12});

            setTimeout(() => {
                this.$store.dispatch('viewController');
            }, 200)
        },
        async resetResult(){
            this.resultArray = [];
        },
        async clearSearch(){
            this.currentResult = null;
            this.$store.commit('resetSearchData')
            setTimeout(() => {
                this.$store.dispatch('viewController');
            }, 500)

        },
        async searchPinName(){
            this.pinName = this.pinName.toUpperCase();
        },
        async clearSearchPinName(){
            this.pinName = null;
            this.$store.commit('resetSearchPinName');
        },
        setRoute(){
            this.$store.commit('setRouteObject');
            /*eslint-enable */
            this.$store.commit('controlSearchMenu');

        },
        removeRoute(){
            this.$store.commit('removeRouteObject');
            this.$store.commit('resetStartRouteData');
            this.$store.commit('resetEndRouteData');
        },
        resetStartRoute(){
            if(this.routeTriggered){
                this.routeLayer.remove();
            }
            this.startResultArray = [];
            this.$store.commit('resetStartRouteData');
            this.routeStart = null;
        },
        resetEndRoute(){
            if(this.routeTriggered){
                this.routeLayer.remove();
            }
            this.endResultArray = [];
            this.$store.commit('resetEndRouteData');
            this.routeEnd = null;
        }
    },
    computed:{
        ...mapGetters({
            filteredpin: 'filterPin',
        }),
        filteredPin(){
            return this.filteredpin;
        },

        cityName: {
            get() {return this.$store.state.search.cityName},
            set( value ) {this.$store.commit('setSearchCityName', value);}
        },
        routeStart: {
            get() {return this.$store.state.search.routeStart;},
            set( value ) {this.$store.commit('setStartRoute', value);}
        },
        routeEnd: {
            get() {return this.$store.state.search.routeEnd;},
            set( value ) {this.$store.commit('setEndRoute', value);}
        },
        radius: {
            get() {return this.$store.state.search.radius},
            set( value ) {this.$store.commit('setSearchRadius', value);}
        },
        searchOpened: {
            get() {return this.$store.state.menu.searchOpened},
            set() {this.$store.commit('controlSearchMenu');}
        },
        pinName: {
            get() {return this.$store.state.search.pinName;},
            set( value ) {this.$store.commit('setSearchPinName', value);}
        },
        getCategory(){
            return this.$store.state.point_arrays.allCategory;
        },
        getAttributes(){
            return this.$store.state.point_arrays.attributesArray;
        },
        filterOpened: {
            get() {return this.$store.state.menu.filterOpened},
            set() {this.$store.commit('controlFilterMenu');}
        },

    }
}
</script>

<style lang="scss">
@import './styles/variables.scss';
@import './styles/global_classes.scss';
 .pretty .state label:before {
    border-color: #4274a7;
  }

  .pretty.p-switch .state:before {
    border-color: #123456;
  }

  .pretty.p-switch input:checked~.state:before {
    border-color: #123456;
  }
  
  .pretty.p-switch .state label:after, .pretty.p-switch .state label:before {
    border-color: transparent;
  }

.pretty.p-switch input:checked~.state:before {
    border-color: #123456;
  }

.search__block{
    .icon{
        transition: all .1s linear;
        &.dropped{
            transform: rotate(90deg);
        }
    }
    .dropdown-list.active{
        position: static;
        height: 100%;
    }
    &-inner{
        display:flex;
        margin: 10px;
        flex-direction: column;
        background-color: white;
        width:320px;
        color:black;
        position:absolute;
        top:50px;
        z-index: 1002;
        min-height: calc(100vh - 60px);
        right: -10px;
        @media screen and (max-width: 550px){
            width: 100%;
        }

    }
    &-close{
        position: absolute;
        font-size: 30px;
        left: 15px;
        top: 5px;
        cursor: pointer;
        font-weight: 100;
        color: #123456;
    }
    &-list{
        display: flex;
        justify-content: center;
        text-align: center;
        list-style-type: none;
        padding: 0;
        width: 100%;
        margin-top: 45px;
        &--item{
            position: relative;
            margin-inline: 10px;
            cursor: pointer;
            &::after{
                color: black;
                width: 0;
                transition: all 0.1s linear;
                content: '';
                position:absolute;
                margin:auto;
                bottom:-5px; 
                left:0; 
                right: 0;
                width:0;
                background-color:black;
                height: 2px;
            }
            &:hover{
                &::after{
                    width: 100%;
                }
            }
            &.active{
                &::after{
                    width: 100%; 
                }
            }
        }
        &--item.active{
            position:relative;
            
        }
    &.wrapper{
        padding:20px 20px;    
        }
    }
    &-wrapper{
        text-align: center;
    }
    &-radius{
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        &-search{
            width: 100%;
            position: relative;
            display: flex;
            justify-content: center;

            &-result{
                position: absolute;
                top: 100%;
                height: fit-content;
                width: 100%;
                background-color: white;
                color: black;
                font-size: 16px;
                z-index: 9999;
                &--list{
                    margin: 0;
                    padding: 0;
                    &-item{
                        font-family: $f-poppins;
                        font-weight: 400;
                        font-size: 14px;
                        color: black;
                        text-align: left;
                        background-color: transparent;
                        width: 100%;
                        margin: 5px 0px;
                        padding: 10px 32px;
                        cursor: pointer;
                        &:hover{
                            background-color: $c-gray;
                        }
                    }
                }
                
            }

        }
        &--button{
            background-color: white;
            color: black;
            width: 100%;
            font-weight: 500;
            font-size: 16px;
            position: relative;
            padding: 5px 0px;
            .icon{
                top: 7px;
                right: 15px;
                position: absolute;
                font-size: 18px;
            }
        }
        &-distance{
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 20px;
            width: 100%;
            .search__radius--input{
                -webkit-appearance: none;
                width: 90%;
                background: transparent;
                outline: none;
                opacity: 0.7;
                -webkit-transition: .2s;
                transition: opacity .2s;
                position: relative;
                &::after{
                    position: absolute;
                    bottom: 1px;
                    content: '';
                    width: 100%;
                    height: 2px;
                    background-color: $c-gray;
                    margin: auto;
                }
            }
            .search__radius--input::-webkit-slider-thumb {
                -webkit-appearance: none;
                transition: all .1s linear;
                appearance: none;
                width: 24px;
                height: 24px;
                border: 0;
                background: url('C:/Truck Stop/truck_stop/src/assets/Icon_Sammlung/11_Profil/delivery-truck-cargo.png');
                background-size: 24px;
                background-repeat: no-repeat;
                cursor: pointer;
            }

            .search__radius--input::-moz-range-thumb {
                width: 24px;
                height: 24px;
                border: 0;
                background: url('C:/Truck Stop/truck_stop/src/assets/Icon_Sammlung/11_Profil/delivery-truck-cargo.png');
                background-size: 24px;
                cursor: pointer;
            }
        }
        
        
    }
    .search__block-name{
        display: flex;
        flex-direction: column;
        align-items: center;
        .search__block{
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: relative;
            width: 100%;
            &-input{
                display: flex;
                font-size: 16px;
                padding: 15px 15px;
                position: relative;
                border: 1px solid $c-gray;
                outline-color: $c-gray;
                width: 80%;
            }
            &-label{
                position: absolute;
                right: 30px;
                top: 15px;
                width: fit-content;
                height: fit-content;
                font-size: 16px;
                margin: auto;
                display: block;
                font-weight: 200;
                cursor: pointer;
                z-index: 99;
            }
        }
        button{
            margin-top: 20px;
            background-color: #123456;
        }

    }
    .search__block-route{
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        width: 100%;
        &-result{
            width: 100%;
            position: absolute;
            display: block;
            top: 50px;
            z-index: 99999;
            height: 300px;
            overflow: scroll;
            overflow-x: hidden;
            font-size: 16px;
            background-color: white;
            color: black;
            &--list{
                &-item{
                    font-family: $f-poppins;
                    font-weight: 400;
                    font-size: 14px;
                    color: black;
                    text-align: left;
                    background-color: transparent;
                    width: 100%;
                    margin: 5px 0px;
                    padding: 10px 32px;
                    cursor: pointer;
                    &:hover{
                        background-color: $c-gray;
                    }
                }
            }
        }
        &-start-label{
            position: absolute;
            z-index: 99999;
            top: 15px;
            right: 25px;
            cursor: pointer;
            margin: auto;
            padding: 0px 5px;
            background-color: white;

        }
        &-end-label{
            position: absolute;
            z-index: 99999;
            right: 25px;
            top: 81px;
            cursor: pointer;
            margin: auto;
            padding: 0px 5px;
            background-color: white;
        }
        &-end-result{
            width: 100%;
            position: absolute;
            display: block;
            top: 120px;
            z-index: 9999999;
            height: 300px;
            overflow: scroll;
            overflow-x: hidden;
            background-color: white;
            color: black;

            &--list{
                &-item{
                    font-family: $f-poppins;
                    font-weight: 400;
                    font-size: 14px;
                    color: black;
                    text-align: left;
                    background-color: transparent;
                    width: 100%;
                    margin: 5px 0px;
                    padding: 10px 32px;
                    cursor: pointer;
                    &:hover{
                        background-color: $c-gray;
                    }
                }
            }

        }
        &--button{
            margin-bottom: 15px;
        }
        .search__input{
            margin-bottom: 15px;
        }
    }

    .filter__block{
        &-inner{
            display: flex;
            img{
                margin-right: 5px;
            }
            input{
                margin-right: 5px;
            }
        }
    }
}
</style>