<script setup lang="ts">

import { Ref, computed, onMounted, ref } from "vue";
import "//unpkg.com/mathlive?module";
import { MathfieldElement } from "mathlive";
import { ce } from "../compute";
import { BoxedExpression } from "@cortex-js/compute-engine";

const mf = ref(null) as unknown as Ref<MathfieldElement>;

const alias = ref("_1") as unknown as Ref<string>;
const output = ref(null) as Ref<BoxedExpression | null>;
// const numeric = ref(null) as Ref<BoxedExpression | null>;


const exec = ref(0) as unknown as Ref<number>;
const execFormatted = computed(() => {
    return `[${exec.value ? exec.value : " "}]`;
});

function getRaw() {
    if (!mf.value) return;
    let val = mf.value.getValue();
    if (val.startsWith("$$")) val = val.slice(2);
    if (val.endsWith("$$")) val = val.slice(0, -2);
    return val;
}
function copyLatex() {
    let val = getRaw();
    if (!val) return;
    navigator.clipboard.writeText(val);
}

function openWolfram() {
    // let e = new MathfieldElement();
    let val = getRaw();
    if (!val) return;
    window.open(`https://www.wolframalpha.com/input/?i=${encodeURIComponent(val)}`);
}

function run(eager=false) {
    let latex = getRaw();
    if (!latex) return;
    let res = ce.parse(latex);
    console.log(res);
    // let simpler = res.simplify();

    // TODO if eager evaluation, assume all variables that have been previously declared
    if(eager) {
        // TODO 
    } else {
        let evald = res.evaluate();
        console.log(evald);
        output.value = evald;
        console.log(evald.latex);

        // numeric.value = evald.N();
        // console.log(numeric.value);
    }
    
}

onMounted(() => {
    
    // dumb hack to fix the cursor
    mf.value.focus();
    window.mathVirtualKeyboard.hide();
    mf.value.blur();
});
</script>

<template>
    <div class="cell-div">
        <div class="exec-div" @click="run(false)">
            <span>{{ execFormatted }}</span>
        </div>
        <div class="code-div">
            <pre>
                <input spellcheck="false" v-model=alias>
                <span>= </span>
            </pre>
        </div>
        <div class="math-div">
            <math-field class="math-field" ref="mf">\int_3^9\cos(3x)dx</math-field>
        </div>
        <div class="ma-copy">
            <button @click="copyLatex" title="LaTeX (Desmos)">
            <!-- <font-awesome-icon icon="fa-regular fa-copy" /> -->
            <img src="../assets/copy-regular.svg" alt="copy">
            </button>
        </div>
        <div class="wolfram-link">
            <button @click="openWolfram" title="WolframAlpha">W</button>
        </div>
    </div>
</template>

<style scoped>


.math-field {
    min-width: 20vw;
    /* min-height: 3em; */
}

/* .math-div {
} */

.cell-div {
    display: flex;
    flex-direction: row;
    align-items: center;
    min-height: 4em;
    gap: 0.4em;
    border: 1px solid red;
    padding: 0.4em;
}

.ma-copy {
    cursor: pointer;
}
/* .wolfram-link button {
    color: #ff2e2e;
} */

.code-div pre, .exec-div pre {
    display: flex;
    flex-basis: min-content;
    font-family: monospace;
    padding: 4px;

}
.code-div pre input, .code-div pre span {
    resize: none;
    background-color: #f0f0f0;
    font-family: monospace;
    border: none;
    padding: none;
}
.exec-div span {
    display: flex;
    flex-basis: min-content;
    font-family: monospace;
    padding: 4px;
    cursor: pointer;

}
.code-div pre input {
    display: flex;
    flex-basis: min-content;
    width: 1.6em;
}
.code-div pre input:focus-visible {
    outline: #cccccc solid 1px;
}
</style>
