import { createParticipant, EventModel } from '@event-list/modules';
import { connectDatabaseK8s } from '@event-list/shared';

const seedParticipant = async () => {
  if (process.argv.length !== 3) {
    console.log('Remember: you need pass after seed:participants the eventId');

    console.log(`Example: ${process.argv[0]} ${process.argv[1]} <eventId>`);
  }

  const eventId = process.argv[2];

  const event = await EventModel.findOne({
    _id: eventId,
  });

  if (!event) {
    console.log('event not found');
    return;
  }

  const payload1 = {
    name: 'Vinicius Participant',
    batch: event.prices[0].title,
    event: event._id,
  };

  const payload2 = {
    name: 'Ivan Participant',
    batch: event.prices[0].title,
    event: event._id,
  };

  const participant = await createParticipant(payload1);
  const participant2 = await createParticipant(payload2);

  console.log(`Participant created ${participant}`);
  console.log(`Participant created ${participant2}`);
};

(async () => {
  try {
    await connectDatabaseK8s();
    await seedParticipant();
  } catch (err) {
    console.log('Error: ', err);
  }

  process.exit(0);
})();
