'use strict'

const Mail = use('Mail')
const Helpers = use('Helpers')

class NewTaskMail {
  static get concurrency() {
    return 1
  }

  static get key() {
    return 'NewTaskMail-job'
  }

  async handle({ email, username, title, file }) {
    console.log(`Job: ${NewTaskMail.key}`)
    await Mail.send(
      ['emails.new_task'],
      { username, title, hasAttatment: !!file },
      (message) => {
        message
          .to(email)
          .from('rgrando.unique@gmail.com', 'Rogério Grando')
          .subject('Nova tarefa para você')

        if (file) {
          message.attach(Helpers.tmpPath(`uploads/${file.file}`), {
            filename: file.name
          })
        }
      }
    )
  }
}

module.exports = NewTaskMail
