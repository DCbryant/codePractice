

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
      const it = typeof generator === 'function' ? generator() : generator;
      function next(action) {
        const {done, value: effect} = it.next(action)
        if (!done) {
          if (typeof effect[Symbol.iterator] === 'function') { // 如果effect是生成器
            run(effect);
            next();
          }else if (effect.then) { // 如果effect是promise
            effect.then(next)
          } else {
            switch (effect.type) {
              case 'TAKE':
                channel.subscribe(effect.actionType, next)
                break;
              case 'PUT':
                dispatch(effect.action)
                next()
                break;
              case 'FORK':
                run(effect.task)
                next()
                break;
              case 'CALL':
                effect.fn(...effect.args).then(next)
                break;
              case 'CPS':
                effect.fn(...effect.args, next)
                break;
              default:
                break;
            }
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