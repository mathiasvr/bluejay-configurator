'use strict';

var BLUEJAY_TYPES = {
    EFM8: 'EFM8'
};

var BLHELI_TYPES = {
    BLHELI_S_SILABS: 'BLHeli_S SiLabs',
    SILABS: 'SiLabs',
    ATMEL: 'Atmel'
};

var BLHELI_MODES = {
    MAIN:   0xA55A,
    TAIL:   0x5AA5,
    MULTI:  0x55AA
};

var BLHELI_SILABS_EEPROM_OFFSET         = 0x1A00
var BLHELI_SILABS_PAGE_SIZE             = 0x0200
var BLHELI_SILABS_BOOTLOADER_ADDRESS    = 0x1C00
var BLHELI_SILABS_BOOTLOADER_SIZE       = 0x0200
var BLHELI_SILABS_FLASH_SIZE            = 0x2000
var BLHELI_SILABS_ADDRESS_SPACE_SIZE    = BLHELI_SILABS_BOOTLOADER_ADDRESS

var BLHELI_LAYOUT_SIZE = 0xF0
var BLHELI_MIN_SUPPORTED_LAYOUT_REVISION = 0x13

var BLHELI_S_MIN_LAYOUT_REVISION = 0x20

// Bootloader was added to BLHeli only in 13.2, hence supporting lower versions if not practical
var BLHELI_LAYOUT = {
    MAIN_REVISION:              {   offset: 0x00, size: 1   },
    SUB_REVISION:               {   offset: 0x01, size: 1   },
    LAYOUT_REVISION:            {   offset: 0x02, size: 1   },
    __P_GAIN:                   {   offset: 0x03, size: 1   },
    STARTUP_POWER_MIN:          {   offset: 0x04, size: 1   }, // TODO: not final
    STARTUP_BEEP:               {   offset: 0x05, size: 1   },
    DITHERING:                  {   offset: 0x06, size: 1   },
    STARTUP_POWER_MAX:          {   offset: 0x07, size: 1   },
    __MOTOR_IDLE:               {   offset: 0x08, size: 1   },
    RPM_POWER_SLOPE:            {   offset: 0x09, size: 1   },
    __PWM_FREQUENCY:            {   offset: 0x0A, size: 1   },
    MOTOR_DIRECTION:            {   offset: 0x0B, size: 1   },
    __INPUT_PWM_POLARITY:       {   offset: 0x0C, size: 1   },
    MODE:                       {   offset: 0x0D, size: 2   },

    _PROGRAMMING_BY_TX:         {   offset: 0x0F, size: 1   },
    DAMPING_MODE:               {   offset: 0x10, size: 1   },
    __GOVERNOR_SETUP_TARGET:    {   offset: 0x11, size: 1   },
    __STARTUP_RPM:              {   offset: 0x12, size: 1   },
    __STARTUP_ACCELERATION:     {   offset: 0x13, size: 1   },
    __VOLT_COMP:                {   offset: 0x14, size: 1   },
    COMMUTATION_TIMING:         {   offset: 0x15, size: 1   },
    __DAMPING_FORCE:            {   offset: 0x16, size: 1   },
    __GOVERNOR_RANGE:           {   offset: 0x17, size: 1   },
    __STARTUP_METHOD:           {   offset: 0x18, size: 1   },
    _PPM_MIN_THROTTLE:          {   offset: 0x19, size: 1   },
    _PPM_MAX_THROTTLE:          {   offset: 0x1A, size: 1   },
    BEEP_STRENGTH:              {   offset: 0x1B, size: 1   },
    BEACON_STRENGTH:            {   offset: 0x1C, size: 1   },
    BEACON_DELAY:               {   offset: 0x1D, size: 1   },
    __THROTTLE_RATE:            {   offset: 0x1E, size: 1   },
    DEMAG_COMPENSATION:         {   offset: 0x1F, size: 1   },
    __BEC_VOLTAGE:              {   offset: 0x20, size: 1   },
    _PPM_CENTER_THROTTLE:       {   offset: 0x21, size: 1   },
    __SPOOLUP_TIME:             {   offset: 0x22, size: 1   },
    TEMPERATURE_PROTECTION:     {   offset: 0x23, size: 1   },
    _LOW_RPM_POWER_PROTECTION:  {   offset: 0x24, size: 1   },
    __PWM_INPUT:                {   offset: 0x25, size: 1   },
    __PWM_DITHER:               {   offset: 0x26, size: 1   },
    BRAKE_ON_STOP:              {   offset: 0x27, size: 1   },
    LED_CONTROL:                {   offset: 0x28, size: 1   },

    LAYOUT:                     {   offset: 0x40, size: 16   },
    MCU:                        {   offset: 0x50, size: 16   },
    NAME:                       {   offset: 0x60, size: 16   },

    STARTUP_MELODY:             {   offset: 0x70, size: 128  }
};

function blheliModeToString(mode) {
    for (var property in BLHELI_MODES) {
        if (BLHELI_MODES.hasOwnProperty(property)) {
            if (BLHELI_MODES[property] === mode) {
                return property;
            }
        }
    }
}

function blheliSettingsObject(settingsUint8Array, layout) {
    var object = {};

    for (var prop in layout) {
        if (layout.hasOwnProperty(prop)) {
            let setting = layout[prop];

            if (setting.size === 1) {
                object[prop] = settingsUint8Array[setting.offset];
            } else if (setting.size === 2) {
                object[prop] = (settingsUint8Array[setting.offset] << 8) | settingsUint8Array[setting.offset + 1];
            } else if (setting.size > 2 ) {
                if (prop === 'STARTUP_MELODY') {
                    object[prop] = settingsUint8Array.subarray(setting.offset).subarray(0, setting.size);
                } else {
                    object[prop] = String.fromCharCode.apply(undefined, settingsUint8Array.subarray(setting.offset).subarray(0, setting.size)).trim();
                }
            } else {
                throw new Error('Logic error')
            }
        }
    }

    return object;
}

function blheliSettingsArray(settingsObject, layout, layoutSize) {
    var array = new Uint8Array(layoutSize).fill(0xff);

    for (var prop in layout) {
        if (layout.hasOwnProperty(prop)) {
            let setting = layout[prop];

            if (setting.size === 1) {
                array[setting.offset] = settingsObject[prop];
            } else if (setting.size === 2) {
                array[setting.offset] = (settingsObject[prop] >> 8) & 0xff;
                array[setting.offset + 1] = (settingsObject[prop]) & 0xff;
            } else if (setting.size > 2) {
                if (prop  === 'STARTUP_MELODY') {
                    for (let i = 0, len = settingsObject[prop].length; i < setting.size; ++i) {
                        array[setting.offset + i] = i < len ? settingsObject[prop][i] % 255 : 0;
                    }
                } else {
                    for (let i = 0, len = settingsObject[prop].length; i < setting.size; ++i) {
                        array[setting.offset + i] = i < len ? settingsObject[prop].charCodeAt(i) : ' '.charCodeAt(0);
                    }
                }
            } else {
                throw new Error('Logic error')
            }
        }
    }

    return array;
}
