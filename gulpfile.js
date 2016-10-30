var jsdoc = require('gulp-jsdoc3'),
    gulp = require ('gulp');

// Paths to various files
var paths = {
	scripts: ['js/*.js']
};

gulp.task('doc', function (cb) {
    return gulp.src(['README.md', './js/*.js'], { read: false })
        .pipe(jsdoc(cb));
});

gulp.task('default', ['doc']);
