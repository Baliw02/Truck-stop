<template>
<div class="wrapper">
    <div class="details" :class="{mobile: windowWidth <= 550}">
        <div class="details__bar" v-if="windowWidth <= 550 && detailOpened " @click="openMobileDetail">
            <div class="details__bar--close-icon" :class="{dropped: mobileDetailOpened}" @click="resetSelectedPin">
                <font-awesome-icon :icon="['fa', 'times']" />
            </div>                        
            {{pointDetail.name}}     
            <div class="details__bar--icon" :class="{dropped: mobileDetailOpened}">
                <font-awesome-icon :icon="['fa', 'angle-up']" />
            </div>                        
        </div>
        <div :class="{'details__mobile-wrapper': windowWidth <= 550, opened: windowWidth <= 550 && mobileDetailOpened}">

            <div class="details__carousel">
                <carousel>
                    <slide v-for="image in pointDetail.images" :key="image">
                        <img :src="image" alt="carousel-image">
                    </slide>
                </carousel>
            </div>
            <div class="details__close">
                <font-awesome-icon :icon="['fas', 'times']" class="close-icon" @click="resetSelectedPin" />
            </div>
            <div class="details__box">
                <div class="details__box-title">
                    <div class="name">{{pointDetail.name}}</div>
                    <div class="category">{{pointDetail.categoryName}}</div>
                </div>
                <div class="details__box-opening">
                    <!--Masodik parameter key, ha az indexet adom keynek nicns error-->
                    <ul class="details__box-opening-list" v-for="(time, index) in pointDetail.openingHours" :key="index">
                        <li class="details__box-opening-list--item" v-if="index != 'season'">{{index}} - {{time.from}}:{{time.until}}</li>
                    </ul>
                </div>
                <!-- You need to login for add rating -->
                <div class="details__box-rating">
                    <button class="details__box-rating-open" @click="openRating()">
                        <div class="details__box-rating-summary-null" v-if="pointDetail.ratings === undefined || pointDetail.ratings === null">
                            Not have enough rating
                        </div>
                        <div class="details__box-rating-summary" v-else>
                            <StarRating :show-rating="false" :star-size="20" :rating="pointDetail.ratings.total" :read-only="true"  />
                            ({{pointDetail.ratings.count}})
                            <div class="details__box-rating-summary-icon" :class="{dropped: showRating}">
                                <font-awesome-icon :icon="['fa', 'angle-right']" />
                            </div>
                        </div>
                    </button>
                    <div class="details__box-rating-details dropdown-list" :class="{active: showRating}" v-if="pointDetail.ratings != undefined || pointDetail.rating != null">
                        <div class="item" v-for="rating in pointDetail.ratings.categories" :key="rating.name">
                            {{rating.name}}
                            <StarRating :show-rating="false" :star-size="20" :rating="rating.rating" :read-only="true"  />
                        </div>
                    </div>
                </div>
                <div class="details__box-route">
                    <button>Route
                        <div class="details__box-route-icon">
                            <font-awesome-icon :icon="['fa', 'angle-right']" />
                        </div>
                    </button>
                </div>
                
                <!-- Dropdown content -->
                <div class="details__box-contact">
                    <button class="details__box-contact-open" @click="openContact()">Contact
                            <div class="details__box-contact-open-icon" :class="{dropped: showContact}">
                                <font-awesome-icon :icon="['fa', 'angle-right']" />
                            </div>
                    </button>
                    <div class="details__box-contact dropdown-list" :class="{active: showContact}">
                        <div class="details__box-contact dropdown--item">{{pointDetail.motorway}} EXIT {{pointDetail.motorwayExit}}</div>
                        <div class="details__box-contact dropdown--item">{{pointDetail.address}}</div>
                        <div class="details__box-contact dropdown--item">{{pointDetail.zip}} {{pointDetail.city}}</div>
                    </div>
                </div>
                <!-- Dropdown content -->
                <div class="features">
                    <button class="features__box-open" @click="openFeatures">
                        Features
                        <div class="features-icon" :class="{dropped: showFeatures}">
                            <font-awesome-icon :icon="['fa', 'angle-right']" />
                        </div>                
                    </button>
                    <div class="details__box-features" v-if="showFeatures">
                        <div class="details__box-features-list">
                            <div class="item" v-for="(feature, index) in pointDetail.attributes" :key="feature.text + index" :class="{active: index <= $store.state.point_detail.maxPagination && index >= $store.state.point_detail.minPagination}">
                                <div class="item--controller" v-if="index <= $store.state.point_detail.maxPagination && index >= $store.state.point_detail.minPagination">
                                    <img class="icon" :src="feature.icon" alt="">{{feature.text}}
                                </div>
                            </div>
                        </div>
                    <div class="details__box-features-pagination">
                        <div @click="backPage()" :class="{'icon':true, 'disabled': !this.$store.state.point_detail.prevPagination}"><font-awesome-icon :icon="['fas', 'angle-left']" /></div>
                        <div @click="nextPage()" :class="{'icon':true, 'disabled': !this.$store.state.point_detail.nextPagination}"><font-awesome-icon :icon="['fas', 'angle-right']" /></div>
                    </div>
                </div>
                
                </div>
                <!-- Login kell -->
                <div class="favourites">
                    <button>Add to favourites</button> 
                </div>
                <!-- Login kell -->
                <div class="edit-detail">
                    <button>Edit Detail</button>
                </div>
                <!-- Login kell -->
                <div class="feedback" v-if="!showFeatures">
                    <button>Feedback</button>
            </div>
        </div>
    </div>
    </div>
</div>
</template>
<script>
// Fontos hogy akkor legyen read only ha nem vagy bejelentkezve
import { Carousel, Slide } from 'vue-carousel' 
import StarRating from 'vue-star-rating'


export default {
    data(){
        return{
            showContact: false,
            showRating: false,
            showFeatures: false,
            mobileDetailOpened: false
        }
    },
    components:{
        StarRating,
        Carousel,
        Slide,

    },
    created(){
    },
    methods:{
        nextPage(){
            this.$store.commit('controlNextPagination');
        },
        backPage(){
            this.$store.commit('controlPrevPagination');            
        },
        openContact(){
            if(!this.showContact) {
                this.showContact = true; 
                this.showRating = false;
                this.showFeatures = false;
            }
            else this.showContact = false;
        },
        openRating(){
            if(!this.showRating){ 
                this.showRating = true;
                this.showContact = false;
                this.showFeatures = false;
            }
            
            else this.showRating = false;
        },
        openFeatures(){
            if(!this.showFeatures){ 
                this.showFeatures = true;
                this.showContact = false;
                this.showRating = false;
            }
            else this.showFeatures = false;
        },
        openMobileDetail(){
            if(!this.mobileDetailOpened){
                this.mobileDetailOpened = true;
            }
            else{
                this.mobileDetailOpened = false;
            }
        },
        resetSelectedPin(){
            this.$store.commit('resetSelectedPin');
            this.$store.commit('controlDetailMenu');
        }
    },
    computed:{
        pointDetail(){
            return this.$store.state.point_detail.pointDetail
        },
        windowWidth:{
            get(){return this.$store.state.windowWidth;},
            set(){this.$store.commit('setWindowWidth');}
        },
        detailOpened: {
            get() {return this.$store.state.menu.detailOpened},
            set() {this.$store.commit('controlDetailMenu');}
        }
    },
}
</script>

<style lang="scss" scoped>
//Dropdown class, ha netan kell meg.
@import './styles/global_classes.scss';
.VueCarousel{
    img{
        width: 320px;
        @media screen and (max-width: 550px){
            width: auto;
            max-width: 550px;
            object-fit: contain;
            object-position: center;
        }
    }
}
.details:not(.mobile){
    text-align: center;
    padding:15px 15px;
    padding-bottom: 0;
    padding-top: 0;
    display:block;
    position:absolute;
    top:60px;
    right:0;
    height: calc(100vh - 60px);
    width:320px;
    background-color: white;
    z-index: 1002;
    color:black;
    font-size:16px;
    .close-icon{
        cursor: pointer;
        display:block;
        font-size: 25px;
        position: absolute;
        top: 5px;
        left: 20px;
        color: #123456;
    }
    .details__box{
        button{
            font-family: $f-poppins;
            background-color:white;
            color:black;
            width: 100%;
            padding: 5px 0px;
            font-size: 18px;
            margin: 5px 0px;
            font-weight: 400;
        }
        &-title{
            margin-bottom: 10px;
            .name{
                text-align: left;
                margin-bottom:-5px;
                font-weight: 600;
            }
            .category{
                text-align: left;
                margin-top:0;
                font-weight: 400;

            }

        }
        &-opening{
            &-list{
                margin:auto;
                list-style-type: none;
                padding-left:0;
                text-align: left;
                .opening-title{
                    font-size:18px;
                }
                &--item{
                    font-size: 16px;
                    text-transform: capitalize;
                    margin-top:2px;
                    margin-bottom: 2px;
                }
            }
        }
        &-rating{
            display:block;
            margin:auto;
            .vue-star-rating{
                justify-content: center;
            }
            
            &-details > .item{
                text-align: left;
                font-size:14px;
                .vue-star-rating{
                    justify-content: left;
                }

            }
            button{
                font-size: 16px;
            }
            &-summary{
                display: flex;
                justify-content: center;
                align-items: center;
                color: black;
                position: relative;
                font-size: 16px;
                &-icon{
                    border-radius: 100%;
                    width: 20px;
                    height: 20px;
                    font-size: 18px;
                    background-color: white;
                    color: black;
                    position: absolute;
                    right: 15px; 
                    transition: all .1s linear;
                    &.dropped{
                        transform: rotate(90deg);
                    }
                    &:hover{
                        transform: rotate(90deg);
                    }

                }
            }
            .dropdown-list.active{
                height: 120px;
                overflow-y: scroll;

            }
        }
        &-rating.none{
            font-size: 16px;
        }
        &-route{
            position: relative;
            &-icon{
                border-radius: 100%;
                width: 20px;
                height: 20px;
                font-size: 16px;
                background-color: white;
                color: black;
                position: absolute;
                right: 15px; 
                top: 10px;
                transition: all .1s linear;
                &.dropped{
                    transform: rotate(90deg);
                }
            }
            button{
                font-size: 16px;
            }
        }
        &-contact{
            &-open{
                position: relative;
                &-icon{
                    border-radius: 100%;
                    width: 20px;
                    height: 20px;
                    font-size: 16px;
                    background-color: white;
                    color: black;
                    position: absolute;
                    right: 15px; 
                    top: 5px;
                    transition: all .1s linear;
                    &.dropped{
                        transform: rotate(90deg);
                    }
                }
            }
            .dropdown--item{
                font-size: 14px;
            }
            button{
                font-size:16px;
                margin-bottom:0;
            }
            
        }
        .features{
            position: relative;
            &-icon{
                border-radius: 100%;
                width: 20px;
                height: 20px;
                font-size: 16px;
                background-color: white;
                color: black;
                position: absolute;
                right: 15px; 
                top: 10px;
                transition: all .1s linear;
                &.dropped{
                    transform: rotate(90deg);
                }
            }
            &__box-open{
                font-size: 16px;
            }
        }
        &-features{
            
            margin-top: 10px;
            transition: all .1s linear;
            &-list{
                min-height: 125px;
            }
            &-list > .item{
                opacity: 0;
                transition: all .2s ease-in-out;
                text-align: left;
                visibility: collapse;
                font-size: 14px;
                .icon{
                    width: 20px;
                    height: 20px;
                }
            }
            &-list > .item.active{
                visibility: visible;
                opacity: 1;
            }
            &-pagination{
                transition: all .1s linear;
            }
            &-pagination > .icon{
                margin-top: 10px;
                margin-bottom: 10px;
                width:24px;
                height: 24px;
                background-color: #123456;
                color:white;
                display:inline-block;
                font-size:16px;
                padding:5px;
                margin-inline: 20px;
                cursor: pointer;
                &.disabled{
                    background-color: gray;
                    touch-action: none;
                    cursor: not-allowed;
                }
            }
        }
    }
    .favourites{
        button{
            font-size: 16px;
        }
    }
    .edit-detail{
        button{
            font-size: 16px;
        }
    }
    .feedback{
        button{
            font-size: 16px;
        }
    }
}
.details{
    &__bar{
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        bottom: 0;
        z-index: 99999;
        background-color: #ffffff;
        width: 100%;
        height: 60px;
        font-weight: 600;
        border-top: 3px solid #ebebeb;
        &--close-icon{
            position: absolute;
            left: 15px;
            font-size: 16px;
        }
        &--icon{
            transition: all .1s linear;
            position: absolute;
            margin: auto;
            right: 15px;
            font-size: 16px;
            &.dropped{
                transform: rotate(180deg);
            }
        }
    }
    .details__mobile-wrapper{
        transition: all .2s linear;
        position: absolute;
        bottom: -1000px;
        z-index: 9999;
        height: calc(100% - 120px);
        width: 100%;
        opacity: 0;
        overflow: scroll;
        overflow-x: hidden;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .details__mobile-wrapper:not(.opened){
    }
    .details__mobile-wrapper.opened{
        opacity: 1;
        padding: 0px 0px;
        bottom: 60px;
        width:100%;
        background-color: white;
        z-index: 1002;
        color:black;
        font-size:18px;
        .details__box{
            width: 100%;
            display: flex;
            flex-direction: column;
            button{
                width: 100%;
                background-color: transparent;
                color: black;
                display: flex;
                align-items: center;
                font-size: 18px;
            }
            &-title{
                padding-left: 15px;
                width: 100%;
                text-align: left;
            }
            &-opening{
                padding-left: 15px;
                text-align: left;
                text-transform: capitalize;
                font-family: $f-poppins;
            }
            &-rating{
                position: relative;
                &-icon{
                    position: absolute;
                    right: 15px;
                    transition: all .1s linear;
                    &.dropped{
                        transform: rotate(90deg);
                    }
                }
            }
            &-contact{
                .dropdown-list{
                    padding-left: 15px;
                }
            }
            &-contact-open{
                position: relative;
                &-icon{
                    position: absolute;
                    right: 15px;
                    transition: all .1s linear;
                    &.dropped{
                        transform: rotate(90deg);
                    }
                }
            }
            .features{
                &__box-open{
                    text-align: left;
                    position: relative;
                    .features-icon{
                        position: absolute;
                        right: 15px;
                        transition: all .1s linear;
                        &.dropped{
                            transform: rotate(90deg);
                        }
                    }

                }
                .details__box-features-list{
                    text-align: center;
                    padding-left: 15px;
                    font-size: 16px;
                    .item{
                        text-align: left;
                        img{
                            width: 16px;
                        }
                    }
                }
                .details__box-features-pagination{
                    text-align: center;
                    display: flex;
                    margin: auto;
                    justify-content: center;
                    .icon{
                        margin: 0px 5px;
                        width: 30px;
                        height: 30px;
                        background-color: black;
                        color: white;
                        font-size: 20px;
                    }
                }
            

            }
            &-route{
                position: relative;
                &-icon{
                    position: absolute;
                    right: 15px;
                    transition: all .1s linear;
                    &.dropped{
                        transform: rotate(90deg);
                    }
                }
            }
        }
        .close-icon{
            cursor: pointer;
            display:block;
            font-size: 25px;
            position: absolute;
            margin: auto;
            top: 15px;
            left: 15px;
        }
    }
    
}
</style>