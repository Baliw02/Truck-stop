import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { latLng } from 'leaflet'
import L from 'leaflet';
import { OpenStreetMapProvider } from 'leaflet-geosearch';


Vue.use(Vuex)



export const store = new Vuex.Store({
    state:{
        days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        day:'',
        iconurl: '',
        provider: new OpenStreetMapProvider(),
        point_arrays:{
            allPoint: [],
            allPointDetail: [],
            allCategory: [],
            filteredCategory: [],
            attributesArray: [],
            currentAttrArray: [],
        },
        point_detail:{
            selectedPin: null,
            pointDetail: {},
            minPagination: 0,
            maxPagination: 5,
            nextPagination: true,
            prevPagination: false,
    
        },
        map:{
            center: latLng(50.472578, 10.283203),
            defaultCenter: latLng(50.472578, 10.283203),
            mapObj: null,
            withPopup: latLng(47.41322, 1.219482),
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            attribution:'&copy; <a href="https://www.openstreetmap.org/#map=10/49.0766/18.5793',
            currentZoom: 6,
    
        },
        mapOptions:{
            zoomSnap: 1,
            zoomDelta: 0.25,
        },
        responses:{
            getStatus: 0,
            getDetailStatus: 0
        },
        search:{
            result: null,
            cityName: '',
            radius: 10,
            pinName: null,
            routeStart: '',
            routeEnd: '',
            routeStartObj: {},
            routeEndObj: {},
            startCoordinate: 0,
            endCoordinate: 0,
            routeObj: '',
            routeTriggered: false,
        },
        menu:{
            loginOpened: false,
            searchOpened: false,
            sideOpened: false,
            filterOpened: false,
            detailOpened: false
        },
        windowWidth: 0,
    },
    getters:{
        filterPin: (state) => {
            state = state.point_arrays;
            return state.allPoint.filter((poi) => {
                if(state.filteredCategory.length === 0){
                    return poi;
                }
                else if(state.filteredCategory.includes(poi.categoryName)){
                    return poi;
                }
            });
        },
        // attrFilterPin: (state) => {
        //     state = state.point_arrays;
        //     return state.allPoint.filter((poi) => {
        //         if(state.currentAttrArray.length === 0){
        //             return poi;
        //         }
        //         else{
        //         }
        //     });
        // }
    },
    mutations:{
        setWindowWidth(state, width){
            state.windowWidth = width;
            // console.log('width: ', state.windowWidth);
        },
        setFilterCategory(state, data){
            if(!data.checked){
                let idx = state.point_arrays.filteredCategory.map((item) => item).indexOf(data.catName);
                state.point_arrays.filteredCategory.splice(idx, 1);
            }
            else{
                state.point_arrays.filteredCategory.push(state.point_arrays.allCategory[data.index].name);
            }
        },
        resetFilterCategory(state){
            state.point_arrays.filteredCategory.splice(0, state.point_arrays.filteredCategory.length);
        },
        setAttrFilter(state, data){
            var controller = state.point_arrays.currentAttrArray.map((item) => item.name).includes(data.name);
            if(controller){
                let idx = state.point_arrays.currentAttrArray.map((item) => item.name).indexOf(data.name);
                state.point_arrays.currentAttrArray.splice(idx, 1);
                console.log(state.point_arrays.currentAttrArray);
            }
            else{
                state.point_arrays.currentAttrArray.push(data)
            }
        },
        controlFilterMenu(state){
            if(!state.menu.filterOpened){
                state.menu.filterOpened = true;
            }
            else{
                state.menu.filterOpened = false;
            }
        },

        controlSideMenu(state){
            if(!state.menu.sideOpened){
                state.menu.sideOpened = true;
                state.menu.searchOpened = false;
            }
            else{
                state.menu.sideOpened = false;
            }
        },

        controlLoginMenu(state){
            if(state.menu.searchOpened){
                state.menu.searchOpened = false;
            }
            if(state.menu.sideOpened){
                state.menu.searchOpened = false;
            }
            if(!state.menu.loginOpened){
                state.menu.loginOpened = true;
            }
            else{
                state.menu.loginOpened = false;
            }
        },

        controlSearchMenu(state){
            if(!state.menu.searchOpened){
                state.menu.searchOpened = true;
                state.menu.detailOpened = false;
                state.menu.sideOpened = false;
            }
            else{
                state.menu.searchOpened = false;
            }
        },

        controlDetailMenu(state){
            if(state.point_detail.selectedPin != null){
                state.menu.detailOpened = true;
                if(state.menu.searchOpened){
                    state.menu.searchOpened = false;
                }
            }
            else{
                state.menu.detailOpened = false;
            }
        },

        // Set the map Object, because we need to control the mapview in this store.
        setMapObject(state, map){
            state.map.mapObj = map;
        },

        // Get/set all point into one array.
        setAllPoint(state, points){
            state.point_arrays.allPoint = points;
        },
        // Get all the category into 1 array.
        setAllPointCategory(state, categories){
            state.point_arrays.allCategory = categories;
        },
        setPoiAttributes(state, attribute){
            state.point_arrays.attributesArray = attribute;
        },
        // Get details of one point.
        setPointDetail(state, point){
            state.point_detail.pointDetail = point;
        },

        setRouteObject(state){
            if(state.search.routeTriggered){
                state.search.routeObj.remove();
                state.search.routeTriggered = false;
            }
            state.search.routeTriggered = true;
            state.search.routeObj = L.Routing.control({
                waypoints:[
                    L.latLng(state.search.startCoordinate), 
                    L.latLng(state.search.endCoordinate)
                ],
                lineOptions: {
                    styles: [{ color: 'black', opacity: 1, weight: 3 }]
                },
                // createMarker: function(waypoint) {
                //     const marker = L.marker(waypoint.latLng, { draggable: false, 
                //     icon: L.icon({iconUrl: 'asdas.png', iconSize: [60, 60], iconAnchor: [22,  94]})
                //     });
                //     return marker;
                // }
                /*eslint-disable */
    
                createMarker: function (i, waypoint, n) {
                    const marker = L.marker(waypoint.latLng, {
                    draggable: true,
                    bounceOnAdd: false,
                    bounceOnAddOptions: {
                        duration: 1000,
                        height: 800,
                        function() {
                        (bindPopup(myPopup).openOn(map))
                        }
                    },
                    icon: L.icon({
                        iconUrl: require('@/assets/pinvisited.png'),
                        iconSize:[50, 50],
                        iconAnchor: [30, 50], 
                    })
                    });
                    return marker;
                }
                }).addTo(state.map.mapObj);
        },
        removeRouteObject(state){
            state.search.routeObj.remove();
        },
        // Get the 2 pin statuses, first is for all pin, second is for the detail pin.
        setAllStatus(state, data){
            if(data.getStatus != 0){
                state.responses.getStatus = data.getStatus;
            }
            if(data.getDetailStatus != 0){
                state.responses.getDetailStatus = data.getDetailStatus;
            }
        },

        // Get the pin details
        setSelectedPin(state, pin){
            state.point_detail.selectedPin = pin;
        },

        // Set the map center to custom latlon.
        setMapLatLng(state, data){
            let center = latLng(data.lat, data.lon)

            state.map.center = center;
            state.map.currentLat = data.lat;
            state.map.currentLon = data.lon;
            state.map.currentZoom = data.zoom;
        },

        // Reset pagination when click one pin.
        resetPagination(state){
            state.point_detail.prevPagination = false;
            state.point_detail.nextPagination = true;

            state.point_detail.minPagination = 0;
            state.point_detail.maxPagination = 4;

        },
        controlNextPagination(state){
            if(state.point_detail.maxPagination < state.point_detail.pointDetail.attributes.length){
                state.point_detail.minPagination += 4
                state.point_detail.maxPagination += 4
                state.point_detail.prevPagination = true
                if(state.point_detail.maxPagination >= state.point_detail.pointDetail.attributes.length || state.point_detail.maxPagination === state.point_detail.pointDetail.attributes.length){
                    state.point_detail.minPagination += 0
                    state.point_detail.maxPagination += 0
                    state.point_detail.nextPagination = false
                }
            }

        },
        controlPrevPagination(state){
            if(state.point_detail.minPagination >= 0 && state.point_detail.maxPagination >= 6){
                state.point_detail.minPagination -= 4;
                state.point_detail.maxPagination -= 4;
                state.point_detail.prevPagination = true;
                state.point_detail.nextPagination = true;
                if(state.point_detail.minPagination === 0){
                    state.point_detail.minPagination = 0;
                    state.point_detail.maxPagination = 4;
                    state.point_detail.prevPagination = false;
                }
            }
        },
        setSearchPinName(state, data){
            state.search.pinName = data;
        },
        resetSearchPinName(state){
            state.search.pinName = null;
        },
        // Set search variables
        setSearchCityName(state, data){
            state.search.cityName = data;
        },
        setSearchRadius(state, radius){
            state.search.radius = radius;
            // console.log(radius);
        },
        setStartRoute(state, data){
            state.search.routeStart = data;
        },
        setEndRoute(state, data){
            state.search.routeEnd = data;
        },
        setStartRouteData(state, data){
            // let center = latLng(data.lat, data.lon)
            state.search.routeStartObj = data;
            state.search.routeStart = data.label;
            state.search.startCoordinate = latLng(data.y, data.x);
            // console.log("start: ", data);
        },
        resetStartRouteData(state){
            if(state.search.routeStartObj != null){
                state.search.routeStartObj = null;
                state.search.routeStart = null;
                state.search.startCoordinate = null;    
            }
        },
        setEndRouteData(state, data){
            state.search.routeEndObj = data;
            state.search.routeEnd = data.label;
            state.search.endCoordinate = latLng(data.y, data.x);
            // console.log("end: ", data);
        },
        resetEndRouteData(state){
            if(state.search.routeEndObj != null){
                state.search.routeEndObj = null;
                state.search.routeEnd = null;
                state.search.endCoordinate = null;    
            }
        },
        resetCoordinates(state){
            if(state.search.startCoordinate != 0){
                state.search.startCoordinate = 0;
            }
            if(state.search.endCoordinate != 0){
                state.search.endCoordinate = 0;
            }
        },
        // Set search result, and the city name to the result label
        setSearchData(state, data){
            if(data.label != undefined || data.label != null){
                state.search.cityName = data.label;
            }
            if(data.results != undefined || data.results != null){
                state.search.result = data.results;
            }
        },

        // Reset search result, and get to the default center with the default zoom.
        resetSearchData(state){
            state.search.result = null;
            state.search.cityName = '';

            state.map.center = state.map.defaultCenter;
            state.map.currentZoom = 6;
        },
        resetSelectedPin(state){
            state.point_detail.selectedPin = null;
        }
    },
    actions:{
        // Get all the points, with commiting the mutation.    
        async getPoi({commit}){
            axios.get('https://autohofe.webapix.hu/en/api/v3/points-of-interest').then(res => {
                commit('setAllPoint', res.data.points);
                commit('setAllStatus', {"getStatus": res.status, "getDetailStatus": 0},);
            });
        },

        // Get all the categories, with commiting the mutation.    
        async getCategory({commit}){
            axios.get('https://autohofe.webapix.hu/en/api/point-of-interest-categories').then(res => {
                commit('setAllPointCategory', res.data);
            });
        },

        // Get the details of one point. 
        async getDetailapi({commit}){
            let detail = this.state.point_detail;

            axios.get('https://autohofe.webapix.hu/en/api/v2/points-of-interest/' + detail.selectedPin).then(res => {
                commit('setPointDetail', res.data);
                commit('setAllStatus', {"getStatus": 0, "getDetailStatus": res.status} );
            });
        },
        async sendLoginData(){
            axios.post('http://autohofe.webapix.hu/en/api/login').then(res => {
                console.log(res)
            })
        },
        async getPoiAttributes({commit}){
            axios.get('https://autohofe.webapix.hu/en/api/point-of-interest-categories/5/attributes').then(res => {
                commit('setPoiAttributes', res.data);
                // console.log(this.state.point_arrays.attributes_array);
            })
        },
        // Set the map center with the custom latLng.
        viewController(){
            this.state.map.mapObj.setView(this.state.map.center, this.state.map.currentZoom);
            
        },        
    }
})


