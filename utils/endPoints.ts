const createApi = `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/`;

export const endPoints = {
  test: `${createApi}test`,
  login: `${createApi}User/ProcessLogin`,
  getForgotPasswordOtp: (email: string) =>
    `${createApi}User/GetOtp?email=${email}`,
  getForgotPasswordVerifyOtp: (email: string, otp: string) =>
    `${createApi}User/VerefyOtp?email=${email}&otp=${otp}`,
  updateForgotPassword: `${createApi}User/UpdtePassword`,
  getSidebar: (orgId: number | string) => `${createApi}Org/GetSidebar/${orgId}`,
  getItemCategory: (orgId: number | string, page: number, keyword: string) =>
    `${createApi}Org/Master/GetCatagory?org_id=${orgId}&page=${page}&keyword=${keyword}`,
  addItemCategory: `${createApi}Org/Master/AddCatagory`,
  updateItemCategory: `${createApi}Org/Master/UpdateCatagory`,
  deleteItemCategory: `${createApi}Org/Master/DeleteCatagory`,
  getItemModel: (orgId: number | string, page: number) =>
    `${createApi}Org/Master/GetModel?org_id=${orgId}&page=${page}`,
  getItemModelUnderCategory: (orgId: number | string, catId: string) =>
    `${createApi}Org/Master/GetCatagoryModel?org_id=${orgId}&cat_id=${catId}`,
  addItemModel: `${createApi}Org/Master/AddModel`,
  updateItemModel: `${createApi}Org/Master/UpdateModel`,
  deleteItemModel: `${createApi}Org/Master/DeleteModel`,
  getItemSize: (orgId: number | string, page: number) =>
    `${createApi}Org/Master/GetSize?org_id=${orgId}&page=${page}`,
  getItemSizeUnderModel: (orgId: number | string, modId: string) =>
    `${createApi}Org/Master/GetModuleSize?org_id=${orgId}&model_id=${modId}`,
  addItemSize: `${createApi}Org/Master/AddSize`,
  updateItemSize: `${createApi}Org/Master/UpdateSize`,
  deleteItemSize: `${createApi}Org/Master/DeleteSize`,
  getItemUnit: (orgId: number | string) =>
    `${createApi}Org/Master/GetUnitList?org_id=${orgId}`,
  addItemUnit: `${createApi}Org/Master/AddUnit`,
  updateItemUnit: `${createApi}Org/Master/UpdateUnit`,
  deleteItemUnit: `${createApi}Org/Master/DeleteUnit`,
  getItemColour: (
    orgId: number | string,
    page?: number,
    keyword?: string,
    perPage?: number
  ) =>
    `${createApi}Org/Master/GetColor?org_id=${orgId}${
      keyword ? `&keyword=${keyword}` : ""
    }${perPage ? `&per_page=${perPage}` : ""}${page ? `&page=${page}` : ""}`,
  addItemColour: `${createApi}Org/Master/AddColor`,
  updateItemColour: `${createApi}Org/Master/UpdateColor`,
  deleteItemColour: `${createApi}Org/Master/DeleteColor`,
  getSizeColour: (orgId: number | string, page: number, keyword: string) =>
    `${createApi}Org/Master/GetSizeColor?org_id=${orgId}&page=${page}&keyword=${keyword}`,
  getColourUnderSize: (orgId: number | string, sizeId: string) =>
    `${createApi}Org/Master/GetSizeWiseColor?org_id=${orgId}&size_id=${sizeId}`,
  addSizeColour: `${createApi}Org/Master/AddSizeColor`,
  updateSizeColour: `${createApi}Org/Master/UpdateSizeColor`,
  deleteSizeColour: `${createApi}Org/Master/DeleteSizeColor`,
  getAccountGroup: (orgId: number | string, page: number, keyword: string) =>
    `${createApi}Org/Master/GetAccountHead?org_id=${orgId}&page=${page}&keyword=${keyword}`,
  getAccountMainHead: (orgId: number | string, page: number, keyword: string) =>
    `${createApi}Org/Master/GetAcctMainHead?org_id=${orgId}&page=${page}&keyword=${keyword}`,
  addAccountGroup: `${createApi}Org/Master/AddAccountHead`,
  updateAccountGroup: `${createApi}Org/Master/UpdateAccountHead`,
  deleteAccountGroup: `${createApi}Org/Master/DeleteAccountHead`,
  getAccountLedgerList: (
    orgId: number | string,
    page: number,
    keyword: string
  ) =>
    `${createApi}Org/Master/GetAccountLedger?org_id=${orgId}&page=${page}&keyword=${keyword}`,
  addAccountLedger: `${createApi}Org/Master/AddAccountLedger`,
  updateAccountLedger: `${createApi}Org/Master/UpdateAccountLedger`,
  deleteAccountLedger: `${createApi}Org/Master/DeleteAccountLedger`,
  getPurchaseLedger: (orgId: number | string, page: number, keyword: string) =>
    `${createApi}Org/Master/GetPurchaseLedger?org_id=${orgId}&page=${page}&keyword=${keyword}`,
  getSalesLedger: (orgId: number | string, page: number, keyword: string) =>
    `${createApi}Org/Master/GetSalesLedger?org_id=${orgId}&page=${page}&keyword=${keyword}`,
  getItem: (orgId: number | string, page: number, keyword: string) =>
    `${createApi}Org/Master/GetItem?org_id=${orgId}&page=${page}&keyword=${keyword}`,
  getItemUnderCategory: (orgId: number | string, catId: string) =>
    `${createApi}Org/Master/GetCatItem?org_id=${orgId}&cat_id=${catId}`,
  addItem: `${createApi}Org/Master/AddItem`,
  updateItem: `${createApi}Org/Master/UpdateItem`,
  deleteItem: `${createApi}Org/Master/DeleteItem`,
  getPartyLedgerList: (orgId: number | string, type: string) =>
    `${createApi}Org/Master/GetPartyLedger?org_id=${orgId}&type=${type}`,
  getParty: (orgId: number | string, page: number, keyword: string) =>
    `${createApi}Org/Master/GetPartyList?org_id=${orgId}&page=${page}&keyword=${keyword}`,
  addParty: `${createApi}Org/Master/AddParty`,
  updateParty: `${createApi}Org/Master/UpdateParty`,
  deleteParty: `${createApi}Org/Master/DeleteParty`,
  getDesign: (
    orgId: number | string,
    page: number,
    keyword: string,
    perPage?: number
  ) =>
    `${createApi}Org/Master/GetDesign?org_id=${orgId}&page=${page}&keyword=${keyword}${
      perPage ? `&per_page=${perPage}` : ""
    }`,
  addDesign: `${createApi}Org/Master/AddDesign`,
  updateDesign: `${createApi}Org/Master/UpdateDesign`,
  deleteDesign: `${createApi}Org/Master/DeleteDesign`,
  getEmployee: (orgId: number | string, page: number, keyword: string) =>
    `${createApi}Org/Master/GetEmployeeList?org_id=${orgId}&page=${page}&keyword=${keyword}`,
  addEmployee: `${createApi}Org/Master/AddEmployee`,
  updateEmployee: `${createApi}Org/Master/UpdateEmployee`,
  deleteEmployee: `${createApi}Org/Master/DeleteEmployee`,
  getBankLedgerList: (orgId: number | string) =>
    `${createApi}Org/Master/GetBankLedger?org_id=${orgId}`,
  getBankAccount: (orgId: number | string) =>
    `${createApi}Org/Master/GetBankAccount?org_id=${orgId}`,
  addBankAccount: `${createApi}Org/Master/AddBankAccount`,
  updateBankAccount: `${createApi}Org/Master/UpdateBankAccount`,
  deleteBankAccount: `${createApi}Org/Master/DeleteBankAccount`,
  getItemRate: (orgId: number | string, itemId: string) =>
    `${createApi}Org/Master/GetItemRate?org_id=${orgId}&item_id=${itemId}`,
  addItemRate: `${createApi}Org/Master/PostItemRate`,
  deleteItemRate: `${createApi}Org/Master/DeleteItemRate`,
  getOrderParty: (
    orgId: number | string,
    page: number,
    keyword: string,
    partyId?: number | string
  ) =>
    `${createApi}Org/ProcessInventory/GetOrderParty?org_id=${orgId}&page=${page}&keyword=${keyword}&party_id=${partyId}`,
  addWorkProcess: `${createApi}Org/Master/AddWorkProcess`,
  updateWorkProcess: `${createApi}Org/Master/UpdateWorkProcess`,
  deleteWorkProcess: `${createApi}Org/Master/DeleteWorkProcess`,
  getWorkProcess: (orgId: number | string) =>
    `${createApi}Org/Master/GetWorkProcess?org_id=${orgId}`,
  getOrderDesign: (orgId: number | string, page: number, keyword: string) =>
    `${createApi}Org/ProcessInventory/GetOrderDesign?org_id=${orgId}&page=${page}&keyword=${keyword}`,
  getDesignDetails: (orgId: number | string, designId: string) =>
    `${createApi}Org/ProcessInventory/GetDesignDetails?org_id=${orgId}&design_id=${designId}`,
  getOrderBooking: (orgId: number | string, page: number, keyword: string) =>
    `${createApi}Org/ProcessInventory/GetActiveOrder?org_id=${orgId}&page=${page}&keyword=${keyword}`,
  addOrderBooking: `${createApi}Org/ProcessInventory/PostOrder`,
  deleteOrderBooking: `${createApi}Org/ProcessInventory/CancelOrder`,
  addSamplePrint: `${createApi}Org/ProcessInventory/PostSamplePrint`,
  getSamplePrint: (orgId: number | string, page: number, keyword: string) =>
    `${createApi}Org/ProcessInventory/GetSamplePrint?org_id=${orgId}&page=${page}&keyword=${keyword}`,
  deleteSamplePrint: `${createApi}Org/ProcessInventory/CancelSamplePrint`,
  getWorkStatus: (orgId: number | string, orderId: number) =>
    `${createApi}Org/ProcessInventory/GetWorkStatus?org_id=${orgId}&order_id=${orderId}`,
  addOrderProcess: `${createApi}Org/ProcessInventory/ProcessOrder`,
  addOrderFinalClose: `${createApi}Org/ProcessInventory/FinalOrderProcess`,
  getSalesVoucher: (
    orgId: number | string,
    partyId: string,
    page: number,
    keyword: string
  ) =>
    `${createApi}Org/ProcessInventory/GetInvoiseOrder?org_id=${orgId}&party_id=${partyId}&page=${page}&keyword=${keyword}`,
  addSalesVoucher: `${createApi}Org/ProcessInventory/PostInvoise`,
  getInvoiceListData: (orgId: number | string, page: number, keyword: string) =>
    `${createApi}Org/ProcessInventory/InvoiseList?org_id=${orgId}&page=${page}&keyword=${keyword}`,
  deleteInvoiceData: `${createApi}Org/ProcessInventory/CalcelInvoise`,
  getInvoicePrintData: (orgId: number | string, salesId: string | number) =>
    `${createApi}Org/ProcessInventory/GetInvoisePrint?org_id=${orgId}&sales_id=${salesId}`,
  getPurchaseParty: (orgId: number | string, page: number, keyword: string) =>
    `${createApi}Org/Master/GetPartyList?org_id=${orgId}&page=${page}&keyword=${keyword}`,
  getPurchaseVoucher: (orgId: number | string, page: number, keyword: string) =>
    `${createApi}Org/ProcessInventory/GetPurchaseList?org_id=${orgId}&page=${page}&keyword=${keyword}`,
  addPurchaseVoucher: `${createApi}Org/ProcessInventory/PostPurchase`,
  deletePurchaseVoucher: `${createApi}Org/ProcessInventory/CancelPurchase`,
  getItemRequisition: (orgId: number | string, page: number, keyword: string) =>
    `${createApi}Org/ProcessInventory/GetItemRequisition?org_id=${orgId}&page=${page}&keyword=${keyword}`,
  addGstBill: `${createApi}Org/ProcessInventory/AddGstBill`,
  getReceiptLedger: (orgId: number | string, page: number, keyword: string) =>
    `${createApi}Org/ProcessAccounting/GetLedgerList?org_id=${orgId}&page=${page}&keyword=${keyword}`,
  getCheckReceiptParty: (orgId: number | string, ledgerId: string | number) =>
    `${createApi}Org/ProcessAccounting/CheckParty?org_id=${orgId}&ledger_id=${ledgerId}`,
  getReceipt: (orgId: number | string, page: number) =>
    `${createApi}Org/ProcessAccounting/GetReceiptVoucher?org_id=${orgId}&page=${page}`,
  addReceipt: `${createApi}Org/ProcessAccounting/PostReceiptsVoucher`,
  deleteReceipt: `${createApi}Org/ProcessAccounting/CancelReceiptVoucher`,
  getBankBalance: (orgId: number | string, bankId: string, date: string) =>
    `${createApi}Org/ProcessAccounting/GetBankBalance?org_id=${orgId}&bank_id=${bankId}&date=${date}`,
  getPayment: (orgId: number | string, page: number) =>
    `${createApi}Org/ProcessAccounting/GetPaymentVoucher?org_id=${orgId}&page=${page}`,
  addPayment: `${createApi}Org/ProcessAccounting/PostPaymentVoucher`,
  deletePayment: `${createApi}Org/ProcessAccounting/CancelPaymentVoucher`,
  getBankDeposit: (orgId: number | string, page: number) =>
    `${createApi}Org/ProcessAccounting/GetBankDeposit?org_id=${orgId}&page=${page}`,
  addBankDeposit: `${createApi}Org/ProcessAccounting/PostBankDeposit`,
  deleteBankDeposit: `${createApi}Org/ProcessAccounting/CancelBankDeposit`,
  getBankWithdrawn: (orgId: number | string, page: number) =>
    `${createApi}Org/ProcessAccounting/GetBankWithdrwan?org_id=${orgId}&page=${page}`,
  addBankWithdrawn: `${createApi}Org/ProcessAccounting/PostBankWithdrwan`,
  deleteBankWithdrawn: `${createApi}Org/ProcessAccounting/CancelBankWithdrwan`,
  getBankTransfer: (orgId: number | string, page: number) =>
    `${createApi}Org/ProcessAccounting/GetBankTransfer?org_id=${orgId}&page=${page}`,
  addBankTransfer: `${createApi}Org/ProcessAccounting/PostBankTransfer`,
  deleteBankTransfer: `${createApi}Org/ProcessAccounting/CancelBankTransfer`,
  getTrailorUser: (orgId: string | number) =>
    `${createApi}Org/ProcessAccounting/GetTrailorUser?org_id=${orgId}`,
  getTrailorBalance: (orgId: string | number, userId: string, date: string) =>
    `${createApi}Org/ProcessAccounting/GetTrailorBalance?org_id=${orgId}&user_id=${userId}&date=${date}`,
  addTrailorTransaction: `${createApi}Org/ProcessAccounting/AddTlrTrans`,
  getOrderBook: (
    fromDate: string,
    toDate: string,
    partyId: string,
    orgId: string | number
  ) =>
    `${createApi}Org/ProcessInventoryReport/OrderBook?org_id=${orgId}&form_date=${fromDate}&to_date=${toDate}&party_id=${
      partyId || "0"
    }`,
  getSalesReport: (
    fromDate: string,
    toDate: string,
    partyId: string,
    orgId: string | number
  ) =>
    `${createApi}Org/ProcessInventoryReport/SalesRegister?org_id=${orgId}&form_date=${fromDate}&to_date=${toDate}&party_id=${
      partyId || "0"
    }`,
  getPurchaseReport: (
    fromDate: string,
    toDate: string,
    partyId: string,
    orgId: string | number
  ) =>
    `${createApi}Org/ProcessInventoryReport/PurchaseRegister?org_id=${orgId}&form_date=${fromDate}&to_date=${toDate}&party_id=${
      partyId || "0"
    }`,
  getPartyLedger: (
    fromDate: string,
    toDate: string,
    partyId: string,
    type: string,
    orgId: string | number
  ) =>
    `${createApi}Org/ProcessInventoryReport/GetPartyLedger?org_id=${orgId}&form_date=${fromDate}&to_date=${toDate}&party_id=${
      partyId || "0"
    }&type=${type}`,
  getPartyItemLedger: (
    fromDate: string,
    toDate: string,
    partyId: string,
    orgId: string | number
  ) =>
    `${createApi}Org/ProcessInventoryReport/GetPartyItemLedger?org_id=${orgId}&frm_date=${fromDate}&to_date=${toDate}&party_id=${
      partyId || "0"
    }`,
  getDayBook: (asOnDate: string, orgId: string | number) =>
    `${createApi}Org/ProcessAccountingReport/Daybook?org_id=${orgId}&date=${asOnDate}
          }`,
  getCashBook: (asOnDate: string, orgId: string | number) =>
    `${createApi}Org/ProcessAccountingReport/CashBook?org_id=${orgId}&date=${asOnDate}
          }`,
  getBankLedger: (
    fromDate: string,
    toDate: string,
    bankId: string,
    orgId: string | number
  ) =>
    `${createApi}Org/ProcessAccountingReport/BankLedger?org_id=${orgId}&frm_date=${fromDate}&to_date=${toDate}&bank_id=${
      bankId || "0"
    }`,
  getReportLedgerList: (
    orgId: number | string,
    page: number,
    keyword: string
  ) =>
    `${createApi}Org/ProcessAccountingReport/GetLedger?org_id=${orgId}&page=${page}&keyword=${keyword}`,
  getAccountLedger: (
    fromDate: string,
    toDate: string,
    ledgerId: string,
    orgId: string | number
  ) =>
    `${createApi}Org/ProcessAccountingReport/GetAccountLedger?org_id=${orgId}&form_date=${fromDate}&to_date=${toDate}&ledger_id=${
      ledgerId || "0"
    }`,
  getTrailorCashbook: (
    asOnDate: string,
    userId: string,
    orgId: string | number
  ) =>
    `${createApi}Org/ProcessAccountingReport/CashBook?org_id=${orgId}&user_id=${userId}&date=${asOnDate}
                        }`,
  getUserRoles: `${createApi}Org/GetUserRele`,
  getUserList: (orgId: string | number) =>
    `${createApi}Org/GetUserList?org_id=${orgId}`,
  addUser: `${createApi}Org/AddUser`,
  updateUser: `${createApi}Org/UpdateUser`,
  getModuleData: (orgId: string | number) =>
    `${createApi}Org/GetRoleMenue?org_id=${orgId}`,
  addRoleAssign: `${createApi}Org/MapUserRole`,
  getUserAccess: (orgId: string | number) =>
    `${createApi}Org/GetAccessUserList?org_id=${orgId}`,
  updateUserAccess: `${createApi}Org/UpdateUserAccess`,
  getUserProfile: `${createApi}Org/GetUserProfile`,
  updateUserProfile: `${createApi}Org/UpdateUserProfile`,
  getLogout: `${createApi}Org/LogOut`,
  getDashboardStats: (
    orgId: string | number,
    formDate: string,
    toDate: string,
    partyId: string | number = "0"
  ) =>
    `${createApi}Org/GetDashboardStats/${orgId}?form_date=${formDate}&to_date=${toDate}&party_id=${partyId}`,
};
