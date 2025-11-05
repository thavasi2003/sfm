import IAQTransaction from "../../../dao/IAQ_module/IAQ_Transactions/iaq_transaction_dao.js";

export default class IAQTransactionService {
    static async addIaqTransactionService(transactionDataArray) {
        try {
            const result = await IAQTransaction.addIaqTransaction(transactionDataArray);
            return result;
        } catch (err) {
            console.error('Error in addIaqTransactionService: ', err);
        }
    }

    static async getIaqTransactionsService() {
        try {
            const result = await IAQTransaction.getIaqTransaction();
            return result;
        } catch (err) {
            console.error('Error in getIaqTransactionsService: ', err);
        }
    }
}
