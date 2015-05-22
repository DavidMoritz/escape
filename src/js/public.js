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
			$s.gauge = Math.random() * (0.3 + 0.2) - 0.2;
		}, 1000);

		$s.requestHint = function() {
			if($s.activeTeam.status < $s.status.length) {
				$s.activeTeam.status++;
			}
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
			allPuzzles: {
				puz1: {
					name: 'first',
					solved: true
				},
				puz2: {
					name: 'second'
				}
			},
			status: EF.statuses
		});
		init();
	}
]);
