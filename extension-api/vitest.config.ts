import { defineProject, mergeConfig } from 'vitest/config';
import configShared from '../vitest.config.mjs';

export default mergeConfig(
    configShared,
    defineProject({
        test: {
            environment: 'node',
            include: ['test/**/*'],
            exclude: ['build/'],
            coverage: {
                exclude: ['.xo-config.cjs', 'src/index.ts', 'src/setup-routes.ts', 'src/paymentHandler/brand-enum.ts']
            }
        }
    })
);
