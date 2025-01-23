<svelte:head>
		<script async src="https://www.google.com/recaptcha/api.js?render=6Le4s7cqAAAAAHy8r1uWjTqZ3rw3rT46oohb7bak"></script>
</svelte:head>

<script lang="ts">
    import { enhance } from '$app/forms';
    import { onMount } from 'svelte';
    import { spring } from 'svelte/motion';


    
    const creditPackages = [
        { amount: 1, pricePerUnit: 130 },
        { amount: 20, pricePerUnit: 120 },
        { amount: 30, pricePerUnit: 110 },
        { amount: 50, pricePerUnit: 100 }
    ];

    const popularForms = [
        { title: "Constitution de société", href: "/login" },
        { title: "Modification de société", href: "/login" },
        { title: "Transfert de siège social", href: "/login" },
        { title: "Changement de dirigeant", href: "/login" },
        { title: "Dissolution", href: "/login" },
        { title: "Clôture de la liquidation", href: "/login" },
        { title: "Augmentation de capital", href: "/login" }
    ];

    const legalAnnouncementCategories = [
        {
            title: "Constitution de société",
            items: [
                { title: "SARL", href: "/login" },
                { title: "SARLAU", href: "/login" },
                { title: "SNC", href: "/login" },
                { title: "SCS", href: "/login" },
                { title: "SCA", href: "/login" },
                { title: "SAS", href: "/login" },
                { title: "SA", href: "/login" },
                { title: "GIE", href: "/login" }
            ]
        },
        {
            title: "Modification de société",
            items: [
                { title: "Changement de dirigeant", href: "/login" },
                { title: "Changement d'objet social", href: "/login" },
                { title: "Changement de dénomination", href: "/login" },
                { title: "Cession de parts sociales", href: "/login" },
                { title: "Réduction de capital", href: "/login" },
                { title: "Augmentation de capital", href: "/login" }
            ]
        },
        {
            title: "Autres modifications",
            items: [
                { title: "Transfert de siège social", href: "/login" },
                { title: "Transformation de la forme sociale", href: "/login" },
                { title: "Dissolution", href: "/login" },
                { title: "Clôture de la liquidation", href: "/login" },
                { title: "Cessation d'activité", href: "/login" },
                { title: "Continuité de l'activité", href: "/login" }
            ]
        }
    ];

 
    let showContactForm = false;

    function toggleContactForm() {
        showContactForm = !showContactForm;
    }

    let scrollProgress = 0;

    if (typeof window !== 'undefined') {
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            scrollProgress = winScroll / height;
        });
    }

    // Stats counters
    let statsVisible = false;
    let clientsCount = spring(0, { stiffness: 0.1, damping: 0.3 });
    let announcesCount = spring(0, { stiffness: 0.1, damping: 0.3 });
    let satisfactionCount = spring(0, { stiffness: 0.1, damping: 0.3 });

    onMount(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !statsVisible) {
                    statsVisible = true;
                    clientsCount.set(100);
                    announcesCount.set(1000);
                    satisfactionCount.set(98);
                }
            });
        }, { threshold: 0.1 });

        const statsSection = document.getElementById('stats-section');
        if (statsSection) observer.observe(statsSection);

        return () => {
            if (statsSection) observer.unobserve(statsSection);
        };
    });

    let recaptchaSiteKey = "6Le4s7cqAAAAAHy8r1uWjTqZ3rw3rT46oohb7bak";
    let recaptchaToken = "";

    const executeRecaptcha = () => {
        //@ts-ignore
        grecaptcha.ready(() => {
            //@ts-ignore
            grecaptcha
                .execute(recaptchaSiteKey, { action: "submit" })
                .then((responseToken:string) => {
                recaptchaToken = responseToken;
                console.log("reCAPTCHA token:", recaptchaToken);
                });
            });
        };

    // Execute reCAPTCHA when the component mounts
    onMount(() => {
        executeRecaptcha();
    });

    let showVideoModal = false;
    
    function toggleVideoModal() {
        showVideoModal = !showVideoModal;
    }

    let showMobileMenu = false;
    
    function toggleMobileMenu() {
        showMobileMenu = !showMobileMenu;
    }

    function scrollToSection(sectionId: string) {
        const section = document.getElementById(sectionId);
        if (section) {
            toggleMobileMenu();
            // Add some offset for the fixed header
            const headerOffset = 100;
            const elementPosition = section.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    }
</script>

<div class="landing-page">
    <!-- Header -->
    <header class="fixed mt-10 md:mt-0 top:10 md:top-11 w-full bg-white/95 backdrop-blur-sm z-50 transition-all duration-300">
        <div class="container mx-auto">
            <div class="flex items-center justify-between py-4 px-6">
                <!-- Logo -->
                <a href="/" class="flex items-center space-x-2 w-[200px] md:w-[15%]">
                    <img
                        src="/logo.webp"
                        alt="1000 Annonces" 
                        class="h-auto w-full transform hover:scale-105 transition-transform duration-300"
                    />
                </a>

                <!-- Desktop Navigation -->
                <nav class="hidden md:flex items-center space-x-8">
                    <button 
                        on:click={() => scrollToSection('services')} 
                        class="text-[#263763] hover:text-[#4E9C97] font-medium transition-all duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:h-0.5 after:w-0 after:bg-[#4E9C97] after:transition-all after:duration-300 hover:after:w-full"
                    >
                        Services
                    </button>
                    <button 
                        on:click={() => scrollToSection('pricing')} 
                        class="text-[#263763] hover:text-[#4E9C97] font-medium transition-all duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:h-0.5 after:w-0 after:bg-[#4E9C97] after:transition-all after:duration-300 hover:after:w-full"
                    >
                        Tarifs
                    </button>
                    <button 
                        on:click={() => scrollToSection('about')} 
                        class="text-[#263763] hover:text-[#4E9C97] font-medium transition-all duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:h-0.5 after:w-0 after:bg-[#4E9C97] after:transition-all after:duration-300 hover:after:w-full"
                    >
                        À propos
                    </button>
                </nav>

                <!-- Action Buttons -->
                <div class="hidden md:flex items-center space-x-4">
                    <button 
                        on:click={toggleContactForm} 
                        class="px-6 py-2 text-[#4E9C97] border-2 border-[#4E9C97] rounded-full font-medium hover:bg-[#4E9C97] hover:text-white transition-all duration-300"
                    >
                        Contact
                    </button>
                    <a 
                        href="/login" 
                        class="px-6 py-2 bg-[#263763] text-white rounded-full font-medium hover:bg-[#4E9C97] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        Commencer
                    </a>
                </div>

                <!-- Update Mobile Menu Button -->
                <button 
                    class="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
                    on:click={toggleMobileMenu}
                >
                    <svg class="w-6 h-6 text-[#263763]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {#if !showMobileMenu}
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                        {:else}
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        {/if}
                    </svg>
                </button>
            </div>

            <!-- Add Mobile Menu -->
            {#if showMobileMenu}
                <div class="md:hidden bg-white border-t border-gray-100">
                    <nav class="flex flex-col space-y-4 p-4">
                        <button 
                            on:click={() => scrollToSection('services')} 
                            class="text-left text-[#263763] hover:text-[#4E9C97] font-medium py-2 transition-colors duration-300"
                        >
                            Services
                        </button>
                        <button 
                            on:click={() => scrollToSection('pricing')} 
                            class="text-left text-[#263763] hover:text-[#4E9C97] font-medium py-2 transition-colors duration-300"
                        >
                            Tarifs
                        </button>
                        <button 
                            on:click={() => scrollToSection('about')} 
                            class="text-left text-[#263763] hover:text-[#4E9C97] font-medium py-2 transition-colors duration-300"
                        >
                            À propos
                        </button>
                        <div class="flex flex-col gap-4 pt-4 border-t border-gray-100">
                            <button 
                                on:click={() => {
                                    toggleMobileMenu();
                                    toggleContactForm();
                                }}
                                class="w-full px-6 py-2 text-[#4E9C97] border-2 border-[#4E9C97] rounded-full font-medium hover:bg-[#4E9C97] hover:text-white transition-all duration-300"
                            >
                                Contact
                            </button>
                            <a 
                                href="/login" 
                                class="w-full px-6 py-2 bg-[#263763] text-white rounded-full font-medium hover:bg-[#4E9C97] text-center transition-all duration-300"
                            >
                                Commencer
                            </a>
                        </div>
                    </nav>
                </div>
            {/if}
        </div>

        <!-- Scroll Progress Bar -->
        <div class="h-0.5 bg-gradient-to-r from-[#263763] to-[#4E9C97] transform origin-left scale-x-0 transition-transform duration-300" style="transform: scaleX({scrollProgress});" />
    </header>

    <!-- Hero Section -->
    <section class="relative pt-36 min-h-screen flex items-center pt-16">
        <div class="absolute inset-0 z-0">
            <img
                src="/heroBg.webp"
                alt="Hero Background" 
                class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-r from-[#263763]/90 to-[#4E9C97]/80"></div>
        </div>

        <div class="container mx-auto px-4 py-12 relative z-10">
            <div class="grid lg:grid-cols-2 gap-12 items-center">
                <div class="text-white space-y-8">
                    <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                        La solution simple pour vos <span class="text-[#4E9C97]">annonces légales</span>
                    </h1>
                    <p class="text-xl md:text-2xl text-gray-200">
                        Des services professionnels sur mesure :
                    </p>
                    <ul class="list-none space-y-4 text-lg">
                        <li class="flex items-center">
                            <span class="text-[#4E9C97] mr-2">✓</span>
                            Publication en 24h dans les journaux habilités
                        </li>
                        <li class="flex items-center">
                            <span class="text-[#4E9C97] mr-2">✓</span>
                            Prix fixe garanti sans surprises
                        </li>
                        <li class="flex items-center">
                            <span class="text-[#4E9C97] mr-2">✓</span>
                            Assistance juridique gratuite
                        </li>
                    </ul>
                    <div class="flex flex-col sm:flex-row gap-4">
                        <a href="/login" class="btn bg-[#4E9C97] text-white hover:bg-[#263763] text-lg px-8 py-4 rounded-full transition-all duration-300">
                            Commencer maintenant
                        </a>
                        <a href="/" class="btn bg-transparent text-white border border-white hover:bg-white hover:text-[#263763] text-lg px-8 py-4 rounded-full transition-all duration-300" on:click|preventDefault={toggleContactForm}>
                            Nous contacter
                        </a>
                    </div>
                </div>

                <div class="hidden lg:block">
                    <div class="bg-white/10 backdrop-blur-md rounded-xl p-8 transform hover:-translate-y-2 transition-all duration-300">
                        <div class="relative w-full aspect-video rounded-lg overflow-hidden">
                            <iframe 
                                class="absolute top-0 left-0 w-full h-full"
                                src="https://www.youtube-nocookie.com/embed/mgLOQktP_-c?si=KYFVDhyAJhdwUeEB&controls=0" 
                                title="YouTube video player" 
                                frameborder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                referrerpolicy="strict-origin-when-cross-origin"
                                allowfullscreen
                            ></iframe>
                        </div>
                    </div>
                </div>

                <!-- Mobile Video Button -->
                <button
                    class="lg:hidden bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-full flex items-center justify-center gap-2"
                    on:click={toggleVideoModal}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Regarder la vidéo
                </button>
            </div>
        </div>
    </section>

    <!-- Add Video Modal -->
    {#if showVideoModal}
        <div class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div class="bg-black rounded-lg w-full max-w-3xl relative">
                <button 
                    on:click={toggleVideoModal}
                    class="absolute -top-10 right-0 text-white hover:text-gray-300"
                >
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                
                <div class="relative w-full aspect-video">
                    <iframe 
                        class="absolute top-0 left-0 w-full h-full rounded-lg"
                        src="https://www.youtube-nocookie.com/embed/mgLOQktP_-c?si=KYFVDhyAJhdwUeEB&controls=1" 
                        title="YouTube video player" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        allowfullscreen
                    ></iframe>
                </div>
            </div>
        </div>
    {/if}

    <!-- Popular Forms Section -->
    <section id="services" class="py-24 bg-white">
        <div class="container mx-auto px-4">
            <h2 class="text-3xl md:text-4xl font-bold text-[#263763] mb-8 text-center">
                Formulaires les plus utilisés
            </h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                {#each popularForms as form}
                    <a href={form.href} class="bg-gray-100 hover:bg-[#4E9C97] text-[#263763] hover:text-white p-4 rounded-lg transition-all duration-300 text-center">
                        {form.title}
                    </a>
                {/each}
            </div>
        </div>
    </section>

    <!-- Legal Announcement Categories Section -->
    <section class="py-24 bg-gray-50">
        <div class="container mx-auto px-4">
            <h2 class="text-3xl md:text-4xl font-bold text-[#263763] mb-8 text-center">
                Choisissez votre formulaire d'annonce légale
            </h2>
            <div class="grid md:grid-cols-3 gap-8">
                {#each legalAnnouncementCategories as category, i}
                    <div class="bg-white p-6 rounded-lg shadow-md ">
                        <h3 class="text-xl font-semibold text-[#263763] mb-4">{category.title}</h3>
                        <div class="{i === 0 ? 'grid grid-cols-2 gap-4' : 'space-y-2'}">
                            {#each category.items as item}
                                <li>
                                    <a href={item.href} class="text-[#4E9C97] hover:text-[#263763] transition-colors duration-300">
                                        {item.title}
                                    </a>
                                </li>
                            {/each}
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </section>

    <!-- Stats Section -->
    <section id="stats-section" class="py-24 bg-gradient-to-br from-[#263763] to-[#4E9C97]">
        <div class="container mx-auto px-4">
            <h2 class="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
                Nos chiffres clés
            </h2>
            <div class="grid md:grid-cols-3 gap-8">
                <div class="bg-white/10 backdrop-blur-md rounded-xl p-8 text-center transform hover:-translate-y-2 transition-all duration-300">
                    <div class="text-[#4E9C97] text-4xl mb-4">🏆</div>
                    <div class="text-2xl font-bold text-white mb-2">
                        {#if statsVisible}
                            <span class="tabular-nums">{$clientsCount.toFixed(0)}</span>+
                        {:else}
                            0+
                        {/if}
                    </div>
                    <div class="text-lg text-white/80">Clients satisfaits</div>
                </div>

                <div class="bg-white/10 backdrop-blur-md rounded-xl p-8 text-center transform hover:-translate-y-2 transition-all duration-300">
                    <div class="text-[#4E9C97] text-4xl mb-4">📢</div>
                    <div class="text-2xl font-bold text-white mb-2">
                        {#if statsVisible}
                            <span class="tabular-nums">{$announcesCount.toFixed(0)}</span>+
                        {:else}
                            0+
                        {/if}
                    </div>
                    <div class="text-lg text-white/80">Annonces publiées</div>
                </div>

                <div class="bg-white/10 backdrop-blur-md rounded-xl p-8 text-center transform hover:-translate-y-2 transition-all duration-300">
                    <div class="text-[#4E9C97] text-4xl mb-4">⭐</div>
                    <div class="text-2xl font-bold text-white mb-2">
                        {#if statsVisible}
                            <span class="tabular-nums">{$satisfactionCount.toFixed(0)}</span>%
                        {:else}
                            0%
                        {/if}
                    </div>
                    <div class="text-lg text-white/80">Taux de satisfaction</div>
                </div>
            </div>
        </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="py-24 bg-white relative">
        <div class="container mx-auto px-4">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-5xl font-bold text-[#263763] mb-4">
                    Tarifs transparents
                </h2>
                <p class="text-xl text-gray-600 max-w-2xl mx-auto">
                    Des forfaits adaptés à vos besoins
                </p>
            </div>
            <div class="grid md:grid-cols-4 gap-8">
                {#each creditPackages as pkg}
                    <div class="card p-8 variant-filled hover:bg-white border-1 border-[#263763]/20 hover:border-[#4E9C97] shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 rounded-2xl">
                        <div class="text-center">
                            <div class="text-xl font-semibold text-[#263763] mb-4">
                                Pack {pkg.amount} Crédit{pkg.amount > 1 ? 's' : ''}
                            </div>
                            <div class="flex items-center justify-center gap-2 mb-6">
                                <span class="text-5xl font-bold text-[#263763]">{pkg.pricePerUnit}</span>
                                <div class="text-left">
                                    <div class="text-sm font-medium text-[#4E9C97]">MAD</div>
                                    <div class="text-xs text-gray-600">par crédit</div>
                                </div>
                            </div>
                            <div class="py-4 border-y-2 border-[#263763]/10 mb-6">
                                <div class="font-semibold text-[#263763]">
                                    Total: {pkg.amount * pkg.pricePerUnit} MAD
                                </div>
                                <div class="text-sm text-gray-600">TVA incluse</div>
                            </div>
                            <a href="/login" class="btn bg-[#4E9C97] text-white hover:bg-[#263763] w-full rounded-full transition-all duration-300">
                                Choisir ce pack
                            </a>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section id="about" class="py-24 bg-gradient-to-br from-[#263763] to-[#4E9C97] text-white relative overflow-hidden">
        <div class="absolute inset-0 bg-pattern opacity-5"></div>
        <div class="container mx-auto px-4 relative z-10">
            <div class="max-w-4xl mx-auto">
                <h2 class="text-3xl md:text-5xl font-bold mb-12 text-center">
                    Contactez-nous
                </h2>
                <div class="grid md:grid-cols-2 gap-12">
                    <!-- Contact Info -->
                    <div class="space-y-8">
                        <div class="space-y-6">
                            <h3 class="text-2xl font-semibold mb-4">Nos coordonnées</h3>
                            
                            <!-- Phone Numbers -->
                            <div class="flex items-center space-x-4">
                                <div class="bg-white/10 p-3 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <div>
                                    <div class="font-medium">Téléphones</div>
                                    <a href="tel:0520824182" class="block hover:text-[#4E9C97] transition-colors">05 20 82 41 82</a>
                                    <a href="tel:0707071464" class="block hover:text-[#4E9C97] transition-colors">07 07 07 14 64</a>
                                </div>
                            </div>

                            <!-- Email -->
                            <div class="flex items-center space-x-4">
                                <div class="bg-white/10 p-3 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <div class="font-medium">Email</div>
                                    <a href="mailto:Journal.1000ANNONCES@GMAIL.COM" class="hover:text-[#4E9C97] transition-colors">Journal.1000ANNONCES@GMAIL.COM</a>
                                </div>
                            </div>

                            <!-- Location -->
                            <div class="flex items-center space-x-4">
                                <div class="bg-white/10 p-3 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <div class="font-medium">Adresse</div>
                                    <p>App8, Bd Tah, Casablanca 20250</p>
                                    <a href="https://maps.app.goo.gl/ARPC6VSTidqLWAnB7?g_st=aw" 
                                       target="_blank" 
                                       rel="noopener noreferrer" 
                                       class="text-white underline">
                                        Ouvrir dans Google Maps
                                    </a>
                                </div>
                            </div>
                            <a href="/" class="btn bg-white space-t-20 text-[#263763] border border-[#263763] hover:bg-[#263763] hover:text-white text-lg px-8 py-4 rounded-full transition-all duration-300" on:click|preventDefault={toggleContactForm}>
                                Nous contacter
                            </a>
                        </div>
                        </div>

                        <!-- Map Embed -->
                        <div class="rounded-xl overflow-hidden shadow-lg h-[400px]">
                        <iframe
                            title="1000 Annonces Office Location Map"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d819.8806269168551!2d-7.581976!3d33.5332442!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda6331e871106af%3A0x49301211d672e403!2s1000%20annonces-%20let%E2%80%99s%20go%20branding!5e0!3m2!1sen!2sma!4v1705505177315!5m2!1sen!2sma"
                            width="100%"
                            height="100%"
                            style="border:0;"
                            loading="lazy"
                            referrerpolicy="strict-origin-when-cross-origin"
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="py-24 bg-white text-center">
        <div class="container mx-auto px-4">
            <h2 class="text-3xl md:text-5xl font-bold text-[#263763] mb-6">
                Prêt à publier votre annonce légale ?
            </h2>
            <p class="text-xl mb-8 text-gray-600">
                Rejoignez les milliers d'entreprises qui nous font confiance
            </p>
            <div class="flex flex-col sm:flex-row justify-center gap-4">
                <a href="/login" class="btn bg-[#4E9C97] text-white hover:bg-[#263763] text-lg px-8 py-4 rounded-full transition-all duration-300">
                    Commencer maintenant
                </a>
                <a href="/" class="btn bg-transparent text-[#263763] border border-[#263763] hover:bg-[#263763] hover:text-white text-lg px-8 py-4 rounded-full transition-all duration-300" on:click|preventDefault={toggleContactForm}>
                    Nous contacter
                </a>
            </div>
        </div>
    </section>

    {#if showContactForm}
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md relative">
                <button 
                    on:click={toggleContactForm}
                    class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12M6 4l12 12M6 4l12 12" />
                    </svg>
                </button>
                
                <h2 class="text-2xl font-bold mb-4 text-[#263763] dark:text-white">Contactez-nous</h2>
                
                <form
                    action="?/contact"
                    method="POST"
                    class="space-y-4"
                    use:enhance
                >
                    <!-- Honeypot field -->
                    <input type="text" name="title" class="hidden" tabindex="-1" autocomplete="off">
                    <!-- recaptcha v3 token -->
                    <input type="text" name="recaptchaToken" class="hidden" bind:value={recaptchaToken} />

                    <div class="form-group">
                        <label class="label">
                            <span>Nom complet</span>
                            <input
                                type="text"
                                name="name"
                                class="input"
                                placeholder="Votre nom..."
                                required
                            >
                        </label>
                    </div>

                    <div class="form-group">
                        <label class="label">
                            <span>Email</span>
                            <input
                                type="email"
                                name="email"
                                class="input required"
                                placeholder="votre@email.com"
                                autocomplete="email"
                                required
                            >
                        </label>
                    </div>

                    <div class="form-group">
                        <label class="label">
                            <span>Sujet</span>
                            <input
                                type="text"
                                name="subject"
                                class="input"
                                placeholder="Sujet de votre message..."
                                required
                            >
                        </label>
                    </div>

                    <div class="form-group">
                        <label class="label">
                            <span>Message</span>
                            <textarea
                                name="body"
                                class="textarea"
                                rows="4"
                                placeholder="Votre message..."
                                required
                            ></textarea>
                        </label>
                    </div>

                    <button 
                        type="submit" 
                        class="btn variant-filled-primary w-full"
                    >
                        Envoyer
                    </button>
                </form>
            </div>
        </div>
    {/if}
</div>

<style>
    /* Existing styles remain unchanged */

    .bg-pattern {
        background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0  0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    }

    /* Smooth transitions */
    .btn,
    .card {
        transition: all 0.3s ease;
    }
</style>