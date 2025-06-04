CREATE TABLE [dbo].[da_Machine_Status] (
  [StatusID] varchar(50) COLLATE Chinese_PRC_CI_AS  NULL,
  [MachineSN] varchar(50) COLLATE Chinese_PRC_CI_AS  NULL,
  [StatusTopic] varchar(50) COLLATE Chinese_PRC_CI_AS  NULL,
  [StatusTxt] varchar(max) COLLATE Chinese_PRC_CI_AS  NULL,
  [ModifyDate] datetime  NULL,
  [ModifyUserIP] varchar(50) COLLATE Chinese_PRC_CI_AS  NULL
)  
ON [PRIMARY]
TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[da_Machine_Status] SET (LOCK_ESCALATION = TABLE)