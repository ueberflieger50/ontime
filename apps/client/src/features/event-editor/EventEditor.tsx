import { useCallback, useEffect, useState } from 'react';
import { isOntimeEvent, OntimeEvent } from 'ontime-types';

import CopyTag from '../../common/components/copy-tag/CopyTag';
import { useEventAction } from '../../common/hooks/useEventAction';
import useRundown from '../../common/hooks-query/useRundown';
import { useEventSelection } from '../../features/rundown/useEventSelection';

import EventEditorDataLeft from './composite/EventEditorDataLeft';
import EventEditorDataRight from './composite/EventEditorDataRight';
import EventEditorTimes from './composite/EventEditorTimes';

import style from './EventEditor.module.scss';
import EventEditorDataUser from './composite/EventEditorDataUser';

export type EventEditorSubmitActions = keyof OntimeEvent;
export type EditorUpdateFields = 'cue' | 'title' | 'presenter' | 'subtitle' | 'note' | 'colour' | 'user';

export default function EventEditor() {
  const selectedEvents = useEventSelection((state) => state.selectedEvents);
  const { data } = useRundown();
  const { updateEvent } = useEventAction();

  const [event, setEvent] = useState<OntimeEvent | null>(null);
  console.log(event);

  useEffect(() => {
    if (!data) {
      setEvent(null);
      return;
    }

    const event = data.find((event) => selectedEvents.has(event.id));

    if (event && isOntimeEvent(event)) {
      setEvent(event);
    }
  }, [data, selectedEvents]);

  const handleSubmit = useCallback(
    (field: EditorUpdateFields, value: string) => {
      updateEvent({ id: event?.id, [field]: value });
    },
    [event?.id, updateEvent],
  );

  if (!event) {
    return <span className={style.noEvent}>No event to Edit selected</span>;
  }

  return (
    <div className={style.eventEditor}>
      <EventEditorTimes
        eventId={event.id}
        timeStart={event.timeStart}
        timeEnd={event.timeEnd}
        duration={event.duration}
        delay={event.delay ?? 0}
        isPublic={event.isPublic}
        endAction={event.endAction}
        timerType={event.timerType}
        timeWarning={event.timeWarning}
        timeDanger={event.timeDanger}
      />
      <EventEditorDataLeft
        key={`${event.id}-left`}
        eventId={event.id}
        cue={event.cue}
        title={event.title}
        presenter={event.presenter}
        subtitle={event.subtitle}
        handleSubmit={handleSubmit}
      />
      <EventEditorDataRight
        key={`${event.id}-right`}
        note={event.note}
        colour={event.colour}
        handleSubmit={handleSubmit}
      />
      <EventEditorDataUser key={`${event.id}-users`} event={event} handleSubmit={handleSubmit}>
        <CopyTag label='Event ID'>{event.id}</CopyTag>
        <CopyTag label='OSC trigger by id'>{`/ontime/gotoid "${event.id}"`}</CopyTag>
        <CopyTag label='OSC trigger by cue'>{`/ontime/gotocue "${event.cue}"`}</CopyTag>
      </EventEditorDataUser>
    </div>
  );
}
