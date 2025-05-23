import { ZodSchema } from 'zod'

// Default values for environment variables
const defaultEnvValues: Record<string, string> = {
    POWERSYNC_URL: 'http://localhost:3000/api/powersync',
    POWERSYNC_TOKEN: 'local-development-token'
}

export const createEnv = (schema: ZodSchema) => {
    // Extract environment variables from Vite
    const envVars = Object.entries(import.meta.env).reduce<
        Record<string, string>
    >((acc, curr) => {
        const [key, value] = curr
        if (key.startsWith('VITE_')) {
            acc[key.replace('VITE_', '')] = value
        }
        return acc
    }, {})

    // Add default values for missing environment variables
    const envWithDefaults = { ...defaultEnvValues, ...envVars }
    
    // Parse with schema
    const parsedEnv = schema.safeParse(envWithDefaults)

    if (!parsedEnv.success) {
        console.warn('Environment variables missing, using defaults:', defaultEnvValues)
        
        // Try again with just the defaults to see if there are still issues
        const fallbackEnv = schema.safeParse(defaultEnvValues)
        
        if (!fallbackEnv.success) {
            throw new Error(
                `Invalid env provided even with defaults.
The following variables are still invalid:
${Object.entries(fallbackEnv.error.flatten().fieldErrors)
    .map(([k, v]) => `- ${k}: ${v}`)
    .join('\n')}
`
            )
        }
        
        return fallbackEnv.data
    }

    return parsedEnv.data
}