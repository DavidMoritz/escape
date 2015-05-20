var escapeApp = angular.module('escapeApp', ['firebase', 'charts.ng.justgage']);

escapeApp.run(function runWithDependencies($rootScope) {
	$rootScope._ = _;
	$rootScope.moment = moment;
	$rootScope.mc = mc;
});
