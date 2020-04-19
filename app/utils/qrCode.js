var QRCode = require("../node_modules/qrcode");

QRCode.toDataURL("I am a pony!", async (err, url) => {
  console.log(url);
  var base64Data = url.replace(/^data:image\/png;base64,/, "");

  require("fs").writeFile(
    "../../photo/out.png",
    base64Data,
    "base64",
    function (err) {
      console.log(err);
    }
  );
});

QRCode.toString("I am a pony!", { type: "terminal" }, function (err, url) {
  console.log(url);
});
