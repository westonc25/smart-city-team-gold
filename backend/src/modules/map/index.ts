import { Elysia } from 'elysia'
import { authMiddleware } from '../auth/middleware'
import { MapModel } from './model'
import { MapService } from './service'

export const map = new Elysia({prefix: '/map'})
    .use(authMiddleware)

    .post('/location', ({ body , user }) => {
        return MapService.updateLocation(String(user.id), body.latitude, body.longitude, body.timestamp)
    }, { body: MapModel.locationBody })