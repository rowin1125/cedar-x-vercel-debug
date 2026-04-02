import type { ScenarioData } from '@cedarjs/testing/api'

import type { Prisma, UserExample } from 'src/lib/db'

export const standard = defineScenario<Prisma.UserExampleCreateArgs>({
  userExample: {
    one: { data: { email: 'foo3955367@bar.com' } },
    two: { data: { email: 'foo7545969@bar.com' } },
  },
})

export type StandardScenario = ScenarioData<UserExample, 'userExample'>
