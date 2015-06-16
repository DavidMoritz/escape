escapeApp.factory('EscapeFactory', [
	'$firebaseArray',
	'$firebaseObject',
	'PuzzleFactory',
	'LockFactory',
	function EscapeFactory($fbArray, $fbObject, PuzzleFactory, LockFactory) {
		'use strict';
		var FB = null;

		return {
			initialTimeAllowed: 60 * 30,

			bufferTime: 60 * 5,

			defaultLockoutPeriod: 45,

			statuses: [{
				text: 'Gold',
				path: 'img/gold.png'
			},{
				text: 'Silver',
				path: 'img/silver.png'
			},{
				text: 'Bronze',
				path: 'img/bronze.png'
			},{
				text: 'Honorable Mention',
				path: 'img/honorable-mention.png'
			}],

			getFB: function getFB(childPath) {
				if (!FB) {
					FB = new Firebase('https://escape.firebaseio.com/');
				}

				return childPath ? FB.child(childPath) : FB;
			},

			getFBArray: function getFBArray(childPath) {
				return $fbArray(this.getFB(childPath));
			},

			getFBObject: function getFBObject(childPath) {
				return $fbObject(this.getFB(childPath));
			},

			setFB: function setFB(childPath, value) {
				var ref = this.getFB(childPath);
				ref.set(value);
				return false;
			},

			questions: PuzzleFactory,

			locks: LockFactory,

			tracks: {
				a: [
					'operation',
					'monopoly',
					'guessWho',
					'gameJumble',
				],
				b: [
					'battleship',
					'clue',
					'chess',
					'taboo'
				],
				c: [
					'texasHoldEm',
					'connect4',
					'fiveRoutes'
				]
			},

			lockoutImages: [
				'img/lockout/in-jail.png',
				'img/lockout/dunce.png',
				'img/lockout/mousetrap.png',
				'img/lockout/old-maid.png',
				'img/lockout/hi-ho-cherry-o.png',
				'img/lockout/fireball.png',
				'img/lockout/candyland.png',
				'img/lockout/skip.png',
				'img/lockout/wheel-of-fortune.png',
				'img/lockout/go-to-jail.png',
				'img/lockout/sorry.png',
				'img/lockout/jenga.png',
				'img/lockout/dont-wake-daddy.png',
				'img/lockout/epidemic.png',
				'img/lockout/life.png',
				'img/lockout/payday.png',
				'img/lockout/jail.png',
				'img/lockout/lock.png'
			]
		};
	}
]);

