const { src, dest, watch, parallel, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const del = require('del');
const browserSync = require('browser-sync').create();
const svgSprite = require('gulp-svg-sprite');
const cheerio = require('gulp-cheerio');
const replace = require('gulp-replace');

function svgSprites() {
	return src('app/images/icons/*.svg')
		.pipe(
			cheerio({
				run: $ => {
					$('[fill]').removeAttr('fill');
					$('[stroke]').removeAttr('stroke');
					$('[style]').removeAttr('style');
				},
				parserOptions: { xmlMode: true },
			})
		)
		.pipe(replace('&gt;', '>'))
		.pipe(
			svgSprite({
				mode: {
					stack: {
						sprite: '../sprite.svg',
					},
				},
			})
		)
		.pipe(dest('app/images'));
}

// Запуск сервера BrowserSync
function browsersync() {
	browserSync.init({
		server: {
			baseDir: 'app/',
		},
		notify: false,
	});
}

function styles() {
	return src([
		'app/scss/style.scss',
		'./node_modules/swiper/swiper-bundle.min.css',
	])
		.pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
		.pipe(concat('style.min.css'))
		.pipe(
			autoprefixer({
				overrideBrowserslist: ['last 10 versions'],
				grid: true,
			})
		)
		.pipe(dest('app/css'))
		.pipe(browserSync.stream());
}

function scripts() {
	return src([
		'./node_modules/mixitup/dist/mixitup.min.js',
		'./node_modules/swiper/swiper-bundle.min.js',
		'app/js/main.js',
	])
		.pipe(concat('main.min.js'))
		.pipe(uglify())
		.pipe(dest('app/js'))
		.pipe(browserSync.stream());
}

function images() {
	return src('./app/images/**/*.*')
		.pipe(
			imagemin([
				imagemin.gifsicle({ interlaced: true }),
				imagemin.mozjpeg({ quality: 75, progressive: true }),
				imagemin.optipng({ optimizationLevel: 5 }),
				imagemin.svgo({
					plugins: [
						{ name: 'removeViewBox', active: true },
						{ name: 'cleanupIDs', active: false },
					],
				}),
			])
		)
		.pipe(dest('dist/images'));
}

// Очистка папки dist
function cleanDist() {
	return del('dist');
}

// Збірка проекту
function build() {
	return src(['app/**/*.html', 'app/css/style.min.css', 'app/js/main.min.js'], {
		base: 'app',
	}).pipe(dest('dist'));
}

// Спостереження за змінами
function watching() {
	watch(['app/scss/**/*.scss'], styles);
	watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
	watch(['app/**/*.html']).on('change', browserSync.reload);
	watch(['app/images/icons/*.svg'], svgSprites);
}

exports.styles = styles;
exports.scripts = scripts;
exports.browsersync = browsersync;
exports.watching = watching;
exports.images = images;
exports.cleanDist = cleanDist;
exports.svgSprites = svgSprites;
exports.build = series(cleanDist, images, build);

exports.default = parallel(svgSprites, styles, scripts, browsersync, watching);
