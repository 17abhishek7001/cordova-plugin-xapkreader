let fse = require('fs-extra');
let q = require('q');

module.exports = function(context) {
	const deferral = q.defer();
	let target = 'platforms/android/cordova/lib/plugin-build.gradle';

	console.log('scripts/before_install: fixing gradle');

	fse.readFile(target, 'utf8').then((data) => {
		

		// fix "cdvCompileSdkVersion" and "cdvBuildToolsVersion" undefined variables
		data = data.replace(/\/\/ GENERATED FILE! DO NOT EDIT!/, match => `${match}

ext {
	apply from: '../../CordovaLib/cordova.gradle'
	cdvCompileSdkVersion = privateHelpers.getProjectTarget()
	cdvBuildToolsVersion = privateHelpers.findLatestInstalledBuildTools()
}
`);

		return fse.writeFile(target, data, 'utf8').then(() => {
			console.log('scripts/before_install: done!');
			deferral.resolve();
		});
	}).catch((e) => {
		deferral.reject('scripts/before_install: error ' + e);
	});

	return deferral.promise;
};
