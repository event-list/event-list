import { faker } from '@faker-js/faker';

import { createEvent, MerchantModel } from '@event-list/modules';
import { connectDatabaseK8s } from '@event-list/shared';

const seedEvent = async () => {
  if (process.argv.length !== 3) {
    console.log('Remember: you need pass after seed:users the merchantId');

    console.log(`Example: ${process.argv[0]} ${process.argv[1]} <merchantId>`);
  }

  const merchantId = process.argv[2];

  const merchant = await MerchantModel.findOne({
    _id: merchantId,
  });

  if (!merchant) {
    console.log('merchant not found');
    return;
  }

  const payload1 = {
    title: 'My cool event',
    description: faker.lorem.paragraph(),
    flyer: faker.image.abstract(),
    place: faker.address.streetAddress(),
    dateStart: new Date('2023-02-20 20:00:00'),
    dateEnd: new Date('2023-02-21 04:00:00'),
    listAvailableAt: new Date('2022-02-21 23:00:00'),
    classification: '18',
    prices: [
      {
        title: 'free',
        value: '00.00',
        visible: false,
        date: new Date('2023-02-21 04:00:00'),
      },
      {
        title: 'first lot',
        value: '30.00',
        date: new Date('2023-02-19 12:00:00'),
      },
      {
        title: 'second lot',
        value: '50.00',
        date: new Date('2023-02-21 04:00:00'),
      },
    ],
    users: [
      {
        name: 'Vinicius',
        role: 'free',
      },
      {
        name: 'Maria',
        role: 'first lot',
      },
      {
        name: 'Luiz',
        role: 'second lot',
      },
      {
        name: 'Clara',
        role: 'first lot',
      },
    ],
    merchant: merchant._id,
  };

  const payload2 = {
    title: 'My future event',
    description: faker.lorem.paragraph(),
    flyer: faker.image.abstract(),
    place: faker.address.streetAddress(),
    dateStart: new Date('2099-02-20 20:00:00'),
    dateEnd: new Date('2099-02-21 04:00:00'),
    listAvailableAt: new Date('2099-02-21 23:00:00'),
    classification: '18',
    prices: [
      {
        title: 'free',
        value: '00.00',
        visible: false,
        date: new Date('2099-02-21 04:00:00'),
      },
      {
        title: 'first lot',
        value: '30.00',
        date: new Date('2099-02-19 12:00:00'),
      },
      {
        title: 'second lot',
        value: '50.00',
        date: new Date('2099-02-21 04:00:00'),
      },
    ],
    users: [],
    merchant: merchant._id,
  };

  const event = await createEvent(payload1);
  const event2 = await createEvent(payload2);

  console.log(`Event created ${event}`);
  console.log(`Event created ${event2}`);
};

(async () => {
  try {
    await connectDatabaseK8s();
    await seedEvent();
  } catch (err) {
    console.log('Error: ', err);
  }

  process.exit(0);
})();
