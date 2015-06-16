escapeApp.factory('LockFactory', [
	function LockFactory() {
		'use strict';

		return [{
			lockIcon: 'university',
			code: '32 - 0 - 20',
			opens: 'monopoly', // by way of trashcan
			box: 'Mad Gab'
		}, {
			lockIcon: 'umbrella',
			code: '1 - 15 - 0',
			opens: 'gameJumble',
			box: 'Scattergories'
		}, {
			lockIcon: 'diamond',
			code: '2 - 20 - 38',
			opens: 'yahtzee',
			box: 'Scene It?'
		}, {
			lockIcon: 'paw',
			code: '1 - 9 - 35',
			opens: 'scrabble',
			box: 'Life'
		}, {
			track: 'a',
			lockIcon: 'rocket',
			code: '36 - 11 - 37',
			opens: 'jigsaw', // clue to track c
			box: 'Blue Dice Cube'
		}, {
			lockIcon: 'anchor',
			code: '30 - 5 - 33',
			opens: 'clue',
			box: 'Brown Bread Box'
		}, {
			lockIcon: 'tachometer',
			code: '9 - 21 - 1',
			opens: 'guessWho',
			box: 'Balderdash'
		}, {
			lockIcon: 'tree',
			code: '24 - 4 - 27',
			opens: 'chess', // by way of Chutes and Ladders
			box: 'Blurt'
		}, {
			lockIcon: 'gavel',
			code: '14 - 29 - 11',
			opens: 'taboo',
			box: 'Pictionary'
		}, {
			track: 'b',
			lockIcon: 'globe',
			code: '18 - 25 - 7',
			opens: 'jigsaw', // clue to track a
			box: 'Trivial Pursuit'
		}, {
			lockIcon: 'birthday-cake',
			code: '30 - 38 - 24',
			opens: 'connect4',
			box: 'Mancala'
		}, {
			lockIcon: 'bomb',
			code: '23 - 7 - 26',
			opens: 'fiveRoutes',
			box: 'Cranium'
		}, {
			lockIcon: 'motorcycle',
			code: '16 - 21 - 39',
			opens: 'wordFind',
			box: 'Gray Metal Box'
		}, {
			track: 'c',
			lockIcon: 'ticket',
			code: '11 - 21 - 37',
			opens: 'jigsaw', // clue to track b
			box: 'Rush Hour'
		}];
	}
]);

//	FYI
// scissors (code arrived from chutes and ladders)
// NOTE: the clue for chutes and ladders in in the tree locked Blurt
// code: '28 - 36 - 16',
// box: Gray Suitcase
// opens: on the way to chess
