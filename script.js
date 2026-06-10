function mostrarTreino(titulo, exercicios) {
    
    let listaExercicios = "";
    
    for (let exercicio of exercicios) {
        listaExercicios += `
            <li>
                ${exercicio.nome}
                - ${exercicio.series} séries
                - ${exercicio.repeticoes} repetições
            </li>
        `;
    }

    conteudoTreino.innerHTML = `
        <h2>${titulo}</h2>
        
        <ul>
            ${listaExercicios}
        
        </ul>
    `;

}

const treinoA = [
    {
        nome: "Supino Reto",
        series: 3,
        repeticoes: "10-12"
    },
    
    {   
        nome: "Supino Inclinado",
        series: 3,
        repeticoes: "10-12"
    },

    {
        nome: "Desenvolvimento de Ombros",
        series: 3,
        repeticoes: "10-12"
    },

    {
        nome: "Elevação Lateral",
        series: 3,
        repeticoes: "12-15"
    },

    {
        nome: "Tríceps na Polia",
        series: 3,
        repeticoes: "10-12"
    }
];

const treinoB = [
    "Puxada Alta na Polia",
    "Remada Baixa na Polia",
    "Remada Alta",
    "Rosca Direta",
    "Rosca Martelo"
];

const treinoC = [
    "Leg Press 45º",
    "Cadeira Extensora",
    "Cadeira Flexora",
    "Panturrilha em Pé",
    "Abdominal Infra",
    "Prancha Isométrica"
];


const botaoTreinoA = document.getElementById("btnTreinoA");
const botaoTreinoB = document.getElementById("btnTreinoB");
const botaoTreinoC = document.getElementById("btnTreinoC");

const conteudoTreino = document.getElementById("conteudoTreino");

console.log(botaoTreinoA);
console.log(botaoTreinoB);
console.log(botaoTreinoC);

botaoTreinoA.addEventListener("click", function() {
    mostrarTreino("Treino A", treinoA);
    
});

botaoTreinoB.addEventListener("click", function() {
    mostrarTreino("Treino B", treinoB);
});

botaoTreinoC.addEventListener("click", function() {
    mostrarTreino("Treino C", treinoC);

});
