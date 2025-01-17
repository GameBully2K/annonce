export async function sendVerificationEmail(name:string, email:string, code:string, key: string) {
    const year = new Date().getFullYear();
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "api-key": key,
            "accept": "application/json"
        },
        body: JSON.stringify({
            "sender": {
                "email": "no-reply@1000-annonces.ma",
                "name": "1000-annonces"
            },
            "to": [
                {
                    "email": email,
                    "name": name
                }
            ],
            "subject": "Code de vérification 1000-annonces",
            "htmlContent": `<html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Votre Code</title><style>body{font-family:Arial,sans-serif;font-size:16px;background-color:#f4f4f4;margin:0;padding:0}.email-container{max-width:600px;margin:40px auto;background:#fff;border:1px solid #ddd}.email-header{background-color:#263763;color:#fff;padding:20px;text-align:center}.email-body{padding:20px;text-align:center}.code{font-size:24px;color:#4E9C97;margin:20px 0;padding:10px;border:1px dashed #4E9C97;display:inline-block}.footer{text-align:center;color:#777;font-size:14px;padding:20px}</style></head><body><div class="email-container"><div class="email-header"><h1>Code de vérification</h1></div><div class="email-body"><p>Bonjour ${name},</p><p>Merci d'avoir choisi 1000-annonces! Voici votre code de vérification:</p><div class="code">${code}</div><p>Utilisez ce code pour vérifier votre email</p><p>Si vous avez des questions, n'hésitez pas à nous contacter.</p><a href="mailto:Journal.1000ANNONCES@GMAIL.COM" style="color:#4E9C97">Journal.1000ANNONCES@GMAIL.COM</a></div><div class="footer">&copy; ${year} 1000-annonces. Tous droits réservés.</div></div></body></html>`
        })
    });
    return response.status === 200;
}

export async function sendContactFormEmail(name:string, subject:string, email:string, body:string, key: string) {
    try {
        const year = new Date().getFullYear();
        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": key,
                "accept": "application/json"
            },
            body: JSON.stringify({
                "sender": {
                    "email": "no-reply@1000-annonces.ma",
                    "name": "1000-annonces"
                },
                "to": [
                    {
                        "email": "Journal.1000annonces@gmail.com",
                        "name": "1000-annonces"
                    }
                ],
                "replyTo": {
                    "email": email,
                    "name": name
                },
                "subject": `Nouveau message de contact: ${subject}`,
                "htmlContent": `<html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Formulaire de Contact</title><style>body{font-family:Arial,sans-serif;font-size:16px;background-color:#f4f4f4;margin:0;padding:0}.email-container{max-width:600px;margin:40px auto;background:#fff;border:1px solid #ddd}.email-header{background-color:#263763;color:#fff;padding:20px;text-align:center}.email-body{padding:20px;text-align:left}.footer{text-align:center;color:#777;font-size:14px;padding:20px}</style></head><body><div class="email-container"><div class="email-header"><h1>Nouveau Message de Contact</h1></div><div class="email-body"><p><strong>Nom:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Sujet:</strong> ${subject}</p><p><strong>Message:</strong></p><p>${body}</p></div><div class="footer">&copy; ${year} 1000-annonces. Tous droits réservés.</div></div></body></html>`
            })
        });
        return response.status === 200;
    } catch (error) {
        console.error('Failed to send contact form email:', error);
        return false;
    }
}
