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
                    ⏱ Descanso
                </button>
            
                <button
                    class="btn-concluirSerie btn-sucesso"
                    data-indice="${i}"
                    ${concluido ? "disabled" : ""}>
                    ✅ Série
                </button>

                <button
                    class="btn-editarExercicio btn-editar"
                    data-indice="${i}">
                    ✏️ Editar
                </button>

                <button
                    class="btn-excluirExercicio btn-excluir"
                    data-indice="${i}">
                    🗑 Excluir
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

    if (exercicios.length === 0) {

        conteudoTreino.innerHTML = `

            <div class="cartao-exercicio sem-treino">

                <h2>
                    🏋️ ${titulo}
                </h2>

                <p>
                    Nenhum exercício cadastrado ainda.
                </p>

                <p>
                    Clique em
                    <b>+ Adicionar Exercício</b>
                    para montar este treino.
                </p>

            </div>

        `;


        conteudoTreino.scrollIntoView(
            {
                behavior: "smooth",
                block: "start"
            }
        );


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

        <div class="area-finalizar-treino">

            <button id="btnFinalizarTreino">
                🏁 Finalizar Treino
            </button>

        </div>
        
    `;

    iniciarCronometroTreino();
        
    const btnFinalizarTreino =
        document.getElementById("btnFinalizarTreino");

    btnFinalizarTreino.addEventListener(
        "click",
        finalizarTreino
    );

    conteudoTreino.scrollIntoView(
        {
            behavior: "smooth",
            block: "start"
        }
    );

    const botoesDescanso = document.querySelectorAll(".btn-descanso");
    for (let botao of botoesDescanso) {
        botao.addEventListener("click", function() {

            const indice = Number(botao.dataset.indice);
            const exercicio = exercicios[indice];
        
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

            if (tempo === 0) {
               
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

            btnMostrarFormulario.disabled = true;

            document.getElementById("nomeExercicio").value = exercicio.nome;

            document.getElementById("seriesExercicio").value = exercicio.series;

            document.getElementById("repeticoesExercicio").value = exercicio.repeticoes;

            document.getElementById("cargaExercicio").value = exercicio.cargaAtual;

            document.getElementById("descansoExercicio").value = exercicio.descanso;

            document.getElementById("gifExercicio").value = exercicio.gif;

            document.getElementById("videoExercicio").value = exercicio.video;


            conteudoGerenciarTreinos.classList.remove(
                "oculto"
            );


            btnAbrirGerenciarTreinos.textContent =
                "⚙️ Gerenciar Treinos ⌃";


            formularioExercicio.classList.remove(
                "oculto"
            );

            formularioExercicio.style.display = "block";

            formularioExercicio.classList.add(
                "formulario-edicao"
            );

            document.querySelector(
                "#formularioExercicio h3"
            ).textContent =
                "✏️ Editar Exercício";

            document.getElementById(
                "btnSalvarExercicio"
            ).textContent =
                "Salvar Alterações";

            formularioExercicio.scrollIntoView(
                {
                    behavior: "smooth",
                    block: "start"
                }
            );
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


        if (!inicioTreino) {

            inicioTreino =
                new Date();
        }


        cronometroTreino =
            setInterval(
                function() {


                    const agora =
                        new Date();


                    const diferenca =
                        tempoTreinoPausado +
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

    let algumaSerieFeita = false;


    for (let exercicio of treinoAtual) {

        if (exercicio.seriesRealizadas > 0) {

            algumaSerieFeita = true;
        }
    }


    if (!algumaSerieFeita) {

        alert(
            "Nenhuma série foi realizada ainda."
        );

        return;
    }

    const confirmar = confirm(
        "Deseja finalizar o treino?"
    );

    if (!confirmar) {
        return;
    }

    const treinoFinalizado = tituloAtual;

    const exerciciosFinalizados =
        structuredClone(treinoAtual);

    let seriesFeitasAntesDeSalvar = 0;

    for (let exercicio of exerciciosFinalizados) {

        seriesFeitasAntesDeSalvar +=
            exercicio.seriesRealizadas;
    }

    if (seriesFeitasAntesDeSalvar === 0) {

        const salvarMesmoAssim = confirm(
            "Você não concluiu nenhuma série. Deseja salvar esse treino no histórico mesmo assim?"
        );

        if (!salvarMesmoAssim) {
            return;
        }
    }

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

    inicioTreino = null;

    limparFormularioExercicio();

    tituloAtual = "";
    treinoAtual = [];
    chaveTreinoAtual = "";

    criarBotoesTreinos();

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

            limparFormularioExercicio();

            conteudoTreino.innerHTML = "";

            conteudoCardio.innerHTML = "";

            limparTodosOsDestaques();

            criarBotoesTreinos();
        }
    );
}

function mostrarTelaCardio(tipoAtividade) {

    historicoTreinosDiv.classList.add(
        "oculto"
    );
    
    limparTodosOsDestaques();

    if (tipoAtividade === "Caminhada") {

        btnCaminhada.classList.add(
            "treino-atual"
        );
    }

    if (tipoAtividade === "Corrida") {

        btnCorrida.classList.add(
            "treino-atual"
        );
    }

    if (tipoAtividade === "Bicicleta") {

        btnBicicleta.classList.add(
            "treino-atual"
        );
    }

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

    conteudoCardio.innerHTML = `
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

    conteudoCardio.scrollIntoView(
        {
            behavior: "smooth",
            block: "start"
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
            <div class="campo-cardio">
                <label>Velocidade média:</label>
                <input
                    type="number"
                    id="velocidadeCardio"
                    step="0.1">
            </div>

            <div class="campo-cardio">
                <label>Inclinação:</label>
                <input
                    type="number"
                    id="inclinacaoCardio"
                    step="0.1">
            </div>
        `;
    }

    if (
        tipoAtividade === "Caminhada" &&
        localAtividade === "Esteira"
    ) {

        camposExtras = `
            <div class="campo-cardio">
                <label>Inclinação:</label>
                <input
                    type="number"
                    id="inclinacaoCardio"
                    step="0.1">
            </div>
        `;
    }

    if (
        tipoAtividade === "Bicicleta" &&
        localAtividade === "Ergométrica"
    ) {

        camposExtras = `
            <div class="campo-cardio">
                <label>Resistência:</label>
                <input
                    type="number"
                    id="resistenciaCardio">
            </div>
        `;
    }

    conteudoCardio.innerHTML = `
        <div class="resumo-final">
            <h2>${tipoAtividade}</h2>

            <p>
                Local: ${localAtividade}
            </p>

            <div class="campo-cardio">
                <label>Tempo:</label>

                <div class="tempo-cardio">

                    <input
                        type="number"
                        id="horasCardio"
                        min="0"
                        placeholder="Horas">

                    <input
                        type="number"
                        id="minutosCardio"
                        min="0"
                        max="59"
                        placeholder="Min">

                    <input
                        type="number"
                        id="segundosCardio"
                        min="0"
                        max="59"
                        placeholder="Seg">

                </div>
            </div>

            <div class="campo-cardio">
                <label>Distância em km:</label>
                <input
                    type="number"
                    id="distanciaCardio"
                    step="0.01">
            </div>

            ${camposExtras}

            <div class="campo-cardio">
                <label>Observações:</label>
                <input
                    type="text"
                    id="observacoesCardio">
            </div>

            <br>

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

            if (duracaoSegundos <= 0) {

                alert(
                    "Informe o tempo da atividade."
                );

                return;
            }

            if (distancia <= 0) {

                alert(
                    "Informe a distância da atividade."
                );

                return;
            }

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

    conteudoCardio.innerHTML = `
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

            conteudoCardio.innerHTML = "";

            limparTodosOsDestaques();

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

    historicoTreinosDiv.innerHTML = `
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

    historicoTreinosDiv.classList.remove(
        "oculto"
    );

    historicoTreinosDiv.scrollIntoView(
        {
            behavior: "smooth",
            block: "start"
        }
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

    historicoTreinosDiv.innerHTML = `
        <div class="resumo-final">
            <h2>📈 Estatísticas Gerais</h2>

            <p>
                🏋️ Treinos de musculação: ${historicoMusculacao.length}
            </p>

            <div class="grupo-estatistica-cardio">

            <p class="titulo-grupo-cardio">
                    ❤️ Cardio:
                    ${historicoCardio.length}
                </p>

                <div class="subestatisticas-cardio">

                    <p>
                        🚶 Caminhadas:
                        ${totalCaminhadas}
                    </p>

                    <p>
                        🏃 Corridas:
                        ${totalCorridas}
                    </p>

                    <p>
                        🚴 Bicicletas:
                        ${totalBicicletas}
                    </p>

                </div>

            </div>
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

        if (
            historico.length === 0
        ) {

            historicoTreinosDiv.innerHTML = `

                <div class="sem-treino">

                    <p>
                        📅 Nenhum treino registrado ainda.
                    </p>

                    <p>
                        Finalize seu primeiro treino para criar o histórico.
                    </p>

                </div>

            `;


            historicoTreinosDiv.classList.remove(
                "oculto"
            );


            return;
        }

    let tempoSegundos = 0;

    let totalSeries = 0;

    let totalCarga = 0;

    let quantidadeCargas = 0;

    let exerciciosRealizados = 0;

    let maiorCarga = 0;

    let nomeMaiorCarga = "";

    for (let treino of historico) {

        tempoSegundos +=
            treino.duracaoSegundos || 0;

        for (let exercicio of treino.exercicios) {

            totalSeries +=
                exercicio.seriesRealizadas || 0;

        if (exercicio.seriesRealizadas > 0) {

            exerciciosRealizados++;
        }

            if (
                exercicio.cargaAtual &&
                !isNaN(exercicio.cargaAtual)
            ) {

                totalCarga +=
                    Number(
                        exercicio.cargaAtual
                    );

                quantidadeCargas++;

                if (
                    Number(exercicio.cargaAtual) >
                    maiorCarga
                ) {

                    maiorCarga =
                        Number(exercicio.cargaAtual);

                    nomeMaiorCarga =
                        exercicio.nome;
                }
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

    historicoTreinosDiv.innerHTML = `
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
                💪 Exercícios realizados:
                ${exerciciosRealizados}
            </p>

            <p>
                ⏱ Tempo total:
                ${horas}h ${minutos}min
            </p>

            <p>
                🏋️ Média das cargas:
                ${mediaCarga} kg
            </p>

            <p>
                🏆 Maior carga:
                ${maiorCarga > 0 ? maiorCarga + " kg - " + nomeMaiorCarga : "Sem dados"}
            </p>

        </div>
    `;
}

function mostrarEstatisticasCardio() {

    const historicoCardio =
        JSON.parse(
            localStorage.getItem("historicoCardio")
        ) || [];

    let tempoTotal = 0;
    let distanciaTotal = 0;

    const dados = {
        Corrida: {
            quantidade: 0,
            distancia: 0,
            tempo: 0,
            melhorRitmo: null,
            maiorDistancia: 0,
            maiorDuracao: 0
        },

        Caminhada: {
            quantidade: 0,
            distancia: 0,
            tempo: 0,
            melhorRitmo: null,
            maiorDistancia: 0,
            maiorDuracao: 0
        },

        Bicicleta: {
            quantidade: 0,
            distancia: 0,
            tempo: 0,
            maiorDistancia: 0,
            maiorDuracao: 0,
            maiorVelocidade: 0,
            maiorResistencia: 0
        }
    };

    for (let registro of historicoCardio) {

        tempoTotal +=
            registro.duracaoSegundos || 0;

        distanciaTotal +=
            registro.distancia || 0;

        const tipo =
            registro.tipo;

        if (!dados[tipo]) {
            continue;
        }

        dados[tipo].quantidade++;

        dados[tipo].distancia +=
            registro.distancia || 0;

        dados[tipo].tempo +=
            registro.duracaoSegundos || 0;

        if (
            registro.distancia >
            dados[tipo].maiorDistancia
        ) {
            dados[tipo].maiorDistancia =
                registro.distancia;
        }

        if (
            registro.duracaoSegundos >
            dados[tipo].maiorDuracao
        ) {
            dados[tipo].maiorDuracao =
                registro.duracaoSegundos;
        }

        if (
            tipo !== "Bicicleta" &&
            registro.distancia > 0 &&
            registro.duracaoSegundos > 0
        ) {

            const ritmo =
                registro.duracaoSegundos /
                registro.distancia;

            if (
                dados[tipo].melhorRitmo === null ||
                ritmo < dados[tipo].melhorRitmo
            ) {
                dados[tipo].melhorRitmo = ritmo;
            }
        }

        if (tipo === "Bicicleta") {

            if (
                Number(registro.velocidade) >
                dados.Bicicleta.maiorVelocidade
            ) {
                dados.Bicicleta.maiorVelocidade =
                    Number(registro.velocidade);
            }

            if (
                Number(registro.resistencia) >
                dados.Bicicleta.maiorResistencia
            ) {
                dados.Bicicleta.maiorResistencia =
                    Number(registro.resistencia);
            }
        }
    }

    function formatarTempo(segundosTotais) {

        const horas =
            Math.floor(segundosTotais / 3600);

        const minutos =
            Math.floor(
                (segundosTotais % 3600) / 60
            );

        const segundos =
            segundosTotais % 60;

        return `${horas}h ${minutos}min ${segundos}s`;
    }

    function formatarRitmo(ritmo) {

        if (ritmo === null) {
            return "Sem dados";
        }

        const minutos =
            Math.floor(ritmo / 60);

        const segundos =
            Math.round(ritmo % 60);

        return `${minutos}min ${segundos}s/km`;
    }

    historicoTreinosDiv.innerHTML = `
        <div class="resumo-final">

            <h2>🏃 Estatísticas do Cardio</h2>

            <p>
                🏃 Atividades realizadas:
                ${historicoCardio.length}
            </p>

            <p>
                ⏱ Tempo total:
                ${formatarTempo(tempoTotal)}
            </p>

            <p>
                📏 Distância total:
                ${distanciaTotal.toFixed(2)} km
            </p>

            <hr>

            <h3>🏃 Corridas</h3>

            <p>Quantidade: ${dados.Corrida.quantidade}</p>
            <p>Distância: ${dados.Corrida.distancia.toFixed(2)} km</p>
            <p>Tempo: ${formatarTempo(dados.Corrida.tempo)}</p>
            <p>Melhor ritmo: ${formatarRitmo(dados.Corrida.melhorRitmo)}</p>
            <p>Maior distância: ${dados.Corrida.maiorDistancia.toFixed(2)} km</p>
            <p>Maior duração: ${formatarTempo(dados.Corrida.maiorDuracao)}</p>

            <hr>

            <h3>🚶 Caminhadas</h3>

            <p>Quantidade: ${dados.Caminhada.quantidade}</p>
            <p>Distância: ${dados.Caminhada.distancia.toFixed(2)} km</p>
            <p>Tempo: ${formatarTempo(dados.Caminhada.tempo)}</p>
            <p>Melhor ritmo: ${formatarRitmo(dados.Caminhada.melhorRitmo)}</p>
            <p>Maior distância: ${dados.Caminhada.maiorDistancia.toFixed(2)} km</p>
            <p>Maior duração: ${formatarTempo(dados.Caminhada.maiorDuracao)}</p>

            <hr>

            <h3>🚴 Bicicletas</h3>

            <p>Quantidade: ${dados.Bicicleta.quantidade}</p>
            <p>Distância: ${dados.Bicicleta.distancia.toFixed(2)} km</p>
            <p>Tempo: ${formatarTempo(dados.Bicicleta.tempo)}</p>
            <p>Maior distância: ${dados.Bicicleta.maiorDistancia.toFixed(2)} km</p>
            <p>Maior duração: ${formatarTempo(dados.Bicicleta.maiorDuracao)}</p>
            <p>
                Maior velocidade:
                ${
                    dados.Bicicleta.maiorVelocidade > 0
                        ? dados.Bicicleta.maiorVelocidade + " km/h"
                        : "Sem dados"
                }
            </p>

            <p>
                Maior resistência:
                ${
                    dados.Bicicleta.maiorResistencia > 0
                        ? dados.Bicicleta.maiorResistencia
                        : "Sem dados"
                }
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

    historicoTreinosDiv.innerHTML = `
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

    historicoTreinosDiv.classList.remove(
        "oculto"
    );

    historicoTreinosDiv.scrollIntoView(
        {
            behavior: "smooth",
            block: "start"
        }
    );

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

                    <button
                        class="btn-excluir-historico"
                        data-indice="${registro.numeroRegistro - 1}">
                        🗑️ Excluir registro
                    </button>

                </div>
            `;
        }

        const botoesExcluirHistorico =
            document.querySelectorAll(
                ".btn-excluir-historico"
            );

        for (let botao of botoesExcluirHistorico) {

            botao.addEventListener(
                "click",
                function() {

                    const indice =
                        Number(botao.dataset.indice);

                    const confirmar = confirm(
                        "Deseja excluir este registro do histórico?"
                    );

                    if (!confirmar) {
                        return;
                    }

                    historico.splice(
                        indice,
                        1
                    );

                    localStorage.setItem(
                        "historicoTreinos",
                        JSON.stringify(historico)
                    );

                    mostrarHistorico(filtro);
                }
            );
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

        const botoesExcluirHistorico =
        document.querySelectorAll(
            ".btn-excluir-historico"
        );

    for (let botao of botoesExcluirHistorico) {

        botao.addEventListener(
            "click",
            function() {

                const indice =
                    Number(botao.dataset.indice);

                const confirmar = confirm(
                    "Deseja excluir este registro do histórico?"
                );

                if (!confirmar) {
                    return;
                }

                historico.splice(
                    indice,
                    1
                );

                localStorage.setItem(
                    "historicoTreinos",
                    JSON.stringify(historico)
                );

                mostrarHistorico(filtro);
            }
        );
    }

    historicoTreinosDiv.scrollIntoView(
        {
            behavior: "smooth",
            block: "start"
        }
    );

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

    for (let i = 0; i < historicoOrdenado.length; i++) {

        const registro =
            historicoOrdenado[i];

        const indiceOriginal =
            historicoCardio.length - 1 - i;

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

                <button
                    class="btn-excluir-historico-cardio"
                    data-indice="${indiceOriginal}">
                    🗑️ Excluir registro
                </button>

            </div>
        `;
    }

    historicoTreinosDiv.innerHTML = html;

    historicoTreinosDiv.classList.remove(
        "oculto"
    );

    historicoTreinosDiv.scrollIntoView(
        {
            behavior: "smooth",
            block: "start"
        }
    );

    const botoesExcluirHistoricoCardio =
        document.querySelectorAll(
            ".btn-excluir-historico-cardio"
        );

    for (let botao of botoesExcluirHistoricoCardio) {

        botao.addEventListener(
            "click",
            function() {

                const indice =
                    Number(
                        botao.dataset.indice
                    );

                const confirmar =
                    confirm(
                        "Deseja excluir este registro do histórico de cardio?"
                    );

                if (!confirmar) {
                    return;
                }

                historicoCardio.splice(
                    indice,
                    1
                );

                localStorage.setItem(
                    "historicoCardio",
                    JSON.stringify(
                        historicoCardio
                    )
                );

                mostrarHistoricoCardio();
            }
        );
    }
}

function exportarBackup() {

    try {

        const backup = {

        versaoApp: "1.0",
 
        dataBackup: new Date().toLocaleString("pt-BR"),

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

        historicoCardio:
            JSON.parse(
                localStorage.getItem(
                    "historicoCardio"
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

    const dataBackup =
        new Date()
            .toLocaleDateString(
                "pt-BR"
            )
            .replaceAll(
                "/",
                "-"
            );


    link.download =
        `TreinoPlus-${dataBackup}.json`;
    
        link.click();

    URL.revokeObjectURL(url);


    alert(
        "Backup exportado com sucesso!"
    );


    } catch (erro) {


        console.log(
            "Erro ao exportar backup:",
            erro
        );


        alert(
            "Não foi possível exportar o backup."
        );

    }

}

function importarBackup(evento) {

    const arquivo =
        evento.target.files[0];


    if (!arquivo) {

        return;
    }


    const leitor =
        new FileReader();


    leitor.onload =
        function(eventoLeitura) {


            const dados =
                JSON.parse(
                    eventoLeitura.target.result
                );

            if (
                !dados.treinos
            ) {

                alert(
                    "Este arquivo não parece ser um backup válido do Treino+."
                );

                return;
            }

            const confirmarImportacao =
                confirm(
`📦 Backup Treino+

Versão: ${dados.versaoApp || "Não identificada"}

Criado em: ${dados.dataBackup || "Data desconhecida"}

Deseja importar este backup?`
                );


            if (!confirmarImportacao) {

                return;
            }


            if (dados.treinos) {

                localStorage.setItem(
                    "treinos",
                    JSON.stringify(
                        dados.treinos
                    )
                );
            }


            if (dados.historicoTreinos) {

                localStorage.setItem(
                    "historicoTreinos",
                    JSON.stringify(
                        dados.historicoTreinos
                    )
                );
            }


            if (dados.evolucaoExercicios) {

                localStorage.setItem(
                    "evolucaoExercicios",
                    JSON.stringify(
                        dados.evolucaoExercicios
                    )
                );
            }


            if (dados.historicoCardio) {

                localStorage.setItem(
                    "historicoCardio",
                    JSON.stringify(
                        dados.historicoCardio
                    )
                );
            }


            alert(
                "Backup importado com sucesso! O aplicativo será atualizado."
            );


            inputImportarBackup.value = "";


            location.reload();

        };


    leitor.readAsText(
        arquivo
    );
}

function carregarTreinos() {

    const dadosSalvos =
        localStorage.getItem("treinos");

    if (!dadosSalvos) {
        return {};
    }

    try {

        const dados =
            JSON.parse(dadosSalvos);

        if (
            dados &&
            typeof dados === "object"
        ) {

            return dados;
        }

    } catch (erro) {

        alert(
            "Erro ao carregar os treinos salvos."
        );
    }

    return {};
}

let treinos = carregarTreinos();

let tituloAtual = "";

let treinoAtual = [];

let chaveTreinoAtual = "";

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

function limparDestaqueCardio() {

    btnCaminhada.classList.remove(
        "treino-atual"
    );

    btnCorrida.classList.remove(
        "treino-atual"
    );

    btnBicicleta.classList.remove(
        "treino-atual"
    );
}

function limparTodosOsDestaques() {

    limparDestaqueTreinos();

    limparDestaqueNavegacao();

    limparDestaqueCardio();
}

function criarBotoesTreinos() {
    
    listaTreinos.innerHTML = "";

    const ultimoTreino =
        localStorage.getItem(
            "ultimoTreino"
        );
    
    const nomesTreinos =
    Object.keys(treinos);


    if (nomesTreinos.length === 0) {

        listaTreinos.innerHTML = `
            <div class="sem-treino">

                <p>
                    🏋️ Nenhum treino cadastrado ainda
                </p>

                <p>
                    Crie seu primeiro treino
                    ou importe um backup.
                </p>

            </div>
        `;

        return;
    }


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

    for (let nomeTreino in treinos) {

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

                limparFormularioExercicio();

                if (!inicioTreino) {
                    inicioTreino = new Date();
                }

                limparTodosOsDestaques();

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

function excluirTreino() {

    const nomesTreinos =
        Object.keys(treinos);


    if (nomesTreinos.length === 0) {

        alert(
            "Não existe nenhum treino para excluir."
        );

        return;
    }


    let opcoes = "";

    for (let i = 0; i < nomesTreinos.length; i++) {

        opcoes +=
            `${i + 1} - ${nomesTreinos[i]}\n`;
    }


    const escolha =
        prompt(
            "Digite o número do treino que deseja excluir:\n\n" +
            opcoes
        );


    if (!escolha) {

        return;
    }


    const indice =
        Number(escolha) - 1;


    if (
        indice < 0 ||
        indice >= nomesTreinos.length
    ) {

        alert(
            "Opção inválida."
        );

        return;
    }


    const nomeTreino =
        nomesTreinos[indice];


    const confirmar =
        confirm(
            `Tem certeza que deseja excluir "${nomeTreino}"?`
        );


    if (!confirmar) {

        return;
    }


    delete treinos[nomeTreino];


    localStorage.setItem(
        "treinos",
        JSON.stringify(treinos)
    );

    if (
        chaveTreinoAtual === nomeTreino
    ) {

        conteudoTreino.innerHTML = "";

        treinoAtual = [];

        tituloAtual = "";

        chaveTreinoAtual = "";


        historicoTreinosDiv.classList.add(
            "oculto"
        );


        formularioTreino.classList.add(
            "oculto"
        );


        formularioExercicio.classList.add(
            "oculto"
        );


        limparTodosOsDestaques();


        window.scrollTo(
            {
                top: 0,
                behavior: "smooth"
            }
        );
    }

    criarBotoesTreinos();

    alert(
        "Treino excluído com sucesso!"
    );
}
const conteudoTreino = document.getElementById("conteudoTreino");

const conteudoCardio = document.getElementById("conteudoCardio");

const btnMostrarFormulario = document.getElementById("btnMostrarFormulario");
const formularioExercicio = document.getElementById("formularioExercicio");
const btnCancelarExercicio = document.getElementById("btnCancelarExercicio");

const btnMostrarFormularioTreino = document.getElementById("btnMostrarFormularioTreino");
const formularioTreino = document.getElementById("formularioTreino");
const btnCancelarTreino = document.getElementById("btnCancelarTreino");
const btnExcluirTreino = document.getElementById("btnExcluirTreino");

const btnAbrirGerenciarTreinos = document.getElementById("btnAbrirGerenciarTreinos");
const conteudoGerenciarTreinos = document.getElementById("conteudoGerenciarTreinos");

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

const btnHome =
    document.getElementById(
        "btnHome"
    );

btnHistorico.addEventListener(
    "click",
    function() {

        quantidadeHistoricoVisivel = 10;

        mostrarMenuHistorico();
    }
);

btnHome.addEventListener(
    "click",
    function() {
 
        const treinoIniciado =
            treinoAtual.some(
                function(exercicio) {

                    return (
                        exercicio.seriesRealizadas > 0
                    );
                }
            );


        if (
            treinoIniciado
        ) {

            const confirmarSaida =
                confirm(
                    "Existe um treino em andamento. Deseja sair mesmo assim?"
                );


            if (!confirmarSaida) {

                return;
            }

        }

        limparFormularioExercicio();

        conteudoTreino.innerHTML = "";

        conteudoCardio.innerHTML = "";

        historicoTreinosDiv.classList.add(
            "oculto"
        );

        formularioTreino.classList.add(
            "oculto"
        );

        formularioExercicio.classList.add(
            "oculto"
        );

        conteudoGerenciarTreinos.classList.add(
            "oculto"
        );

        btnAbrirGerenciarTreinos.textContent =
            "⚙️ Gerenciar Treinos ⌄";

        limparTodosOsDestaques();

        criarBotoesTreinos();
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

btnExcluirTreino.addEventListener(
    "click",
    excluirTreino
);

btnAbrirGerenciarTreinos.addEventListener(
    "click",
    function() {

        conteudoGerenciarTreinos.classList.toggle(
            "oculto"
        );


        if (
            conteudoGerenciarTreinos.classList.contains(
                "oculto"
            )
        ) {

            btnAbrirGerenciarTreinos.textContent =
                "⚙️ Gerenciar Treinos ⌄";

        } else {

            btnAbrirGerenciarTreinos.textContent =
                "⚙️ Gerenciar Treinos ⌃";
        }
    }
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

btnMostrarFormulario.addEventListener(
    "click",
    function() {

        if (
            !chaveTreinoAtual
        ) {

            alert(
                "Escolha um treino antes de adicionar exercícios."
            );

            return;
        }

        limparFormularioExercicio();

        formularioExercicio.classList.remove(
            "oculto"
        );

        formularioExercicio.scrollIntoView(
            {
                behavior: "smooth",
                block: "start"
            }
        );

    }
);

btnCancelarExercicio.addEventListener(
    "click",
    function() {

        limparFormularioExercicio();

    }
);

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


        if (
            nomeTreino.length > 15
        ) {

            alert(
                "O nome do treino deve ter no máximo 15 caracteres."
            );

            return;
        }

        const treinoJaExiste =
            Object.keys(treinos).some(
                function(nomeExistente) {

                    return nomeExistente.toLowerCase() ===
                        nomeTreino.toLowerCase();
                }
            );

        if (treinoJaExiste) {

            alert(
                "Já existe um treino com esse nome."
            );

            return;
        }

        treinos[nomeTreino] = [];


        localStorage.setItem(
            "treinos",
            JSON.stringify(treinos)
        );


        criarBotoesTreinos();


        tituloAtual = nomeTreino;

        treinoAtual = treinos[nomeTreino];

        chaveTreinoAtual = nomeTreino;


        mostrarTreino(
            nomeTreino,
            treinoAtual
        );


        formularioTreino.classList.add(
            "oculto"
        );


        document.getElementById(
            "nomeTreino"
        ).value = "";


        conteudoTreino.scrollIntoView(
            {
                behavior: "smooth",
                block: "start"
            }
        );
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

    formularioTreino.scrollIntoView(
            {
                behavior: "smooth",
                block: "start"
            }
        );
    }
);

const btnSalvarExercicio = document.getElementById("btnSalvarExercicio");

btnSalvarExercicio.addEventListener("click", function() { 

    const nome =
        document.getElementById("nomeExercicio")
            .value
            .trim();

    const series = document.getElementById("seriesExercicio").value;
        if (!series) {alert("Informe a quantidade de séries.");
            return;
        }

        if (Number(series) <= 0) {
            alert(
                "A quantidade de séries deve ser maior que zero."
            );

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

    if (Number(descanso) <= 0) {
        alert(
            "O tempo de descanso deve ser maior que zero."
        );

        return;
    }

    const exercicioJaExiste =
        treinoAtual.some(
            function(exercicio, indice) {

                return exercicio.nome.toLowerCase() ===
                    nome.toLowerCase() &&
                    indice !== indiceEdicao;
            }
        );

    if (exercicioJaExiste) {

        alert(
            "Já existe um exercício com esse nome neste treino."
        );

        return;
    }

    const gif = document.getElementById("gifExercicio").value;

    const video = document.getElementById("videoExercicio").value;

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

    if (indiceEdicao !== null) {
        
        treinoAtual[indiceEdicao] = novoExercicio;

        indiceEdicao = null;
    
    } else {

        treinoAtual.push(novoExercicio);

    }

    treinos[chaveTreinoAtual] = treinoAtual;

    localStorage.setItem(
        "treinos",
        JSON.stringify(treinos)
    );

    mostrarTreino(
        tituloAtual,
        treinoAtual
    );

    limparFormularioExercicio();

});

window.addEventListener(
    "beforeunload",
    function(evento) {


        const treinoIniciado =
            treinoAtual.some(
                function(exercicio) {

                    return (
                        exercicio.seriesRealizadas > 0
                    );
                }
            );


        if (
            treinoIniciado
        ) {

            evento.preventDefault();

            evento.returnValue = "";

        }

    }
);

window.addEventListener(
    "load",
    function() {

        window.scrollTo(
            {
                top: 0,
                behavior: "instant"
            }
        );

    }
);

let temporizadorBuscaHistorico = null;

let inicioTreino = null;

let cronometroTreino = null;

let indiceEdicao = null;

let quantidadeHistoricoVisivel = 10;

function limparFormularioExercicio() {

    indiceEdicao = null;

    document.getElementById(
        "nomeExercicio"
    ).value = "";

    document.getElementById(
        "seriesExercicio"
    ).value = "";

    document.getElementById(
        "repeticoesExercicio"
    ).value = "";

    document.getElementById(
        "cargaExercicio"
    ).value = "";

    document.getElementById(
        "descansoExercicio"
    ).value = "";

    document.getElementById(
        "gifExercicio"
    ).value = "";

    document.getElementById(
        "videoExercicio"
    ).value = "";

    formularioExercicio.classList.add(
        "oculto"
    );

    formularioExercicio.style.display = "";

    formularioExercicio.classList.remove(
        "formulario-edicao"
    );

    btnMostrarFormulario.disabled = false;

    conteudoGerenciarTreinos.classList.add(
        "oculto"
    );

    btnAbrirGerenciarTreinos.textContent =
        "⚙️ Gerenciar Treinos ⌄";

    document.querySelector(
        "#formularioExercicio h3"
    ).textContent =
        "Novo Exercício";

    document.getElementById(
        "btnSalvarExercicio"
    ).textContent =
        "Salvar Exercício";

}

criarBotoesTreinos();


if (
    "serviceWorker" in navigator
) {

    navigator.serviceWorker.register(
        "service-worker.js"
    )
    .then(
        function() {

            console.log(
                "✅ Treino+ instalado como PWA"
            );

        }
    )
    .catch(
        function(erro) {

            console.log(
                "❌ Erro no PWA:",
                erro
            );

        }
    );

}