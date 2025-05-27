CREATE VIEW [dbo].[test] AS SELECT   cutid, LoadTime, 
StartTime, 
EndTime,
SpreadLayers,
MarkLayers, 
sets,
MarkPerimeter,
CutPerimeter, 
DATEDIFF(SECOND,StartTime, EndTime) AS hours,
SUBSTRING(FileName, CHARINDEX('L=', FileName) + 2, CHARINDEX(';', FileName,CHARINDEX('L=', FileName)) - CHARINDEX('L=', FileName) - 2) AS LValue,
	SUBSTRING(FileName, CHARINDEX('P=',FileName) + 2, CHARINDEX(')', FileName, CHARINDEX('P=', FileName)) - CHARINDEX('P=', FileName) - 2) AS PValue, 
  CAST(SUBSTRING(FileName, CHARINDEX('L=', FileName) + 2, CHARINDEX(';', FileName, CHARINDEX('L=', FileName))- CHARINDEX('L=', FileName) - 2) AS INT) * CAST(SUBSTRING(FileName, CHARINDEX('P=', FileName) + 2, 
                CHARINDEX(')', FileName, CHARINDEX('P=', FileName)) - CHARINDEX('P=', FileName) - 2) AS INT) AS total,
								CutSpeed, 
                MoveSpeed,
								CutPerimeter / DATEDIFF(MINUTE, StartTime, EndTime) AS speed
FROM      dbo.da_cut
WHERE DATEDIFF(SECOND, StartTime, EndTime)>0