<script setup lang="ts">

// import { ref } from "vue";
// import { ref, Ref } from "vue";
import { onMounted, ref } from "vue";
import MathCell from "./components/MathCell.vue";
import Nav from "./components/Nav.vue";
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

onMounted(() => {
    
});
</script>

<template>
    <Nav></Nav>

    <div class="big-holder">
        
        <!-- <MathGUI /> -->
        <MathCell v-for="(cell, index) in cells" :key="cell['insertId']" 
            :insert-id="cell['insertId']">

            <template v-slot:content>
                {{ cell['txt'] }}
            </template>
            <template v-slot:inserts>
                <div class="btn-hider">
                    <button class="insert-btn" @click="insertBelow(index)">Insert Math</button>
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
    /* margin: auto; */
    max-width: 1280px;
    margin: 0 auto;



}

button {
    opacity: 0;
}
button:hover {
    opacity: 1;
    transition: all 0.5s;
}
.insert-btn {
    padding: 0.2em 0.5em 0.2em 0.5em;
    margin: 2px;
    border-radius: 0.2em;
    font-weight: normal;
    font-size: 0.8em;
    /* font-family: 'Roboto', sans-serif; */
}
</style>
