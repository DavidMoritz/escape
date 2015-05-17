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
				nextClue: {
					lockIcon: 'anchor',
					code: '__-__-__',
					visible: true
				}
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
				nextClue: {
					lockIcon: 'bomb',
					code: '__-__-__',
					visible: true
				}
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
				nextClue: {
					lockIcon: 'university',
					code: '__-__-__',
					visible: true
				}
			},
			scrabble: {
				name: 'scrabble',
				prerequisite: 'yahtzee',
				icon: 'th-large',
				guess: '',
				answers: ['frustrate'],
				attempts: [],
				nextClue: {
					lockIcon: 'birthday-cake',
					code: '__-__-__',
					visible: true
				}
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
				nextClue: {
					lockIcon: 'gavel',
					code: '__-__-__',
					visible: true
				}
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
				nextClue: {
					lockIcon: 'globe',
					code: '__-__-__',
					visible: true
				}
			},
			guessWho: {
				name: 'guessWho',
				display: 'Guess Who?',
				prerequisite: 'clue',
				icon: 'users',
				guess: '',
				answers: ['alex'],
				attempts: [],
				nextClue: {
					lockIcon: 'scissors',
					code: '__-__-__',
					visible: true
				}
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
				nextClue: {
					lockIcon: 'diamond',
					code: '__-__-__',
					visible: true
				}
			},
			crossword: {
				name: 'crossword',
				prerequisite: 'chess',
				icon: 'newspaper-o',
				guess: '',
				answers: ['drmcnordtsieooluon'],
				attempts: [],
				nextClue: {
					lockIcon: 'rocket',
					code: '__-__-__',
					visible: true
				}
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
				nextClue: {
					lockIcon: 'tachometer',
					code: '__-__-__',
					visible: true
				}
			},
			connect4: {
				name: 'connect4',
				display: 'Connect Four',
				prerequisite: 'texasHoldEm',
				icon: 'table',
				guess: '',
				answers: ['4'],
				attempts: [],
				nextClue: {
					lockIcon: 'tree',
					code: '__-__-__',
					visible: true
				}
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
				nextClue: {
					lockIcon: 'motorcycle',
					code: '__-__-__',
					visible: true
				}
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
				nextClue: {
					lockIcon: 'paw',
					code: '__-__-__',
					visible: true
				}
			},
			taboo: {
				name: 'taboo',
				prerequisite: 'wordFind',
				icon: 'ban',
				guess: '',
				answers: ['fly'],
				attempts: [],
				nextClue: {
					lockIcon: 'ticket',
					code: '__-__-__',
					visible: true
				}
			},
			jigsaw: {
				name: 'jigsaw',
				icon: 'puzzle-piece',
				guess: '',
				answers: ['12345'],
				attempts: []
			}
		};
	}
]);
