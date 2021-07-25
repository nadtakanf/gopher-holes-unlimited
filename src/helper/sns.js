const log = require('lambda-log');
const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');
const client = new SNSClient({ region: process.env.REGION })

module.exports.notifyFailure = async (message) => {
  try {
    if (process.env.FAILURE_SNS) {
      log.info(`Sending failure notification to SNS topic ${process.env.FAILURE_SNS}`);

      const params = {
        Message: message,
        TopicArn: process.env.FAILURE_SNS,
      }

      const command = new PublishCommand(params);
      await client.send(command);
    } else {
      log.info('Skipped sending failure notification, no SNS topic is configured');
    }
  } catch (e) {
    log.error(`Error while notifying via SNS ${e.message}`);
  }
};
