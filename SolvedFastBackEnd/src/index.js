import  app  from "./app.js";
const PORT = process.env.PORT || 8000;

async function main() {
  try {

    app.listen(PORT, () => {
      console.log(`Servidor iniciado en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
}

main();