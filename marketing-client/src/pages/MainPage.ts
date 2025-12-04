// Created by: Bethusile Mafumana
/**
 * Interface to define the structure of a campaign object.
 */
interface Campaign {
    title: string;
    uploaded: string;
    expires: string;
    status: 'Active' | 'Inactive';
    imageSrc: string;
}

// Define the function that returns the HTML element for the entire dashboard UI.
export function MainPage(): HTMLElement {
    const campaigns: Campaign[] = [
        { title: "Holiday Season AR Experience", uploaded: "Nov 15, 2024", expires: "Dec 31, 2024", status: "Active", imageSrc: "/holiday.jpg" },
        { title: "Tech Conference Demo", uploaded: "Nov 1, 2024", expires: "Nov 30, 2024", status: "Active", imageSrc: "/conference.jpg" },
        { title: "Product Launch - Q4 2024", uploaded: "Oct 20, 2024", expires: "Jan 15, 2025", status: "Active", imageSrc: "/unveiling.jpg" },
        { title: "Brand Awareness Campaign", uploaded: "Sep 1, 2024", expires: "Oct 31, 2024", status: "Inactive", imageSrc: "/campaign.jpg" },
        { title: "Employee Onboarding AR", uploaded: "Aug 15, 2024", expires: "No Expiry", status: "Active", imageSrc: "/onboarding.jpg" },
        { title: "Summer Sale Promotion", uploaded: "Jun 1, 2024", expires: "Aug 31, 2024", status: "Inactive", imageSrc: "/sale.jpg" },
    ];

    const createCampaignCard = (campaign: Campaign): string => {
        const statusClass = campaign.status === 'Active' ? 'is-success' : 'is-danger';
        return `
            <section class="column is-12-mobile is-half-tablet is-one-third-desktop">
                <section class="card campaign-card card-glass is-flex is-flex-direction-column"
                         data-campaign-title="${campaign.title}"
                         data-campaign-uploaded="${campaign.uploaded}"
                         data-campaign-expires="${campaign.expires}"
                         data-campaign-status="${campaign.status}"
                         data-campaign-image="${campaign.imageSrc}">
                    
                    <section class="card-image">
                        <figure class="image is-4by3">
                            <img src="${campaign.imageSrc}" onerror="this.src='https://placehold.co/600x450/333333/ffffff?text=Image+Error'" alt="${campaign.title}">
                        </figure>
                        <p class="status-tag-wrapper">
                            <strong class="tag is-small ${statusClass}">${campaign.status}</strong>
                        </p>
                    </section>

                    <section class="card-content is-flex-grow-1">
                        <p class="title is-5">${campaign.title}</p>
                        <section class="content">
                            <p>Uploaded: ${campaign.uploaded}</p>
                            <p>Expires: ${campaign.expires}</p>
                        </section>
                    </section>
                </section>
            </section>
        `;
    };

    const campaignCardsHtml = campaigns.map(createCampaignCard).join('');

    const navbarHtml = `
<nav class="navbar is-dark navbar-app" role="navigation" aria-label="main navigation">
    <section class="container">
        <section class="navbar-brand">
          <a class="navbar-item" href="#">
            <!-- Logos for different backgrounds -->
              <img src="/BBD_BBD_Full_Colour_-_Black_1.png" alt="BBD Logo Black" class="navbar-logo logo-black">
             <img src="/BBD_BBD_Full_Colour_-_White_1.png" alt="BBD Logo White" class="navbar-logo logo-white">
            <img src="/BBD_BBD_Full_Colour_-_Red_1.png" alt="BBD Logo Red" class="navbar-logo logo-red">

           <strong class="title is-4 ml-2">AR Manager</strong>
         </a>
            <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarMain">
                <p aria-hidden="true">☰</p>
            </a>
        </section>

        <section id="navbarMain" class="navbar-menu">
            <section class="navbar-end">
                <section class="navbar-item is-hidden-touch">
                    <a class="button is-rounded has-text-weight-bold">
                        <strong>Upload Campaign</strong>
                    </a>
                </section>
                <section class="navbar-item">
                    <p class="has-text-ilink mr-3">John Doe</p>
                    <p class="icon is-large has-text-link">👤</p>
                </section>
                <section class="navbar-item is-hidden-desktop">
                    <a class="button is-danger is-rounded has-text-weight-bold">Upload Campaign</a>
                </section>
            </section>
        </section>
    </section>
</nav>
`;

    const modalHtml = `
<section id="campaign-modal" class="modal">
    <section class="modal-background"></section>
    <section class="modal-card">
        <header class="modal-card-head">
            <strong class="modal-card-title has-text-white is-4" id="modal-campaign-title">Campaign Details</strong>
            <button class="delete is-large" aria-label="close" id="close-modal-button"></button>
        </header>
        <section class="modal-card-body">
            <figure class="image is-4by3">
                <img id="modal-campaign-image" src="" alt="Campaign Preview">
            </figure>
            <section class="content">
                <section class="columns is-multiline">
                    <section class="column is-full">
                        <p class="has-text-grey-light is-size-7 mb-1">Status</p>
                        <strong class="tag is-large has-text-weight-bold" id="modal-campaign-status-tag">N/A</strong>
                    </section>
                    <section class="column is-half">
                        <p class="has-text-grey-light is-size-7 mb-1">Date Uploaded</p>
                        <strong class="is-size-6 has-text-weight-bold" id="modal-campaign-uploaded">N/A</strong>
                    </section>
                    <section class="column is-half">
                        <p class="has-text-grey-light is-size-7 mb-1">Expiry Date</p>
                        <strong class="is-size-6 has-text-weight-bold" id="modal-campaign-expires">N/A</strong>
                    </section>
                    <section class="column is-full mt-4">
                        <p class="has-text-grey-light is-size-7 mb-1">Campaign URL</p>
                        <a href="javascript:void(0);" onclick="console.log('URL clicked');" class="has-text-info has-text-weight-semibold">https://example.com/ar-scan/</a>
                    </section>
                    <section class="column is-full mt-2">
                        <p class="has-text-grey-light is-size-7 mb-1">Overlay Title</p>
                        <strong class="is-size-6 has-text-weight-bold">Engage Now!</strong>
                    </section>
                    <section class="column is-full mt-2">
                        <p class="has-text-grey-light is-size-7 mb-1">Overlay Message</p>
                        <p class="is-size-6">Point your device to unlock an augmented reality experience.</p>
                    </section>
                </section>
            </section>
        </section>
        <footer class="modal-card-foot">
            <button class="button is-light is-outlined" id="modal-edit-button"><strong>Edit Details</strong></button>
            <button class="button is-danger is-outlined" id="modal-close-button"><strong>Close</strong></button>
        </footer>
    </section>
</section>
`;

    const dashboardHtml = `
        ${navbarHtml}
        <section class="section is-dark">
            <section class="container is-max-desktop">
                <section class="level">
                    <section class="level-left">
                        <section class="field has-addons">
                            <p class="control has-icons-left">
                                <input class="input is-medium is-rounded search-input is-dark" type="search" placeholder="Search campaigns...">
                            </p>
                        </section>
                    </section>
                    <section class="level-right">
                        <section class="field is-grouped">
                            <p class="control">
                                <section class="select is-dark is-medium is-rounded">
                                    <select>
                                        <option>All Status</option>
                                        <option>Active</option>
                                        <option>Inactive</option>
                                    </select>
                                </section>
                            </p>
                            <p class="control">
                                <section class="select is-dark is-medium is-rounded">
                                    <select>
                                        <option>Newest First</option>
                                        <option>Oldest First</option>
                                        <option>Alphabetical</option>
                                    </select>
                                </section>
                            </p>
                        </section>
                    </section>
                </section>
                <p class="subtitle is-4 has-text-white mt-5"><strong class="has-text-info-light">${campaigns.length}</strong> Campaigns</p>
                <section class="columns is-multiline is-variable is-3 mt-4">
                    ${campaignCardsHtml}
                </section>
            </section>
        </section>
    `;

    const container = document.createElement('section');
    container.id = 'app-content-wrapper';
    container.innerHTML = dashboardHtml + modalHtml;

    const setupEventListeners = () => {
        const modal = container.querySelector('#campaign-modal') as HTMLElement;

        const navbar = container.querySelector('.navbar-app') as HTMLElement;
        if (navbar) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) navbar.classList.add('navbar-scrolled');
                else navbar.classList.remove('navbar-scrolled');
            });
        }

        const navbarBurger = container.querySelector('.navbar-burger') as HTMLElement;
        const navbarMenu = container.querySelector('#navbarMain') as HTMLElement;
        if (navbarBurger && navbarMenu) {
            navbarBurger.addEventListener('click', () => {
                navbarBurger.classList.toggle('is-active');
                navbarMenu.classList.toggle('is-active');
            });
        }

        const openModal = (campaign: Campaign) => {
            if (!modal) return;
            (container.querySelector('#modal-campaign-title') as HTMLElement).textContent = campaign.title;
            const imageEl = container.querySelector('#modal-campaign-image') as HTMLImageElement;
            imageEl.src = campaign.imageSrc;
            imageEl.onerror = () => { imageEl.src = 'https://placehold.co/600x450/333333/ffffff?text=Image+Error'; };
            (container.querySelector('#modal-campaign-uploaded') as HTMLElement).textContent = campaign.uploaded;
            (container.querySelector('#modal-campaign-expires') as HTMLElement).textContent = campaign.expires;
            const statusTagEl = container.querySelector('#modal-campaign-status-tag') as HTMLElement;
            statusTagEl.textContent = campaign.status;
            statusTagEl.className = `tag is-large has-text-weight-bold ${campaign.status === 'Active' ? 'is-success' : 'is-danger'}`;
            modal.classList.add('is-active');
        };

        const closeModal = () => { modal?.classList.remove('is-active'); };
        container.querySelector('#close-modal-button')?.addEventListener('click', closeModal);
        container.querySelector('#modal-close-button')?.addEventListener('click', closeModal);
        modal?.querySelector('.modal-background')?.addEventListener('click', closeModal);

        container.querySelector('#modal-edit-button')?.addEventListener('click', () => {
            console.log(`[ACTION] Editing campaign: ${(container.querySelector('#modal-campaign-title') as HTMLElement).textContent}`);
            closeModal();
        });

        container.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;
            const card = target.closest('.campaign-card') as HTMLElement;
            if (card) {
                openModal({
                    title: card.getAttribute('data-campaign-title') || 'Untitled',
                    uploaded: card.getAttribute('data-campaign-uploaded') || 'N/A',
                    expires: card.getAttribute('data-campaign-expires') || 'N/A',
                    status: (card.getAttribute('data-campaign-status') as 'Active' | 'Inactive') || 'Inactive',
                    imageSrc: card.getAttribute('data-campaign-image') || '',
                });
            }
        });
    };

    setupEventListeners();
    return container;
}
