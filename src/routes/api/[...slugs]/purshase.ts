import { Elysia, t } from 'elysia';
import type { Context } from "elysia";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "$db/schema";
import { generateIdFromEntropySize } from "lucia";

interface CF extends Context {
    platform: App.Platform;
    locals: App.Locals;
}

const purchaseEndpoint = new Elysia({ aot: false, prefix: '/purchase' })
    .post("new", async ({ body, platform, locals }: CF & { body: any }) => {
        if (!locals.user) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const { quantity, pricePerUnit, rib } = body;

        // Validate request body
        if (!quantity || !pricePerUnit || !rib || 
            typeof quantity !== 'number' || 
            typeof pricePerUnit !== 'number' ||
            typeof rib !== 'string' ||
            !/^\d{24}$/.test(rib)) {
            return new Response(JSON.stringify({ error: "Invalid request body" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        try {
            const db = drizzle(platform?.env.DB as D1Database, { schema });
            const transactionId = generateIdFromEntropySize(8);

            // Create credit transaction record (simplified, moved payment details to payment table)
            await db.insert(schema.creditTransactionTable).values({
                id: transactionId,
                userId: locals.user.id,
                type: 'purchase',
                creditAmount: quantity,
                status: 'pending',
                createdAt: Date.now(),
                updatedAt: Date.now()
            });

            // Create payment record (contains all payment-related information)
            await db.insert(schema.paymentTable).values({
                id: generateIdFromEntropySize(8),
                userId: locals.user.id,
                creditTransactionId: transactionId,
                quantity,
                pricePerCredit: pricePerUnit,
                totalAmount: quantity * pricePerUnit,
                status: 'pending',
                paymentMethod: 'bank_transfer',
                accountNumber: rib,
                createdAt: Date.now(),
                updatedAt: Date.now()
            });
            // Add log entry
            await db.insert(schema.logTable).values({
                id: generateIdFromEntropySize(8),
                userId: locals.user.id,
                action: 'purchase_initiated',
                details: JSON.stringify({
                    transactionId,
                    quantity,
                    pricePerUnit,
                    totalAmount: quantity * pricePerUnit
                }),
                createdAt: Date.now()
            });

            return new Response(JSON.stringify({ 
                success: true,
                transactionId,
                message: "Purchase initiated successfully"
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });

        } catch (error) {
            console.error('Purchase error:', error);
            return new Response(JSON.stringify({ 
                error: "Failed to process purchase" 
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    }, {
        body: t.Object({
            quantity: t.Number(),
            pricePerUnit: t.Number(),
            rib: t.String()
        })
    });

export default purchaseEndpoint;

type RequestHandler = (v: { request: Request, platform: App.Platform, locals: App.Locals }) => Response | Promise<Response>;

export const GET: RequestHandler = ({ request, platform, locals }) => purchaseEndpoint.decorate({platform, locals}).handle(request);
export const POST: RequestHandler = ({ request, platform, locals }) => purchaseEndpoint.decorate({platform, locals}).handle(request);
export const PUT: RequestHandler = ({ request, platform, locals }) => purchaseEndpoint.decorate({platform, locals}).handle(request);
export const DELETE: RequestHandler = ({ request, platform, locals }) => purchaseEndpoint.decorate({platform, locals}).handle(request);
export const PATCH: RequestHandler = ({ request, platform, locals }) => purchaseEndpoint.decorate({platform, locals}).handle(request);
export const OPTIONS: RequestHandler = ({ request, platform, locals }) => purchaseEndpoint.decorate({platform, locals}).handle(request);
export const HEAD: RequestHandler = ({ request, platform, locals }) => purchaseEndpoint.decorate({platform, locals}).handle(request);