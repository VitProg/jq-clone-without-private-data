import { createDecorator, createResolve, createWire } from '@owja/ioc'
import { container } from './ioc.container'

export const inject = createDecorator(container);
export const wire = createWire(container);
export const resolve = createResolve(container);
