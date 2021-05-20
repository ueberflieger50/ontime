import { memo } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import {
  Button,
  ButtonGroup,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import style from './EventListMenu.module.css';
import MenuActionButtons from '../editors/list/MenuActionButtons';
import CollapseBtn from 'common/components/buttons/CollapseBtn';
import ExpandBtn from 'common/components/buttons/ExpandBtn';
import CurrentBtn from 'common/components/buttons/CurrentBtn';

const EventListMenu = ({ eventsHandler }) => {
  const buttonProps = {
    size: 'sm',
    variant: 'outline',
    colorScheme: 'whiteAlpha',
    backgroundColor: '#ffffff05',
    _hover: { bg: 'blue.800' },
    _expanded: { bg: 'blue.400' },
    _focus: { boxShadow: 'none' },
  };

  const menuStyle = {
    color: 'initial',
    backgroundColor: 'rgba(255,255,255,0.67)',
  };

  const actionHandler = (action) => {
    switch (action) {
      case 'event':
        eventsHandler('add', { type: action, order: 0 });
        break;
      case 'delay':
        eventsHandler('add', { type: action, order: 0 });
        break;
      case 'block':
        eventsHandler('add', { type: action, order: 0 });
        break;
      default:
        break;
    }
  };

  return (
    <div className={style.headerButtons}>
      <Menu className={style.menu} isLazy>
        <ButtonGroup isAttached>
          <Button {...buttonProps}>Upload</Button>
          <MenuButton as={Button} {...buttonProps}>
            <FiChevronDown />
          </MenuButton>
        </ButtonGroup>
        <MenuList style={menuStyle}>
          <MenuItem>Upload Excel</MenuItem>
          <MenuItem>Upload CSV</MenuItem>
        </MenuList>
      </Menu>
      <Menu>
        <ButtonGroup isAttached>
          <Button {...buttonProps}>Save</Button>
          <MenuButton as={Button} {...buttonProps}>
            <FiChevronDown />
          </MenuButton>
        </ButtonGroup>
        <MenuList style={menuStyle}>
          <MenuItem>Download Excel</MenuItem>
          <MenuItem>Download CSV</MenuItem>
        </MenuList>
      </Menu>
      <CurrentBtn size='sm' />
      <CollapseBtn
        size='sm'
        clickhandler={() => eventsHandler('collapseall')}
      />
      <ExpandBtn size='sm' clickhandler={() => eventsHandler('expandall')} />
      <MenuActionButtons actionHandler={actionHandler} size='sm' />
    </div>
  );
};

export default memo(EventListMenu);
