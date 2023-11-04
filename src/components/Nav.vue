<script setup lang="ts">

function openSettings() {

}
</script>

<template>
    <div class="nav">
        <div class="title">
            <h2>MathREPL</h2>
        </div>
        <div class="nav-right">
            <button @click="openSettings()" title="Settings">
            <img src="../assets/gear-solid.svg" alt="copy">
                        <!-- <img src="../assets/copy-regular.svg" alt="copy"> -->

            </button>
        </div>
    </div>
</template>

<style scoped>
.nav {
    display: flex;
    flex-direction: row;
    align-items: center;
    /* padding: 10px; */
    max-width: 100%;

}
.nav-right {
    margin-left: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.4em;
}
</style>