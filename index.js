let path = require("path");
let FileFinder = require("faucet-pipeline-core/lib/util/files/finder");
let { promisify } = require("util");
let ejs = require("ejs");
let renderFile = promisify(ejs.renderFile);

module.exports = {
	key: "yourMemories",
	bucket: "markup",
	plugin: yourMemories
};

function yourMemories(config, assetManager) {
	let optimizers = config.map(optimizerConfig =>
		makeOptimizer(optimizerConfig, assetManager)
	);

	return filepaths =>
		Promise.all(optimizers.map(optimize => optimize(filepaths)));
}

function makeOptimizer(optimizerConfig, assetManager) {
	let source = assetManager.resolvePath(optimizerConfig.source);
	let target = assetManager.resolvePath(optimizerConfig.target, {
		enforceRelative: true
	});

	let fileFinder = new FileFinder(source, {
		skipDotfiles: true,
		filter: withFileExtension("jpg", "jpeg", "png", "webp", "svg")
	});

	return async filepaths => {
		let fileNames = await (filepaths
			? fileFinder.match(filepaths)
			: fileFinder.all());

		let images = fileNames.map(fileName => {
			let thumbnailName = addSuffix(fileName, "-thumbnail");
			let galleryName = addSuffix(fileName, "-gallery");
			let title = path.basename(fileName, path.extname(fileName));

			return {
				title,
				detail: `${title}.html`,
				original: assetManager.manifest.get(
					`${optimizerConfig.target}/${fileName}`.slice(2)
				),
				thumbnail: assetManager.manifest.get(
					`${optimizerConfig.target}/${thumbnailName}`.slice(2)
				),
				gallery: assetManager.manifest.get(
					`${optimizerConfig.target}/${galleryName}`.slice(2)
				)
			};
		});

		await Promise.all(
			images.map(async image => {
				let html = await renderFile("./templates/detail.ejs", { image });
				return assetManager.writeFile(path.join(target, image.detail), html);
			})
		);
		let html = await renderFile("./templates/collection.ejs", { images });
		return assetManager.writeFile(path.join(target, `index.html`), html);
	};
}

function addSuffix(filepath, suffix = "") {
	let directory = path.dirname(filepath);
	let extension = path.extname(filepath);
	let basename = path.basename(filepath, extension);
	return path.join(directory, `${basename}${suffix}${extension}.webp`);
}

function withFileExtension(...extensions) {
	return filename =>
		extensions.includes(extname(filename)) ||
		extensions.includes(extname(filename).toLowerCase());
}

// extname follows this annoying idea that the dot belongs to the extension
function extname(filename) {
	return path.extname(filename).slice(1);
}
