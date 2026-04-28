import { t } from 'elysia'

import { type UnwrapSchema } from 'elysia'

export const MapModel = {
    locationBody: t.Object({
        latitude: t.Number(),
        longitude: t.Number(),
        timestamp: t.String()
    })
} as const

export namespace MapModel {
    export type locationBody = UnwrapSchema<typeof MapModel.locationBody>
}