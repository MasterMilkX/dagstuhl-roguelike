import { Wllama } from './node_modules/@wllama/wllama/esm/index.js';
var WLLAMA_INSTANCE = null
var already_loading = false
async function init_llama() {
  const CONFIG_PATHS = {
    'single-thread/wllama.js'       : './node_modules/@wllama/wllama/esm/single-thread/wllama.js',
    'single-thread/wllama.wasm'     : './node_modules/@wllama/wllama/esm/single-thread/wllama.wasm',
    'multi-thread/wllama.js'        : './node_modules/@wllama/wllama/esm/multi-thread/wllama.js',
    'multi-thread/wllama.wasm'      : './node_modules/@wllama/wllama/esm/multi-thread/wllama.wasm',
    'multi-thread/wllama.worker.mjs': './node_modules/@wllama/wllama/esm/multi-thread/wllama.worker.mjs',
  };
  // Automatically switch between single-thread and multi-thread version based on browser support
  // If you want to enforce single-thread, add { "n_threads": 1 } to LoadModelConfig
  const wllama = new Wllama(CONFIG_PATHS);
  // Define a function for tracking the model download progress
  const progressCallback =  ({ loaded, total }) => {
    // Calculate the progress as a percentage
    const progressPercentage = Math.round((loaded / total) * 100);
    // Log the progress in a user-friendly format
    console.log(`Downloading... ${progressPercentage}%`);
  };
  await wllama.loadModelFromUrl(
    "https://huggingface.co/ggml-org/models/resolve/main/tinyllamas/stories15M.gguf", //"https://huggingface.co/ggml-org/models/resolve/main/tinyllamas/stories260K.gguf",
    {
      progressCallback,
    }
  );
  WLLAMA_INSTANCE = wllama
  return wllama
}

init_llama()

async function generate_text(wllama, prompt) {
  console.log("GENERATING FOR ", prompt)
  return await wllama.createCompletion(prompt, {
    nPredict: 50,
    sampling: {
      temp: 0.5,
      top_k: 40,
      top_p: 0.9,
    },
  });
}


// onmessage = async (e) => {
//   if (WLLAMA_INSTANCE == null && already_loading == false) {
//     already_loading = true
//     WLLAMA_INSTANCE = await init_llama();
//   }
//   console.log("DONE INITIALIZING")
//   const response = generate_text(WLLAMA_INSTANCE, e.data)
//   postMessage(response);
// };


// export { generate_text, init_llama }