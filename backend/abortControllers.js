const controllers = new Map();
function createAbortController(chatId) {
  const controller = new AbortController();
  controllers.set(chatId, controller);
  return controller;
}
function abortChat(chatId) {
  const controller = controllers.get(chatId);
  if (controller) controller.abort();
  controllers.delete(chatId);
}
module.exports = { createAbortController, abortChat };
