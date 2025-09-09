// scripts/optimize-images.js
const sharp = require("sharp");
const { globSync } = require("glob");
const fs = require("fs-extra");
const path = require("path");

// Configuration
const config = {
  inputDir: "src/assets/images",
  outputDir: "dist/assets/images",
  jpeg: { quality: 80, progressive: true },
  png: { quality: 80, compressionLevel: 9 },
  webp: { quality: 75 },
  avif: { quality: 65 },
};

// Create output directory if it doesn't exist
fs.ensureDirSync(config.outputDir);

// Process images based on their formats
(async () => {
  console.log("🖼️ Starting image optimization...");

  const rasterImages = globSync(`${config.inputDir}/**/*.{jpg,jpeg,png}`);
  const svgImages = globSync(`${config.inputDir}/**/*.svg`);
  const gifImages = globSync(`${config.inputDir}/**/*.gif`);
  const icoFiles = globSync(`${config.inputDir}/**/*.ico`);

  // Track counts for reporting
  const stats = {
    processed: 0,
    copied: 0,
    errors: 0,
  };

  // Process JPEG and PNG images with sharp
  for (const inputPath of rasterImages) {
    try {
      // Calculate the output path
      const relativePath = path.relative(config.inputDir, inputPath);
      const outputPath = path.join(config.outputDir, relativePath);

      // Create the directory structure if it doesn't exist
      fs.ensureDirSync(path.dirname(outputPath));

      // Process the image based on its format
      const image = sharp(inputPath);
      const metadata = await image.metadata();

      if (metadata.format === "jpeg" || inputPath.match(/\.(jpg|jpeg)$/i)) {
        // Process JPEG
        await image.clone().jpeg(config.jpeg).toFile(outputPath);

        // Create additional modern formats
        await image
          .clone()
          .webp(config.webp)
          .toFile(outputPath.replace(/\.(jpg|jpeg)$/i, ".webp"));
        await image
          .clone()
          .avif(config.avif)
          .toFile(outputPath.replace(/\.(jpg|jpeg)$/i, ".avif"));
      } else if (metadata.format === "png" || inputPath.match(/\.png$/i)) {
        // Process PNG
        await image.clone().png(config.png).toFile(outputPath);

        // Create additional modern formats
        await image
          .clone()
          .webp(config.webp)
          .toFile(outputPath.replace(/\.png$/i, ".webp"));
        await image
          .clone()
          .avif(config.avif)
          .toFile(outputPath.replace(/\.png$/i, ".avif"));
      }

      stats.processed++;
      console.log(`✅ Optimized: ${relativePath}`);
    } catch (error) {
      stats.errors++;
      console.error(`❌ Error processing ${inputPath}:`, error.message);
    }
  }

  // Copy SVG files
  for (const inputPath of svgImages) {
    try {
      const relativePath = path.relative(config.inputDir, inputPath);
      const outputPath = path.join(config.outputDir, relativePath);

      fs.ensureDirSync(path.dirname(outputPath));
      fs.copyFileSync(inputPath, outputPath);

      stats.copied++;
      console.log(`📋 Copied SVG: ${relativePath}`);
    } catch (error) {
      stats.errors++;
      console.error(`❌ Error copying ${inputPath}:`, error.message);
    }
  }

  // Copy GIF files
  for (const inputPath of gifImages) {
    try {
      const relativePath = path.relative(config.inputDir, inputPath);
      const outputPath = path.join(config.outputDir, relativePath);

      fs.ensureDirSync(path.dirname(outputPath));
      fs.copyFileSync(inputPath, outputPath);

      stats.copied++;
      console.log(`📋 Copied GIF: ${relativePath}`);
    } catch (error) {
      stats.errors++;
      console.error(`❌ Error copying ${inputPath}:`, error.message);
    }
  }

  // Copy ICO files
  for (const inputPath of icoFiles) {
    try {
      const relativePath = path.relative(config.inputDir, inputPath);
      const outputPath = path.join(config.outputDir, relativePath);

      fs.ensureDirSync(path.dirname(outputPath));
      fs.copyFileSync(inputPath, outputPath);

      stats.copied++;
      console.log(`📋 Copied ICO: ${relativePath}`);
    } catch (error) {
      stats.errors++;
      console.error(`❌ Error copying ${inputPath}:`, error.message);
    }
  }

  // Final report
  console.log("\n✨ Image optimization complete:");
  console.log(`   - ${stats.processed} images optimized`);
  console.log(`   - ${stats.copied} files copied`);
  if (stats.errors > 0) {
    console.log(`   - ${stats.errors} errors encountered`);
  }
})();
