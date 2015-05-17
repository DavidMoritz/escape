/*!
 * The Game Escape - v0.2.0 
 * Build Date: 2015.05.17 
 * Docs: http://moritzcompany.com 
 * Coded @ Moritz Company 
 */ 
 
var escapeApp = angular.module('escapeApp', ['firebase']);

escapeApp.run(function runWithDependencies($rootScope) {
	$rootScope._ = _;
	$rootScope.moment = moment;
	$rootScope.mc = mc;
});

escapeApp.controller('AdminCtrl', [
	'$scope',
	'$timeout',
	'EscapeFactory',
	function AdminCtrl($s, $timeout, EF) {
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

escapeApp.controller('FirebaseScriptsCtrl', [
	'$scope',
	'$firebaseObject',
	'$firebaseArray',
	function FirebaseScriptsCtrl($s, $fbObject, $fbArray) {
		'use strict';

		function getFBRef(childPath) {
			childPath = childPath ? '/' + childPath : '';

			return new Firebase('https://kewl.firebaseio.com/escape' + childPath);
		}

		function doneMessage(msg) {
			$s.extraMessage = msg;

			console.log(msg);
		}

		$s.doTheCodez = function doTheCodez() {
			var fbRef = getFBRef();

			//	CREATE QUESTIONS ARRAY
			// _.forEach(questions, function eachQuestion(q) {
			// 	var newQuestion = fbRef.child('questions').push();
			// 	console.log('new id for this question is ' + newQuestion.key());
			// 	newQuestion.set(q);
			// });
			// doneMessage('all questions added!');

			// //	CREATE TEAMS ARRAY
			// fbRef.child('teams').set({
			//   '150418-1408' : {
			//     'clues' : 0,
			//     'finished' : false,
			//     'name' : 'SuperTeam',
			//     'storedMessages' : [ {
			//       'text' : 'We are about to begin',
			//       'time' : 1429391301319
			//     }, {
			//       'text' : 'Here is the first message for SuperTeam!',
			//       'time' : 1429391337020
			//     } ],
			//     'timeLeft' : '00:00'
			//   }
			// });
			// doneMessage('team added!');

			// window.questions = $fbArray(getFBRef('questions'));
			// questions.$loaded(function whenQuestionsLoaded(err) {
			// 	if (err) {
			// 		console.log(err);
			// 	}

			// 	throw 'Aagh!  What are you doing??';

			// 	//	THIS IS BAD!  IT WIPED OUT THE DATABASE!
			// 	// getFBRef().set({testQuestions: []}, function afterComplete() {
			// 	// 	_.forEach(questions, function eachQuestion(q) {
			// 	// 		getFBRef('testQuestions').push(q);
			// 	// 		console.log(q.text);
			// 	// 	});
			// 	// });
			// 	// getFBRef('questions').set($s.questions);
			// 	// getFBRef('questions').update($s.questions);

			// 	// $s.questions = questions;
			// 	// console.log('Questions');
			// 	// console.log(questions);
			// });
		};
	}
]);

escapeApp.controller('EscapeCtrl', [
	'$scope',
	'$timeout',
	'$interval',
	function EscapeCtrl($s, $timeout, $interval) {
		'use strict';

		function typeOutMessage() {
			$s.public.display = '';
			var curMsgArray = $s.public.text.split('');
			var curPos = 0;

			var typingInterval = $interval(function typeGradually() {
				if(curPos >= curMsgArray.length) {
					return $interval.cancel(typingInterval);
				}

				$s.public.display = $s.public.display + curMsgArray[curPos++];
			}, 40);
		}

		$interval(function everySecond() {
			switch($s.public.timeRemaining % 40) {
				case 20:
					$s.public.text = 'Welcome to The Game Escape.';
					typeOutMessage(true);
					break;
				case 10:
					$s.public.text = 'Will your team get out in time?';
					typeOutMessage(true);
					break;
				case 0:
					$s.public.text = 'Sign up for June 19th or June 20th';
					typeOutMessage(true);
					break;
				case 30:
					$s.public.text = 'Hurry, before it\'s too late...';
					typeOutMessage(true);
					break;
			}
			$s.public.timeRemaining -= 1;
		}, 1000);

		//	initialize scoped variables
		_.assign($s, {
			public: {
				timeRemaining: 45 * 60
			}
		});
	}
]);

escapeApp.factory('EscapeFactory', [
	'$firebaseArray',
	'$firebaseObject',
	'PuzzleFactory',
	function EscapeFactory($fbArray, $fbObject, PuzzleFactory) {
		'use strict';
		var FB = null;

		return {
			initialTimeAllowed: 60 * 60,

			getFB: function getFB(childPath) {
				if (!FB) {
					FB = new Firebase('https://escape.firebaseio.com/');
				}

				return childPath ? FB.child(childPath) : FB;
			},

			getFBArray: function getFBArray(childPath) {
				return $fbArray(this.getFB(childPath));
			},

			getFBObject: function getFBObject(childPath) {
				return $fbObject(this.getFB(childPath));
			},

			setFB: function setFB(childPath, value) {
				var ref = this.getFB(childPath);
				ref.set(value);
				return false;
			},

			questions: PuzzleFactory
		};
	}
]);

escapeApp.factory('PuzzleFactory', [
	function PuzzleFactory() {
		'use strict';

		return {
			operation: {
				name: 'operation',
				icon: 'stethoscope',
				guess: '',
				answers: ['risky'],
				attempts: [],
				nextClue: {
					lockIcon: 'anchor',
					code: '__-__-__',
					visible: true
				}
			},
			monopoly: {
				name: 'monopoly',
				prerequisite: 'operation',
				icon: 'building-o',
				guess: '',
				splitGuess: {
					property: '',
					money: ''
				},
				answers: ['Illinois10'],
				attempts: [],
				nextClue: {
					lockIcon: 'bomb',
					code: '__-__-__',
					visible: true
				}
			},
			yahtzee: {
				name: 'yahtzee',
				prerequisite: 'monopoly',
				icon: 'cubes',
				guess: '',
				splitGuess: {
					die1: '',
					die2: ''
				},
				answers: ['6&4', '4&6'],
				attempts: [],
				nextClue: {
					lockIcon: 'university',
					code: '__-__-__',
					visible: true
				}
			},
			scrabble: {
				name: 'scrabble',
				prerequisite: 'yahtzee',
				icon: 'th-large',
				guess: '',
				answers: ['frustrate'],
				attempts: [],
				nextClue: {
					lockIcon: 'birthday-cake',
					code: '__-__-__',
					visible: true
				}
			},
			battleship: {
				name: 'battleship',
				icon: 'ship',
				guess: '',
				coords: [],
				columns: _.range(1, 11),
				rows: 'abcdefghij'.split(''),
				answers: ['b2&d2'],
				attempts: [],
				nextClue: {
					lockIcon: 'gavel',
					code: '__-__-__',
					visible: true
				}
			},
			clue: {
				name: 'clue',
				prerequisite: 'battleship',
				icon: 'search',
				guess: '',
				splitGuess: {
					who: '',
					what: '',
					where: ''
				},
				suspects: [
					'Mr. Green',
					'Professor Plum',
					'Colonel Mustard',
					'Mrs. Peacock',
					'Miss Scarlet',
					'Mrs. White'
				],
				weapons: [
					'Candlestick',
					'Knife',
					'Lead Pipe',
					'Revolver',
					'Rope',
					'Wrench'
				],
				rooms: [
					'Conservatory',
					'Lounge',
					'Kitchen',
					'Library',
					'Hall',
					'Study',
					'Ballroom',
					'Dining Room',
					'Billiard Room'
				],
				answers: ['Colonel Mustard&Wrench&Lounge'],
				attempts: [],
				nextClue: {
					lockIcon: 'globe',
					code: '__-__-__',
					visible: true
				}
			},
			guessWho: {
				name: 'guessWho',
				display: 'Guess Who?',
				prerequisite: 'clue',
				icon: 'users',
				guess: '',
				answers: ['alex'],
				attempts: [],
				nextClue: {
					lockIcon: 'scissors',
					code: '__-__-__',
					visible: true
				}
			},
			chess: {
				name: 'chess',
				prerequisite: 'guessWho',
				icon: 'delicious',
				guess: '',
				coords: [],
				columns: 'abcdefgh'.split('').reverse(),
				rows: _.range(1, 9),
				answers: ['h4'],
				attempts: [],
				nextClue: {
					lockIcon: 'diamond',
					code: '__-__-__',
					visible: true
				}
			},
			crossword: {
				name: 'crossword',
				prerequisite: 'chess',
				icon: 'newspaper-o',
				guess: '',
				answers: ['drmcnordtsieooluon'],
				attempts: [],
				nextClue: {
					lockIcon: 'rocket',
					code: '__-__-__',
					visible: true
				}
			},
			texasHoldEm: {
				name: 'texasHoldEm',
				display: 'Texas Hold \'Em',
				icon: 'beer',
				guess: '',
				splitGuess: {
					word1: '',
					word2: ''
				},
				answers: ['Daniel Craig', 'Craig Daniel'],
				attempts: [],
				nextClue: {
					lockIcon: 'tachometer',
					code: '__-__-__',
					visible: true
				}
			},
			connect4: {
				name: 'connect4',
				display: 'Connect Four',
				prerequisite: 'texasHoldEm',
				icon: 'table',
				guess: '',
				answers: ['4'],
				attempts: [],
				nextClue: {
					lockIcon: 'tree',
					code: '__-__-__',
					visible: true
				}
			},
			fiveRoutes: {
				name: 'fiveRoutes',
				prerequisite: 'connect4',
				icon: 'random',
				animals: [
					'elephant',
					'giraffe',
					'gorilla',
					'lion',
					'zebra'
				],
				orderedAnimals: [],
				guess: '',
				answers: ['elephant-lion-zebra-gorilla-giraffe'],
				attempts: [],
				nextClue: {
					lockIcon: 'motorcycle',
					code: '__-__-__',
					visible: true
				}
			},
			wordFind: {
				name: 'wordFind',
				prerequisite: 'fiveRoutes',
				icon: 'arrows-alt',
				guess: '',
				splitGuess: {
					word1: '',
					word2: ''
				},
				answers: ['milton bradley'],
				attempts: [],
				nextClue: {
					lockIcon: 'paw',
					code: '__-__-__',
					visible: true
				}
			},
			taboo: {
				name: 'taboo',
				prerequisite: 'wordFind',
				icon: 'ban',
				guess: '',
				answers: ['fly'],
				attempts: [],
				nextClue: {
					lockIcon: 'ticket',
					code: '__-__-__',
					visible: true
				}
			},
			jigsaw: {
				name: 'jigsaw',
				icon: 'puzzle-piece',
				guess: '',
				answers: ['12345'],
				attempts: []
			}
		};
	}
]);

//Title: Custom DropDown plugin by PC
//Documentation: http://designwithpc.com/Plugins/ddslick
//Author: PC
//Website: http://designwithpc.com
//Twitter: http://twitter.com/chaudharyp

//  This is an altered version for use in the Game Escape   //  JM: 2015-05-02

escapeApp.directive('escapeDdslick', function escapeDdslick() {
	return {
		restrict: 'A',
		link: function link(scope, el, attr) {
			//Private: Select index
			function selectIndex(obj, index) {

				//Get plugin data
				var pluginData = obj.data('ddslick');

				//Get required elements
				var ddSelected = obj.find('.dd-selected'),
					ddSelectedValue = ddSelected.siblings('.dd-selected-value'),
					ddOptions = obj.find('.dd-options'),
					ddPointer = ddSelected.siblings('.dd-pointer'),
					selectedOption = obj.find('.dd-option').eq(index),
					selectedLiItem = selectedOption.closest('li'),
					settings = pluginData.settings,
					selectedData = pluginData.settings.data[index];

				//Highlight selected option
				obj.find('.dd-option').removeClass('dd-option-selected');
				selectedOption.addClass('dd-option-selected');

				//Update or Set plugin data with new selection
				pluginData.selectedIndex = index;
				pluginData.selectedItem = selectedLiItem;
				pluginData.selectedData = selectedData;

				//If set to display to full html, add html
				if (settings.showSelectedHTML) {
					ddSelected.html(
							(selectedData.imageSrc ? '<img class="dd-selected-image' + (settings.imagePosition == 'right' ? ' dd-image-right' : '') + '" src="' + selectedData.imageSrc + '" />' : '') +
							(selectedData.text ? '<label class="dd-selected-text">' + selectedData.text + '</label>' : '') +
							(selectedData.description ? '<small class="dd-selected-description dd-desc' + (settings.truncateDescription ? ' dd-selected-description-truncated' : '') + '" >' + selectedData.description + '</small>' : '')
						);

				} else {	//Else only display text as selection
					ddSelected.html(selectedData.text);
				}

				//Updating selected option value
				ddSelectedValue.val(selectedData.value);

				//BONUS! Update the original element attribute with the new selection
				pluginData.original.val(selectedData.value);
				obj.data('ddslick', pluginData);

				//Close options on selection
				close(obj);

				//Adjust appearence for selected option
				adjustSelectedHeight(obj);

				//Callback function on selection
				if (typeof settings.onSelected == 'function') {
					settings.onSelected.call(this, pluginData);
				}
			}

			//Private: Close the drop down options
			function open(obj) {

				var $this = obj.find('.dd-select'),
					ddOptions = $this.siblings('.dd-options'),
					ddPointer = $this.find('.dd-pointer'),
					wasOpen = ddOptions.is(':visible');

				//Close all open options (multiple plugins) on the page
				$('.dd-click-off-close').not(ddOptions).slideUp(50);
				$('.dd-pointer').removeClass('dd-pointer-up');

				if (wasOpen) {
					ddOptions.slideUp('fast');
					ddPointer.removeClass('dd-pointer-up');
				}
				else {
					ddOptions.slideDown('fast');
					ddPointer.addClass('dd-pointer-up');
				}

				//Fix text height (i.e. display title in center), if there is no description
				adjustOptionsHeight(obj);
			}

			//Private: Close the drop down options
			function close(obj) {
				//Close drop down and adjust pointer direction
				obj.find('.dd-options').slideUp(50);
				obj.find('.dd-pointer').removeClass('dd-pointer-up').removeClass('dd-pointer-up');
			}

			//Private: Adjust appearence for selected option (move title to middle), when no desripction
			function adjustSelectedHeight(obj) {

				//Get height of dd-selected
				var lSHeight = obj.find('.dd-select').css('height');

				//Check if there is selected description
				var descriptionSelected = obj.find('.dd-selected-description');
				var imgSelected = obj.find('.dd-selected-image');
				if (descriptionSelected.length <= 0 && imgSelected.length > 0) {
					obj.find('.dd-selected-text').css('lineHeight', lSHeight);
				}
			}

			//Private: Adjust appearence for drop down options (move title to middle), when no desripction
			function adjustOptionsHeight(obj) {
				obj.find('.dd-option').each(function () {
					var $this = $(this);
					var lOHeight = $this.css('height');
					var descriptionOption = $this.find('.dd-option-description');
					var imgOption = obj.find('.dd-option-image');
					if (descriptionOption.length <= 0 && imgOption.length) {
						$this.find('.dd-option-text').css('lineHeight', lOHeight);
					}
				});
			}

			$.fn.ddslick = function makeDdslick(method) {
				if (methods[method]) {
					return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
				} else if (typeof method === 'object' || !method) {
					return methods.init.apply(this, arguments);
				} else {
					$.error('Method ' + method + ' does not exist.');
				}
			};

			//Set defauls for the control
			var defaults = {
				data: [],
				keepJSONItemsOnTop: false,
				width: 260,
				height: null,
				background: '#eee',
				selectText: '',
				defaultSelectedIndex: null,
				truncateDescription: true,
				imagePosition: 'left',
				showSelectedHTML: true,
				clickOffToClose: true,
				onSelected: function () { }
			},

			ddSelectHtml = '<div class="dd-select"><input class="dd-selected-value" type="hidden" /><a class="dd-selected"></a><span class="dd-pointer dd-pointer-down"></span></div>',
			ddOptionsHtml = '<ul class="dd-options"></ul>',

			//CSS for ddSlick
			ddslickCSS = '<style id="css-ddslick" type="text/css">' +
						'.dd-select{ border-radius:2px; border:solid 1px #ccc; position:relative; cursor:pointer;}' +
						'.dd-desc { color:#aaa; display:block; overflow: hidden; font-weight:normal; line-height: 1.4em; }' +
						'.dd-selected{ overflow:hidden; display:block; padding:10px; font-weight:bold;}' +
						'.dd-pointer{ width:0; height:0; position:absolute; right:10px; top:50%; margin-top:-3px;}' +
						'.dd-pointer-down{ border:solid 5px transparent; border-top:solid 5px #000; }' +
						'.dd-pointer-up{border:solid 5px transparent !important; border-bottom:solid 5px #000 !important; margin-top:-8px;}' +
						'.dd-options{ border:solid 1px #ccc; border-top:none; list-style:none; box-shadow:0px 1px 5px #ddd; display:none; position:absolute; z-index:2000; margin:0; padding:0;background:#fff; overflow:auto;}' +
						'.dd-option{ padding:10px; display:block; border-bottom:solid 1px #ddd; overflow:hidden; text-decoration:none; color:#333; cursor:pointer;-webkit-transition: all 0.25s ease-in-out; -moz-transition: all 0.25s ease-in-out;-o-transition: all 0.25s ease-in-out;-ms-transition: all 0.25s ease-in-out; }' +
						'.dd-options > li:last-child > .dd-option{ border-bottom:none;}' +
						'.dd-option:hover{ background:#f3f3f3; color:#000;}' +
						'.dd-selected-description-truncated { text-overflow: ellipsis; white-space:nowrap; }' +
						'.dd-option-selected { background:#f6f6f6; }' +
						'.dd-option-image, .dd-selected-image { vertical-align:middle; float:left; margin-right:5px; max-width:64px;}' +
						'.dd-image-right { float:right; margin-right:15px; margin-left:5px;}' +
						'.dd-container{ position:relative;}​ .dd-selected-text { font-weight:bold}​</style>';

			//CSS styles are only added once.
			if ($('#css-ddslick').length <= 0) {
				$(ddslickCSS).appendTo('head');
			}

			//Public methods
			var methods = {
				init: function init(options) {
					//Preserve the original defaults by passing an empty object as the target
					options = $.extend({}, defaults, options);

					//Apply on all selected elements
					return this.each(function () {
						var obj = $(this),
							data = obj.data('ddslick');
						//If the plugin has not been initialized yet
						if (!data) {

							var ddSelect = [], ddJson = options.data;

							//Get data from HTML select options
							obj.find('option').each(function () {
								var $this = $(this), thisData = $this.data();
								ddSelect.push({
									text: $.trim($this.text()),
									value: $this.val(),
									selected: $this.is(':selected'),
									description: thisData.description,
									imageSrc: thisData.imagesrc //keep it lowercase for HTML5 data-attributes
								});
							});

							//Update Plugin data merging both HTML select data and JSON data for the dropdown
							if (options.keepJSONItemsOnTop) {
								$.merge(options.data, ddSelect);
							} else {
								options.data = $.merge(ddSelect, options.data);
							}

							//Replace HTML select with empty placeholder, keep the original
							var original = obj, placeholder = $('<div id="' + obj.attr('id') + '"></div>');
							obj.replaceWith(placeholder);
							obj = placeholder;

							//Add classes and append ddSelectHtml & ddOptionsHtml to the container
							obj.addClass('dd-container').append(ddSelectHtml).append(ddOptionsHtml);

							//Get newly created ddOptions and ddSelect to manipulate
							ddSelect = obj.find('.dd-select');
							var ddOptions = obj.find('.dd-options');

							//Set widths
							ddOptions.css({ width: options.width });
							ddSelect.css({ width: options.width, background: options.background });
							obj.css({ width: options.width });

							//Set height
							if (options.height !== null) {
								ddOptions.css({ height: options.height, overflow: 'auto' });
							}

							//Add ddOptions to the container. Replace with template engine later.
							$.each(options.data, function eachData(index, item) {
								if (item.selected) {
									options.defaultSelectedIndex = index;
								}

								ddOptions.append('<li>' +
									'<a class="dd-option">' +
										(item.value ? ' <input class="dd-option-value" type="hidden" value="' + item.value + '" />' : '') +
										(item.imageSrc ? ' <img class="dd-option-image' + (options.imagePosition == 'right' ? ' dd-image-right' : '') + '" src="' + item.imageSrc + '" />' : '') +
										(item.text ? ' <label class="dd-option-text">' + item.text + '</label>' : '') +
										(item.description ? ' <small class="dd-option-description dd-desc">' + item.description + '</small>' : '') +
									'</a>' +
								'</li>');
							});

							//Save plugin data.
							var pluginData = {
								settings: options,
								original: original,
								selectedIndex: -1,
								selectedItem: null,
								selectedData: null
							};
							obj.data('ddslick', pluginData);

							//Check if needs to show the select text, otherwise show selected or default selection
							if (options.selectText.length > 0 && options.defaultSelectedIndex === null) {
								obj.find('.dd-selected').html(options.selectText);
							}
							else {
								var index = (options.defaultSelectedIndex !== null && options.defaultSelectedIndex >= 0 && options.defaultSelectedIndex < options.data.length) ? options.defaultSelectedIndex : 0;
								selectIndex(obj, index);
							}

							//EVENTS
							//Displaying options
							obj.find('.dd-select').on('click.ddslick', function () {
								open(obj);
							});

							//Selecting an option
							obj.find('.dd-option').on('click.ddslick', function () {
								selectIndex(obj, $(this).closest('li').index());
							});

							//Click anywhere to close
							if (options.clickOffToClose) {
								ddOptions.addClass('dd-click-off-close');
								obj.on('click.ddslick', function (e) { e.stopPropagation(); });
								$('body').on('click', function () {
									$('.dd-click-off-close').slideUp(50).siblings('.dd-select').find('.dd-pointer').removeClass('dd-pointer-up');
								});
							}
						}
					});
				},

				//Public method to select an option by its index
				select: function select(options) {
					return this.each(function () {
						if (options.index) {
							selectIndex($(this), options.index);
						}
					});
				},

				//Public method to open drop down
				open: function open() {
					return this.each(function () {
						var $this = $(this),
							pluginData = $this.data('ddslick');

						//Check if plugin is initialized
						if (pluginData) {
							open($this);
						}
					});
				},

				//Public method to close drop down
				close: function close() {
					return this.each(function () {
						var $this = $(this),
							pluginData = $this.data('ddslick');

						//Check if plugin is initialized
						if (pluginData) {
							close($this);
						}
					});
				},

				//Public method to destroy. Unbind all events and restore the original Html select/options
				destroy: function destroy() {
					return this.each(function () {
						var $this = $(this),
							pluginData = $this.data('ddslick');

						//Check if already destroyed
						if (pluginData) {
							var originalElement = pluginData.original;
							$this.removeData('ddslick').unbind('.ddslick').replaceWith(originalElement);
						}
					});
				}
			};

			//	JM: assign class of ddslick to element
			el.addClass('ddslick');
		}
	};
});

// (function($) {
//     $.fn.writeText = function(content) {
//         var contentArray = content.split(''),
//             current = 0,
//             elem = this;
//         setInterval(function() {
//             if(current < contentArray.length) {
//                 elem.text(elem.text() + contentArray[current++]);
//             }
//         }, 100);
//     };

// })(jQuery);

var mc = {
	pluralize: function pluralize(str) {
		return str.replace(/y$/, 'ie') + 's';
	},

	camelToTitle: function camelToTitle(str) {	//	convert camelCaseString to Title Case String
		return _.capitalize(str.replace(/([A-Z])/g, ' $1')).trim();
	},

	randomDigits: function randomDigits(min, max) {
		min = min === undefined ? 1 : min;
		max = max || 999;

		return Math.floor(Math.random() * (max - min + 1) + min);
	},

	alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),

	isAngularObjectEqual: function isAngularObjectEqual(object1, object2) {
		return _.isEqual(_.omit(object1, '$$hashKey'), _.omit(object2, '$$hashKey'));
	},

	expandArray: function expandArray(array, times) {	//	turns [1,2,3] into [1,2,3,1,2,3,1,2,3];
		times = times || 3;	//	default number of times to expand it by

		var expandedArray = [];

		for (var i = 0; i < times; i++) {
			expandedArray = expandedArray.concat(angular.copy(array));
		}

		return expandedArray;
	},

	calculateAge: function calculateAge(dateOfBirth) {
		var age;

		if (dateOfBirth) {
			var year = Number(dateOfBirth.substr(0, 4));
			var month = Number(dateOfBirth.substr(5, 2)) - 1;
			var day = Number(dateOfBirth.substr(8, 2));
			var today = new Date();
			age = today.getFullYear() - year;

			if (today.getMonth() < month || (today.getMonth() == month && today.getDate() < day)) {
				age--;
			}
		}

		return age || 0;
	}
};

escapeApp.controller('SessionCtrl', [
	'$scope',
	'$timeout',
	'$interval',
	'EscapeFactory',
	function SessionCtrl($s, $timeout, $interval, EF) {
		'use strict';

		function typeOutMessage() {
			console.log('SESS> typeOutMessage() called');
			$s.curMsg.display = '';

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

		var timeFormat = 'YYYY-MM-DD HH:mm:ss';
		var activeTeamFBObj;
		$(function onReady() {
			$('.numericKeypad').keypad({
				separator: '|', 
				layout: [
					'7|8|9', 
					'4|5|6', 
					'1|2|3', 
					$.keypad.CLEAR + '|0|#'
				],
				showAnim: '',
				clearText: 'X',
				keypadClass: 'midnightKeypad',
				keypadOnly: true,
				onKeypress: function(key, value, inst) {
					// play *beep
					console.log('beep');
					if (key == '#') {
						$('#jigsawSubmit').trigger('click');
					}
				}
			});
		});

		$interval(function everySecond() {
			if ($s.activeTeam && $s.activeTeam.timerStarted) {
				// convertTimer
				var start = moment($s.activeTeam.timerStarted, timeFormat);
				var current = $s.activeTeam.finished ? moment($s.activeTeam.finished, timeFormat) : moment();

				$s.timeRemaining = $s.activeTeam.timeAllowed - current.diff(start, 'seconds');
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
			q: EF.questions
		});

		$s.chooseTeam = function chooseTeam(teamId) {
			console.log('SESS> choosing Team: ' + teamId);

			if (activeTeamFBObj) {
				activeTeamFBObj.$destroy();
				console.log('SESS> activeTeam is destroyed');
			} else {
				var firstLoad = true;
			}

			console.log('SESS> choosing a team');
			activeTeamFBObj = EF.getFBObject('teams/' + teamId);
			activeTeamFBObj.$bindTo($s, 'activeTeam').then(function afterTeamLoaded() {
				console.log('SESS> afterTeamLoaded');
				if(firstLoad) {
					bindMessaging();
				}
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
			switch (q.name) {
				case 'monopoly':
					var property = _.contains(q.splitGuess.property, 'Illinois') ? 'Illinois' : q.splitGuess.property;
					var money = q.splitGuess.money.replace(/\$/g, '').replace('.00', '');

					q.guess = property + money;
					break;
				case 'yahtzee':
					q.guess = q.splitGuess.die1 + '&' + q.splitGuess.die2;
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

			$s.submitGuess(q);
		};

		$s.isSolved = function isSolved(puz) {
			if (!puz) {
				return true;	//	no prerequisite
			}

			var puzzleName = _.has(puz, 'name') ? puz.name : puz;
			return $s.activeTeam && $s.activeTeam.solvedQuestions && _.contains(_.keys($s.activeTeam.solvedQuestions), puzzleName);
		};

		$s.unsolve = function unsolve(puz) {
			console.log('deleting ' + puz.name + ' from solved puzzles');
			delete $s.activeTeam.solvedQuestions[puz.name];
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
