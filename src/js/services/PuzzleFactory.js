escapeApp.factory('PuzzleFactory', [
	function PuzzleFactory() {
		'use strict';

		return {
			operation: {
				name: 'operation',
				available: true,
				icon: 'stethoscope',
				guess: '',
				answers: ['risky'],
				attempts: [],
				points: 30,
				track: 'a'
			},
			monopoly: {
				name: 'monopoly',
				available: false,
				icon: 'building-o',
				guess: '',
				splitGuess: {
					property: '',
					money: ''
				},
				answers: ['Illinois10'],
				attempts: [],
				points: 40,
				track: 'a'
			},
			yahtzee: {
				name: 'yahtzee',
				available: false,
				icon: 'cubes',
				guess: '',
				splitGuess: {
					die1: '',
					die2: ''
				},
				answers: ['5&5'],
				attempts: [],
				points: 50,
				track: 'a'
			},
			scrabble: {
				name: 'scrabble',
				available: false,
				icon: 'th-large',
				guess: '',
				answers: ['frustrate'],
				attempts: [],
				points: 50,
				track: 'a'
			},
			battleship: {
				name: 'battleship',
				available: true,
				icon: 'ship',
				guess: '',
				coords: [],
				columns: _.range(1, 11),
				rows: 'abcdefghij'.split(''),
				answers: ['b2&d2'],
				attempts: [],
				points: 40,
				track: 'b'
			},
			clue: {
				name: 'clue',
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
				answers: ['Colonel Mustard&Wrench&Lounge'],
				attempts: [],
				points: 10,
				track: 'b'
			},
			guessWho: {
				name: 'guessWho',
				display: 'Guess Who?',
				available: false,
				icon: 'users',
				guess: '',
				answers: ['alex'],
				attempts: [],
				points: 10,
				track: 'b'
			},
			chess: {
				name: 'chess',
				available: false,
				icon: 'delicious',
				guess: '',
				coords: [],
				columns: 'abcdefgh'.split('').reverse(),
				rows: _.range(1, 9),
				answers: ['h4'],
				attempts: [],
				points: 20,
				track: 'b'
			},
			crossword: {
				name: 'crossword',
				available: false,
				icon: 'newspaper-o',
				guess: '',
				answers: ['drmcnordtsieooluon'],
				attempts: [],
				points: 40,
				track: 'b'
			},
			texasHoldEm: {
				name: 'texasHoldEm',
				available: true,
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
				track: 'c'
			},
			connect4: {
				name: 'connect4',
				display: 'Connect Four',
				available: false,
				icon: 'table',
				guess: '',
				answers: ['Winner!'],
				attempts: [],
				points: 30,
				track: 'c'
			},
			fiveRoutes: {
				name: 'fiveRoutes',
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
				attempts: [],
				points: 40,
				track: 'c'
			},
			wordFind: {
				name: 'wordFind',
				available: false,
				icon: 'arrows-alt',
				guess: '',
				splitGuess: {
					word1: '',
					word2: ''
				},
				answers: ['milton bradley'],
				attempts: [],
				points: 50,
				track: 'c'
			},
			taboo: {
				name: 'taboo',
				available: false,
				icon: 'ban',
				guess: '',
				answers: ['fly'],
				attempts: [],
				points: 30,
				track: 'c'
			},
			jigsaw: {
				name: 'jigsaw',
				available: true,
				icon: 'puzzle-piece',
				guess: '',
				answers: ['12345'],
				attempts: [],
				points: 40
			}
		};
	}
]);
