let currentUser = null;

// Login com nome de jogador
async function login(playerName) {
    try {
        // Cria usuário anônimo
        const { user } = await auth.signInAnonymously();
        
        // Salva dados no Firestore
        await db.collection('players').doc(user.uid).set({
            name: playerName,
            elo: 1000,
            xp: 0,
            level: 1,
            lastOnline: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        currentUser = user;
        showLobby();
    } catch (error) {
        console.error("Erro no login:", error);
    }
}

// Verifica se usuário já está logado
auth.onAuthStateChanged((user) => {
    if (user) {
        currentUser = user;
        showLobby();
    } else {
        showLoginScreen();
    }
});

// app.js
async function findMatch(mode) {
    console.log("Procurando partida...", mode);
    
    try {
        const matchRef = db.collection('matches')
            .where('mode', '==', mode)
            .where('status', '==', 'waiting')
            .limit(1);

        const snapshot = await matchRef.get();
        console.log("Snapshot encontrado:", snapshot.empty);
        
        if (!snapshot.empty) {
            const match = snapshot.docs[0].data();
            console.log("Entrando na partida existente:", match.id);
            await joinMatch(match.id);
        } else {
            console.log("Criando nova partida...");
            const newMatchRef = await db.collection('matches').add({
                mode: mode,
                players: [currentUser.uid],
                status: 'waiting',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                state: { board: [], turn: 0 } // Adicione isso
            });
            console.log("Partida criada! ID:", newMatchRef.id);
            listenForMatchUpdates(newMatchRef.id);
        }
    } catch (error) {
        console.error("Erro no matchmaking:", error);
    }
}

function listenForMatchUpdates(matchId) {
    db.collection('matches').doc(matchId).onSnapshot((doc) => {
        const match = doc.data();
        if (match.status === 'playing') {
            startGame(match);
        }
    });
}

function createGameBoard(mode) {
    const board = document.getElementById('gameBoard');
    board.innerHTML = '';
    const size = mode === '1x1' ? 3 : mode === '2x2' ? 4 : 5;
    
    for (let i = 0; i < size * size; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.index = i;
        cell.addEventListener('click', () => makeMove(i));
        board.appendChild(cell);
    }
    
    board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
}

function updateGameState(matchId, newState) {
    db.collection('matches').doc(matchId).update({
        state: newState,
        lastMove: firebase.firestore.FieldValue.serverTimestamp()
    });
}

// Exemplo de verificação de vitória
function checkWin(state, player) {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // linhas
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // colunas
        [0, 4, 8], [2, 4, 6] // diagonais
    ];
    
    return winConditions.some(condition => 
        condition.every(index => state[index] === player)
    );
}

async function updateElo(winnerId, loserId) {
    const K = 32; // Fator de variação do Elo
    
    const winnerRef = db.collection('players').doc(winnerId);
    const loserRef = db.collection('players').doc(loserId);
    
    const [winnerData, loserData] = await Promise.all([
        winnerRef.get(),
        loserRef.get()
    ]);
    
    const expectedWin = 1 / (1 + Math.pow(10, (loserData.data().elo - winnerData.data().elo) / 400));
    const newWinnerElo = Math.round(winnerData.data().elo + K * (1 - expectedWin));
    const newLoserElo = Math.round(loserData.data().elo + K * (0 - (1 - expectedWin)));
    
    await Promise.all([
        winnerRef.update({ elo: newWinnerElo, xp: firebase.firestore.FieldValue.increment(50) }),
        loserRef.update({ elo: newLoserElo, xp: firebase.firestore.FieldValue.increment(10) })
    ]);
    
    checkLevelUp(winnerRef);
    checkLevelUp(loserRef);
}

function checkLevelUp(playerRef) {
    playerRef.get().then(doc => {
        const data = doc.data();
        const xpNeeded = data.level * 100;
        if (data.xp >= xpNeeded) {
            playerRef.update({
                level: firebase.firestore.FieldValue.increment(1),
                xp: firebase.firestore.FieldValue.increment(-xpNeeded)
            });
        }
    });
}
let currentMatch = null; // Armazena dados da partida atual

// app.js
async function joinMatch(matchId) {
    try {
        await db.collection('matches').doc(matchId).update({
            players: firebase.firestore.FieldValue.arrayUnion(currentUser.uid),
            status: 'playing' // Muda status para iniciar o jogo
        });
        startGame(matchId);
    } catch (error) {
        console.error("Erro ao entrar na partida:", error);
    }
}
// Função para iniciar o jogo
function startGame(matchId) {
    db.collection('matches').doc(matchId).onSnapshot(doc => {
        currentMatch = doc.data();
        renderGame(currentMatch);
    });
}

// Renderiza o tabuleiro e informações do jogo
function renderGame(match) {
    // Garanta que as telas estão alternando corretamente
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('lobby').classList.add('hidden');
    document.getElementById('gameScreen').classList.remove('hidden');
    // Cria o tabuleiro baseado no modo
    const board = document.getElementById('gameBoard');
    board.innerHTML = '';
    const size = match.mode === '1x1' ? 3 : match.mode === '2x2' ? 4 : 5;
    
    // Preenche o tabuleiro
    for (let i = 0; i < size * size; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.textContent = match.state?.[i] || '';
        cell.onclick = () => handleMove(i);
        board.appendChild(cell);
    }
    board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

    // Exibe informações
    document.getElementById('gameInfo').innerHTML = `
        <p>Modo: ${match.mode}</p>
        <p>Jogadores: ${match.players.length}</p>
        <p>Vez de: ${getCurrentPlayerName(match)}</p>
    `;
}

// Determina de quem é a vez
function getCurrentPlayer(match) {
    const turnIndex = match.state?.turn || 0;
    return match.players[turnIndex % match.players.length];
}

// Verifica se o jogador atual pode jogar
function canPlay(match) {
    return getCurrentPlayer(match) === currentUser.uid;
}

// Lida com o clique em uma célula
async function handleMove(cellIndex) {
    if (!canPlay(currentMatch) || currentMatch.state.board[cellIndex]) return;

    const newState = {
        board: [...currentMatch.state.board],
        turn: currentMatch.state.turn + 1
    };
    newState.board[cellIndex] = currentUser.uid;

    // Atualiza o Firestore
    await db.collection('matches').doc(currentMatch.id).update({
        state: newState
    });

    checkWinCondition(newState.board);
}
function checkWinCondition(board) {
    const size = Math.sqrt(board.length);
    const lines = [];

    // Gera linhas horizontais e verticais
    for (let i = 0; i < size; i++) {
        lines.push(Array.from({length: size}, (_, j) => i * size + j)); // Horizontal
        lines.push(Array.from({length: size}, (_, j) => i + j * size)); // Vertical
    }

    // Diagonais
    lines.push(Array.from({length: size}, (_, i) => i * (size + 1))); // Diagonal \
    lines.push(Array.from({length: size}, (_, i) => (i + 1) * (size - 1))); // Diagonal /

    // Verifica vitória
    const winnerLine = lines.find(line => 
        line.every(index => board[index] === board[line[0]] && board[index])
    );

    if (winnerLine) {
        endGame(winnerLine[0]);
    } else if (board.every(cell => cell)) {
        endGame(null); // Empate
    }
}

async function endGame(winnerId) {
    await db.collection('matches').doc(currentMatch.id).update({
        status: 'finished',
        winner: winnerId
    });

    // Atualiza Elo e XP
    if (winnerId) {
        const players = currentMatch.players;
        const losers = players.filter(id => id !== winnerId);
        await updateElo(winnerId, losers);
    }

    // Mostra resultado
    alert(winnerId ? `Vencedor: ${await getPlayerName(winnerId)}` : 'Empate!');
    showLobby();
}

// Busca nome do jogador
async function getPlayerName(playerId) {
    const doc = await db.collection('players').doc(playerId).get();
    return doc.data().name;
}


// Debug: Verifique se o Firebase está conectado
console.log("Firebase inicializado?", firebase.apps.length > 0);

// Debug: Monitora autenticação
auth.onAuthStateChanged((user) => {
    console.log("Status de autenticação:", user ? "Logado" : "Deslogado");
    if (user) console.log("UID do usuário:", user.uid);
});

// Debug: Verifique erros no login
async function login(playerName) {
    try {
        console.log("Tentando login com nome:", playerName);
        const { user } = await auth.signInAnonymously();
        console.log("Usuário anônimo criado:", user.uid);
        
        await db.collection('players').doc(user.uid).set({
            name: playerName,
            elo: 1000,
            xp: 0,
            level: 1,
            lastOnline: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log("Perfil do jogador criado");
        
        currentUser = user;
        showLobby();
    } catch (error) {
        console.error("Erro crítico no login:", error);
        alert("Erro ao conectar: " + error.message);
    }
}

// Função para mostrar/ocultar telas
function showLobby() {
    console.log("Mostrando lobby...");
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('lobby').classList.remove('hidden');
    loadLeaderboard();
}
