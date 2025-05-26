CREATE TABLE [dbo].[da_Machine] (
  [MachineID] varchar(50) COLLATE Chinese_PRC_CI_AS  NOT NULL,
  [MachineSN] varchar(50) COLLATE Chinese_PRC_CI_AS  NULL,
  [Machine_Tpye] varchar(50) COLLATE Chinese_PRC_CI_AS  NULL,
  [Machine_Name] varchar(50) COLLATE Chinese_PRC_CI_AS  NULL,
  [Machine_Model] varchar(50) COLLATE Chinese_PRC_CI_AS  NULL,
  [Purchase_Date] datetime  NULL,
  [Status] varchar(50) COLLATE Chinese_PRC_CI_AS  NULL,
  [Location] varchar(50) COLLATE Chinese_PRC_CI_AS  NULL,
  [Warranty] varchar(50) COLLATE Chinese_PRC_CI_AS  NULL,
  [Supplier] varchar(50) COLLATE Chinese_PRC_CI_AS  NULL,
  [Department] varchar(50) COLLATE Chinese_PRC_CI_AS  NULL,
  [DepartmentId] varchar(50) COLLATE Chinese_PRC_CI_AS  NULL,
  [Creadate] datetime  NULL,
  [Creauser] varchar(50) COLLATE Chinese_PRC_CI_AS  NULL,
  [CreauserId] varchar(50) COLLATE Chinese_PRC_CI_AS  NULL,
  [ModifyDate] datetime  NULL,
  [ModifyUserId] varchar(50) COLLATE Chinese_PRC_CI_AS  NULL,
  [ModifyUser] varchar(50) COLLATE Chinese_PRC_CI_AS  NULL,
  [Note] varchar(255) COLLATE Chinese_PRC_CI_AS  NULL,
  [EP_CompanyId] varchar(50) COLLATE Chinese_PRC_CI_AS  NULL,
  [EP_CompanyName] varchar(50) COLLATE Chinese_PRC_CI_AS  NULL,
  CONSTRAINT [PK_da_Machine] PRIMARY KEY CLUSTERED ([MachineID])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)  
ON [PRIMARY]
)  
ON [PRIMARY]
GO

ALTER TABLE [dbo].[da_Machine] SET (LOCK_ESCALATION = TABLE)