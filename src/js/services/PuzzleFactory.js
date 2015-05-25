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
				clueSet: 1,
				nextClue: {
					lockIcon: 'anchor',
					code: '32-0-20',
					visible: true
				},
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
				clueSet: 1,
				nextClue: {
					lockIcon: 'bomb',
					code: '2-20-38',
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
				points: 50,
				clueSet: 1,
				nextClue: {
					lockIcon: 'university',
					code: '1-9-35',
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
				points: 50,
				clueSet: 1,
				nextClue: {
					lockIcon: 'birthday-cake',
					code: '14-29-11',
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
				points: 40,
				clueSet: 2,
				nextClue: {
					lockIcon: 'gavel',
					code: '30-5-33',
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
				points: 10,
				clueSet: 2,
				nextClue: {
					lockIcon: 'globe',
					code: '9-21-37',
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
				points: 10,
				clueSet: 2,
				nextClue: {
					lockIcon: 'scissors',
					code: '11-21-37',
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
				points: 20,
				clueSet: 2,
				nextClue: {
					lockIcon: 'diamond',
					code: '30-38-24',
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
				points: 40,
				clueSet: 2,
				nextClue: {
					lockIcon: 'rocket',
					code: '18-25-7',
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
				points: 50,
				clueSet: 3,
				nextClue: {
					lockIcon: 'tachometer',
					code: '24-4-27',
					visible: true
				}
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
				clueSet: 3,
				nextClue: {
					lockIcon: 'tree',
					code: '23-7-26',
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
				points: 40,
				clueSet: 3,
				nextClue: {
					lockIcon: 'motorcycle',
					code: '28-36-16',
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
				points: 50,
				clueSet: 3,
				nextClue: {
					lockIcon: 'paw',
					code: '36-11-37',
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
				points: 30,
				clueSet: 3,
				nextClue: {
					lockIcon: 'ticket',
					code: '0-0-0',
					visible: true
				}
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
