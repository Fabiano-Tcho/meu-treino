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

function mostrarTelaCardio(tipoAtividade) {

    historicoTreinosDiv.classList.add(
        "oculto"
    );

    limparDestaqueTreinos();

    limparDestaqueNavegacao();

    let opcoesLocal = "";

    if (
        tipoAtividade === "Corrida" ||
        tipoAtividade === "Caminhada"
    ) {

        opcoesLocal = `
            <option value="Rua">Rua</option>
            <option value="Esteira">Esteira</option>
        `;

    } else if (tipoAtividade === "Bicicleta") {

        opcoesLocal = `
            <option value="Rua">Rua</option>
            <option value="Ergométrica">Ergométrica</option>
        `;
    }

    conteudoTreino.innerHTML = `
        <div class="resumo-final">
            <h2>${tipoAtividade}</h2>

            <label>
                Local:
            </label>

            <select id="localCardio">
                ${opcoesLocal}
            </select>

            <br><br>

            <button id="btnContinuarCardio">
                Continuar
            </button>
        </div>
    `;

    const btnContinuarCardio =
        document.getElementById("btnContinuarCardio");

    btnContinuarCardio.addEventListener(
        "click",
        function() {

            const localCardio =
                document.getElementById("localCardio").value;

            mostrarFormularioCardio(
                tipoAtividade,
                localCardio
            );
        }
    );
}

function mostrarFormularioCardio(
    tipoAtividade,
    localAtividade
) {

    let camposExtras = "";

    if (
        tipoAtividade === "Corrida" &&
        localAtividade === "Esteira"
    ) {

        camposExtras = `
            <label>Velocidade média:</label>
            <input
                type="number"
                id="velocidadeCardio"
                step="0.1">

            <label>Inclinação:</label>
            <input
                type="number"
                id="inclinacaoCardio"
                step="0.1">
        `;
    }

    if (
        tipoAtividade === "Caminhada" &&
        localAtividade === "Esteira"
    ) {

        camposExtras = `
            <label>Inclinação:</label>
            <input
                type="number"
                id="inclinacaoCardio"
                step="0.1">
        `;
    }

    if (
        tipoAtividade === "Bicicleta" &&
        localAtividade === "Ergométrica"
    ) {

        camposExtras = `
            <label>Resistência:</label>
            <input
                type="number"
                id="resistenciaCardio">
        `;
    }

    conteudoTreino.innerHTML = `
        <div class="resumo-final">
            <h2>${tipoAtividade}</h2>

            <p>
                Local: ${localAtividade}
            </p>

            <label>Tempo:</label>

            <div class="tempo-cardio">

                <input
                    type="number"
                    id="horasCardio"
                    min="0"
                    value="0"
                    placeholder="Horas">

                <input
                    type="number"
                    id="minutosCardio"
                    min="0"
                    max="59"
                    value="0"
                    placeholder="Min">

                <input
                    type="number"
                    id="segundosCardio"
                    min="0"
                    max="59"
                    value="0"
                    placeholder="Seg">

            </div>

            <label>Distância em km:</label>
            <input
                type="number"
                id="distanciaCardio"
                step="0.01">

            ${camposExtras}

            <label>Observações:</label>
            <input
                type="text"
                id="observacoesCardio">

            <br><br>

            <button id="btnSalvarCardio">
                Salvar Cardio
            </button>
        </div>
    `;
    
        const btnSalvarCardio =
            document.getElementById("btnSalvarCardio");

        btnSalvarCardio.addEventListener(
            "click",
            function() {

                const horas =
                    Number(
                        document.getElementById("horasCardio").value
                    ) || 0;

                const minutos =
                    Number(
                        document.getElementById("minutosCardio").value
                    ) || 0;

                const segundos =
                    Number(
                        document.getElementById("segundosCardio").value
                    ) || 0;

                const distancia =
                    Number(
                        document.getElementById("distanciaCardio").value
                    ) || 0;

                const observacoes =
                    document.getElementById("observacoesCardio").value;

                const velocidade =
                    document.getElementById("velocidadeCardio")?.value || null;

                const inclinacao =
                    document.getElementById("inclinacaoCardio")?.value || null;

                const resistencia =
                    document.getElementById("resistenciaCardio")?.value || null;

                const duracaoSegundos =
                    (horas * 3600) +
                    (minutos * 60) +
                    segundos;

                const historicoCardioSalvo =
                    localStorage.getItem(
                        "historicoCardio"
                    );

                let historicoCardio = [];

                if (historicoCardioSalvo) {

                    historicoCardio =
                        JSON.parse(
                            historicoCardioSalvo
                        );
                }

                const registroCardio = {

                    data: new Date().toLocaleString(
                        "pt-BR"
                    ),

                    tipo: tipoAtividade,

                    local: localAtividade,

                    duracaoSegundos: duracaoSegundos,

                    distancia: distancia,

                    velocidade: velocidade,

                    inclinacao: inclinacao,

                    resistencia: resistencia,

                    observacoes: observacoes

                };

                historicoCardio.push(
                    registroCardio
                );

                localStorage.setItem(
                    "historicoCardio",
                    JSON.stringify(
                        historicoCardio
                    )
                );

                alert(
                    "Atividade salva com sucesso!"
                );

                mostrarResumoCardio(
                    registroCardio
                );
            }
        );
}

function mostrarResumoCardio(registroCardio) {

    const minutos =
        Math.floor(
            registroCardio.duracaoSegundos / 60
        );

    const segundos =
        registroCardio.duracaoSegundos % 60;

    const ritmoSegundosPorKm =
        registroCardio.distancia > 0
            ? Math.round(
                registroCardio.duracaoSegundos /
                registroCardio.distancia
            )
            : 0;

    const ritmoMinutos =
        Math.floor(
            ritmoSegundosPorKm / 60
        );

    const ritmoSegundos =
        ritmoSegundosPorKm % 60;

    let informacoesExtras = "";

        if (registroCardio.velocidade) {

            informacoesExtras += `
                <p>
                    ⚡ Velocidade: ${registroCardio.velocidade} km/h
                </p>
            `;
        }

        if (registroCardio.inclinacao) {

            informacoesExtras += `
                <p>
                    ⛰ Inclinação: ${registroCardio.inclinacao}%
                </p>
            `;
        }

        if (registroCardio.resistencia) {

            informacoesExtras += `
                <p>
                    ⚙ Resistência: ${registroCardio.resistencia}
                </p>
            `;
        }

    conteudoTreino.innerHTML = `
        <div class="resumo-final">
            <h2>✅ ${registroCardio.tipo} concluída</h2>

            <p>
                📅 ${registroCardio.data}
            </p>

            <p>
                📍 Local: ${registroCardio.local}
            </p>

            <p>
                ⏱ Tempo: ${minutos}min ${segundos}s
            </p>

            <p>
                📏 Distância: ${registroCardio.distancia} km
            </p>

            ${informacoesExtras}

            <p>
                🔥 Ritmo médio: ${ritmoMinutos}min ${ritmoSegundos}s/km
            </p>

            <button id="btnVoltarInicioCardio">
                Tela Inicial
            </button>
        </div>
    `;

    const btnVoltarInicioCardio =
        document.getElementById(
            "btnVoltarInicioCardio"
        );

    btnVoltarInicioCardio.addEventListener(
        "click",
        function() {

            conteudoTreino.innerHTML = "";

            limparDestaqueNavegacao();

            criarBotoesTreinos();
        }
    );
}

function mostrarEstatisticas() {

    historicoTreinosDiv.classList.add(
        "oculto"
    );

    limparDestaqueTreinos();

    limparDestaqueNavegacao();

    btnEstatisticas.classList.add(
        "treino-atual"
    );

    conteudoTreino.innerHTML = `
        <div class="resumo-final">
            <h2>📊 Estatísticas</h2>

            <button id="btnEstatisticasGeral">
                📈 Geral
            </button>

            <button id="btnEstatisticasMusculacao">
                🏋️ Musculação
            </button>

            <button id="btnEstatisticasCardio">
                🏃 Cardio
            </button>
        </div>
    `;

    const btnEstatisticasGeral =
        document.getElementById("btnEstatisticasGeral");

    btnEstatisticasGeral.addEventListener(
        "click",
        mostrarEstatisticasGeral
    );

    const btnEstatisticasMusculacao =
        document.getElementById(
            "btnEstatisticasMusculacao"
        );

    btnEstatisticasMusculacao.addEventListener(
        "click",
        mostrarEstatisticasMusculacao
    );

    const btnEstatisticasCardio =
        document.getElementById(
            "btnEstatisticasCardio"
        );

    btnEstatisticasCardio.addEventListener(
        "click",
        mostrarEstatisticasCardio
    );
}

function mostrarEstatisticasGeral() {

    const historicoMusculacao =
        JSON.parse(
            localStorage.getItem("historicoTreinos")
        ) || [];

    const historicoCardio =
        JSON.parse(
            localStorage.getItem("historicoCardio")
        ) || [];

    let tempoMusculacaoSegundos = 0;

    let seriesMusculacao = 0;

    let totalCorridas = 0;

    let totalCaminhadas = 0;

    let totalBicicletas = 0;

    for (let registro of historicoMusculacao) {

        tempoMusculacaoSegundos +=
            registro.duracaoSegundos || 0;

        for (let exercicio of registro.exercicios) {

            seriesMusculacao +=
                exercicio.seriesRealizadas || 0;
        }
    }

    let tempoCardioSegundos = 0;
    let distanciaCardio = 0;

    for (let registro of historicoCardio) {

        tempoCardioSegundos +=
            registro.duracaoSegundos || 0;

        distanciaCardio +=
            registro.distancia || 0;

        if (registro.tipo === "Corrida") {

            totalCorridas++;

        } else if (
            registro.tipo === "Caminhada"
        ) {

            totalCaminhadas++;

        } else if (
            registro.tipo === "Bicicleta"
        ) {

            totalBicicletas++;
        }
    }

    const tempoTotalSegundos =
        tempoMusculacaoSegundos +
        tempoCardioSegundos;

    const horas =
        Math.floor(
            tempoTotalSegundos / 3600
        );

    const minutos =
        Math.floor(
            (tempoTotalSegundos % 3600) / 60
        );

    const segundos =
        tempoTotalSegundos % 60;

    conteudoTreino.innerHTML = `
        <div class="resumo-final">
            <h2>📈 Estatísticas Gerais</h2>

            <p>
                🏋️ Treinos de musculação: ${historicoMusculacao.length}
            </p>

            <p>
                🏃 Cardio:
                ${historicoCardio.length}
            </p>

            <p>
                🏃 Corridas:
                ${totalCorridas}
            </p>

            <p>
                🚶 Caminhadas:
                ${totalCaminhadas}
            </p>

            <p>
                🚴 Bicicletas:
                ${totalBicicletas}
            </p>

            <p>
                ⏱ Tempo total: ${horas}h ${minutos}min ${segundos}s
            </p>

            <p>
                🔥 Séries de musculação: ${seriesMusculacao}
            </p>

            <p>
                📏 Distância total cardio: ${distanciaCardio.toFixed(2)} km
            </p>
        </div>
    `;
}

function mostrarEstatisticasMusculacao() {

    const historico =
        JSON.parse(
            localStorage.getItem(
                "historicoTreinos"
            )
        ) || [];

    let tempoSegundos = 0;

    let totalSeries = 0;

    let totalCarga = 0;

    let quantidadeCargas = 0;

    for (let treino of historico) {

        tempoSegundos +=
            treino.duracaoSegundos || 0;

        for (let exercicio of treino.exercicios) {

            totalSeries +=
                exercicio.seriesRealizadas || 0;

            if (
                exercicio.cargaAtual &&
                !isNaN(exercicio.cargaAtual)
            ) {

                totalCarga +=
                    Number(
                        exercicio.cargaAtual
                    );

                quantidadeCargas++;
            }
        }
    }

    const horas =
        Math.floor(
            tempoSegundos / 3600
        );

    const minutos =
        Math.floor(
            (tempoSegundos % 3600) / 60
        );

    const mediaCarga =
        quantidadeCargas > 0
            ? (
                totalCarga /
                quantidadeCargas
            ).toFixed(1)
            : 0;

    conteudoTreino.innerHTML = `
        <div class="resumo-final">

            <h2>
                🏋️ Estatísticas da Musculação
            </h2>

            <p>
                💪 Treinos realizados:
                ${historico.length}
            </p>

            <p>
                🔥 Séries realizadas:
                ${totalSeries}
            </p>

            <p>
                ⏱ Tempo total:
                ${horas}h ${minutos}min
            </p>

            <p>
                🏋️ Média das cargas:
                ${mediaCarga} kg
            </p>

        </div>
    `;
}

function mostrarEstatisticasCardio() {

    const historicoCardio =
        JSON.parse(
            localStorage.getItem("historicoCardio")
        ) || [];

    let tempoSegundos = 0;
    let distanciaTotal = 0;

    let corridas = 0;
    let caminhadas = 0;
    let bicicletas = 0;
    let distanciaCorridas = 0;
    let distanciaCaminhadas = 0;
    let distanciaBicicletas = 0;
    let melhorRitmoCorrida = null;
    let melhorRitmoCaminhada = null;

    for (let registro of historicoCardio) {

        tempoSegundos +=
            registro.duracaoSegundos || 0;

        distanciaTotal +=
            registro.distancia || 0;

        if (registro.tipo === "Corrida") {

            corridas++;

            distanciaCorridas +=
                registro.distancia || 0;
        }

        if (registro.tipo === "Caminhada") {

            caminhadas++;

            distanciaCaminhadas +=
                registro.distancia || 0;
        }

        if (registro.tipo === "Bicicleta") {

            bicicletas++;

            distanciaBicicletas +=
                registro.distancia || 0;
        }

        if (
            registro.distancia > 0 &&
            registro.duracaoSegundos > 0
        ) {

            const ritmoAtual =
                registro.duracaoSegundos /
                registro.distancia;

            if (registro.tipo === "Corrida") {

                if (
                    melhorRitmoCorrida === null ||
                    ritmoAtual < melhorRitmoCorrida
                ) {

                    melhorRitmoCorrida = ritmoAtual;
                }
            }

            if (registro.tipo === "Caminhada") {

                if (
                    melhorRitmoCaminhada === null ||
                    ritmoAtual < melhorRitmoCaminhada
                ) {

                    melhorRitmoCaminhada = ritmoAtual;
                }
            }
        }
    }

    const horas =
        Math.floor(tempoSegundos / 3600);

    const minutos =
        Math.floor(
            (tempoSegundos % 3600) / 60
        );

    const segundos =
        tempoSegundos % 60;

    const ritmoMedioSegundosPorKm =
        distanciaTotal > 0
            ? Math.round(
                tempoSegundos / distanciaTotal
            )
            : 0;

    const ritmoMedioMinutos =
        Math.floor(
            ritmoMedioSegundosPorKm / 60
        );

    const ritmoMedioSegundos =
        ritmoMedioSegundosPorKm % 60;

    const melhorRitmoCorridaMinutos =
    melhorRitmoCorrida !== null
        ? Math.floor(melhorRitmoCorrida / 60)
        : 0;

    const melhorRitmoCorridaSegundos =
        melhorRitmoCorrida !== null
            ? Math.round(melhorRitmoCorrida % 60)
            : 0;

    const melhorRitmoCaminhadaMinutos =
        melhorRitmoCaminhada !== null
            ? Math.floor(melhorRitmoCaminhada / 60)
            : 0;

    const melhorRitmoCaminhadaSegundos =
        melhorRitmoCaminhada !== null
            ? Math.round(melhorRitmoCaminhada % 60)
            : 0;

    conteudoTreino.innerHTML = `
        <div class="resumo-final">

            <h2>🏃 Estatísticas do Cardio</h2>

            <p>
                🏃 Atividades realizadas:
                ${historicoCardio.length}
            </p>

            <p>
                🚶 Caminhadas:
                ${caminhadas}
                (${distanciaCaminhadas.toFixed(2)} km)
            </p>

            <p>
                🏃 Corridas:
                ${corridas}
                (${distanciaCorridas.toFixed(2)} km)
            </p>

            <p>
                🚴 Bicicletas:
                ${bicicletas}
                (${distanciaBicicletas.toFixed(2)} km)
            </p>

            <p>
                ⏱ Tempo total:
                ${horas}h ${minutos}min ${segundos}s
            </p>

            <p>
                📏 Distância total:
                ${distanciaTotal.toFixed(2)} km
            </p>

            <p>
                🔥 Ritmo médio:
                ${ritmoMedioMinutos}min ${ritmoMedioSegundos}s/km
            </p>

            <p>
                🏆 Melhor ritmo corrida:
                ${melhorRitmoCorridaMinutos}min ${melhorRitmoCorridaSegundos}s/km
            </p>

            <p>
                🏆 Melhor ritmo caminhada:
                ${melhorRitmoCaminhadaMinutos}min ${melhorRitmoCaminhadaSegundos}s/km
            </p>

        </div>
    `;
}

function mostrarMenuHistorico() {

    historicoTreinosDiv.classList.add(
        "oculto"
    );

    limparDestaqueTreinos();

    limparDestaqueNavegacao();

    btnHistorico.classList.add(
        "treino-atual"
    );

    const historicoMusculacao =
        JSON.parse(
            localStorage.getItem("historicoTreinos")
        ) || [];

    const historicoCardio =
        JSON.parse(
            localStorage.getItem("historicoCardio")
        ) || [];

    const totalGeral =
        historicoMusculacao.length +
        historicoCardio.length;

    conteudoTreino.innerHTML = `
        <div class="resumo-final">
            <h2>📜 Histórico</h2>

            <button id="btnHistoricoMusculacao">
                🏋️ Musculação (${historicoMusculacao.length})
            </button>

            <button id="btnHistoricoCardio">
                🏃 Cardio (${historicoCardio.length})
            </button>
        </div>
    `;

    const btnHistoricoMusculacao =
        document.getElementById("btnHistoricoMusculacao");

    btnHistoricoMusculacao.addEventListener(
        "click",
        function() {

            quantidadeHistoricoVisivel = 10;

            conteudoTreino.innerHTML = "";

            mostrarHistorico("");
        }
    );

    const btnHistoricoCardio =
        document.getElementById(
            "btnHistoricoCardio"
        );

    btnHistoricoCardio.addEventListener(
        "click",
        function() {

            mostrarHistoricoCardio();
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
        historico
            .map(function(registro, indice) {

                return {
                    ...registro,
                    numeroRegistro: indice + 1
                };
            })
            .reverse();

    const historicoFiltrado =
        historicoOrdenado.filter(
            function(registro) {

                const textoBusca =
                    `
                    ${registro.numeroRegistro}
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

                console.log(
                    "Filtro:",
                    filtro,
                    "| Registro:",
                    registro.treino,
                    "| Encontrou:",
                    textoBusca.includes(
                        filtro.toLowerCase()
                    )
                );

                return textoBusca.includes(
                    filtro.toLowerCase()
                );
            }
        );

    const historicoVisivel =
        historicoFiltrado.slice(
            0,
            quantidadeHistoricoVisivel
        );

    if (historico.length === 0) {

        html += `
            <p>
                Nenhum treino finalizado ainda.
            </p>
        `;

    } else if (historicoFiltrado.length === 0) {

        html += `
            <p>
                Nenhum resultado encontrado.
            </p>
        `;

    } else {

        for (let i = 0; i < historicoVisivel.length; i++) {

            const registro =
                historicoVisivel[i];

            const idAncora =
                i === quantidadeHistoricoVisivel - 10
                    ? "id='primeiroRegistroNovo'"
                    : "";

            let listaExercicios = "";

            for (let exercicio of registro.exercicios) {

                listaExercicios += `
                    <li>
                        ${exercicio.nome}
                        -
                        ${exercicio.cargaAtual || "Sem carga"} Kg
                        -
                        ${exercicio.seriesRealizadas}/${exercicio.series} séries
                    </li>
                `;
            }

            html += `
                <div class="cartao-historico" ${idAncora}>

                    <h3>
                        ${registro.numeroRegistro} - ${registro.treino}
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

    if (
        historicoFiltrado.length >
        quantidadeHistoricoVisivel
    ) {

        html += `
            <button id="btnVerMaisHistorico">
                Ver mais
            </button>
        `;
    }

    historicoTreinosDiv.innerHTML = html;

    limparDestaqueTreinos();

    limparDestaqueNavegacao();

    btnHistorico.classList.add(
        "treino-atual"
    );

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

        const btnBuscarHistorico =
            document.getElementById(
                "btnBuscarHistorico"
            );

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

                            quantidadeHistoricoVisivel = 10;

                            mostrarHistorico(
                                inputBuscarHistorico.value
                            );
                        },
                        500
                    );
            }
        );
    }

    const btnVerMaisHistorico =
        document.getElementById(
            "btnVerMaisHistorico"
        );

    if (btnVerMaisHistorico) {

        btnVerMaisHistorico.addEventListener(
            "click",
            function() {

                quantidadeHistoricoVisivel += 10;

                mostrarHistorico(filtro);

                setTimeout(
                    function() {

                        const primeiroRegistroNovo =
                            document.getElementById(
                                "primeiroRegistroNovo"
                            );

                        if (primeiroRegistroNovo) {

                            primeiroRegistroNovo.scrollIntoView(
                                {
                                    behavior: "smooth",
                                    block: "start"
                                }
                            );
                        }
                    },
                    100
                );
            }
        );
    }
}

function mostrarHistoricoCardio() {

    const historicoCardio =
        JSON.parse(
            localStorage.getItem(
                "historicoCardio"
            )
        ) || [];

    let html = `
        <h2>
            🏃 Histórico Cardio
            (${historicoCardio.length})
        </h2>
    `;

    const historicoOrdenado =
        historicoCardio.slice().reverse();

    for (let registro of historicoOrdenado) {

        const minutos =
            Math.floor(
                registro.duracaoSegundos / 60
            );

        const segundos =
            registro.duracaoSegundos % 60;

        let informacoesExtras = "";

        if (registro.velocidade) {

            informacoesExtras += `
                <p>
                    ⚡ Velocidade: ${registro.velocidade} km/h
                </p>
            `;
        }

        if (registro.inclinacao) {

            informacoesExtras += `
                <p>
                    ⛰ Inclinação: ${registro.inclinacao}%
                </p>
            `;
        }

        if (registro.resistencia) {

            informacoesExtras += `
                <p>
                    ⚙ Resistência: ${registro.resistencia}
                </p>
            `;
        }

        if (registro.observacoes) {

            informacoesExtras += `
                <p>
                    📝 ${registro.observacoes}
                </p>
            `;
        }

        html += `
            <div class="cartao-historico">

                <h3>
                    ${registro.tipo}
                </h3>

                <p>
                    📅 ${registro.data}
                </p>

                <p>
                    📍 ${registro.local}
                </p>

                <p>
                    ⏱ ${minutos}min ${segundos}s
                </p>

                <p>
                    📏 ${registro.distancia} km
                </p>

                ${informacoesExtras}

            </div>
        `;
    }

    conteudoTreino.innerHTML = html;
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

function limparDestaqueTreinos() {

    const botoesTreino =
        listaTreinos.querySelectorAll("button");

    for (let botao of botoesTreino) {

        botao.classList.remove(
            "treino-sugerido"
        );
        
        botao.classList.remove(
            "treino-atual"
        );
    }
}

function limparDestaqueNavegacao() {
    const botoesNavegacao =
        document.querySelectorAll(
            ".btn-navegacao"
        );

    for (let botao of botoesNavegacao) {

        botao.classList.remove(
            "treino-atual"
        );
    }
}

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

                limparDestaqueTreinos();

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

const btnEstatisticas =
    document.getElementById("btnEstatisticas");

const btnCaminhada =
    document.getElementById("btnCaminhada");

const btnCorrida =
    document.getElementById("btnCorrida");

const btnBicicleta =
    document.getElementById("btnBicicleta");

const btnCardio =
    document.getElementById("btnCardio");

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

        quantidadeHistoricoVisivel = 10;

        mostrarMenuHistorico();
    }
);

btnEstatisticas.addEventListener(
    "click",
    mostrarEstatisticas
)

btnCorrida.addEventListener(
    "click",
    function() {

        mostrarTelaCardio("Corrida");
    }
);

btnCaminhada.addEventListener(
    "click",
    function() {

        mostrarTelaCardio("Caminhada");
    }
);

btnBicicleta.addEventListener(
    "click",
    function() {

        mostrarTelaCardio("Bicicleta");
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

let temporizadorBuscaHistorico = null;

let inicioTreino = null;

let cronometroTreino = null;

let indiceEdicao = null;

let quantidadeHistoricoVisivel = 10;

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
