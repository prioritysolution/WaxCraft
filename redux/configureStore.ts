"use client";
import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";

import demoSlice from "./demoReducer"; // <--- Not for use, this is just an example
import sidebarSlice from "@/container/sidebar/SidebarReducer";
import itemCategorySlice from "@/container/master/itemCategory/ItemCategoryReducer";
import itemModelSlice from "@/container/master/itemModel/ItemModelReducer";
import itemSizeSlice from "@/container/master/itemSize/ItemSizeReducer";
import itemUnitSlice from "@/container/master/itemUnit/ItemUnitReducer";
import itemColourSlice from "@/container/master/itemColour/ItemColourReducer";
import sizeColourSlice from "@/container/master/sizeColour/SizeColourReducer";
import itemSlice from "@/container/master/item/ItemReducer";
import accountGroupSlice from "@/container/master/accountGroup/AccountGroupReducer";
import accountLedgerSlice from "@/container/master/accountLedger/AccountLedgerReducer";
import partySlice from "@/container/master/party/PartyReducer";
import designSlice from "@/container/master/design/DesignReducer";
import employeeSlice from "@/container/master/employee/EmployeeReducer";
import bankAccountSlice from "@/container/master/bankAccount/BankAccountReducer";
import workProcessSlice from "@/container/master/workProcess/WorkProcessReducer";
import orderBookingSlice from "@/container/inventoryVoucher/orderBooking/OrderBookingReducer";
import salesVoucherSlice from "@/container/inventoryVoucher/salesVoucher/SalesVoucherReducer";
import purchaseVoucherSlice from "@/container/inventoryVoucher/purchaseVoucher/PurchaseVoucherReducer";
import gstBillSlice from "@/container/inventoryVoucher/gstBill/GstBillReducer";
import samplePrintSlice from "@/container/inventoryVoucher/samplePrint/SamplePrintReducer";
import receiptSlice from "@/container/accountVoucher/receipt/ReceiptReducer";
import paymentSlice from "@/container/accountVoucher/payment/PaymentReducer";
import bankDepositSlice from "@/container/accountVoucher/bankDeposit/BankDepositReducer";
import bankWithdrawnSlice from "@/container/accountVoucher/bankWithdrawn/BankWithdrawnReducer";
import bankTransferSlice from "@/container/accountVoucher/bankTransfer/BankTransferReducer";
import trailorTransactionSlice from "@/container/accountVoucher/trailorTransaction/TrailorTransactionReducer";
import orderBookSlice from "@/container/inventoryReport/orderBook/OrderBookReducer";
import salesReportSlice from "@/container/inventoryReport/salesReport/SalesReportReducer";
import purchaseReportSlice from "@/container/inventoryReport/purchaseReport/PurchaseReportReducer";
import partyLedgerSlice from "@/container/inventoryReport/partyLedger/PartyLedgerReducer";
import partyItemLedgerSlice from "@/container/inventoryReport/partyItemLedger/PartyItemLedgerReducer";
import dayBookSlice from "@/container/accountingReport/dayBook/DayBookReducer";
import cashBookSlice from "@/container/accountingReport/cashBook/CashBookReducer";
import bankLedgerSlice from "@/container/accountingReport/bankLedger/BankLedgerReducer";
import accountLedgerReportSlice from "@/container/accountingReport/accountLedger/AccountLedgerReducer";
import trailorCashbookSlice from "@/container/accountingReport/trailorCashbook/TrailorCashbookReducer";
import addUserSlice from "@/container/tools/addUser/AddUserReducer";
import roleAssignSlice from "@/container/tools/roleAssign/RoleAssignReducer";
import userAccessSlice from "@/container/tools/userAccess/UserAccessReducer";

export const store = configureStore({
  reducer: {
    abc: demoSlice, // <--- Not for use, this is just an example
    sidebar: sidebarSlice,
    itemCategory: itemCategorySlice,
    itemModel: itemModelSlice,
    itemSize: itemSizeSlice,
    itemUnit: itemUnitSlice,
    itemColour: itemColourSlice,
    sizeColour: sizeColourSlice,
    item: itemSlice,
    accountGroup: accountGroupSlice,
    accountLedger: accountLedgerSlice,
    party: partySlice,
    design: designSlice,
    employee: employeeSlice,
    bankAccount: bankAccountSlice,
    workProcess: workProcessSlice,
    orderBooking: orderBookingSlice,
    salesVoucher: salesVoucherSlice,
    purchaseVoucher: purchaseVoucherSlice,
    gstBill: gstBillSlice,
    samplePrint: samplePrintSlice,
    receipt: receiptSlice,
    payment: paymentSlice,
    bankDeposit: bankDepositSlice,
    bankWithdrawn: bankWithdrawnSlice,
    bankTransfer: bankTransferSlice,
    trailorTransaction: trailorTransactionSlice,
    orderBook: orderBookSlice,
    salesReport: salesReportSlice,
    purchaseReport: purchaseReportSlice,
    partyLedger: partyLedgerSlice,
    partyItemLedger: partyItemLedgerSlice,
    dayBook: dayBookSlice,
    cashBook: cashBookSlice,
    bankLedger: bankLedgerSlice,
    accountLedgerReport: accountLedgerReportSlice,
    trailorCashbook: trailorCashbookSlice,
    addUser: addUserSlice,
    roleAssign: roleAssignSlice,
    userAccess: userAccessSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});
