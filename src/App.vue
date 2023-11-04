<script setup lang="ts">

// import { ref } from "vue";
// import { ref, Ref } from "vue";
import { Ref, onMounted, ref } from "vue";
import MathCell from "./components/MathCell.vue";
import Nav from "./components/Nav.vue";
import "//unpkg.com/mathlive?module";

// console.log(e);

(window as any).runNum = 0;

const cells = ref([{'txt': "\\int_3^9\\cos(3x)dx", 'insertId': 0},
                    {'txt': "\\frac{3+477}{38}", 'insertId': 1},
                {'txt': "8.314", "insertId": 2}]);

const cellRefs = ref([]) as Ref<any[]>;
// function runCell() {
//     runNum.value++;
// }

// const mySalient = ref(null) as Ref<typeof MathCell | null>;
function insertBelow(idx: number) {
    console.log(idx);
    
    cells.value.splice(idx+1, 0, {'txt': "", 'insertId': cells.value.length});
}
function setItemRef(ele: any, idx: number) {
    // @ts-ignore
    // window.ans = ele;
    // console.log(ele);
    // cellRefs.value.splice(idx, 0, ele);
    if(cellRefs.value.length <= idx) {
        cellRefs.value.push(ele);
    } else {
        cellRefs.value[idx] = ele;
    }

}
function moveToCell(idx: number) {
    // let next = idx //  + 1;
    if(idx < cells.value.length) {
        console.log('moving to next' + idx);
        // @ts-ignore
        // let cell = this.$refs['cell-' + next] as any;
        (window as any).ans = cellRefs; // .value[next];
        let cell = cellRefs.value[idx]; // toRaw(cellRefs.value[next]);
        console.log(cell);
        cell.mfFocus();
    }
}

onMounted(() => {
    
});
</script>

<template>
    <Nav></Nav>

    <div class="big-holder">
        
        <!-- <MathGUI /> -->
        <!-- <template v-for="(cell, index) in cells" :key="cell['insertId']"> -->
                        <!-- ref="cellRefs" -->
        <!-- <MathCell ref="mySalient"></MathCell>
        {{ mySalient }} -->
        <MathCell v-for="(cell, index) in cells" 
                :key="cell['insertId']"
                :ref="(el) => setItemRef(el, index)"
                :insert-id="cell['insertId']"
                @move-to-prev="moveToCell(index - 1)"
                @move-to-next="moveToCell(index + 1)">

                <template v-slot:content>
                    {{ cell['txt'] }}
                </template>
                <template v-slot:inserts>
                    <div class="btn-hider">
                        <button class="insert-btn" @click="insertBelow(index)">Insert Math</button>
                    </div>
                </template>
            </MathCell>
        <!-- </template> -->
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
