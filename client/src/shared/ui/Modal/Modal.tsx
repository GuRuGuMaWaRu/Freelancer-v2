import * as React from "react";
import VisuallyHidden from "@reach/visually-hidden";
import { animated, useTransition } from "react-spring";
import {
  DialogContent as ReachDialogContent,
  DialogOverlay
} from "@reach/dialog";

import { useModal, ModalProvider } from "./Modal.context";
import { colors } from "../../const";
import modalStyles from "./Modal.module.css";

const callAll = (...fns: Array<(...args: unknown[]) => void>) => (
  ...args: unknown[]
): void => fns.forEach(fn => fn && fn(...args));

const ModalOpenButton = ({ children }: { children: React.ReactElement }) => {
  const { setIsOpen } = useModal();

  return React.cloneElement(children, {
    onClick: callAll(() => setIsOpen(true), children.props.onClick)
  });
};

const AnimatedDialogOverlay = animated(DialogOverlay);
const AnimatedDialogContent = animated(ReachDialogContent);

const ModalContents = ({
  children,
  title,
  bgColor = colors.dashboardPageBg,
  ...props
}: {
  children: React.ReactElement;
  title: string;
  bgColor?: string;
}) => {
  const { isOpen, setIsOpen } = useModal();

  const transitions = useTransition(isOpen, {
    from: { opacity: 0, y: -10 },
    enter: { opacity: 1, y: 0 },
    leave: { opacity: 0, y: 10 },
    reverse: isOpen,
    delay: 200
  });

  return transitions(
    (styles, item) =>
      item && (
        <AnimatedDialogOverlay
          onDismiss={() => setIsOpen(false)}
          style={styles}
        >
          <AnimatedDialogContent
            className={modalStyles.modalContent}
            style={{
              transform: styles.y.to(
                value => `translate3d(0px, ${value}px, 0px)`
              ),
              backgroundColor: bgColor
            }}
            {...props}
          >
            <div className={modalStyles.modalCloseButtonContainer}>
              <button
                className={modalStyles.modalCloseButton}
                onClick={() => setIsOpen(false)}
              >
                <VisuallyHidden>Close</VisuallyHidden>
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <h2 className={modalStyles.modalTitle}>{title}</h2>
            {children}
          </AnimatedDialogContent>
        </AnimatedDialogOverlay>
      )
  );
};

interface ModalProps {
  title: string;
  button: React.ReactElement;
  children: React.ReactElement;
}

const Modal = ({ title, button, children }: ModalProps) => {
  // TODO: wire useGetColorFromPath when route-based modal BG is implemented (see BACKLOG.md)
  const color = colors.dashboardPageBg;

  return (
    <ModalProvider>
      <ModalOpenButton>{button}</ModalOpenButton>
      <ModalContents aria-label={`${title} Form`} title={title} bgColor={color}>
        {children}
      </ModalContents>
    </ModalProvider>
  );
};

export { Modal };
