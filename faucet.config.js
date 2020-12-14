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
			suffix: "-gallery-webp",
			format: "webp"
		},
		{
			source: "./photos",
			target: "./html",
			suffix: "-gallery"
		},
		{
			source: "./photos",
			target: "./html",
			format: "webp",
			suffix: "-thumbnail-webp",
			width: 300,
			height: 300,
			keepRatio: false
		},
		{
			source: "./photos",
			target: "./html",
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
	watchDirs: ["./photos", "./templates"],
	plugins: [require("faucet-pipeline-images"), require(".")]
};
