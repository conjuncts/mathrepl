// import { ComputeEngine } from
//     'https://unpkg.com/@cortex-js/compute-engine?module';
import { ComputeEngine } from '@cortex-js/compute-engine';


export const ce = new ComputeEngine();
console.log(ce.parse("e^{i\\pi}").N().latex);
// ➔ "-1"
