<template>
    <div class="navbar">
        <div class="navbar__block-left">
            <transition name="fadeOut">
                <div v-if="!sideOpened" @click="openSide()" class="navbar__block-left-open">
                    <font-awesome-icon :icon="['fas', 'bars']" />
                </div>
            </transition>
            <transition name="fadeInOut">
                <div v-if="sideOpened" class="navbar__block-left-inner">
                    <font-awesome-icon :icon="['fas', 'times']" class="navbar__block-left-inner-close" @click="openSide()" />
                    <transition name="close">
                        <SideBar />
                    </transition>
                    <!-- <ul>
                        <li v-for="item in menuItem" :key="item.item">{{item.item}}</li>
                    </ul> -->
                </div>
            </transition>
        </div>
        <div class="navbar__logo">
            <a href="http://localhost:8080/"><img :src="require('C:/Truck Stop/truck_stop/src/assets/navlogo.png')" alt="App logo on header"></a>
        </div>
        
        <div class="navbar__block-right">
            <!-- <div class="login__block">
                <div class="login__block-icon" @click="openLogin">
                    <font-awesome-icon :icon="['fas', 'user']" />                
                </div>
                <div class="login__block-inner" v-if="loginOpened"> 
                    <Login />
                </div>
            </div> -->
            <div class="search__block">
                <div class="search__block-icon" @click="openSearch()">
                    <font-awesome-icon :icon="['fas', 'search']" />
                </div>
                <transition name="fadeInOutSearch">
                    <div class="search__block-inner" v-if="searchOpened">
                        <Search />                
                    </div>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Search from './Search';
import SideBar from './SideBar';
// import Login from './Login';

export default {
    data(){
        return{
        }
    },
    components:{
        Search: Search,
        SideBar: SideBar
        // Login: Login
    },
    methods:{
        selectSearch(index){
            this.selectedSearch = this.search[index]
        },
        openSide(){
            this.$store.commit("controlSideMenu");
        },
        openLogin(){
            this.$store.commit("controlLoginMenu");
        },
        openSearch(){
            this.$store.commit("controlSearchMenu");
        },

        sendLogin(){
            axios.post('http://autohofe.webapix.hu/en/api/login', {username: this.username, password: this.password}).then(response => {
                console.log(response)
            })
            
        }
    },
    computed:{
        searchOpened: {
            get() {return this.$store.state.menu.searchOpened},
            set() {this.$store.commit('controlSearchMenu');}
        },
        sideOpened: {
            get() {return this.$store.state.menu.sideOpened},
            set() {this.$store.commit('controlSideMenu');}
        },
        loginOpened: {
            get() {return this.$store.state.menu.loginOpened},
            set() {this.$store.commit('controlLoginMenu');}
        }

    }
}
</script>

<style lang="scss" scoped>
@import './styles/variables.scss';

img{
    width:24px;
    height: 24px;
}

@keyframes bottom-animation{
    from { width: 0px }
    to { width: 20px }
}

.fadeInOut-enter-active{
    animation: slideInOut .1s;
}
.fadeInOut-leave-active{
    animation: slideInOut .1s reverse; 
}
.fadeInOutSearch-enter-active{
    animation: slideInOutSearch .1s;
}
.fadeInOutSearch-leave-active{
    animation: slideInOutSearch .1s reverse; 
}

.fadeOut-enter-active{
    animation: fadeInOut .1s;
}
.fadeOut-leave-active{
    animation: fadeInOut .1s reverse;
}
.close-enter-active{
    animation:fadeInOuts .1s;
}
.close-leave-active{
    animation:fadeInOuts .1s reverse;
}
@keyframes slideInOut{
    from {
        opacity:0;
        transform: translateX(-100%);
    }
    to{
        opacity:1;
        transform: translateX(0);
    }
}
@keyframes slideInOutSearch{
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to{
        transform: translateX(0);
        opacity: 1;
    }
}
@keyframes fadeInOut{
    from {
        opacity:0;
        transform: translateX(302px);
    }
    to{
        opacity:1;
        transform: translateX(0);
    }
}
@keyframes fadeInOuts{
    from {
        opacity:0;
        transform: translateX(-302px);
    }
    to{
        opacity:1;
        transform: translateX(0);
    }
}
.navbar{
    display:flex;
    align-items: center;
    justify-content: right;
    height:60px;
    background-color: white;
    color:#123456;
    width: 100%;
    position: relative;
    &__logo{
        position: absolute;
        width: fit-content;
        height: fit-content;
        display: block;
        margin: auto;
        left: 0;
        right: 0;
        cursor: pointer;
        img{
            width: 90px;
            height: 50px;
        }
    }
    &__block-left{
        color:#003039;
        &-open{
            color:#003039;
            position: absolute;
            top: 15px;
            left: 15px;
            font-size: 20px;
            cursor: pointer;
        }
        &-inner{
            text-align: right;
            display:flex;
            position:absolute;
            top:0;
            left:0;
            z-index: 1001;
            width:320px;
            height: 100vh;
            background-color: white;
            @media screen and (max-width: 550px){
                width: 100%;
            }
            &-close{
                position: absolute;
                right: 0;
                padding:15px;
                height: fit-content;
                width:20px; 
                cursor: pointer;
            }
            ul{
                width: 100%;
                margin-top: 80px;
                padding:0;
                list-style-type: none;
                text-align: left;
                li{
                    color:black;
                    padding: 10px 10px;
                    font-size:18px;
                    font-weight: 500;
                    border-bottom: 1px solid black;
                }
            }
        }
        
    }
    &__block-right{
        display: flex;
        font-family: Roboto;
        justify-content: center;
        width: fit-content;
        margin-right: 15px;
        .login__block-icon{
            font-size: 20px;
            cursor: pointer;
        }
        .search__block-icon{
            width: fit-content;
            font-size: 20px;
            cursor: pointer;
        }
        
    }
}

</style>