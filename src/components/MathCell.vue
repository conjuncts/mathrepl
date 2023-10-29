<script setup lang="ts">

import { Ref, computed, onMounted, ref } from "vue";
import "//unpkg.com/mathlive?module";
import { MathfieldElement, renderMathInElement } from "mathlive";
import { ce } from "../compute";
import { BoxedExpression } from "@cortex-js/compute-engine";

const mf = ref(null) as unknown as Ref<MathfieldElement>;
const mfOut = ref(null) as unknown as Ref<HTMLSpanElement>;

const alias = ref("_1") as unknown as Ref<string>;
const output = ref(null) as Ref<BoxedExpression | null>;
const outputLatex = ref(null) as Ref<string | null>;
const outputNumeric = ref(null) as Ref<BoxedExpression | null>;
// const numeric = ref(null) as Ref<BoxedExpression | null>;


const exec = ref(null) as unknown as Ref<number | null>;
const execFormatted = computed(() => {
    return `[${exec.value != null ? exec.value : " "}]`;
});

function getRaw() {
    if (!mf.value) return;
    let val = mf.value.getValue();
    if (val.startsWith("$$")) val = val.slice(2);
    if (val.endsWith("$$")) val = val.slice(0, -2);
    return val;
}
function copyLatex(output=false) {
    let val = output ? outputLatex.value : getRaw();
    if (!val) return;

    navigator.clipboard.writeText(val);
}

function openWolfram(output=false) {
    // let e = new MathfieldElement();
    let val = output ? outputLatex.value : getRaw();
    if (!val) return;
    
    window.open(`https://www.wolframalpha.com/input/?i=${encodeURIComponent(val)}`);
}

function runCell(eager=false) {
    let latex = getRaw();
    if (!latex) return;
    let res = ce.parse(latex);
    console.log(res);
    // let simpler = res.simplify();

    // TODO if eager evaluation, assume all variables that have been previously declared
    if(eager) {
        // TODO 
    }
    let evald = res.simplify();
    console.log(evald);
    output.value = evald;
    console.log(evald.latex);
    outputLatex.value = evald.latex;
    outputNumeric.value = evald.N();
    // numeric.value = evald.N();
    console.log(outputNumeric.value);

    
    // let latex = evald.latex;

    mfOut.value.innerText = '$$' + (evald.isExact ? '=' : '\\approx')
        + evald.latex + '$$';

    // let ele = mf.value;
    // if (!ele) return;
    renderMathInElement(mfOut.value);
    // , {
    //     delimiters: [
    //         { left: "$$", right: "$$", display: true },
    //         { left: "$", right: "$", display: false },
    //     ],
    // });

    exec.value = (window as any).runNum++;

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
    <div class="input-div">
        <div class="exec-div" @click="runCell(false)">
            <span ref="exec-div-cell">{{ execFormatted }}</span>
        </div>
        <div class="code-div">
            <pre>
                <input spellcheck="false" v-model=alias>
                <span>= </span>
            </pre>
        </div>
        <div class="math-div">
            <math-field class="math-field" ref="mf">
                <slot name="content"/>
            </math-field>
        </div>
        <div class="ma-copy">
            <button @click="copyLatex(false)" title="LaTeX (Desmos)">
            <!-- <font-awesome-icon icon="fa-regular fa-copy" /> -->
            <img src="../assets/copy-regular.svg" alt="copy">
            </button>
        </div>
        <div class="wolfram-link">
            <button @click="openWolfram(false)" title="WolframAlpha">W</button>
        </div>
    </div>
    <div class="output-div" v-show="output">
        <span ref="mfOut" style="flex-grow: 1;"></span>
                <!-- <math-field class="math-field" readonly ref="mfOut" v-if="outputLatex"
                math-virtual-keyboard-policy="manual"> {{ outputLatex }}</math-field> -->
        <div class="cell-buttons">
            <button @click="copyLatex(true)" title="LaTeX (Desmos)">
            <img src="../assets/copy-regular.svg" alt="copy">
            </button>
            <button @click="openWolfram(true)" title="WolframAlpha">W</button>
        </div>
    </div>
    </div>
    <slot name="inserts"/>

</template>

<style scoped>

.cell-div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.4em;
    border: 1px solid grey;
    padding: 0.4em;
}
.math-field {
    min-width: 20vw;
    flex-grow: 1;
    /* min-height: 3em; */
}

/* .math-div {
} */

.input-div {
    display: flex;
    flex-direction: row;
    align-items: center;
    min-height: 4em;
    gap: 0.4em;
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
.output-div {
    align-self: stretch;
    /* border-top: 1px solid grey; */
    border: 1px solid grey;
    padding: 0.4em 0.4em 0.4em 4em;
    display: flex;
    flex-direction: row;
    /* background-color: #eee; */
}   
button {
    padding: 0.4em 0.8em;
}
.cell-buttons {
    display: flex;
    flex-direction: row;
    gap: 0.4em;
    /* padding-right: 0.4em; */

}
</style>
