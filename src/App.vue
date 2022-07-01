<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  data(){
    return{
    }
  },
  created(){
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },
  methods:{
    handleResize(){
      this.windowWidthValue = window.innerWidth;
    }
  },
  computed:{
    windowWidthValue: {
      get() {return this.$store.state.windowWidth},
      set( value ) {this.$store.commit('setWindowWidth', value);}
    }
  },
  //setWindowWidth

}
</script>

<style lang="scss">
@import './components/styles/variables.scss';
@import './checkbox.scss';
#app {
  font-family: $f-poppins;
  overflow-x: hidden;
}
html{
  overflow-x: hidden;
}
body{
  margin:0;
  overflow-x: hidden;
}
ul{
  list-style-type: none;
  padding: 0;
}
.leaflet-routing-container{
  display: none;
}
</style>
