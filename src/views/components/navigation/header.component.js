/**
 * Modiva - Header Component
 * Top header/app bar component
 * @module views/components/navigation/header
 */

import { Logger } from '../../../utils/logger.js';

/**
 * Header Component
 */
export const HeaderComponent = {
    /**
     * Current configuration
     */
    config: {
        title: 'Modiva',
        showBackButton: false,
        backAction: null,
        actions: []
    },

    /**
     * Initialize header
     */
    init() {
        Logger.info('🔼 HeaderComponent: Initializing');
        
        this.render();
        this.attachEventListeners();
    },

    /**
     * Render header
     * @param {object} config - Header configuration
     */
    render(config = {}) {
        this.config = { ...this.config, ...config };

        const header = document.querySelector('.app-header') || this.createHeader();
        
        header.innerHTML = `
            <div class="flex items-center justify-between px-6 py-4 bg-blue-600 text-white">
                <div class="flex items-center">
                    ${this.config.showBackButton ? `
                        <button class="header-back-btn mr-4" aria-label="Back">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                            </svg>
                        </button>
                    ` : ''}
                    <h1 class="text-xl font-bold">${this.config.title}</h1>
                </div>
                <div class="flex items-center space-x-4">
                    ${this.renderActions()}
                </div>
            </div>
        `;

        this.attachEventListeners();
    },

    /**
     * Create header element
     * @returns {HTMLElement}
     */
    createHeader() {
        const header = document.createElement('div');
        header.className = 'app-header';
        document.querySelector('.app-container')?.prepend(header);
        return header;
    },

    /**
     * Render action buttons
     * @returns {string} - HTML string
     */
    renderActions() {
        return this.config.actions.map(action => `
            <button class="header-action-btn" data-action="${action.id}" aria-label="${action.label}">
                ${this.getActionIcon(action.icon)}
            </button>
        `).join('');
    },

    /**
     * Get action icon
     * @param {string} icon - Icon name
     * @returns {string} - SVG HTML
     */
    getActionIcon(icon) {
        const icons = {
            search: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>',
            
            more: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/></svg>',
            
            filter: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>'
        };

        return icons[icon] || '';
    },

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Back button
        const backBtn = document.querySelector('.header-back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                if (this.config.backAction) {
                    this.config.backAction();
                } else {
                    window.history.back();
                }
            });
        }

        // Action buttons
        const actionBtns = document.querySelectorAll('.header-action-btn');
        actionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const actionId = btn.dataset.action;
                const action = this.config.actions.find(a => a.id === actionId);
                if (action && action.onClick) {
                    action.onClick();
                }
            });
        });
    },

    /**
     * Update title
     * @param {string} title - New title
     */
    updateTitle(title) {
        this.config.title = title;
        const titleElement = document.querySelector('.app-header h1');
        if (titleElement) {
            titleElement.textContent = title;
        }
    },

    /**
     * Show/hide back button
     * @param {boolean} show - Show flag
     */
    setBackButton(show, action = null) {
        this.config.showBackButton = show;
        this.config.backAction = action;
        this.render();
    },

    /**
     * Set actions
     * @param {array} actions - Action buttons
     */
    setActions(actions) {
        this.config.actions = actions;
        this.render();
    },

    /**
     * Show header
     */
    show() {
        const header = document.querySelector('.app-header');
        if (header) {
            header.style.display = 'block';
        }
    },

    /**
     * Hide header
     */
    hide() {
        const header = document.querySelector('.app-header');
        if (header) {
            header.style.display = 'none';
        }
    }
};

export default HeaderComponent;