escapeApp.controller('AdminCtrl', [
	'$scope',
	'EscapeFactory',
	function AdminCtrl($s, EF) {
		'use strict';

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
			timeRemaining: 0
		});

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
			});
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
			});
		};

		$s.getUnfinishedTeams = function getUnfinishedTeams() {
			return _.where($s.allTeams, {finished: false});
		};

		$s.allTeams = EF.getFBArray('teams');
	}
]);
