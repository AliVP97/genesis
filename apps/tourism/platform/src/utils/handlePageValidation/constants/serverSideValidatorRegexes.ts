const SERVER_SIDE_VALIDATOR_REGEXES = {
  NUMBER: /^\d+$/,
  DATE: /^\d{4}-\d{2}-\d{2}$/,

  /**
   * This regex is group of two parts: first part determines IATA code for
   * origin and second part determines IATA code for destination. The first one
   * is not determine range of number of characters, but the second one is. This
   * should be handle in the code, in the some scenarios like cms data this
   * should be consider that in the flow.
   */
  IATA_CODES_GROUP: /^([A-Z]+)(?:[^A-Z]+([A-Z]{3}))?$/i,
} as const;

export default SERVER_SIDE_VALIDATOR_REGEXES;
