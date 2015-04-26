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
			newTeamName: ''
		});

		$s.restartTimer = function restartTimer() {
			if(confirm('Are you sure?')) {
				$s.session.timer = Date.now() + 60 * 60 * 1000;
				$s.changeMessage('Timer started');
			}
		};

		$s.changeMessage = function changeMessage(message) {
			var oldMessages = $s.session.storedMessages;

			oldMessages.push({
				time: Date.now(),
				text: message
			});
			$s.session.storedMessages = oldMessages;

			$('.changeMessage').val('');
		};

		$s.createTeam = function createTeam(name) {
			var newTeam = EF.getFBRef('teams').push();
			console.log('new team created with id: ' + newTeam.key());

			newTeam.set({
				createdDate: moment().format(timeFormat),
				name: name,
				clues: 0,
				active: false,
				finished: false,
				timeRemaining: 60 * 60
			});

			newTeam.child('storedMessages').push({
				time: moment().format(timeFormat),
				text: 'We are about to begin'
			});

			$s.chooseSession(newTeam.key());
		};

		$s.allTeams = EF.getFBArray('teams');
	}
]);
