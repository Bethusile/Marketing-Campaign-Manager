//Created by: Bethusile Mafumana
/**
 * Interface to define the structure of a campaign object.
 * This makes the code strongly typed and easier to manage.
 */
interface Campaign {
    title: string;
    uploaded: string;
    expires: string;
    status: 'Active' | 'Inactive';
    imageSrc: string; // The URL/path to the campaign image
}

// Define the function that returns the HTML element for the entire dashboard UI.
export function MainPage(): HTMLElement {
    // 1. Data Definition
    const campaigns: Campaign[] = [
        {
            title: "Holiday Season AR Experience",
            uploaded: "Nov 15, 2024",
            expires: "Dec 31, 2024",
            status: "Active",
            // Using the local file from the public folder
            imageSrc: "/holiday.jpg" 
        },
        {
            title: "Tech Conference Demo",
            uploaded: "Nov 1, 2024",
            expires: "Nov 30, 2024",
            status: "Active",
            // Using the local file from the public folder
            imageSrc: "/conference.jpg"
        },
        {
            title: "Product Launch - Q4 2024",
            uploaded: "Oct 20, 2024",
            expires: "Jan 15, 2025",
            status: "Active",
            // Using the local file from the public folder
            imageSrc: "/unveiling.jpg"
        },
        {
            title: "Brand Awareness Campaign",
            uploaded: "Sep 1, 2024",
            expires: "Oct 31, 2024",
            status: "Inactive",
            // Using the local file from the public folder
            imageSrc: "/campaign.jpg"
        },
        {
            title: "Employee Onboarding AR",
            uploaded: "Aug 15, 2024",
            expires: "No Expiry",
            status: "Active",
            // Using the local file from the public folder
            imageSrc: "/onboarding.jpg"
        },
        {
            title: "Summer Sale Promotion",
            uploaded: "Jun 1, 2024",
            expires: "Aug 31, 2024",
            status: "Inactive",
            // Using the local file from the public folder
            imageSrc: "/sale.jpg"
        },
    ];

    // 2. Helper function to create a single card
    const createCampaignCard = (campaign: Campaign): string => {
        const isActive = campaign.status === 'Active';
        const statusClass = isActive ? 'is-success' : 'is-danger';

        return `
            <!-- Card Wrapper -->
            <div class="column is-one-third-desktop is-half-tablet is-flex">
                <!-- Card style: Added cursor: pointer and adjusted background for better visual match with dark theme -->
                <div class="card campaign-card card-glass is-flex is-flex-direction-column" 
                     data-campaign-title="${campaign.title}" 
                     data-campaign-uploaded="${campaign.uploaded}"
                     data-campaign-expires="${campaign.expires}"
                     data-campaign-status="${campaign.status}"
                     data-campaign-image="${campaign.imageSrc}"
                     style="height: 100%; cursor: pointer; background: rgba(30, 30, 30, 0.9); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; overflow: hidden; transition: transform 0.2s, box-shadow 0.2s;"
                     onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 12px 40px 0 rgba(0, 0, 0, 0.5)';"
                     onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 32px 0 rgba(0, 0, 0, 0.3)';"> 
                    
                    <!-- Card Image with Overlay Controls -->
                    <div class="card-image" style="position: relative;">
                        <!-- Changed to is-4by3 aspect ratio -->
                        <figure class="image is-4by3"> 
                            <!-- Image source updated to use local file path -->
                            <img src="${campaign.imageSrc}" onerror="this.src='https://placehold.co/600x450/333333/ffffff?text=Image+Error'" alt="${campaign.title}" style="object-fit: cover; border-radius: 12px 12px 0 0;">
                        </figure>

                        <!-- Controls Overlay (Status Tag only) -->
                        <div style="position: absolute; top: 10px; right: 10px;">
                            <!-- Status Tag -->
                            <span class="tag is-small ${statusClass}" style="border-radius: 4px; font-weight: bold;">${campaign.status}</span>
                        </div>
                    </div>

                    <!-- Card Content -->
                    <div class="card-content is-flex-grow-1 p-4">
                        <p class="title is-5 has-text-white mb-3" style="line-height: 1.2;">${campaign.title}</p>
                        <div class="content has-text-grey-light is-size-7">
                            <p class="mb-1"><span class="icon is-small mr-2"><i class="far fa-calendar-alt"></i></span>Uploaded: ${campaign.uploaded}</p>
                            <p class="mb-0"><span class="icon is-small mr-2"><i class="far fa-clock"></i></span>Expires: ${campaign.expires}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    };

    // 3. Main render logic
    const campaignCardsHtml = campaigns.map(createCampaignCard).join('');

    // 4. Navbar HTML
    const navbarHtml = `
        <nav class="navbar is-dark navbar-app" role="navigation" aria-label="main navigation" style="border-bottom: 2px solid red;">
            <div class="container">
                <div class="navbar-brand">
                    <a class="navbar-item" href="#">
                        <span class="icon is-large has-text-danger">
                            <i class="fas fa-square-full"></i> 
                        </span>
                        <span class="title is-4 has-text-white ml-2">BBD AR Manager</span>
                    </a>
                </div>

                <div class="navbar-menu is-active">
                    <div class="navbar-end">
                        <div class="navbar-item">
                            <div class="buttons">
                                <!-- Upload Campaign button updated to use 'is-rounded' class and keeps its icon -->
                                <a class="button is-danger is-rounded has-text-weight-bold" style="background-color: red; color: white;">
                                    <span class="icon"><i class="fas fa-upload"></i></span>
                                    <span>Upload Campaign</span>
                                </a>
                            </div>
                        </div>
                        <div class="navbar-item">
                            <div class="level is-mobile">
                                <p class="level-item has-text-white mr-3">John Doe</p>
                                <span class="icon is-large has-text-white">
                                    <i class="fas fa-user-circle"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    `;

    // 5. Campaign Detail Modal HTML (Hidden by default)
    const modalHtml = `
        <!-- Campaign Detail Modal -->
        <div id="campaign-modal" class="modal">
            <div class="modal-background" style="background-color: rgba(0, 0, 0, 0.8);"></div>
            <div class="modal-card" style="width: 80%; max-width: 700px; background: #1e1e1e; border-radius: 16px;">
                <header class="modal-card-head" style="background: rgba(30, 30, 30, 0.9); border-bottom: 2px solid red; border-radius: 16px 16px 0 0;">
                    <p class="modal-card-title has-text-white is-4" id="modal-campaign-title">Campaign Details</p>
                    <button class="delete is-large" aria-label="close" id="close-modal-button" style="background: none;"></button>
                </header>
                <section class="modal-card-body" style="padding: 0; background: #2a2a2a;">
                    <!-- Modal Image Preview -->
                    <figure class="image is-4by3">
                        <img id="modal-campaign-image" src="" alt="Campaign Preview" style="object-fit: cover; width: 100%; border-radius: 0;">
                    </figure>
                    
                    <!-- Modal Content Body -->
                    <div class="content p-5 has-text-white">
                        <div class="columns is-multiline">
                            <!-- Status -->
                            <div class="column is-full">
                                <p class="has-text-grey-light is-size-7 mb-1">Status</p>
                                <span class="tag is-large has-text-weight-bold" id="modal-campaign-status-tag" style="border-radius: 4px;">N/A</span>
                            </div>

                            <!-- Dates -->
                            <div class="column is-half">
                                <p class="has-text-grey-light is-size-7 mb-1">Date Uploaded</p>
                                <p class="is-size-6 has-text-weight-bold" id="modal-campaign-uploaded">N/A</p>
                            </div>
                            <div class="column is-half">
                                <p class="has-text-grey-light is-size-7 mb-1">Expiry Date</p>
                                <p class="is-size-6 has-text-weight-bold" id="modal-campaign-expires">N/A</p>
                            </div>

                            <!-- Example URL & Description (Mock Data) -->
                            <div class="column is-full mt-4">
                                <p class="has-text-grey-light is-size-7 mb-1">Campaign URL</p>
                                <a href="javascript:void(0);" onclick="console.log('URL clicked');" class="has-text-info has-text-weight-semibold">
                                    https://example.com/ar-scan/
                                </a>
                            </div>
                            <div class="column is-full mt-2">
                                <p class="has-text-grey-light is-size-7 mb-1">Overlay Title</p>
                                <p class="is-size-6 has-text-weight-bold">Engage Now!</p>
                            </div>
                            <div class="column is-full mt-2">
                                <p class="has-text-grey-light is-size-7 mb-1">Overlay Message</p>
                                <p class="is-size-6">Point your device to unlock an augmented reality experience.</p>
                            </div>

                        </div>
                    </div>
                </section>
                <footer class="modal-card-foot" style="background: #1e1e1e; border-top: 1px solid rgba(255, 255, 255, 0.1); border-radius: 0 0 16px 16px; justify-content: flex-end;">
                    <button class="button is-light is-outlined" id="modal-edit-button">
                        <span class="icon"><i class="fas fa-edit"></i></span>
                        <span>Edit Details</span>
                    </button>
                    <button class="button is-danger is-outlined" id="modal-close-button">Close</button>
                </footer>
            </div>
        </div>
    `;


    // 6. Generate the full dashboard HTML structure (including the modal)
    const dashboardHtml = `
        ${navbarHtml}
        <!-- Content section starts here, background color is black (#000000) -->
        <section class="section is-dark" style="min-height: 100vh; background-color: #000000; padding-top: 3rem;">
            <div class="container is-max-desktop">
                <!-- Top Controls Row -->
                <div class="level">
                    <!-- Search Bar -->
                    <div class="level-left">
                        <div class="field has-addons">
                            <p class="control has-icons-left">
                                <input class="input is-medium is-rounded search-input is-dark" type="search" placeholder="Search campaigns..." style="width: 300px; background-color: black; border: 2px solid red;">
                                <span class="icon is-left has-text-white">
                                    <i class="fas fa-search"></i>
                                </span>
                            </p>
                        </div>
                    </div>

                    <!-- Status and Sort Dropdowns (New Campaign button removed) -->
                    <div class="level-right">
                        <div class="field is-grouped">
                            <!-- Status Dropdown -->
                            <p class="control">
                                <div class="select is-dark is-medium is-rounded">
                                    <select style="background-color: rgba(60, 60, 60, 0.7); border: none; border-radius: 8px;">
                                        <option>All Status</option>
                                        <option>Active</option>
                                        <option>Inactive</option>
                                    </select>
                                </div>
                            </p>
                            <!-- Sort Dropdown -->
                            <p class="control">
                                <div class="select is-dark is-medium is-rounded">
                                    <select style="background-color: rgba(60, 60, 60, 0.7); border: none; border-radius: 8px;">
                                        <option>Newest First</option>
                                        <option>Oldest First</option>
                                        <option>Alphabetical</option>
                                    </select>
                                </div>
                            </p>
                            <!-- Removed the 'New Campaign' button here -->
                        </div>
                    </div>
                </div>

                <!-- Campaign Count -->
                <h2 class="subtitle is-4 has-text-white mt-5">
                    <strong class="has-text-info-light">${campaigns.length}</strong> Campaigns
                </h2>

                <!-- Campaign Grid -->
                <div class="columns is-multiline is-variable is-3 mt-4 is-flex">
                    ${campaignCardsHtml}
                </div>
            </div>
        </section>
    `;
    
    // 7. Create a DOM element, insert the HTML, and return the element.
    const container = document.createElement('div');
    container.id = 'app-content-wrapper'; 
    container.innerHTML = dashboardHtml + modalHtml; // Include both dashboard and modal

    // 8. Setup Event Listeners for interactive elements
    const setupEventListeners = () => {
        const modal = container.querySelector('#campaign-modal') as HTMLElement;

        // Function to open the modal with campaign data
        const openModal = (campaign: Campaign) => {
            if (!modal) return;
            
            // Populate modal content
            const titleEl = container.querySelector('#modal-campaign-title') as HTMLElement;
            const imageEl = container.querySelector('#modal-campaign-image') as HTMLImageElement;
            const uploadedEl = container.querySelector('#modal-campaign-uploaded') as HTMLElement;
            const expiresEl = container.querySelector('#modal-campaign-expires') as HTMLElement;
            const statusTagEl = container.querySelector('#modal-campaign-status-tag') as HTMLElement;

            titleEl.textContent = campaign.title;
            // Set image source and add an error fallback for local files
            imageEl.src = campaign.imageSrc;
            imageEl.onerror = () => { imageEl.src = 'https://placehold.co/600x450/333333/ffffff?text=Image+Error'; };
            uploadedEl.textContent = campaign.uploaded;
            expiresEl.textContent = campaign.expires;
            
            // Update status tag
            const isActive = campaign.status === 'Active';
            statusTagEl.textContent = campaign.status;
            statusTagEl.className = `tag is-large has-text-weight-bold ${isActive ? 'is-success' : 'is-danger'}`;

            modal.classList.add('is-active');
        };

        // Function to close the modal
        const closeModal = () => {
            modal?.classList.remove('is-active');
        };

        // Close modal listeners
        container.querySelector('#close-modal-button')?.addEventListener('click', closeModal);
        container.querySelector('#modal-close-button')?.addEventListener('click', closeModal);
        modal?.querySelector('.modal-background')?.addEventListener('click', closeModal);

        // Edit button in modal listener
        container.querySelector('#modal-edit-button')?.addEventListener('click', () => {
            const title = container.querySelector('#modal-campaign-title')?.textContent;
            console.log(`[ACTION] Editing campaign from Modal: ${title}`);
            closeModal();
        });


        // Handle all clicks on the main content area using event delegation
        container.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;

            // Handle Card Click (Opens Modal)
            const card = target.closest('.campaign-card') as HTMLElement;
            if (card) {
                // Retrieve data attributes directly from the card element
                const campaign: Campaign = {
                    title: card.getAttribute('data-campaign-title') || 'Untitled',
                    uploaded: card.getAttribute('data-campaign-uploaded') || 'N/A',
                    expires: card.getAttribute('data-campaign-expires') || 'N/A',
                    status: (card.getAttribute('data-campaign-status') as 'Active' | 'Inactive') || 'Inactive',
                    imageSrc: card.getAttribute('data-campaign-image') || '',
                };
                openModal(campaign);
            }
            
            // Handle Navbar Upload Button Click
            const uploadButton = target.closest('.navbar-app .button') as HTMLElement;
            if (uploadButton && uploadButton.textContent?.includes('Upload Campaign')) {
                console.log('Upload Campaign button clicked!');
            }
        });
        
        // Removed the create-campaign-btn event listener as the button no longer exists.
    };
    
    // Call the setup function to activate listeners
    setupEventListeners();

    return container;
}