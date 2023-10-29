<script setup lang="ts">

// import { ref } from "vue";
// import { ref, Ref } from "vue";
import { ref } from "vue";
import MathGUI from "./components/MathGUI.vue";
import "//unpkg.com/mathlive?module";

// console.log(e);

(window as any).runNum = 0;

const cells = ref([0]);
// function runCell() {
//     runNum.value++;
// }

function insertBelow(idx: number) {
    cells.value.splice(idx+1, 0, cells.value[idx]+1);
}
</script>

<template>
    <div class="big-holder">
        <h1>MathREPL</h1>
        
        <!-- <MathGUI /> -->
        <MathGUI v-for="(cell, index) in cells" :key="cell">
            <div class="btn-hider">
                <button @click="insertBelow(index)">Insert Here</button>
            </div>
        </MathGUI>
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

button {
    opacity: 0;
}
button:hover {
    opacity: 1;
    transition: all 0.5s;
}
</style>
