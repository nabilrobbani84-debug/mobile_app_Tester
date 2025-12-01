/**
 * Modiva - Bottom Navigation Component
 * Bottom tab navigation bar
 * @module views/components/navigation/bottom-nav
 */

import { Logger } from '../../../utils/logger.js';
import { RouteNames } from '../../../config/routes.config.js';
import { analyticsService, EventTypes } from '../../../services/analytics/analytics.service.js';

/**
 * Bottom Navigation Component
 */
export const BottomNavComponent = {
    /**
     * Active tab
     */
    activeTab: 'home',

    /**
     * Navigation items
     */
    navItems: [
        {
            id: 'home',
            label: 'Home',
            icon: 'home',
            screenId: 'homeScreen',
            route: RouteNames.HOME
        },
        {
            id: 'reports',
            label: 'Laporan',
            icon: 'chart-bar',
            screenId: 'reportsScreen',
            route: RouteNames.REPORTS
        },
        {
            id: 'notifications',
            label: 'Notifikasi',
            icon: 'bell',
            screenId: 'notificationsScreen',
            route: RouteNames.NOTIFICATIONS,
            badge: 3
        },
        {
            id: 'profile',
            label: 'Profil',
            icon: 'user',
            screenId: 'profileScreen',
            route: RouteNames.PROFILE
        }
    ],

    /**
     * Initialize bottom navigation
     */
    init() {
        Logger.info('🔽 BottomNavComponent: Initializing');
        
        this.render();
        this.attachEventListeners();
    },

    /**
     * Render bottom navigation
     */
    render() {
        const container = document.querySelector('.bottom-nav');
        
        if (!container) {
            Logger.error('Bottom nav container not found');
            return;
        }

        container.innerHTML = this.navItems.map(item => this.renderNavItem(item)).join('');
        
        // Set initial active tab
        this.setActiveTab(this.activeTab);
    },

    /**
     * Render navigation item
     * @param {object} item - Navigation item
     * @returns {string} - HTML string
     */
    renderNavItem(item) {
        const isActive = item.id === this.activeTab;
        const activeClass = isActive ? 'active' : '';

        return `
            <div class="nav-item ${activeClass}" data-tab="${item.id}" data-screen="${item.screenId}">
                ${item.badge ? `
                    <div class="relative">
                        ${this.getIconSVG(item.icon)}
                        <span class="notification-badge">${item.badge}</span>
                    </div>
                ` : this.getIconSVG(item.icon)}
                <span class="text-xs">${item.label}</span>
            </div>
        `;
    },

    /**
     * Get icon SVG
     * @param {string} icon - Icon name
     * @returns {string} - SVG HTML
     */
    getIconSVG(icon) {
        const icons = {
            home: '<svg class="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/></svg>',
            
            'chart-bar': '<svg class="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/></svg>',
            
            bell: '<svg class="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/></svg>',
            
            user: '<svg class="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/></svg>'
        };

        return icons[icon] || icons.home;
    },

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        const navItems = document.querySelectorAll('.bottom-nav .nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const tabId = item.dataset.tab;
                const screenId = item.dataset.screen;
                
                this.handleTabClick(tabId, screenId, item);
            });
        });
    },

    /**
     * Handle tab click
     * @param {string} tabId - Tab ID
     * @param {string} screenId - Screen ID
     * @param {HTMLElement} element - Nav item element
     */
    handleTabClick(tabId, screenId, element) {
        Logger.info('📱 BottomNavComponent: Tab clicked:', tabId);

        // Set active tab
        this.setActiveTab(tabId);

        // Track analytics
        analyticsService.trackEvent(EventTypes.TAB_CHANGE, {
            tab: tabId,
            screen: screenId
        });

        // Navigate
        this.navigate(screenId);
    },

    /**
     * Set active tab
     * @param {string} tabId - Tab ID
     */
    setActiveTab(tabId) {
        this.activeTab = tabId;

        // Update UI
        const navItems = document.querySelectorAll('.bottom-nav .nav-item');
        navItems.forEach(item => {
            if (item.dataset.tab === tabId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    },

    /**
     * Navigate to screen
     * @param {string} screenId - Screen ID
     */
    navigate(screenId) {
        // Use Navigation module if available
        if (window.Navigation) {
            window.Navigation.navigateTo(screenId);
        }
    },

    /**
     * Update badge count
     * @param {string} tabId - Tab ID
     * @param {number} count - Badge count
     */
    updateBadge(tabId, count) {
        const item = this.navItems.find(item => item.id === tabId);
        if (item) {
            item.badge = count;
        }

        // Update UI
        const badgeElement = document.querySelector(`.nav-item[data-tab="${tabId}"] .notification-badge`);
        if (badgeElement) {
            badgeElement.textContent = count;
            badgeElement.style.display = count > 0 ? 'block' : 'none';
        }
    },

    /**
     * Show bottom navigation
     */
    show() {
        const container = document.querySelector('.bottom-nav');
        if (container) {
            container.classList.add('active');
        }
    },

    /**
     * Hide bottom navigation
     */
    hide() {
        const container = document.querySelector('.bottom-nav');
        if (container) {
            container.classList.remove('active');
        }
    }
};

export default BottomNavComponent;