import { faker } from '@faker-js/faker';

import { createMerchant } from '@event-list/modules';
import { connectDatabaseK8s } from '@event-list/shared';

const seedMerchant = async () => {
  const payload = {
    email: faker.internet.email(),
    name: faker.company.name(),
    description: faker.lorem.paragraph(),
    logo: faker.image.abstract(),
    password: '123456',
    phoneNumber: faker.phone.number(),
  };

  const merchant = await createMerchant(payload);

  console.log(`Merchant created ${merchant}`);
  console.log(`Merchant id ${merchant._id.toString()}`);
};

(async () => {
  try {
    await connectDatabaseK8s();
    await seedMerchant();
  } catch (err) {
    console.log('Error: ', err);
  }

  process.exit(0);
})();
