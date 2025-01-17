import { generateIdFromEntropySize } from 'lucia';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { drizzle } from 'drizzle-orm/d1';
import { eq, count, not } from 'drizzle-orm';
import * as schema from '$db/schema';
import {sendContactFormEmail} from '$lib/emailing/brevo';
import { dev } from "$app/environment";

export const load: PageServerLoad = async (event) => {
    if(!event.locals.user) {
        return redirect(301, '/login')
    }

    if (event.locals.user.role == 'user') {
        return redirect(301, '/');
    }

    const db = drizzle(event.platform?.env.DB as D1Database, { schema });

    //get all pending publications

    const unverifiedPubs = await db.query.publicationTable.findMany({
        where: eq(schema.publicationTable.status, 'pending')
    });

    // get all unverified purshases
    const unverifiedPurshases = await db.query.paymentTable.findMany({
        where: eq(schema.paymentTable.status, "pending")
    })
    
    //get all agents
    
    

    //get stats of agent
    //Count of publication verified by agent
    const vPubStat = await db.select({ count: count() }).from(schema.publicationTable).where(eq(schema.publicationTable.reviewedBy, event.locals.user.id))
    //Count of purshase verified by agent
    const vPurStat = await db.select({ count: count() }).from(schema.paymentTable).where(eq(schema.paymentTable.verifiedBy, event.locals.user.id))

    if (event.locals.user.role !== 'admin') {
        return {
            username: event.locals.user.username || null,
            firstName: event.locals.user.firstName || null,
            lastName: event.locals.user.lastName || null,
            email: event.locals.user.email || null,
            credits: event.locals.user.credits || 0,
            role: event.locals.user.role || null,
            unverifiedPubs,
            unverifiedPurshases,
            vPubStat: vPubStat[0].count || 0,
            vPurStat: vPurStat[0].count || 0
        };
    }

    //get all agents
    const agents = await db.query.userTable.findMany({
        where: eq(schema.userTable.role, 'agent')
    });

    return {
        username: event.locals.user.username || null,
        firstName: event.locals.user.firstName || null,
        lastName: event.locals.user.lastName || null,
        email: event.locals.user.email || null,
        credits: event.locals.user.credits || 0,
        role: event.locals.user.role || null,
        unverifiedPubs,
        unverifiedPurshases,
        vPubStat: vPubStat[0].count || 0,
        vPurStat: vPurStat[0].count || 0,
        agents
    };  
};

export const actions = {
    acceptPub: async (event) => {
        if (!event.locals.user) {
            return fail(401, {
                message: 'unauthenticated'
            });
        }
        if (!event.locals.user.role || event.locals.user.role === 'user') {
            return fail(403, {
                message: 'Forbidden'
            });
        }

        const db = drizzle(event.platform?.env.DB as D1Database, { schema });
        const form = await event.request.formData();
        const id = form.get('pubId') as string;


        const pub = await db.query.publicationTable.findFirst({
            where: eq(schema.publicationTable.id, id)
        });
        if (!pub) {
            return {
                Success: false,
                message: 'Publication not found'
            }
        }
        if (pub.reviewedBy) {
            return {
                Success: false,
                message: 'Publication already reviewed'
            }
        }
        const updated = await db.update(schema.publicationTable).set({
            status: 'verified',
            reviewedBy: event.locals.user.id,
            reviewedAt: Date.now()
        }).where(eq(schema.publicationTable.id, id))
        return {
            Success: updated.success===true,
            message: 'Publication verified'
        };
    },
    rejectPub: async (event) => {
        if (!event.locals.user) {
            return fail(401, {
                message: 'unauthenticated'
            });
        }
        if (!event.locals.user.role || event.locals.user.role === 'user') {
            return fail(403, {
                message: 'Forbidden'
            });
        }

        const db = drizzle(event.platform?.env.DB as D1Database, { schema });
        const form = await event.request.formData();
        const id = form.get('pubId') as string;


        const pub = await db.query.publicationTable.findFirst({
            where: eq(schema.publicationTable.id, id)
        });
        if (!pub) {
            return {
                Success: false,
                message: 'Publication not found'
            }
        }
        if (pub.reviewedBy) {
            return {
                Success: false,
                message: 'Publication already reviewed'
            }
        }
        const updated = await db.update(schema.publicationTable).set({
            status: 'rejected',
            reviewedBy: event.locals.user.id,
            reviewedAt: Date.now()
        }).where(eq(schema.publicationTable.id, id))
        return {
            Success: updated.success===true,
            message: 'Publication verified'
        };
    },
    acceptPur: async (event) => {
        if (!event.locals.user) {
            return fail(401, {
                message: 'unauthenticated'
            });
        }
        if (!event.locals.user.role || event.locals.user.role === 'user') {
            return fail(403, {
                message: 'Forbidden'
            });
        }

        const db = drizzle(event.platform?.env.DB as D1Database, { schema });
        const form = await event.request.formData();
        const id = form.get('id') as string;

        const pur = await db.query.paymentTable.findFirst({
            where: eq(schema.paymentTable.id, id)
        });

        if (!pur) {
            return {
                Success: false,
                message: 'Purchase not found'
            }
        }

        if (pur.verifiedBy) {
            return {
                Success: false,
                message: 'Purchase already verified'
            }
        }

        const updateCredits = await db.update(schema.userTable).set({
            credits: parseInt(event.locals.user.credits) + (pur.totalAmount || 0)
        }).where(eq(schema.userTable.id, pur.userId))

        if (!updateCredits.success) {
            return {
                Success: false,
                message: 'Failed to update user credits'
            }
        }
        
        const updatePur = await db.update(schema.paymentTable).set({
            status: 'verified',
            verifiedBy: event.locals.user.id,
            verifiedAt: Date.now()
        }).where(eq(schema.paymentTable.id, id))
        return {
            Success: updatePur.success===true,
            message: 'Purchase verified'
        };
    },
    rejectPur: async (event) => {
        if (!event.locals.user) {
            return fail(401, {
                message: 'unauthenticated'
            });
        }
        if (!event.locals.user.role || event.locals.user.role === 'user') {
            return fail(403, {
                message: 'Forbidden'
            });
        }
        const db = drizzle(event.platform?.env.DB as D1Database, { schema });
        const form = await event.request.formData();
        const id = form.get('id') as string;
        
        const pur = await db.update(schema.paymentTable).set({
            status: 'rejected',
            verifiedBy: event.locals.user.id,
            verifiedAt: Date.now()
        }).where(eq(schema.paymentTable.id, id))
        return {
            Success: pur.success===true,
            message: 'Purchase verified'
        };
    },
    makeAgent: async (event) => {
        if (!event.locals.user) {
            return fail(401, {
                message: 'unauthenticated'
            });
        }
        if (!event.locals.user.role || event.locals.user.role !== "admin") {
            return fail(403, {
                message: 'Forbidden'
            });
        }

        const db = drizzle(event.platform?.env.DB as D1Database, { schema });
        const form = await event.request.formData();
        const email = form.get('email') as string;
        const user = await db.query.userTable.findFirst({
            where: eq(schema.userTable.email, email)
        });
        if (!user) {
            return {
                Success: false,
                message: 'User not found'
            }
        }
        if (user.role === 'agent') {
            return {
                Success: false,
                message: 'User is already an agent'
            }
        }
        if (user.id == event.locals.user.id) {
            return {
                Success: false,
                message: "Vous ne pouvez pas se rendre un agent!"
            }
        }
        const updated = await db.update(schema.userTable).set({
            role: 'agent'
        }).where(eq(schema.userTable.email, email))
        return {
            Success: updated.success,
            message: 'User is now an agent'
        };
    },
    removeAgent: async (event) => {
        if (!event.locals.user) {
            return fail(401, {
                message: 'unauthenticated'
            });
        }
        if (!event.locals.user.role || event.locals.user.role !== "admin") {
            return fail(403, {
                message: 'Forbidden'
            });
        }

        const db = drizzle(event.platform?.env.DB as D1Database, { schema });
        const form = await event.request.formData();
        const id = form.get('id') as string;
        const user = await db.query.userTable.findFirst({
            where: eq(schema.userTable.id, id)
        });
        if (!user) {
            return {
                Success: false,
                message: 'User not found'
            }
        }
        if (user.role === 'user') {
            return {
                Success: false,
                message: 'User is not an agent'
            }
        }
        const updated = await db.update(schema.userTable).set({
            role: 'user'
        }).where(eq(schema.userTable.id, id))
        return {
            Success: updated.success,
            message: 'User is now a user'
        };
    }
}