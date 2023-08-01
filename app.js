// Clase SignReader representa una palabra ingresada con su id, palabra y fecha de creación.
class SignReader {
    constructor(id, word, date) {
        this.id = id;
        this.word = word;
        this.created = date;
    }
}

// Clase SignController para administrar las palabras ingresadas y realizar operaciones sobre ellas.
class SignController {
    constructor() {
        this.currentWords = [];
    }

    // Agrega una palabra a la lista de palabras actuales.
    addWord(word) {
        this.currentWords.push(word);
    }

    // Obtiene la frase actual formada por todas las palabras ingresadas.
    getCurrentPhrase() {
        let words = [];
        this.currentWords.forEach(sign => {
            words.push(sign.word);
        });
        return words.join(" ");
    }

    // Reinicia la lista de palabras actuales.
    reset() {
        this.currentWords = [];
    }

    // Filtra y devuelve las palabras ingresadas hoy como una frase.
    filterAddedSignToday() {
        let today = new Date().toLocaleDateString();
        let created = this.currentWords.filter((el) => el.created === today);
        let words = [];
        created.forEach(sign => {
            words.push(sign.word);
        });
        return words.join(" ");
    }
    // Busca una palabra por su ID.
    findSignById(id) {
        return this.currentWords.find((el) => el.id === id);
    }
}

// Instancia del controlador de palabras.
const reader = new SignController();

// Función principal del programa.
function main() {
    let word;
    let continueAdd;
    let count = 0;
    let today = new Date().toLocaleDateString();

    // Ciclo para solicitar y agregar palabras hasta que el usuario decida no continuar.
    do {
        word = prompt("Agrega una palabra para formar tu frase");
        reader.addWord(new SignReader(count, word, today));
        count = count + 1;
        continueAdd = prompt("Su palabra ingresada: " + word + "\n Desea continuar Si/No").toLowerCase();
    } while (continueAdd !== "no");

    // Mostrar la frase ingresada por el usuario.
    alert("Su frase ingresada: " + reader.getCurrentPhrase());

    // Mostrar las palabras agregadas hoy.
    alert("Palabras agregadas hoy: " + reader.filterAddedSignToday());

    // Solicitar un ID y buscar la palabra correspondiente.
    let id = Number(prompt("Ingrese un id para buscar su palabra ingresada"));
    alert("El id encontrado es: " + reader.findSignById(id).word);

    // Reiniciar el lector para una nueva sesión.
    reader.reset();
}

// Ejecutar la función principal.
main();