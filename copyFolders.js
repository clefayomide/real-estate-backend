"use strict";
const fs = require("fs-extra");
const path = require("path");
const viewInDir = path.join(__dirname, "src", "views");
const viewOutDir = path.join(__dirname, "dist", "views");
const publicInDir = path.join(__dirname, "src", "public");
const publicOutDir = path.join(__dirname, "dist", "public");
fs.removeSync(viewOutDir);
fs.removeSync(publicOutDir);
async function copyFiles() {
    try {
        await fs.copy(viewInDir, viewOutDir);
        await fs.copy(publicInDir, publicOutDir);
        console.log("folders copied successfully!");
    }
    catch (err) {
        console.error("error occurred while copying folder", err);
    }
}
copyFiles();
