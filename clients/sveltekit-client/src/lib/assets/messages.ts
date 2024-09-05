const messages: { [key: string]: string } = {
  "api.errors.authentication.userNotFound": "Benutzer wurde nicht gefunden.",
  "client.errors.authentication.passwordDoNMotMatch":
    "Passwörter stimmen nicht überein.",
  "api.errors.authentication.forgotPasswordCodeExpired":
    "Code zum Passwort zurücksetzen ist abgelaufen.",
  "api.errors.authentication.forgotPasswordCodeInvalid":
    "Code zum Passwort zurücksetzen ist ungültig.",
  "api.errors.authentication.wrongPassword":
    "Benutzername oder Passwort ist falsch.",
  "client.errors.authentication": "Beim Anmelden ist ein Fehler aufgetreten.",
  "client.errors.registration": "Beim Registrieren ist ein Fehler aufgetreten.",
  "api.errors.registration.userAlreadyExists":
    "Benutzername oder Email existiert bereits.",
  "api.errors.registration.passwordNotValid":
    "Ihr Passwort erfüllt nicht alle Kriterien.",
  "client.errors.password.reset":
    "Beim Zurücksetzen des Passworts ist ein Fehler aufgetreten.",
  "api.errors.validator.registerCodeNotEmpty": "Der Code ist ungültig.",
  "api.errors.validator.passwordNotValid":
    "Passwort erfüllt nicht alle Kriterien.",
};

const getMessage = (key: string) => {
  return messages[key];
};

export default { messages, getMessage };
