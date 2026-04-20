const { rateJoke } = require("./rateJoke");
const core = require("@actions/core");

async function run() {
  try {
    // Get inputs
    const joke = core.getInput("joke", { required: true });
    const token = core.getInput("token", { required: true });

    // Rate the joke using GitHub Models
    const rating = await rateJoke(joke, token);

    // ✅ CORRECCIÓN: Convertir el objeto a String JSON
    core.setOutput("result", JSON.stringify(rating)); 
    
  } catch (error) {
    core.setFailed(error.message);
  }
}

module.exports = { run };