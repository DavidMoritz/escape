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

		$s.allTeams = EF.getFBArray('teams');

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
			//console.log('ADMIN> chooseTeam id: ' + teamId);

			if (activeTeamFBObj) {
				activeTeamFBObj.$destroy();
				//console.log('ADMIN> activeTeam is destroyed');
			}

			//	activate the chosen team
			activeTeamFBObj = EF.getFBObject('teams/' + teamId);
			activeTeamFBObj.$bindTo($s, 'activeTeam').then(function atThen() {
				EF.setFB('activeTeamId', teamId);
				$s.activeTeam.solvedPoints = $s.activeTeam.solvedPoints || 0;
			});
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
			//console.log('ADMIN> createTeam() called');
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
					//console.log('new team created with id: ' + newTeam.key());

					newTeam.child('storedMessages').push({
						time: currentTime,
						text: 'We are about to begin'
					});

					$s.chooseTeam(newTeam.key());
				});
			});
		};

		$s.setAttribute = function setAttribute(attribute, options) {
			if((options.confirm && !confirm(options.confirm)) || !$s.activeTeam) {
				return;
			}
			//console.log('ADMIN> set time for ' + attribute);
			if(options.toggle) {
				$s.activeTeam[attribute] = !$s.activeTeam[attribute];
			} else {
				$s.activeTeam[attribute] = options.time ? moment().format(timeFormat) : true;
			}

			if(options.message) {
				$s.addNewMessage(options.message);
			}

			if(options.seconds) {
				$timeout(function turnAlertOffAutomatically() {
					$s.remove(attribute);
				}, options.seconds * 1000);
			}

			if(options.alert) {
				alert(options.alert);
			}
		};

		$s.adjustAttribute = function adjustAttribute(attribute, amount) {
			//console.log('ADMIN> ' + attribute + ' adjusted by ' + amount);
			$s.activeTeam[attribute] += amount;
		};

		$s.remove = function remove(attribute) {
			//console.log('ADMIN> ' + attribute + ' removed');
			$s.activeTeam[attribute] = null;
		};

		$s.getUnfinishedTeams = function getUnfinishedTeams() {
			return _.where($s.allTeams, {finished: false});
		};

		$s.allTeams.$loaded(function afterTeamsLoaded() {
			$s.chooseTeam(EF.getFB('activeTeamId'));
		});
	}
]);
