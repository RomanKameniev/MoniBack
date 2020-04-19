const sharp = require("sharp");

const num = 5;
sharp("../../photo/out.png")
  .trim(num)
  .resize(32,32)
  .toFile("../../photo/out_r.png")
  .then((data) => console.log("data", data));
