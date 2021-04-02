'use strict';

var BLUEJAY_DEFAULTS = {
	'203': { // only adds damping mode
		RPM_POWER_SLOPE:            9,
		MOTOR_DIRECTION:            1,
		COMMUTATION_TIMING:         4,
		BEEP_STRENGTH:              40,
		BEACON_STRENGTH:            80,
		BEACON_DELAY:               4,
		DEMAG_COMPENSATION:         2,
		TEMPERATURE_PROTECTION:     7,
		BRAKE_ON_STOP:              0,
		LED_CONTROL:                0,

		STARTUP_POWER_MIN:          51,
		STARTUP_BEEP:               1,
		DITHERING:                  1,

		STARTUP_POWER_MAX:          25,
		DAMPING_MODE:               2,
		STARTUP_MELODY:             [2,58,4,32,52,66,13,0,69,45,13,0,52,66,13,0,78,39,211,0,69,45,208,25,52,25,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
	},
	'202': { // only adds damping mode
		RPM_POWER_SLOPE:            9,
		MOTOR_DIRECTION:            1,
		COMMUTATION_TIMING:         4,
		BEEP_STRENGTH:              40,
		BEACON_STRENGTH:            80,
		BEACON_DELAY:               4,
		DEMAG_COMPENSATION:         2,
		TEMPERATURE_PROTECTION:     7,
		BRAKE_ON_STOP:              0,
		LED_CONTROL:                0,

		STARTUP_POWER_MIN:          51,
		STARTUP_BEEP:               1,
		DITHERING:                  1,

		STARTUP_POWER_MAX:          25,
		DAMPING_MODE:               2,
	},
	'201': { // v0.10
		RPM_POWER_SLOPE:            9,
		MOTOR_DIRECTION:            1,
		COMMUTATION_TIMING:         4,
		BEEP_STRENGTH:              40,
		BEACON_STRENGTH:            80,
		BEACON_DELAY:               4,
		DEMAG_COMPENSATION:         2,
		TEMPERATURE_PROTECTION:     7,
		BRAKE_ON_STOP:              0,
		LED_CONTROL:                0,

		STARTUP_POWER_MIN:          51,
		STARTUP_BEEP:               1,
		DITHERING:                  1,

		STARTUP_POWER_MAX:          25,
	},
	'200': { // v0.9
		RPM_POWER_SLOPE:            9, // Backward: STARTUP_POWER
		MOTOR_DIRECTION:            1,
		COMMUTATION_TIMING:         4,
		BEEP_STRENGTH:              40,
		BEACON_STRENGTH:            80,
		BEACON_DELAY:               4,
		DEMAG_COMPENSATION:         2,
		TEMPERATURE_PROTECTION:     7,
		_LOW_RPM_POWER_PROTECTION:  1, // Backward
		BRAKE_ON_STOP:              0,
		LED_CONTROL:                0,

		STARTUP_POWER_MIN:          51, // Backward: STARTUP_BOOST
		STARTUP_BEEP:               1,
		DITHERING:                  1,
	},
	// BLHeli_S
	'33': {
		RPM_POWER_SLOPE:            9, // Backward: STARTUP_POWER
		MOTOR_DIRECTION:            1,
		_PROGRAMMING_BY_TX:         1, // Backward
		COMMUTATION_TIMING:         3,
		_PPM_MIN_THROTTLE:          37, // Backward
		_PPM_MAX_THROTTLE:          208, // Backward
		BEEP_STRENGTH:              40,
		BEACON_STRENGTH:            80,
		BEACON_DELAY:               4,
		DEMAG_COMPENSATION:         2,
		_PPM_CENTER_THROTTLE:       122, // Backward
		TEMPERATURE_PROTECTION:     7,
		_LOW_RPM_POWER_PROTECTION:  1, // Backward
		BRAKE_ON_STOP:              0,
		LED_CONTROL:                0
	},
};
