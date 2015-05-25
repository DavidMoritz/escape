escapeApp.controller('EscapeCtrl', [
	'$scope',
	'$timeout',
	'$interval',
	'EscapeFactory',
	function EscapeCtrl($s, $timeout, $interval, EF) {
		'use strict';

		function init() {
			//	initKeypad
			$('.numericKeypad').keypad({
				separator: '|',
				layout: [
					'1|2|3',
					'4|5|6',
					'7|8|9',
					$.keypad.CLEAR + '|0|<i class="fa fa-level-down fa-rotate-90"></i>'
				],
				showAnim: '',
				clearText: 'X',
				keypadClass: 'digitalKeypad',
				onKeypress: function(key, value, inst) {
					var display = value;
					// play *beep
					for(var i = value.length; i < 5; i++) {
						display += '-';
					}
					$s.guess = value;
					$('.numberEntry').text(display);

					if (key === '') {
						$('#keypadModal').modal('hide');
						submitGuess();
					}
				},
				beforeShow: function(div, inst) {
					$('<div>', {
						class: 'numberEntry',
						text: '-----'
					}).prependTo(div);
					div.appendTo($('#keypadModal .modal-body'));
				}
			});
			$('#keypadModal').on('shown.bs.modal', function() {
				$(this).addClass('shown');
				$('.numericKeypad').keypad('show');
			}).on('hidden.bs.modal', function() {
				$('.numberEntry').text('-----');
				$s.guess = '';
			});
		}

		function submitGuess() {
			var strGuess = $s.guess + '';
			var arrGuess = strGuess.split('');
			var tempAnswer = [];
			var tempGuess = [];
			var correct = 0;
			var locations = 0;
			var finalText = '';

			for(var i = 0; i < 5; i++) {
				if(arrGuess[i] == $s.answer[i]) {
					locations++;
					finalText += arrGuess[i];
				} else {
					tempAnswer.push($s.answer[i]);
					tempGuess.push(arrGuess[i]);
				}
			}
			for(i = 0; i < tempGuess.length; i++) {
				var index = tempAnswer.indexOf(tempGuess[i]);
				if(index !== -1) {
					correct++;
					delete tempAnswer[index];
				}
			}
			if(locations == 5) {
				typeOutMessage('Congratulations! ' + finalText + ' is correct! You\'ve Escaped!');
				$s.pauseSeconds(10);
			} else {
				var total = correct + locations;
				typeOutMessage('Incorrect. The number you entered had ' + total + ' numbers correct and ' + locations + ' of those correct numbers were also in the correct position.');
				$s.pauseSeconds(10);
			}
		}

		function typeOutMessage(text) {
			$s.public.display = '';
			$interval.cancel($s.typingInterval);
			var curMsgArray = text.split('');
			var curPos = 0;

			$s.typingInterval = $interval(function typeGradually() {
				if(curPos >= curMsgArray.length) {
					return $interval.cancel($s.typingInterval);
				}

				$s.public.display = $s.public.display + curMsgArray[curPos++];
			}, 40);
		}

		function getNewAnswer() {
			var answer = [];

			for (var i = 0; i < 5; i++) {
				answer.push(Math.floor(Math.random() * 9) + '');
			}
			return answer;
		}

		function getGuess(voidN) {
			var guess = Math.floor(Math.random() * 9) + '';
				
			voidN = voidN ? $s.answer.indexOf(voidN) : -1;

			if($s.answer.indexOf(guess) !== -1 && $s.answer.indexOf(guess) !== voidN) {
				return guess;
			} else {
				return getGuess(voidN);
			}
		}

		$interval(function everySecond() {
			if(!$s.pause) {
				switch($s.public.timeRemaining % 40) {
					case 20:
						typeOutMessage('Welcome to The Game Escape.');
						break;
					case 10:
						typeOutMessage('Will your team get out in time?');
						break;
					case 0:
						typeOutMessage('Sign up for June 19th or June 20th');
						break;
					case 30:
						typeOutMessage('Hurry, before it\'s too late...');
						break;
				}
			}
			$s.public.timeRemaining -= 1;
		}, 1000);

		$s.pauseSeconds = function(seconds) {
			if($s.unpause) {
				clearTimeout($s.unpause);
			}
			$s.pause = true;
			$s.unpause = setTimeout(function() {
				$s.pause = false;
			}, seconds * 1000);
		};

		$s.requestHint = function() {
			if($s.activeTeam.status < $s.status.length) {
				$s.activeTeam.status++;
			}
			var guess1 = getGuess();
			var guess2 = getGuess(guess1);

			typeOutMessage('The answer contains a ' + guess1 + ' and a ' + guess2 + '.');
			$s.pauseSeconds(6);
		};

		$s.isSolved = function(puz) {
			if(puz) {
				return puz.solved;
			}
			return false;
		};

		//	initialize scoped variables
		_.assign($s, {
			public: {
				timeRemaining: 45 * 60
			},
			activeTeam: {
				password: 'nothing',
				passwordRequired: false,
				status: 0
			},
			status: EF.statuses,
			answer: getNewAnswer(),
			pause: false,
			typingInterval: 0
		});

		init();
	}
]);
