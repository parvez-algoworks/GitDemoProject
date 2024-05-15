trigger InsightFileTrigger on ContentDocumentLink (before insert) {
   InsightReportHandler.checkMasterFiles(Trigger.new);
    }