function mostrarTreino(titulo, exercicios) {
    
    let listaExercicios = "";
    
    for (let i = 0; i < exercicios.length; i++) {
        const exercicio = exercicios[i];

        const evolucao =
    JSON.parse(
        localStorage.getItem("evolucaoExercicios")
    ) || {};

    const historicoExercicio =
        evolucao[exercicio.nome] || [];

    let textoEvolucao = "";

    if (historicoExercicio.length >= 2) {

        const ultimaCarga =
            Number(
                historicoExercicio[
                    historicoExercicio.length - 1
                ].carga
            );

        const penultimaCarga =
            Number(
                historicoExercicio[
                    historicoExercicio.length - 2
                ].carga
            );

        const diferenca =
            ultimaCarga - penultimaCarga;

        if (diferenca > 0) {

            textoEvolucao =
                `📈 +${diferenca} kg`;

        } else if (diferenca < 0) {

            textoEvolucao =
                `📉 ${diferenca} kg`;

        } else {

            textoEvolucao =
                `📊 Sem alteração`;
        }
    }

        const concluido = exercicio.seriesRealizadas === exercicio.series;
        
        listaExercicios += `
            <div class="cartao-exercicio ${concluido ? "cartao-concluido" : ""}">

                <h3>${concluido ? "✅ " : ""}${exercicio.nome}</h3>
           
                <p>${exercicio.series} séries</p>

                <p>${exercicio.repeticoes} repetições</p>

                <p>Séries Realizadas: ${exercicio.seriesRealizadas}/${exercicio.series}</p>

                <div class="controle-carga">

                    <button
                        class="btn-diminuirCarga"
                        data-indice="${i}">
                        -
                    </button>
                
                    <input
                        type="number"
                        class="input-carga"
                        data-indice="${i}"
                        value="${exercicio.cargaAtual || 0}">
                    
                    <button
                        class="btn-aumentarCarga"
                        data-indice="${i}">
                        +
                    </button>
                
                </div>

                <p class="evolucao-carga">
                    ${textoEvolucao}
                </p>
                
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

                <button
                    class="btn-editarExercicio"
                    data-indice="${i}">
                    Editar Exercício
                </button>

                <button
                    class="btn-excluirExercicio"
                    data-indice="${i}">
                    Excluir Exercício
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

    console.log("Quantidade de exercícios:", exercicios.length);

    if (exercicios.length === 0) {

        conteudoTreino.innerHTML = `
            <h2>${titulo}</h2>

            <p>
                Nenhum exercício cadastrado.
            </p>

            <p>
                Clique em "+ Adicionar Exercício" para criar o primeiro exercício.
            </p>
        `;
        return;
    }

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

    const btnFinalizarTreino =
        document.getElementById("btnFinalizarTreino");

    btnFinalizarTreino.addEventListener(
        "click",
        finalizarTreino
    );    

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

    const botoesEditar = document.querySelectorAll(".btn-editarExercicio");
    console.log("Botões editar:", botoesEditar.length);

    const botoesExcluir = document.querySelectorAll(".btn-excluirExercicio");

    const botoesAumentarCarga =
        document.querySelectorAll(
            ".btn-aumentarCarga"
        );

    const botoesDiminuirCarga =
        document.querySelectorAll(
            ".btn-diminuirCarga"
        );

    const inputsCarga =
        document.querySelectorAll(".input-carga");
    
    console.log("Botões aumentar:",botoesAumentarCarga.length);

    console.log("Botões diminuir:", botoesDiminuirCarga.length);

    for (let botao of botoesExcluir) {
        botao.addEventListener("click", function() {

            const indice =
                Number(botao.dataset.indice);
            
            const confirmar = confirm(
                "Deseja excluir este exercício?"
            );

            if (!confirmar) {
                return;
            }

            treinoAtual.splice(indice, 1);

            localStorage.setItem(
                chaveTreinoAtual,
                JSON.stringify(treinoAtual)
            );

            localStorage.setItem(
                "treinos",
                JSON.stringify(treinos)
            );

            console.log("Objeto treinos:");
            console.log(treinos);

            console.log("Treino atual:");
            console.log(treinoAtual);

            console.log("Treino selecionado:");
            console.log(chaveTreinoAtual);

            console.log(
                "Treinos atualizados:",
                localStorage.getItem("treinos")
            );

            mostrarTreino(
                tituloAtual,
                treinoAtual
            );
        });
    }

    for (let botao of botoesEditar) {

        botao.addEventListener("click", function() {

            const indice =
                Number(botao.dataset.indice);
            
            const exercicio =
                treinoAtual[indice];
            
            indiceEdicao = indice;

            document.getElementById("nomeExercicio").value = exercicio.nome;

            document.getElementById("seriesExercicio").value = exercicio.series;

            document.getElementById("repeticoesExercicio").value = exercicio.repeticoes;

            document.getElementById("cargaExercicio").value = exercicio.cargaAtual;

            document.getElementById("descansoExercicio").value = exercicio.descanso;

            document.getElementById("gifExercicio").value = exercicio.gif;

            document.getElementById("videoExercicio").value = exercicio.video;

            formularioExercicio.classList.remove("oculto");
        });
    }

    for (let botao of botoesAumentarCarga) {

        botao.addEventListener(
            "click",
            function() {

                const indice =
                    Number(botao.dataset.indice);

                const cargaAtual =
                    Number(
                        treinoAtual[indice].cargaAtual
                    ) || 0;

                treinoAtual[indice].cargaAtual =
                    cargaAtual + 1;

                localStorage.setItem(
                    "treinos",
                    JSON.stringify(treinos)
                );

                mostrarTreino(
                    tituloAtual,
                    treinoAtual
                );
            }
        );
    }

    for (let botao of botoesDiminuirCarga) {

        botao.addEventListener(
            "click",
            function() {

                const indice =
                    Number(botao.dataset.indice);
                
                const cargaAtual =
                    Number(
                        treinoAtual[indice].cargaAtual
                    ) || 0;
                
                treinoAtual[indice].cargaAtual =
                    Math.max(
                        0,
                        cargaAtual - 1
                    );
                
                localStorage.setItem(
                    "treinos",
                    JSON.stringify(treinos)
                );

                mostrarTreino(
                    tituloAtual,
                    treinoAtual
                );
            }
        );
    }
    
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

    for (let input of inputsCarga) {

        input.addEventListener(
            "change",
            function() {

                const indice =
                    Number(input.dataset.indice);
                
                treinoAtual[indice].cargaAtual =
                    Number(input.value) || 0;

                localStorage.setItem(
                    "treinos",
                    JSON.stringify(treinos)
                );

                mostrarTreino(
                    tituloAtual,
                    treinoAtual
                );
            }
        );
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

        const historicoSalvo =
            localStorage.getItem("historicoTreinos");

        let historico = [];

        if (historicoSalvo) {

            historico = JSON.parse(
                historicoSalvo
            );
        }

        const registroTreino = {
            
            data: new Date().toLocaleString("pt-BR"),

            treino: tituloAtual,

            exercicios: structuredClone(
                treinoAtual
            )
        };

        historico.push(
            registroTreino
        );

        let evolucao =
        JSON.parse(
            localStorage.getItem("evolucaoExercicios")
        ) || {};

        for (let exercicio of treinoAtual) {

            if (!evolucao[exercicio.nome]) {
                evolucao[exercicio.nome] = [];
            }

            evolucao[exercicio.nome].push({
                data: new Date().toLocaleString("pt-BR"),

                carga: exercicio.cargaAtual
            })
        }

        localStorage.setItem(
            "evolucaoExercicios",
            JSON.stringify(evolucao)
        );

        localStorage.setItem(
            "historicoTreinos",
            JSON.stringify(historico)
        );

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

function mostrarHistorico() {

    const historico =
    JSON.parse(
        localStorage.getItem("historicoTreinos")
    ) || [];

    let html = `
        <h2> Histórico de Treinos</h2>
    `;

    if (historico.length === 0) {
        
        html += `
            <p>
                Nenhum treino finalizado ainda.
            </p>
        `;

    }   else {

        for (let registro of historico) {

            let listaExercicios = "";

            for (let exercicio of registro.exercicios) {

                listaExercicios += `
                    <li>
                        ${exercicio.nome}
                        -
                        ${exercicio.cargaAtual || "Sem carga"} Kg
                        -
                        ${exercicio.series}/${exercicio.series} series
                    </li>
                `;
            }

            html += `
                <div class="cartao-historico">
                    
                    <h3>${registro.treino}</h3>
                    
                    <p>
                        ${registro.data}
                    </p>
                    
                    <ul>
                        ${listaExercicios}
                    </ul>
                
                </div>
            `;
        }
    }

    historicoTreinosDiv.innerHTML = html;

    historicoTreinosDiv.classList.remove(
        "oculto"
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

const treinos = {
    treinoA: treinoA,
    treinoB: treinoB,
    treinoC: treinoC

};

const treinosSalvos = localStorage.getItem("treinos");

if (treinosSalvos) {

    Object.assign(
        treinos,
        JSON.parse(treinosSalvos)
    );

    console.log(
        "Treinos recuperados do localStorage"
    );
}

console.log("Treinos carregados:", treinos);

const listaTreinos = document.getElementById("listaTreinos");

function criarBotoesTreinos() {
    
    listaTreinos.innerHTML = "";

    console.log(listaTreinos);

    for (let nomeTreino in treinos) {

        console.log("Criado botão:", nomeTreino);
        
        const botao = document.createElement("button");

        botao.textContent = nomeTreino;

        botao.addEventListener(
            "click",
            function() {

                tituloAtual = nomeTreino;

                treinoAtual = treinos[nomeTreino];

                chaveTreinoAtual = nomeTreino;

                mostrarTreino(
                    nomeTreino,
                    treinos[nomeTreino]
                );
            }
        );

        listaTreinos.appendChild(botao);
    }
}

criarBotoesTreinos();



//const botaoTreinoA = document.getElementById("btnTreinoA");
//const botaoTreinoB = document.getElementById("btnTreinoB");
//const botaoTreinoC = document.getElementById("btnTreinoC");

const conteudoTreino = document.getElementById("conteudoTreino");

const btnMostrarFormulario = document.getElementById("btnMostrarFormulario");
const formularioExercicio = document.getElementById("formularioExercicio");
const btnCancelarExercicio = document.getElementById("btnCancelarExercicio");

const btnMostrarFormularioTreino = document.getElementById("btnMostrarFormularioTreino");
const formularioTreino = document.getElementById("formularioTreino");
const btnCancelarTreino = document.getElementById("btnCancelarTreino");

const btnHistorico =
    document.getElementById("btnHistorico");

    const historicoTreinosDiv =
    document.getElementById("historicoTreinos");

btnHistorico.addEventListener(
    "click",
    mostrarHistorico
);



btnMostrarFormulario.addEventListener("click", function() {

    if (!chaveTreinoAtual) {
    alert(
        "Selecione um treino antes de adicionar um exercício."
    );
    return;
    }   

    formularioExercicio.classList.remove("oculto");
});

btnCancelarExercicio.addEventListener("click", function() {

    indiceEdicao = null;

    document.getElementById("nomeExercicio").value = "";
    document.getElementById("seriesExercicio").value = "";
    document.getElementById("repeticoesExercicio").value = "";
    document.getElementById("cargaExercicio").value = "";
    document.getElementById("descansoExercicio").value = "";
    document.getElementById("gifExercicio").value = "";
    document.getElementById("videoExercicio").value = "";

    formularioExercicio.classList.add("oculto");
});

const btnSalvarTreino = document.getElementById("btnSalvarTreino");

btnSalvarTreino.addEventListener(
    "click",
    function() {
        const nomeTreino = document.getElementById(
            "nomeTreino"
        ).value.trim();

        if (!nomeTreino) {
            alert(
                "Informe o nome do treino."
            );

            return;
        }
        treinos[nomeTreino] = [];

        localStorage.setItem(
            "treinos",
            JSON.stringify(treinos)
        );

        criarBotoesTreinos();

        console.log(
            "Treino criado:",
            nomeTreino
        );
        console.log(treinos);

        console.log(
            localStorage.getItem("treinos")
        );

        formularioTreino.classList.add(
            "oculto"
        );
        document.getElementById(
            "nomeTreino"
        ).value = "";
    }
);

btnCancelarTreino.addEventListener(
    "click",
    function() {
        document.getElementById(
            "nomeTreino"
        ).value = "";

        formularioTreino.classList.add(
            "oculto"
        );
    }
);

btnMostrarFormularioTreino.addEventListener(
    "click",
    function() {
        formularioTreino.classList.remove(
            "oculto"
        );
    }
);

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

    if (indiceEdicao !== null) {
        
        treinoAtual[indiceEdicao] = novoExercicio;

        indiceEdicao = null;
    
    } else {

        treinoAtual.push(novoExercicio);

    }

    treinos[chaveTreinoAtual] = treinoAtual;

    console.log("chaveTreinoAtual:", chaveTreinoAtual);

    console.log("treinoAtual:");
    console.log(treinoAtual);

    console.log("treinos:");
    console.log(treinos);

    console.log("treinos[chaveTreinoAtual]:");
    console.log(treinos[chaveTreinoAtual]);

    localStorage.setItem(
        "treinos",
        JSON.stringify(treinos)
    );

    console.log(
        "salvo no localstorage:",
        localStorage.getItem("treinos")
    );

    mostrarTreino(
        tituloAtual,
        treinoAtual
    );

    document.getElementById("nomeExercicio").value = "";

    document.getElementById("seriesExercicio").value = "";

    document.getElementById("repeticoesExercicio").value = "";

    document.getElementById("cargaExercicio").value = "";

    document.getElementById("descansoExercicio").value = "";

    document.getElementById("gifExercicio").value = "";

    document.getElementById("videoExercicio").value = "";

    formularioExercicio.classList.add("oculto");


});

let tituloAtual = "";
let treinoAtual = [];
let chaveTreinoAtual = "";

let indiceEdicao = null;

/*
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
});*/
