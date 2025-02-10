export class Request {
    Id: number;
    TypeOfAbsence?: string;
    From?: Date;
    To?: Date;
    ReasonOfAbsence?: string;
    ManagerStatus?: boolean;
    HRStatus?: boolean;
    UserId?: number;
    FilePath?: string;
  
    
    constructor(
      Id: number,
      TypeOfAbsence?: string,
      From?: Date,
      To?: Date,
      ReasonOfAbsence?: string,
      ManagerStatus?: boolean,
      HRStatus?: boolean,
      UserId?: number,
      FilePath?: string
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
    }
  }
  