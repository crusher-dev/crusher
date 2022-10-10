export enum StepErrorTypeEnum {
    ELEMENT_NOT_FOUND = "ELEMENT_NOT_FOUND",
    ELEMENT_NOT_STABLE = "ELEMENT_NOT_STABLE",
    ELEMENT_NOT_VISIBLE = "ELEMENT_NOT_VISIBLE",
    
    ASSERTIONS_FAILED = "ASSERTIONS_FAILED",
    TIMEOUT = "TimeoutError", // if not any other action can't be validated
    
    UNEXPECTED_ERROR_OCCURRED = "UNEXPECTED_ERROR_OCCURRED", // <--- See logs to understand
}
  