

export default function createSagaMiddleware () {
  function createChannel() {
    const listener = {}
    function subscribe (actionType, cb) {
      listener[actionType] = cb
    }
    function publish (action) {
      if (listener[action.type]) {
        let temp = listener[action.type]
        delete listener[action.type]
        temp(action)
      }
    }
    return {subscribe, publish}
  }

  const channel = createChannel()

  function sagaMiddleware({getState,dispatch}) {
    function run(generator) {
      const it = generator()
      function next(action) {
        const {done, value: effect} = it.next(action)
        if (!done) {
          switch (effect.type) {
            case 'TAKE':
              channel.subscribe(effect.actionType, next)
              break;
            case 'PUT':
              dispatch(effect.action)
              next()
              break;
            default:
              break;
          }
        }
      }
      next()
    }


    sagaMiddleware.run = run
    return function (next) {
      return function (action) {
        channel.publish(action)
        next(action)
      }
    }
  }



  return sagaMiddleware

}