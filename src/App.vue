<script setup lang="ts">

// import { ref } from "vue";
// import { ref, Ref } from "vue";
import { ref } from "vue";
import MathCell from "./components/MathCell.vue";
import "//unpkg.com/mathlive?module";

// console.log(e);

(window as any).runNum = 0;

const cells = ref([{'txt': "\\int_3^9\\cos(3x)dx", 'insertId': 0},
                    {'txt': "\\frac{3+477}{38}", 'insertId': 1},
                {'txt': "8.314", "insertId": 2}]);
// function runCell() {
//     runNum.value++;
// }

function insertBelow(idx: number) {
    console.log(idx);
    
    cells.value.splice(idx+1, 0, {'txt': "", 'insertId': cells.value.length});
}
</script>

<template>
    <div class="big-holder">
        <h1>MathREPL</h1>
        
        <!-- <MathGUI /> -->
        <MathCell v-for="(cell, index) in cells" :key="cell['insertId']" 
            :insert-id="cell['insertId']">

            <template v-slot:content>
                {{ cell['txt'] }}
            </template>
            <template v-slot:inserts>
                <div class="btn-hider">
                    <button @click="insertBelow(index)">Insert Here</button>
                </div>
            </template>
        </MathCell>
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
