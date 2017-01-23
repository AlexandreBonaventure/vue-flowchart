import { forEach } from 'lodash-es'

export default {
  methods: {
    setState(data) {
      forEach(data, (val, key) => this.$set(this, key, val))
    }
  },
}
