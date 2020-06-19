module.exports = {
	sass: [
		{
			source: "./scss/index.scss",
			target: "./html/css/app.css"
		}
	],
	static: [
		{
			source: "./webfonts",
			target: "./html/webfonts"
		}
	],

	images: [
		{
			source: "./photos",
			target: "./html"
		},
		{
			source: "./photos",
			target: "./html",
			suffix: "-gallery",
			format: "webp"
		},
		{
			source: "./photos",
			target: "./html",
			format: "webp",
			suffix: "-thumbnail",
			width: 300,
			height: 300,
			keepRatio: false
		}
	],

	yourMemories: [
		{
			source: "./photos",
			target: "./html"
		}
	],

	js: [
		{
			source: "./scripts/lazy-loading.js",
			target: "./html/assets/lazy-loading.js"
		},
		{
			source: "./node_modules/vanilla-lazyload/dist/lazyload.min.js",
			target: "./html/assets/vanilla-lazyload.min.js"
		}
	],

	manifest: {
		webRoot: "./html"
	},
	watchDirs: ["./photos"],
	plugins: [require("faucet-pipeline-images"), require(".")]
};
