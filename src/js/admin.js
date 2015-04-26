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
			teamId: null
		});

		$s.chooseTeam = function chooseTeam(teamId) {
			//	turn all teams inactive
			_.forEach($s.allTeams, function eachTeam(team) {
				EF.getFB('teams/' + team.$id + '/active').set(false);
			});

			//	activate the chosen team
			EF.getFBObject('teams/' + teamId).$bindTo($s, 'activeTeam').then(function afterTeamLoaded() {
				$s.activeTeam.active = true;
			});
		};

		$s.restartTimer = function restartTimer() {
			if(confirm('Are you sure?')) {
				$s.activeTeam.timeRemaining = EF.initialTimeAllowed;
				$s.changeMessage('Timer restarted');
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
			var newTeam = EF.getFBRef('teams').push();
			console.log('new team created with id: ' + newTeam.key());

			newTeam.set({
				createdDate: moment().format(timeFormat),
				name: $s.formFields.newTeamName,
				clues: 0,
				active: false,
				finished: false,
				timeRemaining: 60 * 60
			});

			newTeam.child('storedMessages').push({
				time: moment().format(timeFormat),
				text: 'We are about to begin'
			});

			$s.chooseTeam(newTeam.key());
		};

		$s.getUnfinishedTeams = function getUnfinishedTeams() {
			return _.where($s.allTeams, {finished: false});
		};

		$s.allTeams = EF.getFBArray('teams');
		$s.allTeams.$loaded(function afterTeamsLoaded() {
			if ($s.getUnfinishedTeams().length === 1) {
				$s.chooseTeam($s.getUnfinishedTeams()[0].$id);
			}
		});
	}
]);
