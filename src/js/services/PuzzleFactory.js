escapeApp.factory('PuzzleFactory', [
	function PuzzleFactory() {
		'use strict';

		return {
			operation: {
				name: 'operation',
				dropdown: '(a) - Operation',
				available: true,
				icon: 'stethoscope',
				guess: '',
				answers: ['risky'],
				points: 30,
				track: 'a'
			},
			monopoly: {
				name: 'monopoly',
				dropdown: '(a) - MadGab/Monopoly',
				available: false,
				icon: 'building-o',
				guess: '',
				splitGuess: {
					property: '',
					money: ''
				},
				answers: ['Illinois10'],
				points: 40,
				track: 'a'
			},
			gameJumble: {
				name: 'gameJumble',
				dropdown: '(b) - Game Jumble',
				available: false,
				icon: 'th-list',
				guess: '',
				answers: ['parkerbrothers', 'parkerbros'],
				points: 40,
				track: 'a'
			},
			yahtzee: {
				name: 'yahtzee',
				dropdown: '(a) - Yahtzee',
				available: false,
				icon: 'cubes',
				guess: '',
				dice: _.range(1, 7),
				guessedDice: [5],
				answers: ['4-5-5-5-6'],
				points: 50,
				track: 'a'
			},
			scrabble: {
				name: 'scrabble',
				dropdown: '(a) - Scrabble',
				available: false,
				icon: 'th-large',
				guess: '',
				answers: ['frustrate'],
				points: 50,
				track: 'a'
			},
			battleship: {
				name: 'battleship',
				dropdown: '(b) - Battleship',
				available: true,
				icon: 'ship',
				guess: '',
				coords: [],
				columns: _.range(1, 11),
				rows: 'abcdefghij'.split(''),
				answers: ['g6&i6', 'g6&h6&i6', 'c7&d7'],
				points: 40,
				track: 'b'
			},
			clue: {
				name: 'clue',
				dropdown: '(b) - Clue',
				available: false,
				icon: 'search',
				guess: '',
				splitGuess: {
					who: '',
					what: '',
					where: ''
				},
				suspects: [
					'Mr. Green',
					'Professor Plum',
					'Colonel Mustard',
					'Mrs. Peacock',
					'Miss Scarlet',
					'Mrs. White'
				],
				weapons: [
					'Candlestick',
					'Knife',
					'Lead Pipe',
					'Revolver',
					'Rope',
					'Wrench'
				],
				rooms: [
					'Conservatory',
					'Lounge',
					'Kitchen',
					'Library',
					'Hall',
					'Study',
					'Ballroom',
					'Dining Room',
					'Billiard Room'
				],
				answers: ['Mrs. Peacock&Lead Pipe&Lounge'],
				points: 10,
				track: 'b'
			},
			guessWho: {
				name: 'guessWho',
				dropdown: '(b) - Guess Who?',
				display: 'Guess Who?',
				available: false,
				icon: 'users',
				guess: '',
				answers: ['alex'],
				points: 10,
				track: 'b'
			},
			chess: {
				name: 'chess',
				dropdown: '(b) - Snakes/Chess',
				available: false,
				icon: 'delicious',
				guess: '',
				coords: [],
				columns: 'abcdefgh'.split('').reverse(),
				rows: _.range(1, 9),
				answers: ['h4'],
				points: 20,
				track: 'b'
			},
			taboo: {
				name: 'taboo',
				dropdown: '(c) - Taboo',
				available: false,
				icon: 'ban',
				guess: '',
				answers: ['fly'],
				points: 30,
				track: 'b'
			},
			texasHoldEm: {
				name: 'texasHoldEm',
				dropdown: '(c) - Texas Hold Em',
				available: true,
				display: 'Texas Hold \'Em',
				icon: 'beer',
				guess: '',
				splitGuess: {
					word1: '',
					word2: ''
				},
				answers: ['Daniel Craig', 'Craig Daniel'],
				points: 50,
				track: 'c'
			},
			connect4: {
				name: 'connect4',
				dropdown: '(c) - Connect Four',
				display: 'Connect Four',
				available: false,
				icon: 'table',
				guess: '',
				answers: ['Winner!'],
				points: 30,
				track: 'c'
			},
			fiveRoutes: {
				name: 'fiveRoutes',
				dropdown: '(c) - Five Routes',
				display: 'Animal Crossing',
				available: false,
				icon: 'random',
				animals: [
					'elephant',
					'giraffe',
					'gorilla',
					'lion',
					'zebra'
				],
				orderedAnimals: [],
				guess: '',
				answers: ['elephant-lion-zebra-gorilla-giraffe'],
				points: 40,
				track: 'c'
			},
			wordFind: {
				name: 'wordFind',
				dropdown: '(c) - Word Find',
				available: false,
				icon: 'arrows-alt',
				guess: '',
				splitGuess: {
					word1: '',
					word2: ''
				},
				answers: ['milton bradley'],
				points: 50,
				track: 'c'
			},
			// sudoku: {
			// 	name: 'sudoku',
			// 	display: 'The Price is Right Home Game',
			// 	dropdown: '(d) - Sudoku',
			// 	available: true,
			// 	icon: 'dollar',
			// 	guess: '',
			// 	answers: ['278954613'],
			// 	hints: 1,
			// 	points: 0
			// },
			jigsaw: {
				name: 'jigsaw',
				dropdown: '(d) - Jigsaw',
				available: true,
				icon: 'puzzle-piece',
				guess: '',
				answers: ['75679'],
				points: 40
			}
		};
	}
]);