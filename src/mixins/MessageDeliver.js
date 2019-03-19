
export default {
  mixins: [ ApiPromised ],
  methods: {
    getDailyListForDays: async function(startYmd, dayCount) {
      return await apiRuntimeSendMessage({
            'eventType': 'getDailyListForDays',
            'params': {
              'startYmd': startYmd,
              'dayCount': days
            }
          }
        );
    },
    getDailyData: async function(ymd) {
      return await apiRuntimeSendMessage({
            'eventType': 'getDailyData',
            'params': {
              'start': ymd
            }
          }
        );
    },
    stampFootmark: async function(footmark) {
      return await apiRuntimeSendMessage({
            'eventType': 'stampFootmark',
            'params': {
              'footmark': footmark
            }
          }
        );
    }
  }
}
