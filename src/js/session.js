escapeApp.controller('SessionCtrl', [
	'$scope',
	'$timeout',
	'$interval',
	'EscapeFactory',
	function SessionCtrl($s, $timeout, $interval, EF) {
		'use strict';

		function typeOutMessage() {
			console.log('session: typeOutMessage() called');
			if(!$s.currentlyTyping) {
				$s.currentlyTyping = true;
				$s.curMsg.display = '';

				var curMsgArray = $s.curMsg.text.split('');
				var curPos = 0;
				var typingInterval = $interval(function typeGradually() {
					if(curPos >= curMsgArray.length) {
						$s.currentlyTyping = false;
						return $interval.cancel(typingInterval);
					}

					$s.curMsg.display = $s.curMsg.display + curMsgArray[curPos++];
				}, 40);
			}
		}

		var timeFormat = 'YYYY-MM-DD HH:mm:ss';
		var activeTeamFBObj;

		$interval(function everySecond() {
			if ($s.activeTeam && $s.activeTeam.timerStarted) {
				// convertTimer
				var start = moment($s.activeTeam.timerStarted, timeFormat);

				$s.timeRemaining = $s.activeTeam.timeAllowed - moment().diff(start, 'seconds');
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
			q: {
				monopoly: {
					id: 25,
					name: 'monopoly',
					guess: '',
					splitGuess: {
						property: '',
						money: ''
					},
					answers: ['Illinois10'],
					attempts: [],
					nextClue: {
						text: 'Cerulean lock: 12345',
						visible: false
					}
				},
				yahtzee: {
					id: 17,
					name: 'yahtzee',
					guess: '',
					splitGuess: {
						die1: '',
						die2: ''
					},
					answers: ['6&4', '4&6'],
					attempts: [],
					nextClue: {
						text: 'Orange lock: 34567',
						visible: false
					}
				}
			}
		});

		$s.chooseTeam = function chooseTeam(teamId) {
			console.log('SESS> choosing Team: ' + teamId);

			if (activeTeamFBObj) {
				activeTeamFBObj.$destroy();
				console.log('SESS> activeTeam is destroyed');
				console.log($s.activeTeam);
			}

			console.log('SESS> choosing a team');
			activeTeamFBObj = EF.getFBObject('teams/' + teamId);
			activeTeamFBObj.$bindTo($s, 'activeTeam').then(function afterTeamLoaded() {
				console.log('SESS> afterTeamLoaded');
				$s.$watch('activeTeam.storedMessages', function onNewMessages(messages) {
					$s.curMsg = {
						text: messages[_.keys(messages)[_.keys(messages).length - 1]].text,
						display: ''
					};

					typeOutMessage();
				}, true);
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
			if (q.name === 'monopoly') {
				var property = _.contains(q.splitGuess.property, 'Illinois') ? 'Illinois' : q.splitGuess.property;
				var money = q.splitGuess.money.replace(/\$/g, '').replace('.00', '');

				q.guess = property + money;
			} else if (q.name === 'yahtzee') {
				q.guess = q.splitGuess.die1 + '&' + q.splitGuess.die2;
			}

			$s.submitGuess(q);
		};

		$s.isSolved = function isSolved(q) {
			return $s.activeTeam && $s.activeTeam.solvedQuestions && _.contains(_.keys($s.activeTeam.solvedQuestions), q.name);
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
		});

		$timeout(function makeDropdownSlick() {	//	selects with images
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

							$s.$apply();	//	alert the scope that it's been updated
						}
					});
			});
		}, 1500);
	}
]);
