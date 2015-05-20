var escapeApp = angular.module('escapeApp', ['firebase', 'ngJustGage']);

escapeApp.run(function runWithDependencies($rootScope) {
	$rootScope._ = _;
	$rootScope.moment = moment;
	$rootScope.mc = mc;
});
