module.exports = function exportPleeease(grunt) {
	grunt.config('pleeease', {
		dev: {
			options: {
				optimizers: {
					minifier: false
				}
			},
			files: {
				'<%= distPath %>escape.css': '<%= distPath %>escape.css'
			}
		},
		prod: {
			options: {
				optimizers: {
					minifier: true
				}
			},
			files: {
				'<%= distPath %>escape.css': '<%= distPath %>escape.css'
			}
		}
	});

	grunt.loadNpmTasks('grunt-pleeease');
};
