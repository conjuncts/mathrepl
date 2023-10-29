<script setup lang="ts">

// import { ref } from "vue";
import MathCell from "./components/MathCell.vue";
import "//unpkg.com/mathlive?module";

// console.log(e);

(window as any).runNum = 0;

// function runCell() {
//     runNum.value++;
// }

</script>

<template>
    <div class="big-holder">
        <h1>MathREPL</h1>

        <MathCell />
        <!-- <HelloWorld msg="MathREPL" /> -->
        <p class="read-the-docs"><a href="https://github.com/conjuncts/mathrepl">Github</a></p>
    </div>
</template>

<style scoped>
.logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
}

.logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
}
.big-holder {
    /* width: 90%; */
    /* left: 5%; */
    margin: auto;

}

</style>
