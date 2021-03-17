var BLUEJAY_ESCS_REMOTE = 'https://raw.githubusercontent.com/mathiasvr/bluejay-configurator/bluejay/js/bluejay_escs.json';
var BLUEJAY_ESCS_LOCAL = './js/bluejay_escs.json';
var BLUEJAY_ESCS_KEY = 'escs';

function findMCU(signature, MCUList) {
    return MCUList.find(MCU => parseInt(MCU.signature) === signature);
}
