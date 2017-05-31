var args = require('yargs').argv,
    path = require('path'),
    fs = require('fs'),
    del = require('del'),
    gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    webpackStream = require('webpack-stream'),
    gulpsync = $.sync(gulp),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    historyApiFallback = require('connect-history-api-fallback'),
    PluginError = $.util.PluginError,
    webpackDevMiddleware = require('webpack-dev-middleware'),
    webpackHotMiddleware = require('webpack-hot-middleware'),
    webpack = require('webpack');

// production mode (see build task)
// Example:
//    gulp --prod
var isProduction = !!args.prod;

if (isProduction)
    log('Starting production build...');

// styles sourcemaps
var useSourceMaps = false;

// Switch to sass mode.
// Example:
//    gulp --usesass
var useSass = true; // args.usesass // ReactJS project defaults to SASS only

// ignore everything that begins with underscore
var hidden_files = '**/_*.*';
var ignored_files = '!' + hidden_files;

// MAIN PATHS
var paths = {
    app: 'app/',
    dist: 'dist/',
    styles: 'sass/',
    scripts: 'src/'
}

// if sass -> switch to sass folder
if (useSass) {
    log('Using SASS stylesheets...');
    paths.styles = 'sass/';
}

// SOURCES CONFIG
var source = {
    scripts: {
        app: [paths.app + paths.scripts + '**/*.{jsx,js}'],
        entry: [paths.app + paths.scripts + 'client.js']
    },
    styles: {
        app: [paths.app + paths.styles + '*.*'],
        themes: [paths.app + paths.styles + 'themes/*', ignored_files],
        watch: [paths.app + paths.styles + '**/*', '!' + paths.app + paths.styles + 'themes/*']
    },
    images: [paths.app + 'img/**/*'],
    fonts: [
        paths.app + 'fonts/*.{ttf,woff,woff2,eof,svg}'
    ]
};

// BUILD TARGET CONFIG
var build = {
    scripts: paths.dist + 'js',
    styles: paths.dist + 'css',
    images: paths.dist + 'img',
    fonts: paths.dist + 'fonts'
};

// PLUGINS OPTIONS

var vendorUglifyOpts = {
    mangle: {
        except: ['$super'] // rickshaw requires this
    }
};

var cssnanoOpts = {
    safe: true,
    discardUnused: false,
    reduceIdents: false
}

var webpackConfig = require(
    isProduction ?
    './webpack.client.prod' :
    './webpack.client.dev'
);

var bundler = webpack(webpackConfig);

//---------------
// TASKS
//---------------


// JS APP
gulp.task('scripts:app', function() {
    log('Building scripts..');
    // Minify and copy all JavaScript (except vendor scripts)
    return gulp.src(source.scripts.entry)
        .pipe($.if(useSourceMaps, $.sourcemaps.init()))
        .pipe(
            webpackStream(webpackConfig)
        )
        .on("error", handleError)
        .pipe($.if(isProduction, $.uglify({
            preserveComments: 'some'
        })))
        .on("error", handleError)
        .pipe($.if(useSourceMaps, $.sourcemaps.write()))
        .pipe(gulp.dest(build.scripts))
        .pipe( $.if(isProduction, reload({ stream: true})) );
});

// APP LESS
gulp.task('styles:app', function() {
    log('Building application styles..');
    return gulp.src(source.styles.app)
        .pipe($.if(useSourceMaps, $.sourcemaps.init()))
        .pipe(useSass ? $.sass() : $.less())
        .on("error", handleError)
        .pipe($.if(isProduction, $.cssnano(cssnanoOpts)))
        .pipe($.if(useSourceMaps, $.sourcemaps.write()))
        .pipe(gulp.dest(build.styles))
        .pipe(reload({
            stream: true
        }));
});

// APP RTL
gulp.task('styles:app:rtl', function() {
    log('Building application RTL styles..');
    return gulp.src(source.styles.app)
        .pipe($.if(useSourceMaps, $.sourcemaps.init()))
        .pipe(useSass ? $.sass() : $.less())
        .on("error", handleError)
        .pipe($.rtlcss())
        .pipe($.if(isProduction, $.cssnano(cssnanoOpts)))
        .pipe($.if(useSourceMaps, $.sourcemaps.write()))
        .pipe($.rename(function(path) {
            path.basename += "-rtl";
            return path;
        }))
        .pipe(gulp.dest(build.styles))
        .pipe(reload({
            stream: true
        }));
});

// LESS THEMES
gulp.task('styles:themes', function() {
    log('Building application theme styles..');
    return gulp.src(source.styles.themes)
        .pipe(useSass ? $.sass() : $.less())
        .on("error", handleError)
        .pipe(gulp.dest(build.styles))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('fonts', function() {
    return gulp.src(source.fonts)
        .pipe($.flatten())
        .pipe(gulp.dest(build.fonts))
})

gulp.task('images', function() {
    return gulp.src(source.images)
        .pipe(gulp.dest(build.images))
})

//---------------
// WATCH
//---------------

// Rerun the task when a file changes
gulp.task('watch', function() {
    log('Watching source files..');
    gulp.watch(source.scripts.app, ['scripts:app']);
    gulp.watch(source.styles.watch, ['styles:app', 'styles:app:rtl']);
    gulp.watch(source.styles.themes, ['styles:themes']);
});

//---------------
// MAIN TASKS
//---------------

// build for production (no watch)
gulp.task('build', gulpsync.sync([
    'assets'
]));

// Server for development
gulp.task('serve', gulpsync.sync([
    'default'
]));

// build with sourcemaps (no minify)
gulp.task('sourcemaps', ['usesources', 'default']);
gulp.task('usesources', function() {
    useSourceMaps = true;
});

// default (no minify)
gulp.task('default', gulpsync.sync([
    'vendor',
    'assets',
    'watch'
]));

gulp.task('assets', [
    'fonts',
    'images',
    'scripts:app',
    'styles:app',
    'styles:app:rtl',
    'styles:themes'
]);

// Remove all files from dist folder
gulp.task('clean', function(done) {
    log('Clean dist folder..');
    del(paths.dist, {
        force: true // clean files outside current directory
    }, done);
});

// Error handler
function handleError(err) {
    log(err.toString());
    this.emit('end');
}

// log to console using
function log(msg) {
    $.util.log($.util.colors.blue(msg));
}
