/**
 * VoteWise Cloud Functions — Entry Point
 * Exports all HTTPS Callable Cloud Functions.
 */

const { chatHandler } = require('./chatHandler');
const { checkEligibility } = require('./eligibilityHandler');
const { faqFetcher } = require('./faqHandler');
const { notificationScheduler } = require('./notificationScheduler');

exports.chatHandler = chatHandler;
exports.checkEligibility = checkEligibility;
exports.faqFetcher = faqFetcher;
exports.notificationScheduler = notificationScheduler;
