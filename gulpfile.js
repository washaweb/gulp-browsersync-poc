var gulp = require('gulp'),
    dirSync = require('gulp-directory-sync'),
    browserify = require('gulp-browserify'),
    less = require('gulp-less'),
    path = require('path'),
    LessPluginCleanCSS = require('less-plugin-clean-css'),
    LessPluginAutoPrefix = require('less-plugin-autoprefix'),
    cleancss = new LessPluginCleanCSS({ advanced: true }),
    autoprefix= new LessPluginAutoPrefix({ browsers: ["last 4 versions", 'ie 9'] }),
    notify = require("gulp-notify") ,
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync'),
    imagemin = require('gulp-imagemin');


// path variables
var baseDir = '.',
    sourcePath = baseDir + '/assets',
    targetPath = baseDir + '/dist',
    node = baseDir + '/node_modules',
    vendor = baseDir + '/dist/vendor';


gulp
  // watch less/js/html/img files for changes, run the Less preprocessor with the 'less' task and reload
  .task('serve', function() {
    browserSync({
      server: {
        //proxy: "yourlocal.dev",
        baseDir: baseDir
      }
    });

    gulp.watch(sourcePath + '/less/**/*.less', ['less-watch']);
    gulp.watch(sourcePath + "/js/*.js", ['js-watch']);
    gulp.watch(sourcePath + "/img/*", ['img-watch']);
    gulp.watch(baseDir + "/*.html").on('change', browserSync.reload);
  })
  .task('resources', function() {
    return gulp.src( '' )
      // .pipe(dirSync(
      //   node + '/[anyvendor]/', vendor + '/[anyvendor]/', { printSummary: true } )
      // )
      .pipe(dirSync(
        sourcePath + '/favicons', targetPath + '/favicons/', { printSummary: true } )
      )
      .pipe(dirSync(
        node + '/font-awesome/fonts', targetPath + '/fonts/', { printSummary: true } )
      )
  })
  //less compilation, autoprefixer and minify
  .task('less', function () {
    return gulp.src([sourcePath + '/less/app.less'])
      //.pipe(sourcemaps.init({loadMaps: true})),
      .pipe(less({
        compress: false,
        plugins: [autoprefix, cleancss],
        paths: [ path.join(__dirname, 'less', 'includes') ]
      })
      .on("error", notify.onError(function (error) {
           return "Error: " + error.message;
       })))
      //.pipe(sourcemaps.write('./')),
      .pipe(gulp.dest(targetPath + '/css'));
  })
  // process JS files with browserify
  .task('js', function() {
    return gulp.src(sourcePath + '/js/app.js')
      .pipe(browserify({
        insertGlobals : true,
        debug : true
      }))
      .on("error", notify.onError(function (error) {
           return "Error: " + error.message;
       }))
      .pipe(gulp.dest(targetPath + '/js'));
  })
  //task watch reload order management
  .task('less-watch', ['less'], browserSync.reload)
  .task('js-watch', ['js'], browserSync.reload)
  .task('img-watch', ['img'], browserSync.reload)
  //copy and optimize images
  .task('img', function () {
    return gulp.src(sourcePath + '/img/*')
      .pipe(imagemin({
          progressive: true,
          svgoPlugins: [{removeViewBox: false}]
      }))
      .pipe(gulp.dest(targetPath + '/img'));
  })
  //default task
  .task('default', ['resources', 'less', 'js', 'img', 'serve'])
  .task('build', ['resources', 'less', 'js', 'img']);
