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
			target: "./html",
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

	manifest: {
		webRoot: "./html"
	},
	watchDirs: ["./photos"],
	plugins: [require("faucet-pipeline-images"), require(".")]
};
