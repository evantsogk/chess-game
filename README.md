# Chess game

A simple website to play chess against an AI based on the MiniMax algorithm. It uses the [python-chess](https://python-chess.readthedocs.io/en/latest/) library for move generation and validation, the [chessboard.js](https://chessboardjs.com/) library for the board's UI, and [PyScript](https://pyscript.net/) to run Python code directly in the browser.

The AI uses an optimized version of the MiniMax algorithm, which applies the Alpha-Beta pruning technique to reduce the number of the evaluated nodes and, as a result, the search time for the best move. It also uses iterative deepening and stops the search after it reaches the maximum allowed time.

The evaluation function considers material values and piece-board tables found at [](https://www.chessprogramming.org/Simplified_Evaluation_Function).
