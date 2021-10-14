const io = require("socket.io-client");
const wol = require("wol");

const sendWol = function (deviceInfo) {
  var deviceName = deviceInfo.deviceName;
  var mac = deviceInfo.wolMAC;
  wol.wake(mac, function (err, res) {
    console.log(res, err);
  });
};

const dataStruct = {
  event: "wol",
  dataStruct: {
    deviceName: "name",
    wolMAC: "00-00-00-00-00-00",
  },
};

const installWOLSocketIO = function (deviceCfg) {
  const socket = io(deviceCfg.aspherAddr);
  socket.on("connect", () => {
    console.log("connected on config:", deviceCfg);
    socket.emit("register", {
      deviceName: deviceCfg.deviceName,
      token: deviceCfg.token,
      authPass: deviceCfg.authPass,
      deviceType: deviceCfg.deviceType || "finger",
      character: deviceCfg.character || "finger",
      on: dataStruct,
    });
  });
  return socket;
};

const setupWOLSocketIO = function (socket) {
  socket.on("wol", (deviceInfo) => {
    sendWol(deviceInfo);
  });
};

if (require.main === module) {
  const deviceCfg = require("./config.json");
  installWOLSocketIO(deviceCfg);
} else {
  module.exports = {
    setupWOLSocketIO,
    dataStruct,
  };
}
