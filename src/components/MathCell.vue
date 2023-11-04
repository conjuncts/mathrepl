<script setup lang="ts">

import { Ref, computed, onMounted, ref } from "vue";
import "//unpkg.com/mathlive?module";
import { MathfieldElement, renderMathInElement } from "mathlive";
import { ce } from "../compute";
import { BoxedExpression, Rational } from "@cortex-js/compute-engine";
import type { Complex } from 'complex.js';
import type { Decimal } from 'decimal.js';
import { numericals, registerVariable } from "../registry";

const mf = ref(null) as unknown as Ref<MathfieldElement>;
const mfOut = ref(null) as unknown as Ref<HTMLSpanElement>;

const alias = ref("_0") as unknown as Ref<string>;
const simplified = ref(null) as Ref<BoxedExpression | null>;
const simplifiedNumeric = ref(null) as Ref<BoxedExpression | null>;
// const numeric = ref(null) as Ref<BoxedExpression | null>;

const props = defineProps(['insertId']);

const exec = ref(null) as unknown as Ref<number | null>;
const execFormatted = computed(() => {
    return `[${exec.value != null ? exec.value : " "}]`;
});

const emit = defineEmits(['move-to-next', 'move-to-prev']);
function getRaw() {

    // if multi line, just take the last one as evaluation (TODO)
    let mfe = mf.value;
    if (!mfe) return;

    (window as any).mfe = mfe; // debug

    let val = mfe.getValue();

    if((mfe as any)._mathfield.model.root.type == 'array'
        && (mfe as any)._mathfield.model.root.array.length > 0) {
        // the array contains stuff I can't immediately process
        // screw it, let's process latex
        
        if(val.startsWith('\\begin{lines}') && val.endsWith('\\end{lines}')) {
            let start = '\\begin{lines}'.length;
            let end = val.length - '\\end{lines}'.length;
            val = val.substring(start, end);
            let lines = val.split('\\\\');
            // \\\\ serves as a newline
            // TODO put all lines in a for loop to evaluate
            val = lines[lines.length - 1];
        }
    } 
    

    if (val.startsWith("$$")) val = val.slice(2);
    if (val.endsWith("$$")) val = val.slice(0, -2);
    return val;
}
function copyLatex(output=false) {
    let val = output ? simplified.value?.latex : getRaw();
    if (!val) return;

    navigator.clipboard.writeText(val);
}

function openWolfram(output=false) {
    // let e = new MathfieldElement();
    let val = output ? simplified.value?.latex : getRaw();
    if (!val) return;
    
    window.open(`https://www.wolframalpha.com/input/?i=${encodeURIComponent(val)}`);
}

type Numeric = number | Decimal | Complex | Rational | null;
function constructOutputLatex(alias: string, simplExpr: BoxedExpression, _numExpr: BoxedExpression, 
        raw: Numeric) {
    
    let numerical = null;
    let outputLatex = null;
    if (ce.isBignum(raw)) {
        numerical = raw.toNumber();
        outputLatex = '= ' + simplExpr.latex + '\\approx ' + numerical;
    } else if (ce.isComplex(raw)) {
        // numerical = 
        outputLatex = '= ' + raw.re + '+' + raw.im + ' i';
    } else if (Array.isArray(raw)) { // rational
        // @ts-ignore: okay since they're either both numbers or both bignums
        numerical = raw[0] / raw[1]; 
        outputLatex = '= ' + simplExpr.latex + ' \\approx ' + numerical;
    } else if(raw == null){
        numerical = null;
        outputLatex = '= ...';
    } else {
        numerical = raw; // machine number
        outputLatex = '= ' + numerical;
    }

    if(outputLatex == null) {
        return ['', numerical];
    }
    // alias
    outputLatex = alias + ' ' + outputLatex;
    return ['$$' + outputLatex + '$$', numerical];

}
function runCell(eager=true) {
    let latex = getRaw();
    if (!latex) return;
    let res = ce.parse(latex); // (1): raw latex
    console.log(res);
    // let simpler = res.simplify();

    // TODO if eager evaluation, assume all variables that have been previously declared
    let subbed = res;     // (2): substituted
    if(eager) {
        console.log("try sub");
        for (let x of numericals.keys()) {
            let val = numericals.get(x);
            if (val && res.freeVariables.includes(x)) {
                console.log("substituting: " + x + " -> " + val);
                let subbed = {} as any;
                subbed[x] = val;
                res = res.subs(subbed);
            }
        }
    }

    let evald = subbed.simplify(); // (3): simplified

    console.log(`simplified: ${evald.latex}`, evald);
    simplified.value = evald;
    let N = simplifiedNumeric.value = evald.N(); // (4): numerical expression

    let raw = simplifiedNumeric.value?.numericValue; // (5): numerical value
    console.log(raw);


    let [outputLatex, numbered] = constructOutputLatex(alias.value, evald, N, 
            raw);
    if(outputLatex == null) {
        outputLatex = '';
    }
    mfOut.value.innerText = outputLatex;
    // let ele = mf.value;
    // if (!ele) return;
    renderMathInElement(mfOut.value);

    exec.value = (window as any).runNum++;

    registerVariable(alias.value, numbered, evald.latex);

}

onMounted(() => {
    
    // dumb hack to fix the cursor
    let mfe = mf.value;
    mfe.mathVirtualKeyboardPolicy = "manual";
    mfe.focus();

    // window.mathVirtualKeyboard.hide();
    mfe.blur();
    alias.value = "V_" + props.insertId;

    // custom keybindings
    // https://cortexjs.io/mathlive/guides/shortcuts/
    // console.log(mfe.keybindings);
    mfe.keybindings = mfe.keybindings.filter((x: any) => (x.key != 'ctrl+[Enter]') 
                    && (x.key != 'cmd+[Enter]'));
    mfe.keybindings = [
        ...mfe.keybindings,
        { key: '[Enter]', ifMode: 'math', command: 'addRowAfter' },
        {key: 'shift+[Enter]', ifMode: 'math', command: 'addRowAfter'} // rebind shift-enter
    ];

    // events: https://cortexjs.io/mathlive/guides/interacting/
    // https://cortexjs.io/compute-engine/guides/augmenting/
    mfe.addEventListener("move-out", (e: any) => {
        // console.log(e);
        // console.log(mf.value.getValue());
        // runCell();
        mfe.blur();
        console.log(e);
        if(e.detail.direction == 'backward') {
            emit('move-to-prev', props.insertId); // this id is not used atm
        } else {
            emit('move-to-next', props.insertId);

        }
    });

    mfe.addEventListener('keydown', (ev: KeyboardEvent) => {
        // console.log(keystroke);
        // console.log(ev);
        if(ev.ctrlKey && ev.key == 'Enter') {
            mfe.blur();
            emit('move-to-next', props.insertId);

            runCell();
        }
    });

});

function mfFocus() {
    let mfe = mf.value;
    if (!mfe) return;
    mfe.focus();
}

defineExpose({
    mfFocus, getRaw, runCell
});
// created(() => {

// });
</script>

<template>

    <div class="cell-div">
    <div class="input-div">
        <div class="exec-div" @click="runCell(false)">
            <span ref="exec-div-cell">{{ execFormatted }}</span>
        </div>
        <div class="code-div">
            <pre>
                <input spellcheck="false" v-model="alias">
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
    <div class="output-div" v-show="simplified">
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
