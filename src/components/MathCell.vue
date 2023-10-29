<script setup lang="ts">

import { Ref, onMounted, ref } from "vue";
import "//unpkg.com/mathlive?module";
import { MathfieldElement } from "mathlive";

const mf = ref(null) as unknown as Ref<MathfieldElement>;

function copyLatex() {
    if(!mf.value) return;
    let val = mf.value.getValue();
    if(val.startsWith("$$")) val = val.slice(2);
    if(val.endsWith("$$")) val = val.slice(0, -2);
    navigator.clipboard.writeText(val);
}

function openWolfram() {
    // let e = new MathfieldElement();
    console.log(mf.value.getValue());
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
        <div class="exec-div">
        <pre>
            <input spellcheck="false" value="_1 = ">
        </pre>
        </div>
        <div class="code-div">
            <pre>
                <input spellcheck="false" value="_1 = ">
            </pre>
        </div>
        <div class="math-div">
            <math-field class="math-field" ref="mf">\int_3^9\cos(3x)dx</math-field>
        </div>
        <div class="ma-copy">
            <button @click="copyLatex">
            <font-awesome-icon icon="fa-regular fa-copy" />
            LaTeX (Desmos)
            </button>
        </div>
        <div class="wolfram-link">
            <button @click="openWolfram">WolframAlpha</button>
        </div>
    </div>
</template>

<style scoped>


.math-field {
    min-width: 12em;
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

.code-div pre {
    display: flex;
}
.code-div pre input {
    font-family: monospace;
    resize: none;
    background-color: #f0f0f0;
    border: none;
    width: 3em;
    padding: 4px;
}
.code-div pre input:focus-visible {
    outline: #cccccc solid 1px;
}
</style>
