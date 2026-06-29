function mostrarTreino(titulo, exercicios) {

    if (!inicioTreino) {
        inicioTreino = new Date();
    }
    
    let listaExercicios = "";
    
    for (let i = 0; i < exercicios.length; i++) {
        const exercicio = exercicios[i];

        const evolucao =
    JSON.parse(
        localStorage.getItem("evolucaoExercicios")
    ) || {};

    const historicoExercicio =
        evolucao[exercicio.nome] || [];

    const cargasSemRepeticao =
        historicoExercicio
            .map(item => item.carga)
            .filter(
                (carga, indice, array) =>
                    indice === 0 ||
                    carga !== array[indice -1]
            );
        
    const ultimasCargas =
            cargasSemRepeticao
                .slice(-5)
                .join(" → ");
    
    let textoHistorico = "";

    if (ultimasCargas) {

        textoHistorico =
            `Últimas cargas: ${ultimasCargas}`;
    }

        const concluido = exercicio.seriesRealizadas === exercicio.series;

        let botaoGif = "";

        if (exercicio.gif) {

            botaoGif = `
                <button
                    class="btn-mostrarGif"
                    data-indice="${i}">
                    👁 Mostrar Demonstração
                </button>

                <div
                    class="container-gif oculto">

                    <img
                        src="${exercicio.gif}"
                        class="gif-exercicio"
                        alt="${exercicio.nome}">
                </div>
            `;
        }

        let botaoVideo = "";

        if (exercicio.video) {

            botaoVideo =`
                <a
                    href="${exercicio.video}"
                    target="blank">
                    ▶ Ver Vídeo
                </a>
            `;
        }
        
        listaExercicios += `
            <div class="cartao-exercicio ${concluido ? "cartao-concluido" : ""}">

                <h3>${concluido ? "✅ " : ""}${exercicio.nome}</h3>
           
            <div class="info-exercicio">

                <span>
                    ${exercicio.series} séries
                </span>

                <span>
                    ${exercicio.repeticoes} reps
                </span>

                <span>
                    ${exercicio.seriesRealizadas}/${exercicio.series}
                </span>

            </div>

                 <p class="titulo-carga">
                    Carga Atual
                </p>

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

                <p class="historico-carga">
                    ${textoHistorico}
                </p>

                <div class="midia-exercicio">

                    ${botaoGif}

                    ${botaoVideo}

                </div>
                
                <p class="tempo-descanso">
                    Descanso: ${exercicio.descanso} segundos
                </p>

                <div class="barra-descanso">
                    <div class="barra-progresso" data-indice="${i}"></div>
                </div>

                <button
                    class="btn-descanso"
                    data-indice="${i}">
                    Iniciar Descanso
                </button>
            
                <button
                    class="btn-concluirSerie btn-sucesso"
                    data-indice=" ${i}"
                    ${concluido ? "disabled" : ""}>
                    Concluir Série
                </button>

                <button
                    class="btn-editarExercicio btn-editar"
                    data-indice="${i}">
                    Editar Exercício
                </button>

                <button
                    class="btn-excluirExercicio btn-excluir"
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

        <p id="tempoTreino">
            ⏱ Tempo de treino: 00:00
        </p>

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

    iniciarCronometroTreino();
        
    const btnFinalizarTreino =
        document.getElementById("btnFinalizarTreino");

    btnFinalizarTreino.addEventListener(
        "click",
        finalizarTreino
    );    

    const botoesDescanso = document.querySelectorAll(".btn-descanso");
    for (let botao of botoesDescanso) {
        botao.addEventListener("click", function() {

            console.log("CLIQUE NO BOTÃO");
            const indice = Number(botao.dataset.indice);
            const exercicio = exercicios[indice];

            console.log(exercicio);
            console.log("Descanso:", exercicio.descanso)  
        
            const cartao = botao.closest(".cartao-exercicio");
            const barra = cartao.querySelector(".barra-progresso");
            const textoDescanso =
                cartao.querySelector(".tempo-descanso");

            textoDescanso.classList.remove("tempo-alerta");

            if (exercicio.cronometro) {
                clearInterval(exercicio.cronometro)
                exercicio.cronometro = null;
            } 

            let tempo = exercicio.descanso;

            const tempoTotal = exercicio.descanso;
            barra.style.width = "100%";

            textoDescanso.textContent =
                `Descanso: ${tempo} segundos`;
                        
            exercicio.cronometro = setInterval(function() {

            console.log("Tempo:", tempo);

            if (tempo === 0) {
                
                console.log("DESCANSO FINALIZADO");

                clearInterval(exercicio.cronometro);

                exercicio.cronometro = null;

                textoDescanso.textContent =
                    "✅ Volte a Treinar!!!";

                textoDescanso.classList.remove("tempo-alerta");

                return;

            }

            tempo--;

            const porcentagem = (tempo / tempoTotal) * 100;
            barra.style.width = porcentagem + "%";

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
    const botoesMostrarGif = document.querySelectorAll(".btn-mostrarGif");
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

    botao.addEventListener(
        "click",
        function() {

            const indice =
                Number(botao.dataset.indice);

            let deveIniciarDescanso = false;

            if (
                exercicios[indice].seriesRealizadas <
                exercicios[indice].series
            ) {

                exercicios[indice].seriesRealizadas++;

                if (
                    exercicios[indice].seriesRealizadas <
                    exercicios[indice].series
                ) {
                    deveIniciarDescanso = true;
                }

                localStorage.setItem(
                    chaveTreinoAtual,
                    JSON.stringify(treinoAtual)
                );
            }

            mostrarTreino(
                tituloAtual,
                treinoAtual
            );

            if (deveIniciarDescanso) {

                const botaoDescanso =
                    document.querySelector(
                        `.btn-descanso[data-indice="${indice}"]`
                    );

                if (botaoDescanso) {
                    botaoDescanso.click();
                }
            }

            console.log(
                exercicios[indice]
            );
        }
    );
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

    for (let botao of botoesMostrarGif) {

        botao.addEventListener(
            "click",
            function() {

                const container =
                    botao.nextElementSibling;

                container.classList.toggle(
                    "oculto"
                );

                if (
                    container.classList.contains(
                        "oculto"
                    )
                ) {

                    botao.textContent =
                        "👁 Mostrar Demonstração";
                } else {

                    botao.textContent =
                        "🙈 Ocultar Demonstração";
                }
            }
        );
    }
}

    function iniciarCronometroTreino() {

        if (cronometroTreino) {

                clearInterval(
                    cronometroTreino
                );
            }

            cronometroTreino =
                setInterval(
                    function() {

                        const agora =
                            new Date();

                        const diferenca =
                            Math.floor(
                                (
                                    agora -
                                    inicioTreino
                                ) / 1000
                            );
                        
                        const minutos =
                            Math.floor(
                                diferenca / 60
                            );

                        const segundos =
                            diferenca % 60;

                        const textoTempo =
                            document.getElementById(
                                "tempoTreino"
                            );
                        
                        if (textoTempo) {

                            textoTempo.textContent =
                                `⏱ Tempo de treino: ${
                                    String(minutos)
                                        .padStart(2, "0")
                                }:${
                                    String(segundos)
                                        .padStart(2, "0")
                                }`;
                        }
                    },
                    1000
                );
    }

    function pararCronometroTreino() {

        if(cronometroTreino) {

            clearInterval(
                cronometroTreino
            );

            cronometroTreino = null;
        }

        inicioTreino = null;
    }

    function finalizarTreino() {

        const confirmar = confirm(
            "Deseja finalizar o treino?"
        );

        if (!confirmar) {
            return;
        }

        console.log("Antes:", treinoAtual);

        const treinoFinalizado = tituloAtual;

        const exerciciosFinalizados =
            structuredClone(treinoAtual);

        const historicoSalvo =
            localStorage.getItem("historicoTreinos");

        let historico = [];

        if (historicoSalvo) {

            historico = JSON.parse(
                historicoSalvo
            );
        }

        let evolucao =
        JSON.parse(
            localStorage.getItem("evolucaoExercicios")
        ) || {};

        for (let exercicio of treinoAtual) {

            if (!evolucao[exercicio.nome]) {
                evolucao[exercicio.nome] = [];
            }

            const historicoExercicio =
                evolucao[exercicio.nome];
            
            const ultimoRegistro =
                historicoExercicio[
                    historicoExercicio.length -1
                ];
            
            if (
                !ultimoRegistro ||
                Number(ultimoRegistro.carga) !==
                Number(exercicio.cargaAtual)
            ) {

                historicoExercicio.push({
                    data: new Date().toLocaleString("pt-BR"),

                    carga: exercicio.cargaAtual
                });
            }
        }

        localStorage.setItem(
            "evolucaoExercicios",
            JSON.stringify(evolucao)
        );

        localStorage.setItem(
            "historicoTreinos",
            JSON.stringify(historico)
        );

        localStorage.setItem(
            "ultimoTreino",
            chaveTreinoAtual
        );

        let exerciciosConcluidosResumo = 0;

        let seriesConcluidasResumo = 0;

        for (let exercicio of exerciciosFinalizados) {

            seriesConcluidasResumo +=
                exercicio.seriesRealizadas;

            if (exercicio.seriesRealizadas > 0) {

                exerciciosConcluidosResumo++;
            }
        }

        const totalExerciciosResumo =
            exerciciosFinalizados.length;

        let totalSeriesResumo = 0;

        for (let exercicio of exerciciosFinalizados) {

            totalSeriesResumo +=
                exercicio.series;
        }

        for (let exercicio of treinoAtual) {
            exercicio.seriesRealizadas = 0;
        }

        console.log("Depois:", treinoAtual);

        localStorage.setItem(
            chaveTreinoAtual,
            JSON.stringify(treinoAtual)
        );

        const fimTreino =
            new Date();

        const duracaoSegundos =
            Math.floor(
                (fimTreino - inicioTreino) / 1000
            );

        const minutosDuracao =
            Math.floor(
                duracaoSegundos / 60
            );
        
        const segundosDuracao =
            duracaoSegundos % 60;

        const textoDuracao =
            `${minutosDuracao} min ${segundosDuracao} s`;

        const registroTreino = {

            data: new Date().toLocaleString("pt-BR"),

            treino: treinoFinalizado,

            duracao: textoDuracao,

            duracaoSegundos: duracaoSegundos,

            exercicios: structuredClone(
                exerciciosFinalizados
            )
        };

        historico.push(
            registroTreino
        );

        localStorage.setItem(
            "historicoTreinos",
            JSON.stringify(historico)
        );

        for (let exercicio of treinoAtual) {

            if (exercicio.cronometro) {

                clearInterval(exercicio.cronometro);

                exercicio.cronometro = null;
                
            }
        }

        pararCronometroTreino();

        tituloAtual = "";
        treinoAtual = [];
        chaveTreinoAtual = "";

        conteudoTreino.innerHTML = `
            <div class="resumo-final">
                <h2>🏆 Treino finalizado</h2>
            
                <p>
                    ⏱ Tempo: ${textoDuracao}
                </p>

                <p>
                    💪 Exercícios: ${exerciciosConcluidosResumo} de ${totalExerciciosResumo}
                </p>

                <p>
                    🔥 Séries: ${seriesConcluidasResumo} de ${totalSeriesResumo}
                </p>

                <button id="btnVoltarInicio">
                    Tela Inicial
                </button>
            </div>            
        `;

        const btnVoltarInicio =
            document.getElementById("btnVoltarInicio");

        btnVoltarInicio.addEventListener(
            "click",
            function() {

                conteudoTreino.innerHTML = "";

                criarBotoesTreinos();
            }
        );
    }

function mostrarHistorico(filtro = "") {

    const historico =
    JSON.parse(
        localStorage.getItem("historicoTreinos")
    ) || [];

    let html = `
        <h2>Histórico de Treinos (${historico.length})</h2>

        <input
            type="text"
            id="inputBuscarHistorico"
            placeholder="Buscar por número, treino, data ou exercício">

        <button id="btnFecharHistorico">
            Fechar Histórico
        </button>
    `;

    const historicoOrdenado =
        historico.slice().reverse();

    const historicoFiltrado =
        historicoOrdenado.filter(
            function(registro, indice) {

                const numeroRegistro =
                    historicoOrdenado.length - indice;

                const textoBusca =
                    `
                    ${numeroRegistro}
                    ${registro.treino}
                    ${registro.data}
                    ${registro.duracao || ""}
                    ${registro.exercicios
                        .map(exercicio => `
                            ${exercicio.nome}
                            ${exercicio.cargaAtual}
                        `)
                        .join(" ")}
                    `.toLowerCase();
                
                return textoBusca.includes(
                    filtro.toLowerCase()
                );
            }
        );

    const historicoVisivel =
        historicoFiltrado.slice(0, 10);

    if (historico.length === 0) {
        
        html += `
            <p>
                Nenhum treino finalizado ainda.
            </p>
        `;

    }   else {

        for (let i = 0; i < historicoVisivel.length; i++) {

            const registro =
                historicoVisivel[i];

            const numeroRegistro =
                historicoOrdenado.length - i;

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
                    
                    <h3>
                        ${numeroRegistro} - ${registro.treino}
                    </h3>
                    
                    <p>
                        ${registro.data}
                    </p>

                    <p>
                        ⏱ Duração: ${registro.duracao || "Não registrada"}
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

    const btnFecharHistorico =
    document.getElementById("btnFecharHistorico");

if (btnFecharHistorico) {

    btnFecharHistorico.addEventListener(
        "click",
        function() {

            historicoTreinosDiv.classList.add(
                "oculto"
            );
        }
    );
}

    const inputBuscarHistorico =
        document.getElementById("inputBuscarHistorico");

    if (inputBuscarHistorico) {

        inputBuscarHistorico.value = filtro;

        inputBuscarHistorico.focus();

        inputBuscarHistorico.setSelectionRange(
            inputBuscarHistorico.value.length,
            inputBuscarHistorico.value.length
        );

        inputBuscarHistorico.addEventListener(
            "input",
            function() {

                clearTimeout(
                    temporizadorBuscaHistorico
                );

                temporizadorBuscaHistorico =
                    setTimeout(
                        function() {

                            mostrarHistorico(
                                inputBuscarHistorico.value
                            );
                        },
                        500
                    );
            }
        );
    }

    btnFecharHistorico.addEventListener(
        "click",
        function() {

            historicoTreinosDiv.classList.add(
                "oculto"
            );

            const btnFecharHistorico =
                document.getElementById("btnFecharHistorico");

            if (btnFecharHistorico) {

                btnFecharHistorico.addEventListener(
                    "click",
                    function() {

                        historicoTreinosDiv.classList.add(
                            "oculto"
                        );
                    }
                );
            }

            const inputBuscarHistorico =
                document.getElementById("inputBuscarHistorico");
            
            if (inputBuscarHistorico) {

                inputBuscarHistorico.value = filtro;

                inputBuscarHistorico.addEventListener(
                    "input",
                    function() {

                        mostrarHistorico(
                            inputBuscarHistorico.value
                        );
                    }
                );
            }
        }
    );
}

function exportarBackup() {

    const backup = {

        treinos:
            JSON.parse(
                localStorage.getItem("treinos")
            ),
        
        historicoTreinos:
            JSON.parse(
                localStorage.getItem(
                    "historicoTreinos"
                )
            ),

        evolucaoExercicios:
            JSON.parse(
                localStorage.getItem(
                    "evolucaoExercicios"
                )
            )
    };

    const textoBackup =
        JSON.stringify(
            backup,
            null,
            2
        );

    const blob =
        new Blob(
            [textoBackup],
            {
                type:
                    "application/json"
            }
        );
    
    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;

    link.download =
        "backup-treinos.json";
    
    link.click();

    URL.revokeObjectURL(url);
}

function importarBackup(evento) {

    const arquivo =
        evento.target.files[0];
    
    if(!arquivo) {
        return;
    }

    const leitor =
        new FileReader();

    leitor.onload =
        function(e) {

            const dadosBackup =
                JSON.parse(
                    e.target.result
                );
            
            console.log(
                "Backup carregado:"
            );

            console.log(
                dadosBackup
            );

            localStorage.setItem(
                "treinos",
                JSON.stringify(
                    dadosBackup.treinos
                )
            );

            localStorage.setItem(
                "historicoTreinos",
                JSON.stringify(
                    dadosBackup.historicoTreinos
                )
            );

            localStorage.setItem(
                "evolucaoExercicios",
                JSON.stringify(
                    dadosBackup.evolucaoExercicios
                )
            );

            alert(
                "Backup restaurado com sucesso!"
            );

            location.reload();
        };

    leitor.readAsText(
        arquivo
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

    const ultimoTreino =
        localStorage.getItem(
            "ultimoTreino"
        );
    
    const nomesTreinos =
        Object.keys(treinos);

    let proximoTreino = null;

    if (
        ultimoTreino &&
        nomesTreinos.includes(
            ultimoTreino
        )
    ) {
        const indiceAtual =
            nomesTreinos.indexOf(
                ultimoTreino
            );

        const proximoIndice =
            (indiceAtual +1)
            % nomesTreinos.length;

        proximoTreino =
        nomesTreinos[
            proximoIndice
        ];
    }

    console.log(listaTreinos);

    for (let nomeTreino in treinos) {

        console.log("Criado botão:", nomeTreino);
        
        const botao = document.createElement("button");

        if (
            nomeTreino === proximoTreino
        ) {

            botao.classList.add(
                "treino-sugerido"
            );
        }

        botao.textContent = nomeTreino;

        botao.addEventListener(
            "click",
            function() {

                historicoTreinosDiv.classList.add(
                    "oculto"
                );

                if (!inicioTreino) {
                    inicioTreino = new Date();
                }

                const botoesTreino =
                    listaTreinos.querySelectorAll("button");

                for (let botaoTreino of botoesTreino) {

                    botaoTreino.classList.remove(
                        "treino-sugerido"
                    );

                    botaoTreino.classList.remove(
                        "treino-atual"
                    );
                }

                botao.classList.add(
                    "treino-atual"
                );

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

const btnExportarBackup =
    document.getElementById(
        "btnExportarBackup"
    );

const btnImportarBackup =
    document.getElementById(
        "btnImportarBackup"
    );

const inputImportarBackup =
    document.getElementById(
        "inputImportarBackup"
    );

const historicoTreinosDiv =
    document.getElementById("historicoTreinos");

btnHistorico.addEventListener(
    "click",
    function() {
       mostrarHistorico("");
    }
);

btnExportarBackup.addEventListener(
    "click",
    exportarBackup
);

btnImportarBackup.addEventListener(
    "click",
    function() {

        inputImportarBackup.click();
    }
);

inputImportarBackup.addEventListener(
    "change",
    importarBackup
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

let temporizadorBuscadoHistorico = null;

let inicioTreino = null;

let cronometroTreino = null;

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
