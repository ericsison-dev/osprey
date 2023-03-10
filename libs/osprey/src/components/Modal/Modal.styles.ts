import cx from 'classnames';
import { ModalSize } from './types';

export const styles = {
  container: 'fixed inset-0 z-50 transition-all',
  overlay: 'fixed inset-0 bg-black/20 backdrop-blur-sm dark:bg-opacity-0',
  content: (size: ModalSize, center: boolean) =>
    cx('flex flex-col items-center w-full h-full', {
      'pt-10': !center && size !== 'full',
      'py-10': center && size !== 'full',
      'justify-center': center,
    }),

  motionDiv: (size: ModalSize) => {
    return cx('bg-white text-midnight-700 flex flex-col dark:bg-midnight-800 dark:text-midnight-200', {
      'rounded-md': size !== 'full',
    });
  },

  childrenContainer: 'h-full flex flex-col',
  title: 'px-4 py-2',
  body: 'p-4 flex-1',
  footer: 'px-4 py-2',
};
