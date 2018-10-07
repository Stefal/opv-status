/**
 * Simple memento :)
 * @author Benjamin BERNARD <benjamin.bernard@openpathview.fr>
 */
export default class Memento {
  constructor () {
    this.excutedHistoric = []; // Executed commands historic
    this.unDoneHistoric = []; // Undone commands historic

    // State info
    this.refreshState();
  }

  /**
   * Refresh memento "can" states.
   */
  refreshState () {
    this.canRedo = this.unDoneHistoric.length > 0;
    this.canUndo = this.excutedHistoric.length > 0;
  }

  /**
   * Process a command.
   * @param {command} command Command to be executed, should have a do and undo method.
   */
  execute (command) {
    command.do();
    this.excutedHistoric.push(command);
    this.unDoneHistoric = []; // Can replay actions after executing new ones

    this.refreshState();
  }

  /**
   * Process a command (with await / a synchronous)
   * @param {command} command Command to be executed, should have a do and undo method.
   */
  async executeAsync (command) {
    await command.do()
    this.excutedHistoric.push(command);
    this.unDoneHistoric = []; // Can replay actions after executing new ones

    this.refreshState();
  }

  /**
   * Undo the last executed command.
   */
  undo () {
    if (!this.canUndo) {
      return;
    }

    const lastExecutedCmd = this.excutedHistoric.pop();
    lastExecutedCmd.undo();
    this.unDoneHistoric.push(lastExecutedCmd);

    this.refreshState();
  }

  /**
   * Redo the last undone command.
   */
  redo () {
    if (!this.canRedo) {
      return;
    }

    const lastUnDoneCmd = this.unDoneHistoric.pop();
    lastUnDoneCmd.do();
    this.excutedHistoric.push(lastUnDoneCmd);

    this.refreshState();
  }
};
