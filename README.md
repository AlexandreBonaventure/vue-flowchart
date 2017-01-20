# vuex-jsdata-plugin
A simple attempt to help using jsdata alongside Vue.js:
This plugin syncing Vuex store with js-data
After each injection made by js-data some silent mutations are triggered to ensure vuex store is kept in sync with your ressources (and trigger reactivity).

Read more : https://github.com/js-data/js-data/issues/57

# Dependencies
This plugin is developed for
```
vuex@2.0.x
js-data@2.9.x
```

You're welcome to contribute to help compatibility issues.

# Usage
With NPM
 ```npm install vuex-plugin-jsdata```

Then when you setup vuex:
```
import jsdataPlugin from 'vuex-plugin-jsdata'
import yourJsDataStore from 'xxxx'

const plugins = [
  jsdataPlugin(yourJsDataStore),
  ... // other plugins
]

new Vuex.Store({
  // state,
  // actions,
  // mutations,
  plugins,
})

```
# How does it work ?
Every change in a js-data ressource are made with the DSInject method.
The plugin manage the state tree(vuex) under a DS module by listening to the afterInject hook (js-data)

## mutation
vuex-plugin-jsdata fire only one silent mutation :
``REFRESH_DATASTORE``

## getters
Although all local ressources injected in the jsdata-store can be found in the vuex store under the namespaced module DS, the plugin provide automatic getters for every model.

Ex:
```
// Register a model in js-data

export const User = store.defineResource({
  name: 'user',
  endpoint: 'users',
})

store.registerModel('User', User)
export default User
```
```
// in a .vue component
<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'User',
    props: {
      id: { required: true },
    },
    computed: {
      ...mapGetters(['DSUser']),
      user() {
        return this.DSUser[this.id]
      },
    },
  }
</script>

<template lang="jade">
  div.user
    pre {{ user | json }}
</template>

```

# Example
Clone the repo and run
```
npm install
npm run example-simple
```
more to come ...

# TO-DO
  [ ] handle config options
  [ ] some examples

# Contributions
are welcome :)
