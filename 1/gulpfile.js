const gulp = require('gulp');
const browsersync = require("browser-sync").create();
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const buffer = require('vinyl-buffer');
const minifyCSS = require('gulp-clean-css');
const gutil = require('gulp-util');
const concat = require('gulp-concat');
const streamqueue = require('streamqueue');

// BrowserSync
function browserSync(done) {
    browsersync.init({
        server: {
            baseDir: "./dist/",
            index: 'index.html'
        },
        port: 3000
    });
    done();
}

// BrowserSync Reload
function browserSyncReload(done) {
    browsersync.reload();
    done();
}

//copying html
function copyHtml() {
    return gulp.src('./src/*.html')
        .pipe(gulp.dest('./dist/'));
}

//copying files
function copyFiles() {
    return gulp.src('./src/files/**/*')
        .pipe(gulp.dest('./dist/'));
}

//styles
function styles() {
    return gulp.src('./src/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer('last 2 version'))
        .pipe(minifyCSS({ compatibility: 'ie8' }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/css/'))
}

//scripts
function scripts() {
    return streamqueue(
        {
            objectMode: true
        },

        gulp.src([
            './src/js/main.js'
        ])
    )
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(concat('main.js'))
        .pipe(buffer())
        .pipe(babel())
        .pipe(uglify())
        .on('error', gutil.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/js'))
}

// Watch files
function watchFiles() {
    gulp.watch(
        [
            "./src/**/*"
        ],
        gulp.series(browserSyncReload)
    );
    gulp.watch(['./src/*.html'], copyHtml);
    gulp.watch('./src/scss/**/*.scss', styles);
    gulp.watch(['./src/js/main.js'], scripts);
}

//define complex tasks
const watch = gulp.parallel(watchFiles, browserSync);
const build = gulp.parallel(copyHtml, copyFiles, styles, scripts);

// export tasks
exports.watch = watch;
exports.build = build;

exports.styles = styles;
exports.scripts = scripts;
exports.copy = copyHtml;
exports.copy = copyFiles;

//default task
gulp.task('default', gulp.series(gulp.parallel(watchFiles, browserSync)))