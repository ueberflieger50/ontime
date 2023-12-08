import { memo, useCallback, useState } from 'react';
import { Tooltip } from '@chakra-ui/react';
import { OntimeEvent } from 'ontime-types';
import { calculateDuration, millisToString } from 'ontime-utils';

import TimeInput from '../../../../common/components/input/time-input/TimeInput';
import { useEventAction } from '../../../../common/hooks/useEventAction';
import { millisToDelayString } from '../../../../common/utils/dateConfig';
import { cx } from '../../../../common/utils/styleUtils';
import { TimeEntryField, validateEntry } from '../../../../common/utils/timesManager';

import style from '../EventBlock.module.scss';

interface EventBlockTimerProps {
  eventId: string;
  timeStart: number;
  timeEnd: number;
  duration: number;
  delay: number;
  previousEnd: number;
}

type TimeActions = 'timeStart' | 'timeEnd' | 'durationOverride';

const EventBlockTimers = (props: EventBlockTimerProps) => {
  const { eventId, timeStart, timeEnd, duration, delay, previousEnd } = props;
  const { updateEvent } = useEventAction();

  const [warning, setWarnings] = useState({ start: '', end: '', duration: '' });
  const [overlap, setOverlap] = useState<number>(timeStart - previousEnd);

  const handleSubmit = (field: TimeActions, value: number) => {
    const newEventData: Partial<OntimeEvent> = { id: eventId };
    switch (field) {
      case 'durationOverride': {
        // duration defines timeEnd
        newEventData.duration = value;
        newEventData.timeEnd = timeStart + value;
        break;
      }
      case 'timeStart': {
        newEventData.duration = calculateDuration(value, timeEnd);
        newEventData.timeStart = value;
        break;
      }
      case 'timeEnd': {
        newEventData.duration = calculateDuration(timeStart, value);
        newEventData.timeEnd = value;
        break;
      }
    }
    updateEvent(newEventData);
  };

  /**
   * @description Validates a time input against its pair
   * @param {string} entry - field to validate: timeStart, timeEnd, durationOverride
   * @param {number} val - field value
   * @return {boolean}
   */
  const handleValidation = useCallback(
    (field: TimeEntryField, value: number, proceeding: number) => {
      const valid = validateEntry(field, value, timeStart, timeEnd, proceeding);
      setWarnings((prev) => ({ ...prev, ...valid.warnings }));
      setOverlap(valid.overlap);
      return valid.value;
    },
    [timeEnd, timeStart],
  );

  const delayedStart = Math.max(0, timeStart + delay);
  const newTime = millisToString(delayedStart);
  const delayTime = delay !== 0 ? millisToDelayString(delay) : null;

  const overlapTime =
    overlap > 0
      ? `Overlapping ${millisToDelayString(overlap)}`
      : overlap < 0
      ? `Spacing ${millisToDelayString(overlap)}`
      : null;

  return (
    <div className={style.eventTimers}>
      <TimeInput
        name='timeStart'
        submitHandler={handleSubmit}
        validationHandler={handleValidation}
        time={timeStart}
        delay={delay}
        placeholder='Start'
        previousEnd={previousEnd}
        warning={warning.start}
      />
      <TimeInput
        name='timeEnd'
        submitHandler={handleSubmit}
        validationHandler={handleValidation}
        time={timeEnd}
        delay={delay}
        placeholder='End'
        previousEnd={previousEnd}
        warning={warning.end}
      />
      <TimeInput
        name='durationOverride'
        submitHandler={handleSubmit}
        validationHandler={handleValidation}
        time={duration}
        delay={0}
        placeholder='Duration'
        previousEnd={previousEnd}
        warning={warning.duration}
      />
      <Tooltip
        label={
          <div>
            {delayTime}
            <br />
            New Time: {newTime}
          </div>
        }
      >
        <div className={cx([style.indicator, delayTime ? style.indDelay : ''])} />
      </Tooltip>
      <Tooltip label={overlapTime}>
        <div className={cx([style.indicator, overlap > 0 ? style.indOverlap : overlap < 0 ? style.indSpacing : ''])} />
      </Tooltip>
      <Tooltip label={warning.start}>
        <div
          className={cx([style.indicator, warning.start == 'Start time later than end time' ? style.indNextDay : ''])}
        />
      </Tooltip>
      {/* {delayTime && (
        <div className={style.delayNote}>
          {delayTime}
          <br />
          {`New start: ${newTime}`}
        </div>
      )}
      {overlap != 0 && (
        <div className={overlap > 0 ? style.spaceNote : style.overlapNote}>
          {overlap > 0 ? 'Overlap' : 'Space'}
          <br />
          {millisToDelayString(overlap)}
        </div>
      )} */}
    </div>
  );
};

export default memo(EventBlockTimers);
