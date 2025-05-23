import { z } from 'zod'
import { createEnv } from '@/lib/create-env'

// Define schema with defaults for better developer experience
const EnvSchema = z.object({
    POWERSYNC_URL: z.string().default('http://localhost:3000/api/powersync'),
    POWERSYNC_TOKEN: z.string().default('local-development-token')
})

const env = createEnv(EnvSchema) as z.TypeOf<typeof EnvSchema>
export default env