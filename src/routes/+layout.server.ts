import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (event) => {
    let loggedIn = false;
    let isAdmin = false;
    if (!event.locals.user) {
        return {
            loggedIn,
            isAdmin
        }
    }
    loggedIn = true;
    if (event.locals.user.role && event.locals.user?.role != 'user' && !event.url.pathname.includes('admin')) {
        isAdmin = true;
    }
	return {
		loggedIn,
        isAdmin
    };
};