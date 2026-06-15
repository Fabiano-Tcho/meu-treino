function mostrarTreino(titulo, exercicios) {
    
    let listaExercicios = "";
    
    for (let i = 0; i < exercicios.length; i++) {
        const exercicio = exercicios[i];
        const concluido = exercicio.seriesRealizadas === exercicio.series;
        
        listaExercicios += `
            <div class="cartao-exercicio ${concluido ? "cartao-concluido" : ""}">

                <h3>${concluido ? "✅ " : ""}${exercicio.nome}</h3>
           
                <p>${exercicio.series} séries</p>

                <p>${exercicio.repeticoes} repetições</p>

                <p>Séries Realizadas: ${exercicio.seriesRealizadas}/${exercicio.series}</p>

                <p>Carga Atual: ${exercicio.cargaAtual} kg</p>

                <p class="tempo-descanso">
                    Descanso: ${exercicio.descanso} segundos
                </p>

                <button
                    class="btn-descanso"
                    data-indice="${i}">
                    Iniciar Descanso
                </button>
            
                <button
                    class="btn-concluirSerie"
                    data-indice=" ${i}"
                    ${concluido ? "disabled" : ""}>
                    Concluir Série
                </button>

                
            
            </div>

        `;
    }

    let concluidos = 0;
    let totalSeries = 0;
    let seriesRealizadas = 0;

    for (let exercicio of exercicios) {

        totalSeries += exercicio.series;

        seriesRealizadas += exercicio.seriesRealizadas;

        if (
            exercicio.seriesRealizadas === exercicio.series
    ) {
            concluidos++;
        
        }
    }

    const porcentagem = Math.round(
        (seriesRealizadas / totalSeries) * 100
    );

    conteudoTreino.innerHTML = `
        <h2>${titulo}</h2>

        <div class="barra-progresso">
            <div
                class="barra-preenchida"
                style="width: ${porcentagem}%">
            </div>
        </div>

        <p>${porcentagem}% Total</p>

        <p>
            ${seriesRealizadas} de ${totalSeries}
            séries realizadas
        </p>
        
        <p>
            ${concluidos} de ${exercicios.length}
            exercícios concluídos
        </p>

        ${listaExercicios}

        <button id="btnFinalizarTreino">
            Finalizar Treino
        </button>
        
    `;

    const botoesDescanso = document.querySelectorAll(".btn-descanso");
    for (let botao of botoesDescanso) {
        botao.addEventListener("click", function() {
            const indice = Number(botao.dataset.indice);
            const exercicio = exercicios[indice];

            console.log(exercicio);
            console.log("Descanso:", exercicio.descanso)

            if (exercicio.cronometro) {
                clearInterval(exercicio.cronometro);
            }
            let tempo = exercicio.descanso;
            const cartao = botao.closest(".cartao-exercicio");
            const textoDescanso =
                cartao.querySelector(".tempo-descanso");
            
            exercicio.cronometro = setInterval(function() {

            console.log("Tempo:", tempo);

            if (tempo <= 0) {

                console.log("PAROU");

                clearInterval(exercicio.cronometro);

                textoDescanso.textContent =
                    `Descanso: ${exercicio.descanso} segundos`;

                textoDescanso.classList.remove("tempo-alerta");

                return;
            }

            tempo--;

            textoDescanso.textContent =
                `Descanso: ${tempo} segundos`;

            if (tempo <= 10) {
                textoDescanso.classList.add("tempo-alerta");
            }

        }, 1000);
        });
    }

    const botoesConcluir = document.querySelectorAll(".btn-concluirSerie");
    
    for (let botao of botoesConcluir) {
        botao.addEventListener("click", function() {
            const indice = Number(botao.dataset.indice);
            if (
                exercicios[indice].seriesRealizadas < exercicios[indice].series            
            ) {            
                
                exercicios[indice].seriesRealizadas++;
                localStorage.setItem(
                    chaveTreinoAtual,
                    JSON.stringify(treinoAtual)
                );
            }

            mostrarTreino(tituloAtual, treinoAtual);
            console.log(exercicios[indice]);
        });

    }
}

    function finalizarTreino() {

        const confirmar = confirm(
            "Deseja finalizar o treino?"
        );

        if (!confirmar) {
            return;
        }

        console.log("Antes:", treinoAtual);

        for (let exercicio of treinoAtual) {
            exercicio.seriesRealizadas = 0;
        }

        console.log("Depois:", treinoAtual);

        localStorage.setItem(
            chaveTreinoAtual,
            JSON.stringify(treinoAtual)
        );

        mostrarTreino(
            tituloAtual,
            treinoAtual
        );
    }
    

const treinoA = [
    {
        nome: "Supino Reto  (Máquina ou Halteres)",
        series: 3,
        repeticoes: "10-12",
        seriesRealizadas: 0,
        cargaAtual: "",
        descanso: 60,
        gif: "",
        video: "",
        cronometro: null
    },
    
    {   
        nome: "Supino Inclinado com Halteres",
        series: 3,
        repeticoes: "10-12",
        seriesRealizadas: 0,
        cargaAtual: "",
        descanso: 60,
        gif: "",
        video: "",
        cronometro: null
    },

    {
        nome: "Desenvolvimento de Ombros (Máquina ou Halteres)",
        series: 3,
        repeticoes: "10-12",
        seriesRealizadas: 0,
        cargaAtual: "",
        descanso: 60,
        gif: "",
        video: "",
        cronometro: null
    },

    {
        nome: "Elevação Lateral com Halteres",
        series: 3,
        repeticoes: "12-15",
        seriesRealizadas: 0,
        cargaAtual: "",
        descanso: 60,
        gif: "",
        video: "",
        cronometro: null
    },

    {
        nome: "Tríceps na Polia (Barra Reta ou Corda)",
        series: 3,
        repeticoes: "12",
        seriesRealizadas: 0,
        cargaAtual: "",
        descanso: 60,
        gif: "",
        video: "",
        cronometro: null
    }
];

const treinoASalvo = localStorage.getItem("treinoA");

if (treinoASalvo) {
    Object.assign(
        treinoA,
        JSON.parse(treinoASalvo)
    );
}

const treinoB = [
    {
        nome: "Puxada Alta na Polia (Pegada Pronada)",
        series: 3,
        repeticoes: "10-12",
        seriesRealizadas: 0,
        cargaAtual: "",
        descanso: 60,
        gif: "",
        video: "",
        cronometro: null
    },
    {
        nome: "Remada Baixa na Polia (Pegada Neutra)",
        series: 3,
        repeticoes: "10-12",
        seriesRealizadas: 0,
        cargaAtual: "",
        descanso: 60,
        gif: "",
        video: "",
        cronometro: null
    },
    {
        nome: "Remada Alta na Polia ou Halteres",
        series: 3,
        repeticoes: "12",
        seriesRealizadas: 0,
        cargaAtual: "",
        descanso: 60,
        gif: "",
        video: "",
        cronometro: null
    },
    {
        nome: "Rosca Direta na Polia ou Halteres",
        series: 3,
        repeticoes: "12",
        seriesRealizadas: 0,
        cargaAtual: "",
        descanso: 60,
        gif: "",
        video: "",
        cronometro: null
    },
    {
        nome: "Rosca Martelo com Halteres",
        series: 3,
        repeticoes: "12",
        seriesRealizadas: 0,
        cargaAtual: "",
        descanso: 60,
        gif: "",
        video: "",
        cronometro: null
    }
];

const treinoBSalvo = localStorage.getItem("treinoB");

if (treinoBSalvo) {
    Object.assign(
        treinoB,
        JSON.parse(treinoBSalvo)
    );
}

const treinoC = [
    {
        nome: "Leg Press 45º",
        series: 3,
        repeticoes: "10-12",
        seriesRealizadas: 0,
        cargaAtual: "",
        descanso: 60,
        gif: "",
        video: "",
        cronometro: null
    },
    {
        nome: "Cadeira Extensora",
        series: 3,
        repeticoes: "12",
        seriesRealizadas: 0,
        cargaAtual: "",
        descanso: 60,
        gif: "",
        video: "",
        cronometro: null
    },
    {
        nome: "Cadeira Flexora ou Mesa Flexora",
        series: 3,
        repeticoes: "12",
        seriesRealizadas: 0,
        cargaAtual: "",
        descanso: 60,
        gif: "",
        video: "",
        cronometro: null
    },
    {
        nome: "Panturrilha em Pé",
        series: 4,
        repeticoes: "15",
        seriesRealizadas: 0,
        cargaAtual: "",
        descanso: 60,
        gif: "",
        video: "",
        cronometro: null
    },
    {
        nome: "Abdominal Infra (Elevação no Solo)",
        series: 3,
        repeticoes: "15",
        seriesRealizadas: 0,
        cargaAtual: "",
        descanso: 60,
        gif: "",
        video: "",
        cronometro: null
    },
    {
        nome: "Prancha Isométrica",
        series: 3,
        repeticoes: "30-45 segundos",
        seriesRealizadas: 0,
        cargaAtual: "",
        descanso: 60,
        gif: "",
        video: "",
        cronometro: null
    }
];

const treinoCSalvo = localStorage.getItem("treinoC");
if (treinoCSalvo) {
    Object.assign(
        treinoC,
        JSON.parse(treinoCSalvo)
    );
}

const botaoTreinoA = document.getElementById("btnTreinoA");
const botaoTreinoB = document.getElementById("btnTreinoB");
const botaoTreinoC = document.getElementById("btnTreinoC");

const conteudoTreino = document.getElementById("conteudoTreino");

const btnMostrarFormulario = document.getElementById("btnMostrarFormulario");
const formularioExercicio = document.getElementById("formularioExercicio");
const btnCancelarExercicio = document.getElementById("btnCancelarExercicio");

btnMostrarFormulario.addEventListener("click", function() {
    formularioExercicio.classList.remove("oculto");
});

btnCancelarExercicio.addEventListener("click", function() {
    formularioExercicio.classList.add("oculto");
});

const btnSalvarExercicio = document.getElementById("btnSalvarExercicio");

btnSalvarExercicio.addEventListener("click", function() {

    const nome = document.getElementById("nomeExercicio").value;
        if (!nome) {alert("Informe o nome do exercício.");
            return;
        }

    const series = document.getElementById("seriesExercicio").value;
        if (!series) {alert("Informe a quantidade de séries.");
            return;
        }

    const repeticoes = document.getElementById("repeticoesExercicio").value;
        if (!repeticoes) {alert("Informe as repetições.");
            return;
        }

    const carga = document.getElementById("cargaExercicio").value;

    const descanso = document.getElementById("descansoExercicio").value;
        if(!descanso) {alert("Informe o tempo de descanso.");
            return;
        }

    const gif = document.getElementById("gifExercicio").value;

    const video = document.getElementById("videoExercicio").value;

    console.log("Valor digitado:", descanso);

    const novoExercicio = {
        nome: nome,
        series: Number(series),
        repeticoes: repeticoes,
        seriesRealizadas: 0,
        cargaAtual: carga,
        descanso: Number(descanso),
        gif: gif,
        video: video,
        cronometro: null
    };

    console.log(nome);
    console.log(series);
    console.log(repeticoes);
    console.log(carga);
    console.log(descanso);
    console.log(gif);
    console.log(video);
    console.log(novoExercicio);

    treinoAtual.push(novoExercicio);

    localStorage.setItem(
        chaveTreinoAtual,
        JSON.stringify(treinoAtual)
    );

    mostrarTreino(
        tituloAtual,
        treinoAtual
    );
});




let tituloAtual = "";
let treinoAtual = [];
let chaveTreinoAtual = "";

console.log(botaoTreinoA);
console.log(botaoTreinoB);
console.log(botaoTreinoC);

botaoTreinoA.addEventListener("click", function() {
    tituloAtual = "Treino A";
    treinoAtual = treinoA;
    chaveTreinoAtual = "treinoA";
    mostrarTreino("Treino A", treinoA);
    
});

botaoTreinoB.addEventListener("click", function() {
    tituloAtual = "Treino B";
    treinoAtual = treinoB;
    chaveTreinoAtual = "treinoB";
    mostrarTreino("Treino B", treinoB);
});

botaoTreinoC.addEventListener("click", function() {
    tituloAtual = "Treino C";
    treinoAtual = treinoC;
    chaveTreinoAtual = "treinoC";
    mostrarTreino("Treino C", treinoC);
});
