export type TimeEntryField = 'timeStart' | 'timeEnd' | 'durationOverride' | 'timeWarning' | 'timeDanger';

/**
 * @description Checks which field the value relates to
 */
export const handleTimeEntry = (
  field: TimeEntryField,
  val: number,
  timeStart: number,
  timeEnd: number,
): { start: number; end: number; durationOverride: boolean } => {
  let start = timeStart;
  let end = timeEnd;
  let durationOverride = false;

  if (field === 'timeStart') {
    start = val;
  } else if (field === 'timeEnd') {
    end = val;
  } else {
    durationOverride = field === 'durationOverride';
  }
  return { start, end, durationOverride };
};

/**
 * @description Validates time entry
 */
export const validateEntry = (
  field: TimeEntryField,
  value: number,
  timeStart: number,
  timeEnd: number,
): { value: boolean; warnings: { start?: string; end?: string; duration?: string } } => {
  const validate = { value: true, warnings: { start: '', end: '', duration: '' } };

  const { start, end } = handleTimeEntry(field, value, timeStart, timeEnd);

  if (end < start) {
    validate.warnings.start = 'Start time later than end time';
  }

  return validate;
};