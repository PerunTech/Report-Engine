import { React, elements } from 'perun-core'
const { Icon } = elements

/**
 * Every icon is a tabler icon, rendered through the Icon helper perun-core
 * exposes on elements. Sizes here are the intended ones, report-engine.css
 * still has the last word through its own svg rules.
 */
export const icons = {
  back: <Icon name={'IconChevronLeft'} size={14} stroke={1.8} />,
  chevron: <Icon name={'IconChevronRight'} size={12} stroke={1.8} />,
  search: <Icon name={'IconSearch'} size={14} stroke={1.8} />,
  plus: <Icon name={'IconPlus'} size={14} stroke={1.8} />,
  check: <Icon name={'IconCheck'} size={14} stroke={2.2} />,
  close: <Icon name={'IconX'} size={15} stroke={1.8} />,
  download: <Icon name={'IconDownload'} size={15} stroke={1.8} />,
}
