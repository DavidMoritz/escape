escapeApp.controller('SessionCtrl', [
	'$scope',
	'$timeout',
	'$interval',
	'EscapeFactory',
	'MethodFactory',
	function SessionCtrl($s, $timeout, $interval, EF, MF) {
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
					$s.q.jigsaw.guess = value;
					$('.number-entry').text(display);

					if (key === '') {
						$('#keypad-modal').modal('hide');
						$s.submitGuess($s.q.jigsaw);
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
				$s.q.jigsaw.guess = '';
			});
			// show video when modal opens, pause when closed
			$('#video-modal').on('show.bs.modal', function(e) {
				introVideo.play();
				$('.after-video').hide();
				videoWatched = true;
			}).on('hide.bs.modal', function() {
				introVideo.pause();
			});
			// show video when modal opens, pause when closed
			$('#previous-messages-modal').on('show.bs.modal', function(e) {
				allowScrolling = true;
			}).on('hide.bs.modal', function() {
				allowScrolling = false;
			});
			// this is just a fall-back
			$('#intro-video').on('ended', function() {
				endVideo();
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

			videoWatched = !!$s.activeTeam.timerStarted;

			checkSolvedLocks();

			window.addEventListener('touchmove', function(event) {
				if ($(document).width() >= 768 && !allowScrolling) {
					event.preventDefault();
				}
			}, false);
		}

		function checkSolvedLocks() {
			_.forEach($s.q, function eachLock(q, id) {
				if($s.isSolved(q) && !q.nextClue) {
					nextClue(q);
				}
			});
		}

		function typeOutMessage() {
			//console.log('SESS> typeOutMessage() called');
			$s.curMsg.display = '';
			$timeout(function() {
				$('.fa-volume-up').click();
			}, 1);

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
			$s.$watch('activeTeam.latestSolved', function updateLocks() {
				checkSolvedLocks();
			}, true);
		}

		function nextClue(q) {
			if(!q.track) {
				if(q.name === 'jigsaw' ) {
					$s.activeTeam.finished = moment().format(timeFormat);
				} else {
					$s.activeTeam.hints += q.hints;
				}
				return false;
			}
			var track = $s.activeTeam.tracks[q.track];
			var index = track.indexOf(q.name) + 1;

			if(index === track.length) {
				// no more in the track
				q.nextClue = _.findWhere(EF.locks, {
					track: q.track,
					opens: 'jigsaw'
				});
			} else {
				q.nextClue = _.findWhere(EF.locks, {
					track: q.track,
					opens: track[index]
				});
			}
		}

		//	some guesses need to be parsed before submitting them
		function parseGuess(q) {
			switch (q.name) {
				case 'monopoly':
					var property = _.contains(q.splitGuess.property, 'Illinois') ? 'Illinois' : q.splitGuess.property;
					var money = q.splitGuess.money.replace(/\$/g, '').replace('.00', '');

					q.guess = property + money;
					break;
				case 'sudoku':
					q.guess = q.guess + '';
					break;
				case 'yahtzee':
					q.guess = q.guessedDice.sort().join('-');
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
					var correctAnswerArray = correctAnswer.split('');
					_.forEach(q.guess.split(''), function eachLetter(letter) {
						var loc = correctAnswerArray.indexOf(letter);
						if(loc !== -1) {
							correctAnswerArray.splice(loc, 1);
						}
					});
					// '3' indicates the number of missing/incorrect values allowed
					if (correctAnswerArray.length <= 3) {
						q.guess = correctAnswer;
					}
			}
		}

		function endVideo() {
			$('.after-video').show();
			introVideo.load();
		}

		function countTracks() {
			var total = 0;
			_.forEach($s.activeTeam.tracks, function eachTrack(track, key) {
				_.forEach(track, function eachGame() {
					total++;
				});
			});
			return total;
		}

		function mastermindClue(guess, answer) {
			if(_.size($s.activeTeam.solvedQuestions) >= countTracks()) {
				var arrGuess = guess.split('');
				var answerArr = answer.split('');
				var tempAnswer = [];
				var tempGuess = [];
				var locations = 0;
				var total = 0;
				var message = 'You entered ';

				for(var i = 0; i < 5; i++) {
					if(arrGuess[i] == answerArr[i]) {
						locations++;
					} else {
						tempAnswer.push(answerArr[i]);
						tempGuess.push(arrGuess[i]);
					}
				}
				for(i = 0; i < tempGuess.length; i++) {
					var index = tempAnswer.indexOf(tempGuess[i]);
					if(index !== -1) {
						total++;
						delete tempAnswer[index];
					}
				}
				total += locations;
				locations = locations === 0 ? 'none' : locations;
				message += total + ' correct digits, ' + locations + ' of which ';
				message += locations === 1 ? 'was in the right place.' : 'were in the right places.';
				$s.addNewMessage(message);
			}
		}

		var timeFormat = 'YYYY-MM-DD HH:mm:ss';
		var activeTeamFBObj;
		var videoWatched;
		var allowScrolling;
		var introVideo = $('#intro-video')[0];

		$interval(function everySecond() {
			if ($s.activeTeam && $s.activeTeam.timerStarted) {
				if (!videoWatched) {
					$('#video-modal').modal('show');
				}

				// convertTimer
				var gameStart = moment($s.activeTeam.timerStarted, timeFormat);
				var current = $s.activeTeam.finished ? moment($s.activeTeam.finished, timeFormat) : moment();

				$s.timeRemaining = $s.activeTeam.timeAllowed - current.diff(gameStart, 'seconds');

				if($s.timeRemaining <= 0) {
					$s.timeRemaining = 0;
					$s.timesUp = true;
				}

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
			if (introVideo.currentTime >= 52) {
				endVideo();
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
			status: EF.statuses,
			lockoutImages: EF.lockoutImages
		});

		$s.startGame = function startGame() {
			videoWatched = true;
			$s.activeTeam.timerStarted = moment().format(timeFormat);
			$('#video-modal').modal('show');
		};

		$s.addNewMessage = function addNewMessage(message) {
			var stoMsgs = EF.getFBArray('teams/' + $s.activeTeam.$id + '/storedMessages');
			stoMsgs.$add({
				text: message,
				time: moment().format(timeFormat)
			});
		};

		$s.isSolved = function isSolved(puz) {
			var puzzleName = _.has(puz, 'name') ? puz.name : puz;

			return $s.activeTeam && $s.activeTeam.solvedQuestions && _.contains(_.keys($s.activeTeam.solvedQuestions), puzzleName);
		};

		$s.isAvailable = function isAvailable(puz) {
			var track = $s.activeTeam.tracks[puz.track];

			if(!track) {
				return true;
			}
			for(var i = 0, result; i < track.length; i++) {
				if(puz.name == track[i]) {
					result = true;
					break;
				}
				if(!$s.isSolved(track[i])) {
					result = false;
					break;
				}
			}
			return result;
		};

		$s.setActivePuzzle = function activePuzzle(id) {
			$s.activePuzzle = id;
		};

		$s.speak = function speak() {
			//$('.fa-volume-up').focus();
			responsiveVoice.speak($s.curMsg.text, $s.activeTeam.voice);
		};

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
				$s.timesUp = false;
				$timeout(init, 0);
				if(firstLoad && bindMessaging) {
					bindMessaging();
				}
			});
		};

		$s.submitGuess = function submitGuess(q) {
			var currentTime = moment().format(timeFormat);
			var lowerCaseAnswers = _.map(q.answers, function lowerCaseAnswers(ans) {
				return ans.toLowerCase();
			});
			parseGuess(q);
			if (!$s.activeTeam.attempts) {
				$s.activeTeam.attempts = [];
			}
			$s.activeTeam.attempts.push({
				puzzle: q.name,
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
				$s.activeTeam.latestSolved = q.name;
				$s.activeTeam.solvedQuestions[q.name] = currentTime;
				nextClue(q);
			} else {
				if(++$s.activeTeam.lockoutIndex == $s.lockoutImages.length) {
					$s.activeTeam.lockoutIndex = 0;
				}
				if(q.name === 'jigsaw') {
					mastermindClue(q.guess + '', q.answers[0] + '');
				}
				$timeout(function() {
					$s.activeTeam.lockoutStarted = currentTime;
				}, 10);
			}
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

		$s.addDie = function addDie(q, die) {
			if (q.guessedDice.length < 5) {
				q.guessedDice.push(die);
			}
		};

		$s.removeDie = function removeDie(q, dieIndex) {
			_.pullAt(q.guessedDice, dieIndex);
		};
	}
]);
