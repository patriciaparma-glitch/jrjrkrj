const canvas = document.getElementById("jogo");

// Pegamos o contexto 2D para desenhar
const ctx = canvas.getContext("2d");


// ======================================================
// CONFIGURAÇÕES DO JOGO
// ======================================================

// Altura do chão
const chaoY = 250;

// Gravidade
const gravidade = 0.7;

// Força do pulo
const forcaPulo = -13;


// ======================================================
// CONFIGURAÇÕES DOS CACTOS
// ======================================================

// Velocidade inicial
const velocidadeInicial = 5;

// Velocidade atual
let velocidadeCacto = velocidadeInicial;

// Aumento da velocidade a cada 100 pontos
const aumentoVelocidade = 0.5;

// Velocidade máxima
const velocidadeMaxima = 8;


// ======================================================
// CONFIGURAÇÕES DOS VOADORES
// ======================================================

// Agora os voadores aparecem a cada 200 pontos
const pontosParaVoador = 200;

// Quantos pontos até aparecer outro
const intervaloVoador = 200;

// Quantidade máxima de voadores na tela
const maximoVoador = 5;

// Próxima pontuação que libera um voador
let proximoPontoVoador = pontosParaVoador;


// ======================================================
// DINOSSAURO
// ======================================================

const dinossauro = {
    x: 100,

    // Posição inicial
    y: chaoY - 57,

    // Velocidade vertical
    velocidadeY: 0,

    // Está pulando?
    pulando: false,

    // Está agachado?
    agachado: false
};


// ======================================================
// LISTAS DOS OBJETOS
// ======================================================

// Lista de cactos
const cactos = [];

// Lista de bichinhos voadores
const voadores = [];


// ======================================================
// TEMPO DO PRÓXIMO CACTO
// ======================================================

// Tempo até o próximo cacto
let tempoProximoCacto = 1000;


// ======================================================
// PONTUAÇÃO
// ======================================================

// Pontuação atual
let pontuacao = 0;

// Contador de tempo da pontuação
let tempoPontuacao = 0;

// Último nível de velocidade usado
let ultimoNivelDeVelocidade = 0;


// ======================================================
// RECORDE
// ======================================================

// Pega o recorde salvo no navegador
let recorde = Number(localStorage.getItem("recorde")) || 0;


// ======================================================
// GAME OVER
// ======================================================

// true = jogo parado
let jogoTerminou = false;


// ======================================================
// DESENHAR O CHÃO
// ======================================================

function desenharChao() {

    ctx.fillStyle = "#333333";

    // Linha do chão
    ctx.fillRect(
        0,
        chaoY,
        canvas.width,
        3
    );
}


// ======================================================
// DESENHAR O DINOSSAURO
// ======================================================

function desenharDinossauro() {

    ctx.fillStyle = "#333333";


    // --------------------------------------------------
    // DINOSSAURO AGACHADO
    // --------------------------------------------------

    if (dinossauro.agachado) {

        // Corpo mais baixo
        ctx.fillRect(
            dinossauro.x,
            dinossauro.y + 15,
            38,
            25
        );

        // Cabeça mais baixa
        ctx.fillRect(
            dinossauro.x + 25,
            dinossauro.y + 5,
            25,
            20
        );

        // Pescoço
        ctx.fillRect(
            dinossauro.x + 20,
            dinossauro.y + 12,
            15,
            12
        );

        // Perna esquerda
        ctx.fillRect(
            dinossauro.x + 6,
            dinossauro.y + 35,
            8,
            8
        );

        // Perna direita
        ctx.fillRect(
            dinossauro.x + 24,
            dinossauro.y + 35,
            8,
            8
        );

        // Cauda
        ctx.fillRect(
            dinossauro.x - 10,
            dinossauro.y + 20,
            15,
            8
        );

        // Olho
        ctx.fillStyle = "#ffffff";

        ctx.fillRect(
            dinossauro.x + 41,
            dinossauro.y + 10,
            4,
            4
        );

        return;
    }


    // --------------------------------------------------
    // DINOSSAURO NORMAL
    // --------------------------------------------------

    // Corpo
    ctx.fillRect(
        dinossauro.x,
        dinossauro.y + 15,
        30,
        35
    );

    // Cabeça
    ctx.fillRect(
        dinossauro.x + 20,
        dinossauro.y,
        25,
        25
    );

    // Pescoço
    ctx.fillRect(
        dinossauro.x + 15,
        dinossauro.y + 10,
        15,
        15
    );

    // Perna esquerda
    ctx.fillRect(
        dinossauro.x + 5,
        dinossauro.y + 45,
        8,
        12
    );

    // Perna direita
    ctx.fillRect(
        dinossauro.x + 20,
        dinossauro.y + 45,
        8,
        12
    );

    // Cauda
    ctx.fillRect(
        dinossauro.x - 10,
        dinossauro.y + 25,
        15,
        8
    );

    // Olho
    ctx.fillStyle = "#ffffff";

    ctx.fillRect(
        dinossauro.x + 36,
        dinossauro.y + 6,
        4,
        4
    );
}


// ======================================================
// CRIAR CACTO
// ======================================================

function criarCacto() {

    // Escolhe uma altura aleatória
    const altura = Math.random() < 0.5 ? 30 : 50;

    const largura = 15;

    const cacto = {
        // Começa no lado direito
        x: canvas.width,

        // Fica apoiado no chão
        y: chaoY - altura,

        largura: largura,
        altura: altura
    };

    // Adiciona o cacto à lista
    cactos.push(cacto);
}


// ======================================================
// DESENHAR CACTOS
// ======================================================

function desenharCactos() {

    for (let i = 0; i < cactos.length; i++) {

        const cacto = cactos[i];

        ctx.fillStyle = "#2e8b57";

        // Tronco
        ctx.fillRect(
            cacto.x,
            cacto.y,
            cacto.largura,
            cacto.altura
        );

        // Braços nos cactos altos
        if (cacto.altura >= 50) {

            // Braço esquerdo
            ctx.fillRect(
                cacto.x - 8,
                cacto.y + 15,
                8,
                5
            );

            ctx.fillRect(
                cacto.x - 8,
                cacto.y + 10,
                5,
                10
            );

            // Braço direito
            ctx.fillRect(
                cacto.x + cacto.largura,
                cacto.y + 25,
                8,
                5
            );

            ctx.fillRect(
                cacto.x + cacto.largura + 3,
                cacto.y + 20,
                5,
                10
            );
        }
    }
}


// ======================================================
// CRIAR BICHINHO VOADOR
// ======================================================

function criarVoador() {

    // O voador agora nasce mais alto.
    // Assim o dinossauro agachado consegue passar por baixo.
    const y = 135 + Math.random() * 10;

    const voador = {
        x: canvas.width,
        y: y,

        largura: 30,
        altura: 18
    };

    // Adiciona o voador
    voadores.push(voador);
}


// ======================================================
// TENTAR CRIAR VOADOR
// ======================================================

function tentarCriarVoador() {

    // Não passa de 5 voadores
    if (voadores.length >= maximoVoador) {
        return;
    }

    // Verifica a pontuação
    if (pontuacao < proximoPontoVoador) {
        return;
    }

    // Antes de criar o voador, apagamos os cactos.
    // Durante o voo, os cactos ficam fora do jogo.
    cactos.length = 0;

    // Cria o voador
    criarVoador();

    // O próximo voador será liberado 200 pontos depois
    proximoPontoVoador += intervaloVoador;
}


// ======================================================
// DESENHAR VOADORES
// ======================================================

function desenharVoadores() {

    for (let i = 0; i < voadores.length; i++) {

        const voador = voadores[i];

        // Corpo
        ctx.fillStyle = "#555555";

        ctx.fillRect(
            voador.x,
            voador.y,
            voador.largura,
            voador.altura
        );

        // Asa de cima
        ctx.fillRect(
            voador.x + 5,
            voador.y - 5,
            10,
            5
        );

        // Asa de baixo
        ctx.fillRect(
            voador.x + 15,
            voador.y + voador.altura,
            10,
            5
        );

        // Olho
        ctx.fillStyle = "#ffffff";

        ctx.fillRect(
            voador.x + 22,
            voador.y + 4,
            4,
            4
        );
    }
}


// ======================================================
// DESENHAR PONTUAÇÃO E RECORDE
// ======================================================

function desenharPontuacao() {

    const textoPontuacao =
        String(pontuacao).padStart(5, "0");

    const textoRecorde =
        String(recorde).padStart(5, "0");

    ctx.fillStyle = "#333333";

    ctx.font = "20px Arial";

    ctx.textAlign = "right";

    // Exemplo:
    // HI 00340 00125
    ctx.fillText(
        "HI " +
        textoRecorde +
        "  " +
        textoPontuacao,
        canvas.width - 15,
        25
    );
}


// ======================================================
// ATUALIZAR DINOSSAURO
// ======================================================

function atualizarDinossauro() {

    // Gravidade
    dinossauro.velocidadeY += gravidade;

    // Move verticalmente
    dinossauro.y += dinossauro.velocidadeY;

    // Altura depende de estar agachado
    const alturaAtual =
        dinossauro.agachado ? 40 : 57;

    // Verifica o chão
    if (dinossauro.y + alturaAtual >= chaoY) {

        dinossauro.y =
            chaoY - alturaAtual;

        dinossauro.velocidadeY = 0;

        dinossauro.pulando = false;
    }
}


// ======================================================
// PULAR
// ======================================================

function pular() {

    // Só pula quando está no chão e não está agachado
    if (
        !dinossauro.pulando &&
        !dinossauro.agachado
    ) {

        dinossauro.velocidadeY = forcaPulo;

        dinossauro.pulando = true;
    }
}


// ======================================================
// ATUALIZAR CACTOS
// ======================================================

function atualizarCactos() {

    // --------------------------------------------------
    // SE EXISTIR UM VOADOR, NÃO EXISTEM CACTOS
    // --------------------------------------------------

    if (voadores.length > 0) {

        // Garante que não apareça nenhum cacto
        cactos.length = 0;

        return;
    }


    // Diminui o tempo
    tempoProximoCacto -= 16;


    // Cria um novo cacto
    if (tempoProximoCacto <= 0) {

        criarCacto();

        // Novo intervalo aleatório
        tempoProximoCacto =
            Math.random() * 1000 + 800;
    }


    // Move os cactos
    for (let i = cactos.length - 1; i >= 0; i--) {

        const cacto = cactos[i];

        // Anda para a esquerda
        cacto.x -= velocidadeCacto;

        // Remove quando sai da tela
        if (cacto.x + cacto.largura < 0) {

            cactos.splice(i, 1);
        }
    }
}


// ======================================================
// ATUALIZAR VOADORES
// ======================================================

function atualizarVoadores() {

    // Primeiro verifica se precisa criar um voador
    tentarCriarVoador();


    // Move os voadores
    for (let i = voadores.length - 1; i >= 0; i--) {

        const voador = voadores[i];

        // Move para a esquerda
        voador.x -= velocidadeCacto;

        // Se saiu da tela, remove
        if (voador.x + voador.largura < 0) {

            voadores.splice(i, 1);
        }
    }
}


// ======================================================
// VERIFICAR COLISÃO ENTRE RETÂNGULOS
// ======================================================

function retangulosColidem(
    aEsquerda,
    aDireita,
    aTopo,
    aBaixo,
    bEsquerda,
    bDireita,
    bTopo,
    bBaixo
) {

    // Se os retângulos se sobrepõem,
    // significa que houve uma colisão
    return (
        aDireita > bEsquerda &&
        aEsquerda < bDireita &&
        aBaixo > bTopo &&
        aTopo < bBaixo
    );
}


// ======================================================
// VERIFICAR COLISÕES
// ======================================================

function verificarColisao() {

    // O dinossauro fica menor quando agachado
    const alturaDinossauro =
        dinossauro.agachado ? 40 : 57;


    // Limites do dinossauro
    const dinossauroEsquerda =
        dinossauro.x - 10;

    const dinossauroDireita =
        dinossauro.x + 45;

    const dinossauroTopo =
        dinossauro.y;

    const dinossauroBaixo =
        dinossauro.y + alturaDinossauro;


    // --------------------------------------------------
    // COLISÃO COM CACTOS
    // --------------------------------------------------

    for (let i = 0; i < cactos.length; i++) {

        const cacto = cactos[i];

        const bateu = retangulosColidem(
            dinossauroEsquerda,
            dinossauroDireita,
            dinossauroTopo,
            dinossauroBaixo,

            cacto.x,
            cacto.x + cacto.largura,
            cacto.y,
            cacto.y + cacto.altura
        );

        if (bateu) {

            finalizarJogo();

            return;
        }
    }


    // --------------------------------------------------
    // COLISÃO COM VOADORES
    // --------------------------------------------------

    for (let i = 0; i < voadores.length; i++) {

        const voador = voadores[i];

        const bateu = retangulosColidem(
            dinossauroEsquerda,
            dinossauroDireita,
            dinossauroTopo,
            dinossauroBaixo,

            voador.x,
            voador.x + voador.largura,
            voador.y,
            voador.y + voador.altura
        );

        if (bateu) {

            finalizarJogo();

            return;
        }
    }
}


// ======================================================
// FINALIZAR O JOGO
// ======================================================

function finalizarJogo() {

    jogoTerminou = true;

    // Atualiza o recorde
    if (pontuacao > recorde) {

        recorde = pontuacao;

        // Salva no navegador
        localStorage.setItem(
            "recorde",
            recorde
        );
    }
}


// ======================================================
// ATUALIZAR PONTUAÇÃO
// ======================================================

function atualizarPontuacao() {

    // Faz o tempo passar
    tempoPontuacao += 16;


    // Aumenta a pontuação
    if (tempoPontuacao >= 100) {

        pontuacao++;

        tempoPontuacao = 0;


        // Atualiza o recorde
        if (pontuacao > recorde) {

            recorde = pontuacao;

            localStorage.setItem(
                "recorde",
                recorde
            );
        }
    }


    // Descobre o nível de velocidade
    const nivelAtual =
        Math.floor(pontuacao / 100);


    // Aumenta a velocidade a cada 100 pontos
    if (nivelAtual > ultimoNivelDeVelocidade) {

        velocidadeCacto += aumentoVelocidade;

        // Limita a velocidade
        if (velocidadeCacto > velocidadeMaxima) {

            velocidadeCacto =
                velocidadeMaxima;
        }

        ultimoNivelDeVelocidade =
            nivelAtual;
    }
}


// ======================================================
// GAME OVER
// ======================================================

function desenharGameOver() {

    // Fundo claro
    ctx.fillStyle =
        "rgba(255, 255, 255, 0.8)";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Texto principal
    ctx.fillStyle = "#333333";

    ctx.textAlign = "center";

    ctx.font =
        "bold 40px Arial";

    ctx.fillText(
        "Game Over",
        canvas.width / 2,
        125
    );


    // Pontuação
    ctx.font = "22px Arial";

    ctx.fillText(
        "Pontuação: " +
        String(pontuacao).padStart(5, "0"),
        canvas.width / 2,
        165
    );


    // Recorde
    ctx.fillText(
        "Recorde: " +
        String(recorde).padStart(5, "0"),
        canvas.width / 2,
        195
    );


    // Mensagem
    ctx.font = "20px Arial";

    ctx.fillText(
        "Aperta espaço para jogar de novo",
        canvas.width / 2,
        230
    );
}


// ======================================================
// REINICIAR JOGO
// ======================================================

function reiniciarJogo() {

    // Volta o dinossauro para o começo
    dinossauro.x = 100;
    dinossauro.y = chaoY - 57;

    // Zera movimento vertical
    dinossauro.velocidadeY = 0;

    // Volta ao estado normal
    dinossauro.pulando = false;
    dinossauro.agachado = false;


    // Apaga todos os objetos
    cactos.length = 0;
    voadores.length = 0;


    // Novo intervalo do primeiro cacto
    tempoProximoCacto =
        Math.random() * 1000 + 800;


    // Primeiro voador novamente aos 200 pontos
    proximoPontoVoador = 200;


    // Zera a pontuação
    pontuacao = 0;

    tempoPontuacao = 0;


    // Volta à velocidade inicial
    velocidadeCacto =
        velocidadeInicial;

    ultimoNivelDeVelocidade = 0;


    // O recorde continua salvo
    jogoTerminou = false;
}


// ======================================================
// TECLADO - APERTAR
// ======================================================

document.addEventListener(
    "keydown",
    function(evento) {

        // Espaço no Game Over reinicia
        if (
            jogoTerminou &&
            evento.code === "Space"
        ) {

            evento.preventDefault();

            reiniciarJogo();

            return;
        }


        // Não faz nada depois do Game Over
        if (jogoTerminou) {
            return;
        }


        // Espaço ou seta para cima = pular
        if (
            evento.code === "Space" ||
            evento.code === "ArrowUp"
        ) {

            evento.preventDefault();

            pular();
        }


        // S = agachar
        if (evento.code === "KeyS") {

            dinossauro.agachado = true;
        }
    }
);


// ======================================================
// TECLADO - SOLTAR
// ======================================================

document.addEventListener(
    "keyup",
    function(evento) {

        // Ao soltar S, volta ao normal
        if (evento.code === "KeyS") {

            dinossauro.agachado = false;
        }
    }
);


// ======================================================
// DESENHAR TUDO
// ======================================================

function desenhar() {

    // Limpa a tela
    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Chão
    desenharChao();

    // Dinossauro
    desenharDinossauro();

    // Cactos
    desenharCactos();

    // Voadores
    desenharVoadores();

    // Pontuação e recorde
    desenharPontuacao();

    // Game Over
    if (jogoTerminou) {

        desenharGameOver();
    }
}


// ======================================================
// LOOP PRINCIPAL
// ======================================================

function loop() {

    // Só atualiza se o jogo estiver funcionando
    if (!jogoTerminou) {

        atualizarDinossauro();

        atualizarCactos();

        atualizarVoadores();

        atualizarPontuacao();

        verificarColisao();
    }

    // Desenha tudo
    desenhar();

    // Continua o jogo
    requestAnimationFrame(loop);
}


// ======================================================
// INICIAR
// ======================================================

desenhar();

loop();
