<template lang="pug">
    h1 SiteList
</template>

<script>
export default {
    mounted: async function () {
        await this.loadSite()
    },
    data: function () {
        return { sites: [] }
    },
    methods: {
        loadSite: async function() {
            // await 
        }
    }
}
</script>

<style scoped>
h1{
    color: #999;
}
</style>

