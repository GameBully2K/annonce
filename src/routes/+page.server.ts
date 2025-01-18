import { generateIdFromEntropySize } from 'lucia';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { drizzle } from 'drizzle-orm/d1';
import { eq, desc, and } from 'drizzle-orm';
import * as schema from '$db/schema';
import {sendContactFormEmail} from '$lib/emailing/brevo';
import { dev } from "$app/environment";

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return {
			username: null,
			firstName: null,
			lastName: null,
			email: null,
			credits: 0,
			publications: [],
			drafts: []
		};
	}

	const db = drizzle(event.platform?.env.DB as D1Database, { schema });

	async function calculateTotalSpent() {
		const verifiedTransactions = await db.query.paymentTable.findMany({
			where: and(
				eq(schema.paymentTable.userId, event.locals.user.id),
				eq(schema.paymentTable.status, 'verified')
			)
		});

		return verifiedTransactions.reduce((total, tx) => total + (tx.totalAmount || 0), 0);
	}

	// Get user's recent publications
	const publications = await db.query.publicationTable.findMany({
		where: eq(schema.publicationTable.userId, event.locals.user.id),
		orderBy: desc(schema.publicationTable.updatedAt)
	});

	// Get user's drafts
	const drafts = await db.query.draftTable.findMany({
		where: eq(schema.draftTable.userId, event.locals.user.id),
		orderBy: desc(schema.draftTable.updatedAt)
	});

	//Get Pending Purshases
	const pendingPurchase = await db.query.paymentTable.findFirst({
		where: and(
			eq(schema.paymentTable.userId, event.locals.user.id),
			eq(schema.paymentTable.status, 'pending')
		),
		orderBy: desc(schema.paymentTable.createdAt)
	});

	// Calculate statistics
	const stats = {
		totalPublications: publications.length - publications.filter((p) => p.status === 'pending').length,
		pendingPublications: publications.filter((p) => p.status === 'pending').length,
		draftsCount: drafts.length,
		totalSpent: await calculateTotalSpent()
	};

	// Get user data including credits
	return {
		username: event.locals.user.username || null,
		firstName: event.locals.user.firstName || null,
		lastName: event.locals.user.lastName || null,
		email: event.locals.user.email || null,
		credits: event.locals.user.credits || 0,
		role: event.locals.user.role || null,
		publications,
		drafts,
		pendingPurchase,
		stats
	};
};

export const actions = {
	loadPub: async (event) => {
		console.log("loadPub");
		if (!event.locals.user) {
			return {
				Success: false,
				message: 'Non Authentifier',
				pub: null
			};
		}

		const db = drizzle(event.platform?.env.DB as D1Database, { schema });

		const formData = await event.request.formData();
		const pubId = formData.get('pubId')?.toString() || "";
		const pubType = formData.get('pubType')?.toString() || "";

		console.log(formData.get('pubId')?.toString(), formData.get('pubType')?.toString());

		console.log(pubId, pubType);

		if (!pubId || !pubType) {
			return redirect(301,'/');
		}

		//get the publication
		if (pubType === "draft") {
			const draft = await db.query.draftTable.findFirst({
				where: eq(schema.draftTable.id, pubId)
			})
			return {
				Success: true,
				message: 'Publication chargée',
				draft: draft
			};
		}else {
			const publication = await db.query.publicationTable.findFirst({
				where: eq(schema.publicationTable.id, pubId)
			});
			if (publication) {
				//delete the publication and make it draft
				const newDraft = await db.insert(schema.draftTable).values({
					id: publication.id,
					userId: publication.userId,
					companyType: publication.companyType,
					publicationType: publication.publicationType,
					body: publication.body,
					title: publication.title,
					createdAt: publication.createdAt,
					updatedAt: publication.updatedAt
				});
				if (!newDraft.success) return {
					Success: false,
					message: 'Erreur lors de la récupération de la publication'
				};
				const deleted = await db.delete(schema.publicationTable).where(eq(schema.publicationTable.id, pubId));
				if (!deleted.success) return {
					Success: false,
					message: 'Erreur lors de la suppression de la publication'
				};
				//give the user his credit back
				const payBack = await db.update(schema.userTable).set({
					credits: event.locals.user.credits + 1,
					updatedAt: Date.now()
				}).where(eq(schema.userTable.id, publication.userId));
				if (!payBack.success) return {
					Success: false,
					message: 'Erreur lors du remboursement'
				};
			
				 // Comment out log
				/*await db.insert(schema.logTable).values({
					id: generateIdFromEntropySize(8),
					userId: event.locals.user.id,
					action: 'publication_to_draft',
					details: JSON.stringify({ publicationId: pubId }),
					createdAt: Date.now()
				});*/
			}
			return {
				Success: true,
				message: 'Publication chargée',
				draft: publication
			};
		}
	},
	saveDraft: async (event) => {
		if (!event.locals.user) {
			return fail(401, {
				Success: false,
				message: 'Non autorisé'
			});
		}

		const db = drizzle(event.platform?.env.DB as D1Database, { schema });
		const formData = await event.request.formData();

		const companyType = formData.get('companyType')?.toString();
		const publicationType = formData.get('publicationType')?.toString();
		const body = formData.get('body')?.toString();
		const draftId = formData.get('draftId')?.toString() || generateIdFromEntropySize(8);
		const title = formData.get('title')?.toString();

		if (!companyType || !publicationType || !body || !title) {
			return fail(400, { Success: false, message: 'Données invalides' });
		}

		await db
			.insert(schema.draftTable)
			.values({
				id: draftId,
				userId: event.locals.user.id,
				companyType,
				publicationType,
				body,
				title,
				createdAt: Date.now(),
				updatedAt: Date.now()
			})
			.onConflictDoUpdate({
				target: schema.draftTable.id,
				set: {
					companyType,
					publicationType,
					body,
					title,
					updatedAt: Date.now()
				}
			});

		 // Comment out log
		/*await db.insert(schema.logTable).values({
			id: generateIdFromEntropySize(8),
			userId: event.locals.user.id,
			action: 'draft_saved',
			details: JSON.stringify({ draftId }),
			createdAt: Date.now()
		});*/

		return { Success: true, message: 'Brouillon enregistré' };
	},
	deleteDraft: async (event) => {
		if (!event.locals.user) {
			return fail(401, {
				Success: false,
				message: 'Non autorisé'
			});
		}

		const db = drizzle(event.platform?.env.DB as D1Database, { schema });

		const formData = await event.request.formData();
		const draftId = formData.get('draftId')?.toString();

		if (!draftId || draftId === '') {
			return fail(400, { Success: false, message: 'Données invalides' });
		}

		await db.delete(schema.draftTable).where(eq(schema.draftTable.id, draftId));

		 // Comment out log
		/*await db.insert(schema.logTable).values({
			id: generateIdFromEntropySize(8),
			userId: event.locals.user.id,
			action: 'draft_deleted',
			details: JSON.stringify({ draftId }),
			createdAt: Date.now()
		});*/

		return { Success: true, message: 'Brouillon supprimé' };
	},
	deletePub: async (event) => {
		if (!event.locals.user) {
			return fail(401, {
				Success: false,
				message: 'Non autorisé'
			});
		}

		const db = drizzle(event.platform?.env.DB as D1Database, { schema });

		const formData = await event.request.formData();
		const pubId = formData.get('pubId')?.toString();

		if (!pubId || pubId === '') {
			return fail(400, { Success: false, message: 'Données invalides' });
		}

		const publication = await db.query.publicationTable.findFirst({
			where: eq(schema.publicationTable.id, pubId)
		});

		await db.delete(schema.publicationTable).where(eq(schema.publicationTable.id, pubId));

		//give the user his credit back if the publication is still pending
		if (publication && publication.status === "pending") {
			await db.update(schema.userTable).set({
				credits: event.locals.user.credits + 1,
				updatedAt: Date.now()
			}).where(eq(schema.userTable.id, publication.userId));
		}
		

		 // Comment out log
		/*await db.insert(schema.logTable).values({
			id: generateIdFromEntropySize(8),
			userId: event.locals.user.id,
			action: 'publication_deleted',
			details: JSON.stringify({ publicationId: pubId }),
			createdAt: Date.now()
		});*/

		return { Success: true, message: 'Publication supprimée' };
	},
	publish: async (event) => {
		if (!event.locals.user) {
			return fail(401, { Success: false, message: 'Non autorisé' });
		}

		const db = drizzle(event.platform?.env.DB as D1Database, { schema });
		const formData = await event.request.formData();

		const companyType = formData.get('companyType')?.toString();
		const publicationType = formData.get('publicationType')?.toString();
		const body = formData.get('body')?.toString();
		const title = formData.get('title')?.toString();
		const draftId = formData.get('draftId')?.toString();

		if (!companyType || !publicationType || !body || !title) {
			return fail(400, { Success: false, message: 'Données invalides' });
		}

		if (event.locals.user.credits < 1) {
			return fail(400, { Success: false, message: 'Crédits insuffisants' });
		}

		try {
			// 1. Create publication first
			const publicationId = generateIdFromEntropySize(8);
			await db.insert(schema.publicationTable).values({
				id: publicationId,
				userId: event.locals.user.id,
				title,
				companyType,
				publicationType,
				body,
				status: 'pending',
				createdAt: Date.now(),
				updatedAt: Date.now()
			});
			// 2. Update user credits
			await db
				.update(schema.userTable)
				.set({
					credits: event.locals.user.credits - 1,
					updatedAt: Date.now()
				})
				.where(eq(schema.userTable.id, event.locals.user.id));

			// 3. Log the credit usage
			await db.insert(schema.creditTransactionTable).values({
				id: generateIdFromEntropySize(8),
				userId: event.locals.user.id,
				type: 'usage',
				creditAmount: -1,
				status: 'verified',
				createdAt: Date.now(),
				updatedAt: Date.now()
			});

			// remove the draft if exists

			if (draftId) {
				await db.delete(schema.draftTable).where(eq(schema.draftTable.id, draftId));
			} else {
				const draft = await db.query.draftTable.findFirst({
					where: eq(schema.draftTable.id, publicationId)
				});
				if (draft) {
					await db.delete(schema.draftTable).where(eq(schema.draftTable.id, publicationId));
				}
			}
			

			 // Comment out log
			/*await db.insert(schema.logTable).values({
				id: generateIdFromEntropySize(8),
				userId: event.locals.user.id,
				action: 'publication_created',
				details: JSON.stringify({ publicationId }),
				createdAt: Date.now()
			});*/

			return { Success: true, message: 'Publication enregistrée' };
		} catch (error) {
			console.error('Publication error:', error);
			return fail(500, {
				Success: false,
				message: 'Une erreur est survenue lors de la publication'
			});
		}
	},
	purchase: async (event) => {
		if (!event.locals.user) {
			return  {
				Success: false,
				message: 'Non autorisé'
			}
		}

		const db = drizzle(event.platform?.env.DB as D1Database, { schema });
		const formData = await event.request.formData();

		const quantity:number = Number(formData.get('quantity')?.toString());
		const pricePerUnit:number = Number(formData.get('pricePerUnit')?.toString());
		const rib = formData.get('rib')?.toString();

		if (
			!quantity ||
			!pricePerUnit ||
			!rib ||
			typeof quantity !== 'number' ||
			typeof pricePerUnit !== 'number' ||
			typeof rib !== 'string' ||
			!/^\d{24}$/.test(rib)
		) {
			return {
				Success: false,
				message: 'Données invalides'
			};
		}

		const quantityToPriceMapping: { [key: number]: number } = {
			1: 130,
			20: 120,
			30: 110,
			50: 100
		}

		if (quantityToPriceMapping[quantity] !== pricePerUnit) {
			return {
				Success: false,
				message: 'Données Erronées'
			};
		}

		// Validate request body

		try {
			const pubId = generateIdFromEntropySize(8);

			// Create credit transaction record (simplified, moved payment details to payment table)
			await db.insert(schema.creditTransactionTable).values({
				id: pubId,
				userId: event.locals.user.id,
				type: 'purchase',
				creditAmount: quantity,
				status: 'pending',
				createdAt: Date.now(),
				updatedAt: Date.now()
			});

			// Create payment record (contains all payment-related information)
			await db.insert(schema.paymentTable).values({
				id: generateIdFromEntropySize(8),
				userId: event.locals.user.id,
				creditTransactionId: pubId,
				quantity,
				pricePerCredit: pricePerUnit,
				totalAmount: quantity * pricePerUnit,
				status: 'pending',
				paymentMethod: 'bank_transfer',
				accountNumber: rib,
				createdAt: Date.now(),
				updatedAt: Date.now()
			});
			 // Comment out log
			/*await db.insert(schema.logTable).values({
				id: generateIdFromEntropySize(8),
				userId: event.locals.user.id,
				action: 'purchase_initiated',
				details: JSON.stringify({
					pubId,
					quantity,
					pricePerUnit,
					totalAmount: quantity * pricePerUnit
				}),
				createdAt: Date.now()
			});*/

			return {
				Success: true,
				message: 'Achat enregistré'
			}
		} catch (e) {
			console.error(e);
			return {
				Success: false,
				message: 'Une erreur est survenue'
			};
		}
	},
	contact: async (event) => {
		const formData = await event.request.formData();
		const name = formData.get('name')?.toString();
		const email = formData.get('email')?.toString();
		const body = formData.get('body')?.toString();
		const subject = formData.get('subject')?.toString();
		const key = event.platform?.env.SMTP_API_KEY;
		const honeyPot = formData.get('title')?.toString();
		const recaptchaToken = formData.get('recaptchaToken');

		console.log(recaptchaToken);

		if (honeyPot) {
			// Honey pot field was filled out, likely a bot, let get his ip
			const userIP = event.request.headers.get('CF-Connecting-IP') || event.request.headers.get('X-Forwarded-For');
			console.log(`Bot detected: ${userIP}`);
			return {
				Success: true,
				message: "Email Sent"
			};
		}

		if (!name || !email || !body || !subject || !key || !recaptchaToken) {
			return {
				Success: false,
				message: 'Données invalides'
			};
		}
		

		try {
			// Verify reCAPTCHA
			const verificationResponse = await fetch(
				`https://www.google.com/recaptcha/api/siteverify?secret=${event.platform?.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
				{
				  method: "POST",
				}
			  );

			const verificationData : { success: boolean, score: number } = await verificationResponse.json();

			console.log(verificationData)

			if (!verificationData.success || verificationData.score < 0.5) {
				return {
					Success: false,
					message: 'ReCAPTCHA non validé. Reload Page'
				};
			}

			if (dev) {
			const emailSent = await sendContactFormEmail(name, subject, email, body, key);
			if (emailSent) {
				console.log("email sent")
				return {
					Success: true,
					message: 'Email envoyé'
				};
			} else {
				return {
					Success: false,
					message: 'Email Non envoyé'
				};
			}
		}else{
			console.log("email not send in dev environement");
			return {
				Success: true,
				message: 'Email envoyé'
			};
		}
		} catch (error) {
			console.error('Contact form error:', error);
			return {
				Success: false,
				message: 'Une erreur est survenue lors de la vérification'
			};
		}
	},
};