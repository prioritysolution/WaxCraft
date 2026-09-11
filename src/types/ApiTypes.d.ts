interface dataType {
  message: string;
  details: any;
  token?: any;
  org_id?: any;
  Org_Name?: any;
  Org_Add?: any;
  Org_Mob?: any;
  Org_Gst?: any;
  Org_Pan?: any;
  Fin_Start?: any;
  Fin_End?: any;
  Fin_Id?: any;
  User_Name?: any;
  user_name?: any;
  name?: any;
}

// Define the return type based on the expected response structure
export interface ApiResponse {
  status: number;
  data: dataType;
}
