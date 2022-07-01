<template>
    <div v-if="loginOpened" class="login__block-inner">
        <div class="login__block-inner-close" @click="openLogin">
            <font-awesome-icon :icon="['fas', 'times']" />                
        </div>
        <div class="login__block-inner--title">
            <h2>Welcome, sign in!</h2>
        </div>
        <label for="username">Username</label>
        <input name="username" type="text" v-model="username">
        <label for="password">Password</label>
        <input type="password" v-model="password"><br>
        <button @click="sendLoginData()">login</button>
    </div>
</template>

<script>
export default {
    data(){
        return{
            username: '',
            password: ''
        }
    },
    methods:{
        openLogin(){
            this.$store.commit("controlLoginMenu");
        },
        sendLoginData(){
            this.$store.dispatch('sendLoginData');
        }
    },
    computed:{
        loginOpened: {
            get() {return this.$store.state.menu.loginOpened},
            set() {this.$store.commit('controlLoginMenu');}
        }
    }
}
</script>
<style lang="scss" scoped>
@import './styles/variables.scss';

.login__block{
    &-inner{
        color: black;
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 30px;
        height: fit-content;
        width: 30%;
        margin: auto;
        background-color: white;
        z-index: 99999;
        border-radius: 14px;
        &-close{
            position: absolute;
            display: block;
            font-size: 20px;
            color: $c-theme;
            right: 15px;
            top: 15px;
            margin: auto;
            cursor: pointer;
        }
        &--title{
            margin: 0;
        }
        input{
            display: flex;
            font-size: 16px;
            width: calc(100% - 30px);
            padding: 15px 15px;
            border: 1px solid #ececec;
            outline-color: #ececec;
            transition: all .1s linear;
            &:focus{
                border: 1px solid $c-theme;
                outline-color: $c-theme;

            }
        }
        button{
            width: fit-content;
            font-size: 18px;
        }
    }
}
</style>