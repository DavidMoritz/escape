escapeApp.controller('EscapeCtrl', [
	'$scope',
	'$timeout',
	'$interval',
	function EscapeCtrl($s, $timeout, $interval) {
		'use strict';

		function typeOutMessage() {
			$s.public.display = '';
			var curMsgArray = $s.public.text.split('');
			var curPos = 0;

			var typingInterval = $interval(function typeGradually() {
				if(curPos >= curMsgArray.length) {
					return $interval.cancel(typingInterval);
				}

				$s.public.display = $s.public.display + curMsgArray[curPos++];
			}, 40);
		}

		$interval(function everySecond() {
			switch($s.public.timeRemaining % 40) {
				case 20:
					$s.public.text = 'Welcome to The Game Escape.';
					typeOutMessage(true);
					break;
				case 10:
					$s.public.text = 'Will your team get out in time?';
					typeOutMessage(true);
					break;
				case 0:
					$s.public.text = 'Sign up for June 19th or June 20th';
					typeOutMessage(true);
					break;
				case 30:
					$s.public.text = 'Hurry, before it\'s too late...';
					typeOutMessage(true);
					break;
			}
			$s.public.timeRemaining -= 1;
		}, 1000);

		//	initialize scoped variables
		_.assign($s, {
			public: {
				timeRemaining: 45 * 60
			}
		});
	}
]);
