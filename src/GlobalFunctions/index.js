var CryptoJS = require("crypto-js");

const secretKey = "3n$%kff23$3@@342fddfs";

const GlobalFunctions = {
  reloadPage() {
    setTimeout(() => {
      window.location.reload(false);
    }, 500);
  },
  encrypt(data) {
    var ciphertext = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      secretKey
    ).toString();

    localStorage.setItem("local", ciphertext);
  },
  decrypt(data) {
    if (localStorage.getItem("local")) {
      var bytes = CryptoJS.AES.decrypt(
        localStorage.getItem("local"),
        secretKey
      );
      var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      return decryptedData[data] || "";
    }

    return "";
  },
};

export { GlobalFunctions };
