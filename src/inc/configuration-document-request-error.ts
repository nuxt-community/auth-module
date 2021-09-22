export class ConfigurationDocumentRequestError extends Error {
  constructor() {
    super('Error loading OpenIDConnect configuration document')
    this.name = 'ConfigurationDocumentRequestError'
  }
}
