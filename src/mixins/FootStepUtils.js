import ApiPromised from './ApiPromised';


const ExportFileHeader = "FootStep LocalStrage Data.";

const KeyFootstepFolderId = "KeyFootstepFolderId";

const MaxStampCount = 5;

const TitleSplitChar = '^';

export default {
  mixins: [ ApiPromised ],
  methods: {
    getCurrentTab : async function(callback) {
      const queryInfo = {
        active: true,
        currentWindow: true
      };

      const tabs = await this.apiTabsQuery(queryInfo);
      return tabs[0];
    }
  }
}
