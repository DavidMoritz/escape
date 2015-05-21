escapeApp.controller('AdminCtrl', [
	'$scope',
	'$timeout',
	'$interval',
	'EscapeFactory',
	function AdminCtrl($s, $timeout, $interval, EF) {
		'use strict';

		function getTotalPoints() {
			return _.reduce(EF.questions, function(result, q) {
				return result + q.points;
			}, 0);
		}

		var timeFormat = 'YYYY-MM-DD HH:mm:ss';
		var activeTeamFBObj;

		//	initialize scoped variables
		_.assign($s, {
			allTeams: [],
			activeTeam: null,
			activeTeamId: null,
			formFields: {
				newTeamName: '',
				newMessage: ''
			},
			teamId: null,
			totalPoints: getTotalPoints()
		});

		$interval(function everySecond() {
			if ($s.activeTeam && !$s.activeTeam.finished) {
				// gauge
				var gameStart = moment($s.activeTeam.timerStarted, timeFormat);
				var percentageTimeUsed = (moment().diff(gameStart, 'seconds') - EF.bufferTime) / $s.activeTeam.timeAllowed;
				var solvedPercentage = $s.activeTeam.solvedPoints / $s.totalPoints;

				$s.gauge = (percentageTimeUsed - solvedPercentage).toFixed(4);
			}
		}, 1000);

		$s.chooseTeam = function chooseTeam(teamId) {
			console.log('ADMIN> chooseTeam id: ' + teamId);

			if (activeTeamFBObj) {
				activeTeamFBObj.$destroy();
				console.log('ADMIN> activeTeam is destroyed');
			}

			//	activate the chosen team
			activeTeamFBObj = EF.getFBObject('teams/' + teamId);
			activeTeamFBObj.$bindTo($s, 'activeTeam').then(function atThen() {
				EF.setFB('activeTeamId', teamId);
				$s.activeTeam.solvedPoints = $s.activeTeam.solvedPoints || 0;
			});
		};

		$s.startLockout = function startLockout() {
			console.log('ADMIN> started lockout');
			$s.activeTeam.lockoutStarted = moment().format(timeFormat);
		};

		$s.endLockout = function endLockout() {
			console.log('ADMIN> ended lockout');
			$s.activeTeam.lockoutStarted = null;
		};

		$s.restartTimer = function restartTimer() {
			if(confirm('Are you sure?')) {
				$s.activeTeam.timerStarted = moment().format(timeFormat);
				$s.addNewMessage('Timer started');
			}
		};

		$s.finishGame = function finishGame() {
			if(confirm('Finish Game?')) {
				$s.activeTeam.finished = moment().format(timeFormat);
				$s.addNewMessage('Congratulations!');
			}
		};

		$s.addNewMessage = function addNewMessage(message) {
			if (!$s.activeTeam) {
				return false;
			}
			// delay message for direct sends
			if(message) {
				$timeout(function delayMessage() {
					$s.formFields.newMessage = message;
					$s.addNewMessage();
				}, 500);
				return false;
			}

			var stoMsgs = EF.getFBArray('teams/' + $s.activeTeam.$id + '/storedMessages');
			stoMsgs.$add({
				text: $s.formFields.newMessage,
				time: moment().format(timeFormat)
			});
			$s.formFields.newMessage = '';
			$('.addMessageInput').focus();
		};

		$s.createTeam = function createTeam() {
			console.log('ADMIN> createTeam() called');
			var teams = EF.getFBArray('teams');
			teams.$loaded().then(function teamsLoaded() {
				var currentTime = moment().format(timeFormat);

				teams.$add({
					createdDate: currentTime,
					name: $s.formFields.newTeamName,
					hints: 0,
					finished: false,
					timeAllowed: EF.initialTimeAllowed,
					lockoutPeriod: EF.defaultLockoutPeriod,
					lockoutStartTime: null,
					status: 0
				}).then(function(newTeam) {
					console.log('new team created with id: ' + newTeam.key());

					newTeam.child('storedMessages').push({
						time: currentTime,
						text: 'We are about to begin'
					});

					$s.chooseTeam(newTeam.key());
				});
			});
		};

		$s.adjust = function adjust(attribute, amount) {
			$s.activeTeam[attribute] += amount;
		};

		$s.resolveHint = function resolveHint() {
			$s.activeTeam.hintInProgress = false;
		};

		$s.getUnfinishedTeams = function getUnfinishedTeams() {
			return _.where($s.allTeams, {finished: false});
		};

		$s.allTeams = EF.getFBArray('teams');
	}
]);
