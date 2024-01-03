import { TimeFormat, UserFields } from 'ontime-types';

import { ParamField } from './types';

const getTimeOption = (timeFormat: TimeFormat): ParamField => ({
  id: 'format',
  title: '12  / 24 hour timer',
  description: 'Whether to show the time in 12 or 24 hour mode. Overrides the global setting from preferences',
  type: 'option',
  values: { '12': '12 hour AM/PM', '24': '24 hour' },
  defaultValue: timeFormat,
});

const hideClockSeconds: ParamField = {
  id: 'hideClockSeconds',
  title: 'Hide seconds in clocks',
  description: 'Whether to hide seconds in auxiliar time fields (not the running timer)',
  type: 'boolean',
  defaultValue: false,
};

const hideTimerSeconds: ParamField = {
  id: 'hideTimerSeconds',
  title: 'Hide seconds in timer',
  description: 'Whether to hide seconds in the running timer',
  type: 'boolean',
  defaultValue: false,
};

export const getClockOptions = (timeFormat: TimeFormat): ParamField[] => [
  getTimeOption(timeFormat),
  {
    id: 'key',
    title: 'Key Colour',
    description: 'Background colour in hexadecimal',
    prefix: '#',
    type: 'string',
    placeholder: '00000000 (default)',
  },
  {
    id: 'text',
    title: 'Text Colour',
    description: 'Text colour in hexadecimal',
    prefix: '#',
    type: 'string',
    placeholder: 'fffff (default)',
  },
  {
    id: 'textbg',
    title: 'Text Background',
    description: 'Colour of text background in hexadecimal',
    prefix: '#',
    type: 'string',
    placeholder: '00000000 (default)',
  },
  {
    id: 'font',
    title: 'Font',
    description: 'Font family, will use the fonts available in the system',
    type: 'string',
    placeholder: 'Arial Black (default)',
  },
  {
    id: 'size',
    title: 'Text Size',
    description: 'Scales the current style (0.5 = 50% 1 = 100% 2 = 200%)',
    type: 'number',
    placeholder: '1 (default)',
  },
  {
    id: 'alignx',
    title: 'Align Horizontal',
    description: 'Moves the horizontally in page to start = left | center | end = right',
    type: 'option',
    values: { start: 'Start', center: 'Center', end: 'End' },
    defaultValue: 'center',
  },
  {
    id: 'offsetx',
    title: 'Offset Horizontal',
    description: 'Offsets the timer horizontal position by a given amount in pixels',
    type: 'number',
    placeholder: '0 (default)',
  },
  {
    id: 'aligny',
    title: 'Align Vertical',
    description: 'Moves the vertically in page to start = left | center | end = right',
    type: 'option',
    values: { start: 'Start', center: 'Center', end: 'End' },
    defaultValue: 'center',
  },
  {
    id: 'offsety',
    title: 'Offset Vertical',
    description: 'Offsets the timer vertical position by a given amount in pixels',
    type: 'number',
    placeholder: '0 (default)',
  },
];

export const getTimerOptions = (timeFormat: TimeFormat): ParamField[] => [
  getTimeOption(timeFormat),
  hideTimerSeconds,
  hideClockSeconds,
  {
    id: 'hideClock',
    title: 'Hide Time Now',
    description: 'Hides the Time Now field',
    type: 'boolean',
    defaultValue: false,
  },
  {
    id: 'hideCards',
    title: 'Hide Cards',
    description: 'Hides the Now and Next cards',
    type: 'boolean',
    defaultValue: false,
  },
  {
    id: 'hideProgress',
    title: 'Hide progress bar',
    description: 'Hides the progress bar',
    type: 'boolean',
    defaultValue: false,
  },
  {
    id: 'hideMessage',
    title: 'Hide Presenter Message',
    description: 'Prevents the screen from displaying messages from the presenter',
    type: 'boolean',
    defaultValue: false,
  },
  {
    id: 'hideExternal',
    title: 'Hide External',
    description: 'Prevents the screen from displaying the external field',
    type: 'boolean',
    defaultValue: false,
  },
];

export const MINIMAL_TIMER_OPTIONS: ParamField[] = [
  hideTimerSeconds,
  {
    id: 'key',
    title: 'Key Colour',
    description: 'Background colour in hexadecimal',
    prefix: '#',
    type: 'string',
    placeholder: '00000000 (default)',
  },
  {
    id: 'text',
    title: 'Text Colour',
    description: 'Text colour in hexadecimal',
    prefix: '#',
    type: 'string',
    placeholder: 'fffff (default)',
  },
  {
    id: 'textbg',
    title: 'Text Background',
    description: 'Colour of text background in hexadecimal',
    prefix: '#',
    type: 'string',
    placeholder: '00000000 (default)',
  },
  {
    id: 'font',
    title: 'Font',
    description: 'Font family, will use the fonts available in the system',
    type: 'string',
    placeholder: 'Arial Black (default)',
  },
  {
    id: 'size',
    title: 'Text Size',
    description: 'Scales the current style (0.5 = 50% 1 = 100% 2 = 200%)',
    type: 'number',
    placeholder: '1 (default)',
  },
  {
    id: 'alignx',
    title: 'Align Horizontal',
    description: 'Moves the horizontally in page to start = left | center | end = right',
    type: 'option',
    values: { start: 'Start', center: 'Center', end: 'End' },
    defaultValue: 'center',
  },
  {
    id: 'offsetx',
    title: 'Offset Horizontal',
    description: 'Offsets the timer horizontal position by a given amount in pixels',
    type: 'number',
    placeholder: '0 (default)',
  },
  {
    id: 'aligny',
    title: 'Align Vertical',
    description: 'Moves the vertically in page to start = left | center | end = right',
    type: 'option',
    values: { start: 'Start', center: 'Center', end: 'End' },
    defaultValue: 'center',
  },
  {
    id: 'offsety',
    title: 'Offset Vertical',
    description: 'Offsets the timer vertical position by a given amount in pixels',
    type: 'number',
    placeholder: '0 (default)',
  },
  {
    id: 'hideovertime',
    title: 'Hide Overtime',
    description: 'Whether to suppress overtime styles (red borders and red text)',
    type: 'boolean',
    defaultValue: false,
  },
  {
    id: 'hidemessages',
    title: 'Hide Message Overlay',
    description: 'Whether to hide the overlay from showing timer screen messages',
    type: 'boolean',
    defaultValue: false,
  },
  {
    id: 'hideendmessage',
    title: 'Hide End Message',
    description: 'Whether to hide end message and continue showing the clock if timer is in overtime',
    type: 'boolean',
    defaultValue: false,
  },
];

export const LOWER_THIRDS_OPTIONS: ParamField[] = [
  {
    id: 'size',
    title: 'Size',
    description: 'Scales the current style (0.5 = 50% 1 = 100% 2 = 200%)',
    type: 'number',
    placeholder: '1 (default)',
  },
  {
    id: 'transition',
    title: 'Transition',
    description: 'Transition in time in seconds (default 3)',
    type: 'number',
    placeholder: '3 (default)',
  },
  {
    id: 'text',
    title: 'Text Colour',
    description: 'Text colour in hexadecimal',
    prefix: '#',
    type: 'string',
    placeholder: 'fffffa (default)',
  },
  {
    id: 'bg',
    title: 'Text Background',
    description: 'Text background colour in hexadecimal',
    prefix: '#',
    type: 'string',
    placeholder: '00000033 (default)',
  },
  {
    id: 'key',
    title: 'Key Colour',
    description: 'Screen background colour in hexadecimal',
    prefix: '#',
    type: 'string',
    placeholder: '00000033 (default)',
  },
  {
    id: 'fadeout',
    title: 'Fadeout',
    description: 'Time (in seconds) the lower third displays before fading out',
    type: 'number',
    placeholder: '3 (default)',
  },
];

export const LOWER_THIRD_OPTIONS: ParamField[] = [
  {
    id: 'trigger',
    title: 'Animation Trigger',
    description: '',
    type: 'option',
    values: {
      event: 'Event Load',
      manual: 'Manual',
    },
  },
  {
    id: 'upper-src',
    title: 'Upper Text',
    description: '',
    type: 'option',
    values: {
      title: 'Title',
      subtitle: 'Subtitle',
      presenter: 'Presenter',
      lowerMsg: 'LowerThrid Message',
    },
  },
  {
    id: 'lower-src',
    title: 'Lower Text',
    description: 'Select the text source for the lower element',
    type: 'option',
    values: {
      subtitle: 'Subtitle',
      title: 'Title',
      presenter: 'Presenter',
      lowerMsg: 'LowerThrid Message',
      hide: 'Hide',
    },
  },
  {
    id: 'upper-colour',
    title: 'Upper Text Colour',
    description: 'Upper text colour in hexadecimal',
    prefix: '#',
    type: 'string',
    placeholder: '0000ff (default)',
  },
  {
    id: 'lower-colour',
    title: 'Lower Text Colour',
    description: 'Lower text colour in hexadecimal',
    prefix: '#',
    type: 'string',
    placeholder: '0000ff (default)',
  },
  {
    id: 'upper-bg',
    title: 'Upper Background Colour',
    description: 'Upper text background colour in hexadecimal',
    prefix: '#',
    type: 'string',
    placeholder: '00000000 (default)',
  },
  {
    id: 'lower-bg',
    title: 'Lower Background Colour',
    description: 'Lower text background colour in hexadecimal',
    prefix: '#',
    type: 'string',
    placeholder: '00000000 (default)',
  },
  {
    id: 'upper-size',
    title: 'Upper Text Size',
    description: 'Font size of the upper text',
    type: 'string',
    placeholder: '4vh',
  },
  {
    id: 'lower-size',
    title: 'Lower Text Size',
    description: 'Font size of the lower text',
    type: 'string',
    placeholder: '3vh',
  },
  {
    id: 'width',
    title: 'Minimum Width',
    description: 'Minimum Width of the element',
    type: 'number',
    prefix: '%',
    placeholder: '45 (default)',
  },
  {
    id: 'transition',
    title: 'Transition',
    description: 'Transition in time in seconds (default 3)',
    type: 'number',
    placeholder: '3 (default)',
  },
  {
    id: 'delay',
    title: 'Delay',
    description: 'Delay between transition in and out in seconds (default 3)',
    type: 'number',
    placeholder: '3 (default)',
  },
  {
    id: 'key',
    title: 'Key Colour',
    description: 'Colour of the background',
    prefix: '#',
    type: 'string',
    placeholder: '00000000 (default)',
  },
  {
    id: 'line-colour',
    title: 'Line Colour',
    description: 'Colour of the line',
    prefix: '#',
    type: 'string',
    placeholder: 'ff0000ff (default)',
  },
];

export const getBackstageOptions = (timeFormat: TimeFormat): ParamField[] => [
  getTimeOption(timeFormat),
  hideClockSeconds,
  {
    id: 'hidePast',
    title: 'Hide past events',
    description: 'Scheduler will only show upcoming events',
    type: 'boolean',
    defaultValue: false,
  },
  {
    id: 'stopCycle',
    title: 'Stop cycling through event pages',
    description: 'Schedule will not auto-cycle through events',
    type: 'boolean',
    defaultValue: false,
  },
  {
    id: 'eventsPerPage',
    title: 'Events per page',
    description: 'Sets the number of events on the page, can cause overlow',
    type: 'number',
    placeholder: '7 (default)',
  },
];

export const getPublicOptions = (timeFormat: TimeFormat): ParamField[] => [
  getTimeOption(timeFormat),
  hideClockSeconds,
  {
    id: 'hidePast',
    title: 'Hide past events',
    description: 'Scheduler will only show upcoming events',
    type: 'boolean',
    defaultValue: false,
  },
  {
    id: 'stopCycle',
    title: 'Stop cycling through event pages',
    description: 'Schedule will not auto-cycle through events',
    type: 'boolean',
    defaultValue: false,
  },
  {
    id: 'eventsPerPage',
    title: 'Events per page',
    description: 'Sets the number of events on the page, can cause overlow',
    type: 'number',
    placeholder: '7 (default)',
  },
];
export const getStudioClockOptions = (timeFormat: TimeFormat): ParamField[] => [
  getTimeOption(timeFormat),
  hideClockSeconds,
  {
    id: 'seconds',
    title: 'Show Seconds',
    description: 'Shows seconds in clock',
    type: 'boolean',
    defaultValue: false,
  },
];

export const getOperatorOptions = (userFields: UserFields, timeFormat: TimeFormat): ParamField[] => {
  return [
    getTimeOption(timeFormat),
    {
      id: 'showseconds',
      title: 'Show seconds',
      description: 'Schedule shows hh:mm:ss',
      type: 'boolean',
      defaultValue: false,
    },
    {
      id: 'hidepast',
      title: 'Hide Past Events',
      description: 'Whether to events that have passed',
      type: 'boolean',
      defaultValue: false,
    },
    {
      id: 'main',
      title: 'Main data field',
      description: 'Field to be shown in the first line of text',
      type: 'option',
      values: {
        title: 'Title',
        subtitle: 'Subtitle',
        presenter: 'Presenter',
      },
    },
    {
      id: 'secondary',
      title: 'Secondary data field',
      description: 'Field to be shown in the second line of text',
      type: 'option',
      values: {
        title: 'Title',
        subtitle: 'Subtitle',
        presenter: 'Presenter',
      },
    },
    {
      id: 'subscribe',
      title: 'Highlight Field',
      description: 'Choose a field to highlight',
      type: 'option',
      values: {
        user0: userFields.user0 || 'user0',
        user1: userFields.user1 || 'user1',
        user2: userFields.user2 || 'user2',
        user3: userFields.user3 || 'user3',
        user4: userFields.user4 || 'user4',
        user5: userFields.user5 || 'user5',
        user6: userFields.user6 || 'user6',
        user7: userFields.user7 || 'user7',
        user8: userFields.user8 || 'user8',
        user9: userFields.user9 || 'user9',
      },
    },
    {
      id: 'shouldEdit',
      title: 'Edit user field',
      description: 'Allows editing an events user field by long pressing on it. Needs a selected highlighted field',
      type: 'boolean',
      defaultValue: false,
    },
  ];
};

export const getCountdownOptions = (timeFormat: TimeFormat): ParamField[] => [
  getTimeOption(timeFormat),
  hideTimerSeconds,
  hideClockSeconds,
];
