escapeApp.factory('PuzzleFactory', [
	function PuzzleFactory() {
		'use strict';

		return {
			operation: {
				name: 'operation',
				icon: 'stethoscope',
				guess: '',
				answers: ['risky'],
				attempts: [],
				points: 30,
				track: 1
			},
			monopoly: {
				name: 'monopoly',
				prerequisite: 'operation',
				icon: 'building-o',
				guess: '',
				splitGuess: {
					property: '',
					money: ''
				},
				answers: ['Illinois10'],
				attempts: [],
				points: 40,
				track: 1
			},
			yahtzee: {
				name: 'yahtzee',
				prerequisite: 'monopoly',
				icon: 'cubes',
				guess: '',
				splitGuess: {
					die1: '',
					die2: ''
				},
				answers: ['5&5'],
				attempts: [],
				points: 50,
				track: 1
			},
			scrabble: {
				name: 'scrabble',
				prerequisite: 'yahtzee',
				icon: 'th-large',
				guess: '',
				answers: ['frustrate'],
				attempts: [],
				points: 50,
				track: 1
			},
			battleship: {
				name: 'battleship',
				icon: 'ship',
				guess: '',
				coords: [],
				columns: _.range(1, 11),
				rows: 'abcdefghij'.split(''),
				answers: ['b2&d2'],
				attempts: [],
				points: 40,
				track: 2
			},
			clue: {
				name: 'clue',
				prerequisite: 'battleship',
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
				answers: ['Colonel Mustard&Wrench&Lounge'],
				attempts: [],
				points: 10,
				track: 2
			},
			guessWho: {
				name: 'guessWho',
				display: 'Guess Who?',
				prerequisite: 'clue',
				icon: 'users',
				guess: '',
				answers: ['alex'],
				attempts: [],
				points: 10,
				track: 2
			},
			chess: {
				name: 'chess',
				prerequisite: 'guessWho',
				icon: 'delicious',
				guess: '',
				coords: [],
				columns: 'abcdefgh'.split('').reverse(),
				rows: _.range(1, 9),
				answers: ['h4'],
				attempts: [],
				points: 20,
				track: 2
			},
			crossword: {
				name: 'crossword',
				prerequisite: 'chess',
				icon: 'newspaper-o',
				guess: '',
				answers: ['drmcnordtsieooluon'],
				attempts: [],
				points: 40,
				track: 2
			},
			texasHoldEm: {
				name: 'texasHoldEm',
				display: 'Texas Hold \'Em',
				icon: 'beer',
				guess: '',
				splitGuess: {
					word1: '',
					word2: ''
				},
				answers: ['Daniel Craig', 'Craig Daniel'],
				attempts: [],
				points: 50,
				track: 3
			},
			connect4: {
				name: 'connect4',
				display: 'Connect Four',
				prerequisite: 'texasHoldEm',
				icon: 'table',
				guess: '',
				answers: ['Winner!'],
				attempts: [],
				points: 30,
				track: 3
			},
			fiveRoutes: {
				name: 'fiveRoutes',
				prerequisite: 'connect4',
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
				attempts: [],
				points: 40,
				track: 3
			},
			wordFind: {
				name: 'wordFind',
				prerequisite: 'fiveRoutes',
				icon: 'arrows-alt',
				guess: '',
				splitGuess: {
					word1: '',
					word2: ''
				},
				answers: ['milton bradley'],
				attempts: [],
				points: 50,
				track: 3
			},
			taboo: {
				name: 'taboo',
				prerequisite: 'wordFind',
				icon: 'ban',
				guess: '',
				answers: ['fly'],
				attempts: [],
				points: 30,
				track: 3
			},
			jigsaw: {
				name: 'jigsaw',
				icon: 'puzzle-piece',
				guess: '',
				answers: ['12345'],
				attempts: [],
				points: 40
			}
		};
	}
]);
