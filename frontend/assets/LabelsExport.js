/**
* MANDATORY PARAMETERS
* @param {string} checkLabel - type of label
* @param {object} intl - the intl object, from useIntl()
* OPTIONAL PARAMETERS
* @param {string} moduleNameParam - name of the module where label is used
*/

export const labelsManager = {
  importLabel (checkLabel, moduleNameParam, intl) {
    if (checkLabel && intl) {
      if (moduleNameParam) {
        return intl.formatMessage({ id: `perun.${moduleNameParam}.${checkLabel}`, defaultMessage: `perun.${moduleNameParam}.${checkLabel}` })
      } else {
        return intl.formatMessage({ id: `perun.generalLabel.${checkLabel}`, defaultMessage: `perun.generalLabel.${checkLabel}` })
      }
    } else {
      console.warn('Check your params')
    }
  }
}