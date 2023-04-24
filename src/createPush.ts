import { computed, type Ref } from 'vue'
import { createID } from './utils'
import { NotificationTypes as NType } from './constants'
import type {
   IncomingOptions,
   StaticPushOptions,
   PushPromise,
   PushFn,
   PromiseResultPushOptions,
   PushStaticParam,
   PushPromiseParam,
} from './types'

type StoreFns = {
   setIncoming: (options: IncomingOptions) => void
   callItemMethod: (id: string, method: 'clear' | 'destroy') => void
   scheduleClearAll: () => void
   destroyAll: () => void
   enable: () => void
   disable: () => void
   isEnabled: Ref<boolean>
   count: Ref<number>
}

export function createPushFn({
   setIncoming,
   callItemMethod,
   scheduleClearAll,
   destroyAll,
   isEnabled,
   enable,
   disable,
   count,
}: StoreFns): PushFn {
   function create<T>(
      options: PushStaticParam<T> | PushPromiseParam<T>,
      status = NType.SUCCESS,
      id = createID()
   ) {
      if (typeof options === 'string') {
         options = { message: options }
      }

      setIncoming({
         ...(options as StaticPushOptions<T> | PromiseResultPushOptions<T>),
         id,
         type: status,
      })

      return {
         id,
         clear: () => callItemMethod(id, 'clear'),
         destroy: () => callItemMethod(id, 'destroy'),
      }
   }

   function push<T>(options: PushStaticParam<T>) {
      return create<T>(options)
   }

   push.clearAll = scheduleClearAll

   push.destroyAll = destroyAll

   push.success = <T>(options: PushStaticParam<T>) => create(options)

   push.error = <T>(options: PushStaticParam<T>) => create(options, NType.ERROR)

   push.warning = <T>(options: PushStaticParam<T>) => create(options, NType.WARNING)

   push.info = <T>(options: PushStaticParam<T>) => create(options, NType.INFO)

   push.enable = enable

   push.disable = disable

   push.isEnabled = isEnabled

   push.count = count

   push.hasItems = computed(() => count.value > 0)

   push.promise = ((options) => {
      const { id, clear, destroy } = create(options, NType.PROMISE)

      return {
         resolve: (options) => create(options, NType.PROMISE_RESOLVE, id),
         reject: (options) => create(options, NType.PROMISE_REJECT, id),
         clear,
         destroy,
      }
   }) satisfies PushPromise

   return push
}
