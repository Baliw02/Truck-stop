<template>
    <div class="sidebar">
        <div class="sidebar__login">
            <div class="sidebar__login-image">
                <img src="../assets/Icon_Sammlung/11_Profil/single-neutral-profile-picture_ETM.png" alt="Login/profile image">
            </div>
            <div class="sidebar__login-title">
                Login
            </div>
        </div>
        <div class="sidebar__list">
            <div class="sidebar__list-block">
                <div class="sidebar__list-block-item" v-for="(item, index) in menuItems" :key="index" @click="selectMenu( index )">
                    <img width="20px" :src="require('../assets/Icon_Sammlung/18_Home_Menue_anmelden/' + item.icon + '.png')" :alt="item.name + 'image'" > {{item.name}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            menuItems: [{icon: 'house-1', name: 'Home', method: 'openHome()'}, {icon: 'search', name: 'Search'}, {icon: 'filter-1', name: 'Filter'}, {icon: 'messages-bubble-square-text', name: 'Notifications'}, {icon: 'like-circle', name: 'Feedback'}, {icon: 'Info', name: 'Imprint'}, {icon: 'Info', name: 'Terms and Conditions'}, {icon: 'Info', name: 'Privacy Policy'}]
        }
    },
    methods:{
        selectMenu(index){
            console.log(this.menuItems[index]);
            if(this.menuItems[index].name.toLowerCase() === 'search'){
                this.openSearch();
            }
            else if(this.menuItems[index].name.toLowerCase() === 'filter'){
                this.openFilter();
            }
        },
        openSearch(){
            this.$store.commit('controlSearchMenu');
        },
        openFilter(){
            this.$store.commit('controlSearchMenu');
            this.$store.commit('controlFilterMenu');
        }
    }
}
</script>

<style lang="scss" scoped>
.sidebar{
    text-align: left;
    width: 100%;
    margin-top: 60px;
    &__login{
        display: flex;
        align-items: center;
        flex-direction: column;
        border-bottom: 1px solid #d8d8d8;
        padding-bottom: 15px;
        cursor: pointer;
        &-image{
            background-color: rgb(207, 207, 207);
            max-width: 96px;
            max-height: 96px;
            border-radius: 100%;
            border: 5px solid rgb(129, 129, 129);
            img{
                opacity: 0.2;
            }
        }
        &-title{
            font-weight: 600;
        }
    }
    &__list{
        &-block{
            cursor: pointer;
            &-item{
                display: flex;
                align-items: center;
                padding: 15px 15px;
                border-bottom: 1px solid #d8d8d8;
                img{
                    margin-right: 10px;
                }
            }
        }
    }
}
</style>