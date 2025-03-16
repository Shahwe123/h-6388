
/**
 * Redux Action Creators
 */

/**
 * Action to reset the entire application state
 * 
 * This is typically used during logout to clear all Redux state
 * across all reducers in the application.
 * 
 * @returns {Object} Action object with type 'RESET_STATE'
 */
export const resetState = () => ({
  type: 'RESET_STATE',
});
