CREATE TABLE [dbo].[da_Machine_fault] (
  [id] varchar(50) COLLATE Chinese_PRC_CI_AS  NOT NULL,
  [MachineID] varchar(50) COLLATE Chinese_PRC_CI_AS  NULL,
  [EP_Machine] varchar(50) COLLATE Chinese_PRC_CI_AS  NULL,
  [Code] varchar(50) COLLATE Chinese_PRC_CI_AS  NULL,
  [Description] varchar(max) COLLATE Chinese_PRC_CI_AS  NULL,
  [Occurrence_Time] datetime  NULL,
  [Execution_Time] datetime  NULL,
  [End_Time] datetime  NULL,
  [Cause] varchar(max) COLLATE Chinese_PRC_CI_AS  NULL,
  [Solution] varchar(50) COLLATE Chinese_PRC_CI_AS  NULL,
  [PartsList] varchar(50) COLLATE Chinese_PRC_CI_AS  NULL,
  [Costs] float(53)  NULL,
  [Operator] varchar(50) COLLATE Chinese_PRC_CI_AS  NULL,
  [Levele] int  NULL,
  [CreateDate] datetime  NULL,
  [Creauser] varchar(50) COLLATE Chinese_PRC_CI_AS  NULL,
  [CreauserId] varchar(50) COLLATE Chinese_PRC_CI_AS  NULL,
  [ModifyDate] datetime  NULL,
  [Modifyuser] varchar(50) COLLATE Chinese_PRC_CI_AS  NULL,
  [ModifyUserId] varchar(50) COLLATE Chinese_PRC_CI_AS  NULL,
  [Delete_Mark] int  NULL,
  [EP_CompanyId] varchar(50) COLLATE Chinese_PRC_CI_AS  NULL,
  [EP_CompanyName] varchar(50) COLLATE Chinese_PRC_CI_AS  NULL,
  CONSTRAINT [PK_da_Machine_fault] PRIMARY KEY CLUSTERED ([id])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)  
ON [PRIMARY]
)  
ON [PRIMARY]
TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[da_Machine_fault] SET (LOCK_ESCALATION = TABLE)