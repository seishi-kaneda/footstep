import ApiPromised from './ApiPromised';

export default {
  mixins: [ ApiPromised ],
  methods: {
    getDailyListForDays: async function(startYmd, dayCount) {
      return await this.apiRuntimeSendMessage({
            'eventType': 'getDailyListForDays',
            'params': {
              'startYmd': startYmd,
              'dayCount': days
            }
          }
        );
    },
    getDailyData: async function(ymd) {
      return await this.apiRuntimeSendMessage({
            'eventType': 'getDailyData',
            'params': {
              'start': ymd
            }
          }
        );
    },
    stampFootmark: async function(footmark) {
      return await this.apiRuntimeSendMessage({
            'eventType': 'stampFootmark',
            'params': {
              'footmark': footmark
            }
          }
        );
    }
  }
}
