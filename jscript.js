// initial non-interactive, empty board
function onDragStart (source, piece, position, orientation) {	
	return false;
}
var config = {
	sparePieces: true,
	onDragStart: onDragStart,
	pieceTheme: 'img/chesspieces/wikipedia/{piece}.png'
};	
var board = Chessboard('board', config);

const pgnElement = document.getElementById('pgn');
const colorRadios = document.querySelectorAll('input[name="color"]');
const difficultyRadios = document.querySelectorAll('input[name="difficulty"]');


// Close game-over-panel when clicking outside of it.
document.addEventListener('click', (event) => {
	const panel = document.getElementById('game-over-panel');
	if (panel && !panel.contains(event.target)) {
		panel.remove();
	}
});

// The "New Game" button.
document.getElementById("startBtn").addEventListener("click", () => {			
	pgnElement.textContent = "Starting position";	
	for (const radio of difficultyRadios) {
		if (radio.checked) {
			var selectedDifficulty = parseInt(radio.value);			
			break;
		}
	}
	for (const radio of colorRadios) {
		if (radio.checked) {
			var selectedColor = radio.value;			
			break;
		}
	}
	
	// The difficulty value is the maximum search depth. The maximum search time in seconds is the difficulty * 2.
	var chess_game = pyscript.runtime.globals.get('ChessGame')(selectedColor, selectedDifficulty, selectedDifficulty*2);
	var orientation = chess_game.color_str;
	
	// The player can't move pieces if it's not their turn, if they are the opponents' pieces, or if the game has ended.
	function onDragStart (source, piece, position, orientation) {	
		if (chess_game.board.turn !== chess_game.player1.color) {
			return false;
		}
		else if (orientation==='white' && piece.search(/^b/) !== -1) {
			return false;
		}
		else if (orientation==='black' && piece.search(/^w/) !== -1) {
			return false;
		}
		else if (chess_game.board.is_game_over()) {
			return false;
		}
	}
	
	// The game-over panel displays the game's outcome.
	function createGameOverPanel() {
		var result = chess_game.get_result();
		const body = document.querySelector('body');
		const panel = document.createElement('div');
		panel.id = 'game-over-panel';	
		const panelHeader = document.createElement('div');
		panelHeader.classList.add('panel-header');		
		const closeButton = document.createElement('button');
		closeButton.classList.add('close-button');
		closeButton.innerText = '\u00D7';		
		panelHeader.appendChild(closeButton);	
		panel.appendChild(panelHeader);	
		const message = document.createElement('div');
		message.classList.add('panel-message');
		message.innerText = result;
		panel.appendChild(message);
		closeButton.addEventListener('click', () => {
  			panel.remove();
		});
		body.appendChild(panel);
	}
		
	// Makes the move chosen by the computer player.
	function makeMove() {
		fen = chess_game.player2.make_move(chess_game.board);
		board.position(fen);
		pgnElement.textContent = chess_game.get_pgn();
		if (chess_game.board.is_game_over()) {
			createGameOverPanel();
		}
	}
	
	// The computer plays after the human player makes their move. If the human player's move is not valid the piece returns to its original position. 
	function onDrop (source, target, piece, newPos, oldPos, orientation) {
		if (source === target || target === 'offboard') return 'snapback';
		fen = chess_game.player1.make_move(chess_game.board, String(source) + String(target));							
		if (fen) {
			board.position(fen, false);	
			pgnElement.textContent = chess_game.get_pgn();
		}
		else {
			return 'snapback';						
		}
		
		if (!chess_game.board.is_game_over()) {
			window.setTimeout(makeMove, 250);
		}
		else {
			createGameOverPanel();
		}
	}

	// The chess board.
	config = {
		draggable: true,
		dropOffBoard: 'snapback',
		sparePieces: false,
		pieceTheme: 'img/chesspieces/wikipedia/{piece}.png',
		orientation: orientation,
		position: 'start',
		onDragStart: onDragStart,
		onDrop: onDrop		
	};	

	board = Chessboard('board', config);
				
	// The computer makes the first move if it plays as white.
	if (orientation==='black') {
		window.setTimeout(makeMove, 250);
	}
});	

