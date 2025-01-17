import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// User Table
export const userTable = sqliteTable("user", {
  id: text("id").notNull().primaryKey(),
  username: text("username").notNull().unique(),
  googleId: text("google_id").unique(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  role: text("role").notNull().default("user"), // 'admin', 'agent', 'user'
  credits: integer("credits").notNull().default(10), // Simplified credit tracking
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

// Session Table
export const sessionTable = sqliteTable("session", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: integer("expires_at").notNull(),
});

// Credit Transaction Table
export const creditTransactionTable = sqliteTable("credit_transaction", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  type: text("type").notNull(), // 'purchase', 'usage'
  creditAmount: integer("credit_amount").notNull(), // Positive for purchases, negative for usage
  status: text("status").notNull().default("pending"), // 'pending', 'verified', 'rejected'
  purchasedAt: integer("purchased_at"), // Timestamp of the purchase
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

// Payment Table
export const paymentTable = sqliteTable("payment", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  creditTransactionId: text("credit_transaction_id")
    .notNull()
    .references(() => creditTransactionTable.id),
  quantity: integer("quantity").notNull(), // Positive for purchases, negative for usage
  pricePerCredit: integer("price_per_credit"), // Only relevant for purchases
  totalAmount: integer("total_amount"), // Only relevant for purchases
  status: text("status").notNull().default("pending"), // 'pending', 'verified', 'rejected'
  verifiedBy: text("verified_by").references(() => userTable.id), // Agent/admin
  verifiedAt: integer("verified_at"), // Timestamp of the verification
  paymentMethod: text("payment_method"), // 'bank_transfer', 'card', etc.
  accountNumber: text("account_number"), // Only relevant for purchases
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

// Publication Table
export const publicationTable = sqliteTable("publication", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  title: text("title"),
  companyType: text("company_type").notNull(), // SARL, SARLAU, etc.
  publicationType: text("publication_type").notNull(), // Constitution de société, etc.
  body: text("body").notNull(),
  status: text("status").notNull().default("pending"), // 'pending', 'approved', 'rejected'
  reviewedBy: text("reviewed_by").references(() => userTable.id), // Agent/admin
  reviewedAt: integer("reviewed_at"), // Timestamp of the review
  feedback: text("feedback"), // Optional feedback from reviewer
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

// Draft Table
export const draftTable = sqliteTable("draft", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  title: text("title"),
  companyType: text("company_type"),
  publicationType: text("publication_type"),
  body: text("body"),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

// Log Table (optional for tracking events like credit purchases)
export const logTable = sqliteTable("log", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  action: text("action").notNull(), // 'purchase', 'publish', 'review', etc.
  details: text("details"), // Additional details about the action
  createdAt: integer("created_at").notNull(),
});