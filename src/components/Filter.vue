<template>
    <div class="filter">
        <div class="filter__block-title">
            <h2>CATEGORY FILTER</h2>
        </div>
        <img @click="openFilter()" class="filter-close" src="../assets/Icon_Sammlung/18_Home_Menue_anmelden/close.png" aria-hidden="true" width="15px" height="15px">
        <div class="filter__block">
            <div class="filter__block-item" v-for="(category, index) in getCategory" :key="category.name + index">
                <img :src="category.icon" :alt="category.name + ' icon'" width="16px" height="16px">
                <input class="checkbox" @click="filterPin(!category.isDeleted, index, category.name)" type="checkbox" v-model="category.isDeleted">{{category.name}}
            </div>
        </div>
    </div>
</template>
<script>


export default {
    methods:{
        filterPin(checked, index, catName){
            var pinData = {
                checked: checked,
                index: index,
                catName: catName
            };
            this.$store.commit('setFilterCategory', pinData);
        },
        openFilter(){
            this.$store.commit('resetFilterCategory');
            this.$store.commit('controlFilterMenu');
        },

    },
    mounted(){
        this.$store.dispatch("getCategory");
    },
    computed:{
        getCategory(){
            return this.$store.state.point_arrays.allCategory;
        },

    }
}
</script>
<style lang="scss" scoped>
@import './styles/variables.scss';

.filter{
    width: fit-content;
    padding: 10px;
    font-family: Roboto;
    font-weight: 300;
    background-color: white;
    border: 3px solid rgb(231, 231, 231);
    color:black;
    position: absolute;
    top:60px;
    left:0;
    right: 0;
    margin: auto;
    z-index: 1002;
    width: 40%;
    &-close{
        top: 10px;
        position: absolute;
        right: 10px;
        z-index: 99999;
    }

}
.filter__block{
    display:flex;
    flex-wrap: wrap;
    &-item{
        display:flex;
        flex:50%;
        width:10%;
        position: relative;
        align-items: center;
        img{
            width: 16px;
            height: 16px;
        }
    }    
}
</style>