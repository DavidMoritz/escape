trappedApp.controller('TrappedCtrl', [
	'$scope',
	'$interval',
	'$timeout',
	function TrappedCtrl($s, $interval, $timeout) {
		'use strict';

		var timer = 60 * 60; // one hour in seconds

		//	initialize scoped variables
		_.assign($s, {
			clues: 0,
			gameStarted: false,
			displayTime: '60:00'
		});

		function subtractSecond($s) {
			var minutes = Math.floor((--timer % 3600) / 60),
				seconds = timer - (minutes * 60);

			seconds = seconds < 10 ? ('0' + seconds) : seconds;
			minutes = minutes < 10 ? ('0' + minutes) : minutes;

			$s.displayTime = minutes + ':' + seconds;
		}

		$interval(function everySecond() {
			if ($s.gameStarted) {
				subtractSecond($s);
			}
		}, 1000, $s.timer);

		$s.startGame = function startGame() {
			$s.gameStarted = true;
		};
	}
]);
