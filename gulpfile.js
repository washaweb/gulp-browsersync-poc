var gulp = require('gulp'),
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
  .task('serve', function() {
    // watch less/js/html/img files for changes, run the Less preprocessor with the 'less' task and reload
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
    //copy needed resources to `dist` folder
    gulp
      .src( sourcePath + '/favicons/*',
        {base: sourcePath + '/favicons/'})
      .pipe(gulp.dest( targetPath + '/favicons'));
    gulp
      .src( sourcePath + '/fonts/*',
        {base: sourcePath + '/fonts/'})
      .pipe(gulp.dest( targetPath + '/fonts'));
    gulp
      .src( node + '/font-awesome/fonts/*',
        {base: node  + '/font-awesome/fonts/'})
      .pipe(gulp.dest( targetPath + '/fonts'));
  })
  
  .task('less', function () {
    //less compilation, autoprefixer and minify
    return gulp.src([sourcePath + '/less/app.less'])
      //.pipe( sourcemaps.init() )
      .pipe(less({
        compress: false,
        plugins: [autoprefix, cleancss],
        paths: [ path.join(__dirname, 'less', 'includes') ]
      })
      .on("error", notify.onError(function (error) {
           return "Error: " + error.message;
       })))
      //.pipe( sourcemaps.write({ sourceRoot: targetPath + '/css' }) )
      .pipe(gulp.dest(targetPath + '/css'));
  })
  
  .task('js', function() {
    // process JS files with browserify
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
  
  .task('img', function () {
    //copy and optimize images
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
