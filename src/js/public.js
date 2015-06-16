escapeApp.controller('EscapeCtrl', [
	'$scope',
	'$timeout',
	'$interval',
	'EscapeFactory',
	function EscapeCtrl($s, $timeout, $interval, EF) {
		'use strict';

		function init() {
			//	initKeypad
			$('.numeric-keypad').keypad({
				separator: '|',
				layout: [
					'1|2|3',
					'4|5|6',
					'7|8|9',
					$.keypad.CLEAR + '|0|<i class="fa fa-level-down fa-rotate-90"></i>'
				],
				showAnim: '',
				clearText: 'X',
				keypadClass: 'digital-keypad',
				onKeypress: function(key, value, inst) {
					var display = value;
					// play *beep
					for(var i = value.length; i < 5; i++) {
						display += '-';
					}
					$s.guess = value;
					$('.number-entry').text(display);

					if (key === '') {
						$('#keypad-modal').modal('hide');
						submitGuess();
					}
				},
				beforeShow: function(div, inst) {
					$('<div>', {
						class: 'number-entry',
						text: '-----'
					}).prependTo(div);
					div.appendTo($('#keypad-modal .modal-body'));
				}
			});
			$('#keypad-modal').on('shown.bs.modal', function() {
				$(this).addClass('shown');
				$('.numeric-keypad').keypad('show');
			}).on('hidden.bs.modal', function() {
				$('.number-entry').text('-----');
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
				locations = locations || 'none';
				var extra = locations === 1 ? 'was in the right place.' : 'were in the right places.';
				$s.lockoutIndex++;
				$s.lockout = 10;
				typeOutMessage('You entered ' + total + ' correct digits, ' + locations + ' of which ' + extra);
				$s.pauseSeconds(10);
			}
		}

		function typeOutMessage(text) {
			$s.public.display = '';
			responsiveVoice.speak(text, 'UK English Male');
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
					case 0:
						typeOutMessage('Messages come sparatically and are very important.');
						break;
					case 20:
						typeOutMessage('Do not ignore them.');
						break;
				}
			}
			$s.public.timeRemaining -= 1;
			$s.lockout--;
		}, 1000);

		$s.start = function() {
			window.location = 'http://gameescape.net/session.html';
		};

		$s.setCheckers = function() {
			$s.activePuzzle = 'checkers';
		};

		$s.submitCheckerGuess = function() {
			if($s.checkers.coords.indexOf('b6') !== -1) {
				$s.checkers.solved = true;
				$s.public.timeRemaining += 2 * 60;
			} else {
				$s.activePuzzle = '';
				$s.lockout = 5;
				$s.lockoutIndex++;
			}
		};

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
			switch($s.hints) {
				case 2:
					$s.hints--;
					typeOutMessage('Try looking for a double jump!');
					break;
				case 1:
					$s.hints--;
					typeOutMessage('Have you tried moving it to b6?');
					break;
				default:
					$s.public.timeRemaining -= 2 * 60;
					typeOutMessage('Make sure to read aloud every clue sent!');
					break;
			}
			$s.pauseSeconds(6);
		};

		$s.isCoordSelected = function isCoordSelected(q, coord) {
			return _.contains(q.coords, coord);
		};

		$s.toggleCoordSelect = function toggleCoordSelect(q, coord) {
			if (q.name === 'checkers') {
				q.coords = [];	//	reset array
			}

			if ($s.isCoordSelected(q, coord)) {
				_.pull(q.coords, coord);
			} else {
				q.coords.push(coord);
			}
			q.coords = _.sortBy(q.coords);
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
				timeRemaining: 30 * 60
			},
			activeTeam: {
				password: 'nothing',
				passwordRequired: false,
				status: 0
			},
			status: EF.statuses,
			answer: getNewAnswer(),
			pause: false,
			typingInterval: 0,
			checkers: EF.questions.chess,
			lockoutImages: EF.lockoutImages,
			lockoutIndex: 0,
			lockout: -1,
			hints: 2
		});

		init();
	}
]);
