CREATE TABLE [dbo].[da_Machine_location] (
  [locationID] varchar(50) COLLATE Chinese_PRC_CI_AS  NULL,
  [location_Name] varchar(50) COLLATE Chinese_PRC_CI_AS  NULL,
  [A_PriviceId] varchar(50) COLLATE Chinese_PRC_CI_AS  NULL,
  [A_Privice] varchar(50) COLLATE Chinese_PRC_CI_AS  NULL,
  [A_CityId] varchar(50) COLLATE Chinese_PRC_CI_AS  NULL,
  [A_City] varchar(50) COLLATE Chinese_PRC_CI_AS  NULL,
  [A_CountryId] varchar(50) COLLATE Chinese_PRC_CI_AS  NULL,
  [A_Country] varchar(50) COLLATE Chinese_PRC_CI_AS  NULL,
  [EP_CompanyId] varchar(50) COLLATE Chinese_PRC_CI_AS  NULL,
  [EP_CompanyName] varchar(50) COLLATE Chinese_PRC_CI_AS  NULL,
  [Creadate] datetime  NULL,
  [Creauser] varchar(50) COLLATE Chinese_PRC_CI_AS  NULL,
  [CreauserId] varchar(50) COLLATE Chinese_PRC_CI_AS  NULL,
  [ModifyDate] datetime  NULL,
  [ModifyUserId] varchar(50) COLLATE Chinese_PRC_CI_AS  NULL,
  [ModifyUser] varchar(50) COLLATE Chinese_PRC_CI_AS  NULL,
  [Note] varchar(50) COLLATE Chinese_PRC_CI_AS  NULL
)  
ON [PRIMARY]
GO

ALTER TABLE [dbo].[da_Machine_location] SET (LOCK_ESCALATION = TABLE)