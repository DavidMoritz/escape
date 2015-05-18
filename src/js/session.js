escapeApp.controller('SessionCtrl', [
	'$scope',
	'$timeout',
	'$interval',
	'EscapeFactory',
	function SessionCtrl($s, $timeout, $interval, EF) {
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
					$s.q.jigsaw.guess = value;
					$('.numberEntry').text(display);

					if (key === '') {
						$('#keypadModal').modal('hide');
						$s.submitGuess($s.q.jigsaw);
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
				$s.q.jigsaw.guess = '';
			});
			//	DDSlick - Dropdowns (selects) with images in them!
			$('.ddslick').each(function eachSelect() {
				$(this).ddslick({
					onSelected: function onSelected(data) {
						// console.log(data);
						if (_.contains($(data.original).attr('ng-model'), 'q.yahtzee.splitGuess.die1')) {
							$s.q.yahtzee.splitGuess.die1 = data.selectedData.value;
						}
						if (_.contains($(data.original).attr('ng-model'), 'q.yahtzee.splitGuess.die2')) {
							$s.q.yahtzee.splitGuess.die2 = data.selectedData.value;
						}
					}
				});
			});
		}

		function typeOutMessage() {
			console.log('SESS> typeOutMessage() called');
			$s.curMsg.display = '';

			var curMsgArray = $s.curMsg.text.split('');
			var curPos = 0;
			var typingInterval = $interval(function typeGradually() {
				if(curPos >= curMsgArray.length) {
					return $interval.cancel(typingInterval);
				}

				$s.curMsg.display = $s.curMsg.display + curMsgArray[curPos++];
			}, 40);
		}

		function bindMessaging() {
			$s.$watch('activeTeam.storedMessages', function onNewMessages(messages) {
				if(messages) {
					$s.curMsg = {
						text: messages[_.keys(messages)[_.keys(messages).length - 1]].text,
						display: ''
					};

					typeOutMessage();
				}
			}, true);
		}

		var timeFormat = 'YYYY-MM-DD HH:mm:ss';
		var activeTeamFBObj;
		var lockoutPeriod = 45;	//	seconds to lock people out

		$interval(function everySecond() {
			if ($s.activeTeam && $s.activeTeam.timerStarted) {				// convertTimer
				var gameStart = moment($s.activeTeam.timerStarted);
				var current = $s.activeTeam.finished ? moment($s.activeTeam.finished, timeFormat) : moment();

				$s.timeRemaining = $s.activeTeam.timeAllowed - current.diff(gameStart, 'seconds');

				//	check for lockout time
				if ($s.lockout.active) {
					var lockoutStart = moment($s.activeTeam.lockoutStarted);

					$s.lockout.secondsRemaining = $s.activeTeam.lockoutPeriod - current.diff(lockoutStart, 'seconds');
				}
			} else {
				$s.timeRemaining = 0;
			}
		}, 1000);

		//	initialize scoped variables
		_.assign($s, {
			allTeams: [],
			teamId: null,
			curMsg: {
				text: '',
				display: ''
			},
			timeRemaining: 0,
			solvedQuestions: [],
			q: EF.questions,
			lockout: {
				active: false,
				secondsRemaining: 0
			}
		});

		$s.chooseTeam = function chooseTeam(teamId) {
			console.log('SESS> choosing Team: ' + teamId);

			if (activeTeamFBObj) {
				activeTeamFBObj.$destroy();
				console.log('SESS> activeTeam is destroyed');
			} else {
				var firstLoad = true;
			}

			console.log('SESS> choosing a team');
			activeTeamFBObj = EF.getFBObject('teams/' + teamId);
			activeTeamFBObj.$bindTo($s, 'activeTeam').then(function afterTeamLoaded() {
				console.log('SESS> afterTeamLoaded');
				$timeout(init, 0);
				if(firstLoad) {
					bindMessaging();
				}
			});
		};

		$s.submitGuess = function submitGuess(q) {
			var lowerCaseAnswers = _.map(q.answers, function lowerCaseAnswers(ans) {
				return ans.toLowerCase();
			});

			q.attempts.push({
				guess: q.guess,
				time: moment().format(timeFormat)
			});

			if (_.contains(lowerCaseAnswers, q.guess.toLowerCase())) {	//	correct!
				if (_.isUndefined($s.activeTeam.solvedQuestions)) {
					$s.activeTeam.solvedQuestions = {};
				}
				$s.activeTeam.solvedQuestions[q.name] = moment().format(timeFormat);
			} else {
				alert('Incorrect answer.  Try again!');
			}
		};

		//	some guesses need to be massaged before submitting them
		$s.submitGuessSpecial = function submitGuessSpecial(q) {
			switch (q.name) {
				case 'monopoly':
					var property = _.contains(q.splitGuess.property, 'Illinois') ? 'Illinois' : q.splitGuess.property;
					var money = q.splitGuess.money.replace(/\$/g, '').replace('.00', '');

					q.guess = property + money;
					break;
				case 'yahtzee':
					q.guess = q.splitGuess.die1 + '&' + q.splitGuess.die2;
					break;
				case 'battleship': // falls through
				case 'chess':
					q.guess = q.coords.join('&');
					break;
				case 'clue':
					q.guess = q.splitGuess.who + '&' + q.splitGuess.what + '&' + q.splitGuess.where;
					break;
				case 'texasHoldEm': // falls through
				case 'wordFind':
					q.guess = q.splitGuess.word1 + ' ' + q.splitGuess.word2;
					break;
				case 'fiveRoutes':
					q.guess = q.orderedAnimals.join('-');
					break;
				case 'crossword':
					var correctAnswer = q.answers[0];
					var correctlyGuessedLettersCount = 0;
					_.forEach(q.guess.split(''), function eachLetter(letter, index) {
						correctlyGuessedLettersCount += (letter === correctAnswer[index]) ? 1 : 0;
					});
					if (correctlyGuessedLettersCount >= correctAnswer.length - 1) {
						q.guess = correctAnswer;
					}
			}

			$s.submitGuess(q);
		};

		$s.isSolved = function isSolved(puz) {
			if (!puz) {
				return true;	//	no prerequisite
			}

			var puzzleName = _.has(puz, 'name') ? puz.name : puz;
			return $s.activeTeam && $s.activeTeam.solvedQuestions && _.contains(_.keys($s.activeTeam.solvedQuestions), puzzleName);
		};

		$s.unsolve = function unsolve(puz) {
			console.log('deleting ' + puz.name + ' from solved puzzles');
			delete $s.activeTeam.solvedQuestions[puz.name];
		};

		$s.toggleNextClue = function toggleNextClue(q) {
			q.nextClue.visible = !q.nextClue.visible;
		};

		$s.allTeams = EF.getFBArray('teams');
		$s.allTeams.$loaded(function afterTeamsLoaded() {
			EF.getFB('activeTeamId').on('value', function gotId(snap) {
				$s.activeTeamId = snap.val();
				console.log('SESS> new team id: ' + $s.activeTeamId);

				if ($s.activeTeamId) {
					$s.chooseTeam($s.activeTeamId);
				}
			});
			EF.getFB('connect4').on('value', function attemptingConnect4(snap) {
				$s.q.connect4.guess = snap.val();
				console.log('SESS> connect4 is currently: ' + $s.q.connect4.guess);

				if ($s.q.connect4.guess !== 'attempting') {
					if ($s.activeTeam && !$s.isSolved($s.q.connect4)) {
						$s.submitGuess($s.q.connect4);
					}
				}
			});
		});

		$s.isCoordSelected = function isCoordSelected(q, coord) {
			return _.contains(q.coords, coord);
		};

		$s.toggleCoordSelect = function toggleCoordSelect(q, coord) {
			if (q.name === 'chess') {
				q.coords = [];	//	reset array
			}

			if ($s.isCoordSelected(q, coord)) {
				_.pull(q.coords, coord);
			} else {
				q.coords.push(coord);
			}
			q.coords = _.sortBy(q.coords);
		};

		$s.toggleColumnSelect = function toggleColumnSelect(q, col) {
			q.guess = (q.guess === col.toString()) ? '' : col.toString();
		};

		$s.toggleAnimalSelect = function toggleAnimalSelect(q, animal) {
			if (_.includes(q.orderedAnimals, animal)) {
				_.pull(q.orderedAnimals, animal);
			} else {
				q.orderedAnimals.push(animal);
			}
		};
	}
]);
