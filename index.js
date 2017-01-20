import { set, delete as remove } from "vue"
import get from "lodash.get"

const config = {}
const MUTATION = 'datastore/REFRESH_DATASTORE'
const MUTATION_DELETE = 'datastore/DELETE'
let DStore

export default function(_DStore, {
  namespace = 'DS',
  silent = true,
} = {}) {
  DStore = _DStore
  if (!DStore) {
    console.warn('You must initialize vuex-jsdata-plugin with a DS store object from js-data')
    return
  }

  return function(store) {
    const ressources = Object.values(DStore.definitions)
    let getters = {}
    let moduleState = {}
    set(store.state, namespace, {}) // init state
    getters[namespace] = (state) => state[namespace] // set global getter

    ressources.forEach(({ class: ressourceName }) => {
      const key = `${namespace}${ressourceName}`
      getters[key] = (state) => state[ressourceName]
      set(moduleState, ressourceName, {})
    })

    const module = {
      state: moduleState, // init ressource state
      getters,
      mutations: {
        [MUTATION](state, { type, data }) {
          const { id } = data
          const namespace = state[type]
          set(namespace, id, Object.assign(JSON.parse(JSON.stringify(data)))) // assign to trigger reactivity
        },
        [MUTATION_DELETE](state, { type, data }) {
          const { id } = data
          const namespace = state[type]
          remove(namespace, id) // assign to trigger reactivity
        },
      },
    }
    store.registerModule('DS', module)

    function commitRefresh(res, data) {
      const commit = instance => {
        // set(instance, '__refresh', !instance.__refresh)
        store.commit(MUTATION, {
          type: res.class,
          data: instance,
        }, { silent })
      }
      if (Array.isArray(data)) data.forEach(commit)
      else commit(data)
    }
    function commitDelete(res, data) {
      const commit = instance => {
        store.commit(MUTATION_DELETE, {
          type: res.class,
          data: instance,
        }, { silent })
      }
      if (Array.isArray(data)) data.forEach(commit)
      else commit(data)
    }

    ressources.forEach((ressource) => {
      ressource.on('Refresh', (res, id) => {
        const data = res.get(id)
        commitRefresh(res, data)
      })
      ressource.on('DS.change', (res, data) => commitRefresh(res, data))
      ressource.on('DS.afterDestroy', (res, data) => {
        res.off('DS.change')
        commitDelete(res, data)
        setTimeout(() => { // FIXME
          res.on('DS.change', function (res, data) {
            commitRefresh(res, data);
          });
        }, 100)
      })
    })
  }
}

export function mapRessources(ressources = []) {
  function generateGetter(name, key) {
    return function getter() {
      const id = get(this, key)
      if (id === null || id === undefined || !this.$store.state.DS[name][id]) {
        console.warn('no ressource with id:' + id)
        return undefined
      } // !IMPORTANT trigger reactivity
      return DStore.get(name, id);
    }
  }
  const ressourceGetters = ressources.reduce((sum, ressource) => {
    const getterName = Object.keys(ressource)[0]
    ressource[getterName] = generateGetter(...ressource[getterName])
    return Object.assign(sum, ressource)
  }, {})
  return ressourceGetters
}
