// draft interface
export interface Draft {
    id: string;
    userId: string;
    title: string;
    companyType: string;
    publicationType: string;
    body: string;
    createdAt: number;
    updatedAt: number;
}

// publication interface
export interface Publication extends Draft {
    status: 'pending' | 'verified' | 'rejected';
    reviewedBy?: string;
    reviewedAt?: number;
    feedback?: string;
}

// purchase transaction interface
export interface purchaseTransaction {
    id: string;
    userId: string;
    creditTransactionId: string;
    quantity: number;
    pricePerCredit?: number;
    totalAmount?: number;
    status: 'pending' | 'verified' | 'rejected';
    paymentMethod?: 'bank_transfer' | 'card';
    accountNumber?: string;
    createdAt: number;
    updatedAt: number;
}