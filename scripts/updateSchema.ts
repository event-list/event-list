import fs from 'fs';
import { printSchema } from 'graphql/utilities';
import path from 'path';
import { promisify } from 'util';

import { schema as schemaAdminServer } from '../apps/server-admin/src/schema';
import { schema as schemaServer } from '../apps/server/src/schema';

const writeFileAsync = promisify(fs.writeFile);

const cwd = process.cwd();

(async () => {
  const configs = [
    {
      schema: schemaServer,
      path: path.join(cwd, `./apps/web/data/schema.graphql`),
    },
    {
      schema: schemaAdminServer,
      path: path.join(cwd, `./apps/admin/data/schema.graphql`),
    },
  ];

  await Promise.all([
    ...configs.map(async (config) => {
      console.log(config.path);
      await writeFileAsync(config.path, printSchema(config.schema));
    }),
  ]);

  process.exit(0);
})();
