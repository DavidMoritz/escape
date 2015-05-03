escapeApp.controller('AdminCtrl', [
	'$scope',
	'EscapeFactory',
	function AdminCtrl($s, EF) {
		'use strict';

		var timeFormat = 'YYYY-MM-DD HH:mm:ss';

		//	initialize scoped variables
		_.assign($s, {
			allTeams: [],
			activeTeam: null,
			formFields: {
				newTeamName: '',
				newMessage: ''
			},
			teamId: null,
			timeRemaining: 0
		});

		$s.chooseTeam = function chooseTeam(teamId, newTeam) {
			console.log('admin: chooseTeam() called');
			//	activate the chosen team
			EF.getFBObject('teams/' + teamId).$bindTo($s, 'activeTeam');
			EF.setFB('activeTeam', teamId);
		};

		$s.restartTimer = function restartTimer() {
			if(confirm('Are you sure?')) {
				$s.timeRemaining = EF.initialTimeAllowed;
				$s.activeTeam.timerStarted = moment().format(timeFormat);
				$s.addNewMessage('Timer started');
			}
		};

		$s.addNewMessage = function addNewMessage() {
			if (!$s.activeTeam) {
				return false;
			}

			var stoMsgs = EF.getFBArray('teams/' + $s.activeTeam.$id + '/storedMessages');
			stoMsgs.$add({
				text: $s.formFields.newMessage,
				time: moment().format(timeFormat)
			});
		};

		$s.createTeam = function createTeam() {
			console.log('admin: createTeam() called');
			var teams = EF.getFBArray('teams'),
				currentTime = moment().format(timeFormat);

			teams.$add({
				createdDate: currentTime,
				name: $s.formFields.newTeamName,
				clues: 0,
				finished: false,
				timeAllowed: EF.initialTimeAllowed
			}).then(function(newTeam) {
				console.log('new team created with id: ' + newTeam.key());

				newTeam.child('storedMessages').push({
					time: currentTime,
					text: 'We are about to begin'
				});

				$s.chooseTeam(newTeam.key());
			});
		};

		$s.getUnfinishedTeams = function getUnfinishedTeams() {
			return _.where($s.allTeams, {finished: false});
		};

		$s.allTeams = EF.getFBArray('teams');
	}
]);
