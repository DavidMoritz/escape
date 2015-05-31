escapeApp.controller('SessionCtrl', [
	'$scope',
	'$timeout',
	'$interval',
	'EscapeFactory',
	function SessionCtrl($s, $timeout, $interval, EF) {
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
						$('#keypad-modal').modal('hide');
						$s.submitGuess($s.q.jigsaw);
					}
				},
				beforeShow: function(div, inst) {
					$('<div>', {
						class: 'numberEntry',
						text: '-----'
					}).prependTo(div);
					div.appendTo($('#keypad-modal .modal-body'));
				}
			});
			$('#keypad-modal').on('shown.bs.modal', function() {
				$(this).addClass('shown');
				$('.numeric-keypad').keypad('show');
			}).on('hidden.bs.modal', function() {
				$('.numberEntry').text('-----');
				$s.q.jigsaw.guess = '';
			});
			// $('#video-modal').on('show.bs.modal', function() {
			// 	videoWatched = true;
			// 	var wrapper = $(this).find('.video-wrapper');
			// 	var video = $('<iframe>', {
			// 		src: 'https://www.youtube.com/embed/92DvYD6hcVQ?rel=0&controls=0&showinfo=0&autoplay=1',
			// 		class: 'intro',
			// 		frameborder: '0'
			// 	});
			// 	var image = $('<img>', {
			// 		src: 'img/intro.jpg',
			// 		class: 'intro'
			// 	});

			// 	wrapper.append(video);

			// 	$s.videoTimer = $timeout(function() {
			// 		video.remove();
			// 		wrapper.append(image);
			// 	}, 55500);
			// }).on('hide.bs.modal', function() {
			// 	$timeout.cancel($s.videoTimer);
			// 	$('iframe.intro, img.intro').remove();
			// });
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
		}

		function checkSolvedLocks() {
			_.forEach($s.q, function(q, id) {
				if($s.isSolved(q) && !q.nextClue) {
					nextClue(q);
				}
			});
		}

		function typeOutMessage() {
			//console.log('SESS> typeOutMessage() called');
			$s.curMsg.display = '';
			$s.speak();

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
					var correctlyGuessedLettersCount = 0;
					_.forEach(q.guess.split(''), function eachLetter(letter, index) {
						correctlyGuessedLettersCount += (letter === correctAnswer[index]) ? 1 : 0;
					});
					if (correctlyGuessedLettersCount >= correctAnswer.length - 1) {
						q.guess = correctAnswer;
					}
			}
		}

		var timeFormat = 'YYYY-MM-DD HH:mm:ss';
		var activeTeamFBObj;
		var videoWatched;

		$interval(function everySecond() {
			if ($s.activeTeam && $s.activeTeam.timerStarted) {
				if (!videoWatched) {
					$('#video-modal').modal('show');
				}
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
			status: EF.statuses,
			lockoutImages: EF.lockoutImages
		});

		$s.speak = function speak() {
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
			parseGuess(q);

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
				nextClue(q);
			} else {
				$s.activeTeam.lockoutStarted = currentTime;
				if(++$s.activeTeam.lockoutIndex == $s.lockoutImages.length) {
					$s.activeTeam.lockoutIndex = 0;
				}
			}
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
			EF.getFB('checkSolvedLocks').on('value', function attemptingConnect4() {
				checkSolvedLocks();
				EF.setFB('checkSolvedLocks', null);
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
