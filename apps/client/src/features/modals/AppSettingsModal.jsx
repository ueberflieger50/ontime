import { useEffect, useState } from 'react';
import isEqual from 'react-fast-compare';
import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  ModalBody,
  PinInput,
  PinInputField,
  Select,
} from '@chakra-ui/react';
import { FiEye } from '@react-icons/all-files/fi/FiEye';
import { FiX } from '@react-icons/all-files/fi/FiX';

import { useEmitLog } from '@/common/stores/logger';

import { version } from '../../../package.json';
import { getLatestVersion, postSettings } from '../../common/api/ontimeApi';
import TooltipActionBtn from '../../common/components/buttons/TooltipActionBtn';
import useSettings from '../../common/hooks-query/useSettings';
import { ontimePlaceholderSettings } from '../../common/models/OntimeSettings';
import { useLocalEvent } from '../../common/stores/localEvent';

import { inputProps } from './modalHelper';
import SubmitContainer from './SubmitContainer';

import style from './Modals.module.scss';

export default function AppSettingsModal() {
  const { data, status, refetch } = useSettings();
  const { emitError, emitWarning } = useEmitLog();
  const [formData, setFormData] = useState(ontimePlaceholderSettings);
  const [changed, setChanged] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hidePin, setHidePin] = useState(true);

  const eventSettings = useLocalEvent((state) => state.eventSettings);
  const setLocalEventSettings = useLocalEvent((state) => state.setLocalEventSettings);

  const [formSettings, setFormSettings] = useState(eventSettings);

  const [updateMessage, setUpdateMessage] = useState(<a>Using ontime version: {version}</a>);
  const [isFetching, setIsFetching] = useState(false);

  /**
   * Set formdata from server state
   */
  useEffect(() => {
    if (data == null) return;
    if (changed) return;
    setFormData({
      pinCode: data.pinCode,
      timeFormat: data.timeFormat,
    });
    // getLatestVersion().then((data) => {
    //   setVersionData(data);
    // });
  }, [changed, data]);

  /**
   * Validate and submit data
   */
  const submitHandler = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    const validation = { isValid: false, message: '' };

    const hasChanged = !isEqual(formSettings, eventSettings);
    if (hasChanged) {
      setLocalEventSettings(formSettings);
      validation.isValid = true;
    }

    // we might not have changed this
    if (formData.pinCode !== data.pinCode) {
      // Validate fields
      if (formData.pinCode === '' || formData.pinCode == null) {
        validation.isValid = true;
        validation.message += 'App pin code removed';
      } else {
        validation.isValid = true;
        validation.message += 'App pin code added';
      }
    }

    if (formData.timeFormat !== data.timeFormat) {
      if (formData.timeFormat === '12' || formData.timeFormat === '24') {
        validation.isValid = true;
      } else {
        validation.isValue = false;
      }
    }

    let resetChange = hasChanged;
    // set fields with error
    if (!validation.isValid) {
      emitError(`Invalid Input: ${validation.message}`);
    } else {
      try {
        await postSettings(formData);
      } catch (error) {
        emitError(`Error saving settings: ${error}`);
      } finally {
        await refetch();
        resetChange = true;
      }
      validation?.message && emitWarning(validation.message);
    }
    if (resetChange) {
      setChanged(false);
    }
    setSubmitting(false);
  };

  /**
   * Reverts local state equals to server state
   */
  const revert = async () => {
    setChanged(false);
    // set from context
    setFormSettings(eventSettings);
    await refetch();
  };

  /**
   * Handles change of input field in local state
   * @param {string} field - object parameter to update
   * @param {string} value - new object parameter value
   */
  const handleChange = (field, value) => {
    const temp = { ...formData };
    temp[field] = value;
    setFormData(temp);
    setChanged(true);
  };

  /**
   * Handles version comparison and returns component with message
   */
  const versionCheck = async () => {
    let message = <a>Using latest version</a>;
    setIsFetching(true);
    getLatestVersion()
      .then((data) => {
        const remoteVersion = data;
        if (!remoteVersion.version.includes(version)) {
          message = (
            <a href={remoteVersion.url} target='_blank' rel='noreferrer'>
              Update to version {remoteVersion.version} available
            </a>
          );
        }
      })
      .catch(function () {
        message = <a>Error reaching server</a>;
      })
      .finally(function () {
        setUpdateMessage(message);
        setIsFetching(false);
      });
  };

  const disableModal = status !== 'success';

  return (
    <ModalBody className={style.modalBody}>
      <p className={style.notes}>
        Options related to the application
        <br />
        🔥 Changes take effect on save 🔥
      </p>
      <form onSubmit={submitHandler}>
        <div className={style.modalFields}>
          <div className={style.hSeparator}>General App Settings</div>
          <div className={style.modalInline}>
            <FormControl id='serverPort'>
              <FormLabel htmlFor='serverPort'>
                Viewer Port
                <span className={style.labelNote}>
                  <br />
                  Ontime is available at port
                </span>
              </FormLabel>
              <Input {...inputProps} name='title' value={4001} disabled style={{ width: '6em', textAlign: 'center' }} />
            </FormControl>
            <FormControl id='editorPin'>
              <FormLabel htmlFor='editorPin'>
                Editor Pincode
                <span className={style.labelNote}>
                  <br />
                  Protect the editor with a Pincode
                </span>
              </FormLabel>
              <div className={style.pin}>
                <PinInput
                  {...inputProps}
                  type='alphanumeric'
                  name='pinCode'
                  defaultValue=''
                  value={formData.pinCode}
                  mask={hidePin}
                  isDisabled={disableModal}
                  onChange={(value) => handleChange('pinCode', value)}
                >
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                </PinInput>
                <IconButton
                  size='sm'
                  colorScheme='blue'
                  variant='ghost'
                  icon={<FiEye />}
                  aria-label='Editor pin code'
                  onMouseDown={() => setHidePin(false)}
                  onMouseUp={() => setHidePin(true)}
                  isDisabled={disableModal}
                />
                <TooltipActionBtn
                  tooltip='Clear pincode'
                  size='sm'
                  colorScheme='red'
                  variant='ghost'
                  icon={<FiX />}
                  clickHandler={() => handleChange('pinCode', '')}
                  isDisabled={disableModal}
                />
              </div>
            </FormControl>
          </div>
          <div className={style.modalColumn}>
            <FormControl id='timeFormat'>
              <FormLabel htmlFor='timeFormat'>
                Time format
                <span className={style.labelNote}>
                  <br />
                  12 / 24 hour format (viewers only for now)
                </span>
              </FormLabel>
              <Select
                size='sm'
                name='timeFormat'
                value={formData.timeFormat}
                isDisabled={disableModal}
                onChange={(event) => handleChange('timeFormat', event.target.value)}
              >
                <option value='12'>12 hours eg. 11:00:10 PM</option>
                <option value='24'>24 hours eg. 23:00:10</option>
              </Select>
            </FormControl>
          </div>
          <div className={style.hSeparator}>Create Event Default Settings</div>
          <div className={style.modalColumn}>
            <Checkbox
              isChecked={formSettings.showQuickEntry}
              onChange={(e) => {
                setFormSettings((prev) => ({ ...prev, showQuickEntry: e.target.checked }));
                setChanged(true);
              }}
            >
              Show quick entry on cursor
            </Checkbox>
            <Checkbox
              isChecked={formSettings.startTimeIsLastEnd}
              onChange={(e) => {
                setFormSettings((prev) => ({ ...prev, startTimeIsLastEnd: e.target.checked }));
                setChanged(true);
              }}
            >
              Start time is last end
            </Checkbox>
            <Checkbox
              isChecked={formSettings.defaultPublic}
              onChange={(e) => {
                setFormSettings((prev) => ({ ...prev, defaultPublic: e.target.checked }));
                setChanged(true);
              }}
            >
              Event default public
            </Checkbox>
          </div>
          <div className={style.notes}>
            {updateMessage}
            <Button onClick={versionCheck} isLoading={isFetching}>
              Check for updates
            </Button>
          </div>
        </div>
        <SubmitContainer revert={revert} submitting={submitting} changed={changed} status={status} />
      </form>
    </ModalBody>
  );
}