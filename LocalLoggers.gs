// Імітація Enum для рівнів серйозності
const Severity = {
  INFO: 'INFO',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
  DEBUG: 'DEBUG'
};

/**
 * Клас, що представляє логер з можливістю запису повідомлень у Google Spreadsheet.
 */
class LocalLogger {
/**
   * Створює екземпляр логера.
   * @param {string} emailAddress - Email для отримання сповіщень. (Залишити порожнім, щоб вимкнути сповіщення)
   * @param {boolean} logAtTop - Визначає, чи лог має додаватися нагорі таблиці.
   * @param {GoogleAppsScript.Spreadsheet.Sheet} [logSheet] - Опціонально. Аркуш, куди записувати логи.
   */
constructor(emailAddress = null, logAtTop = false, notifyLevel = Severity.ERROR, logSheet = null) {
  this.spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  this.logSheet = logSheet || this.spreadsheet.getSheetByName('Logs');
  this.logAtTop = logAtTop;
  this.notifyLevel = notifyLevel; // Сповіщати, коли додано ERROR або більш серйозний лог
  this.emailAddress = emailAddress; // Email для надсилання сповіщень
}

/**
 * Ініціалізує логер, створюючи аркуш Logs, якщо його не існує.
 */
init() {
  if (!this.logSheet) {
    this.logSheet = this.spreadsheet.insertSheet('Logs');
    this.logSheet.appendRow(['Timestamp', 'Severity', 'Message', 'User/Session']);
    this.logSheet.getRange('1:1').setFontWeight('bold');
  }
}


  /**
   * Записує повідомлення у лог.
   * @param {string} message - Повідомлення для логування.
   * @param {string} [severity=Severity.INFO] - Рівень серйозності повідомлення.
   */
  log(message, severity = Severity.INFO) {
    const userEmail = Session.getActiveUser().getEmail(); // Може бути порожнім у деяких контекстах через приватність
    const sessionID = Session.getTemporaryActiveUserKey(); // Альтернативний ідентифікатор сесії
    const userInfo = userEmail || sessionID;
    const timestamp = new Date();
    const formattedTimestamp = Utilities.formatDate(timestamp, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
    const logEntry = [formattedTimestamp, severity, message, userInfo];

    try {
      this.writeLogEntry(logEntry);

      // Запустити сповіщення, якщо серйозність висока
      if (this.shouldNotify(severity)) {
        this.notify(message, severity);
      }
    } catch (e) {
      // Обробка помилки, наприклад, логування в інше місце або відправка email
      Logger.log('Не вдалося записати лог: ' + e.toString());
    }
  }

/**
 * Записує одиничний запис логів у таблицю.
 * @param {Array} entry - Запис для додавання.
 */
writeLogEntry(entry) {
  let range;
  if (this.logAtTop) {
    // Вставляє новий рядок одразу після заголовків
    this.logSheet.insertRowAfter(1);
    range = this.logSheet.getRange(2, 1, 1, 4); // Новий запис буде у другому рядку
  } else {
    // Додає запис внизу аркуша
    const lastRow = this.logSheet.getLastRow();
    range = this.logSheet.getRange(lastRow + 1, 1, 1, 4);
  }
  range.setValues([entry]);
  range.setFontWeight('normal');
  this.applyLogColor(range, entry[1]); // Застосувати колір залежно від серйозності
}

 /**
   * Надсилає сповіщення для запису логу.
   * @param {string} message - Текст логу.
   * @param {string} severity - Рівень серйозності.
   */
  notify(message, severity) {
    
    if(!this.emailAddress) {
      Logger.log('Не вказано email для сповіщень');
      return;
    }

    try {
      const subject = `Новий запис логу рівня ${severity}`;
      const body = `Додано новий запис із серйозністю ${severity}: \n ${message}`;
      MailApp.sendEmail(this.emailAddress, subject, body); // Використати вказаний email
    } catch (e) {
      Logger.log('Не вдалося надіслати сповіщення: ' + e.toString());
    }
  }

  /**
   * Визначає, чи потрібно надсилати сповіщення на основі серйозності.
   * @param {string} severity - Рівень серйозності.
   * @return {boolean} True якщо потрібно надіслати сповіщення, інакше false.
   */
  shouldNotify(severity) {
    const severityOrder = [Severity.DEBUG, Severity.INFO, Severity.WARNING, Severity.ERROR];
    return severityOrder.indexOf(severity) >= severityOrder.indexOf(this.notifyLevel);
  }

  /**
 * Застосовує фоновий колір до запису залежно від серйозності.
 * @param {GoogleAppsScript.Spreadsheet.Range} range - Діапазон, до якого застосовується колір.
 * @param {string} severity - Рівень серйозності.
 */
applyLogColor(range, severity) {
  let color = "#FFFFFF"; // Білий колір за замовчуванням
  switch (severity) {
    case Severity.INFO:
      color = "#D9EAD3"; // Світло-зелений
      break;
    case Severity.WARNING:
      color = "#FFE599"; // Світло-жовтий
      break;
    case Severity.ERROR:
      color = "#F4CCCC"; // Світло-червоний
      break;
    case Severity.DEBUG:
      color = "#CFE2F3"; // Світло-блакитний
      break;
  }
  range.setBackground(color);
}

}