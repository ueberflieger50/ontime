import { memo, PropsWithChildren } from 'react';

import { EditorUpdateFields } from '../EventEditor';

import style from '../EventEditor.module.scss';
import { OntimeEvent } from 'ontime-types';
import TextInput from '../../../common/components/input/text-input/TextInput';
import useUserFields from '../../../common/hooks-query/useUserFields';
import Empty from '../../../common/components/state/Empty';

interface EventEditorRightProps {
  event: OntimeEvent;
  handleSubmit: (field: EditorUpdateFields, value: string) => void;
}

const EventEditorDataRight = (props: PropsWithChildren<EventEditorRightProps>) => {
  const { children, event, handleSubmit } = props;
  const userInputs = (Object.keys(props.event) as Array<keyof OntimeEvent>).filter((key) => key.includes('user'));
  const { data: userFields } = useUserFields();

  if (!userFields) {
    return <Empty text='Loading...' />;
  }
  const userLabels = Object.entries(userFields)
    .filter(([key, value]) => value !== '')
    .map(([key, value]) => key);

  return (
    <div className={style.right}>
      <div className={style.userEditor}>
        {userLabels.map((user) => (
          <label className={style.nameLabel} htmlFor={user}>
            {userFields[user] as string}
          </label>
        ))}
        {userInputs.map((user) => {
          if (userFields[user] === '') return;
          return (
            <div className={style.nameValue}>
              <TextInput field={user} initialText={event[user] as string} submitHandler={handleSubmit} />
            </div>
          );
        })}
      </div>
      <div className={style.eventActions}>{children}</div>
    </div>
  );
};

export default memo(EventEditorDataRight);
