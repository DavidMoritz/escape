escapeApp.factory('MethodFactory', [
	function MethodFactory() {
		'use strict';

		return {
			addNewMessage: function addNewMessage(message) {
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
			},

			isSolved: function isSolved(puz) {
				var puzzleName = _.has(puz, 'name') ? puz.name : puz;

				return $s.activeTeam && $s.activeTeam.solvedQuestions && _.contains(_.keys($s.activeTeam.solvedQuestions), puzzleName);
			}
		};
	}
]);
