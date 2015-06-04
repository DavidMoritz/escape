escapeApp.controller('AdminCtrl', [
	'$scope',
	'$timeout',
	'$interval',
	'EscapeFactory',
	'MethodFactory',
	function AdminCtrl($s, $timeout, $interval, EF, MF) {
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
			formFields: {
				newTeamName: '',
				newMessage: '',
				puzzle: ''
			},
			q: EF.questions,
			voices: _.pluck(responsiveVoice.getVoices(), 'name')
		});

		$interval(function everySecond() {
			if ($s.activeTeam && !$s.activeTeam.finished) {
				// gauge
				var gameStart = moment($s.activeTeam.timerStarted, timeFormat);
				var percentageTimeUsed = (moment().diff(gameStart, 'seconds') + EF.bufferTime) / $s.activeTeam.timeAllowed;
				var solvedPercentage = $s.activeTeam.solvedPoints / $s.activeTeam.totalPoints;

				$s.gauge = (percentageTimeUsed - solvedPercentage).toFixed(4);
			}
		}, 1000);

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

		$s.createTeam = function createTeam() {
			//console.log('ADMIN> createTeam() called');
			var currentTime = moment().format(timeFormat);

			$s.allTeams.$add({
				createdDate: currentTime,
				name: $s.formFields.newTeamName,
				hints: 0,
				finished: false,
				timeAllowed: EF.initialTimeAllowed,
				lockoutPeriod: EF.defaultLockoutPeriod,
				status: 0,
				attempts: [],
				lockoutIndex: -1,
				password: 'admin123',
				passwordRequired: false,
				tracks: EF.tracks,
				totalPoints: getTotalPoints(),
				voice: 'UK English Male',
				latestSolved: 'none'
			}).then(function newTeamCreatedThen(newTeam) {
				//console.log('new team created with id: ' + newTeam.key());

				$s.chooseTeam(newTeam.key());
			});
		};

		$s.setAttribute = function setAttribute(attribute, options) {
			options = options || {};
			if((options.confirm && !confirm(options.confirm)) || !$s.activeTeam) {
				return;
			}
			var value = options.value || true;
			//console.log('ADMIN> set time for ' + attribute);
			if(options.toggle) {
				$s.activeTeam[attribute] = !$s.activeTeam[attribute];
			} else {
				$s.activeTeam[attribute] = options.time ? moment().format(timeFormat) : value;
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

		$s.unsolve = function unsolve(puz) {
			$s.activeTeam.latestSolved = 'none';
			delete $s.activeTeam.solvedQuestions[puz.name];
		};

		$s.bypass = function bypass(puz) {
			var track = $s.activeTeam.tracks[puz.track];

			_.pull(track, puz.name);
			$s.activeTeam.totalPoints -= puz.points;
		};

		$s.install = function install(puz) {
			var track = $s.activeTeam.tracks[puz.track];

			if($s.isInstallable(puz)) {
				track.push(puz.name);
				$s.activeTeam.totalPoints += puz.points;
			}
		};

		$s.solve = function solve(puz) {
			//	auto-solve
			if(_.isUndefined($s.activeTeam.solvedPoints)) {
				$s.activeTeam.solvedPoints = 0;
			}
			if (_.isUndefined($s.activeTeam.solvedQuestions)) {
				$s.activeTeam.solvedQuestions = {};
			}
			$s.activeTeam.solvedPoints += puz.points;
			$s.activeTeam.solvedQuestions[puz.name] = moment().format(timeFormat);
			$s.activeTeam.latestSolved = puz.name;
		};

		$s.isSolved = function isSolved(puz) {
			var puzzleName = _.has(puz, 'name') ? puz.name : puz;

			return $s.activeTeam && $s.activeTeam.solvedQuestions && _.contains(_.keys($s.activeTeam.solvedQuestions), puzzleName);
		};

		$s.isBypassable = function isBypassable(puz) {
			var track = $s.activeTeam.tracks[puz.track];

			return !$s.isAvailable(puz) && track.indexOf(puz.name) !== -1;
		};

		$s.isInstallable = function isInstallable(puz) {
			var track = $s.activeTeam.tracks[puz.track];

			return !$s.isAvailable(puz) && !$s.isSolved(track[track.length - 1]) && !$s.isBypassable(puz);
		};

		$s.getUnfinishedTeams = function getUnfinishedTeams() {
			return _.where($s.allTeams, {finished: false});
		};

		$s.allTeams = EF.getFBArray('teams');
		$s.allTeams.$loaded(function afterTeamsLoaded() {
			EF.getFB('activeTeamId').on('value', function gotId(snap) {
				//console.log('Admin> new team id: ' + snap.val());
				if (!$s.activeTeam) {
					$s.activeTeamId = snap.val();
					$s.chooseTeam($s.activeTeamId);
				}
			});
		});
	}
]);
