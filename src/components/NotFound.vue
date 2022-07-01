<template>
    <div class="not-found">
        404 page is not found!
    </div>
</template>
<script>
export default {
    mounted(){
        document.title = 'Truck Stop | ' + this.$route.name[0].toUpperCase() + this.$route.name.slice(1);
    }
}
</script>

<style lang="scss" scoped>

</style>