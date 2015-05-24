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
			// Prompt Password
			if ($s.activeTeam.passwordRequired && prompt('What is your team password?') != $s.activeTeam.password) {
				// failed password; redirect
				window.location.replace('http://gameEscape.net');
			}
		}

		function typeOutMessage() {
			//console.log('SESS> typeOutMessage() called');
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

		$interval(function everySecond() {
			if ($s.activeTeam && $s.activeTeam.timerStarted) {
				// if administrator "Unsolves" Jigsaw manually, this needs to update.
				if ($s.activeTeam.finished && !$s.isSolved($s.q.jigsaw)) {
					delete $s.activeTeam.finished;
				}

				// convertTimer
				var gameStart = moment($s.activeTeam.timerStarted, timeFormat);
				var current = $s.activeTeam.finished ? moment($s.activeTeam.finished, timeFormat) : moment();

				$s.timeRemaining = $s.activeTeam.timeAllowed - current.diff(gameStart, 'seconds');

				$s.updateLockoutTimeRemaining();

				if ($s.activeTeam.alert) {
					$('.jumbotron').addClass('alert-team');
					$timeout(function removeAlert() {
						$('.jumbotron').removeClass('alert-team');
					}, 500);
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
			lockoutTimeRemaining: 0,
			status: EF.statuses
		});

		$s.requestHint = function requestHint() {
			if ($s.activeTeam.hints) {
				$s.activeTeam.hints--;
			} else {
				if ($s.activeTeam.status != EF.statuses.length) {
					$s.activeTeam.status++;
				}
			}
			$s.activeTeam.hintInProgress = true;
		};

		$s.updateLockoutTimeRemaining = function updateLockoutTimeRemaining(secondsRemaining) {
			if ($s.activeTeam.lockoutStarted) {
				var lockoutStart = moment($s.activeTeam.lockoutStarted, timeFormat);
				secondsRemaining = $s.activeTeam.lockoutPeriod - moment().diff(lockoutStart, 'seconds');

				if (secondsRemaining <= 0) {
					$s.activeTeam.lockoutStarted = null;
				}
			}

			$s.lockoutTimeRemaining = secondsRemaining || 0;
		};

		$s.chooseTeam = function chooseTeam(teamId) {
			//console.log('SESS> choosing Team: ' + teamId);

			if (activeTeamFBObj) {
				activeTeamFBObj.$destroy();
				//console.log('SESS> activeTeam is destroyed');
			} else {
				var firstLoad = true;
			}

			//console.log('SESS> choosing a team');
			activeTeamFBObj = EF.getFBObject('teams/' + teamId);
			activeTeamFBObj.$bindTo($s, 'activeTeam').then(function afterTeamLoaded() {
				//console.log('SESS> afterTeamLoaded');
				$timeout(init, 0);
				if(firstLoad) {
					bindMessaging();
				}
			});
		};

		$s.submitGuess = function submitGuess(q) {
			var currentTime = moment().format(timeFormat);
			var lowerCaseAnswers = _.map(q.answers, function lowerCaseAnswers(ans) {
				return ans.toLowerCase();
			});

			q.attempts.push({
				guess: q.guess,
				time: currentTime
			});

			if (_.contains(lowerCaseAnswers, q.guess.toLowerCase())) {
				//	correct!
				if(_.isUndefined($s.activeTeam.solvedPoints)) {
					$s.activeTeam.solvedPoints = 0;
				}
				if (_.isUndefined($s.activeTeam.solvedQuestions)) {
					$s.activeTeam.solvedQuestions = {};
				}
				$s.activeTeam.solvedPoints += q.points;
				$s.activeTeam.solvedQuestions[q.name] = currentTime;
				if (!q.nextClue) {
					$s.activeTeam.finished = currentTime;
				}
			} else {
				$s.activeTeam.lockoutStarted = currentTime;
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

		$s.allTeams = EF.getFBArray('teams');
		$s.allTeams.$loaded(function afterTeamsLoaded() {
			EF.getFB('activeTeamId').on('value', function gotId(snap) {
				$s.activeTeamId = snap.val();
				//console.log('SESS> new team id: ' + $s.activeTeamId);

				if ($s.activeTeamId) {
					$s.chooseTeam($s.activeTeamId);
				}
			});
			EF.getFB('connect4').on('value', function attemptingConnect4(snap) {
				$s.q.connect4.guess = snap.val();
				//console.log('SESS> connect4 is currently: ' + $s.q.connect4.guess);

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
