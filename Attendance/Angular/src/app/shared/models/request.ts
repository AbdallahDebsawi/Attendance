export class Request {
    Id: number;
    TypeOfAbsence?: number;
    From?: Date | string;
    To?: Date | string;
    ReasonOfAbsence?: string;
    ManagerStatus?: string;
    HRStatus?: string;
    UserId?: number;
    FilePath?: string;
    Name? : string;
  
    
    constructor(
      Id: number,
      TypeOfAbsence?: number,
      From?: Date,
      To?: Date,
      ReasonOfAbsence?: string,
      ManagerStatus?: string,
      HRStatus?: string,
      UserId?: number,
      FilePath?: string,
      Name? : string
    ) {
      this.Id = Id;
      this.TypeOfAbsence = TypeOfAbsence;
      this.From = From;
      this.To = To;
      this.ReasonOfAbsence = ReasonOfAbsence;
      this.ManagerStatus = ManagerStatus;
      this.HRStatus = HRStatus;
      this.UserId = UserId;
      this.FilePath = FilePath;
      this.Name = Name; 
    }
  }
  