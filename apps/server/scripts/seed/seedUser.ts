import { faker } from '@faker-js/faker';

import { createUser } from '@event-list/modules';
import { connectDatabaseK8s } from '@event-list/shared';

const seedUser = async () => {
  const payload = {
    name: faker.name.firstName(),
    email: faker.internet.email(),
    password: '123456',
    gender: 'M',
  };

  const user = await createUser(payload);

  console.log(`User created ${user}`);
};

(async () => {
  try {
    await connectDatabaseK8s();
    await seedUser();
  } catch (err) {
    console.log('Error: ', err);
  }

  process.exit(0);
})();
