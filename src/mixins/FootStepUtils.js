import ApiPromised from './ApiPromised';


const ExportFileHeader = "FootStep LocalStrage Data.";

const KeyFootstepFolderId = "KeyFootstepFolderId";

const MaxStampCount = 5;

const TitleSplitChar = '^';

export default {
  mixins: [ ApiPromised ],
  methods: {
    getCurrentTab : function(callback) {
      const queryInfo = {
        active: true,
        currentWindow: true
      };

      chrome.tabs.query(queryInfo, (tabs) => {
        callback(tabs[0]);
      });
    }
  }
}
