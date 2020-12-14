let path = require("path");
let FileFinder = require("faucet-pipeline-core/lib/util/files/finder");
let { promisify } = require("util");
let ejs = require("ejs");
let renderFile = promisify(ejs.renderFile);

let lastImages;

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
			let thumbnailWebpName = addSuffix(fileName, "-thumbnail-webp");
			let galleryName = addSuffix(fileName, "-gallery");
			let galleryWebpName = addSuffix(fileName, "-gallery-webp");
			let title = path.basename(fileName, path.extname(fileName));

			let g = name =>
				assetManager.manifest.get(`${optimizerConfig.target}/${name}`.slice(2));

			return {
				title,
				detail: `${title}.html`,
				original: g(fileName),
				thumbnail: { jpg: g(thumbnailName), webp: g(thumbnailWebpName) },
				gallery: { jpg: g(galleryName), webp: g(galleryWebpName) }
			};
		});

		if (!filepaths) {
			// cache processed images in case of watch triggered run
			lastImages = images;
		} else if (images) {
			// if the run contains new images, concat to cache
			lastImages.concat(images);
		}

		await Promise.all(
			lastImages.map(async image => {
				let html = await renderFile("./templates/detail.ejs", { image });
				return assetManager.writeFile(path.join(target, image.detail), html);
			})
		);
		let html = await renderFile("./templates/collection.ejs", {
			images: lastImages
		});
		return assetManager.writeFile(path.join(target, `index.html`), html);
	};
}

function addSuffix(filepath, suffix = "") {
	let directory = path.dirname(filepath);
	let extension = path.extname(filepath);
	let basename = path.basename(filepath, extension);
	return path.join(directory, `${basename}${suffix}${extension}`);
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
