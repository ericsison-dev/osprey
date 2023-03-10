import { forwardRef } from 'react';
import { Root, Portal, Content, Arrow, Close, Trigger, Anchor } from '@radix-ui/react-popover';
import { AnimatePresence, motion } from 'framer-motion';
import { FunctionComponent, useContext, useState } from 'react';
import { PopupProps, PopupContext, PopupContentProps } from './types';
import { styles } from './Popup.styles';

/**
 * export primitive close as PopupClose
 */
export const PopupClose = Close;

/**
 * export primitive trigger as PopupTrigger
 */
export const PopupTrigger = Trigger;

/**
 * export primitive anchor as PopupAnchor
 */
export const PopupAnchor = Anchor;

/**
 * - A popup is a layer that appears above all other content on the page.
 * - It provides additional information about an action.
 * - This component is using radix-ui's Popover primitive for out-of-the-box accessibility.
 * - Please visit their official website documentation to learn more: https://www.radix-ui.com/docs/primitives/components/popover
 *
 * @example
 * <Popup>
 *    <PopupTrigger>Open Popup</PopupTrigger>
 *    <PopupContent>The quick brown fox jumps over a lazy dog near the riverbanks.</PopupContent>
 * </Popup>
 */
export const Popup: FunctionComponent<PopupProps> = ({ children, defaultOpen, modal, open = false }) => {
  /**
   * initialize state to listen to the current open state of Popover.Root
   * expose this state via context so that it can be consumed by the Popover.Content
   */
  const [isOpen, setIsOpen] = useState(open);

  return (
    <Root
      // assign Popover.Root props
      open={isOpen}
      defaultOpen={defaultOpen}
      modal={modal}
      onOpenChange={setIsOpen}
    >
      <PopupContext.Provider value={{ isOpen, setIsOpen }}>{children}</PopupContext.Provider>
    </Root>
  );
};

/**
 * Abstraction component for Popover.Content
 */
export const PopupContent = forwardRef<HTMLDivElement, PopupContentProps>(
  ({ children, className, arrow, ...props }, forwardedRef) => {
    /**
     * listen to the current value of Popover.Root's open state so it can be used
     * by AnimatePresence for controller the exit animation of PopupContent
     */
    const { isOpen } = useContext(PopupContext);

    /**
     * animation variants that define values to be used by framer motion
     *
     * in this case, animation values will vary depending on the side prop (i.e. 'top', 'bottom', 'left', 'right')
     */
    const variants = {
      /**
       * animation values for when popup is visible
       */
      visible: { opacity: 1, y: 0, x: 0 },
      /**
       * animation values for when popup is hidden
       */
      hidden:
        // if side prop is top
        props.side === 'top'
          ? { opacity: 0, y: 5, x: 0 }
          : // if side prop is right
          props.side === 'right'
          ? { opacity: 0, y: 0, x: -5 }
          : // if side prop is bottom
          props.side === 'bottom'
          ? { opacity: 0, y: -5, x: 0 }
          : // if side prop is left
            { opacity: 0, y: 0, x: 5 },
    };

    return (
      <AnimatePresence>
        {isOpen ? (
          <Portal forceMount>
            <Content {...props} ref={forwardedRef} asChild className={`${className} ${styles.content}`}>
              <motion.div
                animate="visible"
                initial="hidden"
                exit="hidden"
                transition={{ duration: 0.2 }}
                variants={variants}
              >
                {arrow && <Arrow width={arrow.width} height={arrow.height} className={`${styles.arrow}`} />}
                {children}
              </motion.div>
            </Content>
          </Portal>
        ) : null}
      </AnimatePresence>
    );
  }
);
