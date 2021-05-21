require('dotenv').config()
import { BootstrapConsole } from 'nestjs-console';
import { CliModule } from './modules/console/cli.module';

const bootstrap = new BootstrapConsole({
  module: CliModule,
  useDecorators: true
});
bootstrap.init().then(async (app) => {
  try {
    // init your app
    await app.init();
    // boot the cli
    await bootstrap.boot();
    process.exit(0);
  } catch (e) {
    process.exit(1);
  }
});
