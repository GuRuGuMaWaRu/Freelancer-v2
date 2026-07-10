import React, { useState } from "react";
import { useTransition, animated } from "react-spring";

import { useOutsideClick } from "shared/lib";

import internalStyles from "./Dropdown.module.css";

interface IProps {
  trigger: React.ReactElement;
  menu: React.ReactElement[];
  dropdownStyles?: React.CSSProperties;
}

function Dropdown({ trigger, menu, dropdownStyles = {} }: IProps) {
  const [isOpen, setIsOpen] = useState(false);

  const transition = useTransition(isOpen, {
    from: { opacity: 0, y: 5 },
    enter: {
      opacity: 1,
      y: 0
    },
    leave: {
      opacity: 0,
      y: 5
    }
  });

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const ref = useOutsideClick(closeDropdown);

  return (
    <div className={internalStyles.dropdownContainer}>
      {React.cloneElement(trigger, {
        ref,
        onClick: handleOpen
      })}
      <div>
        {transition(
          (styles, item) =>
            item && (
              <animated.div
                className={internalStyles.dropdownMenu}
                style={{ ...dropdownStyles, ...styles }}
              >
                {menu.map((menuItem, index) =>
                  React.cloneElement(menuItem, {
                    key: index,
                    style: { width: "100%" },
                    onClick: () => {
                      if (menuItem.props?.onClick) {
                        menuItem.props?.onClick();
                      }
                    },
                    tabIndex: isOpen ? 0 : -1
                  })
                )}
              </animated.div>
            )
        )}
      </div>
    </div>
  );
}

export { Dropdown };
