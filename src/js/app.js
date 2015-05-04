var escapeApp = angular.module('escapeApp', ['firebase']);

escapeApp.run(function runWithDependencies($rootScope) {
	$rootScope._ = _;
	$rootScope.moment = moment;
	$rootScope.mc = mc;
});
