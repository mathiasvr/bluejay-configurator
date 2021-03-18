'use strict';


// unstable layout and settings during beta
// todo: remove multi
var BLUEJAY_SETTINGS_DESCRIPTIONS = {

    '203': { //  201 With Bluejay startup tunes
        MULTI: {
            base:
            [
                {
                    name: 'STARTUP_POWER_MIN', type: 'number', label: '_Minimum Startup Power (Boost)',
                    min: 1000, max: 1125, step: 5, displayFactor: 1000 / 2047, displayOffset: 1000, displayPrecision: 0
                },
                {
                    name: 'STARTUP_POWER_MAX', type: 'number', label: '_Maximum Startup Power (Protection)',
                    // Note: The real displayFactor is 1000 / 255 but 250 makes the slider nicer to work with minimal loss of accuracy
                    min: 1004, max: 1300, step: 4, displayFactor: 1000 / 250, displayOffset: 1000, displayPrecision: 0
                },
                {
                    name: 'TEMPERATURE_PROTECTION', type: 'enum', label: 'escTemperatureProtection',
                    options: [
                        { value: '0', label: 'Disabled' }, { value: '1', label: '80 C' },
                        { value: '2', label: '90 C' }, { value: '3', label: '100 C' },
                        { value: '4', label: '110 C' }, { value: '5', label: '120 C' },
                        { value: '6', label: '130 C' }, { value: '7', label: '140 C' }
                    ]
                },
                {
                    name: 'COMMUTATION_TIMING', type: 'enum', label: 'escMotorTiming',
                    options: [
                        { value: '1', label: '0° (Low)' }, { value: '2', label: '7.5° (MediumLow)' },
                        { value: '3', label: '15° (Medium)' }, { value: '4', label: '22.5° (MediumHigh)' },
                        { value: '5', label: '30° (High)' }
                    ]
                },
                {
                    name: 'DEMAG_COMPENSATION', type: 'enum', label: 'escDemagCompensation',
                    options: [
                        { value: '1', label: 'Off' }, { value: '2', label: 'Low' },
                        { value: '3', label: 'High' }
                    ]
                },
                {
                    name: 'RPM_POWER_SLOPE', type: 'enum', options: [
                        { value:  '1', label: '1x (More protection)' },
                        { value:  '2', label: '2x' }, { value: '3', label: '3x' },
                        { value:  '4', label: '4x' }, { value: '5', label: '5x' },
                        { value:  '6', label: '6x' },
                        { value:  '7', label: '7x' }, { value: '8', label:  '8x' },
                        { value:  '9', label: '9x' }, { value: '10', label: '10x' },
                        { value: '11', label: '11x' }, { value: '12', label: '12x' },
                        { value: '13', label: '13x (Less protection)' }, { value: '0', label: 'Off' }
                    ],
                    label: '_RPM Power Protection (Rampup)'
                },
                {
                    name: 'BEEP_STRENGTH', type: 'number', min: 0, max: 255, step: 1, label: 'escBeepStrength'
                },
                {
                    name: 'BEACON_STRENGTH', type: 'number', min: 0, max: 255, step: 1, label: 'escBeaconStrength'
                },
                {
                    name: 'BEACON_DELAY', type: 'enum', label: 'escBeaconDelay',
                    options: [
                        { value: '1', label: '1 minute' }, { value: '2', label: '2 minutes' },
                        { value: '3', label: '5 minutes' }, { value: '4', label: '10 minutes' },
                        { value: '5', label: 'Infinite' }
                    ]
                },
                {
                    name: 'STARTUP_BEEP', type: 'bool', label: 'escStartupBeep'
                },
                {
                    name: 'DITHERING', type: 'bool', label: 'escDithering'
                },
                {
                    name: 'BRAKE_ON_STOP', type: 'bool', label: 'escBrakeOnStop'
                }
            ]
        }
    },

    '202': { //  only adds damping mode
        MULTI: {
            base:
            [
                {
                    name: 'STARTUP_POWER_MIN', type: 'number', label: '_Minimum Startup Power (Boost)',
                    min: 1000, max: 1125, step: 5, displayFactor: 1000 / 2047, displayOffset: 1000, displayPrecision: 0
                },
                {
                    name: 'STARTUP_POWER_MAX', type: 'number', label: '_Maximum Startup Power (Protection)',
                    // Note: The real displayFactor is 1000 / 255 but 250 makes the slider nicer to work with minimal loss of accuracy
                    min: 1004, max: 1300, step: 4, displayFactor: 1000 / 250, displayOffset: 1000, displayPrecision: 0
                },
                {
                    name: 'TEMPERATURE_PROTECTION', type: 'enum', label: 'escTemperatureProtection',
                    options: [
                        { value: '0', label: 'Disabled' }, { value: '1', label: '80 C' },
                        { value: '2', label: '90 C' }, { value: '3', label: '100 C' },
                        { value: '4', label: '110 C' }, { value: '5', label: '120 C' },
                        { value: '6', label: '130 C' }, { value: '7', label: '140 C' }
                    ]
                },
                {
                    name: 'COMMUTATION_TIMING', type: 'enum', label: 'escMotorTiming',
                    options: [
                        { value: '1', label: '0° (Low)' }, { value: '2', label: '7.5° (MediumLow)' },
                        { value: '3', label: '15° (Medium)' }, { value: '4', label: '22.5° (MediumHigh)' },
                        { value: '5', label: '30° (High)' }
                    ]
                },
                {
                    name: 'DEMAG_COMPENSATION', type: 'enum', label: 'escDemagCompensation',
                    options: [
                        { value: '1', label: 'Off' }, { value: '2', label: 'Low' },
                        { value: '3', label: 'High' }
                    ]
                },
                {
                    name: 'RPM_POWER_SLOPE', type: 'enum', options: [
                        { value:  '1', label: '1x (More protection)' },
                        { value:  '2', label: '2x' }, { value: '3', label: '3x' },
                        { value:  '4', label: '4x' }, { value: '5', label: '5x' },
                        { value:  '6', label: '6x' },
                        { value:  '7', label: '7x' }, { value: '8', label:  '8x' },
                        { value:  '9', label: '9x' }, { value: '10', label: '10x' },
                        { value: '11', label: '11x' }, { value: '12', label: '12x' },
                        { value: '13', label: '13x (Less protection)' }, { value: '0', label: 'Off' }
                    ],
                    label: '_RPM Power Protection (Rampup)'
                },
                {
                    name: 'BEEP_STRENGTH', type: 'number', min: 0, max: 255, step: 1, label: 'escBeepStrength'
                },
                {
                    name: 'BEACON_STRENGTH', type: 'number', min: 0, max: 255, step: 1, label: 'escBeaconStrength'
                },
                {
                    name: 'BEACON_DELAY', type: 'enum', label: 'escBeaconDelay',
                    options: [
                        { value: '1', label: '1 minute' }, { value: '2', label: '2 minutes' },
                        { value: '3', label: '5 minutes' }, { value: '4', label: '10 minutes' },
                        { value: '5', label: 'Infinite' }
                    ]
                },
                {
                    name: 'STARTUP_BEEP', type: 'bool', label: 'escStartupBeep'
                },
                {
                    name: 'DITHERING', type: 'bool', label: 'escDithering'
                },
                {
                    name: 'BRAKE_ON_STOP', type: 'bool', label: 'escBrakeOnStop'
                },
                {
                    name: 'DAMPING_MODE', type: 'enum', label: '_Damping mode (Complementary PWM)',
                    options: [
                        { value: '0', label: 'Off' },
                        { value: '1', label: 'Not during startup' },
                        { value: '2', label: 'On' }
                    ]
                }
            ]
        }
    },

    '201': { // v0.10
        MULTI: {
            base:
            [
                {
                    name: 'STARTUP_POWER_MIN', type: 'number', label: '_Minimum Startup Power (Boost)',
                    min: 1000, max: 1125, step: 5, displayFactor: 1000 / 2047, displayOffset: 1000, displayPrecision: 0
                },
                {
                    name: 'STARTUP_POWER_MAX', type: 'number', label: '_Maximum Startup Power (Protection)',
                    // Note: The real displayFactor is 1000 / 255 but 250 makes the slider nicer to work with minimal loss of accuracy
                    min: 1004, max: 1300, step: 4, displayFactor: 1000 / 250, displayOffset: 1000, displayPrecision: 0
                },
                {
                    name: 'TEMPERATURE_PROTECTION', type: 'enum', label: 'escTemperatureProtection',
                    options: [
                        { value: '0', label: 'Disabled' }, { value: '1', label: '80 C' },
                        { value: '2', label: '90 C' }, { value: '3', label: '100 C' },
                        { value: '4', label: '110 C' }, { value: '5', label: '120 C' },
                        { value: '6', label: '130 C' }, { value: '7', label: '140 C' }
                    ]
                },
                {
                    name: 'COMMUTATION_TIMING', type: 'enum', label: 'escMotorTiming',
                    options: [
                        { value: '1', label: '0° (Low)' }, { value: '2', label: '7.5° (MediumLow)' },
                        { value: '3', label: '15° (Medium)' }, { value: '4', label: '22.5° (MediumHigh)' },
                        { value: '5', label: '30° (High)' }
                    ]
                },
                {
                    name: 'DEMAG_COMPENSATION', type: 'enum', label: 'escDemagCompensation',
                    options: [
                        { value: '1', label: 'Off' }, { value: '2', label: 'Low' },
                        { value: '3', label: 'High' }
                    ]
                },
                {
                    name: 'RPM_POWER_SLOPE', type: 'enum', options: [
                        { value:  '1', label: '1x (More protection)' },
                        { value:  '2', label: '2x' }, { value: '3', label: '3x' },
                        { value:  '4', label: '4x' }, { value: '5', label: '5x' },
                        { value:  '6', label: '6x' },
                        { value:  '7', label: '7x' }, { value: '8', label:  '8x' },
                        { value:  '9', label: '9x' }, { value: '10', label: '10x' },
                        { value: '11', label: '11x' }, { value: '12', label: '12x' },
                        { value: '13', label: '13x (Less protection)' }, { value: '0', label: 'Off' }
                    ],
                    label: '_RPM Power Protection (Rampup)'
                },
                {
                    name: 'BEEP_STRENGTH', type: 'number', min: 0, max: 255, step: 1, label: 'escBeepStrength'
                },
                {
                    name: 'BEACON_STRENGTH', type: 'number', min: 0, max: 255, step: 1, label: 'escBeaconStrength'
                },
                {
                    name: 'BEACON_DELAY', type: 'enum', label: 'escBeaconDelay',
                    options: [
                        { value: '1', label: '1 minute' }, { value: '2', label: '2 minutes' },
                        { value: '3', label: '5 minutes' }, { value: '4', label: '10 minutes' },
                        { value: '5', label: 'Infinite' }
                    ]
                },
                {
                    name: 'STARTUP_BEEP', type: 'bool', label: 'escStartupBeep'
                },
                {
                    name: 'DITHERING', type: 'bool', label: 'escDithering'
                },
                {
                    name: 'BRAKE_ON_STOP', type: 'bool', label: 'escBrakeOnStop'
                }
            ]
        }
    },


    '200': { // v0.9
        MULTI: {
            base:
            [
                {
                    name: 'RPM_POWER_SLOPE', type: 'enum', options: [
                        { value:  '1', label: '0.5% (0.031)' },
                        // { value:  '2', label: '0.8% (0.047)' }, { value:  '3', label: '1.2% (0.063)' },
                        // { value:  '4', label: '1.6% (0.094)' }, { value:  '5', label: '2.5% (0.125)' },
                        // { value:  '6', label: '3.5% (0.188)' },
                        { value:  '7', label:   '5%  (0.25)' }, { value:  '8', label:   '7%  (0.38)' },
                        { value:  '9', label:  '10%  (0.50)' }, { value: '10', label:  '15%  (0.75)' },
                        { value: '11', label:  '20%  (1.00)' }, { value: '12', label:  '24%  (1.25)' },
                        { value: '13', label:  '29%  (1.50)' }
                    ],
                    label: '_Rampup Start Power'
                },
                {
                    name: 'STARTUP_POWER_MIN', type: 'number', label: '_Minimum Startup Power (Boost)', 
                    min: 1000, max: 1125, step: 5, displayFactor: 1000 / 2047, displayOffset: 1000, displayPrecision: 0
                },
                {
                    name: 'TEMPERATURE_PROTECTION', type: 'enum', label: 'escTemperatureProtection',
                    options: [
                        { value: '0', label: 'Disabled' }, { value: '1', label: '80 C' },
                        { value: '2', label: '90 C' }, { value: '3', label: '100 C' },
                        { value: '4', label: '110 C' }, { value: '5', label: '120 C' },
                        { value: '6', label: '130 C' }, { value: '7', label: '140 C' }
                    ]
                },
                {
                    name: '_LOW_RPM_POWER_PROTECTION', type: 'bool', label: 'escLowRPMPowerProtection'
                },
                {
                    name: 'BRAKE_ON_STOP', type: 'bool', label: 'escBrakeOnStop'
                },
                {
                    name: 'DEMAG_COMPENSATION', type: 'enum', label: 'escDemagCompensation',
                    options: [
                        { value: '1', label: 'Off' }, { value: '2', label: 'Low' },
                        { value: '3', label: 'High' }
                    ]
                },
                {
                    name: 'COMMUTATION_TIMING', type: 'enum', label: 'escMotorTiming',
                    options: [
                        { value: '1', label: '0° (Low)' }, { value: '2', label: '7.5° (MediumLow)' },
                        { value: '3', label: '15° (Medium)' }, { value: '4', label: '22.5° (MediumHigh)' },
                        { value: '5', label: '30° (High)' }
                    ]
                },
                {
                    name: 'BEEP_STRENGTH', type: 'number', min: 0, max: 255, step: 1, label: 'escBeepStrength'
                },
                {
                    name: 'BEACON_STRENGTH', type: 'number', min: 0, max: 255, step: 1, label: 'escBeaconStrength'
                },
                {
                    name: 'BEACON_DELAY', type: 'enum', label: 'escBeaconDelay',
                    options: [
                        { value: '1', label: '1 minute' }, { value: '2', label: '2 minutes' },
                        { value: '3', label: '5 minutes' }, { value: '4', label: '10 minutes' },
                        { value: '5', label: 'Infinite' }
                    ]
                },
                {
                    name: 'STARTUP_BEEP', type: 'bool', label: 'escStartupBeep'
                },
                {
                    name: 'DITHERING', type: 'bool', label: 'escDithering'
                },
            ]
        }
    },


    // BLHeli_S
    '33': {
        MULTI: {
            base: [
                {
                    name: '_PROGRAMMING_BY_TX', type: 'bool', label: 'escProgrammingByTX'
                },
                {
                    name: 'RPM_POWER_SLOPE', type: 'enum', options: [
                        { value: '1', label: '0.031' }, { value: '2', label: '0.047' },
                        { value: '3', label: '0.063' }, { value: '4', label: '0.094' },
                        { value: '5', label: '0.125' }, { value: '6', label: '0.188' },
                        { value: '7', label: '0.25' }, { value: '8', label: '0.38' },
                        { value: '9', label: '0.50' }, { value: '10', label: '0.75' },
                        { value: '11', label: '1.00' }, { value: '12', label: '1.25' },
                        { value: '13', label: '1.50' }
                    ],
                    label: 'escStartupPower'
                },
                {
                    name: 'TEMPERATURE_PROTECTION', type: 'enum', label: 'escTemperatureProtection',
                    options: [
                        { value: '0', label: 'Disabled' }, { value: '1', label: '80C' },
                        { value: '2', label: '90 C' }, { value: '3', label: '100 C' },
                        { value: '4', label: '110 C' }, { value: '5', label: '120 C' },
                        { value: '6', label: '130 C' }, { value: '7', label: '140 C' }
                    ]
                },
                {
                    name: '_LOW_RPM_POWER_PROTECTION', type: 'bool', label: 'escLowRPMPowerProtection'
                },
                {
                    name: 'BRAKE_ON_STOP', type: 'bool', label: 'escBrakeOnStop'
                },
                {
                    name: 'DEMAG_COMPENSATION', type: 'enum', label: 'escDemagCompensation',
                    options: [
                        { value: '1', label: 'Off' }, { value: '2', label: 'Low' },
                        { value: '3', label: 'High' }
                    ]
                },
                {
                    name: 'COMMUTATION_TIMING', type: 'enum', label: 'escMotorTiming',
                    options: [
                        { value: '1', label: 'Low' }, { value: '2', label: 'MediumLow' },
                        { value: '3', label: 'Medium' }, { value: '4', label: 'MediumHigh' },
                        { value: '5', label: 'High' }
                    ]
                },
                {
                    name: 'BEEP_STRENGTH', type: 'number', min: 1, max: 255, step: 1, label: 'escBeepStrength'
                },
                {
                    name: 'BEACON_STRENGTH', type: 'number', min: 1, max: 255, step: 1, label: 'escBeaconStrength'
                },
                {
                    name: 'BEACON_DELAY', type: 'enum', label: 'escBeaconDelay',
                    options: [
                        { value: '1', label: '1 minute' }, { value: '2', label: '2 minutes' },
                        { value: '3', label: '5 minutes' }, { value: '4', label: '10 minutes' },
                        { value: '5', label: 'Infinite' }
                    ]
                }
            ]
        },
        // There is no MAIN nor MULTI mode in BLHeli_S, added for completeness
        MAIN: {
            base: []
        },
        TAIL: {
            base: []
        }
    },
};

var BLUEJAY_INDIVIDUAL_SETTINGS = [
    {
        name: 'MOTOR_DIRECTION', type: 'enum', label: 'escMotorDirection',
        options: [
            { value: '1', label: 'Normal' }, { value: '2', label: 'Reversed' },
            { value: '3', label: 'Bidirectional' }, { value: '4', label: 'Bidirectional Reversed' }
        ]
    },
    {
        name: 'STARTUP_MELODY', type: 'melody', label: 'startupMelody',
        value: [53,66,5,0,77,45,5,0,53,66,5,0,92,38,200,0,77,45,140,25,140,25,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        melodyLength: 254
    }
];

var BLUEJAY_INDIVIDUAL_SETTINGS_200 = [
    {
        name: 'MOTOR_DIRECTION', type: 'enum', label: 'escMotorDirection',
        options: [
            { value: '1', label: 'Normal' }, { value: '2', label: 'Reversed' },
            { value: '3', label: 'Bidirectional' }, { value: '4', label: 'Bidirectional Reversed' }
        ]
    },
];

var BLHELI_S_INDIVIDUAL_SETTINGS_BACKWARD = [
    {
        name: 'MOTOR_DIRECTION', type: 'enum', label: 'escMotorDirection',
        options: [
            { value: '1', label: 'Normal' }, { value: '2', label: 'Reversed' },
            { value: '3', label: 'Bidirectional' }, { value: '4', label: 'Bidirectional Reversed' }
        ]
    },
    {
        name: '_PPM_MIN_THROTTLE', type: 'number', min: 1000, max: 1500, step: 4, label: 'escPPMMinThrottle',
        offset: 1000, factor: 4, suffix: ' μs'
    },
    {
        name: '_PPM_MAX_THROTTLE', type: 'number', min: 1504, max: 2020, step: 4, label: 'escPPMMaxThrottle',
        offset: 1000, factor: 4, suffix: ' μs'
    },
    {
        name: '_PPM_CENTER_THROTTLE', type: 'number', min: 1000, max: 2020, step: 4, label: 'escPPMCenterThrottle',
        offset: 1000, factor: 4, suffix: ' μs',
        visibleIf: settings => [ 3, 4 ].includes(settings.MOTOR_DIRECTION)
    }
]

var BLUEJAY_INDIVIDUAL_SETTINGS_DESCRIPTIONS = {
    '203': { base: BLUEJAY_INDIVIDUAL_SETTINGS },
    '202': { base: BLUEJAY_INDIVIDUAL_SETTINGS_200 },
    '201': { base: BLUEJAY_INDIVIDUAL_SETTINGS_200 },
    '200': { base: BLUEJAY_INDIVIDUAL_SETTINGS_200 },
    '33': { base: BLHELI_S_INDIVIDUAL_SETTINGS_BACKWARD }
};


// @todo reconsinder, I don't like coupling between UI and underlying settings and versioning
function bluejayCanMigrate(settingName, fromSettings, toSettings) {
    if (fromSettings.MODE === BLHELI_MODES.MULTI && toSettings.MODE === BLHELI_MODES.MULTI) {
        var fromCommons = BLUEJAY_SETTINGS_DESCRIPTIONS[fromSettings.LAYOUT_REVISION].MULTI.base,
            toCommons = BLUEJAY_SETTINGS_DESCRIPTIONS[toSettings.LAYOUT_REVISION].MULTI.base;

        var fromCommon = fromCommons.find(setting => setting.name === settingName),
            toCommon = toCommons.find(setting => setting.name === settingName);

        if (fromCommon && toCommon) {
            return true;
        }

        var fromIndividuals = BLUEJAY_INDIVIDUAL_SETTINGS_DESCRIPTIONS[fromSettings.LAYOUT_REVISION].base,
            toIndividuals = BLUEJAY_INDIVIDUAL_SETTINGS_DESCRIPTIONS[toSettings.LAYOUT_REVISION].base;

        var fromIndividual = fromIndividuals.find(setting => setting.name === settingName),
            toIndividual = toIndividuals.find(setting => setting.name === settingName);

        if (fromIndividual && toIndividual) {
            return true;
        }
    }

    return false;
}
