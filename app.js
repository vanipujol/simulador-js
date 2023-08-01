class SignReader {
    constructor(id, word, date) {
        this.id = id;
        this.word = word;
        this.created = date;
    }
}

class SignController {
    constructor() {
        this.currentWords = []
    }
    addWord(word) {
        this.currentWords.push(word);
    }

    getCurrentPhrase() {
        let words = []

        this.currentWords.forEach( sign => {
            words.push(sign.word);
        });

        return words.join(" ");
    }

    reset() {
        this.currentWords = [];
    }

    findSignById(id){
        return this.currentWords.find((el) => el.id === id)
    }

    filterAddedSignToday(){
        let today = new Date().toLocaleDateString();
        let created = this.currentWords.filter((el) => el.created === today);

        let words = []

        created.forEach( sign => {
            words.push(sign.word);
        });


        return words.join(" ");
    }
}

const reader = new SignController();

function main() {

    let word;
    let continueAdd;
    let count = 0;
    let today = new Date().toLocaleDateString()

    do {
        word = prompt("Agrega una palabra para formar tu frase");
        reader.addWord(new SignReader(count, word, today ));
        count = count + 1;
        continueAdd = prompt("Su palabra ingresada: " + word + "\n Desea continuar Si/No").toLowerCase();
    }while (continueAdd !== "no")

    alert ("Su frase ingresada: " + reader.getCurrentPhrase());

    let id = Number(prompt("Ingrese un id para buscar su palabra ingresada"));

    alert("El id encontrado es: " + reader.findSignById(id).word);


    alert("Palabras agregadas hoy: " + reader.filterAddedSignToday());

    reader.reset();

}

main();