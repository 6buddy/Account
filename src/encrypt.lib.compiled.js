"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
  var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
  return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
  function verb(n) { return function (v) { return step([n, v]); }; }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0: case 1: t = op; break;
        case 4: _.label++; return { value: op[1], done: false };
        case 5: _.label++; y = op[1]; op = [0]; continue;
        case 7: op = _.ops.pop(); _.trys.pop(); continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
          if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
          if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
          if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
          if (t[2]) _.ops.pop();
          _.trys.pop(); continue;
      }
      op = body.call(thisArg, _);
    } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
    if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignDate = exports.RSAEncryptSign = exports.Authorize = exports.KeyFromText = exports.CheckPepper = exports.HashPepper = exports.HashSalt = exports.RandomOTP = exports.GetKeyList = exports.CloseCryptoSession = exports.CreateCryptoSession = exports.RSADecrypt = exports.RSAEncrypt = exports.RSAKeygen = exports.AESDecrypt = exports.AESEncrypt = exports.AESKeygen = exports.AESImport = exports.AESExport = void 0;
var js_sha256_1 = require("js-sha256");
var RSAKey = require("isomorphic-rsa");
var _crypto = (typeof window === "undefined" ? require("crypto").webcrypto : window.crypto);
var _atob = (typeof window === "undefined" ? require("base-64").decode : window.atob);
var _btoa = (typeof window === "undefined" ? require("base-64").encode : window.btoa);
function _arrayBufferToBase64(buffer) {
  var binary = "";
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return _btoa(binary);
}
function _base64ToArrayBuffer(base64) {
  var binary_string = _atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}
var AESExport = function (key) { return __awaiter(void 0, void 0, Promise, function () {
  var exportedKey;
  return __generator(this, function (_a) {
    switch (_a.label) {
      case 0:
        if (key.type === "private" || key.type === "public")
          throw new Error("Key is not symetric");
        return [4 /*yield*/, _crypto.subtle.exportKey("raw", key)];
      case 1:
        exportedKey = _a.sent();
        return [2 /*return*/, _arrayBufferToBase64(exportedKey)];
    }
  });
}); };
exports.AESExport = AESExport;
var AESImport = function (key) { return __awaiter(void 0, void 0, Promise, function () {
  var keyBytes;
  return __generator(this, function (_a) {
    keyBytes = _base64ToArrayBuffer(key);
    return [2 /*return*/, _crypto.subtle.importKey("raw", keyBytes, "AES-CBC", true, [
      "encrypt",
      "decrypt",
    ])];
  });
}); };
exports.AESImport = AESImport;
var AESKeygen = function () { return __awaiter(void 0, void 0, Promise, function () {
  var aesAlgorithmKeyGen, aesKey;
  return __generator(this, function (_a) {
    switch (_a.label) {
      case 0:
        aesAlgorithmKeyGen = {
          name: "AES-CBC",
          length: 256,
        };
        return [4 /*yield*/, _crypto.subtle.generateKey(aesAlgorithmKeyGen, true, [
          "encrypt",
          "decrypt",
        ])];
      case 1:
        aesKey = _a.sent();
        return [2 /*return*/, aesKey];
    }
  });
}); };
exports.AESKeygen = AESKeygen;
var AESEncrypt = function (plainText, aesKey) { return __awaiter(void 0, void 0, void 0, function () {
  var encoder, clearDataArrayBufferView, aesAlgorithmEncrypt, crypted;
  return __generator(this, function (_a) {
    switch (_a.label) {
      case 0:
        encoder = new TextEncoder();
        clearDataArrayBufferView = encoder.encode(plainText);
        aesAlgorithmEncrypt = {
          name: "AES-CBC",
          iv: _crypto.getRandomValues(new Uint8Array(16)),
        };
        return [4 /*yield*/, _crypto.subtle.encrypt(aesAlgorithmEncrypt, aesKey, clearDataArrayBufferView)];
      case 1:
        crypted = _a.sent();
        return [2 /*return*/, "".concat(_arrayBufferToBase64(aesAlgorithmEncrypt.iv), "|").concat(_arrayBufferToBase64(crypted))];
    }
  });
}); };
exports.AESEncrypt = AESEncrypt;
var AESDecrypt = function (cryptedText, aesKey) { return __awaiter(void 0, void 0, void 0, function () {
  var split, IV, cryptedBytes, aesAlgorithmDecrypt, plainBytes, encoder;
  return __generator(this, function (_a) {
    switch (_a.label) {
      case 0:
        split = cryptedText.split("|");
        if (split.length !== 2)
          throw new Error("Invalid input (bad structure)");
        IV = _base64ToArrayBuffer(split[0]);
        if (new Uint8Array(IV).length !== 16)
          throw new Error("Invalid initialization vector");
        cryptedBytes = _base64ToArrayBuffer(split[1]);
        aesAlgorithmDecrypt = {
          name: "AES-CBC",
          iv: IV,
        };
        return [4 /*yield*/, _crypto.subtle.decrypt(aesAlgorithmDecrypt, aesKey, cryptedBytes)];
      case 1:
        plainBytes = _a.sent();
        encoder = new TextDecoder();
        return [2 /*return*/, encoder.decode(plainBytes)];
    }
  });
}); };
exports.AESDecrypt = AESDecrypt;
var RSAKeygen = function () {
  var bits = 1024;
  var exponent = "10001"; // must be a string. This is hex string. decimal = 65537
  var rsa = new RSAKey();
  rsa.generate(bits, exponent);
  var pub = rsa.getPublicString(); // return json encoded string
  var pri = rsa.getPrivateString(); // return json encoded string
  return { public: pub, private: pri };
};
exports.RSAKeygen = RSAKeygen;
var RSAEncrypt = function (plainText, publicKey) { return __awaiter(void 0, void 0, Promise, function () {
  var rsa;
  return __generator(this, function (_a) {
    rsa = new RSAKey();
    rsa.setPublicString(publicKey);
    return [2 /*return*/, rsa.encrypt(plainText)];
  });
}); };
exports.RSAEncrypt = RSAEncrypt;
var RSADecrypt = function (cryptedText, privateKey) { return __awaiter(void 0, void 0, Promise, function () {
  var rsa;
  return __generator(this, function (_a) {
    rsa = new RSAKey();
    rsa.setPrivateString(privateKey);
    // decrypted == originText
    return [2 /*return*/, rsa.decrypt(cryptedText)];
  });
}); };
exports.RSADecrypt = RSADecrypt;
var CreateCryptoSession = function (privKey, permissions) { return __awaiter(void 0, void 0, void 0, function () {
  return __generator(this, function (_a) {
    switch (_a.label) {
      case 0:
        if (typeof window === "undefined")
          throw new Error("Creating a session cannot be done in a server context");
        (0, exports.CloseCryptoSession)();
        console.log("WRITING " + permissions.length + " KEYS");
        return [4 /*yield*/, Promise.all(permissions.map(function (userKey) { return __awaiter(void 0, void 0, void 0, function () {
          var clearKey;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0: return [4 /*yield*/, (0, exports.RSADecrypt)(userKey.key, privKey)];
              case 1:
                clearKey = _a.sent();
                window.localStorage.setItem("__key__".concat(userKey.ssoId), clearKey);
                return [2 /*return*/];
            }
          });
        }); }))];
      case 1:
        _a.sent();
        return [2 /*return*/];
    }
  });
}); };
exports.CreateCryptoSession = CreateCryptoSession;
var CloseCryptoSession = function () {
  var keys = Object.keys(window.localStorage);
  keys.forEach(function (k) {
    if (k.startsWith("__key__"))
      window.localStorage.removeItem(k);
  });
};
exports.CloseCryptoSession = CloseCryptoSession;
var GetKeyList = function () {
  var keys = Object.keys(window.localStorage);
  return keys.reduce(function (acc, curr) {
    if (curr.startsWith("__key__"))
      return __spreadArray(__spreadArray([], acc, true), [curr.slice(7)], false);
    else
      return acc;
  }, []);
};
exports.GetKeyList = GetKeyList;
var RandomOTP = function () { return Math.floor(100000 + Math.random() * 900000); };
exports.RandomOTP = RandomOTP;
var peppers = Array.from({ length: 255 }).map(function (_e, i) { return i.toString(); });
var HashSalt = function (str) { return (0, js_sha256_1.sha256)("".concat(str, "-CYPIOS")); };
exports.HashSalt = HashSalt;
var HashPepper = function (str) {
  return (0, js_sha256_1.sha256)("".concat(str).concat(peppers[Math.floor(Math.random() * peppers.length)]));
};
exports.HashPepper = HashPepper;
var CheckPepper = function (str, hash) {
  return peppers.some(function (p) { return (0, js_sha256_1.sha256)("".concat(str).concat(p)) === hash; });
};
exports.CheckPepper = CheckPepper;
var KeyFromText = function (str) {
  return _arrayBufferToBase64(new Uint8Array(js_sha256_1.sha256.array("".concat(str, "-CYPIOS")).slice(0, 256)));
};
exports.KeyFromText = KeyFromText;
var Authorize = function (userSsoId, proPublicKey) {
  var key = window.localStorage.getItem("__key__".concat(userSsoId));
  if (!key)
    throw new Error("No rights to authorize this patient");
  return (0, exports.RSAEncrypt)(key, proPublicKey);
};
exports.Authorize = Authorize;
var RSAEncryptSign = function (plainText, privateKey) { return __awaiter(void 0, void 0, Promise, function () {
  var rsa;
  return __generator(this, function (_a) {
    rsa = new RSAKey();
    rsa.setPrivateString(privateKey);
    return [2 /*return*/, rsa.encryptPrivate(plainText)];
  });
}); };
exports.RSAEncryptSign = RSAEncryptSign;
var SignDate = function (privateKey) {
  return (0, exports.RSAEncryptSign)(new Date().toISOString(), privateKey);
};
exports.SignDate = SignDate;
